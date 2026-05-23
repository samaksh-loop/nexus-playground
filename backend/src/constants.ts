import type { Vendor, LifecycleStep, SlotConfig, Settings, RazorpayEvent, RazorpayRefundEvent } from './types';

export const TEMP_TTL_MS = 30 * 60 * 1000;

export const RAZORPAY_EVENTS: RazorpayEvent[] = ['order.paid', 'payment.failed'];

export const RAZORPAY_REFUND_EVENTS: RazorpayRefundEvent[] = ['refund.created', 'refund.processed', 'refund.failed', 'refund.speed_changed'];

export enum BookingStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  PHLEBO_ASSIGNED = 'phlebo_assigned',
  SAMPLE_COLLECTED = 'sample_collected',
  SAMPLE_RECEIVED = 'sample_received',
  PARTIAL_REPORT = 'partial_report',
  SYNCED = 'synced',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NOSHOW = 'noshow',
  REJECTED = 'rejected',
  REPORT_SENT = 'report_sent',
  RESAMPLE = 'resample',
}

export enum VendorPrefix {
  ORANGE_HEALTH = 'oh',
  HEALTHIANS = 'healthians',
  REDCLIFFE = 'redcliffe',
  EKIN_CARE = 'ekin-care',
}

export enum HealthiansBookingStatus {
  CONFIRMED = 'BS0013',
  PICKUP = 'BS003',
  CANCELLED = 'BS007',
  RESCHEDULED = 'BS0015',
  COMPLETED = 'BS0023',
}

export const VENDOR_LABELS: Record<Vendor, string> = {
  'orange-health': 'Orange Health',
  healthians: 'Healthians',
  redcliffe: 'Redcliffe',
  'ekin-care': 'Ekin Care',
};

export const VENDOR_COLORS: Record<Vendor, string> = {
  'orange-health': '#f97316',
  healthians: '#8b5cf6',
  redcliffe: '#ef4444',
  'ekin-care': '#0ea5e9',
};

export const LIFECYCLES: Record<Vendor, LifecycleStep[]> = {
  'orange-health': [
    { event: 'task.confirmed',  label: 'Booking Confirmed', nextStatus: BookingStatus.CONFIRMED,        path: '/api/webhook/orange-health' },
    { event: 'task.assigned',   label: 'Phlebo Assigned',   nextStatus: BookingStatus.PHLEBO_ASSIGNED,  path: '/api/webhook/orange-health' },
    { event: 'task.completed',  label: 'Sample Collected',  nextStatus: BookingStatus.SAMPLE_COLLECTED, path: '/api/webhook/orange-health' },
    { event: 'order.completed', label: 'Report Ready',      nextStatus: BookingStatus.COMPLETED,        path: '/api/webhook/orange-health' },
  ],
  healthians: [
    { event: 'status_updated_confirmed', label: 'Booking Confirmed', nextStatus: BookingStatus.CONFIRMED,        path: '/api/webhook/healthians' },
    { event: 'phlebo_assigned',          label: 'Phlebo Assigned',   nextStatus: BookingStatus.PHLEBO_ASSIGNED,  path: '/api/webhook/healthians' },
    { event: 'status_updated_pickup',    label: 'Sample Collected',  nextStatus: BookingStatus.SAMPLE_COLLECTED, path: '/api/webhook/healthians' },
    { event: 'report_uploaded_partial',  label: 'Partial Report',    nextStatus: BookingStatus.PARTIAL_REPORT,   path: '/api/webhook/healthians' },
    { event: 'report_uploaded_full',     label: 'Full Report Ready', nextStatus: BookingStatus.COMPLETED,        path: '/api/webhook/healthians' },
  ],
  redcliffe: [
    { event: 'phleboassigned',      label: 'Phlebo Assigned',  nextStatus: BookingStatus.PHLEBO_ASSIGNED,  path: '/api/webhook/redcliffe/booking-status' },
    { event: 'pickup',              label: 'Sample Collected', nextStatus: BookingStatus.SAMPLE_COLLECTED, path: '/api/webhook/redcliffe/booking-status' },
    { event: 'samplesync',          label: 'Sample Synced',    nextStatus: BookingStatus.SYNCED,           path: '/api/webhook/redcliffe/booking-status' },
    { event: 'partial-report',      label: 'Partial Report',   nextStatus: BookingStatus.PARTIAL_REPORT,   path: '/api/webhook/redcliffe/partial-report' },
    { event: 'consolidated-report', label: 'Full Report Ready',nextStatus: BookingStatus.COMPLETED,        path: '/api/webhook/redcliffe/consolidated-report' },
  ],
  'ekin-care': [
    { event: 'confirmed', label: 'Booking Confirmed', nextStatus: BookingStatus.CONFIRMED,       path: '/api/webhook/ekin-care' },
    { event: 'received',  label: 'Sample Received',   nextStatus: BookingStatus.SAMPLE_RECEIVED, path: '/api/webhook/ekin-care' },
    { event: 'completed', label: 'Report Ready',      nextStatus: BookingStatus.COMPLETED,       path: '/api/webhook/ekin-care' },
  ],
};

