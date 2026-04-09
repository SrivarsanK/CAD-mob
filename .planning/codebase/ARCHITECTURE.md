# Architecture

**Analysis Date:** 2026-04-09

## Pattern Overview

**Overall:** Full-stack Next.js App with 3D Visualization

**Key Characteristics:**
- **React 19 / Next.js 16:** Uses modern React features like `use cache` (experimental) and `useTransition`.
- **Hybrid Components:** Strict separation between Client Components (`"use client"`) for interactivity/3D and Server actions.
- **3D-First UI:** Large-scale Three.js integration as a core component of the user experience.
- **Server Action Logic:** All business logic and mutations are handled via `actions.ts`.

## Layers

**Route Layer:**
- Purpose: Entry point for user navigation and high-level page structure.
- Contains: Pages, layouts, and route-specific metadata.
- Location: `src/app/`
- Depends on: Component layer, Logic layer.

**Logic Layer (Server):**
- Purpose: Mutating state, fetching data, and running "simulations".
- Contains: Server Actions, data fetching logic.
- Location: `src/app/actions.ts`
- Depends on: External services (mocked currently), Data layer.

**3D Visualization Layer:**
- Purpose: Rendering complex 3D scenes and mobility simulations.
- Contains: Three.js components, shaders, and animations.
- Location: `src/components/3d/`
- Depends on: `@react-three/fiber`, `three`.

**Component Layer (UI):**
- Purpose: Reusable UI primitives and layout structures.
- Contains: Buttons, cards, navigation shells.
- Location: `src/components/ui/`, `src/components/layout/`
- Depends on: `framer-motion`, `lucide-react`.

## Data Flow

**Interactive Mobility Dashboard Flow:**

1. **User Action:** User clicks "Launch Dashboard" in `src/app/page.tsx`.
2. **Transition:** `useTransition` starts, setting `isPending` to true.
3. **Server Action:** `triggerDiffusionModel` is called in `src/app/actions.ts`.
4. **Execution:** Server logs the trigger and returns a mock `predictionId`.
5. **Update:** Client updates UI based on the returned status.
6. **3D Update:** The 3D `Scene` (dynamically imported) renders or updates based on the new context.

**State Management:**
- **Local State:** `useState` in client components for UI flags.
- **Server Cache:** Uses experimental `"use cache"` directive for mobility profiles.
- **Component State:** Managed via React props and R3F internal state.

## Key Abstractions

**Server Actions:**
- Purpose: Encapsulate server-side operations as callable functions from the client.
- Examples: `getMobilityProfile`, `triggerDiffusionModel`.

**3D Scene:**
- Purpose: High-level wrapper for the `Canvas` and all 3D children.
- Example: `src/components/3d/Scene.tsx`.

**UI Primitives:**
- Purpose: Consistent "Glassmorphism" design system.
- Examples: `GlassCard`, `MagneticButton`.

## Entry Points

**Web Entry:**
- Location: `src/app/page.tsx`
- Triggers: URL root access.
- Responsibilities: Render Hero section, load 3D background, provide navigation to dashboard.

**Global Shell:**
- Location: `src/app/layout.tsx`
- Responsibilities: HTML metadata, `globals.css` import, top-level layout.

## Error Handling

**Strategy:** 
- Standard React error boundaries (implied by Next.js).
- Server actions return success flags and error messages.

---

*Architecture analysis: 2026-04-09*
*Update when major patterns change*
