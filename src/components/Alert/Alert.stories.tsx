import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';

import { AlertToastProvider, IrchishynThemeProvider, useAlertToast } from '../../providers';
import { Alert } from './Alert';
import { ALERT_SEVERITIES, ALERT_VARIANTS } from './constants';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  render: (args) => <Alert {...args} />,
  argTypes: {
    severity: {
      control: { type: 'inline-radio' },
      options: ALERT_SEVERITIES,
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ALERT_VARIANTS,
    },
    title: {
      control: { type: 'text' },
    },
    message: {
      control: { type: 'text' },
    },
    dismissible: {
      control: { type: 'boolean' },
    },
    onClose: { action: 'onClose', control: false },
    onAnimatedClose: { action: 'onAnimatedClose', control: false },
    action: { control: false },
    visible: { control: false },
  },
  args: {
    severity: 'info',
    variant: 'standard',
    title: 'Heads up',
    message: 'This is an informational message.',
    dismissible: false,
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

const ControlledVisibilityExample = () => {
  const [visible, setVisible] = useState(true);
  const logToggle = action('controlled-toggle-click');
  const logClose = action('controlled-onClose');

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          logToggle();
          setVisible((prev) => !prev);
        }}
      >
        {visible ? 'Hide' : 'Show'} Alert
      </Button>
      <Alert
        visible={visible}
        severity="info"
        title="Controlled alert"
        message="Visibility is controlled by the parent component."
        dismissible
        onClose={(event) => {
          logClose(event);
          setVisible(false);
        }}
      />
    </Stack>
  );
};

const AnimatedApiErrorExample = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const logApiError = action('api-error-caught');
  const logAnimatedClose = action('animated-onAnimatedClose');
  const logClose = action('animated-onClose');

  const simulateApiCall = async () => {
    try {
      await Promise.reject(new Error('Unable to fetch transactions. Please retry.'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected API error';
      logApiError(message);
      setErrorMessage(message);
      setOpen(true);
    }
  };

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Button variant="contained" size="small" onClick={simulateApiCall}>
        Simulate API Error
      </Button>
      <Alert
        severity="error"
        variant="filled"
        message={errorMessage}
        visible={open}
        animated
        dismissible
        onClose={(event) => {
          logClose(event);
          setOpen(false);
        }}
        onAnimatedClose={(event, reason) => {
          logAnimatedClose({ event, reason });
          setOpen(false);
        }}
        sx={{ minWidth: 360 }}
      />
    </Stack>
  );
};

const ApiCallButtons = () => {
  const { showAlert, showError, showSuccess, showInfo, showWarning } = useAlertToast();
  const logSuccess = action('toast-showSuccess');
  const logError = action('toast-showError');
  const logInfo = action('toast-showInfo');
  const logWarning = action('toast-showWarning');
  const logGeneric = action('toast-showAlert');

  const simulateApiSuccess = async () => {
    try {
      await Promise.resolve({ ok: true });
      logSuccess();
      showSuccess('Data saved successfully.', { title: 'Success', variant: 'filled' });
    } catch {
      // no-op for demo
    }
  };

  const simulateApiFailure = async () => {
    try {
      await Promise.reject(new Error('Unable to save changes.'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected API error';
      logError(message);
      showError(message, { title: 'API error', variant: 'filled' });
    }
  };

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Button variant="contained" size="small" onClick={simulateApiSuccess}>
        Simulate Success
      </Button>
      <Button variant="outlined" size="small" color="error" onClick={simulateApiFailure}>
        Simulate Error
      </Button>
      <Button
        variant="text"
        size="small"
        onClick={() => {
          logInfo();
          showInfo('Background sync started.', { variant: 'outlined' });
        }}
      >
        Show Info
      </Button>
      <Button
        variant="text"
        size="small"
        color="warning"
        onClick={() => {
          logWarning();
          showWarning('Please review pending validations.', { title: 'Warning' });
        }}
      >
        Show Warning
      </Button>
      <Button
        variant="text"
        size="small"
        onClick={() => {
          logGeneric();
          showAlert({
            severity: 'success',
            variant: 'outlined',
            title: 'Generic API',
            message: 'This toast used showAlert with explicit severity.',
          });
        }}
      >
        Show Generic
      </Button>
    </Stack>
  );
};

const CallbackInvocationExample = () => (
  <AlertToastProvider>
    <ApiCallButtons />
  </AlertToastProvider>
);

export const Default: Story = {};

export const SeverityVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Alert severity="info" title="Info" message="System information for the user." />
      <Alert severity="success" title="Success" message="Your changes were saved successfully." />
      <Alert severity="warning" title="Warning" message="Some required fields are still missing." />
      <Alert severity="error" title="Error" message="Unable to complete the request." />
    </Stack>
  ),
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Alert severity="info" variant="standard" title="Standard" message="Standard style alert." />
      <Alert severity="success" variant="filled" title="Filled" message="Filled style alert." />
      <Alert
        severity="warning"
        variant="outlined"
        title="Outlined"
        message="Outlined style alert."
      />
    </Stack>
  ),
};