export const SIDE_EVENTS: Record<Vendor, LifecycleStep[]> = {
  'orange-health': [
    { event: 'order.cancelled',     label: 'Cancel',      nextStatus: BookingStatus.CANCELLED,   path: '/api/webhook/orange-health' },
    { event: 'task.completed_sent', label: 'Report Sent', nextStatus: BookingStatus.REPORT_SENT, path: '/api/webhook/orange-health' },
  ],
  healthians: [
    { event: 'phlebo_reassigned', label: 'Reassign Phlebo', nextStatus: BookingStatus.PHLEBO_ASSIGNED, path: '/api/webhook/healthians' },
  ],
  redcliffe: [
    { event: 'cancelled',  label: 'Cancel',    nextStatus: BookingStatus.CANCELLED,  path: '/api/webhook/redcliffe/booking-status' },
    { event: 'rescheduled',label: 'Reschedule',nextStatus: BookingStatus.RESCHEDULED,path: '/api/webhook/redcliffe/booking-status' },
    { event: 'resample',   label: 'Resample',  nextStatus: BookingStatus.RESAMPLE,   path: '/api/webhook/redcliffe/booking-status' },
  ],
  'ekin-care': [
    { event: 'cancelled',          label: 'Cancel',              nextStatus: BookingStatus.CANCELLED,     path: '/api/webhook/ekin-care' },
    { event: 'noshow',             label: 'No Show',             nextStatus: BookingStatus.NOSHOW,        path: '/api/webhook/ekin-care' },
    { event: 'rescheduled',        label: 'Reschedule',          nextStatus: BookingStatus.RESCHEDULED,   path: '/api/webhook/ekin-care' },
    { event: 'partner_rescheduled',label: 'Partner Rescheduled', nextStatus: BookingStatus.RESCHEDULED,   path: '/api/webhook/ekin-care' },
    { event: 'rejected',           label: 'Reject',              nextStatus: BookingStatus.REJECTED,      path: '/api/webhook/ekin-care' },
    { event: 'partially_received', label: 'Partially Received',  nextStatus: BookingStatus.PARTIAL_REPORT,path: '/api/webhook/ekin-care' },
  ],
};

export const DEFAULT_NEXUS_BASE_URL = 'http://localhost:3000';

export const DEFAULT_SETTINGS: Settings = {
  nexusBaseUrl: DEFAULT_NEXUS_BASE_URL,
};

export function getDefaultSlots(): SlotConfig {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const date = d.toISOString().slice(0, 10);
  return {
    'orange-health': [
      { slot_datetime: `${date}T07:00:00+05:30`, display: '07:00 AM – 08:00 AM' },
      { slot_datetime: `${date}T09:00:00+05:30`, display: '09:00 AM – 10:00 AM' },
      { slot_datetime: `${date}T11:00:00+05:30`, display: '11:00 AM – 12:00 PM' },
    ],
    healthians: [
      { slot_id: 'HL_SLOT_1', start_time: '07:00:00', end_time: '08:00:00', display: '07:00 AM – 08:00 AM' },
      { slot_id: 'HL_SLOT_2', start_time: '09:00:00', end_time: '10:00:00', display: '09:00 AM – 10:00 AM' },
      { slot_id: 'HL_SLOT_3', start_time: '11:00:00', end_time: '12:00:00', display: '11:00 AM – 12:00 PM' },
    ],
    redcliffe: [
      { id: 1, start_time: '07:00', end_time: '08:00', display: '07:00 AM – 08:00 AM' },
      { id: 2, start_time: '09:00', end_time: '10:00', display: '09:00 AM – 10:00 AM' },
      { id: 3, start_time: '11:00', end_time: '12:00', display: '11:00 AM – 12:00 PM' },
    ],
    'ekin-care': [
      { provider_id: 'PG_PROV_001', provider_name: 'Playground Diagnostics Alpha', estimated_distance: '< 1 km', address: '1 Playground Street, Bengaluru' },
      { provider_id: 'PG_PROV_002', provider_name: 'Playground Diagnostics Beta',  estimated_distance: '2.4 km', address: '2 Test Avenue, Bengaluru' },
    ],
  };
}

export const PLACEHOLDER = {
  PHLEBO_NAME: 'Playground Phlebo',
  PHLEBO_PHONE: '8888888888',
  PHLEBO_MASKED_PHONE: '98XXXXX888',
  PATIENT_NAME: 'Playground Patient',
  PATIENT_PHONE: '9999999999',
  PATIENT_EMAIL: 'test@playground.internal',
  REPORT_BASE_URL: 'https://playground-reports.internal',
  TRACKING_BASE_URL: 'https://playground.internal/track',
  FEEDBACK_URL: 'https://playground.internal/feedback',
  HUB_NAME: 'Playground Hub',
};
