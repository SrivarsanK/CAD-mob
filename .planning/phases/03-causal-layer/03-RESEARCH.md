# Research Plan - Phase 03: Causal Layer

## Executive Summary
Implementation of Phase 03 focuses on initializing a Structural Causal Model (SCM) to debias next-location predictions. The core challenge is to isolate the effect of "Intention" from "Biased History" using Pearl's do-calculus. This layer will sit between the data ingestion and the ProDiff trajectory generation engine, ensuring that generated paths are causally grounded rather than just statistically correlated with biased history.

## Standard Stack
- **DoWhy (Microsoft)**: The primary framework for the full causal pipeline (Model -> Identify -> Estimate -> Refute). Use this for high-level identification and robustness testing.
- **pgmpy**: Use as the core engine for representing the DAG and performing interventional queries (`do` operations) on discrete state spaces (Zones, Events, Norms).
- **CausalNex**: Use for visualizing the DAG and performing "What-If" analysis on the causal network structure.
- **networkx**: The standard for lower-level graph manipulation and structural property verification (acyclicity, reachability).

## Architecture Patterns
### 1. Latent Intention SCM
The mobility process is modeled as a latent variable problem where:
- **Exogenous/Contextual Parents**: `Time (T)`, `Zone (Z)`, `Event (E)`, `Norms (N)`.
- **Historical Influence**: `Individual History (H)`.
- **Latent Mediator**: `Intention (I)`.
- **Outcome**: `Location (L)`.
- **DAG**: $(H, T, Z, E, N) \to I \to L$.
- **Direct Effects**: Some contextual variables (e.g., $Z, E$) have direct edges to $L$ to represent physical or regulatory constraints (e.g., a road closure).

### 2. Interventional Logic (do-calculus)
To achieve debiasing, we use the **Causal Intervention (CI)** pattern:
- **Objective**: Estimate $P(L | do(I=i))$.
- **Mechanism**: The `do` operator simulates a physical intervention that removes all causal edges leading into $I$. This effectively breaks the link between $H$ (biased history) and the current prediction, allowing the model to answer "Where would this agent go if they had intention $i$, regardless of their past biases?"

### 3. Counterfactual Reasoning
- Use Counterfactuals to evaluate "What if the Norms ($N$) were different for this specific trajectory?" This is critical for CAUSAL-02 (norm-based debiasing).

## Don't Hand-Roll
- **Identification Math**: Do not implement the back-door or front-door criteria logic manually. Use `DoWhy`'s `identify_effect()` method.
- **Estimation Algorithms**: Do not implement Propriety Score Matching (PSM) or Inverse Propensity Weighting (IPW) from scratch. Use established implementations in `EconML`.
- **Graph Invariants**: Use `networkx` for DAG property checks (e.g., `is_directed_acyclic_graph`).

## Common Pitfalls
- **Selection Bias (Logged Data)**: Mobility data only records where agents *actually* went, which is a biased sample of where they *could* have gone. **Solution**: Use Inverse Propensity Weighting (IPW) during the SCM estimation phase.
- **Spatio-Temporal Confounding**: Time and Zone are highly correlated. Treating them as independent parents can lead to incorrect entropy in the intention node.
- **Ignoring Feedback Loops**: Today's Location becomes tomorrow's History. While the SCM is a DAG, the system is a Dynamic Causal Model. **Solution**: Ensure the DAG is unrolled over time ($H_{t-1} \to I_t \to L_t$).

## Validation Architecture
A robust Causal Layer must be validated through three distinct tiers:

### 1. Structural Validation (Unit Tests)
- **Acyclicity Check**: Assert that the defined graph has no cycles.
- **Expected Reachability**: Verify that `History` and `Norms` have at least one path to `Location`.
- **Variable Alignment**: Ensure all SCM variables (H, T, Z, E, N, I, L) are mapped to the codebase's feature vectors.

### 2. Causal Refutation (DoWhy Refuters)
- **Random Common Cause**: Add a random variable as a parent to both `Intention` and `Location`. If the effect estimate changes significantly, the DAG is likely missing a real-world confounder.
- **Placebo Treatment**: Replace the `Intention` variable with random permutations. The resulting causal effect on `Location` must be significantly zero.
- **Subset Validation**: Run the causal estimation on random 80% slices of the data. Estimates must remain stable ($\sigma < 0.05$).

### 3. Interventional Invariance
- Verify that a `do(I=i)` intervention does not change the marginal distribution of its non-descendants (e.g., $P(T)$ should remain constant).

## Code Example (Conceptual pgmpy/DoWhy)
```python
from dowhy import CausalModel

# Define the DAG string
dag_str = "DOT -> graph { history -> intention; norms -> intention; intention -> location; zone -> location; }"

model = CausalModel(
    data=df,
    treatment='intention',
    outcome='location',
    graph=dag_str
)

# 1. Identification
identified_estimand = model.identify_effect()

# 2. Refutation (The Validation Step)
refution_results = model.refute_estimate(
    method_name="random_common_cause"
)
```
