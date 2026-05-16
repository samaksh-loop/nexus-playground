import { useState } from 'react';
import type { Booking, LifecycleData, WebhookHistoryEntry } from '../types';
import { VENDOR_COLORS, VENDOR_LABELS, STATUS_COLORS } from '../constants';
import { BtnDanger, InlineMuted } from '../styles/common.styles';
import {
  BookingCardWrap,
  CardHeader,
  VendorBadge,
  BookingId,
  StatusBadge,
  CardBody,
  MetaGrid,
  MetaItem,
  MetaLabel,
  MetaValue,
  ExpandBar,
  ExpandBtn,
  WebhookHistory,
  HistoryTable,
  HistoryTh,
  HistoryTr,
  HistoryTd,
  HistoryMono,
  HistoryBodyCell,
  TextOk,
  TextErr,
} from '../styles/BookingCard.styles';
import WebhookPanel from './WebhookPanel';

interface HistoryProps {
  history: WebhookHistoryEntry[];
}

function WebhookHistorySection({ history }: HistoryProps) {
  if (history.length === 0) {
    return <InlineMuted>No webhook events fired yet.</InlineMuted>;
  }
  return (
    <WebhookHistory>
      <HistoryTable>
        <thead>
          <tr>
            <HistoryTh>Event</HistoryTh>
            <HistoryTh>Fired At</HistoryTh>
            <HistoryTh>Status</HistoryTh>
            <HistoryTh>Response</HistoryTh>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, i) => (
            <HistoryTr key={i}>
              <HistoryTd>
                <HistoryMono>{entry.label}</HistoryMono>
              </HistoryTd>
              <HistoryTd>
                <HistoryMono>{new Date(entry.firedAt).toLocaleTimeString()}</HistoryMono>
              </HistoryTd>
              <HistoryTd>
                {entry.result.ok ? (
                  <TextOk>✓ {entry.result.status}</TextOk>
                ) : (
                  <TextErr>✗ {entry.result.status}</TextErr>
                )}
              </HistoryTd>
              <HistoryTd>
                <HistoryBodyCell>{entry.result.body ?? '—'}</HistoryBodyCell>
              </HistoryTd>
            </HistoryTr>
          ))}
        </tbody>
      </HistoryTable>
    </WebhookHistory>
  );
}

interface Props {
  booking: Booking;
  lifecycleData: LifecycleData | null;
  onDelete: () => void;
  onRefresh: () => void;
}

export default function BookingCard({ booking, lifecycleData, onDelete, onRefresh }: Props) {
  const [showHistory, setShowHistory] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  const vendorColor = VENDOR_COLORS[booking.vendor];
  const vendorLabel = VENDOR_LABELS[booking.vendor];
  const statusColor = STATUS_COLORS[booking.status] ?? '#6b7280';

  return (
    <BookingCardWrap>
      <CardHeader>
        <VendorBadge $color={vendorColor}>{vendorLabel}</VendorBadge>
        <BookingId>{booking.partnerBookingId}</BookingId>
        <StatusBadge $color={statusColor}>{booking.status}</StatusBadge>
        <BtnDanger onClick={onDelete} title="Delete booking">✕</BtnDanger>
      </CardHeader>

      <CardBody>
        <MetaGrid>
          {booking.patientName && (
            <MetaItem>
              <MetaLabel>Patient</MetaLabel>
              <MetaValue>{booking.patientName}</MetaValue>
            </MetaItem>
          )}
          {booking.patientPhone && (
            <MetaItem>
              <MetaLabel>Phone</MetaLabel>
              <MetaValue>{booking.patientPhone}</MetaValue>
            </MetaItem>
          )}
          {booking.collectionDate && (
            <MetaItem>
              <MetaLabel>Date</MetaLabel>
              <MetaValue>{booking.collectionDate}</MetaValue>
            </MetaItem>
          )}
          {booking.collectionSlot && (
            <MetaItem>
              <MetaLabel>Slot</MetaLabel>
              <MetaValue>{booking.collectionSlot}</MetaValue>
            </MetaItem>
          )}
          {booking.nexusReferenceId && (
            <MetaItem>
              <MetaLabel>Nexus Ref</MetaLabel>
              <MetaValue>{booking.nexusReferenceId}</MetaValue>
            </MetaItem>
          )}
          <MetaItem>
            <MetaLabel>Created</MetaLabel>
            <MetaValue>{new Date(booking.createdAt).toLocaleString()}</MetaValue>
          </MetaItem>
        </MetaGrid>

        <ExpandBar>
          <ExpandBtn
            $open={showHistory}
            onClick={() => setShowHistory((h) => !h)}
          >
            {showHistory ? '▾' : '▸'} History ({booking.webhookHistory.length})
          </ExpandBtn>
          <ExpandBtn
            $open={showSimulator}
            onClick={() => setShowSimulator((s) => !s)}
          >
            {showSimulator ? '▾' : '▸'} Simulate
          </ExpandBtn>
        </ExpandBar>

        {showHistory && <WebhookHistorySection history={booking.webhookHistory} />}
        {showSimulator && (
          <WebhookPanel
            booking={booking}
            lifecycleData={lifecycleData}
            onRefresh={onRefresh}
          />
        )}
      </CardBody>
    </BookingCardWrap>
  );
}
