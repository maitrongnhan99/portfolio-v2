# RAG AI Assistant Test Suite

This directory contains comprehensive tests for the RAG (Retrieval-Augmented Generation) AI Assistant system.

## Test Structure

```
tests/
├── setup.ts                 # Test configuration and global setup
├── utils/                   # Test utilities and mocks
│   ├── testUtils.ts        # Helper functions and data generators
│   └── mockServices.ts     # Mock implementations for testing
├── services/               # Unit tests for core services
│   ├── embeddingService.test.ts
│   ├── smartRetriever.test.ts
│   └── vectorStore.test.ts
├── api/                    # Integration tests for API routes
│   └── chatApi.test.ts
├── performance/            # Performance and load testing
│   └── performance.test.ts
├── e2e/                    # End-to-end pipeline tests
│   └── ragPipeline.test.ts
├── load/                   # Load testing and stress tests
│   └── loadTest.test.ts
└── README.md              # This file
```

## Test Categories

### Unit Tests (`tests/services/`)
Tests individual components in isolation with mocked dependencies.

- **EmbeddingService**: Text embedding generation, batch processing, similarity calculations
- **SmartRetriever**: Query intent detection, retrieval logic, reranking algorithms
- **VectorStore**: Database operations, vector search, category filtering

### Integration Tests (`tests/api/`)
Tests the complete API endpoints with realistic data flow.

- **Chat API**: Full request/response cycle testing
- **Error Handling**: Graceful degradation and fallback mechanisms
- **Data Validation**: Input sanitization and response formatting

### Performance Tests (`tests/performance/`)
Validates system performance under various conditions.

- **Response Time**: Individual query performance (<2 seconds)
- **Concurrent Requests**: Multiple simultaneous queries
- **Throughput**: Requests per second benchmarks
- **Resource Usage**: Memory and CPU monitoring

### End-to-End Tests (`tests/e2e/`)
Tests the complete RAG pipeline from knowledge ingestion to response generation.

- **Knowledge Ingestion**: Document processing and embedding storage
- **Query Processing**: Intent detection and retrieval
- **Response Generation**: Context-aware AI responses
- **Data Integrity**: Consistent data flow through the pipeline

### Load Tests (`tests/load/`)
Stress testing and resource exhaustion scenarios.

- **High Volume**: 50+ concurrent requests
- **Sustained Load**: Long-duration performance testing
- **Burst Traffic**: Spike handling capabilities
- **Failure Recovery**: Resilience under adverse conditions

## Running Tests

### All Tests
```bash
pnpm test
```

### Specific Test Categories
```bash
# Unit tests only
pnpm test:unit

# Integration tests only  
pnpm test:integration

# Performance tests only
pnpm test:performance

# End-to-end tests only
pnpm test:e2e
```

### Development Workflow
```bash
# Watch mode for development
pnpm test:watch

# Coverage report
pnpm test:coverage

# Verbose output for debugging
pnpm test:verbose

# CI-friendly run
pnpm test:ci
```

## Test Configuration

### Environment Variables
Tests use `.env.test` for configuration:

```bash
NODE_ENV=test
GEMINI_API_KEY=test-gemini-api-key
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/test-portfolio
TEST_TIMEOUT=30000
VERBOSE_TESTS=false
```

### Mock Services
The test suite includes sophisticated mocks for external dependencies:

- **MockEmbeddingService**: Deterministic embedding generation
- **MockGeminiAI**: Simulated AI responses
- **MockMongoDB**: In-memory database for testing
- **MockPerformanceMonitor**: Performance tracking utilities

### Test Data
Test utilities generate realistic data:

- **Knowledge Chunks**: Sample portfolio content
- **Embeddings**: Deterministic vector representations
- **Query Patterns**: Categorized test queries
- **Performance Scenarios**: Load testing patterns

## Coverage Requirements

The test suite maintains high coverage standards:

- **Branches**: 70% minimum
- **Functions**: 70% minimum  
- **Lines**: 70% minimum
- **Statements**: 70% minimum

