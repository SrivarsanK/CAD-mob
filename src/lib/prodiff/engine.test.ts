import { describe, it, expect } from 'vitest';
import { impute } from './engine';
import { createLinearSchedule } from './math';

describe('ProDiff Imputation Engine', () => {
  it('should generate a noise schedule with correct length', () => {
    const steps = 100;
    const schedule = createLinearSchedule(steps);
    expect(schedule.betas.length).toBe(steps);
    expect(schedule.alphasCumprod.length).toBe(steps);
    expect(schedule.alphasCumprod[steps - 1]).toBeLessThan(schedule.alphasCumprod[0]);
  });

  it('should impute intermediate points between start and end', async () => {
    const start = { lat: 0, lng: 0 };
    const end = { lat: 1, lng: 1 };
    const resolution = 5;
    
    const result = await impute(start, end, resolution, 10);
    
    expect(result.predicted.length).toBe(resolution);
    expect(result.predicted[0]).toEqual(start);
    expect(result.predicted[resolution - 1]).toEqual(end);
    
    // Check if intermediate points are generated (not just start/end)
    expect(result.predicted[2].lat).toBeGreaterThan(0);
    expect(result.predicted[2].lat).toBeLessThan(1);
  });
});
