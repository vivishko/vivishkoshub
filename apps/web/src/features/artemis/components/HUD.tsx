"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { MissionEvent, TelemetryState } from "../types";

type MiniMapPoint = {
  x: number;
  y: number;
};

type HUDGraphSeries = {
  velocity: number[];
  distanceEarth: number[];
  distanceMoon: number[];
};

type HUDGuidance = {
  vectorFrame: string;
  interpolation: string;
  moonPericynthionKm: number;
  maxEarthDistanceKm: number;
  phaseLabel: string;
};

type HUDProps = {
  telemetry: TelemetryState;
  missionTimeSec: number;
  missionDurationSec: number;
  missionEpochUtc: string;
  events: MissionEvent[];
  miniMapPoints: MiniMapPoint[];
  currentMiniMapPoint: MiniMapPoint;
  currentMoonMiniMapPoint: MiniMapPoint;
  graphSeries: HUDGraphSeries;
  guidance: HUDGuidance;
};

type PanelId =
  | "telemetry"
  | "current-event"
  | "trends"
  | "overview"
  | "vectors"
  | "timeline";

const PANEL_STORAGE_KEY = "artemis.panelState.v1";
const PANEL_IDS: PanelId[] = ["telemetry", "current-event", "trends", "overview", "vectors", "timeline"];

