import { Btn, BtnPrimary } from '../styles/common.styles';
import {
  EditorOverlay,
  EditorModal,
  EditorHeader,
  EditorTextarea,
  EditorLoading,
  EditorError,
  EditorFooter,
} from '../styles/PayloadEditor.styles';

interface Props {
  open: boolean;
  loading: boolean;
  firing: boolean;
  error: string | null;
  payloadText: string;
  eventLabel?: string;
  onTextChange: (v: string) => void;
  onFire: () => void;
  onClose: () => void;
}

export default function PayloadEditor({
  open,
  loading,
  firing,
  error,
  payloadText,
  eventLabel,
  onTextChange,
  onFire,
  onClose,
}: Props) {
  if (!open) return null;
  return (
    <EditorOverlay onClick={firing ? undefined : onClose}>
      <EditorModal onClick={(e) => e.stopPropagation()}>
        <EditorHeader>
          <span>Edit Payload{eventLabel ? ` — ${eventLabel}` : ''}</span>
          <Btn onClick={onClose} disabled={firing}>✕</Btn>
        </EditorHeader>

        {loading ? (
          <EditorLoading>Loading…</EditorLoading>
        ) : (
          <EditorTextarea
            value={payloadText}
            onChange={(e) => onTextChange(e.target.value)}
            spellCheck={false}
          />
        )}

        {error && <EditorError>{error}</EditorError>}

        <EditorFooter>
          <Btn onClick={onClose} disabled={firing}>Cancel</Btn>
          <BtnPrimary onClick={onFire} disabled={loading || firing}>
            {firing ? 'Firing…' : 'Fire'}
          </BtnPrimary>
        </EditorFooter>
      </EditorModal>
    </EditorOverlay>
  );
}
