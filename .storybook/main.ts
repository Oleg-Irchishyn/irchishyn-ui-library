import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (baseConfig) => {
    const existingRollupOptions = baseConfig.build?.rollupOptions;
    const existingOutput =
      existingRollupOptions?.output && !Array.isArray(existingRollupOptions.output)
        ? existingRollupOptions.output
        : undefined;
    const existingManualChunks = existingOutput?.manualChunks;
    const existingOnWarn = existingRollupOptions?.onwarn;

    return mergeConfig(baseConfig, {
      build: {
        // Storybook bundles all docs/stories together; use a higher threshold after explicit chunking.
        chunkSizeWarningLimit: 3000,
        rollupOptions: {
          ...existingRollupOptions,
          onwarn(warning, warn) {
            const message = typeof warning === 'string' ? warning : (warning.message ?? '');

            // Third-party warning from upstream libs; safe to ignore in Storybook static build.
            if (
              message.includes('Module level directives cause errors when bundled') &&
              message.includes('"use client"')
            ) {
              return;
            }

            // Storybook preview runtime uses eval internally.
            if (
              message.includes(
                'Use of eval in "node_modules/@storybook/core/dist/preview/runtime.js"',
              )
            ) {
              return;
            }

            if (typeof existingOnWarn === 'function') {
              existingOnWarn(warning, warn);
              return;
            }

            warn(warning);
          },
          output: {
            ...existingOutput,
            manualChunks(id, meta) {
              if (
                id.includes('node_modules/ag-grid-community') ||
                id.includes('node_modules/ag-grid-enterprise') ||
                id.includes('node_modules/ag-grid-react')
              ) {
                return 'vendor-ag-grid';
              }

              if (id.includes('node_modules/@mui/x-date-pickers')) {
                return 'vendor-mui-date-pickers';
              }

              if (id.includes('node_modules/@mui/')) {
                return 'vendor-mui';
              }

              if (id.includes('node_modules/lucide-react')) {
                return 'vendor-icons';
              }

              if (typeof existingManualChunks === 'function') {
                return existingManualChunks(id, meta);
              }

              return undefined;
            },
          },
        },
      },
    });
  },
};

export default config;
