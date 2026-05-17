import  type { InputMode } from '../../types/index';

interface ToggleProps {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
}

export function Toggle({ mode, onChange }: ToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Input mode selector"
      style={{
        display: 'inline-flex',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--bg-border)',
        borderRadius: '8px',
        padding: '3px',
        gap: '2px',
      }}
    >
      {(['text', 'audio'] as InputMode[]).map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={mode === m}
          tabIndex={0}
          onClick={() => onChange(m)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(m); }}
          style={{
            padding: '6px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 500,
            transition: 'all 0.2s',
            background: mode === m
              ? 'linear-gradient(135deg, #2563EB, #7C3AED)'
              : 'transparent',
            color: mode === m ? '#fff' : 'var(--text-secondary)',
            boxShadow: mode === m ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
          }}
        >
          {m === 'text' ? '⌨ Text' : '🎤 Audio'}
        </button>
      ))}
    </div>
  );
}