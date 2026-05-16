import styled from 'styled-components';

export const SettingsSection = styled.div`
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

export const SettingsSectionHeader = styled.div`
  padding: 0.75rem 1rem;
  background: var(--code-bg);
  border-bottom: 1px solid var(--border);
`;

export const SettingsSectionTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-h);
`;

export const SettingsSectionBody = styled.div`
  padding: 1rem;
`;

export const FieldGroup = styled.div`
  margin-bottom: 0.9rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-h);
  margin-bottom: 0.3rem;
`;

export const FieldInput = styled.input`
  width: 100%;
  max-width: 480px;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: var(--bg);
  color: var(--text-h);
  font-size: 0.875rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

export const SaveRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

export const SaveOk = styled.span`
  font-size: 0.82rem;
  color: #16a34a;

  @media (prefers-color-scheme: dark) {
    color: #4ade80;
  }
`;

export const SaveErr = styled.span`
  font-size: 0.82rem;
  color: #dc2626;

  @media (prefers-color-scheme: dark) {
    color: #fca5a5;
  }
`;

export const VendorSlotBlock = styled.div`
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

export const VendorSlotToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.55rem 0.9rem;
  background: var(--code-bg);
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h);
  text-align: left;

  &:hover {
    filter: brightness(0.97);
  }
`;

export const VendorSlotBody = styled.div`
  padding: 0.75rem 0.9rem;
`;

export const SlotTextarea = styled.textarea`
  width: 100%;
  min-height: 130px;
  padding: 0.5rem 0.65rem;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.78rem;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: var(--bg);
  color: var(--text-h);
  resize: vertical;
  margin-bottom: 0.5rem;
  display: block;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;
