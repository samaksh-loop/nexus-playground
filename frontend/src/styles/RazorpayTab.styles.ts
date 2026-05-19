import styled from 'styled-components';

export const RazorpayCard = styled.div`
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  max-width: 560px;
`;

export const RazorpayCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: var(--code-bg);
  border-bottom: 1px solid var(--border);
`;

export const RazorpayLogo = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  background: #3395ff;
  color: white;
  padding: 0.18rem 0.55rem;
  border-radius: 4px;
`;

export const RazorpayCardTitle = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-h);
`;

export const RazorpayCardBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const EventToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const EventBtn = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.4rem 0.75rem;
  font-size: 0.82rem;
  font-family: inherit;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  border-radius: 5px;
  border: 1px solid ${({ $active }) => ($active ? '#3395ff' : 'var(--border)')};
  background: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#1d4ed8' : 'var(--text)')};
  cursor: pointer;

  @media (prefers-color-scheme: dark) {
    background: ${({ $active }) => ($active ? '#1e3a5f' : 'transparent')};
    color: ${({ $active }) => ($active ? '#93c5fd' : 'var(--text)')};
  }

  &:hover {
    border-color: #3395ff;
    color: ${({ $active }) => ($active ? '#1d4ed8' : 'var(--text-h)')};
  }
`;

export const ResultBox = styled.div<{ $ok?: boolean }>`
  padding: 0.65rem 0.75rem;
  border-radius: 5px;
  border: 1px solid ${({ $ok }) => ($ok ? '#bbf7d0' : '#fecaca')};
  background: ${({ $ok }) => ($ok ? '#f0fdf4' : '#fef2f2')};
  font-size: 0.8rem;

  @media (prefers-color-scheme: dark) {
    border-color: ${({ $ok }) => ($ok ? '#166534' : '#991b1b')};
    background: ${({ $ok }) => ($ok ? '#052e16' : '#450a0a')};
  }
`;

export const ResultStatus = styled.div`
  font-weight: 600;
  font-size: 0.82rem;
  margin-bottom: 0.3rem;
  color: var(--text-h);
`;

export const ResultBody = styled.pre`
  margin: 0;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.75rem;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 180px;
  overflow-y: auto;
`;
