import type { Booking, LifecycleData, Vendor } from '../types';
import { VENDOR_LABELS, VENDOR_COLORS, VENDORS } from '../constants';
import { Btn, EmptyState, InlineError, InlineMuted, BadgeCount } from '../styles/common.styles';
import { Toolbar, VendorPills, Pill, ToolbarActions } from '../styles/BookingsTab.styles';
import BookingCard from './BookingCard';

interface Props {
  bookings: Booking[];
  allBookings: Booking[];
  loading: boolean;
  error: string | null;
  vendorFilter: Vendor | 'all';
  setVendorFilter: (v: Vendor | 'all') => void;
  refresh: () => void;
  removeBooking: (id: string) => void;
  lifecycleData: LifecycleData | null;
}

export default function BookingsTab({
  bookings,
  allBookings,
  loading,
  error,
  vendorFilter,
  setVendorFilter,
  refresh,
  removeBooking,
  lifecycleData,
}: Props) {
  return (
    <div>
      <Toolbar>
        <VendorPills>
          <Pill $active={vendorFilter === 'all'} onClick={() => setVendorFilter('all')}>
            All
            {allBookings.length > 0 && <BadgeCount>{allBookings.length}</BadgeCount>}
          </Pill>
          {VENDORS.map((v) => {
            const count = allBookings.filter((b) => b.vendor === v).length;
            return (
              <Pill
                key={v}
                $active={vendorFilter === v}
                $color={VENDOR_COLORS[v]}
                onClick={() => setVendorFilter(v)}
              >
                {VENDOR_LABELS[v]}
                {count > 0 && <BadgeCount>{count}</BadgeCount>}
              </Pill>
            );
          })}
        </VendorPills>
        <ToolbarActions>
          {loading && <InlineMuted>Refreshing…</InlineMuted>}
          <Btn onClick={() => void refresh()} disabled={loading}>
            ↻ Refresh
          </Btn>
        </ToolbarActions>
      </Toolbar>

      {error && <InlineError>{error}</InlineError>}

      {!loading && bookings.length === 0 && (
        <EmptyState>
          {allBookings.length === 0
            ? 'No bookings yet. Make a booking through nexus-staging to see it here.'
            : 'No bookings match the selected filter.'}
        </EmptyState>
      )}

      {bookings.map((booking) => (
        <BookingCard
          key={booking.partnerBookingId}
          booking={booking}
          lifecycleData={lifecycleData}
          onDelete={() => void removeBooking(booking.partnerBookingId)}
          onRefresh={() => void refresh()}
        />
      ))}
    </div>
  );
}
