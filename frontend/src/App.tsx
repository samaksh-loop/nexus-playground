import { useState, useEffect } from 'react';
import './index.css';
import { useBookings } from './hooks/useBookings';
import { useLifecycles } from './hooks/useLifecycles';
import { useSettings } from './hooks/useSettings';
import BookingsTab from './components/BookingsTab';
import SettingsTab from './components/SettingsTab';
import {
  AppShell,
  AppHeader,
  HeaderLeft,
  AppTitle,
  Tagline,
  HealthIndicator,
  HealthDot,
  TabBar,
  TabBtn,
} from './styles/App.styles';
import { BadgeCount } from './styles/common.styles';

function App() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings'>('bookings');
  const [healthStatus, setHealthStatus] = useState<'online' | 'offline' | 'pending'>('pending');

  const bookingsState = useBookings();
  const { data: lifecycleData } = useLifecycles();
  const settingsState = useSettings();

  useEffect(() => {
    fetch('/api/health')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => setHealthStatus('online'))
      .catch(() => setHealthStatus('offline'));
  }, []);

  return (
    <AppShell>
      <AppHeader>
        <HeaderLeft>
          <AppTitle>Nexus Playground</AppTitle>
          <Tagline>vendor webhook simulator</Tagline>
        </HeaderLeft>
        <HealthIndicator>
          <HealthDot $status={healthStatus} />
          {healthStatus === 'online'
            ? 'connected'
            : healthStatus === 'offline'
              ? 'backend offline'
              : 'checking…'}
        </HealthIndicator>
      </AppHeader>

      <TabBar>
        <TabBtn $active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>
          Bookings
          {bookingsState.allBookings.length > 0 && (
            <BadgeCount>{bookingsState.allBookings.length}</BadgeCount>
          )}
        </TabBtn>
        <TabBtn $active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
          Settings
        </TabBtn>
      </TabBar>

      {activeTab === 'bookings' && (
        <BookingsTab
          bookings={bookingsState.bookings}
          allBookings={bookingsState.allBookings}
          loading={bookingsState.loading}
          error={bookingsState.error}
          vendorFilter={bookingsState.vendorFilter}
          setVendorFilter={bookingsState.setVendorFilter}
          refresh={bookingsState.refresh}
          removeBooking={bookingsState.removeBooking}
          lifecycleData={lifecycleData}
        />
      )}
      {activeTab === 'settings' && (
        <SettingsTab
          settings={settingsState.settings}
          slots={settingsState.slots}
          loading={settingsState.loading}
          saving={settingsState.saving}
          error={settingsState.error}
          success={settingsState.success}
          save={settingsState.save}
          updateVendorSlots={settingsState.updateVendorSlots}
        />
      )}
    </AppShell>
  );
}

export default App;
