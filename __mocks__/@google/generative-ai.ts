import { vi } from 'vitest';

export const GoogleGenerativeAI = vi.fn().mockImplementation(() => ({
  getGenerativeModel: vi.fn().mockReturnValue({
    embedContent: vi.fn().mockResolvedValue({
      embedding: {
        values: Array(768).fill(0).map(() => Math.random() * 2 - 1)
      }
    }),
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: () => 'Mock response',
        candidates: [{
          content: {
            parts: [{ text: 'Mock response' }]
          }
        }]
      }
    })
  })
}));