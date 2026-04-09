# Roadmap: Milestone v0.1 Foundation

## Milestone Summary
The objective of this milestone is to establish the core pillars of the CAD-Mob framework — **AgentMove** (LLM reasoning), **SCM** (Causal Inference), and **ProDiff** (Trajectory Imputation) — and fuse them into a **Unified Mobility Representation (UMR)**. We will replicate baselines for each pillar before implementing the joint training objective.

## Overview
| # | Phase | Goal | Requirements | Criteria |
|---|-------|------|--------------|----------|
| 1 | AgentMove Replay | Replicate LLM mobility reasoning | PRED-01, 02, 03 | 2 |
| 2 | ProDiff Replay | 0/1 | Planned    |  |
| 3 | Causal Layer | Design & validate SCM structure | CAUSAL-01, 02 | 2 |
| 4 | UMR Latent Fusion | Implement unified training & UMR | CORE-01, 02, 03 | 3 |
| 5 | Simulation UI | Connect 3D visualization to model | VIS-01, 02 | 2 |

## Phase Details

### Phase 1: AgentMove Replay [DONE]
Establish state-of-the-art mobility prediction baseline using LLM reasoning.
- **Goal:** Reproduce AgentMove next-location prediction accuracy (3.33%-8.57% gain).
- **Requirements:** PRED-01, PRED-02, PRED-03.
- **Success Criteria:**
  1. Successful memory organization script (ST/LT memory) running on FourSquare data.
  2. Baseline Acc@10 within 0.5% of reported AgentMove results.

### Phase 2: ProDiff Replay [DONE]
Establish trajectory imputation baseline using diffusion models.
- **Goal:** Reproduce ProDiff's sparse trajectory imputation results (start/end endpoints only).
- **Requirements:** IMP-01, IMP-02.
- **Success Criteria:**
  1. DDPM training loop successfully denoising FourSquare trajectories.
  2. PCE successfully embedding prototypes into vector space.

### Phase 3: Causal Layer
Initialize the Structural Causal Model (SCM) for debiasing.
- **Goal:** Define the causal DAG and implement interventional logic.
- **Requirements:** CAUSAL-01, CAUSAL-02.
- **Success Criteria:**
  1. Validated SCM DAG (Individual history -> Intention -> Location).
  2. Successful execution of `do(X=x)` interventions in simulation script.

### Phase 4: UMR Latent Fusion
The architectural linchpin — joint training of all heads.
- **Goal:** Implement the Unified Mobility Representation and joint loss function.
- **Requirements:** CORE-01, CORE-02, CORE-03.
- **Success Criteria:**
  1. UMR encoder-decoder architecture implemented in `src/app/actions.ts` (moving from mocks).
  2. Joint loss function (`L_total`) converging during small-batch test.
  3. Causal explanation head producing saliency maps over UMR.

### Phase 5: Simulation UI
Bring the research findings to the 3D dashboard.
- **Goal:** Synchronize the 3D visualizer with the model's interventional outputs.
- **Requirements:** VIS-01, VIS-02.
- **Success Criteria:**
  1. 3D Scene renders imputed trajectories from the diffusion head.
  2. UI controls toggle causal treatments (e.g., "What if event didn't happen?") and update the visualization.

---
*Last updated: 2026-04-09*
