import { useState, useEffect, useCallback } from 'react';
import type { Settings, SlotConfig, Vendor } from '../types';
import { fetchSettings, saveSettings, fetchSlots, saveVendorSlots } from '../api';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [slots, setSlots] = useState<SlotConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchSettings(), fetchSlots()])
      .then(([s, sl]) => {
        if (!cancelled) {
          setSettings(s);
          setSlots(sl);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load config');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const save = useCallback(async (s: Settings) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await saveSettings(s);
      setSettings(updated);
      setSuccess('Settings saved');
      setTimeout(() => setSuccess(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }, []);

  const updateVendorSlots = useCallback(async (vendor: Vendor, newSlots: unknown[]) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await saveVendorSlots(vendor, newSlots);
      const updated = await fetchSlots();
      setSlots(updated);
      setSuccess(`${vendor} slots saved`);
      setTimeout(() => setSuccess(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save slots');
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, slots, loading, saving, error, success, save, updateVendorSlots };
}
