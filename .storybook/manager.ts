import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Irchishyn UI component library',
  }),
  sidebar: {
    showRoots: true,
  },
  options: {
    storySort: 'alphabetical',
  },
});
