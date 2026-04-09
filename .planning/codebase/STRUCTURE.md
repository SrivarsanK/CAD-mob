# Codebase Structure

**Analysis Date:** 2026-04-09

## Directory Layout

```
cad-mob/
├── public/             # Static assets (images, icons, etc.)
├── src/                # Application source code
│   ├── app/           # Next.js App Router (pages and actions)
│   │   ├── agents/    # Agent-related routes
│   │   ├── city-map/  # Map-related routes
│   │   ├── data/      # Static data files
│   │   └── ...        # Other feature routes
│   └── components/     # UI and 3D components
│       ├── 3d/        # Three.js scenes and elements
│       ├── content/   # Section components
│       ├── layout/    # Global shell components
│       └── ui/        # Reusable UI primitives
├── .planning/          # GSD planning and codebase map
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Directory Purposes

**src/app/**
- Purpose: Route definitions and server-side logic hub.
- Contains: `page.tsx`, `layout.tsx`, `actions.ts`.
- Subdirectories: Feature folders (`agents/`, `city-map/`, `dashboard/`, `forecast/`, `settings/`).

**src/app/data/**
- Purpose: Local data storage for simulations and mock data.
- Contains: JSON files or static TS files.

**src/components/3d/**
- Purpose: Three.js visualization engine.
- Contains: `Scene.tsx`, and other R3F components.

**src/components/ui/**
- Purpose: Atomic UI components.
- Contains: `GlassCard.tsx`, `MagneticButton.tsx`.

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Application landing page.
- `src/app/layout.tsx`: Global root layout.

**Configuration:**
- `package.json`: Project manifest and scripts.
- `tsconfig.json`: TypeScript path aliases and compiler options.
- `next.config.ts`: Next.js configuration.
- `tailwind.config.ts` (implied or integrated in Tailwind 4 config).

**Core Logic:**
- `src/app/actions.ts`: Central hub for Server Actions and backend logic.

## Naming Conventions

**Files:**
- `PascalCase.tsx` for React components.
- `camelCase.ts` for utilities and actions.
- `kebab-case` for directory names.

**Directories:**
- kebab-case for all source directories.

## Where to Add New Code

**New Feature/Route:**
- Primary code: `src/app/[feature-name]/page.tsx`
- Logic: `src/app/actions.ts` (or feature-specific action file)

**New Component:**
- UI: `src/components/ui/`
- 3D: `src/components/3d/`

**New Styles:**
- Global: `src/app/globals.css`
- Component: Tailind classes inline or CSS modules if needed.

---

*Structure analysis: 2026-04-09*
*Update when directory structure changes*
