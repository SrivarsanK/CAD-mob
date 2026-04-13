'use server';

import { cache } from 'react';
import { reason } from '@/lib/agent-move/engine';
import { impute } from '@/lib/prodiff/engine';
import { seedSampleData } from '@/lib/data/foursquare/parser';
import { parsePortoCSV } from '@/lib/data/porto/parser';
import { parseTDriveFile } from '@/lib/data/t-drive/parser';
import { memoryStore } from '@/lib/agent-move/memory/store';
import { CausalInferenceEngine } from '@/lib/causal/inference';
import { PrototypeType } from '@/lib/prodiff/pce';
import { UMRAlignor } from '@/lib/core/umr/alignment';
import { matchPrototype } from '@/lib/prodiff/pce';
import fs from 'fs';
import path from 'path';

/**
 * Switches the active dataset in the in-memory store.
 */
export async function switchDataset(type: "foursquare" | "porto" | "tdrive") {
    memoryStore.clear();
    
    if (type === "foursquare") {
        seedSampleData();
    } else if (type === "porto") {
        const filePath = path.join(process.cwd(), 'data/raw/porto/sample.csv');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const trajectories = parsePortoCSV(content);
            // Adapt Trajectory to MobilityRecord for AgentMove if needed, 
            // but for now we'll just log and use raw for diffusion.
            console.log(`Loaded ${trajectories.length} Porto trajectories`);
        }
    } else if (type === "tdrive") {
        const filePath = path.join(process.cwd(), 'data/raw/t-drive/sample.txt');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const trajectories = parseTDriveFile(content);
            console.log(`Loaded ${trajectories.length} T-Drive trajectories`);
        }
    }
    
    return { success: true, dataset: type };
}

/**
 * The architectural linchpin: Performs joint latent alignment across Reasoning, 
 * Diffusion, and Causal heads to produce a Unified Mobility Representation (UMR).
 */
export async function alignMobilityUMR(
    userId: string, 
    start: [number, number], 
    end: [number, number],
    interventions: { historyDisabled: boolean; zoneBlocked: boolean; normsOverridden: boolean } = {
        historyDisabled: false,
        zoneBlocked: false,
        normsOverridden: false
    }
) {
    const SERVER_URL = process.env.BACKEND_API_URL || "http://localhost:8000";
    
    try {
        const response = await fetch(`${SERVER_URL}/api/align`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, start, end, interventions })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Backend API Error, falling back to local simulation:", error);
        
        // Local Fallback (keep existing logic as backup)
        if (memoryStore.getAllRecords().length === 0) seedSampleData();
        const reasoning = await reason(userId, new Date());
        const startPoint = { lat: start[0], lng: start[1] };
        const endPoint = { lat: end[0], lng: end[1] };
        const prototype = matchPrototype(startPoint, endPoint);
        const alignor = new UMRAlignor();
        const alignment = alignor.align(reasoning, prototype, userId, interventions);
        const imputation = await impute(startPoint, endPoint, 20, interventions.zoneBlocked ? 10 : 50);

        return {
            alignment,
            path: imputation.predicted,
            reasoningSteps: [
                `Analysed patterns locally (Fallback)`,
                `Fused latent confidence: ${(alignment.confidence * 100).toFixed(1)}%`
            ],
            isFallback: true
        };
    }
}


export const getMobilityProfile = async () => {
    return {
        activeAgents: 1245000 + Math.floor(Math.random() * 1000),
        avgVelocity: 45.2,
        congestionIndex: 0.8,
        lastUpdated: new Date().toISOString(),
    };
};

export async function triggerCausalInference(intention: string, blocked: boolean = false) {
  const engine = new CausalInferenceEngine();
  return engine.estimateLocationEffect(intention, { 
    history_biased: true, 
    zone_blocked: blocked 
  });
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
    if (memoryStore.getAllRecords().length === 0) seedSampleData();
    const context = await reason(userId, new Date());

    return [
        `Analyzing patterns for user: ${userId}...`,
        `Identified top venues: ${context.individual.topVenues.map(v => v.category).join(', ')}.`,
        `Last activity context: ${context.world.category}`,
        `Recommended behavior: ${context.individual.periodicPatterns[0]?.mostLikelyCategory || 'Normal Routine'}.`,
    ];
};
