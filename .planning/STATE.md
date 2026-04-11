# Project State

## Current Position
Phase: Phase 4 (Near Completion) -> Phase 5 (Starting)
Plan: - [x] **Phase 1: AgentMove Replay**
- [x] **Phase 2: ProDiff Replay**
- [x] **Phase 3: Causal Layer (SCM)**
- [x] **Phase 4: UMR Latent Fusion**
    - [x] Aligning reasoning and diffusion latents
    - [x] Joint loss engine implementation
    - [x] Server action integration (`alignMobilityUMR`)
- [ ] **Phase 5: Simulation & Visualization UI**
    - [ ] Fused Latent visualization in 3D
    - [ ] Interactive Causal controls
    - [ ] Real-data trajectory rendering

Status: Milestone v0.1 Foundation - Integration in progress
Last activity: 2026-04-11 — Completed Phase 4 implementation and initialized Phase 5 roadmap.

## Accumulated Context
- Project involves 3 pillars: Agentic Reasoning, Causal Inference, and ProDiff.
- Tech Stack: Next.js 16, React 19, Three.js, R3F, GSAP, Framer Motion.
- UMR Latent Fusion (Phase 4) is implemented; logic lives in `src/lib/core/umr/`.
- `alignMobilityUMR` is the primary orchestrator for joint inference.

## Current Focus
Developing UI components to visualize the "Fused Latent Point" and connecting the 3D dashboard to real UMR outputs.

## Next Steps
- Implement `UMRVisualizer.tsx` for 3D latent representation.
- Create `CausalControlPanel.tsx` for interactive debiasing.
- Integrate `alignMobilityUMR` results into `src/app/city-map/page.tsx`.
