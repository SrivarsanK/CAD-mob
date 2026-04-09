import { WorldKnowledge } from "../types";
import { memoryStore } from "./store";

/**
 * Provides world knowledge about urban categories (WKG stub).
 */
export async function getWorldContext(category: string): Promise<WorldKnowledge> {
  const cached = memoryStore.getWorldKnowledge(category);
  if (cached) return cached;

  // Static knowledge map for common FourSquare categories
  const worldMap: Record<string, WorldKnowledge> = {
    "Office": {
      category: "Office",
      description: "A place of work, typically active during standard business hours (9-5).",
      typicalPeers: ["Coffee Shop", "Subway Station", "Deli"],
      urbanInfluence: "commercial",
    },
    "Home": {
      category: "Home",
      description: "A private residence, high activity during nights and weekends.",
      typicalPeers: ["Grocery Store", "Park", "Bus Station"],
      urbanInfluence: "residential",
    },
    "Gym": {
      category: "Gym",
      description: "Fitness center, peaks in early morning and late evening.",
      typicalPeers: ["Juice Bar", "Health Food Store"],
      urbanInfluence: "recreational",
    },
  };

  const knowledge = worldMap[category] || {
    category,
    description: "General urban point of interest.",
    typicalPeers: [],
    urbanInfluence: "commercial",
  };

  memoryStore.setWorldKnowledge(category, knowledge);
  return knowledge;
}
