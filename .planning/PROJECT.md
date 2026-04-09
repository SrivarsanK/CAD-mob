# CAD-Mob: Causal-Agentic Diffusion Mobility

## What This Is
CAD-Mob is a unified research system integrating **Agentic Reasoning** (LLM), **Structural Causal Inference**, and **Prototype-Guided Diffusion** into a single framework for human mobility intelligence. It addresses next-location prediction and sparse trajectory imputation while providing causal explanations.

**Key Thesis:** Combining semantic reasoning (AgentMove) with generative robustness (ProDiff) and causal validation (SCM) solves the fragility and "black-box" nature of existing mobility models.

## Core Value
- **Interpretability:** Causal attribution reports for every prediction.
- **Robustness:** Zero-shot generalization across diverse cities via causal debiasing.
- **Accuracy:** State-of-the-art imputation using minimal data (endpoints only).

## Current Milestone: v0.1 Foundation
**Goal:** Establish the integrated framework foundation and replicate constituent baselines.

**Target features:**
- Replicate AgentMove and ProDiff baselines on standard datasets.
- Design and validate SCM structure via causal discovery on FourSquare data.
- Implement Unified Mobility Representation (UMR) encoder-decoder architecture.
- Integrate 3D visualization with simulation outputs.

## Requirements

### Validated
- ✓ **UI-01**: Next.js 16/React 19 dashboard with 3D visualization — existing
- ✓ **ARCH-01**: Hybrid Client/Server architecture with Server Actions — existing
- ✓ **VIS-01**: Glassmorphism UI primitives (GlassCard, MagneticButton) — existing

### Active
- [ ] **PRED-01**: Zero-shot next-location prediction (Baseline parity)
- [ ] **IMP-01**: Sparse trajectory imputation (Baseline parity)
- [ ] **CAUSAL-01**: Structural Causal Model (SCM) for mobility variables
- [ ] **CORE-01**: Unified Mobility Representation (UMR) architecture
- [ ] **VIS-02**: Real-time simulation visualization on 3D canvas

### Out of Scope
- **Real-time Deployment:** Optimized DDIM/Consistency models for mobile devices (deferred to Phase 4).
- **Public API:** External inference API (deferred to Phase 4).

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid Rendering | Keep 3D/Interactivity on client, logic on server | Validated |
| Unified Latent Space (UMR) | Mutual information shared between prediction and imputation tasks | Active |
| Causal Layer as Conditioner | Use interventional distribution to guide diffusion denoising | Active |

## Evolution
This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-09 after initialization*
