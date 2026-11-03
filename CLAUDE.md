# Irchishyn UI Library — Development Guidelines

These rules apply to **every session**. Follow them for all new components and when modifying existing ones.

## Development Commands

```bash
pnpm install                  # install dependencies
pnpm run dev                  # start Storybook dev server (http://localhost:6006)
pnpm run build                # build library → dist/
pnpm run test                 # run unit tests (Vitest)
pnpm run test:watch           # unit tests in watch mode
pnpm run test:coverage        # unit tests + coverage report → coverage/index.html
pnpm run test:e2e             # run all Playwright e2e tests
pnpm run test:e2e:smoke       # smoke tests only
pnpm run test:e2e:ui          # Playwright interactive UI mode
pnpm run type-check           # TypeScript type check (no emit)
pnpm run lint                 # ESLint
pnpm run format               # Prettier (write)
pnpm run build-storybook      # build static Storybook → storybook-static/
```

---

## Reference implementation

**`src/components/HistoryAuditTrail`** is the canonical example. Study it before building or refactoring anything.

```
src/components/HistoryAuditTrail/
├── HistoryAuditTrail.tsx           # Root component — pure, no logic
├── HistoryAuditTrail.stories.tsx   # Storybook stories (all meaningful states)
├── HistoryAuditTrail.docs.mdx      # Docs story (import, quick start, props table)
├── index.ts                        # Barrel export
├── styles.ts                       # MUI sx style objects / style functions
├── types.ts                        # All TypeScript interfaces and types
├── useHistoryAuditTrail.ts         # Primary hook — all state and derived logic
├── utils.ts                        # Pure utility functions (no React imports)
├── constants/                      # One file per constant group + index.ts barrel
│   ├── historyAuditColumnIds.ts
│   ├── historyAuditDetails.ts
│   ├── historyAuditEventTypes.ts
│   ├── historyAuditLabels.ts
│   ├── historyAuditLayout.ts
│   ├── historyAuditModules.ts
│   ├── historyAuditRenderModes.ts
│   └── index.ts
├── components/                     # Sub-components (pure, callback-based)
│   ├── HistoryAuditTrailHeader.tsx
│   ├── HistoryAuditTrailTable.tsx
│   ├── HistoryAuditTrailEmpty.tsx
│   ├── HistoryAuditTrailError.tsx
│   ├── HistoryAuditTrailLoader.tsx
│   ├── styles.ts
│   ├── __tests__/
│   │   ├── HistoryAuditTrailHeader.spec.tsx
│   │   └── styles.spec.ts
│   └── columns/                    # Nested sub-components follow the same pattern
│       ├── HistoryAuditActivityColumns.tsx
│       ├── styles.ts
│       ├── index.ts
│       └── __tests__/
│           └── HistoryAuditActivityColumns.spec.tsx
└── __tests__/                      # Tests for root-level files
    ├── HistoryAuditTrail.spec.tsx
    ├── useHistoryAuditTrail.spec.tsx
    ├── utils.spec.ts
    └── styles.spec.ts
```

---

## 1 — Pure components, callbacks only

Components must contain no business logic, no API calls, no derived state.
Pass everything via props. Event handlers must be callbacks (`onXxx`).

```tsx
// CORRECT — component is a pure rendering unit
export const MyComponent = ({ items, onItemClick, onClear }: MyComponentProps) => {
  const { rowData, handleClick } = useMyComponent({ items, onItemClick, onClear });
  return <Box>{rowData.map(...)}</Box>;
};

// WRONG — logic inside a component
export const MyComponent = ({ rawData }: { rawData: ApiResponse }) => {
  const items = rawData.map(...); // belongs in a hook or util
};
```

---

## 2 — Logic in hooks, pure functions in utils

- **Hooks (`useXxx.ts`)** — state, derived values, event handlers, callbacks wired together.
- **Utils (`utils.ts`)** — pure, stateless functions with no React imports. Formatting, transformations, calculations.
- A component file imports from its hook. A hook may import from utils.

---

## 3 — Types in `types.ts`, constants in `constants/`

