import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@gen2fund/platform.style': path.resolve(
        __dirname,
        'src/__tests__/mocks/platformStyleMock.ts',
      ),
      '@mui/material/useMediaQuery': path.resolve(
        __dirname,
        'node_modules/@mui/material/node/useMediaQuery/index.js',
      ),
      '@mui/material/styles': path.resolve(
        __dirname,
        'node_modules/@mui/material/node/styles/index.js',
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/__tests__/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/__tests__/**',
        '**/index.ts',
        '**/types.ts',
        '**/constants/**',
        '**/constants.ts',
        '**/*.constants.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
