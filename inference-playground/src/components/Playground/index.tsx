import { useState } from 'react';
import type { InputMode } from '../../types/index';
import { useStream } from '../../hooks/useStream';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import { MetricsBar } from './MetricsBar';

export function Playground() {
  const [mode, setMode] = useState<InputMode>('text');
  const { state, startStream, stopStream, reset } = useStream();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          margin: '0 0 6px',
          background: 'linear-gradient(135deg, #494e5c, #c0c7d2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Inference Playground
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
          Test on-device model inference with real-time token streaming
        </p>
      </div>

      {/* Metrics */}
      <MetricsBar metrics={state.metrics} status={state.status} />

      {/* Input */}
      <InputPanel
        mode={mode}
        onModeChange={setMode}
        onSubmit={startStream}
        onStop={stopStream}
        status={state.status}
      />

      {/* Output */}
      <OutputPanel
        output={state.output}
        status={state.status}
        error={state.error}
      />

      {/* Reset */}
      {(state.status === 'done' || state.status === 'error') && (
        <button
          onClick={reset}
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontFamily: 'Syne, sans-serif',
            textDecoration: 'underline',
            padding: '4px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ↺ Reset session
        </button>
      )}
    </div>
  );
}