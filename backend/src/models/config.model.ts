import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Settings, SlotConfig } from '../types';
import { DEFAULT_SETTINGS, getDefaultSlots } from '../constants';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'data');
const SETTINGS_PATH = join(DATA_DIR, 'settings.json');
const SLOTS_PATH = join(DATA_DIR, 'slots.json');

let settings: Settings = { ...DEFAULT_SETTINGS };
let slots: SlotConfig = getDefaultSlots();

export function loadConfig(): void {
  mkdirSync(DATA_DIR, { recursive: true });
  if (existsSync(SETTINGS_PATH)) {
    try {
      settings = { ...DEFAULT_SETTINGS, ...JSON.parse(readFileSync(SETTINGS_PATH, 'utf8')) } as Settings;
    } catch (err) {
      console.error('Failed to load settings, using defaults:', err);
    }
  }
  if (existsSync(SLOTS_PATH)) {
    try {
      slots = { ...getDefaultSlots(), ...JSON.parse(readFileSync(SLOTS_PATH, 'utf8')) } as SlotConfig;
    } catch (err) {
      console.error('Failed to load slots, using defaults:', err);
    }
  }
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getSettings(): Settings {
  return clone(settings);
}

export function updateSettings(updates: Partial<Settings>): Settings {
  const newSettings = { ...settings, ...updates };
  try {
    writeFileSync(SETTINGS_PATH, JSON.stringify(newSettings, null, 2));
    settings = newSettings;
  } catch (err) {
    console.error('Failed to persist settings:', err);
    throw err;
  }
  return settings;
}

export function getSlots<V extends keyof SlotConfig>(vendor: V): SlotConfig[V] {
  return clone(slots[vendor]);
}

export function getAllSlots(): SlotConfig {
  return clone(slots);
}

export function updateSlots<V extends keyof SlotConfig>(vendor: V, updatedSlots: SlotConfig[V]): SlotConfig[V] {
  const newSlots = { ...slots, [vendor]: updatedSlots };
  try {
    writeFileSync(SLOTS_PATH, JSON.stringify(newSlots, null, 2));
    slots = newSlots;
  } catch (err) {
    console.error('Failed to persist slots:', err);
    throw err;
  }
  return slots[vendor];
}

export function getWebhookSecrets(): Record<string, string> {
  const secrets = {
    'orange-health': process.env.ORANGE_HEALTH_WEBHOOK_SECRET_KEY ?? '',
    healthians:      process.env.HEALTHIANS_WEBHOOK_SECRET_KEY ?? '',
    redcliffe:       process.env.REDCLIFFE_WEBHOOK_SECRET_KEY ?? '',
    'ekin-care':     process.env.EKIN_CARE_WEBHOOK_SECRET_KEY ?? '',
  };
  const missing = Object.entries(secrets)
    .filter(([, value]) => !value)
    .map(([vendor]) => vendor);
  if (missing.length) {
    throw new Error(`Missing webhook secret(s): ${missing.join(', ')}`);
  }
  return clone(secrets);
}
