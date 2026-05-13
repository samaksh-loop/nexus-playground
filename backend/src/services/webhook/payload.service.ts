import type { Booking } from '../../types';
import { HealthiansBookingStatus, PLACEHOLDER } from '../../constants';

function now(): string {
  return new Date().toISOString();
}

function intId(str: string): number {
  const parsed = Number.parseInt(str, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid non-numeric partnerBookingId: ${str}`);
  }
  return parsed;
}

export function buildOrangeHealthPayload(event: string, booking: Booking): unknown {
  const id = intId(booking.partnerBookingId);
  const slot = booking.collectionSlot ?? now();
  const name = booking.patientName ?? PLACEHOLDER.PATIENT_NAME;
  const phone = booking.patientPhone ?? PLACEHOLDER.PATIENT_PHONE;

  const base = {
    customer_details: {
      created_on: booking.createdAt,
      id,
      name,
      number: phone,
      system_customer_id: id,
      system_customer_user_id: id,
    },
    order: {
      id,
      city_request_id: `PG_CITY_${id}`,
      partner_reference_id: booking.nexusReferenceId ?? `PG_REF_${id}`,
      status: 1,
      status_string: 'active',
      customer_id: id,
      scheduled_on: slot,
      collected_on: null as string | null,
      completed_on: null as string | null,
      patient_details: { age_years: 30, gender: 'M', id: `PAT_${id}`, name, number: phone },
    },
    request: {
      id,
      time_slot: slot,
      created_on: booking.createdAt,
      status: 1,
      status_string: 'active',
      cancellation_reason: null as string | null,
      cancellation_explanation: null as string | null,
    },
    tasks: [] as unknown[],
    reports: [] as unknown[],
    invoice: null,
  };

  const phleboTask = {
    task_id: id + 90000,
    request_id: id,
    emedic_name: PLACEHOLDER.PHLEBO_NAME,
    emedic_number: PLACEHOLDER.PHLEBO_PHONE,
    emedic_feedback_link: PLACEHOLDER.FEEDBACK_URL,
    hub_name: PLACEHOLDER.HUB_NAME,
    tracking_link: `${PLACEHOLDER.TRACKING_BASE_URL}/${id}`,
    task_status: 1,
    task_started_date_time: now(),
    task_arrived_date_time: null,
    task_completed_date_time: null,
    task_acknowledged_date_time: now(),
  };

  switch (event) {
    case 'task.confirmed':
      base.request.status_string = 'confirmed';
      break;
    case 'task.assigned':
      base.tasks = [phleboTask];
      break;
    case 'task.completed':
    case 'task.completed_sent':
      base.tasks = [{ ...phleboTask, task_status: 3, task_arrived_date_time: now(), task_completed_date_time: now() }];
      base.order.collected_on = now();
      break;
    case 'order.completed':
      base.order.status = 2;
      base.order.status_string = 'completed';
      base.order.completed_on = now();
      base.reports = [{
        id: id + 80000,
        order_id: id,
        request_id: id,
        file_name: `report_${id}.pdf`,
        file_url: `${PLACEHOLDER.REPORT_BASE_URL}/report_${id}.pdf`,
        public_file_url: `${PLACEHOLDER.REPORT_BASE_URL}/public/report_${id}.pdf`,
        tokenize_public_file_url: `${PLACEHOLDER.REPORT_BASE_URL}/public/report_${id}.pdf?token=pg_test_token`,
      }];
      break;
    case 'order.cancelled':
      base.request.status = 10;
      base.request.status_string = 'cancelled';
      base.request.cancellation_reason = 'Cancelled via Playground';
      base.request.cancellation_explanation = 'Test cancellation triggered from nexus-playground';
      break;
  }

  return { event, payload: base };
}

export function buildHealthiansPayload(event: string, booking: Booking): unknown {
  const bookingId = intId(booking.partnerBookingId);
  const sampleId = booking.samples?.[0]?.vendorCustomerId ?? `PG_SAMPLE_${bookingId}`;

  switch (event) {
    case 'status_updated_confirmed':
    case 'status_updated_pickup':
      return {
        type: 'status_updated',
        booking_id: bookingId,
        data: {
          booking_status: event === 'status_updated_confirmed'
            ? HealthiansBookingStatus.CONFIRMED
            : HealthiansBookingStatus.PICKUP,
          ref_booking_id: String(bookingId),
          ref_booking_sample_collection_date: booking.collectionDate ?? new Date().toISOString().slice(0, 10),
          ref_booking_start_time: '07:00:00',
          ref_booking_end_time: '08:00:00',
          remark: 'Triggered from nexus-playground',
        },
      };
    case 'phlebo_assigned':
    case 'phlebo_reassigned':
      return {
        type: event,
        booking_id: bookingId,
        data: { phlebo_name: PLACEHOLDER.PHLEBO_NAME, masked_number: PLACEHOLDER.PHLEBO_MASKED_PHONE },
      };
    case 'report_uploaded_partial':
      return {
        type: 'report_uploaded',
        booking_id: bookingId,
        data: {
          vendor_customer_id: sampleId,
          report_url: `${PLACEHOLDER.REPORT_BASE_URL}/healthians/partial_${bookingId}.pdf`,
          verified_at: now(),
          full_report: 0,
        },
      };
    case 'report_uploaded_full':
      return {
        type: 'report_uploaded',
        booking_id: bookingId,
        data: {
          vendor_customer_id: sampleId,
          report_url: `${PLACEHOLDER.REPORT_BASE_URL}/healthians/full_${bookingId}.pdf`,
          verified_at: now(),
          full_report: 1,
        },
      };
    default:
      return { type: event, booking_id: bookingId, data: {} };
  }
}

const REDCLIFFE_BOOKING_STATUS_EVENTS = new Set([
  'phleboassigned', 'pickup', 'samplesync', 'rescheduled', 'cancelled', 'resample',
]);

export function buildRedcliffePayload(event: string, booking: Booking): unknown {
  const bookingId = intId(booking.partnerBookingId);
  const sampleId = Number(booking.samples?.[0]?.vendorCustomerId) || bookingId;
  const name = booking.patientName ?? PLACEHOLDER.PATIENT_NAME;
  const phone = booking.patientPhone ?? PLACEHOLDER.PATIENT_PHONE;
  const collectionDate = booking.collectionDate ?? new Date().toISOString().slice(0, 10);

  if (REDCLIFFE_BOOKING_STATUS_EVENTS.has(event)) {
    return {
      webhook_type: event,
      data: {
        booking_id: bookingId,
        data: {
          phlebo_name: event === 'phleboassigned' ? PLACEHOLDER.PHLEBO_NAME : '',
          phlebo_contact: event === 'phleboassigned' ? PLACEHOLDER.PHLEBO_PHONE : '',
          tracking_link: event === 'phleboassigned' ? `${PLACEHOLDER.TRACKING_BASE_URL}/${bookingId}` : '',
          customer_status: event === 'pickup' ? 'sample collected' : '',
          cancel_reason: event === 'cancelled' ? 'Cancelled via Playground' : '',
          ref_booking_sample_collection_date: event === 'rescheduled' ? collectionDate : '',
          ref_booking_start_time: event === 'rescheduled' ? '09:00:00' : '',
          ref_booking_end_time: event === 'rescheduled' ? '10:00:00' : '',
        },
      },
    };
  }

  return {
    id: sampleId,
    name,
    phonenumber: phone,
    client_refid: String(bookingId),
    report_url: `${PLACEHOLDER.REPORT_BASE_URL}/redcliffe/${event}_${bookingId}.pdf`,
    timestamp: now().replace('T', ' ').replace('Z', ''),
    booking_type: 'main_booking',
    customer_email: booking.patientEmail ?? PLACEHOLDER.PATIENT_EMAIL,
    reference_data: booking.nexusReferenceId ?? null,
  };
}

const EKIN_PHLEBO_EVENTS = new Set(['confirmed', 'received', 'completed', 'partially_received']);
const EKIN_REPORT_EVENTS = new Set(['received', 'completed', 'partially_received']);

export function buildEkinCarePayload(event: string, booking: Booking): unknown {
  const bookingId = booking.partnerBookingId;
  const appointmentId = booking.appointmentId ?? `PG_APT_${bookingId}`;
  const sampleId = booking.samples?.[0]?.apiCustomerId ?? `PG_CUST_${bookingId}`;

  return {
    status: event,
    booking_id: String(bookingId),
    appointment_id: String(appointmentId),
    api_customer_id: String(sampleId),
    voucher_api_url: `https://playground.internal/ekin-care/voucher/${appointmentId}`,
    appointment_date_time: booking.collectionSlot ?? now(),
    phlebo_name: EKIN_PHLEBO_EVENTS.has(event) ? PLACEHOLDER.PHLEBO_NAME : '',
    phlebo_number: EKIN_PHLEBO_EVENTS.has(event) ? PLACEHOLDER.PHLEBO_PHONE : '',
    reports: EKIN_REPORT_EVENTS.has(event)
      ? [`${PLACEHOLDER.REPORT_BASE_URL}/ekin-care/report_${bookingId}.pdf`]
      : [],
  };
}
