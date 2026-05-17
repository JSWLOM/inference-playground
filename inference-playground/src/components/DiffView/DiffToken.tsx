export type TokenType = 'same' | 'added' | 'removed';

interface DiffTokenProps {
  text: string;
  type: TokenType;
}

export function DiffToken({ text, type }: DiffTokenProps) {
  const styles: Record<TokenType, React.CSSProperties> = {
    same: {
      color: 'var(--text-primary)',
    },
    added: {
      background: 'rgba(52,211,153,0.15)',
      color: '#34D399',
      borderRadius: '3px',
      padding: '1px 3px',
      border: '1px solid rgba(52,211,153,0.25)',
    },
    removed: {
      background: 'rgba(248,113,113,0.12)',
      color: '#F87171',
      borderRadius: '3px',
      padding: '1px 3px',
      border: '1px solid rgba(248,113,113,0.2)',
      textDecoration: 'line-through',
    },
  };

  return (
    <span
      style={{ ...styles[type], fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', lineHeight: 2 }}
      aria-label={type !== 'same' ? `${type}: ${text}` : text}
    >
      {text}{' '}
    </span>
  );
}