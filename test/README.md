# Test Suite Documentation

## Overview
This test suite validates critical security, business logic, and data integrity rules for the KiyuMart platform.

## Test Structure
```
test/
├── setup.ts                 # Global test configuration
├── auth.test.ts             # Authentication & CSRF protection
├── webhooks.test.ts         # Webhook idempotency & signature validation
├── products.test.ts         # Product validation rules (5 images, 30s video, variants)
├── pagination.test.ts       # Pagination headers & role-based filtering
├── commissions.test.ts      # Commission calculation & idempotency
├── soft-delete.test.ts      # Soft delete query logic
└── rate-limiting.test.ts    # Socket.IO message/call throttling
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Interactive UI mode
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

## Current Status
⚠️ **Test scaffolding complete but implementation pending**

All test files are currently scaffolded with placeholder tests (`expect(true).toBe(true)`) to establish structure. Full implementation requires:

1. **Server refactor**: Export Express `app` instance from `server/index.ts` for Supertest integration
2. **Test database**: Configure separate test database to avoid polluting development data
3. **Test utilities**: Create helper functions for:
   - User authentication (generate tokens)
   - CSRF token retrieval
   - Database seeding/cleanup
   - Webhook signature generation
   - Socket.IO client connection

## Priority Test Cases

### Critical (Week 1 completion blockers)
- ✅ CSRF token enforcement on POST/PATCH/PUT/DELETE
- ✅ Webhook idempotency (duplicate event_id rejection)
- ✅ Pagination headers (X-Total-Count, X-Page, X-Page-Size, X-Total-Pages)
- ✅ Rate limiting (30 messages/min, 10 calls/hour)

### High Priority (Week 2)
- ⏳ Soft delete query logic (deleted_at IS NULL filtering)
- ⏳ Product validation (5 images, 30s video, variant uniqueness)
- ⏳ Commission idempotency (no duplicate commissions per order)
- ⏳ Role-based access control (admin/seller/buyer/rider permissions)

### Medium Priority (Week 3)
- ⏳ JWT token expiration & refresh
- ⏳ Delivery tracking geo validation
- ⏳ Image upload limits & format validation
- ⏳ Order status transition rules

## Implementation Checklist

- [x] Install Vitest & Supertest
- [x] Create test directory structure
- [x] Add test scripts to package.json
- [x] Scaffold 7 test suites
- [ ] Refactor server/index.ts to export app
- [ ] Create test database config
- [ ] Implement auth helpers (login, CSRF, tokens)
- [ ] Write full CSRF enforcement tests
- [ ] Write webhook idempotency tests
- [ ] Write pagination validation tests
- [ ] Write rate limiting tests
- [ ] Configure CI/CD pipeline to run tests

## Notes
- Tests use `vitest/config.ts` with path aliases matching main app (`@`, `@db`, `@shared`)
- Coverage reports exclude migrations, config files, and test directory
- Setup file (`test/setup.ts`) prepared for database initialization hooks
- Socket.IO tests require server running in test mode with rate limit reset capability

## Next Steps
1. Export Express app from `server/index.ts` for Supertest
2. Create test-specific environment variables (.env.test)
3. Implement placeholder tests with actual assertions
4. Add database transaction rollback in `afterEach` hooks for test isolation
5. Set up GitHub Actions workflow to run tests on PR
