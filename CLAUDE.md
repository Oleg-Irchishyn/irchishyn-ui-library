# Gen2Verse UI Library — Claude Guidance

## Reference Implementation

**`src/components/HistoryAuditTrail`** is the canonical example for how all components in this library should be structured. When building or refactoring any component, match its conventions.

---

## Component Architecture

### 1. Pure Components — Callbacks Only

Components must be pure presentational units. They:
- Receive data and callbacks via props — no internal business logic
- Do not fetch data, manage complex state, or perform side effects directly
- Delegate all logic to a co-located hook (e.g. `useHistoryAuditTrail`)

```tsx
// Good
export const MyComponent = ({ items, onItemClick }: MyComponentProps) => {
  const { rowData, handleClick } = useMyComponent({ items, onItemClick });
  return <Box>...</Box>;
};
```

### 2. Logic in Hooks and Utils

- **Hooks** (`useComponentName.ts`): stateful logic, event handlers, derived data, side effects
- **Utils** (`utils.ts`): pure, stateless functions — formatting, transformation, filtering

If a single component has multiple hooks (e.g. one per feature area), place them in a `hooks/` folder inside the component directory.

If hook or util functions are **shared across multiple components**, move them to `src/hooks/` or `src/utils/` at the library root.

### 3. Types and Constants in Dedicated Files

- `types.ts` — all TypeScript interfaces and types for the component and its sub-components
- `constants/` folder — one file per logical group of constants (e.g. `myComponentLabels.ts`, `myComponentLayout.ts`); export all via `constants/index.ts`
- If a single file is sufficient, use `constants.ts` directly

### 4. Sub-components

Break the main component into focused sub-components inside a `components/` subfolder:

```
MyComponent/
  MyComponent.tsx            ← root component, uses the hook, composes sub-components
  useMyComponent.ts          ← all logic
  utils.ts                   ← pure helpers
  types.ts                   ← all types
  styles.ts                  ← root-level MUI sx styles
  index.ts                   ← public exports
  constants/
    myComponentLabels.ts
    index.ts
  components/
    MyComponentHeader.tsx
    MyComponentTable.tsx
    styles.ts
    __tests__/
      MyComponentHeader.spec.tsx
      MyComponentTable.spec.tsx
      styles.spec.ts
  __tests__/
    MyComponent.spec.tsx
    useMyComponent.spec.tsx
    utils.spec.ts
  MyComponent.stories.tsx
  MyComponent.docs.mdx
```

---

## Multiple Hooks, Constants, or Types

| Situation | Convention |
|---|---|
| Single hook | `useComponentName.ts` at component root |
| Multiple hooks | `hooks/` folder with individual files |
| Single constants file | `constants.ts` at component root |
| Multiple constant groups | `constants/` folder, each group in its own file, all exported from `constants/index.ts` |
| Types | Always a single `types.ts` unless the type surface is very large |

---

## Providers

- New providers go in `src/providers/`
- Each provider must have unit tests in `src/providers/__tests__/` (or co-located `__tests__/`)
- See `src/providers/AlertToastProvider.tsx` and `src/providers/Gen2ThemeProvider.tsx` as examples

---

## Unit Tests (Vitest)

**Every** hook, component, util function, and provider must have unit tests.
When any of these files change, update their corresponding tests.

### Coverage Targets (from TEST_COVERAGE.md)

| Metric | Target |
|---|---|
| Statements | ≥ 95% |
| Branches | ≥ 89% |
| Functions | ≥ 97% |
| Lines | ≥ 96% |

Run coverage: `npm run test:coverage`
HTML report: `coverage/index.html`

### Test File Placement

- Tests live in a `__tests__/` folder co-located with the code they test
- Naming: `ComponentName.spec.tsx`, `useHookName.spec.tsx`, `utils.spec.ts`, `styles.spec.ts`

### What to Test

- **Components**: render output, conditional branches (loading/error/empty/data states), prop-driven behaviour, user interactions
- **Hooks**: state transitions, callbacks, side effects, edge cases
- **Utils**: all logical branches with representative inputs/outputs
- **Styles**: that style functions return the expected shape for each variant/condition
- **Providers**: context value, children rendering, hooks that consume the context

---

## Storybook Stories

Every component must have:

### 1. `ComponentName.stories.tsx`

Cover each meaningful behaviour variant:
- Default / happy path
- Loading state
- Empty state
- Error state
- Feature variants (e.g. with/without export, different render modes)
- Interactive stories with `useState` wrappers where callbacks are needed

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
};
export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = { args: { ... } };
export const Loading: Story = { args: { loading: true, ... } };
export const Empty: Story = { args: { items: [], ... } };
export const WithError: Story = { args: { error: 'Something went wrong', ... } };
```

### 2. `ComponentName.docs.mdx`

Provide a Docs page using Storybook blocks:

```mdx
import { ArgTypes, Canvas, Description, Meta, Subtitle, Title } from '@storybook/blocks';
import * as Stories from './ComponentName.stories';

<Meta of={Stories} />
<Title>ComponentName</Title>
<Subtitle>One-line description</Subtitle>
<Description>Detailed description of what the component does and when to use it.</Description>

## Import
\`\`\`ts
import { ComponentName } from '@gen2fund/gen2verse-ui-library';
\`\`\`

## Quick start
...

<Canvas of={Stories.Default} />
<ArgTypes of={Stories} />
```

---

## Checklist for New or Modified Components

- [ ] Component is pure — no logic, only props and callbacks
- [ ] Logic is in `useComponentName.ts` (or `hooks/` folder)
- [ ] Pure helpers are in `utils.ts`
- [ ] All types are in `types.ts`
- [ ] Constants are in `constants.ts` or `constants/` folder
- [ ] Styles are in `styles.ts` (MUI `sx` objects or style functions)
- [ ] Sub-components live in `components/` subfolder
- [ ] Shared hooks/utils are promoted to `src/hooks/` or `src/utils/`
- [ ] Providers are in `src/providers/`
- [ ] Unit tests exist for component, hook, utils, styles, and any sub-components
- [ ] Tests are updated if any file was changed
- [ ] Coverage meets targets (statements ≥ 95%, branches ≥ 89%, functions ≥ 97%, lines ≥ 96%)
- [ ] Stories cover all meaningful states and variants
- [ ] A Docs MDX page exists with import instructions and quick start
