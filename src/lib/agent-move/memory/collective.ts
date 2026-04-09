import { CollectiveKnowledge } from "../types";
import { memoryStore } from "./store";

/**
 * Captures population-level transition trends (CKE stub).
 */
export async function getCollectiveContext(sourceCategory: string): Promise<CollectiveKnowledge> {
  const cached = memoryStore.getCollectiveKnowledge(sourceCategory);
  if (cached) return cached;

  // Simple transition probability stubs
  const transitionMaps: Record<string, Record<string, number>> = {
    "Home": { "Office": 0.6, "Gym": 0.1, "Coffee Shop": 0.2, "Other": 0.1 },
    "Office": { "Home": 0.5, "Restaurant": 0.3, "Bar": 0.1, "Other": 0.1 },
    "Gym": { "Home": 0.7, "Office": 0.2, "Other": 0.1 },
  };

  const knowledge: CollectiveKnowledge = {
    sourceCategory,
    transitionGraph: transitionMaps[sourceCategory] || { "Home": 0.5, "Other": 0.5 },
    globalPopularity: 0.8,
  };

  memoryStore.setCollectiveKnowledge(sourceCategory, knowledge);
  return knowledge;
}
