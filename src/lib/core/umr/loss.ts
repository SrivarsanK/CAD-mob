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
    ): number {
        // Mocking loss components
        const lReason = this.mse(alignment.latent, targetLatent);
        const lDiff = Math.abs(alignment.confidence - 1.0);
        const lCausal = 0.05; // Dummy causal alignment error

        return (lambda.r * lReason) + (lambda.d * lDiff) + (lambda.c * lCausal);
    }

    private mse(a: number[], b: number[]): number {
        return a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0) / a.length;
    }
}
