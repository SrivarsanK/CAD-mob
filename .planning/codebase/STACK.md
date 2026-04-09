# Technology Stack

**Analysis Date:** 2026-04-09

## Languages

**Primary:**
- TypeScript 5.x - All application code and configurations
- TSX - React components with TypeScript

**Secondary:**
- CSS - Global styles and Tailwind 4 configuration

## Runtime

**Environment:**
- Node.js (Next.js 16.1.6 runtime)
- Browser - Three.js and React rendering

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - App Router, Server Actions, Edge Runtime support
- React 19.2.3 - UI library with experimental directives support

**Animations & 3D:**
- Three.js ^0.182.0 - 3D engine
- @react-three/fiber ^9.5.0 - React renderer for three.js
- @react-three/drei ^10.7.7 - Useful helpers for R3F
- GSAP ^3.14.2 - High-performance animations
- Framer Motion ^12.34.0 - Declrative UI animations

**Styling:**
- Tailwind CSS ^4 - Utility-first styling
- PostCSS - CSS transformation

**Icons:**
- Lucide React ^0.565.0 - Icon set

## Key Dependencies

**Critical:**
- `three` - Foundation for 3D visualization
- `@react-three/fiber` - Integration of Three.js into React tree
- `gsap` - Used for complex timeline animations
- `framer-motion` - Used for layout and UI micro-interactions

**Infrastructure:**
- `babel-plugin-react-compiler` - React 19 optimization

## Configuration

**Environment:**
- `.env` (implied for future production/secrets)

**Build:**
- `tsconfig.json` - TypeScript configuration with `@/*` path aliases
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint 9 configuration
- `postcss.config.mjs` - Tailwind 4 / PostCSS configuration

## Platform Requirements

**Development:**
- Any platform with Node.js support
- High-performance GPU recommended for 3D development

**Production:**
- Vercel (Recommended for Next.js 16/React 19 features)
- Support for Edge Runtime and Server Conditions

---

*Stack analysis: 2026-04-09*
*Update after major dependency changes*
