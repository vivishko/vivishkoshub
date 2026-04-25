import type { PlaybackSpeed } from "../types";

const MISSION_SECONDS_PER_REAL_SECOND_AT_1X = 3600;

export type TimeControllerInput = {
  currentTimeSec: number;
  deltaRealSec: number;
  minTimeSec: number;
  maxTimeSec: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
};

export type TimeControllerOutput = {
  nextTimeSec: number;
  reachedEnd: boolean;
};

export function advanceMissionTime({
  currentTimeSec,
  deltaRealSec,
  minTimeSec,
  maxTimeSec,
  isPlaying,
  speed,
}: TimeControllerInput): TimeControllerOutput {
  if (!isPlaying || deltaRealSec <= 0) {
    return { nextTimeSec: currentTimeSec, reachedEnd: false };
  }

  const unclamped =
    currentTimeSec + deltaRealSec * speed * MISSION_SECONDS_PER_REAL_SECOND_AT_1X;
  const nextTimeSec = Math.max(minTimeSec, Math.min(maxTimeSec, unclamped));

  return {
    nextTimeSec,
    reachedEnd: nextTimeSec >= maxTimeSec,
  };
}
