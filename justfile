# irchishyn-ui-library — Task Runner
# Run `just --list` to see all available recipes

set shell := ["bash", "-cu"]

# Default recipe: list all commands
default:
    @just --list

# Install dependencies
install:
    pnpm install

# Start Storybook dev server (port 6006)
dev:
    pnpm run dev

# Build library (tsup → dist/)
build:
    pnpm run build

# Build static Storybook
build-storybook:
    pnpm run build-storybook

# Run ESLint
lint:
    pnpm run lint

# Run ESLint with auto-fix
lint-fix:
    pnpm run lint:fix

# Run Prettier (write)
format:
    pnpm run format

# Check formatting without writing
format-check:
    pnpm run format:check

# Run TypeScript type-checking
typecheck:
    pnpm run type-check

# Run unit tests
test *ARGS:
    pnpm run test -- {{ARGS}}

# Run unit tests with coverage
test-coverage:
    pnpm run test:coverage

# Run smoke E2E tests (Playwright, @smoke tag only)
test-e2e-smoke:
    pnpm run test:e2e:smoke

# Run full E2E tests (Playwright, all tests)
test-e2e:
    pnpm run test:e2e

# Clean build artifacts
clean:
    rm -rf dist coverage storybook-static test-results playwright-report

# Full quality check (lint + format-check + typecheck + test)
check: lint format-check typecheck test

# Install pre-commit and pre-push hooks
hooks-install:
    pre-commit install --install-hooks
    pre-commit install --hook-type commit-msg
    pre-commit install --hook-type pre-push

# Run pre-commit on all files
pre-commit-run:
    pre-commit run --all-files
