import { useState, useCallback, useRef } from 'react';
import type { Vendor } from '../types';
import { previewPayload, simulateWebhook } from '../api';

export function usePayloadEditor(onSuccess: () => void) {
  const [open, setOpen] = useState(false);
  const [payloadText, setPayloadText] = useState('');
  const [loading, setLoading] = useState(false);
  const [firing, setFiring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ vendor: Vendor; event: string; partnerBookingId: string } | null>(null);
  const requestIdRef = useRef<unknown>(null);

  const openEditor = useCallback(async (vendor: Vendor, event: string, partnerBookingId: string) => {
    const requestId = requestIdRef.current;
    setOpen(true);
    setLoading(true);
    setError(null);
    setPayloadText('');
    setPending({ vendor, event, partnerBookingId });
    try {
      const { payload } = await previewPayload(vendor, event, partnerBookingId);
      if (requestId !== requestIdRef.current) return;
      setPayloadText(JSON.stringify(payload, null, 2));
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      setError(e instanceof Error ? e.message : 'Failed to load payload');
    } finally {
      if (requestId !== requestIdRef.current) return;
      setLoading(false);
    }
  }, []);

  const fire = useCallback(async () => {
    if (!pending) return;
    let customPayload: unknown;
    try {
      customPayload = JSON.parse(payloadText);
    } catch {
      setError('Invalid JSON');
      return;
    }
    setFiring(true);
    setError(null);
    try {
      await simulateWebhook(pending.vendor, pending.event, pending.partnerBookingId, customPayload);
      setOpen(false);
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fire webhook');
    } finally {
      setFiring(false);
    }
  }, [pending, payloadText, onSuccess]);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  return { open, payloadText, setPayloadText, loading, firing, error, openEditor, fire, close, pending };
}
