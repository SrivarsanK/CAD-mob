export interface Point {
  lat: number;
  lng: number;
}

export interface Trajectory {
  points: Point[];
  userId?: string;
  metadata?: Record<string, any>;
}

export interface NoiseSchedule {
  betas: number[];
  alphas: number[];
  alphasCumprod: number[];
}

export interface Prototype {
  id: string;
  name: string;
  pattern: Point[]; // Canonical pattern (e.g., unit square/circle coordinates)
  description: string;
}

export interface ImputationResult {
  original: [Point, Point];
  predicted: Point[];
  prototypeId?: string;
}
