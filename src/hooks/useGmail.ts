import { useState, useCallback, useEffect } from 'react';
import { useTools } from './useTools';
import type { BillingCycle, ToolCategory } from '@/types';

export interface GmailConnection {
  id: string;
  email: string;
  lastScannedAt: string | null;
  totalFound: number;
}

export interface DiscoveredSub {
  id: string;
  userId: string;
  toolName: string;
  cost: number;
  billingCycle: string;
  category: string;
  isAiTool: boolean;
  sourceEmail: string;
  confidence: number;
  status: 'pending' | 'confirmed' | 'dismissed';
  createdAt: string;
}

export function useGmail() {
  const [connection, setConnection] = useState<GmailConnection | null>(null);
  const [pendingSubs, setPendingSubs] = useState<DiscoveredSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const { addTool } = useTools();

  const fetchConnection = useCallback(async () => {
    try {
      const res = await fetch('/api/gmail/connection');
      if (res.ok) {
        const data = await res.json();
        setConnection(data);
      }
    } catch (err) {
      console.error('Failed to fetch gmail connection', err);
    }
  }, []);

  const fetchPendingSubs = useCallback(async () => {
    try {
      const res = await fetch('/api/gmail/pending');
      if (res.ok) {
        const data = await res.json();
        setPendingSubs(data);
      }
    } catch (err) {
      console.error('Failed to fetch pending subs', err);
    }
  }, []);

  const refreshFiles = useCallback(async () => {
    setLoading(true);
    await fetchConnection();
    await fetchPendingSubs();
    setLoading(false);
  }, [fetchConnection, fetchPendingSubs]);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const connectGmail = useCallback(() => {
    window.location.href = '/auth/gmail';
  }, []);

  const disconnectGmail = useCallback(async () => {
    try {
      const res = await fetch('/auth/gmail/disconnect', { method: 'POST' });
      if (res.ok) {
        setConnection(null);
        setPendingSubs([]);
      }
    } catch (err) {
      console.error('Failed to disconnect gmail', err);
    }
  }, []);

  const rescan = useCallback(async () => {
    if (!connection) return;
    setScanning(true);
    try {
      const res = await fetch('/api/gmail/rescan', { method: 'POST' });
      if (res.ok) {
        await fetchPendingSubs();
      }
    } catch (err) {
      console.error('Failed to rescan', err);
    } finally {
      setScanning(false);
    }
  }, [connection, fetchPendingSubs]);

  const confirmSub = useCallback(async (id: string) => {
    const sub = pendingSubs.find((s) => s.id === id);
    if (!sub) return;

    try {
      await addTool({
        toolName: sub.toolName,
        cost: sub.cost / 100, // ToolFormInput expects dollars
        billingCycle: sub.billingCycle as BillingCycle,
        renewalDate: new Date().toISOString(), // Fallback
        category: sub.category as ToolCategory,
        isAiTool: sub.isAiTool,
        status: 'active',
      });

      await fetch(`/api/gmail/confirm/${id}`, { method: 'POST' });
      setPendingSubs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to confirm sub', err);
    }
  }, [pendingSubs, addTool]);

  const dismissSub = useCallback(async (id: string) => {
    try {
      await fetch(`/api/gmail/dismiss/${id}`, { method: 'POST' });
      setPendingSubs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to dismiss sub', err);
    }
  }, []);

  const confirmAll = useCallback(async () => {
    for (const sub of pendingSubs) {
      await confirmSub(sub.id);
    }
  }, [pendingSubs, confirmSub]);

  const dismissAll = useCallback(async () => {
    for (const sub of pendingSubs) {
      await dismissSub(sub.id);
    }
  }, [pendingSubs, dismissSub]);

  return {
    connection,
    pendingSubs,
    loading,
    scanning,
    connectGmail,
    disconnectGmail,
    rescan,
    confirmSub,
    dismissSub,
    confirmAll,
    dismissAll,
  };
}
