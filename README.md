## irchishyn-ui-library

Irchishyn UI component library built with **React** + **MUI**. Components are developed and previewed in **Storybook** and can be consumed by other apps as a Node module.

### Prerequisites

- Node.js `^22.14.0 || >=24.5.0`
- pnpm 9 (`npm install -g pnpm@9` or via [Corepack](https://nodejs.org/api/corepack.html))

### Install

`.npmrc` reads a GitHub token from `NODE_AUTH_TOKEN` (see [Use in another repo](#use-in-another-repo-install-as-a-node-module)). For local development of this repo any non-empty value is enough, because all dependencies are public:

```bash
export NODE_AUTH_TOKEN=dummy   # PowerShell: $env:NODE_AUTH_TOKEN = "dummy"
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

### Releases and publishing

Releases are **fully automated**. On every push to `main` the GitHub Actions workflow
([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs lint, type-check, unit tests, build, Storybook build and e2e,
then runs **semantic-release**, which bumps the version, updates `CHANGELOG.md`, creates a `vX.Y.Z` tag
and publishes the package to **GitHub Packages**.

The version bump is derived from commit / PR-title prefixes (Conventional Commits):

| Prefix                                      | Release |
| ------------------------------------------- | ------- |
| `fix:`                                      | patch   |
| `feat:`                                     | minor   |
| `feat!:` / `BREAKING CHANGE:` in the footer | major   |
| `chore:`, `docs:`, `test:`, `refactor:`     | none    |

Do **not** run `pnpm version` / `pnpm publish` by hand for normal releases (see [Manual release](#manual-release-emergency-only) for the emergency path).

The release configuration lives in [`.releaserc.json`](.releaserc.json) (branches, tag format, plugins) and the `release` job of
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) (which pins the semantic-release plugin versions).

### Manual release (emergency only)

Use this **only** if CI is unavailable. It bypasses semantic-release, so `CHANGELOG.md` is not updated and the
version can drift from the commit history (the next CI release will compute its version from git tags).

Requires `NODE_AUTH_TOKEN` set to a GitHub PAT (classic) with `write:packages`.

```bash
pnpm version patch   # bugfixes / small issues
pnpm version minor   # new features, no breaking changes
pnpm version major   # breaking changes
pnpm publish
git push --follow-tags
```

`pnpm version` creates the commit and the `vX.Y.Z` tag; pushing the tag lets semantic-release continue from it.
Add `[skip ci]` to the commit message if you do not want CI to run another release.

### One-time GitHub repository setup (maintainer)

1. **Actions permissions** — repo → _Settings → Actions → General → Workflow permissions_ → select **Read and write permissions**
   (semantic-release must push the `CHANGELOG.md` commit and tags). If `main` is branch-protected, allow GitHub Actions to bypass it.
2. **Package scope** — the package name must be `@<github-owner>/<name>`; here it is
   `@oleg-irchishyn/irchishyn-ui-library` (see `name` and `publishConfig` in `package.json`).
3. **Package access** (after the first release) — profile → _Packages_ → `irchishyn-ui-library` → _Package settings_ →
   _Manage Actions access_ (keep this repo as **Write**) and, for **other repositories** that should install it, add them under
   _Manage access_ / _Actions access_ with **Read**. Visibility follows the repo (private repo → private package).
4. `GITHUB_TOKEN` is provided automatically in CI; no extra secrets are needed.

### Use in another repo (install as a node module)

Because the package lives in GitHub Packages (not public npm), every consumer needs a registry mapping and an auth token.

**1. Create a token** (once per developer)

GitHub → _Settings → Developer settings → Personal access tokens → Tokens (classic)_ → scope **`read:packages`**
(add `repo` if the package is private and inherits repo visibility). Store it as an environment variable, never in a file:

```powershell
# PowerShell (persist for new terminals)
[Environment]::SetEnvironmentVariable("NODE_AUTH_TOKEN", "<your token>", "User")
```

```bash
# bash / zsh (add to ~/.bashrc or ~/.zshrc)
export NODE_AUTH_TOKEN=<your token>
```

**2. Add `.npmrc` to the consuming repo** (safe to commit — it contains no secret)

```ini
@oleg-irchishyn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

**3. Install**

```bash
pnpm add @oleg-irchishyn/irchishyn-ui-library@latest
```

The library has peer dependencies that the consumer must provide: `react`, `react-dom`, `@mui/material` (v5),
`@emotion/react`, `@emotion/styled`.

**4. Use**

```tsx
import { IrchishynThemeProvider, ActionButton } from '@oleg-irchishyn/irchishyn-ui-library';

export const App = () => (
  <IrchishynThemeProvider mode="light">
    <ActionButton label="Save" />
  </IrchishynThemeProvider>
);
```

**CI of a consuming repo (GitHub Actions)**

```yaml
permissions:
  contents: read
  packages: read
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: 22
  - run: pnpm install --frozen-lockfile
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

`GITHUB_TOKEN` can read the package only if the consuming repo is granted access in the package settings (step 3 above);
otherwise use a PAT stored as a repository secret.

**Local development against an unpublished build**

```bash
# in irchishyn-ui-library
pnpm run build
# in the consumer
pnpm add file:../irchishyn-ui-library
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

**Step 1 — Ensure Node.js ≥ 24.5.0 is active**

This repo requires `^22.14.0 || >=24.5.0`. If you use nvm-windows, open **PowerShell as Administrator** and run:

```powershell
nvm list
nvm use 24.14.1   # or whichever version >=24.5.0 you have installed
```

Must be run as Administrator — nvm needs elevated rights to update the Node symlink.

**Step 2 — Install pnpm 9**

```bash
npm install -g pnpm@9
```

**Step 3 — Remove the old npm artifacts**

```bash
rm -rf node_modules
rm package-lock.json   # already deleted in this repo; skip if missing
```

**Step 4 — Set `NODE_AUTH_TOKEN`**

See [Use in another repo](#use-in-another-repo-install-as-a-node-module); any non-empty value works for local development of this repo.

**Step 5 — Install dependencies**

```bash
pnpm install
```

pnpm creates `node_modules/` and a `pnpm-lock.yaml` (already committed). Do **not** commit a new `package-lock.json`.

**Step 6 — Verify everything works**

```bash
pnpm run dev          # Storybook should open on http://localhost:6006
pnpm run test         # All unit tests should pass
pnpm run type-check   # No TypeScript errors
```

**What changed and why**

| Change                                    | Detail                                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `package-lock.json` removed               | Replaced by `pnpm-lock.yaml`                                                                                             |
| `packageManager` field added              | Enforces pnpm 9 via Corepack / engines check                                                                             |
| `engines.pnpm` set                        | Fails fast if wrong pnpm version is used                                                                                 |
| `pnpm.overrides` pins `@mui/material: ^5` | Prevents pnpm from auto-resolving MUI v7 (which broke all tests)                                                         |
| `.npmrc` hoist patterns                   | pnpm strict mode requires explicit hoisting for `@types/*`, `@mui/*`, `@emotion/*`, `react`, `react-dom`, `@storybook/*` |
| CI moved to GitHub Actions                | `.github/workflows/ci.yml` replaces the former Azure pipeline; releases publish to GitHub Packages                       |
