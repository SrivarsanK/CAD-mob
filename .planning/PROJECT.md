# TrajBench: Unified Evaluation Platform for Agentic & Generative Mobility

## 1. Vision
Standardized benchmarking for LLM-based (AgentMove), Diffusion-based (ProDiff), and Classical (DeepMove) trajectory models.

## 2. Core Pillars
- **InferBench:** Multi-model inference engine (Docker-sandboxed).
- **MetricStack:** Unified evaluation metrics (RMSE, HR@k, F1, Causal Accuracy).
- **TrajUI:** Next.js state-of-the-art visual analytics dashboard.

## 3. Tech Stack
- **Frontend:** Next.js 16.2.3, Tailwind, Framer Motion, 2D PathMap (SVG).
- **Backend:** FastAPI, Docker (Sandbox), Redis (Queue).
- **Models:** Python 3.9/3.10 environments in containers.

## 4. Roadmap
- [ ] Phase 1: Foundation & Docker Sandbox
- [ ] Phase 2: Model Integration (Pillars 1-3)
- [ ] Phase 3: Metric Engine & Dataset Loader
- [ ] Phase 4: TrajUI Dashboard
- [ ] Phase 5: Final Evaluation & Paper Synthesis
