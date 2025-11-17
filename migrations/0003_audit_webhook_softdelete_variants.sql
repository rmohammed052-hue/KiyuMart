-- Migration: audit_logs, webhook_events, soft delete columns, variant uniqueness

-- 1. Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  actor_role user_role,
  target_type TEXT,
  target_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx ON audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_target_idx ON audit_logs (target_type, target_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs (action);

-- 2. Webhook Events table (idempotency)
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  reference TEXT,
  event_type TEXT NOT NULL,
  status TEXT,
  processed_at TIMESTAMP,
  raw_payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS webhook_events_reference_idx ON webhook_events (reference);
CREATE INDEX IF NOT EXISTS webhook_events_event_type_idx ON webhook_events (event_type);

-- 3. Soft delete columns (users, products, stores)
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS users_deleted_at_idx ON users (deleted_at);
CREATE INDEX IF NOT EXISTS products_deleted_at_idx ON products (deleted_at);
CREATE INDEX IF NOT EXISTS stores_deleted_at_idx ON stores (deleted_at);

-- 4. Product variant uniqueness (normalized empty to blank strings)
ALTER TABLE product_variants ADD CONSTRAINT product_variants_unique_variant UNIQUE (product_id, COALESCE(color,''), COALESCE(size,''), COALESCE(sku,''));

-- 5. Defensive existence of required extension for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;
