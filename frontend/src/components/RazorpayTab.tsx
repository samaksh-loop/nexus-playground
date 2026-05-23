import type { RazorpayEvent, RazorpayRefundEvent } from '../types';
import { useRazorpaySimulator } from '../hooks/useRazorpaySimulator';
import { useRefundSimulator } from '../hooks/useRefundSimulator';
import { BtnPrimary, InlineError, InlineMuted } from '../styles/common.styles';
import {
  FieldGroup,
  FieldLabel,
  FieldInput,
  SaveRow,
} from '../styles/SettingsTab.styles';
import {
  RazorpayCard,
  RazorpayCardHeader,
  RazorpayLogo,
  RazorpayCardTitle,
  RazorpayCardBody,
  EventToggle,
  EventBtn,
  ResultBox,
  ResultStatus,
  ResultBody,
  CardDivider,
  SectionLabel,
} from '../styles/RazorpayTab.styles';

const PAYMENT_EVENTS: { value: RazorpayEvent; label: string }[] = [
  { value: 'order.paid', label: 'order.paid' },
  { value: 'payment.failed', label: 'payment.failed' },
];

const REFUND_EVENTS: { value: RazorpayRefundEvent; label: string }[] = [
  { value: 'refund.created', label: 'refund.created' },
  { value: 'refund.processed', label: 'refund.processed' },
  { value: 'refund.failed', label: 'refund.failed' },
  { value: 'refund.speed_changed', label: 'refund.speed_changed' },
];

export default function RazorpayTab() {
  const payment = useRazorpaySimulator();
  const refund = useRefundSimulator();

  return (
    <div>
      <RazorpayCard>
        <RazorpayCardHeader>
          <RazorpayLogo>Razorpay</RazorpayLogo>
          <RazorpayCardTitle>Simulate Webhook</RazorpayCardTitle>
        </RazorpayCardHeader>

        <RazorpayCardBody>
          <SectionLabel>Payment</SectionLabel>

          <FieldGroup>
            <FieldLabel>Event</FieldLabel>
            <EventToggle>
              {PAYMENT_EVENTS.map((e) => (
                <EventBtn
                  key={e.value}
                  $active={payment.event === e.value}
                  aria-pressed={payment.event === e.value}
                  onClick={() => payment.setEvent(e.value)}
                >
                  {e.label}
                </EventBtn>
              ))}
            </EventToggle>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="rzp-order-id">Order ID</FieldLabel>
            <FieldInput
              id="rzp-order-id"
              type="text"
              placeholder="order_abc123"
              value={payment.orderId}
              onChange={(e) => payment.setOrderId(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="rzp-payment-id">Payment ID</FieldLabel>
            <FieldInput
              id="rzp-payment-id"
              type="text"
              placeholder="pay_abc123"
              value={payment.paymentId}
              onChange={(e) => payment.setPaymentId(e.target.value)}
            />
          </FieldGroup>

          {payment.error && <InlineError>{payment.error}</InlineError>}

          <SaveRow>
            <BtnPrimary onClick={() => void payment.fire()} disabled={payment.firing}>
              {payment.firing ? 'Firing…' : 'Fire Webhook'}
            </BtnPrimary>
          </SaveRow>

          {payment.result && (
            <ResultBox $ok={payment.result.ok}>
              <ResultStatus>
                {payment.result.ok ? '✓' : '✗'} HTTP {payment.result.status}
              </ResultStatus>
              {payment.result.body && <ResultBody>{payment.result.body}</ResultBody>}
            </ResultBox>
          )}

          <CardDivider />

          <SectionLabel>Refund</SectionLabel>

          <FieldGroup>
            <FieldLabel>Event</FieldLabel>
            <EventToggle style={{ flexWrap: 'wrap' }}>
              {REFUND_EVENTS.map((e) => (
                <EventBtn
                  key={e.value}
                  $active={refund.event === e.value}
                  aria-pressed={refund.event === e.value}
                  onClick={() => refund.setEvent(e.value)}
                >
                  {e.label}
                </EventBtn>
              ))}
            </EventToggle>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="rzp-refund-id">Refund ID</FieldLabel>
            <FieldInput
              id="rzp-refund-id"
              type="text"
              placeholder="rfnd_abc123"
              value={refund.refundId}
              onChange={(e) => refund.setRefundId(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="rzp-refund-payment-id">Payment ID <InlineMuted>(optional)</InlineMuted></FieldLabel>
            <FieldInput
              id="rzp-refund-payment-id"
              type="text"
              placeholder="pay_abc123"
              value={refund.paymentId}
              onChange={(e) => refund.setPaymentId(e.target.value)}
            />
          </FieldGroup>

          {refund.error && <InlineError>{refund.error}</InlineError>}

          <SaveRow>
            <BtnPrimary onClick={() => void refund.fire()} disabled={refund.firing}>
              {refund.firing ? 'Firing…' : 'Fire Webhook'}
            </BtnPrimary>
          </SaveRow>

          {refund.result && (
            <ResultBox $ok={refund.result.ok}>
              <ResultStatus>
                {refund.result.ok ? '✓' : '✗'} HTTP {refund.result.status}
              </ResultStatus>
              {refund.result.body && <ResultBody>{refund.result.body}</ResultBody>}
            </ResultBox>
          )}
        </RazorpayCardBody>
      </RazorpayCard>
    </div>
  );
}
