import type { EphemerisSample, InterpolatedState, Vec3Km } from "../types";

function add(a: Vec3Km, b: Vec3Km): Vec3Km {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(v: Vec3Km, s: number): Vec3Km {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function findSegment(samples: EphemerisSample[], tSec: number, hintIndex = 0): number {
  const lastSegment = samples.length - 2;
  const start = clamp(hintIndex, 0, lastSegment);

  if (samples[start].tSec <= tSec && tSec <= samples[start + 1].tSec) {
    return start;
  }

  if (tSec >= samples[lastSegment].tSec) {
    return lastSegment;
  }

  if (tSec <= samples[0].tSec) {
    return 0;
  }

  let lo = 0;
  let hi = lastSegment;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const t0 = samples[mid].tSec;
    const t1 = samples[mid + 1].tSec;

    if (t0 <= tSec && tSec <= t1) {
      return mid;
    }

    if (tSec < t0) {
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  return lastSegment;
}

export function hermiteInterpolate(
  samples: EphemerisSample[],
  tSec: number,
  hintIndex = 0,
): InterpolatedState {
  if (samples.length < 2) {
    throw new Error("Need at least two samples for interpolation");
  }

  const clampedTime = clamp(tSec, samples[0].tSec, samples[samples.length - 1].tSec);
  const segmentIndex = findSegment(samples, clampedTime, hintIndex);

  const a = samples[segmentIndex];
  const b = samples[segmentIndex + 1];

  const dt = b.tSec - a.tSec;
  if (dt <= 0) {
    return {
      tSec: clampedTime,
      positionKm: a.positionKm,
      velocityKmS: a.velocityKmS,
      segmentIndex,
    };
  }

  const u = (clampedTime - a.tSec) / dt;
  const u2 = u * u;
  const u3 = u2 * u;

  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = u3 - 2 * u2 + u;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = u3 - u2;

  const m0 = scale(a.velocityKmS, dt);
  const m1 = scale(b.velocityKmS, dt);

  const positionKm = add(
    add(scale(a.positionKm, h00), scale(m0, h10)),
    add(scale(b.positionKm, h01), scale(m1, h11)),
  );

  const dh00 = 6 * u2 - 6 * u;
  const dh10 = 3 * u2 - 4 * u + 1;
  const dh01 = -6 * u2 + 6 * u;
  const dh11 = 3 * u2 - 2 * u;

  const velocityKmS = scale(
    add(
      add(scale(a.positionKm, dh00), scale(m0, dh10)),
      add(scale(b.positionKm, dh01), scale(m1, dh11)),
    ),
    1 / dt,
  );

  return {
    tSec: clampedTime,
    positionKm,
    velocityKmS,
    segmentIndex,
  };
}

export function vecDistanceKm(a: Vec3Km, b: Vec3Km): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function vecMagnitudeKmS(v: Vec3Km): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

export function vecSubtract(a: Vec3Km, b: Vec3Km): Vec3Km {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
