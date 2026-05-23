import styled from 'styled-components';

export const EditorOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

export const EditorModal = styled.div`
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: min(680px, 95vw);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
`;

export const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h);
`;

export const EditorTextarea = styled.textarea`
  flex: 1;
  min-height: 320px;
  max-height: 55vh;
  padding: 0.75rem 1rem;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.76rem;
  line-height: 1.55;
  border: none;
  background: var(--code-bg);
  color: var(--text-h);
  resize: none;
  outline: none;

  &:focus {
    background: var(--bg);
  }
`;

export const EditorLoading = styled.div`
  flex: 1;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  color: var(--text);
  opacity: 0.65;
`;

export const EditorError = styled.p`
  margin: 0;
  padding: 0.4rem 1rem;
  font-size: 0.78rem;
  color: #dc2626;
  background: #fef2f2;
  border-top: 1px solid #fecaca;

  @media (prefers-color-scheme: dark) {
    color: #fca5a5;
    background: #450a0a;
    border-color: #7f1d1d;
  }
`;

export const EditorFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-top: 1px solid var(--border);
`;
