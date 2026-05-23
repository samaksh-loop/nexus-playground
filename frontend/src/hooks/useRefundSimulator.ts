import { useState, useCallback } from 'react';
import type { RazorpayRefundEvent, RazorpayFireResult } from '../types';
import { simulateRazorpayRefundWebhook } from '../api';

export function useRefundSimulator() {
  const [refundId, setRefundId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [event, setEvent] = useState<RazorpayRefundEvent>('refund.processed');
  const [result, setResult] = useState<RazorpayFireResult | null>(null);
  const [firing, setFiring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fire = useCallback(async () => {
    if (!refundId.trim()) {
      setResult(null);
      setError('Refund ID is required');
      return;
    }
    setFiring(true);
    setResult(null);
    setError(null);
    try {
      const res = await simulateRazorpayRefundWebhook(refundId.trim(), paymentId.trim(), event);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fire webhook');
    } finally {
      setFiring(false);
    }
  }, [refundId, paymentId, event]);

  return { refundId, setRefundId, paymentId, setPaymentId, event, setEvent, result, firing, error, fire };
}
