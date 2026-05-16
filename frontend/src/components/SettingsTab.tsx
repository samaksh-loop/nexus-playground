import { useState, useEffect } from 'react';
import type { Settings, SlotConfig, Vendor } from '../types';
import { VENDOR_LABELS, VENDOR_COLORS, VENDORS } from '../constants';
import { BtnPrimary, EmptyState, InlineError } from '../styles/common.styles';
import {
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
  SettingsSectionBody,
  FieldGroup,
  FieldLabel,
  FieldInput,
  SaveRow,
  SaveOk,
  SaveErr,
  VendorSlotBlock,
  VendorSlotToggle,
  VendorSlotBody,
  SlotTextarea,
} from '../styles/SettingsTab.styles';

interface Props {
  settings: Settings | null;
  slots: SlotConfig | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  save: (s: Settings) => void;
  updateVendorSlots: (vendor: Vendor, slots: unknown[]) => void;
}

export default function SettingsTab({
  settings,
  slots,
  loading,
  saving,
  error,
  success,
  save,
  updateVendorSlots,
}: Props) {
  const [urlDraft, setUrlDraft] = useState('');
  const [slotDrafts, setSlotDrafts] = useState<Partial<Record<Vendor, string>>>({});
  const [expandedVendor, setExpandedVendor] = useState<Vendor | null>(null);
  const [slotParseErrors, setSlotParseErrors] = useState<Partial<Record<Vendor, string>>>({});

  useEffect(() => {
    if (settings) setUrlDraft(settings.nexusBaseUrl);
  }, [settings]);

  useEffect(() => {
    if (slots) {
      setSlotDrafts({
        'orange-health': JSON.stringify(slots['orange-health'], null, 2),
        healthians: JSON.stringify(slots.healthians, null, 2),
        redcliffe: JSON.stringify(slots.redcliffe, null, 2),
        'ekin-care': JSON.stringify(slots['ekin-care'], null, 2),
      });
    }
  }, [slots]);

  const handleSaveSettings = () => {
    save({ nexusBaseUrl: urlDraft });
  };

  const handleSaveSlots = (vendor: Vendor) => {
    const draft = slotDrafts[vendor] ?? '';
    try {
      const parsed = JSON.parse(draft) as unknown[];
      setSlotParseErrors((prev) => ({ ...prev, [vendor]: undefined }));
      updateVendorSlots(vendor, parsed);
    } catch {
      setSlotParseErrors((prev) => ({ ...prev, [vendor]: 'Invalid JSON' }));
    }
  };

  if (loading) return <EmptyState>Loading…</EmptyState>;

  return (
    <div>
      {error && <InlineError>{error}</InlineError>}

      <SettingsSection>
        <SettingsSectionHeader>
          <SettingsSectionTitle>Nexus Base URL</SettingsSectionTitle>
        </SettingsSectionHeader>
        <SettingsSectionBody>
          <FieldGroup>
            <FieldLabel htmlFor="nexusUrl">
              The base URL of the nexus-staging server that receives webhooks.
            </FieldLabel>
            <FieldInput
              id="nexusUrl"
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="http://localhost:3000"
            />
          </FieldGroup>
          <SaveRow>
            <BtnPrimary onClick={handleSaveSettings} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </BtnPrimary>
            {success && <SaveOk>{success}</SaveOk>}
          </SaveRow>
        </SettingsSectionBody>
      </SettingsSection>

      <SettingsSection>
        <SettingsSectionHeader>
          <SettingsSectionTitle>Vendor Slots</SettingsSectionTitle>
        </SettingsSectionHeader>
        <SettingsSectionBody>
          {VENDORS.map((vendor) => (
            <VendorSlotBlock key={vendor}>
              <VendorSlotToggle
                onClick={() => setExpandedVendor((e) => (e === vendor ? null : vendor))}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: VENDOR_COLORS[vendor],
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  {VENDOR_LABELS[vendor]}
                </span>
                <span>{expandedVendor === vendor ? '▾' : '▸'}</span>
              </VendorSlotToggle>

              {expandedVendor === vendor && (
                <VendorSlotBody>
                  <SlotTextarea
                    value={slotDrafts[vendor] ?? ''}
                    onChange={(e) =>
                      setSlotDrafts((prev) => ({ ...prev, [vendor]: e.target.value }))
                    }
                    spellCheck={false}
                  />
                  {slotParseErrors[vendor] && (
                    <SaveErr>{slotParseErrors[vendor]}</SaveErr>
                  )}
                  <SaveRow>
                    <BtnPrimary
                      onClick={() => handleSaveSlots(vendor)}
                      disabled={saving}
                    >
                      {saving ? 'Saving…' : 'Save Slots'}
                    </BtnPrimary>
                  </SaveRow>
                </VendorSlotBody>
              )}
            </VendorSlotBlock>
          ))}
        </SettingsSectionBody>
      </SettingsSection>
    </div>
  );
}
