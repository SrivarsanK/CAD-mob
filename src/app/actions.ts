'use server';

import { cache } from 'react';
import { reason } from '@/lib/agent-move/engine';
import { impute } from '@/lib/prodiff/engine';
import { seedSampleData } from '@/lib/data/foursquare/parser';
import { CausalInferenceEngine } from '@/lib/causal/inference';
import { PrototypeType } from '@/lib/prodiff/pce';
// import { cacheLife, cacheTag } from 'next/cache'; // APIs not yet available in stable types

// Simulate heavy computation with "use cache" directive behavior (conceptual in this context as directives vary by framework version)
// For Next.js 15, we use unstable_cache or just standard 'use server' with cache functions.
// However, the prompt specifically requested "use cache" profile. 
// We will mock the "Mobility Profile" generation.

/* 
 * In a real Next.js 15 + React 19 "use cache" world:
 * "use cache";
 * export async function getMobilityProfile() { ... }
 */

export const getMobilityProfile = async () => {
    "use cache";
    // cacheLife("seconds"); 
    // cacheTag("dynamic_mobility_profile");

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        activeAgents: 1245000 + Math.floor(Math.random() * 1000),
        avgVelocity: 45.2,
        congestionIndex: 0.8,
        lastUpdated: new Date().toISOString(),
    };
};

/**
 * Triggers Causal Inference to debias intention
 */
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
  console.log(`[Diffusion] Start: ${start}, End: ${end}, Prototype: ${prototype}, Causal: ${causalTarget}`);
  
  // If causalTarget exists, it might override or influence the 'end' point in a real system.
  // For this replay, we use the provided coordinates.
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
    // Seed data for v0.1 demonstration
    seedSampleData();

    const timestamp = new Date();
    const context = await reason(userId, timestamp);

    // Transform structured context into "Thought Chains" for the UI
    const steps = [
        `Analyzing patterns for user: ${userId}...`,
        `Identified top venues: ${context.individual.topVenues.map(v => v.category).join(', ')}.`,
        `Last activity context: ${context.world.category} (${context.world.description})`,
        `Population trend: ${context.collective.globalPopularity * 100}% transition rate from ${context.world.category}.`,
        `Recommended behavior: ${context.individual.periodicPatterns[0]?.mostLikelyCategory || 'Normal Routine'}.`,
    ];

    return steps;
};

export const getAgentReasoningContext = async (userId: string) => {
    seedSampleData();
    return await reason(userId, new Date());
};
