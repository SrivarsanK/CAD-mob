import { SCM } from './scm';
import { CausalVariable } from './types';

export interface InferenceResult {
  location: string;
  confidence: number;
  causalPath: string[];
  interventions: CausalVariable[];
}

/**
 * Causal Inference Engine
 * Estimates the effects of interventions on mobility outcomes.
 */
export class CausalInferenceEngine {
  private scm: SCM;

  constructor(scm: SCM = new SCM()) {
    this.scm = scm;
  }

  /**
   * Estimates P(L | do(I=intention))
   * In a real system, this would use a learned CPT or structural equations.
   * Here we simulate the structural independence.
   */
  public estimateLocationEffect(
    intention: string, 
    context: { history_biased: boolean; zone_blocked: boolean }
  ): InferenceResult {
    const scm = new SCM(); // Fresh graph
    scm.do('I'); // Apply do(I)

    // Logically: L is a function of I, Z, E.
    // Since we did do(I), L now ignores H (History) which otherwise affects I.
    
    let baseConfidence = 0.85;
    
    // If we have a physical constraint (Zone blocked = E variable parent of L)
    if (context.zone_blocked) {
      baseConfidence *= 0.2; // Physical constraint overrides intention
    }

    // Structural check
    const parentsOfI = scm.getParents('I');
    if (parentsOfI.length !== 0) {
      throw new Error("Causal violation: do(I) failed to sever parent edges.");
    }

    return {
      location: `CausalTarget_${intention}`,
      confidence: baseConfidence,
      causalPath: ['I', 'L'], // Shortest path after intervention
      interventions: ['I']
    };
  }
}