- All TypeScript interfaces, types, and union types → `types.ts` in the component folder.
- Constants → `constants/` folder, one file per logical group, re-exported from `constants/index.ts`.
- Derive union types from `as const` objects using `typeof CONSTANT[keyof typeof CONSTANT]` (see `HistoryAuditTrailRenderMode`).

---

## 4 — File placement by scope

| Scope                                          | Location                                       |
| ---------------------------------------------- | ---------------------------------------------- |
| Used only by one component                     | alongside that component                       |
| Multiple hooks in one component                | `hooks/` sub-folder with `index.ts` barrel     |
| Multiple util files in one component           | `utils/` sub-folder with `index.ts` barrel     |
| Multiple constant groups                       | `constants/` sub-folder with `index.ts` barrel |
| Hook or util shared across multiple components | `src/hooks/` or `src/utils/`                   |

---

## 5 — Providers

- New context providers go in `src/providers/`.
- Provider-specific hooks go in `src/providers/hooks/`.
- Every provider must have a co-located `__tests__/` spec file.

See `src/providers/AlertToastProvider.tsx` and `src/providers/IrchishynThemeProvider.tsx` as examples.

---

## 6 — Unit tests (Vitest)

Every component, hook, util, styles file, and provider must have a co-located `__tests__/` spec.

**When any file is modified, update its corresponding spec.**

### File naming

| Source file         | Spec file                          |
| ------------------- | ---------------------------------- |
| `ComponentName.tsx` | `__tests__/ComponentName.spec.tsx` |
| `useHookName.ts`    | `__tests__/useHookName.spec.ts`    |
| `utils.ts`          | `__tests__/utils.spec.ts`          |
| `styles.ts`         | `__tests__/styles.spec.ts`         |

### Coverage targets (from `TEST_COVERAGE.md`)

| Metric     | Target |
| ---------- | ------ |
| Statements | ≥ 95%  |
| Branches   | ≥ 89%  |
| Functions  | ≥ 97%  |
| Lines      | ≥ 96%  |

Run: `pnpm run test:coverage` — HTML report at `coverage/index.html`.

### Testing patterns

Mock child components and hooks with `vi.hoisted` to isolate the unit under test:

```tsx
// Component spec — mock the hook and all sub-components
const useMyComponentMock = vi.hoisted(() => vi.fn());
vi.mock('../useMyComponent', () => ({ useMyComponent: useMyComponentMock }));

vi.mock('../components/MySubComponent', () => ({
  MySubComponent: ({ label }: { label?: string }) => (
    <div data-testid="my-sub-component-mock">{label}</div>
  ),
}));

// Import component AFTER vi.mock calls
import { MyComponent } from '../MyComponent';

const baseHookValue = {
  rowData: [],
  handleClick: vi.fn(),
  // ... all hook return values
};

describe('MyComponent', () => {
  it('renders empty state', () => {
    useMyComponentMock.mockReturnValue({ ...baseHookValue, rowData: [] });
    render(<MyComponent items={[]} />);
    expect(screen.getByTestId('my-sub-component-mock')).toBeTruthy();
  });
});
```

Use `renderHook` from `@testing-library/react` for hook specs.
Use `data-testid` attributes for stable element selection.
Cover: default state, loading, empty, error, and all significant conditional branches.

---

## 7 — Storybook and E2E tests

Every component must have a stories file, a docs MDX file, and an E2E spec file.

### `ComponentName.stories.tsx`

One named export per meaningful state or feature variant. Required exports where applicable:

- `Default` — baseline / happy path
- `Empty` — empty data state
- `Loading` — loading spinner/skeleton state
- `Error` — error message state
- One story per major feature variant (e.g. `ExportEnabled`, `MultiModule`, `InlineMode`)
- Interactive stories using a local `useState` wrapper when callbacks affect rendering

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  argTypes: {
    onItemClick: { action: 'item clicked' },
    onClear: { action: 'cleared' },
    loading: { control: 'boolean' },
  },
  args: {
    items: sampleItems,
    loading: false,
  },
};
export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = { args: { items: sampleItems } };
export const Empty: Story = { args: { items: [] } };
export const Loading: Story = { args: { items: [], loading: true } };
export const Error: Story = { args: { items: [], error: 'Something went wrong' } };
```

### `e2e/component-name.spec.ts`

Each component must have a Playwright spec in `e2e/`. Tag smoke tests with `@smoke`.

- At minimum, cover `Default` and any state variants that have a story (`Disabled`, `Error`, `Loading`, etc.)
- Use `@smoke` on the 1–2 most critical assertions so they run in the fast smoke pass
- Use the same `iframe.html?id=components-componentname--story-name` URL pattern

```ts
import { test, expect } from '@playwright/test';

