import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Booking, PersistedStore, WebhookHistoryEntry } from '../types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'data');
const STORE_PATH = join(DATA_DIR, 'bookings.json');

let bookings: Booking[] = [];
let idCounter = 10000;

export function loadBookingStore(): void {
  mkdirSync(DATA_DIR, { recursive: true });
  if (existsSync(STORE_PATH)) {
    try {
      const stored = JSON.parse(readFileSync(STORE_PATH, 'utf8')) as PersistedStore;
      bookings = stored.bookings ?? [];
      idCounter = stored.idCounter ?? 10000;
    } catch (err) {
      console.error('Failed to load booking store, using defaults:', err);
      bookings = [];
    }
  }
}

function persist(): void {
  try {
    writeFileSync(STORE_PATH, JSON.stringify({ bookings, idCounter } satisfies PersistedStore, null, 2));
  } catch (err) {
    console.error('Failed to persist booking store:', err);
  }
}

export function nextBookingId(): number {
  return ++idCounter;
}

export function getAllBookings(): Booking[] {
  return [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getBookingByPartnerId(partnerBookingId: string | number): Booking | undefined {
  return bookings.find((b) => b.partnerBookingId === String(partnerBookingId));
}

export function createBooking(booking: Booking): Booking {
  try {
    bookings.push(booking);
    persist();
  } catch (err) {
    bookings.pop();
    throw err;
  }
  return booking;
}

export function updateBookingStatus(
  partnerBookingId: string | number,
  status: string,
  historyEntry: WebhookHistoryEntry,
): Booking | null {
  const booking = getBookingByPartnerId(partnerBookingId);
  if (!booking) return null;
  booking.status = status;
  booking.webhookHistory.push(historyEntry);
  persist();
  return booking;
}

export function deleteBooking(partnerBookingId: string | number): boolean {
  const idx = bookings.findIndex((b) => b.partnerBookingId === String(partnerBookingId));
  if (idx === -1) return false;
  bookings.splice(idx, 1);
  persist();
  return true;
}
