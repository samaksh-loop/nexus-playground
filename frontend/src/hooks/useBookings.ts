import { useState, useEffect, useCallback } from 'react';
import type { Booking, Vendor } from '../types';
import { fetchBookings, deleteBooking } from '../api';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorFilter, setVendorFilter] = useState<Vendor | 'all'>('all');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeBooking = useCallback(async (id: string) => {
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.partnerBookingId !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete booking');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered =
    vendorFilter === 'all' ? bookings : bookings.filter((b) => b.vendor === vendorFilter);

  return {
    bookings: filtered,
    allBookings: bookings,
    loading,
    error,
    vendorFilter,
    setVendorFilter,
    refresh,
    removeBooking,
  };
}
