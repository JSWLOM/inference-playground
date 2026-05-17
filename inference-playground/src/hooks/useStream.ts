import { useState, useRef, useCallback } from 'react';
import type { StreamState, StreamMetrics, StreamStatus } from '../types/index';
import { createMockStream } from '../utils/mockStream';

const initialMetrics: StreamMetrics = {
  tokenCount: 0,
  tokensPerSecond: 0,
  startTime: null,
};

const initialState: StreamState = {
  output: '',
  status: 'idle' as StreamStatus,
  error: null,
  metrics: initialMetrics,
};

export function useStream() {
  const [state, setState] = useState<StreamState>(initialState);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const startStream = useCallback(async (prompt: string) => {
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current = null;
    }

    setState({
      output: '',
      status: 'streaming',
      error: null,
      metrics: { tokenCount: 0, tokensPerSecond: 0, startTime: Date.now() },
    });

    try {
      const stream = createMockStream(prompt);
      const reader = stream.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();

      let tokenCount = 0;
      const startTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setState(prev => ({ ...prev, status: 'done' }));
          readerRef.current = null;
          break;
        }

        const token = decoder.decode(value, { stream: true });
        tokenCount++;
        const elapsed = (Date.now() - startTime) / 1000;
        const tps = elapsed > 0 ? Math.round(tokenCount / elapsed) : 0;

        setState(prev => ({
          ...prev,
          output: prev.output + token,
          metrics: {
            tokenCount,
            tokensPerSecond: tps,
            startTime,
          },
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
      readerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(async () => {
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current = null;
      setState(prev => ({ ...prev, status: 'done' }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return { state, startStream, stopStream, reset };
}