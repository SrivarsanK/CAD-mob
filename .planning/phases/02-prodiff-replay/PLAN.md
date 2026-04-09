# Phase 02: ProDiff Replay Plan

## Objective
Replicate the foundational trajectory imputation logic of ProDiff. This phase implements the Denoising Diffusion Probabilistic Model (DDPM) math and the Prototype Condition Extractor (PCE) stub to enable sparse trajectory imputation (start/end endpoints only).

## Read-First Files
- `src/lib/agent-move/types.ts`: Reuse mobility record structures.
- `src/app/actions.ts`: Current `triggerDiffusionModel` stub.
- `.planning/ROADMAP.md`: Review Phase 2 criteria.

## Dependencies
- `onnxruntime-node`: (Optional) for future model execution.
- `seedrandom`: For deterministic diffusion noise during testing.

## Execution Steps

### 1. ProDiff Foundation
- Create `src/lib/prodiff` directory.
- Define `Trajectory`, `Point`, and `NoiseSchedule` types in `src/lib/prodiff/types.ts`.

### 2. Diffusion Math & Schedule
- Implement `src/lib/prodiff/math.ts`:
    - Linear/Cosine noise schedules ($\beta_t$ scheduler).
    - Forward diffusion (adding noise to clean trajectories).
    - Reverse diffusion (denoising step formula).

### 3. Prototype Condition Extractor (PCE)
- Implement `src/lib/prodiff/pce.ts`:
    - Define a `Prototype` registry (e.g., standard movement patterns like "Linear", "Arc", "Circular").
    - Implement a `matchPrototype()` function that selects the best structural guidance based on endpoints.

### 4. Denoiser Model (1D-UNet Logic)
- Create `src/lib/prodiff/denoiser.ts`:
    - Implement a simplified version of the 1D-UNet logic (Transition from start + noise -> predicted denoised points).
    - For v0.1, use a mathematical heuristic that simulates the denoising loop's refinement of the path.

### 5. Imputation Engine
- Create `src/lib/prodiff/engine.ts`:
    - Implement the `impute(start: Point, end: Point, steps: number)` pipeline.
    - Integrate the PCE guidance into the denoising loop.

### 6. Simulation Integration
- Update `src/app/actions.ts`:
    - Replace the `triggerDiffusionModel` random ID with a real imputed trajectory (array of points).
- Update the 3D Scene (`src/components/3d/Scene.tsx`) to visualize the imputed path once the dashboard is launched.

## Acceptance Criteria
- [ ] `src/lib/prodiff` contains functional math for noise scheduling.
- [ ] `impute()` function returns a valid array of intermediate points between two coordinates.
- [ ] PCE successfully guides the imputation toward a "Prototype" pattern (e.g., not just a straight line).
- [ ] `triggerDiffusionModel` returns a `predictedPath` field containing the imputed trajectory.
