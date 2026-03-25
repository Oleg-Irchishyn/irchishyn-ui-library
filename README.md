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

---

### Migrating from npm to pnpm (existing clones)

This repo was migrated from npm to pnpm 9. If you had this repo cloned and were using `npm`, follow these steps once after pulling this branch:

**Step 1 — Install pnpm 9**

```bash
npm install -g pnpm@9
```

Or via Corepack (Node.js built-in):

```bash
corepack enable
corepack prepare pnpm@9 --activate
```

**Step 2 — Remove the old npm artifacts**

```bash
# Remove npm's node_modules and lock file
rm -rf node_modules
rm package-lock.json   # already deleted in this repo; skip if missing
```

**Step 3 — Authenticate to Azure Artifacts (first time only)**

pnpm reads the same `.npmrc` as npm, so your existing auth token works. If you have not authenticated yet:

```bash
# Option A — Azure CLI
az artifacts npm login --registry https://pkgs.dev.azure.com/gen2fundprod/_packaging/gen2fund-packages/npm/registry/

# Option B — vsts-npm-auth (Windows)
vsts-npm-auth -config .npmrc
```

**Step 4 — Install dependencies**

```bash
pnpm install
```

pnpm creates `node_modules/` and a `pnpm-lock.yaml` (already committed). Do **not** commit a new `package-lock.json`.

**Step 5 — Verify everything works**

```bash
pnpm run dev          # Storybook should open on http://localhost:6006
pnpm run test         # All unit tests should pass
pnpm run type-check   # No TypeScript errors
```

**What changed and why**

| Change | Detail |
|---|---|
| `package-lock.json` removed | Replaced by `pnpm-lock.yaml` |
| `packageManager` field added | Enforces pnpm 9 via Corepack / engines check |
| `engines.pnpm` set | Fails fast if wrong pnpm version is used |
| `pnpm.overrides` pins `@mui/material: ^5` | Prevents pnpm from auto-resolving MUI v7 (which broke all tests) |
| `.npmrc` hoist patterns | pnpm strict mode requires explicit hoisting for `@types/*`, `@mui/*`, `@emotion/*`, `react`, `react-dom`, `@storybook/*` |
| CI pipeline updated | All 4 stages (Build, Test, E2E, Release) use `pnpm install --frozen-lockfile` and `pnpm dlx` |
