import type { Request, Response } from 'express';
import { nextBookingId, createBooking, getBookingByPartnerId, updateBookingStatus } from '../../models/booking.model.js';
import { getSlots } from '../../models/config.model.js';
import { BookingStatus } from '../../constants.js';
import type { Booking } from '../../types.js';

export function getServiceability(req: Request, res: Response): void {
  const rawSlots = getSlots('orange-health');
  const date = (req.query.request_date as string | undefined) ?? new Date().toISOString().slice(0, 10);

  const slots: Record<number, { slot_datetime: string; display: string }> = {};
  rawSlots.forEach((s, i) => {
    slots[i + 1] = { slot_datetime: s.slot_datetime.replace(/^\d{4}-\d{2}-\d{2}/, date), display: s.display };
  });

  res.json({ status: 'Location is serviceable', slots });
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  const id = await nextBookingId();
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

  await createBooking(booking);
  res.json({
    request_id: id,
    token: `pg_oh_token_${id}`,
    orders: [{ order_id: id, city_request_id: `PG_CITY_${id}`, partner_reference_id: booking.nexusReferenceId }],
  });
}

export async function cancelOrder(req: Request, res: Response): Promise<void> {
  const booking = await getBookingByPartnerId(req.params.partnerBookingId as string);
  if (!booking) {
    console.warn(`[orange-health] cancelOrder: booking not found for partnerBookingId=${req.params.partnerBookingId}`);
  } else {
    await updateBookingStatus(booking.partnerBookingId, BookingStatus.CANCELLED, {
      event: 'api.cancel', label: 'Cancelled via API',
      firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
    });
  }
  res.json({ message: 'processing' });
}

export async function rescheduleOrder(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  const booking = await getBookingByPartnerId(req.params.partnerBookingId as string);
  if (!booking) {
    console.warn(`[orange-health] rescheduleOrder: booking not found for partnerBookingId=${req.params.partnerBookingId}`);
  } else {
    const slot = body.requested_slot_time as string | undefined;
    await updateBookingStatus(booking.partnerBookingId, BookingStatus.RESCHEDULED, {
      event: 'api.reschedule', label: 'Rescheduled via API',
      firedAt: new Date().toISOString(), url: req.originalUrl, result: { status: 200, ok: true },
    }, slot ? { collectionSlot: slot, collectionDate: slot.slice(0, 10) } : undefined);
  }
  res.json({ result: { status: 'ok' } });
}
