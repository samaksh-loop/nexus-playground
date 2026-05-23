export type Vendor = 'orange-health' | 'healthians' | 'redcliffe' | 'ekin-care';

export interface Sample {
  vendorCustomerId?: string;
  apiCustomerId?: string;
  name?: string | null;
}

export interface WebhookHistoryEntry {
  event: string;
  label: string;
  firedAt: string;
  url: string;
  result: { status: number; ok: boolean; body?: string };
}

export interface Booking {
  partnerBookingId: string;
  appointmentId?: string;
  vendor: Vendor;
  nexusReferenceId?: string | null;
  status: string;
  createdAt: string;
  patientName?: string | null;
  patientPhone?: string | null;
  patientEmail?: string | null;
  collectionDate?: string | null;
  collectionSlot?: string | null;
  samples?: Sample[];
  requestBody?: unknown;
  webhookHistory: WebhookHistoryEntry[];
}

export interface PersistedStore {
  bookings: Booking[];
  idCounter: number;
}

export interface LifecycleStep {
  event: string;
  label: string;
  nextStatus: string;
  path: string;
}

export interface LifecycleData {
  lifecycles: Record<Vendor, LifecycleStep[]>;
  sideEvents: Record<Vendor, LifecycleStep[]>;
}

export interface Settings {
  nexusBaseUrl: string;
}

export interface OHSlot {
  slot_datetime: string;
  display: string;
}

export interface HLSlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  display: string;
}

export interface RCSlot {
  id: number;
  start_time: string;
  end_time: string;
  display: string;
}

export interface ECProvider {
  provider_id: string;
  provider_name: string;
  estimated_distance: string;
  address?: string;
}

export interface SlotConfig {
  'orange-health': OHSlot[];
  healthians: HLSlot[];
  redcliffe: RCSlot[];
  'ekin-care': ECProvider[];
}

export interface WebhookFireResult {
  status: number;
  ok: boolean;
  body: string;
}

export interface LifecycleRunStep {
  event: string;
  label: string;
  result?: WebhookFireResult;
  error?: string;
}

export interface TempEntry {
  body: Record<string, unknown>;
  expiresAt: number;
}

export type RazorpayEvent = 'order.paid' | 'payment.failed';

export type RazorpayRefundEvent = 'refund.created' | 'refund.processed' | 'refund.failed' | 'refund.speed_changed';

export interface RazorpayFireResult {
  status: number;
  ok: boolean;
  body: string;
}
