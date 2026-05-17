import { useState } from 'react';
import { DiffToken } from './DiffToken';
import type { TokenType } from './DiffToken';
import { computeDiff } from '../../utils/diff';

export interface DiffToken_ {
  text: string;
  type: TokenType;
}

function DiffPanel({ label, tokens, modelTag, side }: {
  label: string;
  tokens: DiffToken_[];
  modelTag: string;
  side: 'left' | 'right';
}) {
  const accentColor = side === 'left' ? '#60A5FA' : '#F97316';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--bg-border)',
        borderRadius: '8px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: accentColor }}>
          {label}
        </span>
        <span style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '20px',
          background: `${accentColor}18`,
          color: accentColor,
          fontFamily: 'JetBrains Mono, monospace',
          border: `1px solid ${accentColor}30`,
        }}>
          {modelTag}
        </span>
      </div>

      <div
        aria-label={`${label} output`}
        style={{
          minHeight: '140px',
          padding: '16px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-border)',
          borderRadius: '8px',
          lineHeight: 2,
        }}
      >
        {tokens.length === 0
          ? <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
              Output will appear here...
            </span>
          : tokens.map((tok, i) => (
              <DiffToken key={i} text={tok.text} type={tok.type} />
            ))
        }
      </div>
    </div>
  );
}

export function DiffView() {
  const [prompt, setPrompt]     = useState('');
  const [v1Output, setV1Output] = useState('');
  const [v2Output, setV2Output] = useState('');
  const [leftTokens, setLeftTokens]   = useState<DiffToken_[]>([]);
  const [rightTokens, setRightTokens] = useState<DiffToken_[]>([]);
  const [hasCompared, setHasCompared] = useState(false);

  const handleCompare = () => {
    if (!v1Output.trim() || !v2Output.trim()) return;
    const { left, right } = computeDiff(v1Output, v2Output);
    setLeftTokens(left);
    setRightTokens(right);
    setHasCompared(true);
  };

  const handleReset = () => {
    setPrompt(''); setV1Output(''); setV2Output('');
    setLeftTokens([]); setRightTokens([]);
    setHasCompared(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--bg-border)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: 'var(--text-primary)',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: '26px', fontWeight: 800, margin: '0 0 6px',
          background: 'linear-gradient(135deg, #343740, #dbdee3)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Model Output Diff
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
          Token-level comparison between two model versions
        </p>
      </div>

      {/* Prompt */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Prompt
        </label>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter the shared prompt for both models..."
          style={{ ...inputStyle, padding: '11px 14px' }}
          onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,0.6)'}
          onBlur={e => e.target.style.borderColor = 'var(--bg-border)'}
        />
      </div>

      {/* Two outputs side by side */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Model V1 Output', value: v1Output, setter: setV1Output, placeholder: 'Paste V1 output here...' },
          { label: 'Model V2 Output', value: v2Output, setter: setV2Output, placeholder: 'Paste V2 output here...' },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label} style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {label}
            </label>
            <textarea
              rows={5}
              value={value}
              onChange={e => setter(e.target.value)}
              placeholder={placeholder}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,0.6)'}
              onBlur={e => e.target.style.borderColor = 'var(--bg-border)'}
            />
          </div>
        ))}
      </div>

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={!v1Output.trim() || !v2Output.trim()}
        style={{
          width: '100%', padding: '13px', borderRadius: '10px',
          border: 'none', cursor: (!v1Output.trim() || !v2Output.trim()) ? 'not-allowed' : 'pointer',
          fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 600,
          opacity: (!v1Output.trim() || !v2Output.trim()) ? 0.4 : 1,
          background: 'linear-gradient(135deg, #2563EB, #7C3AED, #F97316)',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(37,99,235,0.2)',
          transition: 'all 0.2s',
        }}
      >
        ⚡ Compare Outputs
      </button>

      {/* Diff Result */}
      {hasCompared && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="fade-up">
          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
            {[
              { color: '#34D399', bg: 'rgba(52,211,153,0.1)', label: 'Added in V2' },
              { color: '#F87171', bg: 'rgba(248,113,113,0.1)', label: 'Removed from V1' },
              { color: 'var(--text-muted)', bg: 'var(--bg-elevated)', label: 'Unchanged' },
            ].map(({ color, bg, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: bg, border: `1px solid ${color}40`, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>

          {/* Panels */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <DiffPanel label="Model V1" tokens={leftTokens} modelTag="v1.0" side="left" />
            <DiffPanel label="Model V2" tokens={rightTokens} modelTag="v2.0" side="right" />
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            style={{
              alignSelf: 'flex-end', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted)',
              fontFamily: 'Syne, sans-serif', textDecoration: 'underline',
            }}
          >
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  );
}