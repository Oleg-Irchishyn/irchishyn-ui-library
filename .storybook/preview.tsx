import React from 'react';
import type { Preview } from '@storybook/react';
import App from '../src/App';

const preview: Preview = {
  decorators: [
    (Story) => (
      <App themeMode="light" padding={2}>
        <Story />
      </App>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
