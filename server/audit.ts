import { db } from "../db";
import { users } from "@shared/schema";
import { sql } from "drizzle-orm";

interface AuditMetadata {
  [key: string]: any;
}

export async function logAudit(action: string, actorId: string | null, metadata?: AuditMetadata, target?: { type?: string; id?: string }) {
  try {
    await db.execute(sql`INSERT INTO audit_logs (action, actor_id, actor_role, target_type, target_id, metadata) VALUES (${action}, ${actorId}, (SELECT role FROM users WHERE id = ${actorId}), ${target?.type || null}, ${target?.id || null}, ${metadata ? sql`${JSON.stringify(metadata)}::jsonb` : null})`);
  } catch (error) {
    console.error('[AUDIT] Failed to record audit log:', { action, actorId, error });
  }
}

export async function ensureWebhookEvent(eventId: string, reference: string | null, eventType: string, rawPayload: any): Promise<{ alreadyProcessed: boolean }> {
  // Try to insert; on conflict do nothing and return processed state
  try {
    const result = await db.execute(sql`INSERT INTO webhook_events (event_id, reference, event_type, status, raw_payload) VALUES (${eventId}, ${reference}, ${eventType}, 'received', ${JSON.stringify(rawPayload)}::jsonb) ON CONFLICT (event_id) DO NOTHING RETURNING event_id`);
    const inserted = (result as any).rows?.length > 0;
    return { alreadyProcessed: !inserted };
  } catch (error) {
    console.error('[WEBHOOK] Failed idempotency check:', error);
    // Fail safe: assume processed to prevent duplicate side effects
    return { alreadyProcessed: true };
  }
}

export async function markWebhookProcessed(eventId: string, status: string) {
  try {
    await db.execute(sql`UPDATE webhook_events SET status = ${status}, processed_at = NOW() WHERE event_id = ${eventId}`);
  } catch (error) {
    console.error('[WEBHOOK] Failed to mark event processed:', { eventId, status, error });
  }
}
