import type { Request, Response } from 'express';
import { fireRazorpayWebhook } from '../services/razorpay/razorpay.service.js';
import { RAZORPAY_EVENTS } from '../constants.js';
import type { RazorpayEvent } from '../types.js';

export async function simulateRazorpay(req: Request, res: Response): Promise<void> {
  const { orderId, paymentId, event } = req.body as {
    orderId?: string;
    paymentId?: string;
    event?: string;
  };

  if (!orderId || !paymentId || !event) {
    res.status(400).json({ error: 'orderId, paymentId, and event are required' });
    return;
  }

  if (!(RAZORPAY_EVENTS as string[]).includes(event)) {
    res.status(400).json({ error: `event must be one of: ${RAZORPAY_EVENTS.join(', ')}` });
    return;
  }

  try {
    const result = await fireRazorpayWebhook(orderId, paymentId, event as RazorpayEvent);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Unknown error' });
  }
}
