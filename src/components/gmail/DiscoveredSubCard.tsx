import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import type { DiscoveredSub } from '@/hooks/useGmail';

interface DiscoveredSubCardProps {
  sub: DiscoveredSub;
  onConfirm: (id: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
}

export function DiscoveredSubCard({ sub, onConfirm, onDismiss }: DiscoveredSubCardProps) {
  const [fading, setFading] = useState(false);

  const handleConfirm = async () => {
    setFading(true);
    await onConfirm(sub.id);
  };

  const handleDismiss = async () => {
    setFading(true);
    await onDismiss(sub.id);
  };

  let pillColor = '#ef4444'; // Red
  let pillBg = 'rgba(239, 68, 68, 0.1)';
  if (sub.confidence >= 80) {
    pillColor = '#4ade80'; // Green
    pillBg = 'rgba(74, 222, 128, 0.1)';
  } else if (sub.confidence >= 60) {
    pillColor = '#fbbf24'; // Amber
    pillBg = 'rgba(251, 191, 36, 0.1)';
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'opacity 0.2s',
        opacity: fading ? 0 : 1,
      }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h3 style={{ margin: 0, color: '#f3fbfb', fontSize: '1.2rem', fontWeight: 600 }}>
            {sub.toolName}
          </h3>
          <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: 'rgba(219,243,244,0.6)' }}>
            {sub.category}
          </span>
          {sub.isAiTool && (
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 999, background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
              AI Tool
            </span>
          )}
        </div>
        
        <div style={{ fontSize: '0.8rem', color: 'rgba(219,243,244,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          From: "{sub.sourceEmail}"
        </div>
      </div>

      <div style={{ paddingRight: 32, flexShrink: 0, minWidth: 120 }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f3fbfb' }}>
          {formatCurrency(sub.cost)}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(219,243,244,0.6)' }}>
          {sub.billingCycle}
        </div>
      </div>

      <div style={{ paddingRight: 32, flexShrink: 0 }}>
        <div style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 999, background: pillBg, color: pillColor, border: `1px solid ${pillBg}`, textAlign: 'center', fontWeight: 600 }}>
          {sub.confidence}% Certain
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        <button
          onClick={handleConfirm}
          className="hover:scale-105 transition-transform"
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(22,163,74,0.2))',
            border: '1px solid rgba(74,222,128,0.4)',
            color: '#4ade80',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Add to stack
        </button>
        <button
          onClick={handleDismiss}
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(219,243,244,0.6)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'color 0.15s, border-color 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#f3fbfb';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(219,243,244,0.6)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
