import React from 'react';
import type { Preview } from '@storybook/react';
import App from '../src/App';

const preview: Preview = {
  globalTypes: {
    themeMode: {
      name: 'Theme',
      description: 'Global theme mode for component stories',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <App themeMode={context.globals.themeMode === 'dark' ? 'dark' : 'light'} padding={2}>
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
