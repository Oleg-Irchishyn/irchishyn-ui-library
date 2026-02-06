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
