export type InputMode = 'text' | 'audio';

export type StreamStatus =
  | 'idle'
  | 'streaming'
  | 'done'
  | 'error';

export interface StreamMetrics {
  tokenCount: number;
  tokensPerSecond: number;
  startTime: number | null;
}

export interface StreamState {
  output: string;
  status: StreamStatus;
  error: string | null;
  metrics: StreamMetrics;
}