export const DismissibleAndAction: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Alert
      severity="error"
      variant="outlined"
      title="Action required"
      message="Something went wrong while processing your request."
      dismissible
      action={<Button size="small">Retry</Button>}
    />
  ),
};

export const TitleAndMessageBehavior: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Alert
        severity="info"
        title="With title"
        message="Title is rendered in bold above the message body."
      />
      <Alert severity="info" message="Message-only mode. No title row is rendered." />
    </Stack>
  ),
};

export const ControlledVisibility: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `const ControlledVisibilityExample = () => {
  const [visible, setVisible] = useState(true);

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Button variant="contained" size="small" onClick={() => setVisible((prev) => !prev)}>
        {visible ? 'Hide' : 'Show'} Alert
      </Button>
      <Alert
        visible={visible}
        severity="info"
        title="Controlled alert"
        message="Visibility is controlled by the parent component."
        dismissible
        onClose={() => setVisible(false)}
      />
    </Stack>
  );
};`,
        language: 'tsx',
      },
    },
  },
  render: () => <ControlledVisibilityExample />,
};

export const ThemeCompatibility: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Light
        </Typography>
        <IrchishynThemeProvider mode="light">
          <Stack spacing={1}>
            <Alert severity="info" title="Info" message="Theme-aware info message." />
            <Alert severity="success" variant="filled" message="Theme-aware success message." />
            <Alert
              severity="warning"
              variant="outlined"
              dismissible
              message="Theme-aware warning message."
            />
          </Stack>
        </IrchishynThemeProvider>
      </Box>

      <Box sx={{ p: 2, borderRadius: 1, backgroundColor: '#111827' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#E5E7EB' }}>
          Dark
        </Typography>
        <IrchishynThemeProvider mode="dark">
          <Stack spacing={1}>
            <Alert severity="info" title="Info" message="Theme-aware info message." />
            <Alert severity="success" variant="filled" message="Theme-aware success message." />
            <Alert
              severity="warning"
              variant="outlined"
              dismissible
              message="Theme-aware warning message."
            />
          </Stack>
        </IrchishynThemeProvider>
      </Box>
    </Stack>
  ),
};

export const AnimatedPopupOnError: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `const AnimatedApiErrorExample = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const simulateApiCall = async () => {
    try {
      await Promise.reject(new Error('Unable to fetch transactions. Please retry.'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected API error';
      setErrorMessage(message);
      setOpen(true);
    }
  };

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Button variant="contained" size="small" onClick={simulateApiCall}>
        Simulate API Error
      </Button>
      <Alert
        severity="error"
        variant="filled"
        message={errorMessage}
        visible={open}
        animated
        dismissible
        onClose={() => setOpen(false)}
        onAnimatedClose={() => setOpen(false)}
        sx={{ minWidth: 360 }}
      />
    </Stack>
  );
};`,
        language: 'tsx',
      },
    },
  },
  render: () => <AnimatedApiErrorExample />,
};

export const AnimatedOptions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Box
      sx={{
        minHeight: 260,
        pt: 2,
        pb: 7,
        px: 2,
        borderRadius: 1,
        backgroundColor: 'background.default',
      }}
    >
      <Alert
        animated
        visible
        severity="success"
        title="Slide from right side"
        message="Default animated behavior: top-right anchor, slide in from the right."
        autoHideDuration={null}
        dismissible
      />
      <Alert
        animated
        visible
        severity="info"
        variant="outlined"
        title="Custom placement and direction"
        message="Bottom-left anchor with upward slide and custom timeout."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        animatedSlideDirection="up"
        animatedTransitionProps={{ timeout: 500 }}
        autoHideDuration={null}
        dismissible
      />
    </Box>
  ),
};

export const CallbackToastApi: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `const ApiCallButtons = () => {
  const { showError, showSuccess, showInfo } = useAlertToast();

  const simulateApiSuccess = async () => {
    try {
      await Promise.resolve({ ok: true });
      showSuccess('Data saved successfully.', { title: 'Success', variant: 'filled' });
    } catch {
      // no-op for demo
    }
  };

  const simulateApiFailure = async () => {
    try {
      await Promise.reject(new Error('Unable to save changes.'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected API error';
      showError(message, { title: 'API error', variant: 'filled' });
    }
  };

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Button variant="contained" size="small" onClick={simulateApiSuccess}>Simulate Success</Button>
      <Button variant="outlined" size="small" color="error" onClick={simulateApiFailure}>Simulate Error</Button>
      <Button variant="text" size="small" onClick={() => showInfo('Background sync started.', { variant: 'outlined' })}>
        Show Info
      </Button>
    </Stack>
  );
};

const CallbackInvocationExample = () => (
  <AlertToastProvider>
    <ApiCallButtons />
  </AlertToastProvider>
);`,
        language: 'tsx',
      },
    },
  },
  render: () => <CallbackInvocationExample />,
};
