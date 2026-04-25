"use client";

import { useArtemisStore } from "../state/store";
import type { PlaybackSpeed } from "../types";

const SPEEDS: PlaybackSpeed[] = [1, 5, 20];

type ControlsProps = {
  missionMinSec: number;
  missionMaxSec: number;
};

export default function Controls({ missionMinSec, missionMaxSec }: ControlsProps) {
  const isPlaying = useArtemisStore((state) => state.isPlaying);
  const speed = useArtemisStore((state) => state.speed);
  const missionTimeSec = useArtemisStore((state) => state.missionTimeSec);
  const showOutboundArc = useArtemisStore((state) => state.showOutboundArc);
  const showInboundArc = useArtemisStore((state) => state.showInboundArc);
  const showTrajectory = useArtemisStore((state) => state.showTrajectory);
  const showLabels = useArtemisStore((state) => state.showLabels);
  const showOrbitGuides = useArtemisStore((state) => state.showOrbitGuides);
  const followSpacecraft = useArtemisStore((state) => state.followSpacecraft);

  const setPlaying = useArtemisStore((state) => state.setPlaying);
  const setSpeed = useArtemisStore((state) => state.setSpeed);
  const setMissionTimeSec = useArtemisStore((state) => state.setMissionTimeSec);
  const setShowOutboundArc = useArtemisStore((state) => state.setShowOutboundArc);
  const setShowInboundArc = useArtemisStore((state) => state.setShowInboundArc);
  const setShowTrajectory = useArtemisStore((state) => state.setShowTrajectory);
  const setShowLabels = useArtemisStore((state) => state.setShowLabels);
  const setShowOrbitGuides = useArtemisStore((state) => state.setShowOrbitGuides);
  const setFollowSpacecraft = useArtemisStore((state) => state.setFollowSpacecraft);
  const setFocusTarget = useArtemisStore((state) => state.setFocusTarget);
  const requestCameraReset = useArtemisStore((state) => state.requestCameraReset);

  return (
    <section className="artemis-controls" aria-label="Playback controls">
      <div className="artemis-controls-strip">
        <div className="artemis-controls-row">
          <button className="button artemis-control-btn" onClick={() => setPlaying(!isPlaying)} type="button">
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="button artemis-control-btn"
            onClick={() => {
              setMissionTimeSec(missionMinSec);
              setPlaying(false);
            }}
            type="button"
          >
            Reset
          </button>
          <span className="artemis-strip-divider" aria-hidden />
          <div className="artemis-speed-group" role="group" aria-label="Simulation speed">
            {SPEEDS.map((value) => (
              <button
                className={`button artemis-control-btn ${speed === value ? "is-active" : ""}`}
                key={value}
                onClick={() => setSpeed(value)}
                type="button"
              >
                {value}x
              </button>
            ))}
          </div>
          <span className="artemis-strip-divider" aria-hidden />
          <div className="artemis-speed-group" role="group" aria-label="Camera focus helpers">
            <button
              className="button artemis-control-btn"
              onClick={() => {
                setFollowSpacecraft(false);
                setFocusTarget("earth");
              }}
              type="button"
            >
              Earth
            </button>
            <button
              className="button artemis-control-btn"
              onClick={() => {
                setFollowSpacecraft(false);
                setFocusTarget("moon");
              }}
              type="button"
            >
              Moon
            </button>
            <button
              className={`button artemis-control-btn ${followSpacecraft ? "is-active" : ""}`}
              onClick={() => {
                setFollowSpacecraft(true);
                setFocusTarget("orion");
              }}
              type="button"
            >
              Follow Orion
            </button>
            <button className="button artemis-control-btn" onClick={requestCameraReset} type="button">
              Reset Camera
            </button>
          </div>
        </div>
      </div>

      <div className="artemis-controls-row artemis-controls-timeline">
        <input
          aria-label="Timeline"
          id="artemis-timeline"
          max={missionMaxSec}
          min={missionMinSec}
          onChange={(event) => setMissionTimeSec(Number(event.target.value))}
          step={1}
          type="range"
          value={missionTimeSec}
        />
      </div>

      <div className="artemis-toggle-row">
        <label className="artemis-toggle">
          <input
            checked={showOutboundArc}
            onChange={(event) => setShowOutboundArc(event.target.checked)}
            type="checkbox"
          />
          <span className="artemis-toggle-switch" />
          Show outbound arc
        </label>
        <label className="artemis-toggle">
          <input
            checked={showInboundArc}
            onChange={(event) => setShowInboundArc(event.target.checked)}
            type="checkbox"
          />
          <span className="artemis-toggle-switch" />
          Show inbound arc
        </label>
        <label className="artemis-toggle">
          <input
            checked={showLabels}
            onChange={(event) => setShowLabels(event.target.checked)}
            type="checkbox"
          />
          <span className="artemis-toggle-switch" />
          Show labels
        </label>
        <label className="artemis-toggle">
          <input
            checked={showTrajectory}
            onChange={(event) => setShowTrajectory(event.target.checked)}
            type="checkbox"
          />
          <span className="artemis-toggle-switch" />
          Show trajectory trails
        </label>
        <label className="artemis-toggle">
          <input
            checked={showOrbitGuides}
            onChange={(event) => setShowOrbitGuides(event.target.checked)}
            type="checkbox"
          />
          <span className="artemis-toggle-switch" />
          Show orbit guides
        </label>
      </div>
    </section>
  );
}
