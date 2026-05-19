import type { RazorpayEvent } from '../types';
import { useRazorpaySimulator } from '../hooks/useRazorpaySimulator';
import { BtnPrimary, InlineError } from '../styles/common.styles';
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
} from '../styles/RazorpayTab.styles';

const EVENTS: { value: RazorpayEvent; label: string }[] = [
  { value: 'order.paid', label: 'order.paid' },
  { value: 'payment.failed', label: 'payment.failed' },
];

export default function RazorpayTab() {
  const {
    orderId,
    setOrderId,
    paymentId,
    setPaymentId,
    event,
    setEvent,
    result,
    firing,
    error,
    fire,
  } = useRazorpaySimulator();

  return (
    <div>
      <RazorpayCard>
        <RazorpayCardHeader>
          <RazorpayLogo>Razorpay</RazorpayLogo>
          <RazorpayCardTitle>Simulate Webhook</RazorpayCardTitle>
        </RazorpayCardHeader>

        <RazorpayCardBody>
          <FieldGroup>
            <FieldLabel>Event</FieldLabel>
            <EventToggle>
              {EVENTS.map((e) => (
                <EventBtn
                  key={e.value}
                  $active={event === e.value}
                  aria-pressed={event === e.value}
                  onClick={() => setEvent(e.value)}
                >
                  {e.label}
                </EventBtn>
              ))}
            </EventToggle>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="rzp-order-id">Razorpay Order ID</FieldLabel>
            <FieldInput
              id="rzp-order-id"
              type="text"
              placeholder="order_abc123"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="rzp-payment-id">Razorpay Payment ID</FieldLabel>
            <FieldInput
              id="rzp-payment-id"
              type="text"
              placeholder="pay_abc123"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
            />
          </FieldGroup>

          {error && <InlineError>{error}</InlineError>}

          <SaveRow>
            <BtnPrimary onClick={() => void fire()} disabled={firing}>
              {firing ? 'Firing…' : 'Fire Webhook'}
            </BtnPrimary>
          </SaveRow>

          {result && (
            <ResultBox $ok={result.ok}>
              <ResultStatus>
                {result.ok ? '✓' : '✗'} HTTP {result.status}
              </ResultStatus>
              {result.body && <ResultBody>{result.body}</ResultBody>}
            </ResultBox>
          )}
        </RazorpayCardBody>
      </RazorpayCard>
    </div>
  );
}
