import type { StreamMetrics, StreamStatus } from '../../types/index';

interface MetricsBarProps {
  metrics: StreamMetrics;
  status: StreamStatus;
}

export function MetricsBar({ metrics, status }: MetricsBarProps) {
  const isActive = status === 'streaming';

  const statusConfig = {
    idle:      { label: 'Ready',      color: 'var(--text-muted)' },
    streaming: { label: 'Streaming',  color: '#34D399' },
    done:      { label: 'Complete',   color: '#60A5FA' },
    error:     { label: 'Error',      color: '#F87171' },
  };
  const s = statusConfig[status];

  return (
    <div
      aria-live="polite"
      aria-label="Stream metrics"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '10px 16px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--bg-border)',
        borderRadius: '10px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
      }}
    >
      {/* Status */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <span style={{
          width: '7px', height: '7px',
          borderRadius: '50%',
          background: s.color,
          animation: isActive ? 'pulse-dot 1.2s infinite' : 'none',
          flexShrink: 0,
        }} />
        <span style={{ color: s.color, fontWeight: 500 }}>{s.label}</span>
      </span>

      <span style={{ color: 'var(--bg-border)' }}>|</span>

      {/* Token Count */}
      <span style={{ color: 'var(--text-secondary)' }}>
        tokens{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {metrics.tokenCount}
        </span>
      </span>

      {/* TPS */}
      {metrics.tokensPerSecond > 0 && (
        <>
          <span style={{ color: 'var(--bg-border)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            speed{' '}
            <span style={{
              fontWeight: 600,
              background: 'var(--sarvam-grad)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {metrics.tokensPerSecond} tok/s
            </span>
          </span>
        </>
      )}
    </div>
  );
}