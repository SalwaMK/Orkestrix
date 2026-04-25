/*
 * BEFORE RUNNING:
 * 1. Go to console.cloud.google.com
 * 2. Enable Gmail API on your project
 * 3. Add OAuth scope: https://www.googleapis.com/auth/gmail.readonly
 * 4. Add to .env.local:
 *    VITE_GMAIL_CLIENT_ID=
 *    VITE_GMAIL_CLIENT_SECRET=
 *    VITE_GMAIL_REDIRECT_URI=http://localhost:3001/auth/gmail/callback
 *    VITE_ANTHROPIC_API_KEY=
 */

import { google } from 'googleapis';
import { randomBytes } from 'crypto';

function getOAuth2Client() {
  const CLIENT_ID = process.env.VITE_GMAIL_CLIENT_ID;
  const CLIENT_SECRET = process.env.VITE_GMAIL_CLIENT_SECRET;
  const REDIRECT_URI = process.env.VITE_GMAIL_REDIRECT_URI || 'http://localhost:3001/auth/gmail/callback';

  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

export function generateAuthUrl(): string {
  const oauth2Client = getOAuth2Client();
  const state = randomBytes(16).toString('hex');

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Requires refresh_token
    prompt: 'consent', // Force consent screen to get refresh_token
    scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/userinfo.email'],
    state,
  });

  return authorizeUrl;
}

export async function authorizeCallback(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  email: string;
}> {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  
  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error('Missing tokens from Google response');
  }

  oauth2Client.setCredentials(tokens);

  // Get user details
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    email: userInfo.data.email || 'unknown@gmail.com',
  };
}
