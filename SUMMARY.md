# CAD-Mob: AI Mobility Intelligence

**CAD-Mob** has been transformed from a simulated baseline into a production-ready ML architecture using a multi-service approach.

## 🏗️ System Architecture

| Tier | Component | Technology | Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | Studio UI | Next.js 16 (Turbopack) | Interactive Visualization, Interventional Control |
| **Gateway** | API Bridge | Express.js | GTFS-RT Ingestion, Auth, API Proxy |
| **Pillars** | Intel Core | Python (FastAPI) | ProDiff (Gen), AgentMove (Reason), Causal SCM (Causal) |
| **Sandbox** | Model Training | PyTorch/Cuda | GPU-accelerated model refinement |

## 🚀 Key Features

### 1. Unified Mobility Representation (UMR)
The system now bridges three intelligence heads into a single latent vector:
- **Reasoning**: User behavioral history and routine patterns.
- **Diffusion**: Probabilistic trajectory synthesis using reverse diffusion processes.
- **Causal**: Structural causal models estimating the absolute effect of urban interventions.

### 2. High-Performance Core
Moved heavy ML math (Numerical Integration, PCE, Diffusion Sampling) to a **Python Intelligence Core**:
- **ProDiff Predictor**: Iterative denoising logic implemented in NumPy.
- **SCM Head**: Structural intervention estimates using `dowhy` concepts.

### 3. Real-World Datasets
Integrated production-grade parsers for:
- **Porto (CSV)**: Taxi trajectories with high temporal resolution.
- **T-Drive (TXT)**: Global scale mobility traces.
- **GTFS-RT**: Real-time transit telemetry streaming.

## 🛠️ How to Launch

The entire system is orchestrated via Docker Compose:

```bash
docker-compose up --build
```

### Access Points
- **Studio UI**: `http://localhost:3000`
- **Express Gateway**: `http://localhost:8000`
- **Python ML Core**: `http://localhost:8001`

## 🔮 Next Evolution
- **Model Weights**: Train the ProDiff U-Net on GPUs via `model-sandbox` and swap `models/prodiff_latest.pth`.
- **Causal Discovery**: Automate DAG generation from Porto data using `causal-learn`.
- **Global Deployment**: Use the provided `deployment-pro` guidelines to scale on Kubernetes clusters.
