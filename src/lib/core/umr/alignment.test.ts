import { describe, it, expect, beforeEach } from 'vitest';
import { UMRAlignor } from './alignment';
import { ReasoningContext } from '@/lib/agent-move/types';
import { Prototype } from '@/lib/prodiff/types';

describe('UMRAlignor', () => {
    let alignor: UMRAlignor;

    const mockReasoning: ReasoningContext = {
        targetUserId: 'user_123',
        timestamp: new Date(),
        individual: {
            userId: 'user_123',
            topVenues: [],
            periodicPatterns: [{ dayOfWeek: 1, hourRange: [9, 17], mostLikelyCategory: 'Office' }],
            recentHistory: []
        },
        world: {
            category: 'Commercial',
            description: 'Business district',
            typicalPeers: [],
            urbanInfluence: 'commercial'
        },
        collective: {
            sourceCategory: 'Home',
            transitionGraph: {},
            globalPopularity: 0.5
        }
    };

    const mockPrototype: Prototype = {
        id: 'proto_direct',
        name: 'Direct Path',
        description: 'Linear movement',
        pattern: []
    };

    beforeEach(() => {
        alignor = new UMRAlignor({ dimension: 64 });
    });

    it('should align reasoning and diffusion into a unified latent space', () => {
        const result = alignor.align(mockReasoning, mockPrototype, 'user_123');
        
        expect(result.latent).toHaveLength(64);
        expect(result.confidence).toBeGreaterThan(0);
        expect(result.metadata.userId).toBe('user_123');
        expect(result.metadata.intentionTag).toBe('Office');
    });

    it('should maintain head weights summing to 1.0 (approximately)', () => {
        const result = alignor.align(mockReasoning, mockPrototype, 'user_123');
        const totalWeight = result.headWeights.reasoning + result.headWeights.diffusion + result.headWeights.causal;
        expect(totalWeight).toBeCloseTo(1.0, 5);
    });
});
