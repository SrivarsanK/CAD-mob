'use server';

import { cache } from 'react';
import { reason } from '@/lib/agent-move/engine';
import { impute } from '@/lib/prodiff/engine';
import { seedSampleData } from '@/lib/data/foursquare/parser';
import { CausalInferenceEngine } from '@/lib/causal/inference';
import { PrototypeType } from '@/lib/prodiff/pce';
import { UMRAlignor } from '@/lib/core/umr/alignment';
import { matchPrototype } from '@/lib/prodiff/pce';

/**
 * The architectural linchpin: Performs joint latent alignment across Reasoning, 
 * Diffusion, and Causal heads to produce a Unified Mobility Representation (UMR).
 */
export async function alignMobilityUMR(userId: string, start: [number, number], end: [number, number]) {
    "use cache";
    
    // 1. Seed & Reason (Reasoning Head)
    seedSampleData();
    const reasoning = await reason(userId, new Date());

    // 2. Match Prototype (Generative Head)
    const startPoint = { lat: start[0], lng: start[1] };
    const endPoint = { lat: end[0], lng: end[1] };
    const prototype = matchPrototype(startPoint, endPoint);

    // 3. Align Latents (UMR Fusion)
    const alignor = new UMRAlignor();
    const alignment = alignor.align(reasoning, prototype, userId);

    // 4. Trigger Imputation (Diffusion Head)
    const imputation = await impute(startPoint, endPoint, 20, 50);

    return {
        alignment,
        path: imputation.predicted,
        reasoningSteps: [
            `Analysed patterns for ${userId}`,
            `Aligned intent: ${alignment.metadata.intentionTag}`,
            `Fused latent confidence: ${(alignment.confidence * 100).toFixed(1)}%`
        ]
    };
}

export const getMobilityProfile = async () => {
    "use cache";

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        activeAgents: 1245000 + Math.floor(Math.random() * 1000),
        avgVelocity: 45.2,
        congestionIndex: 0.8,
        lastUpdated: new Date().toISOString(),
    };
};

export async function triggerCausalInference(intention: string, blocked: boolean = false) {
  const engine = new CausalInferenceEngine();
  const result = engine.estimateLocationEffect(intention, { 
    history_biased: true, 
    zone_blocked: blocked 
  });
  
  return result;
}

export async function triggerDiffusionModel(
  start: [number, number], 
  end: [number, number],
  prototype?: PrototypeType,
  causalTarget?: string
) {
  const result = await impute({ lat: start[0], lng: start[1] }, { lat: end[0], lng: end[1] }, 20, 50);
  
  return {
    success: true,
    predictionId: Math.random().toString(36).substring(7),
    status: 'calculated',
    predictedPath: result.predicted,
    prototype: result.prototypeId
  };
};

export const generateAgentReasoning = async (userId: string) => {
    seedSampleData();
    const context = await reason(userId, new Date());

    const steps = [
        `Analyzing patterns for user: ${userId}...`,
        `Identified top venues: ${context.individual.topVenues.map(v => v.category).join(', ')}.`,
        `Last activity context: ${context.world.category}`,
        `Recommended behavior: ${context.individual.periodicPatterns[0]?.mostLikelyCategory || 'Normal Routine'}.`,
    ];

    return steps;
};
