import { Point, ImputationResult } from "./types";
import { createLinearSchedule } from "./math";
import { matchPrototype } from "./pce";
import { denoiseStep } from "./denoiser";

/**
 * Main ProDiff Imputation Engine.
 */
export async function impute(
  start: Point,
  end: Point,
  resolution = 10,
  steps = 50
): Promise<ImputationResult> {
  // 1. Initialize Schedule & PCE
  const schedule = createLinearSchedule(steps);
  const prototype = matchPrototype(start, end);

  // 2. Initialize latent space (Pure noise trajectory)
  let currentTrajectory: Point[] = Array.from({ length: resolution }, () => ({
    lat: start.lat + (Math.random() - 0.5) * 0.1,
    lng: start.lng + (Math.random() - 0.5) * 0.1,
  }));

  // Ensure endpoints are fixed (Boundary conditioning)
  currentTrajectory[0] = start;
  currentTrajectory[currentTrajectory.length - 1] = end;

  // 3. Iterative Reverse Diffusion
  for (let t = steps - 1; t >= 0; t--) {
    const progress = t / steps;
    currentTrajectory = denoiseStep(
      currentTrajectory,
      start,
      end,
      prototype,
      progress,
      steps
    );
    
    // Fix boundary conditions after each step
    currentTrajectory[0] = start;
    currentTrajectory[currentTrajectory.length - 1] = end;
  }

  return {
    original: [start, end],
    predicted: currentTrajectory,
    prototypeId: prototype.id,
  };
}
