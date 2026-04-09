# Requirements: Milestone v0.1 Foundation

## Milestone v0.1 Requirements

### Mobility Prediction (PRED)
- [ ] **PRED-01**: Zero-shot next-location prediction (match/exceed 3.33% to 8.57% improvement baseline).
- [ ] **PRED-02**: Implementation of AgentMove reasoning engine (Memory Organization, Writing, Reading).
- [ ] **PRED-03**: World Knowledge Generator for urban exploration modeling.

### Trajectory Imputation (IMP)
- [ ] **IMP-01**: Sparse trajectory imputation using only start/end endpoints (match/exceed 6.28% improvement baseline).
- [ ] **IMP-02**: Prototype Condition Extractor (PCE) for embedding movement patterns.

### Causal Inference (CAUSAL)
- [ ] **CAUSAL-01**: Structural Causal Model (SCM) over variables: history, time, zone, event, and norms.
- [ ] **CAUSAL-02**: Intervention engine support (do-calculus, soft interventions, counterfactual queries).
- [ ] **CAUSAL-03**: Causal explanation head (saliency maps/attribution reports).

### Core Architecture (CORE)
- [ ] **CORE-01**: Unified Mobility Representation (UMR) latent fusion layer.
- [ ] **CORE-02**: Joint training objective implementation (LLM + SCM + DDPM losses).
- [ ] **CORE-03**: Server Actions migration from mocked to baseline logic.

### Visualization & UI (VIS)
- [ ] **VIS-01**: 3D Canvas integration with Unified Mobility Representation outputs.
- [ ] **VIS-02**: Interactive counterfactual simulation UI (toggle causality treatments).

## Future Requirements
- **RT-01**: Optimized DDIM sampling for real-time inference.
- **API-01**: Public Inference API for external integration.

## Out of Scope
- **OSM-RECON**: Replacement of world knowledge generator with retrieval-augmented OSM lookup (deferred to evaluation phase).
- **PRIV-DP**: Differential privacy noise implementation (deferred to Phase 4).

## Traceability
*(To be filled by roadmap)*

---
*Last updated: 2026-04-09*
