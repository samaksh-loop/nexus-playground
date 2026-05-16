import styled from 'styled-components';

export const AppShell = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 4rem;
`;

export const AppHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const AppTitle = styled.h1`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-h);
`;

export const Tagline = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.75;
`;

export const HealthIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--text);
  padding-top: 0.2rem;
`;

export const HealthDot = styled.span<{ $status: 'online' | 'offline' | 'pending' }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
  background: ${({ $status }) =>
    $status === 'online' ? '#16a34a' : $status === 'offline' ? '#dc2626' : '#9ca3af'};
`;

export const TabBar = styled.nav`
  display: flex;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
`;

export const TabBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  margin-bottom: -1px;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? 'var(--text-h)' : 'var(--text)')};

  &:hover {
    color: var(--text-h);
  }
`;
