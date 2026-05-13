import type { Request, Response } from 'express';
import { nextBookingId, createBooking, getBookingByPartnerId, updateBookingStatus } from '../../models/booking.model';
import { getSlots } from '../../models/config.model';
import { BookingStatus } from '../../constants';
import type { Booking, Sample } from '../../types';

let tokenCounter = 1;

export function getAccessToken(_req: Request, res: Response): void {
  res.json({ access_token: `pg_healthians_token_${tokenCounter++}`, expires_in: 3600 });
}

export function checkServiceability(_req: Request, res: Response): void {
  res.json({ status: true });
}

export function getSlotsByZipCode(_req: Request, res: Response): void {
  const rawSlots = getSlots('healthians');
  const today = new Date().toISOString().slice(0, 10);
  res.json({
    message: 'success',
    data: rawSlots.map((s) => ({ slot_id: s.slot_id, start_time: s.start_time, end_time: s.end_time, date: today, display: s.display })),
  });
}

export function freezeSlot(_req: Request, res: Response): void {
  res.json({ status: 'success' });
}

export function createBookingHandler(req: Request, res: Response): void {
  const id = nextBookingId();
  const body = req.body as Record<string, unknown>;
  const customers = (body.customers as Record<string, unknown>[] | undefined) ?? [];

  const samples: Sample[] = customers.map((c) => ({
    vendorCustomerId: ((c.vendor_billing_user_id ?? c.customer_id) as string | undefined) ?? `HL_CUST_${id}`,
    name: (c.customer_name as string | undefined) ?? null,
  }));

  const booking: Booking = {
    partnerBookingId: String(id),
    vendor: 'healthians',
    nexusReferenceId: null,
    status: BookingStatus.CREATED,
    createdAt: new Date().toISOString(),
    patientName: samples[0]?.name ?? null,
    patientPhone: (body.mobile as string | undefined) ?? null,
    collectionDate: (body.booking_date as string | undefined) ?? null,
    collectionSlot: (body.slot_id as string | undefined) ?? null,
    samples,
    requestBody: body,
    webhookHistory: [],
  };

  createBooking(booking);
  res.json({ status: true, message: 'Booking created', booking_id: id, data: {} });
}

export function cancelBookingHandler(req: Request, res: Response): void {
  const body = req.body as Record<string, unknown>;
  const bookingId = (body.booking_id ?? body.ref_booking_id) as string | number | undefined;
  if (bookingId) {
    const b = getBookingByPartnerId(bookingId);
    if (b) updateBookingStatus(b.partnerBookingId, BookingStatus.CANCELLED, {
      event: 'api.cancel', label: 'Cancelled via API',
      firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
    });
  }
  res.json({ status: true, message: 'Booking cancelled' });
}

export function rescheduleBookingHandler(req: Request, res: Response): void {
  const body = req.body as Record<string, unknown>;
  const bookingId = (body.booking_id ?? body.ref_booking_id) as string | number | undefined;
  if (bookingId) {
    const b = getBookingByPartnerId(bookingId);
    if (b) updateBookingStatus(b.partnerBookingId, BookingStatus.RESCHEDULED, {
      event: 'api.reschedule', label: 'Rescheduled via API',
      firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
    });
  }
  res.json({ status: true, message: 'Booking rescheduled', data: { booking_id: bookingId } });
}
