import type { Request, Response } from 'express';
import { nextBookingId, createBooking, getBookingByPartnerId, updateBookingStatus } from '../../models/booking.model';
import { getSlots } from '../../models/config.model';
import { BookingStatus } from '../../constants';
import type { Booking, Sample } from '../../types';

let tokenCounter = 1;

export function getAccessToken(_req: Request, res: Response): void {
  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
  res.json({ access_token: `pg_ekin_token_${tokenCounter++}`, expires_at: expiresAt });
}

export function getProviders(_req: Request, res: Response): void {
  const rawProviders = getSlots('ekin-care');
  res.json({
    providers: rawProviders.map((p) => ({
      provider_id: p.provider_id,
      name: p.provider_name,
      estimated_distance: p.estimated_distance,
      address: p.address ?? '',
      is_inclinic: true,
      benefit_types: ['ahc'],
      rating: 4.5,
      report_tat: '24 hours',
    })),
  });
}

export function getSlotsForProvider(req: Request, res: Response): void {
  const { providerId } = req.params as Record<string, string>;
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const date = d.toISOString().slice(0, 10);

  const makeSlot = (h: number) => ({
    start_time: `${String(h).padStart(2, '0')}:00`,
    end_time: `${String(h + 1).padStart(2, '0')}:00`,
    slot: `${date}T${String(h).padStart(2, '0')}:00:00+05:30`,
    available: true,
    display_text: `${String(h % 12 || 12).padStart(2, '0')}:00 ${h < 12 ? 'AM' : 'PM'} – ${String((h + 1) % 12 || 12).padStart(2, '0')}:00 ${h + 1 < 12 ? 'AM' : 'PM'}`,
    slot_text: `${String(h).padStart(2, '0')}:00-${String(h + 1).padStart(2, '0')}:00`,
    vendor_refs: { provider_id: providerId },
    utc_slot_time: `${date}T${String(h - 5).padStart(2, '0')}:30:00Z`,
  });

  const slots = [makeSlot(7), makeSlot(9), makeSlot(11)];
  res.json({ date, slots, booking_slots: [{ date, slots }], report_tat: '24 hours', interval: 60 });
}

export function createAppointment(req: Request, res: Response): void {
  const id = nextBookingId();
  const appointmentId = `PG_APT_${id}`;
  const body = req.body as Record<string, unknown>;
  const customers = (body.customers as Record<string, unknown>[] | undefined) ?? [];

  const samples: Sample[] = customers.map((c) => ({
    apiCustomerId: ((c.api_customer_id) as string | undefined) ?? `PG_CUST_${id}`,
    name: (c.name as string | undefined) ?? null,
  }));

  const booking: Booking = {
    partnerBookingId: String(id),
    appointmentId,
    vendor: 'ekin-care',
    nexusReferenceId: null,
    status: BookingStatus.CREATED,
    createdAt: new Date().toISOString(),
    patientName: samples[0]?.name ?? null,
    patientPhone: null,
    collectionDate: ((body.appointment_date_time as string | undefined)?.slice(0, 10)) ?? null,
    collectionSlot: (body.appointment_date_time as string | undefined) ?? null,
    samples,
    requestBody: body,
    webhookHistory: [],
  };

  createBooking(booking);
  res.json({ booking_id: id, appointment_id: appointmentId, status: 'created' });
}

export function cancelAppointment(req: Request, res: Response): void {
  const b = getBookingByPartnerId(req.params.partnerBookingId as string | number);
  if (b) updateBookingStatus(b.partnerBookingId, BookingStatus.CANCELLED, {
    event: 'api.cancel', label: 'Cancelled via API',
    firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
  });
  res.json({ message: 'success' });
}

export function rescheduleAppointment(req: Request, res: Response): void {
  const body = req.body as Record<string, unknown>;
  const b = getBookingByPartnerId(req.params.partnerBookingId as string | number);
  if (b) {
    if (body.appointment_date_time) {
      b.collectionSlot = body.appointment_date_time as string;
      b.collectionDate = (body.appointment_date_time as string).slice(0, 10);
    }
    updateBookingStatus(b.partnerBookingId, BookingStatus.RESCHEDULED, {
      event: 'api.reschedule', label: 'Rescheduled via API',
      firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
    });
  }
  res.json({ message: 'success' });
}
