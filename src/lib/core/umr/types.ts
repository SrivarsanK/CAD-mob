import { ReasoningContext } from '@/lib/agent-move/types';
import { PrototypeType } from '@/lib/prodiff/pce';

/**
 * The Unified Mobility Representation (UMR) vector.
 * Consists of a 128-dimensional embedding space.
 */
export type UMRVector = number[];

export interface UMRAlignment {
    latent: UMRVector;
    confidence: number;
    headWeights: {
        reasoning: number;
        diffusion: number;
        causal: number;
    };
    metadata: {
        userId: string;
        timestamp: string;
        intentionTag: string;
    };
}

export interface AlignmentConfig {
    dimension: number;
    learningRate: number;
    regularization: number;
}
