import type { Request, Response } from 'express';
import { nextBookingId, createBooking, getBookingByPartnerId, updateBookingStatus } from '../../models/booking.model';
import { getSlots } from '../../models/config.model';
import { BookingStatus, TEMP_TTL_MS } from '../../constants';
import type { Booking, TempEntry } from '../../types';

const pendingTemp = new Map<string, TempEntry>();

function purgeStaleTempBookings(): void {
  const now = Date.now();
  for (const [key, entry] of pendingTemp) {
    if (entry.expiresAt < now) pendingTemp.delete(key);
  }
}

function to12hr(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function checkServiceability(_req: Request, res: Response): void {
  res.json({ status: 'success', is_serviceable: true });
}

export function getTimeSlots(req: Request, res: Response): void {
  const rawSlots = getSlots('redcliffe');
  const collection_date = (req.query.collection_date as string | undefined) ?? new Date().toISOString().slice(0, 10);
  const results = rawSlots.map((s) => ({
    id: s.id,
    available_slot: 10,
    format_24_hrs: { start_time: s.start_time, end_time: s.end_time },
    format_12_hrs: { start_time: to12hr(s.start_time), end_time: to12hr(s.end_time) },
    collection_date,
  }));
  res.json({ status: 'success', message: 'Slots fetched', results });
}

export function createTemporaryBooking(req: Request, res: Response): void {
  purgeStaleTempBookings();
  const tempId = nextBookingId();
  const body = req.body as Record<string, unknown>;
  pendingTemp.set(String(tempId), { body, expiresAt: Date.now() + TEMP_TTL_MS });

  const additionalMembers = (body.additional_member as Record<string, unknown>[] | undefined) ?? [];
  res.json({
    status: 'success',
    message: 'Temporary booking created',
    booking_id: tempId,
    additional_members: additionalMembers.map((m, i) => ({ booking_id: tempId + i + 1, name: m.customerName })),
  });
}

export function confirmTemporaryBooking(req: Request, res: Response): void {
  const body = req.body as Record<string, unknown>;
  const tempId = String(body.booking_id ?? body.temp_booking_id ?? '');
  const tempEntry = pendingTemp.get(tempId);
  if (!tempEntry || tempEntry.expiresAt < Date.now()) {
    res.status(404).json({ status: 'error', message: 'Temporary booking not found or expired' });
    return;
  }
  const tempBody = tempEntry.body;

  const booking: Booking = {
    partnerBookingId: tempId,
    vendor: 'redcliffe',
    nexusReferenceId: ((tempBody.reference_data ?? body.reference_data) as string | undefined) ?? null,
    status: BookingStatus.CREATED,
    createdAt: new Date().toISOString(),
    patientName: (tempBody.customer_name as string | undefined) ?? null,
    patientPhone: (tempBody.customer_phonenumber as string | undefined) ?? null,
    patientEmail: (tempBody.customer_email as string | undefined) ?? null,
    collectionDate: (tempBody.collection_date as string | undefined) ?? null,
    collectionSlot: String(tempBody.collection_slot ?? ''),
    samples: [{ vendorCustomerId: tempId }],
    requestBody: { temp: tempBody, confirm: body },
    webhookHistory: [],
  };

  createBooking(booking);
  pendingTemp.delete(tempId);
  res.json({ status: 'success', message: 'Booking confirmed', booking_id: tempId });
}

export function updatePaymentMode(_req: Request, res: Response): void {
  res.json({ status: 'success', message: 'Payment mode updated' });
}

export function updateBookingHandler(req: Request, res: Response): void {
  const body = req.body as Record<string, unknown>;
  const bookingId = body.booking_id as string | number | undefined;
  const bookingStatus = (body.booking_status as string | undefined) ?? 'updated';

  if (bookingId) {
    const b = getBookingByPartnerId(bookingId as string | number);
    if (b) updateBookingStatus(b.partnerBookingId, bookingStatus, {
      event: `api.${bookingStatus}`, label: `Status → ${bookingStatus} via API`,
      firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
    });
  }
  res.json({ status: 'success', message: 'Booking updated' });
}
