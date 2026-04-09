import { z } from "zod";

/**
 * Standard mobility record schema based on FourSquare dataset structure.
 */
export const MobilityRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  venueId: z.string(),
  venueCategory: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timestamp: z.date(), // UTC
  timezoneOffset: z.number().default(0),
});

export type MobilityRecord = z.infer<typeof MobilityRecordSchema>;

/**
 * Individual Knowledge: Summarized patterns for a specific user.
 */
export interface IndividualKnowledge {
  userId: string;
  topVenues: Array<{ venueId: string; count: number; category: string }>;
  periodicPatterns: Array<{
    dayOfWeek: number;
    hourRange: [number, number];
    mostLikelyCategory: string;
  }>;
  recentHistory: MobilityRecord[];
}

/**
 * World Knowledge: Urban context for a location or category.
 */
export interface WorldKnowledge {
  category: string;
  description: string;
  typicalPeers: string[]; // Related categories found in same zones
  urbanInfluence: "commercial" | "residential" | "industrial" | "recreational";
}

/**
 * Collective Knowledge: Population-level transition trends.
 */
export interface CollectiveKnowledge {
  sourceCategory: string;
  transitionGraph: Record<string, number>; // Probability of going to next category
  globalPopularity: number;
}

/**
 * The consolidated context provided to the LLM reasoning head.
 */
export interface ReasoningContext {
  targetUserId: string;
  timestamp: Date;
  individual: IndividualKnowledge;
  world: WorldKnowledge;
  collective: CollectiveKnowledge;
}
