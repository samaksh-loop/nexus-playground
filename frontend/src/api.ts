import type { Booking, LifecycleData, Settings, SlotConfig, WebhookFireResult, Vendor, RazorpayEvent, RazorpayFireResult } from './types';
import { ENDPOINTS } from './endpoints';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export function fetchBookings(): Promise<Booking[]> {
  return request<Booking[]>(ENDPOINTS.FETCH_BOOKINGS);
}

export async function deleteBooking(id: string): Promise<void> {
  const res = await fetch(ENDPOINTS.DELETE_BOOKING(id), { method: 'DELETE' });
  if (!res.ok) throw new Error(`${res.status}`);
}

export function fetchLifecycles(): Promise<LifecycleData> {
  return request<LifecycleData>(ENDPOINTS.FETCH_LIFECYCLES);
}

export function simulateWebhook(
  vendor: Vendor,
  event: string,
  partnerBookingId: string,
): Promise<WebhookFireResult> {
  return request<WebhookFireResult>(ENDPOINTS.SIMULATE_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendor, event, partnerBookingId }),
  });
}

export function fetchSettings(): Promise<Settings> {
  return request<Settings>(ENDPOINTS.SETTINGS);
}

export function saveSettings(settings: Settings): Promise<Settings> {
  return request<Settings>(ENDPOINTS.SETTINGS, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
}

export function fetchSlots(): Promise<SlotConfig> {
  return request<SlotConfig>(ENDPOINTS.FETCH_SLOTS);
}

export async function saveVendorSlots(vendor: Vendor, slots: unknown[]): Promise<void> {
  const res = await fetch(ENDPOINTS.SAVE_VENDOR_SLOTS(vendor), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slots),
  });
  if (!res.ok) throw new Error(`${res.status}`);
}

export function streamLifecycle(
  vendor: Vendor,
  partnerBookingId: string,
  delayMs: number,
): Promise<Response> {
  return fetch(ENDPOINTS.STREAM_LIFECYCLE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendor, partnerBookingId, delayMs }),
  });
}

export function simulateRazorpayWebhook(
  orderId: string,
  paymentId: string,
  event: RazorpayEvent,
): Promise<RazorpayFireResult> {
  return request<RazorpayFireResult>(ENDPOINTS.SIMULATE_RAZORPAY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paymentId, event }),
  });
}
