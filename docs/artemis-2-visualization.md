# Artemis II Visualization Feature Spec

## Overview
The Artemis II Visualization is a production-grade, interactive 3D mission viewer at `/artemis-2-visualization` inside the existing `apps/web` Next.js App Router app. It renders a data-driven free-return translunar trajectory for Orion and contextual celestial motion (Earth, Moon, Sun) from JPL Horizons state vectors.

The experience combines:
- physically based simulation playback in an inertial frame (ECI/ICRF-compatible)
- a performant Three.js scene for spatial understanding
- mission-ops style HUD for telemetry, timeline, and mission events

## Implementation Plan

### Phase 1: Baseline Route + Client Rendering Boundary
- Create `src/app/artemis-2-visualization/page.tsx`
- Add SSR-safe scene boot via `next/dynamic` with `ssr: false`
- Add feature-scoped styling hooks in global CSS

### Phase 2: Feature Module Skeleton
- Add `src/features/artemis/{components,simulation,data,state}`
- Add typed contracts for vectors, samples, events, and render settings

### Phase 3: Data Ingestion + Parsing
- Store a JPL Horizons export snapshot in `data/artemisSampleData.json`
- Implement `data/horizonsParser.ts` for schema normalization + validation
- Expose mission window metadata and event markers

### Phase 4: Time + Interpolation Core
- Implement frame-rate independent `simulation/timeController.ts`
- Implement cubic Hermite interpolation in `simulation/interpolation.ts`
- Drive position/velocity queries at arbitrary simulation time

### Phase 5: 3D Scene + Trajectory Rendering
- Build `components/Scene.tsx` using Three.js primitives
- Render Earth, Moon, Sun lighting, Orion marker
- Render trajectory with past/future segmentation using BufferGeometry
- Add orbit controls and click-to-focus interactions

### Phase 6: HUD + Playback Controls
- Build `components/HUD.tsx` and `components/Controls.tsx`
- Implement MET, distance/velocity telemetry, mission phase, event list
- Implement play/pause, speed selector, scrub timeline, display toggles

### Phase 7: App Integration + /fun Entry
- Add `/fun` data entry and card link to `/artemis-2-visualization`
- Ensure route discoverability and consistent design system fit

### Phase 8: Validation + Performance Polish
- Validate trajectory continuity and event ordering
- Minimize re-renders and transient allocations
- Confirm responsive behavior and stable 60fps target

## Goals
- Deliver a robust and interactive mission viewer integrated into existing app architecture.
- Keep simulation data-driven (no synthetic orbit spline fakes).
- Ensure deterministic timeline playback independent from render frame rate.
- Provide clear mission context via telemetry and mission event HUD.

## Non-Goals
- Full mission operations tool parity (no high-fidelity maneuver propagation or covariance visualization).
- Full n-body propagator implementation in browser.
- Exact photorealistic planetary rendering.
- Full mission archive or downloadable telemetry exports.

## Architecture

### Rendering Layer
- **Tech**: Three.js in client-only React component.
- **Responsibilities**:
  - Scene/camera/renderer lifecycle
  - body meshes and materials
  - mission trajectory buffers (past/future segments)
  - interaction controls (orbit, zoom, pan, pick/focus)

### Simulation Layer
- **Responsibilities**:
  - mission time progression
  - interpolation of state vectors (position + velocity)
  - derived telemetry (distances, speed, mission phase)
- **Core modules**:
  - `timeController.ts`: simulation clock + speed modes + clamping
  - `interpolation.ts`: Hermite interpolation over sampled ephemeris

### Data Layer
- **Source**: JPL Horizons exported vectors normalized into JSON.
- **Responsibilities**:
  - parse and validate source payload
  - provide sorted sample arrays per body
  - expose mission event timeline metadata
- **Core module**: `horizonsParser.ts`

### State Management
- **Tech**: Zustand feature store.
- **State domains**:
  - playback (`isPlaying`, `speed`, `missionTimeSec`)
  - view toggles (`showTrajectory`, `showLabels`, `showOrbitGuides`)
  - focus target and optional follow mode
- Keep React state thin; simulation + render update loops read from store snapshots.

## Data Format (Ephemeris / State Vectors)

Canonical sample shape (all SI units):

```ts
export type EphemerisSample = {
  tSec: number;              // seconds from mission epoch
  positionKm: [number, number, number];
  velocityKmS: [number, number, number];
};
```

Mission dataset shape:

```ts
export type ArtemisDataset = {
  metadata: {
    source: "JPL Horizons";
    frame: "ICRF" | "EME2000" | "ECI";
    missionEpochUtc: string;
    missionName: "Artemis II";
    generatedAtUtc: string;
  };
  bodies: {
    earth: EphemerisSample[];
    moon: EphemerisSample[];
    sun: EphemerisSample[];
    orion: EphemerisSample[];
  };
  events: Array<{
    id: string;
    label: string;
    tSec: number;
    description?: string;
  }>;
};
```

Notes:
- Input parsing enforces ascending time and finite vectors.
- State vectors are transformed to display units during rendering only.

## Time System Design
- `missionEpochUtc` defines MET `t=0`.
- Simulation step uses real delta-time from `requestAnimationFrame`, multiplied by speed factor.
- Clock clamps to mission data min/max and auto-pauses at mission end.
- Scrubber writes absolute `missionTimeSec`; simulation loop reads latest value each frame.

