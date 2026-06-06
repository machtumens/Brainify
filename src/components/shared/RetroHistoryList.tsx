'use client';

// RetroHistoryList — scrollable past retrospectives
// Sprint 5 | WBS 7.4 | US-019 | P22
//
// Fetches GET /api/retrospective on mount.
// Shows newest first, each entry as a card row:
//   date | coverage% | consistency% | velocity | risk | recommendation

import { useEffect, useState } from 'react';
import type { RetrospectiveRow } from '@/types/database';

// ── Styles ────────────────────────────────────────────────────────

const SCROLL_CONTAINER: React.CSSProperties = {
  maxHeight: 360,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const ROW: React.CSSProperties = {
  border: '1px solid var(--line)',
  borderRadius: 11,
  padding: '12px 14px',
  background: 'var(--cream)',
};

const DATE_LABEL: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--ink4)',
  fontVariantNumeric: 'tabular-nums',
  marginBottom: 6,
};

const METRICS_ROW: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 6,
};

const METRIC: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

const METRIC_VALUE: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 300,
  letterSpacing: '-0.5px',
  color: 'var(--ink)',
  fontVariantNumeric: 'tabular-nums',
};

const METRIC_LABEL: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--ink4)',
  fontStyle: 'italic',
};

const RECOMMENDATION: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--ink2)',
  fontStyle: 'italic',
  lineHeight: 1.45,
  marginTop: 4,
};

const RISK_CHIP: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 11,
  color: 'var(--amber)',
  fontStyle: 'italic',
};

// ── Helpers ───────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPct(rate: number | null): string {
  if (rate == null) return '—';
  return `${Math.round(rate * 100)}%`;
}

function velocityColor(trend: string | null): string {
  if (trend === 'improving') return 'var(--green)';
  if (trend === 'declining') return 'var(--red)';
  return 'var(--ink3)';
}

// Extract velocity_trend from content field (stored as pipe-separated summary)
function extractFromContent(
  row: RetrospectiveRow
): { velocity: string; recommendation: string; riskTopic: string } {
  const content = row.content ?? '';
  // content format: "Coverage: X% | Consistency: Y% | Velocity: Z | Risk: R | recommendation"
  const parts = content.split(' | ');
  const velocity = parts[2]?.replace('Velocity: ', '') ?? 'unknown';
  const riskTopic = row.risk_topic ?? parts[3]?.replace('Risk: ', '') ?? '—';
  const recommendation = parts.slice(4).join(' | ') || content;
  return { velocity, recommendation, riskTopic };
}

// ── Component ─────────────────────────────────────────────────────

interface RetroHistoryListProps {
  /** Optional: pass pre-fetched rows to avoid re-fetch */
  initialRows?: RetrospectiveRow[];
}

export default function RetroHistoryList({ initialRows }: RetroHistoryListProps) {
  const [rows, setRows] = useState<RetrospectiveRow[]>(initialRows ?? []);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    initialRows ? 'loaded' : 'loading'
  );

  useEffect(() => {
    if (initialRows) return;
    fetch('/api/retrospective')
      .then((r) => r.json())
      .then((json: { success: boolean; data: RetrospectiveRow[]; error: string }) => {
        if (!json.success) { setStatus('error'); return; }
        setRows(json.data);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, [initialRows]);

  if (status === 'loading') {
    return (
      <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink4)' }}>
        Loading retrospectives…
      </p>
    );
  }

  if (status === 'error') {
    return (
      <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--red)' }}>
        Could not load retrospectives.
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p
        style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink4)' }}
        data-testid="retro-empty"
      >
        No retrospectives yet. The first one runs Sunday 8am.
      </p>
    );
  }

  return (
    <div style={SCROLL_CONTAINER} data-testid="retro-history-list">
      {rows.map((row) => {
        const { velocity, recommendation, riskTopic } = extractFromContent(row);
        return (
          <div key={row.id} style={ROW} data-testid="retro-row">
            <p style={DATE_LABEL}>
              {formatDate(row.created_at)}
              {row.period_type && (
                <span style={{ marginLeft: 8, textTransform: 'capitalize' }}>
                  · {row.period_type}
                </span>
              )}
            </p>

            <div style={METRICS_ROW}>
              <div style={METRIC}>
                <span style={METRIC_VALUE}>{formatPct(row.coverage_rate)}</span>
                <span style={METRIC_LABEL}>coverage</span>
              </div>
              <div style={METRIC}>
                <span style={METRIC_VALUE}>{formatPct(row.consistency_rate)}</span>
                <span style={METRIC_LABEL}>consistency</span>
              </div>
              <div style={METRIC}>
                <span style={{ ...METRIC_VALUE, color: velocityColor(velocity) }}>
                  {velocity}
                </span>
                <span style={METRIC_LABEL}>velocity</span>
              </div>
            </div>

            {riskTopic && riskTopic !== '—' && riskTopic !== 'unknown' && (
              <p style={RISK_CHIP} aria-label={`Risk topic: ${riskTopic}`}>
                at risk: {riskTopic}
              </p>
            )}

            {recommendation && (
              <p style={RECOMMENDATION}>{recommendation}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
