# Codebase Concerns

**Analysis Date:** 2026-04-09

## Tech Debt

## Mocked Logic (BACKEND)
- [~] **Server Actions**: `src/app/actions.ts` has been partially updated to use the AgentMove reasoning engine. STMM and basic orchestration are now functional with seeded data.
- [ ] **Data Provider**: Need real FourSquare CSV/JSON ingestion instead of the current `seedSampleData()` mock.

**Consolidated Actions File:**
- Issue: All backend logic is in a single `src/app/actions.ts` file.
- Impact: As the project grows, this file will become a bottleneck and hard to maintain.
- Fix approach: Split actions into feature-based files (e.g., `src/app/mobility/actions.ts`, `src/app/simulations/actions.ts`).

## Known Bugs

**Hydration Mismatch in 3D Scene:**
- Symptoms: Potential hydration errors if the 3D canvas tries to render before the client is fully ready.
- Trigger: Rapid page refresh while the background scene is loading.
- Workaround: Component is currently dynamically imported with `ssr: false` in `src/app/page.tsx`, which mitigates this but introduces a slight delay in visual availability.

## Security Considerations

**Unprotected Server Actions:**
- Risk: `triggerDiffusionModel` and `getMobilityProfile` have no authentication or rate limiting.
- File: `src/app/actions.ts`
- Current mitigation: None.
- Recommendations: Implement Next.js middleware or action-level checks to verify session tokens before executing heavy simulation triggers.

## Performance Bottlenecks

**Three.js Canvas Initialization:**
- Problem: The main `Scene` component loads heavy 3D assets and Three.js runtime.
- File: `src/components/3d/Scene.tsx`
- Measurement: Not measured yet, but expected to impact TBT (Total Blocking Time) on lower-end devices.
- Improvement path: Optimize geometry (buffer attributes), use instanced rendering for agent dots, and implement asset compression (Draco).

## Fragile Areas

**Client/Server Transition Logic:**
- File: `src/app/page.tsx`
- Why fragile: High reliance on `useTransition` for triggering animations synchronized with server logic. If the server action takes too long, the UI might feel unresponsive without a more detailed progress state.
- Safe modification: Add more granular loading states and error boundaries around the magnetic button trigger.

## Dependencies at Risk

**Experimental Framework Features:**
- Risk: Using Next.js 16 and experimental `"use cache"` directive.
- Impact: Documentation is sparse, and breaking changes from the framework could stop development.
- Migration plan: If instability occurs, downgrade to Next.js 15 Stable and use `unstable_cache`.

## Test Coverage Gaps

**Core Logic:**
- What's not tested: Everything.
- Risk: High. Regressions in mobility calculations or simulation triggers won't be caught.
- Priority: High.

---

*Concerns audit: 2026-04-09*
*Update as issues are fixed or new ones discovered*