Playback controls:
- Play/Pause
- Speed presets: 1x, 5x, 20x
- Timeline scrub with event tick marks

## UI/UX Structure

### Layout
- Full-viewport scene container
- Overlay HUD layers with pointer-event partitioning

### Left Panel
- MET
- Distance to Earth
- Distance to Moon
- Velocity magnitude
- Current mission phase

### Right Panel
- Mission event list:
  - Trans-lunar injection
  - Lunar SOI entry
  - Closest approach
  - Return trajectory
- Active event highlight by current mission time

### Bottom Controls
- Play/Pause button
- Speed selector (1x/5x/20x)
- Timeline scrubber
- Toggles: trajectory, labels, orbit guides

### Top-right
- Optional mini-map projection for trajectory overview

### Visual Language
- Dark operations console aesthetic
- Subtle borders and cyan/blue accent highlights
- Preserve existing app shell conventions where applicable

## Performance Considerations
- Keep Three.js objects persistent; mutate buffers instead of recreating geometry.
- Use `BufferGeometry` and preallocated `Float32Array` for trajectory lines.
- Decouple render loop from React re-render cycle.
- Memoize expensive derived data and interpolation index hints.
- Restrict DOM updates in HUD to telemetry cadence (e.g. each animation tick but with lightweight calculations).

## Risks and Tradeoffs
- **Data availability risk**: planned Artemis II vectors may be sparse or updated; mitigate with documented snapshot versioning in dataset metadata.
- **Scale tradeoff**: physically accurate distances are too large for readability; use consistent display scaling while preserving relative dynamics.
- **Precision tradeoff**: browser float precision at astronomical scales can cause jitter; center scene near Earth-Moon system and use scaled coordinates.
- **Complexity risk**: full photoreal materials can hurt frame budget; keep materials lightweight and stylized.

## Testing Plan
- Validate interpolation continuity for position and velocity.
- Spot-check telemetry calculations (distance and speed) against sample points.
- Verify playback determinism across frame rates.
- Verify `/fun` card navigation to visualization route.
- Verify responsive HUD behavior at mobile and desktop widths.

## Changelog

### 2026-04-24
- Added initial Artemis II visualization specification and phased implementation plan.
- Defined architecture boundaries for rendering, simulation, data, and state.
- Documented data contract, time system, UI layout, and testing strategy.
- Reason: establish implementation blueprint before coding.

### 2026-04-24
- Added modular Artemis feature implementation under `apps/web/src/features/artemis`:
  - `components/Scene.tsx`, `components/HUD.tsx`, `components/Controls.tsx`
  - `simulation/timeController.ts`, `simulation/interpolation.ts`
  - `data/horizonsParser.ts`, `data/artemisSampleData.json`
  - `state/store.ts`
- Added client-safe route integration:
  - `src/app/artemis-2-visualization/page.tsx`
  - `src/app/artemis-2-visualization/ArtemisVisualizationClient.tsx` with `dynamic(..., { ssr: false })`
- Implemented mission playback, interpolation, telemetry HUD, event timeline, mini-map, toggles, camera interaction, and click-to-focus.
- Added `/fun` card integration via `src/data/fun-items.ts` and updated `src/app/fun/page.tsx` to support linked cards.
- Added Artemis-specific styling in `src/app/globals.css` and route discovery in `src/app/sitemap.ts`.
- Added dependencies: `three`, `zustand`, `@types/three`.
- Reason: complete production-grade Artemis II visualization feature integrated into existing app.

### 2026-04-24
- Updated Artemis viewport sizing to fill available layout space on desktop and mobile.
- Added mobile-first simplification: hide side telemetry/mini-map/labels, keep only bottom timeline controls.
- Corrected visual proportion cues for Earth/Moon markers by using matched marker scale multipliers.
- Fixed perceived non-moving playback by increasing simulation speed defaults and presets (`1x`, `20x`, `200x`) and forcing autoplay initialization with `200x`.
- Reason: align UX with requested presentation style and ensure motion is visually observable during autoplay.

### 2026-04-24
- Refined Artemis visualization to mission-console composition with centered constrained viewport, upgraded panel system, and stronger visual hierarchy.
- Reworked HUD into left/right column stacks with primary MET telemetry, current/next event panel, trend sparklines, mini-map panel, JPL state-vector panel, and timeline cards.
- Rebuilt bottom controls as dedicated dock: play/pause, reset, speed group, mode selector, custom timeline styling, and custom system-style toggle switches.
- Improved scene quality and composition: intentional camera framing, anchored Earth foreground composition, subtle depth grid, starfield, atmosphere/emissive treatment, and trajectory glow layering.
- Preserved mobile simplification behavior by hiding side panels and retaining timeline-centric controls.
- Reason: align UI/UX and rendering quality with NASA-grade mission-control style target.

### 2026-04-24
- Added camera usability refinement pass: heavier OrbitControls tuning, polar-angle clamping, focus helpers (Earth/Moon/Follow Orion), and smooth camera-reset/focus transitions.
- Fixed moon readability issue with visual-size exaggeration, stronger material lighting, and additive halo support for reliable visibility.
- Implemented robust non-overlapping panel layout grid with reserved dock space and responsive breakpoints.
- Added collapsible panel system with header chevrons, animated collapse/expand, and localStorage persistence.
- Improved control dock structure and styling while preserving existing simulation/time behavior.
- Reason: resolve interaction instability, panel overlap, and visual clarity issues in production-polish pass.
