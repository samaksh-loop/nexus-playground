import type { Vendor, Settings } from './types';

export const TEMP_TTL_MS = 30 * 60 * 1000;

export const BookingStatus = {
  CREATED: 'created',
  CONFIRMED: 'confirmed',
  PHLEBO_ASSIGNED: 'phlebo_assigned',
  SAMPLE_COLLECTED: 'sample_collected',
  SAMPLE_RECEIVED: 'sample_received',
  PARTIAL_REPORT: 'partial_report',
  SYNCED: 'synced',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
  NOSHOW: 'noshow',
  REJECTED: 'rejected',
  REPORT_SENT: 'report_sent',
  RESAMPLE: 'resample',
} as const;
export type BookingStatusValue = (typeof BookingStatus)[keyof typeof BookingStatus];

export const VendorPrefix = {
  ORANGE_HEALTH: 'oh',
  HEALTHIANS: 'healthians',
  REDCLIFFE: 'redcliffe',
  EKIN_CARE: 'ekin-care',
} as const;

export const HealthiansBookingStatus = {
  CONFIRMED: 'BS0013',
  PICKUP: 'BS003',
  CANCELLED: 'BS007',
  RESCHEDULED: 'BS0015',
  COMPLETED: 'BS0023',
} as const;

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

export const STATUS_COLORS: Record<string, string> = {
  created: '#6b7280',
  confirmed: '#16a34a',
  phlebo_assigned: '#2563eb',
  sample_collected: '#0891b2',
  sample_received: '#0891b2',
  partial_report: '#d97706',
  synced: '#7c3aed',
  completed: '#15803d',
  cancelled: '#dc2626',
  rescheduled: '#d97706',
  noshow: '#9ca3af',
  rejected: '#b91c1c',
  report_sent: '#15803d',
  resample: '#ea580c',
};

export const DEFAULT_NEXUS_BASE_URL = 'http://localhost:3000';

export const DEFAULT_SETTINGS: Settings = {
  nexusBaseUrl: DEFAULT_NEXUS_BASE_URL,
};

export const VENDORS: Vendor[] = ['orange-health', 'healthians', 'redcliffe', 'ekin-care'];
