import { useState, useCallback } from 'react';
import type { RazorpayEvent, RazorpayFireResult } from '../types';
import { simulateRazorpayWebhook } from '../api';

export function useRazorpaySimulator() {
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [event, setEvent] = useState<RazorpayEvent>('order.paid');
  const [result, setResult] = useState<RazorpayFireResult | null>(null);
  const [firing, setFiring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fire = useCallback(async () => {
    if (!orderId.trim() || !paymentId.trim()) {
      setResult(null);
      setError('Order ID and Payment ID are required');
      return;
    }
    setFiring(true);
    setResult(null);
    setError(null);
    try {
      const res = await simulateRazorpayWebhook(orderId.trim(), paymentId.trim(), event);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fire webhook');
    } finally {
      setFiring(false);
    }
  }, [orderId, paymentId, event]);

  return { orderId, setOrderId, paymentId, setPaymentId, event, setEvent, result, firing, error, fire };
}
