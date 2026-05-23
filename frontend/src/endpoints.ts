import type { Vendor } from './types';

export const ENDPOINTS = {
    FETCH_BOOKINGS: '/api/bookings',
    DELETE_BOOKING: (id: string) => `/api/bookings/${id}`,
    FETCH_LIFECYCLES: '/api/lifecycles',
    PREVIEW_PAYLOAD: '/api/simulate/payload',
    SIMULATE_WEBHOOK: '/api/simulate/webhook',
    STREAM_LIFECYCLE: '/api/simulate/lifecycle',
    SETTINGS: '/api/settings',
    FETCH_SLOTS: '/api/slots',
    SAVE_VENDOR_SLOTS: (vendor: Vendor) => `/api/slots/${vendor}`,
    SIMULATE_RAZORPAY: '/api/razorpay/simulate',
    SIMULATE_RAZORPAY_REFUND: '/api/razorpay/simulate-refund',
}
