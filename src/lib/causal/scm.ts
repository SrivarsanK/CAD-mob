import { CausalVariable, CausalNode, CausalGraph, DEFAULT_SCM_GRAPH } from './types';

export class SCM {
  private graph: CausalGraph;
  private interventions: Set<CausalVariable> = new Set();

  constructor(graph: CausalGraph = DEFAULT_SCM_GRAPH) {
    this.graph = JSON.parse(JSON.stringify(graph));
    this.validateDAG();
  }

  /**
   * Applies a Pearlian 'do' intervention on a variable.
   * This removes all incoming edges to that variable.
   */
  public do(variable: CausalVariable): void {
    if (!this.graph[variable]) throw new Error(`Variable ${variable} not found in graph.`);
    
    // Pearson's 'do' operator cuts all parent edges
    this.graph[variable].parents = [];
    this.interventions.add(variable);
  }

  public getParents(variable: CausalVariable): CausalVariable[] {
    return this.graph[variable].parents;
  }

  public isIntervened(variable: CausalVariable): boolean {
    return this.interventions.has(variable);
  }

  /**
   * Simple DFS-based cycle detection
   */
  private validateDAG(): void {
    const visited = new Set<CausalVariable>();
    const recStack = new Set<CausalVariable>();

    const checkCycle = (v: CausalVariable): boolean => {
      if (!visited.has(v)) {
        visited.add(v);
        recStack.add(v);

        for (const parent of this.graph[v].parents) {
          if (!visited.has(parent) && checkCycle(parent)) return true;
          else if (recStack.has(parent)) return true;
        }
      }
      recStack.delete(v);
      return false;
    };

    for (const v in this.graph) {
      if (checkCycle(v as CausalVariable)) {
        throw new Error(`Cycle detected in Causal Graph involving ${v}`);
      }
    }
  }

  public getGraph(): CausalGraph {
    return this.graph;
  }
}
