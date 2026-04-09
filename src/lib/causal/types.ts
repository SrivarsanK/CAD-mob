/**
 * Causal variables as defined in the Research Plan:
 * (H)istory, (T)ime, (Z)one, (E)vent, (N)orms -> (I)ntention -> (L)ocation
 */
export type CausalVariable = 'H' | 'T' | 'Z' | 'E' | 'N' | 'I' | 'L';

export interface CausalNode {
  id: CausalVariable;
  name: string;
  description: string;
  parents: CausalVariable[];
}

export type CausalGraph = Record<CausalVariable, CausalNode>;

export const DEFAULT_SCM_GRAPH: CausalGraph = {
  H: { id: 'H', name: 'History', description: 'Individual mobility history (biased)', parents: [] },
  T: { id: 'T', name: 'Time', description: 'Spatio-temporal context (Time of day)', parents: [] },
  Z: { id: 'Z', name: 'Zone', description: 'Spatial context (Functional zone)', parents: [] },
  E: { id: 'E', name: 'Event', description: 'External events/anomalies', parents: [] },
  N: { id: 'N', name: 'Norms', description: 'Societal/Collective mobility norms', parents: [] },
  I: { id: 'I', name: 'Intention', description: 'Latent movement intention', parents: ['H', 'T', 'Z', 'E', 'N'] },
  L: { id: 'L', name: 'Location', description: 'Outcome (Next Location)', parents: ['I', 'Z', 'E'] },
};
