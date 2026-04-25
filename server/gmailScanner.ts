import { google } from 'googleapis';
import Anthropic from '@anthropic-ai/sdk';
import { encryptKey } from '../src/lib/encryption';
import type { Database } from 'better-sqlite3';

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

export async function fetchBillingEmails(
  accessToken: string,
  refreshToken: string,
  maxResults: number = 200
): Promise<{ subject: string; body: string; date: string }[]> {
  const CLIENT_ID = process.env.VITE_GMAIL_CLIENT_ID;
  const CLIENT_SECRET = process.env.VITE_GMAIL_CLIENT_SECRET;
  const REDIRECT_URI = process.env.VITE_GMAIL_REDIRECT_URI || 'http://localhost:3001/auth/gmail/callback';

  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 12);
  const dateQuery = `newer_than:365d`;
  
  const query = `subject:(receipt OR invoice OR subscription OR "payment confirmation" OR "you've been charged" OR billing) ${dateQuery}`;
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults,
  });

  const messages = response.data.messages || [];
  const results: { subject: string; body: string; date: string }[] = [];

  for (const message of messages) {
    if (!message.id) continue;

    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
      format: 'full',
    });

    const headers = msg.data.payload?.headers || [];
    const subject = headers.find((h) => h.name?.toLowerCase() === 'subject')?.value || '';
    const date = headers.find((h) => h.name?.toLowerCase() === 'date')?.value || '';
    
    let encodedBody = '';
    
    // Find text/plain part
    const findPlainPart = (parts: any[]): any => {
      for (const part of parts) {
        if (part.mimeType === 'text/plain') return part;
        if (part.parts) {
          const found = findPlainPart(part.parts);
          if (found) return found;
        }
      }
      return null;
    };

    if (msg.data.payload?.parts) {
      const plainPart = findPlainPart(msg.data.payload.parts);
      if (plainPart && plainPart.body && plainPart.body.data) {
        encodedBody = plainPart.body.data;
      } else if (msg.data.payload.body && msg.data.payload.body.data) {
        encodedBody = msg.data.payload.body.data; 
      }
    } else if (msg.data.payload?.body?.data) {
      encodedBody = msg.data.payload.body.data;
    }

    let body = '';
    if (encodedBody) {
      body = Buffer.from(encodedBody, 'base64').toString('utf8');
      body = body.slice(0, 500); // 500 max characters chunk for prompt
    }

    if (subject && body) {
      results.push({ subject, body, date });
    }
  }

  return results;
}

export async function parseEmailWithClaude(
  email: { subject: string; body: string; date: string }
): Promise<{
  toolName: string | null;
  cost: number | null;
  billingCycle: string | null;
  category: string | null;
  isAiTool: boolean;
  confidence: number;
} | null> {
  if (!process.env.VITE_ANTHROPIC_API_KEY) return null;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      system: `You are a billing receipt parser. Extract subscription details from emails. Return ONLY valid JSON, no explanation.
If this is not a billing receipt, return null.
JSON shape: {
  toolName: string,
  cost: number (dollars, e.g. 16.00),
  billingCycle: 'monthly' | 'yearly' | 'one_time',
  category: 'productivity'|'design'|'development'|'marketing'|'ai'|'communication'|'finance'|'other',
  isAiTool: boolean,
  confidence: number (0-100, how confident you are this is a real recurring subscription)
}`,
      messages: [
        {
          role: 'user',
          content: `Subject: ${email.subject}\nBody: ${email.body}`
        }
      ]
    });

    const responseText = (response.content[0] as any).text.trim();
    if (responseText === 'null' || responseText === '') return null;

    const parsed = JSON.parse(responseText);
    
    if (
      !parsed.toolName ||
      typeof parsed.cost !== 'number' ||
      !['monthly', 'yearly', 'one_time'].includes(parsed.billingCycle) ||
      !Object.hasOwn(parsed, 'confidence') ||
      parsed.confidence < 40
    ) {
      return null;
    }

    return {
      toolName: parsed.toolName,
      cost: parsed.cost,
      billingCycle: parsed.billingCycle,
      category: parsed.category || 'other',
      isAiTool: !!parsed.isAiTool,
      confidence: parsed.confidence,
    };
  } catch (err) {
    console.error('Claude parse error', err);
    return null;
  }
}

export async function scanGmailInbox(
  connection: { id: string, accessToken: string, refreshToken: string, userId: string },
  dbApi: {
    toolExists: (name: string) => boolean;
    pendingExists: (name: string) => boolean;
    insertDiscoveredSub: (sub: any) => void;
    updateScanStatus: (count: number) => void;
  }
): Promise<{ found: number; errors: string[] }> {
  try {
    const emails = await fetchBillingEmails(connection.accessToken, connection.refreshToken, 250);
    const estimatedCost = emails.length * 0.001;
    
    let processEmails = emails;
    if (estimatedCost > 0.50) {
      console.warn('Large inbox — processing first 500 emails only');
      processEmails = emails.slice(0, 500);
    }

    let foundCount = 0;
    
    for (let i = 0; i < processEmails.length; i += 10) {
      const batch = processEmails.slice(i, i + 10);
      
      const batchPromises = batch.map(async (email) => {
        const result = await parseEmailWithClaude(email);
        if (result && result.confidence >= 40) {
          const alreadyTool = dbApi.toolExists(result.toolName!);
          const alreadyPending = dbApi.pendingExists(result.toolName!);

          if (!alreadyTool && !alreadyPending) {
            dbApi.insertDiscoveredSub({
              id: crypto.randomUUID(),
              userId: connection.userId,
              toolName: result.toolName,
              cost: Math.round((result.cost || 0) * 100),
              billingCycle: result.billingCycle,
              category: result.category,
              isAiTool: result.isAiTool,
              sourceEmail: email.subject,
              confidence: result.confidence,
              status: 'pending',
              createdAt: new Date().toISOString()
            });
            foundCount++;
          }
        }
      });
      
      await Promise.all(batchPromises);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    dbApi.updateScanStatus(foundCount);
    return { found: foundCount, errors: [] };
  } catch (error: any) {
    console.error('Scan error:', error);
    return { found: 0, errors: [error.message] };
  }
}
