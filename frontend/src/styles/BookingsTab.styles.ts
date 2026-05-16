import styled from 'styled-components';

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const VendorPills = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
`;

export const Pill = styled.button<{ $active?: boolean; $color?: string }>`
  padding: 0.22rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : 'var(--border)')};
  background: ${({ $active, $color }) => ($active ? ($color ?? '#2563eb') : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--text)')};
  cursor: pointer;
  font-size: 0.78rem;
  font-family: inherit;
  line-height: 1.4;

  &:hover {
    border-color: ${({ $active, $color }) => ($active ? 'transparent' : ($color ?? '#2563eb'))};
    color: ${({ $active }) => ($active ? 'white' : 'var(--text-h)')};
  }
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
