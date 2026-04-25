import { create } from "zustand";
import type { FocusTarget, PlaybackSpeed, TelemetryState } from "../types";

type ArtemisState = {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  missionTimeSec: number;
  minTimeSec: number;
  maxTimeSec: number;
  showOutboundArc: boolean;
  showInboundArc: boolean;
  showTrajectory: boolean;
  showLabels: boolean;
  showOrbitGuides: boolean;
  followSpacecraft: boolean;
  focusTarget: FocusTarget;
  cameraResetTick: number;
  telemetry: TelemetryState;
  setMissionBounds: (min: number, max: number) => void;
  setMissionTimeSec: (timeSec: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  setShowOutboundArc: (enabled: boolean) => void;
  setShowInboundArc: (enabled: boolean) => void;
  setShowTrajectory: (enabled: boolean) => void;
  setShowLabels: (enabled: boolean) => void;
  setShowOrbitGuides: (enabled: boolean) => void;
  setFollowSpacecraft: (enabled: boolean) => void;
  setFocusTarget: (target: FocusTarget) => void;
  requestCameraReset: () => void;
  setTelemetry: (telemetry: Partial<TelemetryState>) => void;
};

const initialTelemetry: TelemetryState = {
  metSec: 0,
  distanceToEarthKm: 0,
  distanceToMoonKm: 0,
  velocityKmS: 0,
  missionPhase: "Launch and parking orbit",
};

export const useArtemisStore = create<ArtemisState>((set) => ({
  isPlaying: true,
  speed: 1,
  missionTimeSec: 0,
  minTimeSec: 0,
  maxTimeSec: 0,
  showOutboundArc: true,
  showInboundArc: true,
  showTrajectory: true,
  showLabels: true,
  showOrbitGuides: true,
  followSpacecraft: false,
  focusTarget: null,
  cameraResetTick: 0,
  telemetry: initialTelemetry,
  setMissionBounds: (min, max) => set({ minTimeSec: min, maxTimeSec: max, missionTimeSec: min }),
  setMissionTimeSec: (missionTimeSec) => set({ missionTimeSec }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  setShowOutboundArc: (showOutboundArc) => set({ showOutboundArc }),
  setShowInboundArc: (showInboundArc) => set({ showInboundArc }),
  setShowTrajectory: (showTrajectory) => set({ showTrajectory }),
  setShowLabels: (showLabels) => set({ showLabels }),
  setShowOrbitGuides: (showOrbitGuides) => set({ showOrbitGuides }),
  setFollowSpacecraft: (followSpacecraft) => set({ followSpacecraft }),
  setFocusTarget: (focusTarget) => set({ focusTarget }),
  requestCameraReset: () =>
    set((state) => ({
      cameraResetTick: state.cameraResetTick + 1,
      focusTarget: null,
      followSpacecraft: false,
    })),
  setTelemetry: (telemetry) =>
    set((state) => ({
      telemetry: {
        ...state.telemetry,
        ...telemetry,
      },
    })),
}));
