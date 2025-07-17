const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testEnvironment: 'jest-environment-node',
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx'
  ],
  collectCoverageFrom: [
    'services/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'models/**/*.{ts,tsx}',
    'app/api/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testTimeout: 30000, // 30 seconds for longer-running tests
  verbose: true
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)