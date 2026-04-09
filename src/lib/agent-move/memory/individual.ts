import { DateTime } from "luxon";
import { MobilityRecord, IndividualKnowledge } from "../types";
import { memoryStore } from "./store";

/**
 * Mines individual mobility patterns from a user's trajectory history.
 */
export async function updateIndividualKnowledge(userId: string): Promise<IndividualKnowledge> {
  const records = memoryStore.getRecordsForUser(userId);
  
  // 1. Calculate Top Venues
  const venueCounts: Record<string, { count: number; category: string }> = {};
  records.forEach((r) => {
    if (!venueCounts[r.venueId]) {
      venueCounts[r.venueId] = { count: 0, category: r.venueCategory };
    }
    venueCounts[r.venueId].count++;
  });

  const topVenues = Object.entries(venueCounts)
    .map(([venueId, data]) => ({
      venueId,
      count: data.count,
      category: data.category,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 2. Identify Periodic Patterns (Simplistic for v0.1)
  // Group by day of week and hour range
  const patternMap: Record<string, Record<string, number>> = {};
  records.forEach((r) => {
    const dt = DateTime.fromJSDate(r.timestamp);
    const day = dt.weekday; // 1-7
    const hourRange = Math.floor(dt.hour / 4) * 4; // 4-hour blocks
    const key = `${day}-${hourRange}`;
    
    if (!patternMap[key]) patternMap[key] = {};
    patternMap[key][r.venueCategory] = (patternMap[key][r.venueCategory] || 0) + 1;
  });

  const periodicPatterns = Object.entries(patternMap).map(([key, categories]) => {
    const [day, hour] = key.split("-").map(Number);
    const mostLikelyCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      dayOfWeek: day,
      hourRange: [hour, hour + 4] as [number, number],
      mostLikelyCategory,
    };
  });

  const knowledge: IndividualKnowledge = {
    userId,
    topVenues,
    periodicPatterns,
    recentHistory: records.slice(-5), // Last 5 check-ins
  };

  memoryStore.setIndividualKnowledge(userId, knowledge);
  return knowledge;
}

export async function getIndividualContext(userId: string): Promise<IndividualKnowledge> {
  const existing = memoryStore.getIndividualKnowledge(userId);
  if (existing) return existing;
  return updateIndividualKnowledge(userId);
}
