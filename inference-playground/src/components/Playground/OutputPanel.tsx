import type { StreamStatus } from '../../types/index';

interface OutputPanelProps {
  output: string;
  status: StreamStatus;
  error: string | null;
}

export function OutputPanel({ output, status, error }: OutputPanelProps) {
  return (
    <div style={{
      minHeight: '180px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--bg-border)',
      borderRadius: '10px',
      padding: '20px',
      position: 'relative',
    }}>
      {/* Label */}
      <div style={{
        fontSize: '11px',
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--text-muted)',
        marginBottom: '12px',
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
      }}>
        output
      </div>

      {/* Empty state */}
      {!output && status === 'idle' && (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
          Tokens will stream here in real time...
        </p>
      )}

      {/* Output text */}
      {output && (
        <p
          aria-live="polite"
          style={{
            color: 'var(--text-primary)',
            fontSize: '14px',
            lineHeight: 1.8,
            fontFamily: 'JetBrains Mono, monospace',
            whiteSpace: 'pre-wrap',
            margin: 0,
          }}
        >
          {output}
          {status === 'streaming' && <span className="cursor-blink" />}
        </p>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            marginTop: '16px',
            padding: '12px 14px',
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: '8px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <span>⚠</span>
          <div>
            <p style={{ color: '#FCA5A5', fontWeight: 600, fontSize: '13px', margin: '0 0 4px' }}>
              Stream interrupted
            </p>
            <p style={{ color: '#F87171', fontSize: '12px', margin: '0 0 4px', fontFamily: 'JetBrains Mono, monospace' }}>
              {error}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>
              Partial output preserved above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}