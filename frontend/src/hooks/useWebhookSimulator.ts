import { useState, useCallback } from 'react';
import type { Booking, LifecycleRunStep } from '../types';
import { simulateWebhook, streamLifecycle } from '../api';

export function useWebhookSimulator(booking: Booking, onRefresh: () => void) {
  const [steps, setSteps] = useState<LifecycleRunStep[]>([]);
  const [running, setRunning] = useState(false);
  const [firingEvent, setFiringEvent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [delayMs, setDelayMs] = useState(1000);

  const fireEvent = useCallback(
    async (event: string) => {
      setFiringEvent(event);
      setError(null);
      try {
        await simulateWebhook(booking.vendor, event, booking.partnerBookingId);
        onRefresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fire webhook');
      } finally {
        setFiringEvent(null);
      }
    },
    [booking.vendor, booking.partnerBookingId, onRefresh],
  );

  const runLifecycle = useCallback(async () => {
    setRunning(true);
    setSteps([]);
    setError(null);
    try {
      const res = await streamLifecycle(booking.vendor, booking.partnerBookingId, delayMs);
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`${res.status}: ${text}`);
      }
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const step = JSON.parse(trimmed) as LifecycleRunStep;
            setSteps((prev) => [...prev, step]);
          } catch {
            // ignore malformed lines
          }
        }
      }
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lifecycle run failed');
    } finally {
      setRunning(false);
    }
  }, [booking.vendor, booking.partnerBookingId, delayMs, onRefresh]);

  const clearSteps = useCallback(() => {
    setSteps([]);
    setError(null);
  }, []);

  return { steps, running, firingEvent, error, delayMs, setDelayMs, fireEvent, runLifecycle, clearSteps };
}
