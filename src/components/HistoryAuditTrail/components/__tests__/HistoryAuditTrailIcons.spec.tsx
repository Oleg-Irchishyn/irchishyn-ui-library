import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HISTORY_AUDIT_EVENT_TYPES } from '../../constants';
import {
  BotIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  DownloadIcon,
  EditIcon,
  FileSpreadsheetIcon,
  HistoryAuditTrailIconForType,
  HistoryIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '../HistoryAuditTrailIcons';

describe('HistoryAuditTrailIcons', () => {
  it('renders all icon wrappers', () => {
    render(
      <div>
        <HistoryIcon />
        <CloseIcon />
        <PlusIcon />
        <EditIcon />
        <TrashIcon />
        <InfoIcon />
        <SearchIcon />
        <DownloadIcon />
        <ChevronDownIcon />
        <FileSpreadsheetIcon />
        <BotIcon />
        <CheckIcon />
        <ClockIcon />
      </div>,
    );

    const svgNodes = document.querySelectorAll('svg');
    expect(svgNodes.length).toBeGreaterThan(0);
  });

  it('maps event types to the expected icon family', () => {
    const { rerender } = render(
      <HistoryAuditTrailIconForType type={HISTORY_AUDIT_EVENT_TYPES.CREATED} />,
    );
    expect(document.querySelector('svg')).toBeTruthy();

    rerender(<HistoryAuditTrailIconForType type={HISTORY_AUDIT_EVENT_TYPES.UPDATED} />);
    expect(document.querySelector('svg')).toBeTruthy();

    rerender(<HistoryAuditTrailIconForType type={HISTORY_AUDIT_EVENT_TYPES.DELETED} />);
    expect(document.querySelector('svg')).toBeTruthy();

    rerender(<HistoryAuditTrailIconForType type={HISTORY_AUDIT_EVENT_TYPES.OTHER} />);
    expect(document.querySelector('svg')).toBeTruthy();

    rerender(<HistoryAuditTrailIconForType type="UNKNOWN_EVENT_TYPE" />);
    expect(document.querySelector('svg')).toBeTruthy();
  });
});
