import { NoiseSchedule, Point } from "./types";

/**
 * Generates a linear noise schedule for DDPM.
 */
export function createLinearSchedule(steps: number, betaStart = 0.0001, betaEnd = 0.02): NoiseSchedule {
  const betas = [];
  for (let i = 0; i < steps; i++) {
    betas.push(betaStart + (betaEnd - betaStart) * (i / (steps - 1)));
  }

  const alphas = betas.map((b) => 1 - b);
  const alphasCumprod: number[] = [];
  let currentCumprod = 1;
  alphas.forEach((a) => {
    currentCumprod *= a;
    alphasCumprod.push(currentCumprod);
  });

  return { betas, alphas, alphasCumprod };
}

/**
 * Adds noise to a point (Forward Process).
 */
export function q_sample(point: Point, alphaCumprod: number, noise: Point): Point {
  const sqrtAt = Math.sqrt(alphaCumprod);
  const sqrtOneMinusAt = Math.sqrt(1 - alphaCumprod);

  return {
    lat: sqrtAt * point.lat + sqrtOneMinusAt * noise.lat,
    lng: sqrtAt * point.lng + sqrtOneMinusAt * noise.lng,
  };
}

/**
 * Simple Euclidean distance between two points.
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
}

/**
 * Linear interpolation between two points.
 */
export function lerp(p1: Point, p2: Point, t: number): Point {
  return {
    lat: p1.lat + (p2.lat - p1.lat) * t,
    lng: p1.lng + (p2.lng - p1.lng) * t,
  };
}
