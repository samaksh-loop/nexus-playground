import crypto from 'crypto';
import { getSettings, getWebhookSecrets } from '../../models/config.model';
import { getBookingByPartnerId, updateBookingStatus } from '../../models/booking.model';
import { buildOrangeHealthPayload, buildHealthiansPayload, buildRedcliffePayload, buildEkinCarePayload } from './payload.service';
import { LIFECYCLES, SIDE_EVENTS } from '../../constants';
import type { Vendor, LifecycleStep, WebhookFireResult, LifecycleRunStep } from '../../types';

function hmacSha256(body: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

function buildAuthHeaders(vendor: string, body: string): Record<string, string> {
  const secrets = getWebhookSecrets();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  switch (vendor) {
    case 'orange-health': headers['x-oh-signature'] = hmacSha256(body, secrets['orange-health']); break;
    case 'healthians':    headers['x-secret-key'] = secrets.healthians; break;
    case 'redcliffe':     headers['x-secret-key'] = secrets.redcliffe; break;
    case 'ekin-care':     headers['x-secret-key'] = secrets['ekin-care']; break;
  }
  return headers;
}

function buildPayload(vendor: string, event: string, booking: Parameters<typeof buildOrangeHealthPayload>[1]): unknown {
  switch (vendor) {
    case 'orange-health': return buildOrangeHealthPayload(event, booking);
    case 'healthians':    return buildHealthiansPayload(event, booking);
    case 'redcliffe':     return buildRedcliffePayload(event, booking);
    case 'ekin-care':     return buildEkinCarePayload(event, booking);
    default: throw new Error(`Unknown vendor: ${vendor}`);
  }
}

function findEventDef(vendor: Vendor, event: string): LifecycleStep | undefined {
  return [...(LIFECYCLES[vendor] ?? []), ...(SIDE_EVENTS[vendor] ?? [])].find((e) => e.event === event);
}

export async function fireWebhook(
  vendor: Vendor,
  event: string,
  partnerBookingId: string,
): Promise<WebhookFireResult> {
  const booking = getBookingByPartnerId(partnerBookingId);
  if (!booking) throw new Error(`Booking not found: ${partnerBookingId}`);

  const def = findEventDef(vendor, event);
  if (!def) throw new Error(`Unknown event "${event}" for vendor "${vendor}"`);

  const { nexusBaseUrl } = getSettings();
  const payload = buildPayload(vendor, event, booking);
  const body = JSON.stringify(payload);
  const url = `${nexusBaseUrl}${def.path}`;

  let result: WebhookFireResult;
  try {
    const res = await fetch(url, { method: 'POST', headers: buildAuthHeaders(vendor, body), body });
    result = { status: res.status, ok: res.ok, body: await res.text() };
  } catch (err) {
    result = { status: 0, ok: false, body: (err as Error).message };
  }

  updateBookingStatus(partnerBookingId, def.nextStatus, {
    event,
    label: def.label,
    firedAt: new Date().toISOString(),
    url,
    result,
  });

  return result;
}

export async function runFullLifecycle(
  vendor: Vendor,
  partnerBookingId: string,
  delayMs: number,
): Promise<LifecycleRunStep[]> {
  const steps = LIFECYCLES[vendor] ?? [];
  const results: LifecycleRunStep[] = [];

  for (const step of steps) {
    try {
      const result = await fireWebhook(vendor, step.event, partnerBookingId);
      results.push({ event: step.event, label: step.label, result });
    } catch (err) {
      results.push({ event: step.event, label: step.label, error: (err as Error).message });
    }
    if (delayMs > 0) await new Promise<void>((r) => setTimeout(r, delayMs));
  }

  return results;
}
