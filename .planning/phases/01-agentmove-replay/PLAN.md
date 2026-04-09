# Phase 01: AgentMove Replay Plan

## Objective
Replicate the foundational reasoning engine of AgentMove, specifically focusing on its Multi-Module Spatial-Temporal Knowledge/Memory architecture. This phase implements the writing, organization, and retrieval of individual, world, and collective knowledge for the FourSquare dataset.

## Read-First Files
- `src/app/actions.ts`: Understand current mobility mocks.
- `.planning/codebase/CONVENTIONS.md`: Adhere to project standards.

## Dependencies
- `luxon`: For robust temporal manipulation.
- `zod`: For data validation.

## Execution Steps

### 1. Infrastructure Setup
- [x] Create `src/lib/agent-move` directory structure.
- [x] Define core types in `src/lib/agent-move/types.ts`.

### 2. FourSquare Data Layer
- [x] Implement `src/lib/data/foursquare/parser.ts` to transform raw CSV/JSON check-ins into standardized `MobilityRecord` objects.
- [x] Create sample data for the mock integration.

### 3. Spatial-Temporal Memory Module (STMM)
- [x] **Writing:** Implement logic to aggregate user check-ins into periodic patterns (e.g., daily/weekly summaries).
- [x] **Retrieval:** Implement RAG-ready retrieval functions to fetch relevant user history based on a target timestamp.

### 4. World & Collective Knowledge Stubs
- [x] Implement `WorldKnowledgeGenerator` stub providing urban context (POI categories, region characteristics).
- [x] Implement `CollectiveKnowledgeExtractor` stub providing population-level transition probabilities.

### 5. Reasoning Engine Orchestrator
- [x] Create `src/lib/agent-move/engine.ts`.
- [x] Implement a `reason()` function that synthesizes input from the three memory modules to provide the context needed for a prediction prompt.

### 6. Integration & Verification
- [x] Replace mocked logic in `src/app/actions.ts` with calls to the new reasoning engine.
- [x] Verify that the frontend updates reflect the structured data processed from the memory modules.

## Acceptance Criteria
- [x] `src/lib/agent-move` contains 3 distinct knowledge modules.
- [x] Memory records can be searched by `userId` and `timestamp`.
- [x] `src/app/actions.ts` no longer uses hardcoded string arrays for profiles, but instead uses structured memory objects.
- [x] Unit tests for the memory retrieval logic pass with mocked data.
