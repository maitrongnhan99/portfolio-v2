import { vi } from 'vitest';

export default class OpenAI {
  embeddings = {
    create: vi.fn().mockResolvedValue({
      data: [
        {
          embedding: Array(1536).fill(0).map(() => Math.random() * 2 - 1),
          index: 0,
          object: 'embedding'
        }
      ],
      model: 'text-embedding-3-small',
      object: 'list',
      usage: {
        prompt_tokens: 10,
        total_tokens: 10
      }
    })
  };

  chat = {
    completions: {
      create: vi.fn().mockResolvedValue({
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4o-mini',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Mock OpenAI response'
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      })
    }
  };

  constructor(config?: any) {
    // Mock constructor
  }
}
