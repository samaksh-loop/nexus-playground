import sql from '../db.js';

export async function runMigrations(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      partner_booking_id TEXT PRIMARY KEY,
      vendor             TEXT NOT NULL,
      status             TEXT NOT NULL,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data               JSONB NOT NULL DEFAULT '{}'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS config (
      key   TEXT PRIMARY KEY,
      value JSONB NOT NULL
    )
  `;

  await sql`CREATE SEQUENCE IF NOT EXISTS booking_id_seq START 10001`;

  console.log('[db] migrations complete');
}
