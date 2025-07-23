import { vi, beforeAll, afterAll, expect } from 'vitest';
import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.test') });

// Set test environment variables
// Use Object.defineProperty to set NODE_ENV
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
  enumerable: true,
  configurable: true
});
process.env.GEMINI_API_KEY = 'test-gemini-api-key';
process.env.MONGODB_CONNECTION_STRING = 'mongodb://test-connection';

// Mock console methods to reduce test output noise
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Only show console output if VERBOSE_TESTS is set
  if (!process.env.VERBOSE_TESTS) {
    console.log = vi.fn();
    console.warn = vi.fn();
    // Keep error logs for debugging
    console.error = vi.fn();
  }
});

afterAll(() => {
  // Restore original console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global error handler for unhandled rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Extend Vitest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
  toBeValidEmbedding(received: number[]) {
    const pass = Array.isArray(received) && 
                 received.length === 768 && 
                 received.every(val => typeof val === 'number' && !isNaN(val));
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid embedding`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid 768-dimension embedding`,
        pass: false,
      };
    }
  },
  toHaveValidScore(received: any) {
    const pass = typeof received.score === 'number' && 
                 received.score >= 0 && 
                 received.score <= 1;
    if (pass) {
      return {
        message: () => `expected ${received} not to have a valid score`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to have a valid score between 0 and 1`,
        pass: false,
      };
    }
  }
});

// TypeScript declaration for custom matchers
declare global {
  namespace vi {
    interface Assertion<T = any> {
      toBeWithinRange(floor: number, ceiling: number): void;
      toBeValidEmbedding(): void;
      toHaveValidScore(): void;
    }
    interface AsymmetricMatchersContaining {
      toBeWithinRange(floor: number, ceiling: number): any;
      toBeValidEmbedding(): any;
      toHaveValidScore(): any;
    }
  }
}