const BASE = (id: string) => `/iframe.html?id=components-mycomponent--${id}&viewMode=story`;

test.describe('MyComponent', () => {
  test('Default renders correctly @smoke', async ({ page }) => {
    await page.goto(BASE('default'));
    await expect(page.getByText('Expected text')).toBeVisible();
  });

  test('Disabled state shows disabled button @smoke', async ({ page }) => {
    await page.goto(BASE('disabled'));
    await expect(page.getByRole('button', { name: /action/i })).toBeDisabled();
  });
});
```

### `ComponentName.docs.mdx`

Provide a full Docs page using Storybook Docs blocks:

```mdx
import { ArgTypes, Canvas, Description, Meta, Subtitle, Title } from '@storybook/blocks';
import * as Stories from './ComponentName.stories';

<Meta of={Stories} />
<Title>ComponentName</Title>
<Subtitle>One-line description</Subtitle>
<Description>What it does and when to use it.</Description>

## Import

\`\`\`ts
import { ComponentName } from '@oleg-irchishyn/irchishyn-ui-library';
\`\`\`

## Quick start

...minimal working example...

## States

- **Loading**: ...
- **Empty**: ...
- **Error**: ...

<Canvas of={Stories.Default} />
<Canvas of={Stories.Empty} />
<Canvas of={Stories.Loading} />
<Canvas of={Stories.Error} />

## Props

<ArgTypes of={Stories.Default} />
```

---

## PR naming conventions

PR titles are parsed by **semantic-release** (see `.github/workflows/ci.yml` release job) to automatically bump the `@oleg-irchishyn/irchishyn-ui-library` package version on every merge to `main`. Getting the prefix wrong means the wrong version is published — or no release happens at all.

| Type    | Format                                 | Example                                              | Version bump |
| ------- | -------------------------------------- | ---------------------------------------------------- | ------------ |
| Feature | `feat: [TASK]: [FE-1111]: Description` | `feat: [TASK]: [FE-2341]: Add DateRangePicker`       | **minor**    |
| Bug fix | `fix: [Issue-1111]: [FE] Description`  | `fix: [Issue-4412]: [FE] Fix disabled Browse button` | **patch**    |

**Rules:**

- Always start with `feat:` or `fix:` — semantic-release keys off this prefix
- Include the ticket/issue reference so the changelog is traceable
- Breaking changes: add `BREAKING CHANGE:` in the PR body (not the title) to trigger a **major** bump

---

## Checklist before marking a task done

- [ ] Component is pure — no logic, only JSX and a hook call
- [ ] All logic is in `useComponentName.ts` (or `hooks/` folder for multiple hooks)
- [ ] Pure helpers are in `utils.ts` (or `utils/` folder)
- [ ] All types are in `types.ts`
- [ ] Constants are in `constants/` folder with `index.ts` barrel
- [ ] Styles are in `styles.ts`
- [ ] Sub-components are in `components/` subfolder
- [ ] Multiple hooks/utils/constants use sub-folders with `index.ts` barrels
- [ ] Shared hooks/utils are in `src/hooks/` or `src/utils/`
- [ ] New providers are in `src/providers/` with unit tests
- [ ] Every modified file has an updated `__tests__/` spec
- [ ] Coverage targets still met (`pnpm run test:coverage`)
- [ ] Stories cover all meaningful states and feature variants
- [ ] Docs MDX exists with `<Title>`, import snippet, quick start, `<Canvas>` per story, and `<ArgTypes>`
- [ ] E2E spec exists in `e2e/` covering Default and key variant stories, with `@smoke` tags on critical assertions
- [ ] `pnpm run test:e2e:smoke` passes
- [ ] `pnpm run lint` passes with no errors
- [ ] `pnpm run type-check` passes with no errors
- [ ] `pnpm run format` applied (no unformatted files)
