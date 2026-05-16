import styled from 'styled-components';

export const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.8rem;
  font-size: 0.82rem;
  font-family: inherit;
  border-radius: 5px;
  border: 1px solid var(--border);
  background: var(--code-bg);
  color: var(--text-h);
  cursor: pointer;
  font-weight: 500;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const BtnPrimary = styled(Btn)`
  background: #2563eb;
  border-color: #2563eb;
  color: white;

  &:hover {
    background: #1d4ed8;
    border-color: #1d4ed8;
    color: white;
  }
`;

export const BtnDanger = styled.button`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  padding: 0.2rem 0.35rem;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.85rem;

  &:hover {
    color: #dc2626;
  }
`;

export const EmptyState = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text);
  opacity: 0.65;
  font-size: 0.875rem;
`;

export const InlineError = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.82rem;
  color: #dc2626;

  @media (prefers-color-scheme: dark) {
    color: #fca5a5;
  }
`;

export const InlineMuted = styled.span`
  font-size: 0.82rem;
  color: var(--text);
  opacity: 0.7;
`;

export const BadgeCount = styled.span`
  background: #2563eb;
  color: white;
  border-radius: 9999px;
  font-size: 0.68rem;
  padding: 0.05rem 0.42rem;
  font-weight: 600;
`;

export const VendorDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: inline-block;
  flex-shrink: 0;
`;
