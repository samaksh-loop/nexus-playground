import sql from '../db.js';
import type { Settings, SlotConfig } from '../types.js';
import { DEFAULT_SETTINGS, getDefaultSlots } from '../constants.js';

let settings: Settings = { ...DEFAULT_SETTINGS };
let slots: SlotConfig = getDefaultSlots();

export async function loadConfig(): Promise<void> {
  const rows = await sql`SELECT key, value FROM config WHERE key IN ('settings', 'slots')`;
  for (const row of rows) {
    if (row.key === 'settings') settings = { ...DEFAULT_SETTINGS, ...(row.value as Settings) };
    if (row.key === 'slots') slots = { ...getDefaultSlots(), ...(row.value as SlotConfig) };
  }
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getSettings(): Settings {
  return clone(settings);
}

export async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  const newSettings = { ...settings, ...updates };
  await sql`
    INSERT INTO config (key, value) VALUES ('settings', ${sql.json(newSettings as unknown as Parameters<typeof sql.json>[0])})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
  settings = newSettings;
  return clone(settings);
}

export function getSlots<V extends keyof SlotConfig>(vendor: V): SlotConfig[V] {
  return clone(slots[vendor]);
}

export function getAllSlots(): SlotConfig {
  return clone(slots);
}

export async function updateSlots<V extends keyof SlotConfig>(
  vendor: V,
  updatedSlots: SlotConfig[V],
): Promise<SlotConfig[V]> {
  const newSlots = { ...slots, [vendor]: updatedSlots };
  await sql`
    INSERT INTO config (key, value) VALUES ('slots', ${sql.json(newSlots as unknown as Parameters<typeof sql.json>[0])})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
  slots = newSlots;
  return clone(slots[vendor]);
}

export function getWebhookSecrets(): Record<string, string> {
  const secrets = {
    'orange-health': process.env.ORANGE_HEALTH_WEBHOOK_SECRET_KEY ?? '',
    healthians:      process.env.HEALTHIANS_WEBHOOK_SECRET_KEY ?? '',
    redcliffe:       process.env.REDCLIFFE_WEBHOOK_SECRET_KEY ?? '',
    'ekin-care':     process.env.EKIN_CARE_WEBHOOK_SECRET_KEY ?? '',
  };
  const missing = Object.entries(secrets)
    .filter(([, v]) => !v)
    .map(([vendor]) => vendor);
  if (missing.length) throw new Error(`Missing webhook secret(s): ${missing.join(', ')}`);
  return clone(secrets);
}
