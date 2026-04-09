import { Point, Prototype } from "./types";
import { distance } from "./math";

/**
 * Registry of canonical movement prototypes (PCE).
 */
export const PROTOTYPE_REGISTRY: Prototype[] = [
  {
    id: "proto_direct",
    name: "Direct Path",
    description: "Linear movement between points.",
    pattern: [{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }],
  },
  {
    id: "proto_arc",
    name: "Commute Arc",
    description: "Curved movement typical of urban transit.",
    pattern: [{ lat: 0, lng: 0 }, { lat: 0.5, lng: 0.8 }, { lat: 1, lng: 1 }],
  },
  {
    id: "proto_erratic",
    name: "Leisure Wandering",
    description: "Multi-point wandering pattern.",
    pattern: [{ lat: 0, lng: 0 }, { lat: 0.2, lng: 0.7 }, { lat: 0.8, lng: 0.3 }, { lat: 1, lng: 1 }],
  },
];

/**
 * Matches a trajectory intention to a prototype bank based on endpoints and distance.
 */
export function matchPrototype(start: Point, end: Point): Prototype {
  const dist = distance(start, end);

  // Heuristic for v0.1: Large distance -> Arc, Small -> Direct
  if (dist > 0.05) {
    return PROTOTYPE_REGISTRY[1]; // Arc
  } else if (dist < 0.01) {
    return PROTOTYPE_REGISTRY[2]; // Erratic
  }
  
  return PROTOTYPE_REGISTRY[0]; // Direct
}
