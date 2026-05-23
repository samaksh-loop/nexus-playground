import type { Request, Response } from 'express';
import { getAllBookings, deleteBooking } from '../models/booking.model.js';
import { fireWebhook, generatePayload } from '../services/webhook/sender.service.js';
import { LIFECYCLES, SIDE_EVENTS } from '../constants.js';
import type { Vendor } from '../types.js';

export async function listBookings(_req: Request, res: Response): Promise<void> {
  res.json(await getAllBookings());
}

export async function removeBooking(req: Request, res: Response): Promise<void> {
  const removed = await deleteBooking(req.params.id as string | number);
  res.json({ removed });
}

export function getLifecycles(_req: Request, res: Response): void {
  res.json({ lifecycles: LIFECYCLES, sideEvents: SIDE_EVENTS });
}

export async function previewPayload(req: Request, res: Response): Promise<void> {
  const { vendor, event, partnerBookingId } = req.body as Record<string, string | undefined>;
  if (!vendor || !event || !partnerBookingId) {
    res.status(400).json({ error: 'vendor, event, and partnerBookingId are required' });
    return;
  }
  try {
    const payload = await generatePayload(vendor as Vendor, event, partnerBookingId);
    res.json({ payload });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function simulateWebhook(req: Request, res: Response): Promise<void> {
  const { vendor, event, partnerBookingId, customPayload } = req.body as Record<string, unknown>;
  if (!vendor || !event || !partnerBookingId) {
    res.status(400).json({ error: 'vendor, event, and partnerBookingId are required' });
    return;
  }
  try {
    const result = await fireWebhook(vendor as Vendor, event as string, partnerBookingId as string, customPayload);
    res.json({ ok: true, result });
  } catch (err) {
    res.status(400).json({ ok: false, error: (err as Error).message });
  }
}

export async function simulateLifecycle(req: Request, res: Response): Promise<void> {
  const { vendor, partnerBookingId, delayMs = 3000 } = req.body as {
    vendor?: string;
    partnerBookingId?: string;
    delayMs?: number;
  };
  if (!vendor || !partnerBookingId) {
    res.status(400).json({ error: 'vendor and partnerBookingId are required' });
    return;
  }

  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Transfer-Encoding', 'chunked');

  const steps = LIFECYCLES[vendor as Vendor] ?? [];
  for (const step of steps) {
    try {
      const result = await fireWebhook(vendor as Vendor, step.event, partnerBookingId);
      res.write(JSON.stringify({ event: step.event, label: step.label, result }) + '\n');
    } catch (err) {
      res.write(JSON.stringify({ event: step.event, label: step.label, error: (err as Error).message }) + '\n');
    }
    if (delayMs > 0) await new Promise<void>((r) => setTimeout(r, Number(delayMs)));
  }
  res.end();
}
