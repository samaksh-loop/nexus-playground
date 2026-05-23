import crypto from 'crypto';
import { getSettings } from '../../models/config.model.js';
import type { RazorpayEvent, RazorpayRefundEvent, RazorpayFireResult } from '../../types.js';

function buildPaymentPayload(orderId: string, paymentId: string, event: RazorpayEvent) {
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

function buildRefundPayload(refundId: string, paymentId: string, event: RazorpayRefundEvent) {
  return {
    event,
    payload: {
      refund: {
        entity: {
          id: refundId,
          ...(paymentId ? { payment_id: paymentId } : {}),
        },
      },
    },
  };
}

async function postToRazorpayWebhook(body: string, secret: string, nexusBaseUrl: string): Promise<RazorpayFireResult> {
  const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const res = await fetch(`${nexusBaseUrl}/api/webhook/razorpay`, {
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

export async function fireRazorpayWebhook(
  orderId: string,
  paymentId: string,
  event: RazorpayEvent,
): Promise<RazorpayFireResult> {
  const { nexusBaseUrl } = getSettings();
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured in .env');
  const body = JSON.stringify(buildPaymentPayload(orderId, paymentId, event));
  return postToRazorpayWebhook(body, secret, nexusBaseUrl);
}

export async function fireRazorpayRefundWebhook(
  refundId: string,
  paymentId: string,
  event: RazorpayRefundEvent,
): Promise<RazorpayFireResult> {
  const { nexusBaseUrl } = getSettings();
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured in .env');
  const body = JSON.stringify(buildRefundPayload(refundId, paymentId, event));
  return postToRazorpayWebhook(body, secret, nexusBaseUrl);
}
