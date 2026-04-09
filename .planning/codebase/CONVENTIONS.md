# Coding Conventions

**Analysis Date:** 2026-04-09

## Naming Patterns

**Files:**
- `PascalCase.tsx` for React components (`HeroSection.tsx`, `GlassCard.tsx`).
- `camelCase.ts` for logic and utility files (`actions.ts`).
- `kebab-case` for directories.

**Functions:**
- `camelCase` for all functions (`handleLaunch`, `getMobilityProfile`).
- `handleEventName` for client-side event handlers.

**Variables:**
- `camelCase` for variables and state (`isPending`, `steps`).
- `UPPER_SNAKE_CASE` for global constants (if any).

**Types:**
- `PascalCase` for interfaces and type aliases.

## Code Style

**Formatting:**
- Prettier (implied by standard Next.js setup).
- 2 space indentation.
- Omitted semicolons (based on `package.json` lint settings and file observation).

**Linting:**
- ESLint 9 with `eslint.config.mjs`.
- Configured with `eslint-config-next`.
- Run: `npm run lint`.

## Import Organization

**Order:**
1. React and Next.js built-ins.
2. Third-party packages (`three`, `gsap`, `framer-motion`).
3. Internal modules using `@/*` alias.
4. Relative imports.
5. Styles/Assets.

**Grouping:**
- Blank line between external and internal groups.

**Path Aliases:**
- `@/*` maps to `src/*`.

## Error Handling

**Patterns:**
- Use `try/catch` within Server Actions.
- Client-side error handling via state updates (e.g., stopping a transition).

## Function Design

**React Components:**
- Use Functional Components with hooks.
- Prefer `const Component = () => {}` or `export default function Component() {}`.
- High usage of `Suspense` for async components (like the 3D Scene).

**Server Actions:**
- Defined in `actions.ts` with `'use server'` directive.
- Async by default.

## Module Design

**Exports:**
- Named exports for actions and utilities.
- Default exports for page/router components and main UI components.

## Directives

- **"use client":** Required for components using hooks or browser-only APIs (R3F).
- **"use server":** Required for backend mutation files.
- **"use cache":** Experimental Next.js 15 directive for caching data fetching results.

---

*Convention analysis: 2026-04-09*
*Update when patterns change*
