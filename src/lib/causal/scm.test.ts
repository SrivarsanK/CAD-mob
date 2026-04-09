import { describe, it, expect } from 'vitest';
import { SCM } from './scm';
import { CausalInferenceEngine } from './inference';
import { DEFAULT_SCM_GRAPH } from './types';

describe('Causal Layer (SCM)', () => {
  it('should detect cycles in the graph', () => {
    const cyclicGraph = JSON.parse(JSON.stringify(DEFAULT_SCM_GRAPH));
    // Create a cycle: L -> H -> I -> L
    cyclicGraph.H.parents = ['L'];
    
    expect(() => new SCM(cyclicGraph)).toThrow(/Cycle detected/);
  });

  it('should correctly apply do-operator', () => {
    const scm = new SCM();
    expect(scm.getParents('I')).toContain('H'); // Intention normally depends on history
    
    scm.do('I');
    expect(scm.getParents('I')).toHaveLength(0); // All parents severed
    expect(scm.isIntervened('I')).toBe(true);
  });

  it('should estimate interventional effect', () => {
    const engine = new CausalInferenceEngine();
    const result = engine.estimateLocationEffect('Work', { 
      history_biased: true, 
      zone_blocked: false 
    });

    expect(result.location).toBe('CausalTarget_Work');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.interventions).toContain('I');
  });

  it('should respect physical constraints in the causal path', () => {
    const engine = new CausalInferenceEngine();
    const result = engine.estimateLocationEffect('Work', { 
      history_biased: true, 
      zone_blocked: true 
    });

    expect(result.confidence).toBeLessThan(0.5); // Blocked zone reduces confidence
  });
});
