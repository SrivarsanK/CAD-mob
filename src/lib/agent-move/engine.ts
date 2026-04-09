import { ReasoningContext } from "./types";
import { getIndividualContext } from "./memory/individual";
import { getWorldContext } from "./memory/world";
import { getCollectiveContext } from "./memory/collective";

/**
 * The core AgentMove reasoning engine orchestrator.
 * Synthesizes individual patterns, world context, and collective trends.
 */
export async function reason(userId: string, targetTimestamp: Date): Promise<ReasoningContext> {
  // 1. Fetch individual history and patterns
  const individual = await getIndividualContext(userId);

  // 2. Identify the last known category to anchor world/collective context
  const lastRecord = individual.recentHistory[individual.recentHistory.length - 1];
  const lastCategory = lastRecord ? lastRecord.venueCategory : "Home";

  // 3. Gather World Knowledge for the current/last context
  const world = await getWorldContext(lastCategory);

  // 4. Gather Collective Knowledge for the transition
  const collective = await getCollectiveContext(lastCategory);

  return {
    targetUserId: userId,
    timestamp: targetTimestamp,
    individual,
    world,
    collective,
  };
}