function formatMet(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const days = Math.floor(safe / 86400);
  const hours = Math.floor((safe % 86400) / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((safe % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${days}/${hours}:${minutes}:${secs}`;
}

function formatKm(value: number): string {
  return `${Math.round(value).toLocaleString("en-US")} km`;
}

function formatMissionUtc(epochUtc: string, metSec: number): string {
  const epochMs = Date.parse(epochUtc);
  if (!Number.isFinite(epochMs)) {
    return "--";
  }

  const utcDate = new Date(epochMs + Math.max(0, Math.floor(metSec)) * 1000);
  const datePart = utcDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const timePart = utcDate.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });
  return `${datePart} ${timePart} UTC`;
}

function toPath(points: MiniMapPoint[]): string {
  if (!points.length) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

function toSparkPath(values: number[], width = 208, height = 54): string {
  if (!values.length) {
    return "";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1e-6, max - min);

  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * width;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function defaultCollapsedState(): Record<PanelId, boolean> {
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches) {
    return {
      telemetry: true,
      "current-event": true,
      trends: true,
      overview: true,
      vectors: true,
      timeline: true,
    };
  }

  return {
    telemetry: false,
    "current-event": false,
    trends: false,
    overview: false,
    vectors: false,
    timeline: false,
  };
}

function loadCollapsedState(): Record<PanelId, boolean> {
  const fallback = defaultCollapsedState();
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const saved = localStorage.getItem(PANEL_STORAGE_KEY);
    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved) as Partial<Record<PanelId, boolean>>;
    const next = { ...fallback };
    PANEL_IDS.forEach((id) => {
      if (typeof parsed[id] === "boolean") {
        next[id] = parsed[id] as boolean;
      }
    });
    return next;
  } catch {
    return fallback;
  }
}

type PanelProps = {
  id: PanelId;
  title: string;
  collapsed: boolean;
  onToggle: (id: PanelId) => void;
  children: ReactNode;
  className?: string;
};

function Panel({ id, title, collapsed, onToggle, children, className }: PanelProps) {
  return (
    <section className={`artemis-panel ${collapsed ? "is-collapsed" : ""}${className ? ` ${className}` : ""}`}>
      <button
        aria-expanded={!collapsed}
        aria-label={`${collapsed ? "Expand" : "Collapse"} ${title}`}
        className="artemis-panel-header"
        onClick={() => onToggle(id)}
        type="button"
      >
        <span className="artemis-panel-title">{title}</span>
      </button>
      <div className="artemis-panel-body">{children}</div>
    </section>
  );
}

export default function HUD({
  telemetry,
  missionTimeSec,
  missionDurationSec,
  missionEpochUtc,
  events,
  miniMapPoints,
  currentMiniMapPoint,
  currentMoonMiniMapPoint,
  graphSeries,
  guidance,
}: HUDProps) {
  const [collapsedPanels, setCollapsedPanels] = useState<Record<PanelId, boolean>>(loadCollapsedState);

  useEffect(() => {
    try {
      localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(collapsedPanels));
    } catch {
      // Ignore storage write errors (private mode/quota) and keep in-memory state.
    }
  }, [collapsedPanels]);

  const togglePanel = (id: PanelId) => {
    setCollapsedPanels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentEventIndex = events.findLastIndex((event) => missionTimeSec >= event.tSec);
  const currentEvent = currentEventIndex >= 0 ? events[currentEventIndex] : null;
  const progressPct = useMemo(
    () => Math.round((missionTimeSec / Math.max(1, missionDurationSec)) * 100),
    [missionDurationSec, missionTimeSec],
  );
  const graphProgressX = (Math.max(0, Math.min(1, missionTimeSec / Math.max(1, missionDurationSec))) * 208).toFixed(1);

  const miniBounds = useMemo(() => {
    const allPoints = [...miniMapPoints, currentMiniMapPoint, currentMoonMiniMapPoint, { x: 90, y: 90 }];
    const minX = Math.min(...allPoints.map((point) => point.x)) - 12;
    const maxX = Math.max(...allPoints.map((point) => point.x)) + 12;
    const minY = Math.min(...allPoints.map((point) => point.y)) - 10;
    const maxY = Math.max(...allPoints.map((point) => point.y)) + 10;
    return {
      minX,
      minY,
      width: Math.max(80, maxX - minX),
      height: Math.max(60, maxY - minY),
    };
  }, [currentMiniMapPoint, currentMoonMiniMapPoint, miniMapPoints]);

  return (
    <div className="artemis-hud-frame">
      <aside className="artemis-hud-column artemis-hud-column-left">
        <Panel
          className="artemis-panel-metrics is-prominent"
          collapsed={collapsedPanels.telemetry}
          id="telemetry"
          onToggle={togglePanel}
          title="Telemetry"
        >
          <div className="artemis-telemetry-block">
            <div className="artemis-telemetry-row is-met">
              <span className="artemis-telemetry-label">MET</span>
              <span className="artemis-met-value">{formatMet(telemetry.metSec)}</span>
            </div>
            <div className="artemis-telemetry-row is-utc">
              <span className="artemis-telemetry-label">UTC</span>
              <span className="artemis-telemetry-value">{formatMissionUtc(missionEpochUtc, telemetry.metSec)}</span>
            </div>
            <div className="artemis-telemetry-divider" />
            <div className="artemis-telemetry-row">
              <span className="artemis-telemetry-label">Earth Distance</span>
              <span className="artemis-telemetry-value is-accent">{formatKm(telemetry.distanceToEarthKm)}</span>
            </div>
            <div className="artemis-telemetry-row">
              <span className="artemis-telemetry-label">Moon Distance</span>
              <span className="artemis-telemetry-value">{formatKm(telemetry.distanceToMoonKm)}</span>
            </div>
            <div className="artemis-telemetry-row">
              <span className="artemis-telemetry-label">Velocity</span>
              <span className="artemis-telemetry-value">{telemetry.velocityKmS.toFixed(2)} km/s</span>
            </div>
            <div className="artemis-telemetry-row">
              <span className="artemis-telemetry-label">Phase</span>
              <span className="artemis-telemetry-value is-accent">{telemetry.missionPhase}</span>
            </div>
          </div>
        </Panel>

        <Panel
          collapsed={collapsedPanels["current-event"]}
          id="current-event"
          onToggle={togglePanel}
          title="Current Event"
        >
          <p className="artemis-event-title">{currentEvent?.label ?? "Pre-mission"}</p>
          <p className="artemis-event-meta">{currentEvent?.description ?? "Waiting for first event marker"}</p>
        </Panel>

        <Panel collapsed={collapsedPanels.trends} id="trends" onToggle={togglePanel} title="Flight Trends">
          <div className="artemis-spark-grid">
            <div>
              <span>Velocity</span>
              <svg viewBox="0 0 208 54" role="img">
                <path d={toSparkPath(graphSeries.velocity)} />
                <line className="artemis-trend-indicator" x1={graphProgressX} x2={graphProgressX} y1="0" y2="54" />
              </svg>
            </div>
            <div>
              <span>Earth Range</span>
              <svg viewBox="0 0 208 54" role="img">
                <path d={toSparkPath(graphSeries.distanceEarth)} />
                <line className="artemis-trend-indicator" x1={graphProgressX} x2={graphProgressX} y1="0" y2="54" />
              </svg>
            </div>
            <div>
              <span>Moon Range</span>
              <svg viewBox="0 0 208 54" role="img">
                <path d={toSparkPath(graphSeries.distanceMoon)} />
                <line className="artemis-trend-indicator" x1={graphProgressX} x2={graphProgressX} y1="0" y2="54" />
              </svg>
            </div>
          </div>
        </Panel>
      </aside>

      <aside className="artemis-hud-column artemis-hud-column-right">
        <Panel
          className="artemis-mini-map"
          collapsed={collapsedPanels.overview}
          id="overview"
          onToggle={togglePanel}
          title="Free Return Overview"
        >
          <svg viewBox={`${miniBounds.minX} ${miniBounds.minY} ${miniBounds.width} ${miniBounds.height}`} role="img">
            <title>Artemis II trajectory overview</title>
            <circle className="axis-earth" cx="90" cy="90" r="5" />
            <path className="track" d={toPath(miniMapPoints)} />
            <circle className="axis-moon" cx={currentMoonMiniMapPoint.x} cy={currentMoonMiniMapPoint.y} r="3" />
            <circle className="current" cx={currentMiniMapPoint.x} cy={currentMiniMapPoint.y} r="3" />
            <text className="axis-label" x="95" y="84">
              Earth
            </text>
            <text className="axis-label" x={currentMoonMiniMapPoint.x + 4} y={currentMoonMiniMapPoint.y - 5}>
              Moon
            </text>
            <text className="axis-label is-current" x={currentMiniMapPoint.x + 4} y={currentMiniMapPoint.y - 5}>
              Orion
            </text>
          </svg>
          <p>{progressPct}% mission elapsed</p>
        </Panel>

        <Panel
          className="artemis-guidance-panel"
          collapsed={collapsedPanels.vectors}
          id="vectors"
          onToggle={togglePanel}
          title="Guidance"
        >
          <dl className="artemis-guidance-list">
            <div>
              <dt>Vector Frame</dt>
              <dd>{guidance.vectorFrame}</dd>
            </div>
            <div>
              <dt>Interpolation</dt>
              <dd>{guidance.interpolation}</dd>
            </div>
            <div>
              <dt>Moon Pericynthion (PC)</dt>
              <dd>{formatKm(guidance.moonPericynthionKm)}</dd>
            </div>
            <div>
              <dt>Max Earth Distance</dt>
              <dd>{formatKm(guidance.maxEarthDistanceKm)}</dd>
            </div>
            <div>
              <dt>Phase</dt>
              <dd className="is-accent">{guidance.phaseLabel}</dd>
            </div>
          </dl>
        </Panel>

        <Panel
          className="artemis-events-panel"
          collapsed={collapsedPanels.timeline}
          id="timeline"
          onToggle={togglePanel}
          title="Mission Timeline"
        >
          <ol>
            {events.map((event, index) => (
              <li className={index === currentEventIndex ? "is-active" : ""} key={event.id}>
                <span>{event.label}</span>
                <time>{formatMet(event.tSec)}</time>
              </li>
            ))}
          </ol>
        </Panel>
      </aside>
    </div>
  );
}
