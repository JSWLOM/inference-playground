import { useState, useRef } from 'react';
import type { InputMode, StreamStatus } from '../../types/index';
import { Toggle } from '../ui/Toggle';

interface InputPanelProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  onSubmit: (prompt: string) => void;
  onStop: () => void;
  status: StreamStatus;
}

export function InputPanel({ mode, onModeChange, onSubmit, onStop, status }: InputPanelProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioPrompt, setAudioPrompt] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isStreaming = status === 'streaming';

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setAudioPrompt('');
      recorder.ondataavailable = () => {
        setAudioPrompt('Audio recorded: "What is on-device inference?"');
      };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        setIsRecording(false);
      };
      recorder.start();
    } catch {
      setAudioPrompt('Microphone access denied.');
    }
  };

  const stopRecording = () => mediaRecorderRef.current?.stop();

  const handleSubmit = () => {
    const prompt = mode === 'text' ? text.trim() : audioPrompt.trim();
    if (!prompt) return;
    onSubmit(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const isDisabled = !isStreaming && (mode === 'text' ? !text.trim() : !audioPrompt.trim());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Toggle mode={mode} onChange={onModeChange} />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {mode === 'text' ? '↵ submit · ⇧↵ newline' : 'record prompt'}
        </span>
      </div>

      {/* Text input */}
      {mode === 'text' && (
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your prompt..."
          aria-label="Text prompt input"
          rows={4}
          disabled={isStreaming}
          style={{
            width: '100%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            borderRadius: '10px',
            padding: '14px 16px',
            color: 'var(--text-primary)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            resize: 'none',
            outline: 'none',
            transition: 'border-color 0.2s',
            lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,0.6)'}
          onBlur={e => e.target.style.borderColor = 'var(--bg-border)'}
        />
      )}

      {/* Audio input */}
      {mode === 'audio' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          padding: '32px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--bg-border)',
          borderRadius: '10px',
        }}>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            disabled={isStreaming}
            style={{
              width: '64px', height: '64px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              background: isRecording
                ? 'linear-gradient(135deg, #DC2626, #EF4444)'
                : 'linear-gradient(135deg, #2563EB, #7C3AED)',
              boxShadow: isRecording
                ? '0 0 24px rgba(220,38,38,0.4)'
                : '0 0 24px rgba(37,99,235,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {isRecording ? 'Recording... click to stop' : 'Click to record'}
          </span>
          {audioPrompt && (
            <span style={{ fontSize: '12px', color: '#34D399', fontFamily: 'JetBrains Mono, monospace' }}>
              ✓ {audioPrompt}
            </span>
          )}
        </div>
      )}

      {/* Submit / Stop */}
      <button
        onClick={isStreaming ? onStop : handleSubmit}
        disabled={isDisabled}
        aria-label={isStreaming ? 'Stop generation' : 'Submit prompt'}
        style={{
          width: '100%',
          padding: '13px',
          borderRadius: '10px',
          border: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'Syne, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.3px',
          opacity: isDisabled ? 0.4 : 1,
          background: isStreaming
            ? 'linear-gradient(135deg, #DC2626, #EF4444)'
            : 'linear-gradient(135deg, #2563EB, #7C3AED, #F97316)',
          color: '#fff',
          boxShadow: isDisabled ? 'none' : '0 4px 20px rgba(37,99,235,0.25)',
          transition: 'all 0.2s',
        }}
      >
        {isStreaming ? '⏹ Stop Generation' : '▶ Run Inference'}
      </button>
    </div>
  );
}
