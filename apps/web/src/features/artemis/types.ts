export type Vec3Km = [number, number, number];

export type EphemerisSample = {
  tSec: number;
  positionKm: Vec3Km;
  velocityKmS: Vec3Km;
};

export type BodyName = "earth" | "moon" | "sun" | "orion";

export type MissionEvent = {
  id: string;
  label: string;
  description?: string;
  tSec: number;
};

export type ArtemisDataset = {
  metadata: {
    source: "JPL Horizons";
    missionName: "Artemis II";
    missionEpochUtc: string;
    generatedAtUtc: string;
    frame: "ICRF" | "ECI" | "EME2000";
    center: string;
    sampleStep: string;
    sampleWindow: {
      startUtc: string;
      stopUtc: string;
    };
    objectIds: Record<BodyName, string>;
    references?: Record<string, string>;
  };
  bodies: Record<BodyName, EphemerisSample[]>;
  events: MissionEvent[];
};

export type InterpolatedState = {
  tSec: number;
  positionKm: Vec3Km;
  velocityKmS: Vec3Km;
  segmentIndex: number;
};

export type PlaybackSpeed = 1 | 5 | 20;

export type FocusTarget = BodyName | null;

export type TelemetryState = {
  metSec: number;
  distanceToEarthKm: number;
  distanceToMoonKm: number;
  velocityKmS: number;
  missionPhase: string;
};
