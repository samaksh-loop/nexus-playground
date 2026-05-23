import sql from '../db.js';
import type { Booking, WebhookHistoryEntry } from '../types.js';

function rowToBooking(row: Record<string, unknown>): Booking {
  const data = (row.data ?? {}) as Record<string, unknown>;
  const createdAt = new Date(String(row.created_at)).toISOString();
  return {
    partnerBookingId: row.partner_booking_id as string,
    vendor: row.vendor as Booking['vendor'],
    status: row.status as string,
    createdAt,
    ...data,
  } as Booking;
}

export async function nextBookingId(): Promise<number> {
  const rows = await sql`SELECT nextval('booking_id_seq') AS nextval`;
  return Number(rows[0].nextval);
}

export async function getAllBookings(): Promise<Booking[]> {
  const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
  return rows.map(rowToBooking);
}

export async function getBookingByPartnerId(partnerBookingId: string | number): Promise<Booking | undefined> {
  const rows = await sql`SELECT * FROM bookings WHERE partner_booking_id = ${String(partnerBookingId)}`;
  return rows[0] ? rowToBooking(rows[0]) : undefined;
}

export async function createBooking(booking: Booking): Promise<Booking> {
  const { partnerBookingId, vendor, status, createdAt, ...data } = booking;
  await sql`
    INSERT INTO bookings (partner_booking_id, vendor, status, created_at, data)
    VALUES (
      ${partnerBookingId},
      ${vendor},
      ${status},
      ${createdAt}::timestamptz,
      ${sql.json(data as unknown as Parameters<typeof sql.json>[0])}
    )
  `;
  return booking;
}

export async function updateBookingStatus(
  partnerBookingId: string | number,
  status: string,
  historyEntry: WebhookHistoryEntry,
  dataUpdates?: Partial<Booking>,
): Promise<Booking | null> {
  const id = String(partnerBookingId);
  const rows = await sql`SELECT * FROM bookings WHERE partner_booking_id = ${id}`;
  if (!rows[0]) return null;

  const booking = rowToBooking(rows[0]);
  booking.status = status;
  booking.webhookHistory = [...(booking.webhookHistory ?? []), historyEntry];
  if (dataUpdates) Object.assign(booking, dataUpdates);

  const { partnerBookingId: _pid, vendor: _v, status: _s, createdAt: _c, ...data } = booking;
  await sql`
    UPDATE bookings
    SET status = ${status}, data = ${sql.json(data as unknown as Parameters<typeof sql.json>[0])}
    WHERE partner_booking_id = ${id}
  `;
  return booking;
}

export async function deleteBooking(partnerBookingId: string | number): Promise<boolean> {
  const rows = await sql`
    DELETE FROM bookings
    WHERE partner_booking_id = ${String(partnerBookingId)}
    RETURNING partner_booking_id
  `;
  return rows.length > 0;
}
