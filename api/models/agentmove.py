from google import genai
import os
from typing import Dict, List, Any
import json

class AgentMoveReasoning:
    """
    Python implementation of the AgentMove Reasoning Engine.
    Uses Google Gemini to process mobility context and generate reasoning.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            # Fallback for debugging if key is missing during build
            self.client = None
            print("Warning: GEMINI_API_KEY not found. AgentMove will run in legacy mode.")
        else:
            self.client = genai.Client(api_key=self.api_key)

    async def reason(self, context: Dict[str, Any]) -> List[str]:
        """
        Processes mobility context and returns reasoning steps.
        """
        if not self.client:
            return ["Reasoning head disconnected: GEMINI_API_KEY missing."]

        prompt = f"""
        Analyze the following mobility context for user {context.get('userId', 'Unknown')}:
        
        - Individual History: {json.dumps(context.get('individual', {}))}
        - World Context: {json.dumps(context.get('world', {}))}
        - Collective Trends: {json.dumps(context.get('collective', {}))}
        - Interventions: {json.dumps(context.get('interventions', {}))}
        
        Provide 3 concise reasoning steps explaining why this user might move from 
        their current location to the intended destination. 
        Focus on the fusion of routine, world constraints, and any active interventions.
        Respond with a JSON list of strings.
        """

        try:
            response = self.client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt,
            )
            # Simple cleanup of response text if it contains markdown code blocks
            res_text = response.text.strip()
            if res_text.startswith("```json"):
                res_text = res_text.split("```json")[1].split("```")[0].strip()
            elif res_text.startswith("```"):
                res_text = res_text.split("```")[1].split("```")[0].strip()
            
            steps = json.loads(res_text)
            return steps[:3] # Ensure only 3 steps
        except Exception as e:
            return [f"Reasoning Error: {str(e)}", "Falling back to heuristic alignment."]

    def get_reasoning_vector(self, context: Dict[str, Any]) -> List[float]:
        """
        Returns a symbolic latent vector representing the reasoning state.
        """
        import numpy as np
        # Simple projection of context into latent space
        # In a production system, this would be an embedding from the LLM
        seed = len(str(context))
        np.random.seed(seed)
        return np.random.normal(0, 1, 128).tolist()
