import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Stack, Typography } from '@mui/material';

import { Gen2ThemeProvider } from '../../providers';
import { DateTextSelect } from './DateTextSelect';
import type { DateTextSelectOption } from './types';

const sampleOptions: DateTextSelectOption[] = [
  { value: 'keep-all', label: 'Keep All' },
  { value: 'business-days', label: 'Business Days' },
  { value: 'calendar-days', label: 'Calendar Days' },
];

const meta: Meta<typeof DateTextSelect> = {
  title: 'Components/DateTextSelect',
  component: DateTextSelect,
  decorators: [
    (Story) => (
      <Gen2ThemeProvider mode="light">
        <Box sx={{ p: 2, maxWidth: 620 }}>
          <Story />
        </Box>
      </Gen2ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DateTextSelect>;

const isWeekendDisabled = (selectValue: string) => (date: Date) => {
  if (selectValue !== 'business-days') {
    return false;
  }

  const day = date.getDay();
  return day === 0 || day === 6;
};

const DefaultStory = () => {
  const [dateValue, setDateValue] = useState<Date | null>(new Date('2026-04-06T00:00:00.000Z'));
  const [selectValue, setSelectValue] = useState('');

  return (
    <DateTextSelect
      label="Due Date Type"
      dateValue={dateValue}
      onDateChange={setDateValue}
      selectValue={selectValue}
      selectOptions={sampleOptions}
      onSelectChange={setSelectValue}
      shouldDisableDate={isWeekendDisabled(selectValue)}
    />
  );
};

const ErrorStateStory = () => {
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [selectValue, setSelectValue] = useState('');
  const [required, setRequired] = useState(false);

  return (
    <Stack spacing={1}>
      <DateTextSelect
        label="Due Date Type"
        dateValue={dateValue}
        onDateChange={setDateValue}
        selectValue={selectValue}
        selectOptions={sampleOptions}
        onSelectChange={setSelectValue}
        shouldDisableDate={isWeekendDisabled(selectValue)}
        required={required}
      />
      <Button size="small" variant="outlined" onClick={() => setRequired(true)}>
        Submit
      </Button>
    </Stack>
  );
};

const DarkModeStory = () => {
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [selectValue, setSelectValue] = useState('');

  return (
    <DateTextSelect
      label="Due Date Type"
      dateValue={dateValue}
      onDateChange={setDateValue}
      selectValue={selectValue}
      selectOptions={sampleOptions}
      onSelectChange={setSelectValue}
      shouldDisableDate={isWeekendDisabled(selectValue)}
      required
    />
  );
};

const InvalidDateStateStory = () => {
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [selectValue, setSelectValue] = useState('');
  const minDate = new Date('2026-01-01T00:00:00.000Z');
  const maxDate = new Date('2026-12-31T00:00:00.000Z');

  return (
    <Stack spacing={1}>
      <DateTextSelect
        label="Due Date Type"
        dateValue={dateValue}
        onDateChange={setDateValue}
        selectValue={selectValue}
        selectOptions={sampleOptions}
        onSelectChange={setSelectValue}
        shouldDisableDate={isWeekendDisabled(selectValue)}
        minDate={minDate}
        maxDate={maxDate}
      />
      <Typography variant="caption" color="text.secondary">
        Try entering 13/40/2026 (invalid) or 12/31/2025 (out of range). Dates outside the allowed
        range are disabled in calendar.
      </Typography>
    </Stack>
  );
};

const ConnectedDateRulesStory = () => {
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [selectValue, setSelectValue] = useState('keep-all');
  const minDate = new Date('2026-01-01T00:00:00.000Z');
  const maxDate = new Date('2026-12-31T00:00:00.000Z');

  return (
    <Stack spacing={2}>
      <DateTextSelect
        label="Due Date Type"
        dateValue={dateValue}
        onDateChange={setDateValue}
        selectValue={selectValue}
        selectOptions={sampleOptions}
        onSelectChange={setSelectValue}
        minDate={minDate}
        maxDate={maxDate}
        shouldDisableDate={isWeekendDisabled(selectValue)}
      />

      <Typography variant="caption" color="text.secondary">
        Business Days disables weekends in the DatePicker field. Calendar Days and Keep All allow
        all dates in range.
      </Typography>
    </Stack>
  );
};

const CustomFormatStory = () => {
  const [dateValue, setDateValue] = useState<Date | null>(new Date('2026-04-06T00:00:00.000Z'));
  const [selectValue, setSelectValue] = useState('keep-all');

  return (
    <Stack spacing={1}>
      <DateTextSelect
        label="Due Date Type"
        dateValue={dateValue}
        onDateChange={setDateValue}
        dateFormat="dd/MM/yyyy"
        selectValue={selectValue}
        selectOptions={sampleOptions}
        onSelectChange={setSelectValue}
        shouldDisableDate={isWeekendDisabled(selectValue)}
      />
      <Typography variant="caption" color="text.secondary">
        Custom format demo: DD/MM/YYYY.
      </Typography>
    </Stack>
  );
};

const PlaceholdersStory = () => {
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [selectValue, setSelectValue] = useState('');

  return (
    <Stack spacing={1}>
      <DateTextSelect
        label="Due Date Type"
        dateValue={dateValue}
        onDateChange={setDateValue}
        selectValue={selectValue}
        selectOptions={sampleOptions}
        onSelectChange={setSelectValue}
        datePlaceholder="Choose Notice Date"
        selectPlaceholder="Choose Date Type"
        shouldDisableDate={isWeekendDisabled(selectValue)}
      />
      <Typography variant="caption" color="text.secondary">
        Placeholder demo for DateTextSelect date and dropdown fields.
      </Typography>
    </Stack>
  );
};

export const Default: Story = {
  render: DefaultStory,
};

export const ErrorState: Story = {
  render: ErrorStateStory,
};

export const InvalidDateState: Story = {
  render: InvalidDateStateStory,
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <Gen2ThemeProvider mode="dark">
        <Box sx={{ p: 2, maxWidth: 620, bgcolor: 'background.default' }}>
          <Story />
        </Box>
      </Gen2ThemeProvider>
    ),
  ],
  render: DarkModeStory,
};

export const ConnectedDateRules: Story = {
  render: ConnectedDateRulesStory,
};

export const CustomFormat: Story = {
  render: CustomFormatStory,
};

export const Placeholders: Story = {
  render: PlaceholdersStory,
};
