import { UMRAlignment } from './types';

/**
 * Calculates the joint loss for the TrajBench unified mobility model.
 */
export class UMRLossEngine {
    /**
     * L_total = lambda1*L_reason + lambda2*L_diff + lambda3*L_causal
     */
    public calculateJointLoss(
        alignment: UMRAlignment,
        targetLatent: number[],
        lambda: { r: number; d: number; c: number } = { r: 0.5, d: 0.3, c: 0.2 }
    ): { total: number; components: Record<string, number> } {
        // 1. Reasoning Loss: MSE between latent and target
        const lReason = this.mse(alignment.latent, targetLatent);
        
        // 2. Diffusion Loss: Uncertainty-weighted distance
        // High confidence reduces loss for the generative head
        const lDiff = Math.abs(alignment.confidence - 1.0) * 0.5;
        
        // 3. Causal Loss: Alignment with intended category
        // In a real SCM, this would be the KL-divergence between p(y|do(x)) and p(y|x)
        const lCausal = 0.05 * (alignment.metadata.intentionTag === 'Routine' ? 1 : 2);

        const total = (lambda.r * lReason) + (lambda.d * lDiff) + (lambda.c * lCausal);

        return {
            total,
            components: {
                reasoning: lambda.r * lReason,
                diffusion: lambda.d * lDiff,
                causal: lambda.c * lCausal
            }
        };
    }

    /**
     * Computes the gradient update direction (mocked for simulation).
     */
    public getGradientStep(latent: number[], target: number[]): number[] {
        return latent.map((val, i) => (target[i] - val) * 0.1);
    }

    private mse(a: number[], b: number[]): number {
        return a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0) / a.length;
    }
}
