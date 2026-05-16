import styled from 'styled-components';

export const BookingCardWrap = styled.div`
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 0.65rem;
  overflow: hidden;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.9rem;
  background: var(--code-bg);
`;

export const VendorBadge = styled.span<{ $color: string }>`
  padding: 0.18rem 0.55rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  color: white;
  background: ${({ $color }) => $color};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const BookingId = styled.span`
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.82rem;
  color: var(--text-h);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StatusBadge = styled.span<{ $color: string }>`
  padding: 0.18rem 0.55rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: white;
  background: ${({ $color }) => $color};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const CardBody = styled.div`
  padding: 0.7rem 0.9rem;
`;

export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0.3rem 1rem;
  margin-bottom: 0.65rem;
`;

export const MetaItem = styled.div`
  font-size: 0.8rem;
  line-height: 1.4;
`;

export const MetaLabel = styled.span`
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text);
  opacity: 0.8;
  margin-bottom: 0.05rem;
`;

export const MetaValue = styled.span`
  color: var(--text-h);
`;

export const ExpandBar = styled.div`
  display: flex;
  gap: 0.35rem;
  border-top: 1px solid var(--border);
  padding-top: 0.5rem;
  margin-top: 0.1rem;
`;

export const ExpandBtn = styled.button<{ $open?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.78rem;
  color: ${({ $open }) => ($open ? 'var(--text-h)' : 'var(--text)')};
  font-weight: ${({ $open }) => ($open ? '500' : '400')};
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: var(--border);
    color: var(--text-h);
  }
`;

export const WebhookHistory = styled.div`
  margin-top: 0.6rem;
  border-top: 1px solid var(--border);
  padding-top: 0.6rem;
`;

export const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
`;

export const HistoryTh = styled.th`
  text-align: left;
  padding: 0.25rem 0.4rem;
  color: var(--text);
  font-weight: 500;
  border-bottom: 1px solid var(--border);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const HistoryTr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }

  &:hover td {
    background: var(--code-bg);
  }
`;

export const HistoryTd = styled.td`
  padding: 0.28rem 0.4rem;
  vertical-align: top;
  border-bottom: 1px solid var(--border);
`;

export const HistoryMono = styled.span`
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.76rem;
`;

export const HistoryBodyCell = styled.div`
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.74rem;
  color: var(--text);
`;

export const TextOk = styled.span`
  color: #16a34a;
  font-weight: 600;

  @media (prefers-color-scheme: dark) {
    color: #4ade80;
  }
`;

export const TextErr = styled.span`
  color: #dc2626;
  font-weight: 600;

  @media (prefers-color-scheme: dark) {
    color: #fca5a5;
  }
`;
