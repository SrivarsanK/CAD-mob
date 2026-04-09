import { MobilityRecord, MobilityRecordSchema } from "../../agent-move/types";
import { memoryStore } from "../../agent-move/memory/store";

/**
 * Parses raw check-in data into the standardized MobilityRecord format.
 */
export function parseFoursquareCheckin(raw: any): MobilityRecord {
  const record = {
    id: raw.id || Math.random().toString(36).substr(2, 9),
    userId: raw.userId,
    venueId: raw.venueId,
    venueCategory: raw.venueCategory,
    latitude: Number(raw.latitude),
    longitude: Number(raw.longitude),
    timestamp: new Date(raw.timestamp),
    timezoneOffset: Number(raw.timezoneOffset || 0),
  };

  return MobilityRecordSchema.parse(record);
}

/**
 * Seeds the in-memory store with sample FourSquare data for demonstration.
 */
export function seedSampleData() {
  const userId = "user_88";
  const baseTime = new Date("2026-04-09T08:00:00Z").getTime();
  
  const sampleData = [
    { userId, venueId: "v1", venueCategory: "Home", latitude: 40.7128, longitude: -74.0060, timestamp: new Date(baseTime) },
    { userId, venueId: "v2", venueCategory: "Coffee Shop", latitude: 40.7135, longitude: -74.0050, timestamp: new Date(baseTime + 3600000) },
    { userId, venueId: "v3", venueCategory: "Office", latitude: 40.7589, longitude: -73.9851, timestamp: new Date(baseTime + 7200000) },
    { userId, venueId: "v3", venueCategory: "Office", latitude: 40.7589, longitude: -73.9851, timestamp: new Date(baseTime + 14400000) },
    { userId, venueId: "v4", venueCategory: "Gym", latitude: 40.7829, longitude: -73.9654, timestamp: new Date(baseTime + 36000000) },
  ];

  const parsed = sampleData.map(parseFoursquareCheckin);
  memoryStore.addRecords(parsed);
}
