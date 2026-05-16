import styled from 'styled-components';

export const WebhookPanelWrap = styled.div`
  margin-top: 0.6rem;
  border-top: 1px solid var(--border);
  padding-top: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const PanelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const PanelSectionTitle = styled.p`
  margin: 0;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const StepButtons = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
`;

export const StepBtn = styled.button<{ $firing?: boolean }>`
  padding: 0.25rem 0.65rem;
  font-size: 0.78rem;
  border: 1px solid ${({ $firing }) => ($firing ? '#2563eb' : 'var(--border)')};
  border-radius: 4px;
  background: var(--code-bg);
  color: ${({ $firing }) => ($firing ? '#2563eb' : 'var(--text-h)')};
  opacity: ${({ $firing }) => ($firing ? '0.7' : '1')};
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;

  &:hover:not(:disabled) {
    border-color: #2563eb;
    color: #2563eb;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const RunRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const DelayLabel = styled.span`
  font-size: 0.78rem;
  color: var(--text);
`;

export const DelayInput = styled.input`
  width: 72px;
  padding: 0.25rem 0.45rem;
  font-size: 0.78rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text-h);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

export const ProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const ProgressStep = styled.div<{ $ok?: boolean; $err?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  background: ${({ $ok, $err }) =>
    $ok ? '#f0fdf4' : $err ? '#fef2f2' : 'var(--code-bg)'};

  @media (prefers-color-scheme: dark) {
    background: ${({ $ok, $err }) =>
      $ok ? '#052e16' : $err ? '#450a0a' : 'var(--code-bg)'};
  }
`;

export const ProgressStatusOk = styled.span`
  color: #16a34a;
  font-weight: 700;
  font-size: 0.7rem;

  @media (prefers-color-scheme: dark) {
    color: #4ade80;
  }
`;

export const ProgressStatusErr = styled.span`
  color: #dc2626;
  font-weight: 700;
  font-size: 0.7rem;

  @media (prefers-color-scheme: dark) {
    color: #fca5a5;
  }
`;

export const ProgressStepLabel = styled.span`
  color: var(--text-h);
  flex: 1;
`;

export const ProgressStepCode = styled.span`
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.72rem;
  color: var(--text);
`;

export const PanelError = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #dc2626;

  @media (prefers-color-scheme: dark) {
    color: #fca5a5;
  }
`;
