import type { Booking, LifecycleData } from '../types';
import { useWebhookSimulator } from '../hooks/useWebhookSimulator';
import { Btn, BtnPrimary } from '../styles/common.styles';
import {
  WebhookPanelWrap,
  PanelSection,
  PanelSectionTitle,
  StepButtons,
  StepBtn,
  RunRow,
  DelayLabel,
  DelayInput,
  ProgressList,
  ProgressStep,
  ProgressStatusOk,
  ProgressStatusErr,
  ProgressStepLabel,
  ProgressStepCode,
  PanelError,
} from '../styles/WebhookPanel.styles';

interface Props {
  booking: Booking;
  lifecycleData: LifecycleData | null;
  onRefresh: () => void;
}

export default function WebhookPanel({ booking, lifecycleData, onRefresh }: Props) {
  const {
    steps,
    running,
    firingEvent,
    error,
    delayMs,
    setDelayMs,
    fireEvent,
    runLifecycle,
    clearSteps,
  } = useWebhookSimulator(booking, onRefresh);

  const lifecycleSteps = lifecycleData?.lifecycles[booking.vendor] ?? [];
  const sideEvents = lifecycleData?.sideEvents[booking.vendor] ?? [];
  const anyBusy = running || firingEvent !== null;

  return (
    <WebhookPanelWrap>
      {lifecycleSteps.length > 0 && (
        <PanelSection>
          <PanelSectionTitle>Lifecycle</PanelSectionTitle>
          <StepButtons>
            {lifecycleSteps.map((step) => (
              <StepBtn
                key={step.event}
                $firing={firingEvent === step.event}
                disabled={anyBusy}
                onClick={() => void fireEvent(step.event)}
              >
                {step.label}
              </StepBtn>
            ))}
          </StepButtons>
        </PanelSection>
      )}

      {sideEvents.length > 0 && (
        <PanelSection>
          <PanelSectionTitle>Side Events</PanelSectionTitle>
          <StepButtons>
            {sideEvents.map((step) => (
              <StepBtn
                key={step.event}
                $firing={firingEvent === step.event}
                disabled={anyBusy}
                onClick={() => void fireEvent(step.event)}
              >
                {step.label}
              </StepBtn>
            ))}
          </StepButtons>
        </PanelSection>
      )}

      <PanelSection>
        <PanelSectionTitle>Full Lifecycle</PanelSectionTitle>
        <RunRow>
          <DelayLabel>delay</DelayLabel>
          <DelayInput
            type="number"
            min={0}
            step={500}
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
            disabled={running}
          />
          <DelayLabel>ms</DelayLabel>
          <BtnPrimary onClick={() => void runLifecycle()} disabled={anyBusy}>
            {running ? 'Running…' : 'Run'}
          </BtnPrimary>
          {steps.length > 0 && !running && (
            <Btn onClick={clearSteps}>Clear</Btn>
          )}
        </RunRow>
      </PanelSection>

      {steps.length > 0 && (
        <ProgressList>
          {steps.map((step, i) => {
            const isOk = !!step.result?.ok;
            const isErr = (step.result !== undefined && !step.result.ok) || !!step.error;
            return (
              <ProgressStep key={i} $ok={isOk} $err={isErr}>
                {isOk && <ProgressStatusOk>✓</ProgressStatusOk>}
                {isErr && <ProgressStatusErr>✗</ProgressStatusErr>}
                <ProgressStepLabel>{step.label}</ProgressStepLabel>
                {step.result && <ProgressStepCode>{step.result.status}</ProgressStepCode>}
                {step.error && <ProgressStepCode>{step.error}</ProgressStepCode>}
              </ProgressStep>
            );
          })}
        </ProgressList>
      )}

      {error && <PanelError>{error}</PanelError>}
    </WebhookPanelWrap>
  );
}
