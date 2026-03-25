## Gen2Verse.UI.Library

Gen2Verse UI component library built with **React** + **MUI**. Components are developed and previewed in **Storybook** and can be consumed by other apps as a Node module.

### Prerequisites

- Node.js `^22.14.0 || >=24.10.0`
- pnpm 9 (`npm install -g pnpm@9` or via [Corepack](https://nodejs.org/api/corepack.html))

### Install

```bash
pnpm install
```

### Run (Storybook dev server)

Use the `dev` script (no need to run `storybook` directly):

```bash
pnpm run dev
```

Storybook runs on `http://localhost:6006`.

### Docs

Each component can include a dedicated **Docs** page (MDX) in Storybook showing import/usage examples and a props table.

### Build library (outputs `dist/`)

```bash
pnpm run build
```

### Type-check

```bash
pnpm run type-check
```

### Test

```bash
pnpm run test
pnpm run test:watch
```

### Test coverage

```bash
pnpm run test:coverage
```

Coverage summary is generated in `TEST_COVERAGE.md`, with HTML details in `coverage/index.html`.

### Build Storybook (static)

```bash
pnpm run build-storybook
```

### Lint / format

```bash
pnpm run lint
pnpm run type-check
pnpm run format
```

### Version and publish

Update after resolving bugfixes or small issues:

```bash
pnpm version patch
```

Update after adding new features without breaking changes:

```bash
pnpm version minor
```

Update after adding new features with breaking changes:

```bash
pnpm version major
```

Publish (uses your configured npm registry, e.g. Azure Artifacts):

```bash
pnpm publish --access public
```

### Use in another repo (installed package)

```bash
pnpm add @gen2fund/gen2verse-ui-library@latest
```

### E2E Tests (Playwright)

Playwright is used for e2e testing against the Storybook dev server.

**Prerequisites (first time only):**

```bash
pnpm dlx playwright install chromium
```

**Run all e2e tests:**

```bash
pnpm run test:e2e
```

**Run smoke tests only:**

```bash
pnpm run test:e2e:smoke
```

**Open interactive UI mode:**

```bash
pnpm run test:e2e:ui
```

**Run with visible browser:**

```bash
pnpm run test:e2e:headed
```

Test results and HTML report are output to `e2e-results/`.
