import { MobilityRecord, IndividualKnowledge, WorldKnowledge, CollectiveKnowledge } from "../types";

/**
 * In-memory store for AgentMove modules during Milestone v0.1 Foundation.
 */
class MemoryStore {
  private records: MobilityRecord[] = [];
  private individualCache: Map<string, IndividualKnowledge> = new Map();
  private worldCache: Map<string, WorldKnowledge> = new Map();
  private collectiveCache: Map<string, CollectiveKnowledge> = new Map();

  // Records
  addRecords(newRecords: MobilityRecord[]) {
    this.records.push(...newRecords);
    // Sort by timestamp for easier retrieval
    this.records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  clear() {
    this.records = [];
    this.individualCache.clear();
    this.worldCache.clear();
    this.collectiveCache.clear();
  }

  getAllRecords(): MobilityRecord[] {
    return this.records;
  }

  getRecordsForUser(userId: string): MobilityRecord[] {
    return this.records.filter((r) => r.userId === userId);
  }

  // Individual Knowledge
  setIndividualKnowledge(userId: string, knowledge: IndividualKnowledge) {
    this.individualCache.set(userId, knowledge);
  }

  getIndividualKnowledge(userId: string): IndividualKnowledge | undefined {
    return this.individualCache.get(userId);
  }

  // World Knowledge
  setWorldKnowledge(category: string, knowledge: WorldKnowledge) {
    this.worldCache.set(category, knowledge);
  }

  getWorldKnowledge(category: string): WorldKnowledge | undefined {
    return this.worldCache.get(category);
  }

  // Collective Knowledge
  setCollectiveKnowledge(category: string, knowledge: CollectiveKnowledge) {
    this.collectiveCache.set(category, knowledge);
  }

  getCollectiveKnowledge(category: string): CollectiveKnowledge | undefined {
    return this.collectiveCache.get(category);
  }
}

export const memoryStore = new MemoryStore();
