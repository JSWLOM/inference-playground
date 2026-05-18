// Yeh function ek fake ReadableStream return karta hai
// Real project mein yahan actual API call hogi

const MOCK_RESPONSES = [
  "Large language models work by predicting the next token based on context. They are trained on vast amounts of text data using transformer architecture. The attention mechanism allows them to understand relationships between words across long sequences. Fine-tuning helps adapt these models to specific tasks efficiently.",
  "On-device inference means running AI models directly on hardware without sending data to the cloud. This improves privacy, reduces latency, and works offline. The challenge is optimizing models to run efficiently on limited hardware resources.",
  "React hooks allow you to use state and lifecycle features in functional components. useState manages local state, useEffect handles side effects, and custom hooks let you extract and reuse stateful logic across components.",
];

export function createMockStream(_prompt: string): ReadableStream<Uint8Array> {
  const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  const words = response.split(' ');
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        // Random chance of simulating a network error (5%)
        if (Math.random() < 0.05) {
          controller.error(new Error('Network timeout: stream interrupted'));
          return;
        }

        const token = (i === 0 ? '' : ' ') + words[i];
        controller.enqueue(encoder.encode(token));

        // Simulate realistic token delay (50-150ms)
        await new Promise(res => setTimeout(res, 50 + Math.random() * 100));
      }
      controller.close();
    },
  });
}