import { beforeAll, afterAll, afterEach } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Setup test database connection
beforeAll(async () => {
  // Optional: Reset test database before running tests
  // await execAsync('npm run db:push');
  console.log('Test suite initialized');
});

// Cleanup after all tests
afterAll(async () => {
  console.log('Test suite completed');
});

// Reset rate limiters between tests to prevent interference
afterEach(() => {
  // Clear any in-memory caches if needed
});
