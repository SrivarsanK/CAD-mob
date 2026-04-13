from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import time
import os
import numpy as np

# Import our core models
from models.prodiff import ProDiffPredictor
from models.agentmove import AgentMoveReasoning
from models.causal import CausalSCM

app = FastAPI(title="CAD-Mob Intelligence Core")

# Initialize models
predictor = ProDiffPredictor()
reasoner = AgentMoveReasoning()
causal_scm = CausalSCM()

class Point(BaseModel):
    lat: float
    lng: float

class PredictionRequest(BaseModel):
    userId: str
    start: List[float] # [lat, lng]
    end: List[float]
    interventions: Optional[Dict[str, bool]] = None
    context: Optional[Dict[str, Any]] = None

class PredictionResponse(BaseModel):
    alignment: Dict
    path: List[Point]
    reasoningSteps: List[str]
    confidence: float

@app.get("/health")
async def health():
    return {"status": "operational", "engine": "Gemini-3-Flash ML-Core v2"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    start_time = time.time()
    
    # 1. Generate Trajectory via ProDiff
    path_data = predictor.generate(request.start, request.end)
    path = [Point(**p) for p in path_data]

    # 2. Generate Reasoning via AgentMove (LLM Head)
    # We'll pass the request context if provided, or build a stub
    ctx = request.context or {
        "userId": request.userId,
        "interventions": request.interventions
    }
    reasoning_steps = await reasoner.reason(ctx)
    reason_vector = reasoner.get_reasoning_vector(ctx)

    # 3. Aligned Latent Space (Fusing Reasoning + Diffusion)
    latent = predictor.calculate_latent_alignment(reason_vector, request.interventions or {})
    
    # 4. Causal Weighting logic
    head_weights = causal_scm.get_causal_weights(request.interventions or {})
    causal_effect = causal_scm.estimate_effect("intended_destination", request.interventions or {})

    # Append causal metadata to reasoning steps
    reasoning_steps.append(f"Causal Head: Estimated intervention effect: {causal_effect:.2f}")
    reasoning_steps.append(f"Latency: {(time.time() - start_time)*1000:.2f}ms")

    return PredictionResponse(
        alignment={
            "latent": latent,
            "headWeights": head_weights
        },
        path=path,
        reasoningSteps=reasoning_steps,
        confidence=0.85 + (causal_effect * 0.1)
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
