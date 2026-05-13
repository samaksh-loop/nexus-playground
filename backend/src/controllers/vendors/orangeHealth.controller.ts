import type { Request, Response } from 'express';
import { nextBookingId, createBooking, getBookingByPartnerId, updateBookingStatus } from '../../models/booking.model';
import { getSlots } from '../../models/config.model';
import { BookingStatus } from '../../constants';
import type { Booking } from '../../types';

export function getServiceability(req: Request, res: Response): void {
  const rawSlots = getSlots('orange-health');
  const date = (req.query.request_date as string | undefined) ?? new Date().toISOString().slice(0, 10);

  const slots: Record<number, { slot_datetime: string; display: string }> = {};
  rawSlots.forEach((s, i) => {
    slots[i + 1] = { slot_datetime: s.slot_datetime.replace(/^\d{4}-\d{2}-\d{2}/, date), display: s.display };
  });

  res.json({ status: 'Location is serviceable', slots });
}

export function createOrder(req: Request, res: Response): void {
  const id = nextBookingId();
  const body = req.body as Record<string, unknown>;
  const pd = body.patient_details as Record<string, unknown> | undefined;

  const booking: Booking = {
    partnerBookingId: String(id),
    vendor: 'orange-health',
    nexusReferenceId: (body.partner_reference_id as string | undefined) ?? null,
    status: BookingStatus.CREATED,
    createdAt: new Date().toISOString(),
    patientName: ((pd?.name ?? body.name) as string | undefined) ?? null,
    patientPhone: ((pd?.number ?? body.phone) as string | undefined) ?? null,
    collectionDate: ((body.slot_datetime as string | undefined)?.slice(0, 10)) ?? null,
    collectionSlot: (body.slot_datetime as string | undefined) ?? null,
    requestBody: body,
    webhookHistory: [],
  };

  createBooking(booking);
  res.json({
    request_id: id,
    token: `pg_oh_token_${id}`,
    orders: [{ order_id: id, city_request_id: `PG_CITY_${id}`, partner_reference_id: booking.nexusReferenceId }],
  });
}

export function cancelOrder(req: Request, res: Response): void {
  const booking = getBookingByPartnerId(req.params.partnerBookingId as string | number);
  if (booking) {
    updateBookingStatus(booking.partnerBookingId, BookingStatus.CANCELLED, {
      event: 'api.cancel', label: 'Cancelled via API',
      firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
    });
  }
  res.json({ message: 'processing' });
}

export function rescheduleOrder(req: Request, res: Response): void {
  const body = req.body as Record<string, unknown>;
  const booking = getBookingByPartnerId(req.params.partnerBookingId as string | number);
  if (booking) {
    if (body.requested_slot_time) {
      booking.collectionSlot = body.requested_slot_time as string;
      booking.collectionDate = (body.requested_slot_time as string).slice(0, 10);
    }
    updateBookingStatus(booking.partnerBookingId, BookingStatus.RESCHEDULED, {
      event: 'api.reschedule', label: 'Rescheduled via API',
      firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
    });
  }
  res.json({ result: { status: 'ok' } });
}
