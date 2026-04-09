import { Point, Prototype } from "./types";
import { lerp } from "./math";

/**
 * Simulates a 1D-UNet denoising step.
 * In a real model, this would be a neural network predicting the noise residual.
 * For v0.1 Foundation, we use a guided interpolation that moves noise toward a prototype.
 */
export function denoiseStep(
  noisedPoints: Point[],
  start: Point,
  end: Point,
  prototype: Prototype,
  t: number, // 0 to 1 (normalized diffusion step)
  totalSteps: number
): Point[] {
  // Guidance factor: how much to trust the prototype vs the noise
  const guidance = 1.0 - t; 

  return noisedPoints.map((p, i) => {
    const fraction = i / (noisedPoints.length - 1);
    
    // 1. Base interpolation (straight line)
    const base = lerp(start, end, fraction);
    
    // 2. Prototype influence
    // Map i to prototype pattern index
    const protoIdx = Math.floor(fraction * (prototype.pattern.length - 1));
    const protoPoint = prototype.pattern[protoIdx];
    
    // Offset logic to match scale
    const offsetLat = (end.lat - start.lat) * protoPoint.lat;
    const offsetLng = (end.lng - start.lng) * protoPoint.lng;
    const guided = { lat: start.lat + offsetLat, lng: start.lng + offsetLng };

    // 3. Move current point towards guided point
    return lerp(p, guided, guidance / totalSteps);
  });
}