### Coverage Reports
```bash
# Generate coverage report
pnpm test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

## Performance Benchmarks

### Response Time Targets
- **Simple Queries**: < 1 second
- **Complex Queries**: < 2 seconds  
- **Concurrent Requests**: < 5 seconds total
- **Database Operations**: < 1 second

### Throughput Targets
- **Minimum**: 2 requests/second
- **Target**: 5 requests/second
- **Concurrent**: 50 simultaneous requests
- **Success Rate**: 90% under load

### Memory Limits
- **Baseline Usage**: < 100MB
- **Under Load**: < 200MB
- **Memory Leaks**: < 50MB increase over time

## Test Utilities

### Data Generators
```typescript
// Generate mock embeddings
const embedding = generateMockEmbedding(768, seed);

// Generate test knowledge chunks
const chunks = generateMockKnowledgeChunks(10);

// Generate performance test queries
const queries = generatePerformanceTestQueries(50);
```

### Mock Services
```typescript
// Mock embedding service
const mockService = new MockEmbeddingService();

// Mock with custom behavior
const failingService = new MockEmbeddingService({ 
  shouldFailAfterCalls: 3 
});

// Performance monitoring
const monitor = new MockPerformanceMonitor();
monitor.mark('start');
// ... perform operation
const duration = monitor.measure('operation', 'start');
```

### Environment Helpers
```typescript
// Mock environment variables
const restore = mockEnvironment({
  GEMINI_API_KEY: 'test-key'
});

// ... run tests

restore(); // Restore original environment
```

## Debugging Tests

### Verbose Output
```bash
VERBOSE_TESTS=1 pnpm test --verbose
```

### Individual Test Files
```bash
# Run specific test file
pnpm test tests/services/embeddingService.test.ts

# Run with debugging
node --inspect-brk node_modules/.bin/jest tests/services/embeddingService.test.ts
```

### Performance Debugging
```bash
# Enable performance logging
VERBOSE_TESTS=1 pnpm test:performance

# Monitor resource usage
node --max-old-space-size=4096 node_modules/.bin/jest tests/performance/
```

## Continuous Integration

### GitHub Actions
Tests run automatically on:
- **Push to main/develop**
- **Pull requests**
- **Scheduled runs** (daily)

### Quality Gates
- All tests must pass
- Coverage thresholds must be met
- Security audit must pass
- Performance benchmarks must be within limits

### Test Matrix
Tests run on:
- **Node.js**: 18.x, 20.x
- **MongoDB**: 7.0
- **Operating Systems**: Ubuntu Latest

## Best Practices

### Writing Tests
1. **Descriptive Names**: Use clear, specific test descriptions
2. **Single Responsibility**: One assertion per test when possible
3. **Mock External Dependencies**: Keep tests isolated and fast
4. **Clean Up**: Reset state between tests
5. **Performance Aware**: Consider test execution time

### Test Organization
1. **Group Related Tests**: Use describe blocks effectively
2. **Setup/Teardown**: Use beforeEach/afterEach for common setup
3. **Test Data**: Keep test data close to tests that use it
4. **Reusable Utilities**: Extract common patterns to utils

### Performance Testing
1. **Realistic Loads**: Test with realistic data volumes
2. **Monitor Resources**: Track memory and CPU usage
3. **Set Baselines**: Establish performance benchmarks
4. **Regression Detection**: Alert on performance degradation

## Troubleshooting

### Common Issues

**MongoDB Connection Errors**
```bash
# Start local MongoDB
mongod --dbpath ./data/db

# Or use Docker
docker run -d -p 27017:27017 mongo:7.0
```

**Memory Issues**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 node_modules/.bin/jest

# Force garbage collection
node --expose-gc node_modules/.bin/jest
```

**Timeout Issues**
```bash
# Increase test timeout
jest --testTimeout=60000

# Or set in jest.config.js
testTimeout: 60000
```

### Test Failures
1. **Check Environment Variables**: Ensure .env.test is properly configured
2. **Database State**: Verify test database is clean between runs
3. **Mock Configurations**: Check that mocks are properly reset
4. **Resource Limits**: Monitor system resources during test runs

## Contributing

When adding new features:

1. **Write Tests First**: Follow TDD principles
2. **Maintain Coverage**: Ensure new code is covered
3. **Update Documentation**: Keep this README current
4. **Performance Impact**: Consider impact on existing benchmarks
5. **Mock New Dependencies**: Add appropriate mocks for new services

For questions or issues with the test suite, refer to the main project documentation or create an issue in the repository.