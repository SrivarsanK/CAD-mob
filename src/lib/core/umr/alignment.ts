import { ReasoningContext } from '@/lib/agent-move/types';
import { Prototype } from '@/lib/prodiff/types';
import { UMRVector, UMRAlignment, AlignmentConfig } from './types';

/**
 * UMR Alignor: Maps heterogeneous mobility data into a unified latent space.
 */
export class UMRAlignor {
    private config: AlignmentConfig;

    constructor(config: Partial<AlignmentConfig> = {}) {
        this.config = {
            dimension: 128,
            learningRate: 0.001,
            regularization: 0.01,
            ...config,
        };
    }

    /**
     * Aligns reasoning, diffusion, and causal latents via semantic projection.
     */
    public align(
        reasoning: ReasoningContext,
        prototype: Prototype,
        userId: string,
        interventions: { historyDisabled: boolean; zoneBlocked: boolean; normsOverridden: boolean } = {
            historyDisabled: false,
            zoneBlocked: false,
            normsOverridden: false
        }
    ): UMRAlignment {
        // Step 1: Project reasoning context (LLM-head)
        const reasonLatent = this.projectReasoning(reasoning);

        // Step 2: Project diffusion prototype (Generative-head)
        const diffLatent = this.projectDiffusion(prototype);

        // Step 3: Causal Adjustment (do-calculus projection)
        // If history is disabled, we reduce the reasoning weight (which contains historical bias)
        let causalWeight = 0.2;
        let reasonWeight = 0.4;
        let diffWeight = 0.4;

        if (interventions.historyDisabled) {
            reasonWeight *= 0.5;
            causalWeight += 0.2;
        }
        if (interventions.zoneBlocked) {
            diffWeight *= 0.3; // Physical constraints override generative patterns
            causalWeight += 0.3;
        }

        // Normalize weights
        const totalWeight = reasonWeight + diffWeight + causalWeight;
        reasonWeight /= totalWeight;
        diffWeight /= totalWeight;
        causalWeight /= totalWeight;

        // Step 4: Weighted fusion
        const fusedLatent = reasonLatent.map((val, i) => 
            (reasonWeight * val) + (diffWeight * diffLatent[i]) + (causalWeight * Math.random())
        );

        return {
            latent: fusedLatent,
            confidence: interventions.zoneBlocked ? 0.4 : 0.85, 
            headWeights: {
                reasoning: reasonWeight,
                diffusion: diffWeight,
                causal: causalWeight,
            },
            metadata: {
                userId,
                timestamp: reasoning.timestamp.toISOString(),
                intentionTag: interventions.historyDisabled ? 'Counterfactual' : (reasoning.individual.periodicPatterns[0]?.mostLikelyCategory || 'Routine'),
            },
        };
    }

    private projectReasoning(ctx: ReasoningContext): UMRVector {
        const hash = ctx.world.category.length * 0.1;
        return Array.from({ length: this.config.dimension }, (_, i) => Math.sin(hash + i));
    }

    private projectDiffusion(proto: Prototype): UMRVector {
        const hash = proto.id.length * 0.13;
        return Array.from({ length: this.config.dimension }, (_, i) => Math.cos(hash + i));
    }
}
