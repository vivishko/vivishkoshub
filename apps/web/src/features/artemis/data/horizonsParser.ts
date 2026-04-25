import artemisDatasetJson from "./artemisSampleData.json";
import type { ArtemisDataset, BodyName, EphemerisSample } from "../types";

const BODY_KEYS: BodyName[] = ["earth", "moon", "sun", "orion"];

function isFiniteVec3(value: unknown): value is [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((item) => typeof item === "number" && Number.isFinite(item))
  );
}

function validateSamples(samples: unknown, body: BodyName): EphemerisSample[] {
  if (!Array.isArray(samples) || samples.length < 4) {
    throw new Error(`Invalid or sparse ephemeris for ${body}`);
  }

  const normalized = samples.map((sample, index) => {
    if (typeof sample !== "object" || sample === null) {
      throw new Error(`Invalid sample object for ${body} at index ${index}`);
    }

    const candidate = sample as Partial<EphemerisSample>;
    if (typeof candidate.tSec !== "number" || !Number.isFinite(candidate.tSec)) {
      throw new Error(`Invalid tSec for ${body} at index ${index}`);
    }

    if (!isFiniteVec3(candidate.positionKm) || !isFiniteVec3(candidate.velocityKmS)) {
      throw new Error(`Invalid vectors for ${body} at index ${index}`);
    }

    return {
      tSec: candidate.tSec,
      positionKm: candidate.positionKm,
      velocityKmS: candidate.velocityKmS,
    } satisfies EphemerisSample;
  });

  for (let i = 1; i < normalized.length; i += 1) {
    if (normalized[i].tSec <= normalized[i - 1].tSec) {
      throw new Error(`Non-monotonic sample time for ${body} at index ${i}`);
    }
  }

  return normalized;
}

export function loadArtemisDataset(): ArtemisDataset {
  const raw = artemisDatasetJson as unknown as Partial<ArtemisDataset>;

  if (!raw.metadata || raw.metadata.source !== "JPL Horizons") {
    throw new Error("Invalid Artemis dataset metadata source");
  }

  if (!raw.bodies || typeof raw.bodies !== "object") {
    throw new Error("Missing Artemis dataset bodies");
  }

  const bodies = BODY_KEYS.reduce(
    (acc, body) => {
      acc[body] = validateSamples((raw.bodies as Record<string, unknown>)[body], body);
      return acc;
    },
    {} as Record<BodyName, EphemerisSample[]>,
  );

  if (!Array.isArray(raw.events) || !raw.events.length) {
    throw new Error("Missing mission events");
  }

  return {
    metadata: {
      source: "JPL Horizons",
      missionName: "Artemis II",
      missionEpochUtc: raw.metadata.missionEpochUtc ?? "",
      generatedAtUtc: raw.metadata.generatedAtUtc ?? "",
      frame: raw.metadata.frame ?? "ICRF",
      center: raw.metadata.center ?? "",
      sampleStep: raw.metadata.sampleStep ?? "",
      sampleWindow: {
        startUtc: raw.metadata.sampleWindow?.startUtc ?? "",
        stopUtc: raw.metadata.sampleWindow?.stopUtc ?? "",
      },
      objectIds: raw.metadata.objectIds as Record<BodyName, string>,
      references: raw.metadata.references ?? {},
    },
    bodies,
    events: raw.events
      .filter((event) => typeof event.tSec === "number" && Number.isFinite(event.tSec))
      .sort((a, b) => a.tSec - b.tSec),
  };
}
