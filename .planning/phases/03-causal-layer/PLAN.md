# Phase Plan - Phase 03: Causal Layer (SCM)

## Objective
Implement the Structural Causal Model (SCM) to deconfound mobility variables and enable interventional "What-If" reasoning.

## Readiness Gate
- [x] Phase 03 Research completed and reviewed.
- [x] Core mobility types defined in Phase 01.
- [x] Trajectory generation (ProDiff) available for downstream processing.

## Implementation Tasks

### 1. Core SCM Architecture
- [x] Create `src/lib/causal/types.ts` for causal variables (H, T, Z, E, N, I, L).
- [x] Implement `src/lib/causal/scm.ts`: A DAG representation capable of storing nodes and edges.
- [x] Add structural validation (cyclicity check) using `networkx`-style logic.

### 2. Interventional Inference
- [x] Implement `src/lib/causal/inference.ts`.
- [x] Build the `do(I=i)` operator logic:
    - Eliminate parents of $I$.
    - Re-normalize probabilities for $L$ based on the intervention.
- [x] Implement a simplified discrete probability table (CPT) for demonstration purposes.

### 3. Integration & Dashboard
- [x] Update `src/app/actions.ts` to include a `triggerCausalInference` action.
- [ ] Add a `CausalPanel.tsx` (mock-ready) to visualize the DAG and active interventions.

## Verification & Quality (Nyquist Tiers)

### Tier 1: Structural
- [x] Test: `test('SCM should be a DAG')`
- [x] Test: `test('do-operator should remove parent dependencies')`

### Tier 2: Interventional
- [x] Test: `test('P(L|do(I)) should be independent of History (H)')`

## Documentation updates
- [ ] Update `INTEGRATIONS.md` with the Causal -> Diffusion flow.
- [ ] Update `STATE.md` and `ROADMAP.md`.

## Rollback Plan
- Revert to direct `AgentMove -> ProDiff` correlation if SCM logic introduces instability or infinite loops.
