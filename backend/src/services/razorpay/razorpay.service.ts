import crypto from 'crypto';
import { getSettings } from '../../models/config.model.js';
import type { RazorpayEvent, RazorpayFireResult } from '../../types.js';

function buildPayload(orderId: string, paymentId: string, event: RazorpayEvent) {
  return {
    event,
    payload: {
      payment: {
        entity: {
          order_id: orderId,
          id: paymentId,
        },
      },
    },
  };
}

export async function fireRazorpayWebhook(
  orderId: string,
  paymentId: string,
  event: RazorpayEvent,
): Promise<RazorpayFireResult> {
  const { nexusBaseUrl } = getSettings();
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured in .env');

  const payload = buildPayload(orderId, paymentId, event);
  const body = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const url = `${nexusBaseUrl}/api/webhook/razorpay`;

  const res = await fetch(url, {
    method: 'POST',
    signal: AbortSignal.timeout(10_000),
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature,
    },
    body,
  });

  const text = await res.text().catch(() => '');
  return { status: res.status, ok: res.ok, body: text };
}
