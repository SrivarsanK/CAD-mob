# External Integrations

**Analysis Date:** 2026-04-09

## APIs & External Services

**Mobility Data (Mocked):**
- Internal Mobility Data Service - Mocked in `src/app/actions.ts`
  - Integration method: Server Actions (`getMobilityProfile`)
  - Features: Returns active agents count, velocity, and congestion index.

**Diffusion Model (Conceptual):**
- AI Diffusion Model - Mocked in `src/app/actions.ts`
  - Integration method: Server Actions (`triggerDiffusionModel`)
  - Features: Triggers region-based simulations.

**Agent Reasoning (Mocked):**
- LLM Thought Chains - Mocked in `src/app/actions.ts`
  - Integration method: Server Actions (`generateAgentReasoning`)
  - Features: Simulates multi-step reasoning for mobility queries.

## Data Storage

**Vector Store (Conceptual):**
- Mentioned in comments within `src/app/actions.ts` as a source for historical density data.
- Not yet implemented with a real provider (e.g., Pinecone, Weaviate).

**Local Data:**
- Local JSON/Static data likely resides in `src/app/data/` (as seen in directory structure).

## Authentication & Identity

**Auth Provider:**
- None detected in current `package.json`. No `clerk`, `next-auth`, or `supabase` packages found.

## Monitoring & Observability

**Logs:**
- Browser console and Node.js stdout (logged in `actions.ts`).

## CI/CD & Deployment

**Hosting:**
- Targeted for Next.js 16/React 19 compatible environments (Vercel).

## Environment Configuration

**Development:**
- No strictly required environment variables found in root (no `.env.example` or `.env` check in code except standard Next.js behavior).

---

*Integration audit: 2026-04-09*
*Update when adding/removing external services*
