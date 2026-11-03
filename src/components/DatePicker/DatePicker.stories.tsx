import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Stack, Typography } from '@mui/material';

import { IrchishynThemeProvider } from '../../providers';
import { DATE_PICKER_VARIANTS } from './constants';
import { DatePicker } from './DatePicker';
import type { DatePickerProps, DateRange, QuickSelectOption } from './types';
import { getDefaultQuickSelectOptions } from './utils';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  decorators: [
    (Story) => (
      <IrchishynThemeProvider mode="light">
        <Box sx={{ p: 2, maxWidth: 420 }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

const SingleDateStory = () => {
  const [value, setValue] = useState<Date | null>(new Date('2026-04-06T12:00:00.000Z'));
  const minDate = new Date('2020-01-01T12:00:00.000Z');
  const maxDate = new Date('2035-12-31T12:00:00.000Z');

  return (
    <Stack spacing={1}>
      <DatePicker
        variant={DATE_PICKER_VARIANTS.SINGLE}
        label="Notice Date"
        value={value}
        onChange={setValue}
        minDate={minDate}
        maxDate={maxDate}
      />
      <Typography variant="caption" color="text.secondary">
        Allowed range: 01/01/2020 - 12/31/2035.
      </Typography>
    </Stack>
  );
};

const QuickSelectStory = () => {
  const quickSelectOptions = useMemo<QuickSelectOption[]>(() => getDefaultQuickSelectOptions(), []);
  const [value, setValue] = useState<DateRange | QuickSelectOption | null>(
    quickSelectOptions[2] ?? null,
  );

  return (
    <Stack spacing={1}>
      <DatePicker
        variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
        label="Date Range"
        value={value}
        quickSelectOptions={quickSelectOptions}
        onChange={(_resolvedRange, nextValue) => {
          setValue(nextValue);
        }}
      />
      <Typography variant="caption" color="text.secondary">
        Supports presets and custom From/To date values.
      </Typography>
    </Stack>
  );
};

const DarkModeStory = () => {
  const quickSelectOptions = getDefaultQuickSelectOptions();
  const [value, setValue] = useState<DateRange | QuickSelectOption | null>(null);

  return (
    <DatePicker
      variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
      label="Date Range"
      value={value}
      quickSelectOptions={quickSelectOptions}
      onChange={(_resolvedRange, nextValue) => setValue(nextValue)}
    />
  );
};

const ErrorStateStory = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [showError, setShowError] = useState(false);

  return (
    <Stack spacing={1}>
      <DatePicker
        variant={DATE_PICKER_VARIANTS.SINGLE}
        label="Notice Date"
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
          if (nextValue) {
            setShowError(false);
          }
        }}
        required
        error={showError}
        helperText={showError ? 'Date is required' : undefined}
      />
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          if (!value) {
            setShowError(true);
          }
        }}
      >
        Submit
      </Button>
    </Stack>
  );
};

const RangeValidationStory = () => {
  const [value, setValue] = useState<Date | null>(new Date('2026-06-15T12:00:00.000Z'));
  const minDate = new Date('2026-01-01T12:00:00.000Z');
  const maxDate = new Date('2026-12-31T12:00:00.000Z');

  return (
    <Stack spacing={1}>
      <DatePicker
        variant={DATE_PICKER_VARIANTS.SINGLE}
        label="Notice Date"
        value={value}
        onChange={setValue}
        minDate={minDate}
        maxDate={maxDate}
      />
      <Typography variant="caption" color="text.secondary">
        Allowed range: 01/01/2026 - 12/31/2026. Out-of-range dates are disabled and typing outside
        this range shows validation error.
      </Typography>
    </Stack>
  );
};

const CustomFormatStory = () => {
  const [value, setValue] = useState<Date | null>(new Date('2026-04-06T12:00:00.000Z'));

  return (
    <Stack spacing={1}>
      <DatePicker
        variant={DATE_PICKER_VARIANTS.SINGLE}
        label="Notice Date"
        value={value}
        onChange={setValue}
        dateFormat="dd/MM/yyyy"
      />
      <Typography variant="caption" color="text.secondary">
        Custom format demo: DD/MM/YYYY.
      </Typography>
    </Stack>
  );
};

const PlaceholdersStory = () => {
  const quickSelectOptions = useMemo<QuickSelectOption[]>(() => getDefaultQuickSelectOptions(), []);
  const [singleValue, setSingleValue] = useState<Date | null>(null);
  const [quickValue, setQuickValue] = useState<DateRange | QuickSelectOption | null>(null);

  return (
    <Stack spacing={1.5}>
      <DatePicker
        variant={DATE_PICKER_VARIANTS.SINGLE}
        label="Notice Date"
        value={singleValue}
        onChange={setSingleValue}
        placeholder="Select Notice Date"
      />
      <DatePicker
        variant={DATE_PICKER_VARIANTS.QUICK_SELECT}
        label="Date Range"
        value={quickValue}
        quickSelectOptions={quickSelectOptions}
        onChange={(_resolvedRange, nextValue) => setQuickValue(nextValue)}
        placeholder="Select Date Range"
      />
      <Typography variant="caption" color="text.secondary">
        Placeholder demo for single date and quick select variants.
      </Typography>
    </Stack>
  );
};

const PropsStory = (args: DatePickerProps) => <DatePicker {...args} />;

export const SingleDate: Story = {
  render: SingleDateStory,
};

export const QuickSelect: Story = {
  render: QuickSelectStory,
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <IrchishynThemeProvider mode="dark">
        <Box sx={{ p: 2, maxWidth: 420, bgcolor: 'background.default' }}>
          <Story />
        </Box>
      </IrchishynThemeProvider>
    ),
  ],
  render: DarkModeStory,
};

export const ErrorState: Story = {
  render: ErrorStateStory,
};

export const RangeValidation: Story = {
  render: RangeValidationStory,
};

export const CustomFormat: Story = {
  render: CustomFormatStory,
};

export const Placeholders: Story = {
  render: PlaceholdersStory,
};

export const Props: Story = {
  render: PropsStory,
  args: {
    variant: DATE_PICKER_VARIANTS.SINGLE,
    label: 'Notice Date',
    value: new Date('2026-04-06T12:00:00.000Z'),
    onChange: () => {},
    placeholder: 'Select Notice Date',
    required: false,
    disabled: false,
  },
};
