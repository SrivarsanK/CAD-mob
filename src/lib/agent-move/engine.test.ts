import { describe, it, expect, beforeAll } from 'vitest';
import { reason } from './engine';
import { seedSampleData } from '../data/foursquare/parser';
import { memoryStore } from './memory/store';

describe('AgentMove Reasoning Engine', () => {
  beforeAll(() => {
    seedSampleData();
  });

  it('should synthesize reasoning context for a valid user', async () => {
    const userId = 'user_88';
    const timestamp = new Date();
    const context = await reason(userId, timestamp);

    expect(context.targetUserId).toBe(userId);
    expect(context.individual.userId).toBe(userId);
    expect(context.individual.topVenues.length).toBeGreaterThan(0);
    expect(context.world.category).toBeDefined();
    expect(context.collective.transitionGraph).toBeDefined();
  });

  it('should identify "Home" as the anchor for an unknown context', async () => {
    const userId = 'unknown_user';
    const timestamp = new Date();
    const context = await reason(userId, timestamp);

    // Should default to Home if no history
    expect(context.world.category).toBe('Home');
    expect(context.collective.sourceCategory).toBe('Home');
  });

  it('should mine periodic patterns correctly', async () => {
    const userId = 'user_88';
    const context = await reason(userId, new Date());
    
    // In our seed data, we have specific patterns
    const patterns = context.individual.periodicPatterns;
    expect(patterns.length).toBeGreaterThan(0);
    
    // Check if Office is one of the top categories
    const categories = context.individual.topVenues.map(v => v.category);
    expect(categories).toContain('Office');
  });
});
