## Gen2Verse.UI.Library

Gen2Verse UI component library built with **React** + **MUI**. Components are developed and previewed in **Storybook** and can be consumed by other apps as a Node module.

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install

```bash
npm install
```

### Run (Storybook dev server)

Use the `dev` script (no need to run `storybook` directly):

```bash
npm run dev
```

Storybook runs on `http://localhost:6006`.

### Docs

Each component can include a dedicated **Docs** page (MDX) in Storybook showing import/usage examples and a props table.

### Build library (outputs `dist/`)

```bash
npm run build
```

### Type-check

```bash
npm run type-check
```

### Test

```bash
npm run test
npm run test:watch
```

### Test coverage

```bash
npm run test:coverage
```

Coverage summary is generated in `TEST_COVERAGE.md`, with HTML details in `coverage/index.html`.

### Build Storybook (static)

```bash
npm run build-storybook
```

### Lint / format

```bash
npm run lint
npm run type-check
npm run format
```

### Version and publish

Update after resolving bugfixes or small issues:

```bash
npm version patch
```

Update after adding new features without breaking changes:

```bash
npm version minor
```

Update after adding new features with breaking changes:

```bash
npm version major
```

Publish (uses your configured npm registry, e.g. Azure Artifacts):

```bash
npm publish --access public
```

### Use in another repo (installed package)

```bash
npm install @gen2fund/gen2verse-ui-library@latest
```

### E2E Tests (Playwright)

Playwright is used for e2e testing against the Storybook dev server.

**Prerequisites (first time only):**

```bash
npx playwright install chromium
```

**Run all e2e tests:**

```bash
npm run test:e2e
```

**Run smoke tests only:**

```bash
npm run test:e2e:smoke
```

**Open interactive UI mode:**

```bash
npm run test:e2e:ui
```

**Run with visible browser:**

```bash
npm run test:e2e:headed
```

Test results and HTML report are output to `e2e-results/`.
