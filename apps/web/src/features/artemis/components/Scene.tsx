"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadArtemisDataset } from "../data/horizonsParser";
import { hermiteInterpolate, vecDistanceKm, vecMagnitudeKmS, vecSubtract } from "../simulation/interpolation";
import { advanceMissionTime } from "../simulation/timeController";
import { useArtemisStore } from "../state/store";
import type { BodyName, MissionEvent } from "../types";
import Controls from "./Controls";
import HUD from "./HUD";

const DISTANCE_SCALE = 1 / 16000;
const MINI_MAP_RADIUS = 68;
const BODY_VISUAL_SCALE = 1.42;
const FIT_PADDING = 0.44;
const FIT_DISTANCE_MULTIPLIER = 0.9;
const DEFAULT_CAMERA_ZOOM = 1.18;
const INITIAL_DISTANCE_MIN = 9;
const INITIAL_DISTANCE_MAX = 22;
const EARTH_MAX_SCREEN_HEIGHT_FRAC = 0.28;
const INITIAL_TRAJECTORY_FRACTION = 0.16;

const BODY_RADII_KM: Record<BodyName, number> = {
  earth: 6371,
  moon: 1737,
  sun: 695700,
  orion: 40,
};

type HUDDetailState = {
  currentMoonMiniMapPoint: { x: number; y: number };
};

type SceneOrientation = {
  cos: number;
  sin: number;
  flipX: 1 | -1;
  flipY: 1 | -1;
};

const SAFE_AREA = {
  leftFrac: 0.24,
  rightFrac: 0.24,
  topFrac: 0.08,
  bottomFrac: 0.24,
};

function rotate2D(x: number, y: number, cos: number, sin: number): [number, number] {
  return [x * cos - y * sin, x * sin + y * cos];
}

function projectInPlane(
  relKm: [number, number, number],
  orientation: SceneOrientation,
): [number, number] {
  const [rx, ry] = rotate2D(relKm[0], relKm[1], orientation.cos, orientation.sin);
  return [rx * orientation.flipX, ry * orientation.flipY];
}

function subtractKm(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function missionPhaseAt(timeSec: number): string {
  if (timeSec < 78960) return "Earth departure";
  if (timeSec < 272324) return "Trans-lunar cruise";
  if (timeSec < 334860) return "Lunar flyby";
  if (timeSec < 424980) return "Earth return trajectory";
  return "Re-entry and recovery";
}

function buildStars(count: number, spread: number): THREE.BufferGeometry {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    points[i * 3] = (Math.random() - 0.5) * spread;
    points[i * 3 + 1] = (Math.random() - 0.5) * spread;
    points[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
  return geometry;
}

export default function Scene() {
  const dataset = useMemo(() => loadArtemisDataset(), []);
  const missionMinSec = dataset.bodies.orion[0].tSec;
  const missionMaxSec = dataset.bodies.orion[dataset.bodies.orion.length - 1].tSec;
  const missionDurationSec = missionMaxSec - missionMinSec;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const previousFocusTargetRef = useRef<BodyName | null>(null);
  const previousCameraResetRef = useRef(0);
  const initialBodyOverflowRef = useRef<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [labelPositions, setLabelPositions] = useState<Record<BodyName, { left: number; top: number }>>({
    earth: { left: 0, top: 0 },
    moon: { left: 0, top: 0 },
    sun: { left: 0, top: 0 },
    orion: { left: 0, top: 0 },
  });

  const [hudDetails, setHudDetails] = useState<HUDDetailState>({
    currentMoonMiniMapPoint: { x: 90, y: 90 },
  });

  const telemetry = useArtemisStore((state) => state.telemetry);
  const missionTimeSec = useArtemisStore((state) => state.missionTimeSec);
  const showLabels = useArtemisStore((state) => state.showLabels);

  const metricsSeries = useMemo(() => {
    const velocity: number[] = [];
    const distanceEarth: number[] = [];
    const distanceMoon: number[] = [];

    for (let i = 0; i < dataset.bodies.orion.length; i += 1) {
      const orion = dataset.bodies.orion[i];
      const earth = dataset.bodies.earth[i];
      const moon = dataset.bodies.moon[i];
      const relativeVelocity = vecSubtract(orion.velocityKmS, earth.velocityKmS);

      velocity.push(vecMagnitudeKmS(relativeVelocity));
      distanceEarth.push(vecDistanceKm(orion.positionKm, earth.positionKm));
      distanceMoon.push(vecDistanceKm(orion.positionKm, moon.positionKm));
    }

    return { velocity, distanceEarth, distanceMoon };
  }, [dataset.bodies.earth, dataset.bodies.moon, dataset.bodies.orion]);

  const sceneOrientation = useMemo<SceneOrientation>(() => {
    const orionRelative = dataset.bodies.orion.map((sample, index) => {
      const earthSample = dataset.bodies.earth[index] ?? dataset.bodies.earth[dataset.bodies.earth.length - 1];
      return subtractKm(sample.positionKm, earthSample.positionKm);
    });
    const moonRelative = dataset.bodies.moon.map((sample, index) => {
      const earthSample = dataset.bodies.earth[index] ?? dataset.bodies.earth[dataset.bodies.earth.length - 1];
      return subtractKm(sample.positionKm, earthSample.positionKm);
    });

    let farthestIndex = 0;
    for (let i = 1; i < orionRelative.length; i += 1) {
      const currentNorm = Math.hypot(orionRelative[i][0], orionRelative[i][1]);
      const bestNorm = Math.hypot(orionRelative[farthestIndex][0], orionRelative[farthestIndex][1]);
      if (currentNorm > bestNorm) {
        farthestIndex = i;
      }
    }

    const farthest = orionRelative[farthestIndex];
    const baseAngle = Math.atan2(farthest[1], farthest[0]);
    const rotation = -baseAngle;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    let closestApproachIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < orionRelative.length; i += 1) {
      const dx = orionRelative[i][0] - moonRelative[i][0];
      const dy = orionRelative[i][1] - moonRelative[i][1];
      const dz = orionRelative[i][2] - moonRelative[i][2];
      const distance = Math.hypot(dx, dy, dz);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestApproachIndex = i;
      }
    }

    let flipX: 1 | -1 = 1;
    let flipY: 1 | -1 = 1;

    const [moonAtFlybyX] = rotate2D(
      moonRelative[closestApproachIndex][0],
      moonRelative[closestApproachIndex][1],
      cos,
      sin,
    );
    if (moonAtFlybyX < 0) {
      flipX = -1;
    }

    const prevIndex = Math.max(0, closestApproachIndex - 1);
    const nextIndex = Math.min(moonRelative.length - 1, closestApproachIndex + 1);
    const [moonPrevX, moonPrevY] = rotate2D(moonRelative[prevIndex][0], moonRelative[prevIndex][1], cos, sin);
    const [moonNextX, moonNextY] = rotate2D(moonRelative[nextIndex][0], moonRelative[nextIndex][1], cos, sin);
    const moonVelY = (moonNextY - moonPrevY) * flipY;
    if (moonVelY > 0) {
      flipY = -1;
    }

    return { cos, sin, flipX, flipY };
  }, [dataset.bodies.earth, dataset.bodies.moon, dataset.bodies.orion]);

  const guidance = useMemo(() => {
    const minMoonDistanceKm = Math.min(...metricsSeries.distanceMoon);
    const maxEarthDistanceKm = Math.max(...metricsSeries.distanceEarth);
    return {
      vectorFrame: "ICRF",
      interpolation: "Hermite",
      moonPericynthionKm: minMoonDistanceKm,
      maxEarthDistanceKm,
      phaseLabel: "Outbound",
    };
  }, [metricsSeries.distanceEarth, metricsSeries.distanceMoon]);

  const missionEvents = useMemo<MissionEvent[]>(() => {
    const separationTime = missionMinSec + 12 * 60;
    const tliTime = dataset.events.find((event) => /trans-lunar injection/i.test(event.label))?.tSec ?? missionMinSec + 2.8 * 3600;
    const outboundCorrectionTime = missionMinSec + 16 * 3600;

    const moonSoiIndex = metricsSeries.distanceMoon.findIndex((value) => value < 70000);
    const lunarSoiTime =
      moonSoiIndex >= 0 ? dataset.bodies.orion[moonSoiIndex].tSec : missionMinSec + 70 * 3600;

    let closestApproachIndex = 0;
    for (let i = 1; i < metricsSeries.distanceMoon.length; i += 1) {
      if (metricsSeries.distanceMoon[i] < metricsSeries.distanceMoon[closestApproachIndex]) {
        closestApproachIndex = i;
      }
    }
    const closestApproachTime = dataset.bodies.orion[closestApproachIndex].tSec;

    let maxEarthDistanceIndex = 0;
    for (let i = 1; i < metricsSeries.distanceEarth.length; i += 1) {
      if (metricsSeries.distanceEarth[i] > metricsSeries.distanceEarth[maxEarthDistanceIndex]) {
        maxEarthDistanceIndex = i;
      }
    }
    const maxEarthDistanceTime = dataset.bodies.orion[maxEarthDistanceIndex].tSec;
    const returnCorrection1Time = Math.min(missionMaxSec - 10 * 3600, maxEarthDistanceTime + 10 * 3600);
    const returnCorrection2Time = Math.min(missionMaxSec - 4 * 3600, maxEarthDistanceTime + 30 * 3600);
    const reentryTime = missionMaxSec - 20 * 60;

    const events: MissionEvent[] = [
      {
        id: "orion-icps-separation",
        label: "Orion/ICPS separation",
        description: "Spacecraft separation and post-separation checkout.",
        tSec: separationTime,
      },
      {
        id: "trans-lunar-injection",
        label: "Trans-lunar injection",
        description: "Main burn commits Orion to free-return lunar trajectory.",
        tSec: tliTime,
      },
      {
        id: "outbound-correction-burn",
        label: "Outbound correction burn",
        description: "Trajectory trim burn during outbound translunar coast.",
        tSec: outboundCorrectionTime,
      },
      {
        id: "lunar-soi-entry",
        label: "Lunar SOI entry",
        description: "Orion enters the Moon sphere of influence.",
        tSec: lunarSoiTime,
      },
      {
        id: "closest-lunar-approach",
        label: "Closest lunar approach",
        description: "Pericynthion passage at closest distance to the Moon.",
        tSec: closestApproachTime,
      },
      {
        id: "maximum-earth-distance",
        label: "Maximum Earth distance",
        description: "Farthest Earth range reached on free-return arc.",
        tSec: maxEarthDistanceTime,
      },
      {
        id: "return-correction-burn-1",
        label: "Return correction burn 1",
        description: "Inbound trajectory correction for Earth return corridor.",
        tSec: returnCorrection1Time,
      },
      {
        id: "return-correction-burn-2",
        label: "Return correction burn 2",
        description: "Final targeting trim prior to atmospheric interface.",
        tSec: returnCorrection2Time,
      },
      {
        id: "re-entry",
        label: "Re-entry",
        description: "Atmospheric entry and recovery sequence.",
        tSec: reentryTime,
      },
    ];

    return events.sort((a, b) => a.tSec - b.tSec);
  }, [dataset.bodies.orion, dataset.events, metricsSeries.distanceEarth, metricsSeries.distanceMoon, missionMaxSec, missionMinSec]);

  const miniMap = useMemo(() => {
    const orionRelative = dataset.bodies.orion.map((sample, index) => {
      const earthSample = dataset.bodies.earth[index] ?? dataset.bodies.earth[dataset.bodies.earth.length - 1];
      return subtractKm(sample.positionKm, earthSample.positionKm);
    });

    const moonRelative = dataset.bodies.moon.map((sample, index) => {
      const earthSample = dataset.bodies.earth[index] ?? dataset.bodies.earth[dataset.bodies.earth.length - 1];
      return subtractKm(sample.positionKm, earthSample.positionKm);
    });

    const maxAbs = Math.max(
      ...orionRelative.map((point) => Math.max(Math.abs(point[0]), Math.abs(point[2]))),
      ...moonRelative.map((point) => Math.max(Math.abs(point[0]), Math.abs(point[2]))),
      1,
    );

    const toPoint = (value: [number, number, number]) => ({
      x: 90 + (value[0] / maxAbs) * MINI_MAP_RADIUS,
      y: 90 - (value[2] / maxAbs) * MINI_MAP_RADIUS,
    });

    return {
      points: orionRelative.map(toPoint),
      toPoint,
    };
  }, [dataset.bodies.earth, dataset.bodies.moon, dataset.bodies.orion]);

  useEffect(() => {
    const store = useArtemisStore.getState();
    store.setMissionBounds(missionMinSec, missionMaxSec);
    store.setSpeed(1);
    store.setPlaying(true);
  }, [missionMaxSec, missionMinSec]);

  useEffect(() => {
    if (!canvasHostRef.current || !rootRef.current) {
      return;
    }

    const canvasHost = canvasHostRef.current;
    const root = rootRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvasHost.clientWidth, canvasHost.clientHeight);
    renderer.domElement.style.touchAction = "none";
    canvasHost.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#02050d");
    scene.fog = new THREE.FogExp2("#031024", 0.035);

    const camera = new THREE.PerspectiveCamera(54, canvasHost.clientWidth / canvasHost.clientHeight, 0.01, 3000);
    camera.zoom = DEFAULT_CAMERA_ZOOM;
    camera.updateProjectionMatrix();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.rotateSpeed = 0.42;
    controls.panSpeed = 0.55;
    controls.zoomSpeed = 0.72;
    controls.enablePan = true;
    controls.minPolarAngle = 0.36;
    controls.maxPolarAngle = Math.PI - 0.4;
    controls.minDistance = 2.2;
    controls.maxDistance = 38;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };

    const mapRelToScene = (relKm: [number, number, number]) => {
      const [px, py] = projectInPlane(relKm, sceneOrientation);
      return new THREE.Vector3(px * DISTANCE_SCALE, py * DISTANCE_SCALE, relKm[2] * DISTANCE_SCALE);
    };

    const earthAnchor = new THREE.Vector3(0, 0, 0);

    const moonTrackPoints = dataset.bodies.moon.map((sample, index) => {
      const earthSample = dataset.bodies.earth[index] ?? dataset.bodies.earth[dataset.bodies.earth.length - 1];
      return mapRelToScene(subtractKm(sample.positionKm, earthSample.positionKm));
    });

    const trajectoryPoints = dataset.bodies.orion.map((sample, index) => {
      const earthSample = dataset.bodies.earth[index] ?? dataset.bodies.earth[dataset.bodies.earth.length - 1];
      return mapRelToScene(subtractKm(sample.positionKm, earthSample.positionKm));
    });

    const initialTrajectoryCount = Math.max(4, Math.floor(trajectoryPoints.length * INITIAL_TRAJECTORY_FRACTION));
    const initialTrajectoryPoints = trajectoryPoints.slice(0, initialTrajectoryCount);
    const initialFramingPoints = [earthAnchor, trajectoryPoints[0], ...initialTrajectoryPoints];

    const bounds = initialFramingPoints.reduce(
      (acc, point) => ({
        minX: Math.min(acc.minX, point.x),
        maxX: Math.max(acc.maxX, point.x),
        minY: Math.min(acc.minY, point.y),
        maxY: Math.max(acc.maxY, point.y),
      }),
      {
        minX: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
      },
    );

    const safeLeftNdc = -1 + SAFE_AREA.leftFrac * 2;
    const safeRightNdc = 1 - SAFE_AREA.rightFrac * 2;
    const safeTopNdc = 1 - SAFE_AREA.topFrac * 2;
    const safeBottomNdc = -1 + SAFE_AREA.bottomFrac * 2;
    const safeWidthNdc = Math.max(0.3, safeRightNdc - safeLeftNdc);
    const safeHeightNdc = Math.max(0.3, safeTopNdc - safeBottomNdc);
    const boundsWidth = Math.max(1e-3, bounds.maxX - bounds.minX);
    const boundsHeight = Math.max(1e-3, bounds.maxY - bounds.minY);
    const padding = FIT_PADDING;
    const halfWNeeded = (boundsWidth + padding * 2) / safeWidthNdc;
    const halfHNeeded = (boundsHeight + padding * 2) / safeHeightNdc;
    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const halfFovTan = Math.tan(fovRad / 2) / camera.zoom;
    const distanceByHeight = halfHNeeded / Math.max(1e-6, halfFovTan);
    const distanceByWidth = halfWNeeded / Math.max(1e-6, halfFovTan * camera.aspect);
    let framingDistance = THREE.MathUtils.clamp(
      Math.max(distanceByHeight, distanceByWidth, 7) * FIT_DISTANCE_MULTIPLIER,
      INITIAL_DISTANCE_MIN,
      INITIAL_DISTANCE_MAX,
    );
    const ndcMargin = 0.03;
    const clampLeft = safeLeftNdc + ndcMargin;
    const clampRight = safeRightNdc - ndcMargin;
    const clampBottom = safeBottomNdc + ndcMargin;
    const clampTop = safeTopNdc - ndcMargin;

    const initialCentroid = initialFramingPoints.reduce(
      (acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
      },
      { x: 0, y: 0 },
    );
    initialCentroid.x /= initialFramingPoints.length;
    initialCentroid.y /= initialFramingPoints.length;

    const earthRadiusScene = BODY_RADII_KM.earth * DISTANCE_SCALE * BODY_VISUAL_SCALE;
    const minDistanceForEarthSize = earthRadiusScene / Math.max(1e-6, EARTH_MAX_SCREEN_HEIGHT_FRAC * 2 * halfFovTan);
    framingDistance = Math.max(framingDistance, minDistanceForEarthSize);

    const fitTargetForDistance = (desiredX: number, desiredY: number, distance: number) => {
      const localHalfVisibleH = halfFovTan * distance;
      const localHalfVisibleW = localHalfVisibleH * camera.aspect;
      const targetXMin = initialFramingPoints.reduce(
        (acc, point) => Math.max(acc, point.x - clampRight * localHalfVisibleW),
        Number.NEGATIVE_INFINITY,
      );
      const targetXMax = initialFramingPoints.reduce(
        (acc, point) => Math.min(acc, point.x - clampLeft * localHalfVisibleW),
        Number.POSITIVE_INFINITY,
      );
      const targetYMin = initialFramingPoints.reduce(
        (acc, point) => Math.max(acc, point.y - clampTop * localHalfVisibleH),
        Number.NEGATIVE_INFINITY,
      );
      const targetYMax = initialFramingPoints.reduce(
        (acc, point) => Math.min(acc, point.y - clampBottom * localHalfVisibleH),
        Number.POSITIVE_INFINITY,
      );
      return {
        x:
          targetXMin <= targetXMax
            ? THREE.MathUtils.clamp(desiredX, targetXMin, targetXMax)
            : desiredX,
        y:
          targetYMin <= targetYMax
            ? THREE.MathUtils.clamp(desiredY, targetYMin, targetYMax)
            : desiredY,
      };
    };

    let targetXY = fitTargetForDistance(initialCentroid.x, initialCentroid.y, framingDistance);
    const isPointVisibleInSafeArea = (point: THREE.Vector3, targetX: number, targetY: number, distance: number) => {
      const localHalfVisibleH = halfFovTan * distance;
      const localHalfVisibleW = localHalfVisibleH * camera.aspect;
      const ndcX = (point.x - targetX) / localHalfVisibleW;
      const ndcY = (point.y - targetY) / localHalfVisibleH;
      return ndcX >= clampLeft && ndcX <= clampRight && ndcY >= clampBottom && ndcY <= clampTop;
    };

    for (let i = 0; i < 8; i += 1) {
      const allVisible = initialFramingPoints.every((point) =>
        isPointVisibleInSafeArea(point, targetXY.x, targetXY.y, framingDistance),
      );
      if (allVisible) {
        break;
      }
      framingDistance = Math.min(INITIAL_DISTANCE_MAX, framingDistance * 1.08);
      targetXY = fitTargetForDistance(initialCentroid.x, initialCentroid.y, framingDistance);
    }

    const defaultTarget = new THREE.Vector3(targetXY.x, targetXY.y, 0);
    const defaultOffset = new THREE.Vector3(0, 0, framingDistance);
    controls.target.copy(defaultTarget);
    camera.position.copy(defaultTarget.clone().add(defaultOffset));

    const desiredTarget = defaultTarget.clone();
    const desiredOffset = defaultOffset.clone();
    let isCameraTransitioning = false;

    const setCameraPose = (target: THREE.Vector3, offset: THREE.Vector3) => {
      desiredTarget.copy(target);
      desiredOffset.copy(offset);
      isCameraTransitioning = true;
    };

    const ambient = new THREE.AmbientLight("#93b7ff", 0.28);
    scene.add(ambient);

    const sunLight = new THREE.PointLight("#c9e7ff", 2.4, 0, 1.3);
    scene.add(sunLight);

    const earthMaterial = new THREE.MeshStandardMaterial({
      color: "#2f83f2",
      roughness: 0.73,
      metalness: 0.08,
      emissive: "#0d1c34",
      emissiveIntensity: 0.42,
    });
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: "#aeb8c7",
      roughness: 0.82,
      metalness: 0.02,
      emissive: "#192634",
      emissiveIntensity: 0.32,
    });
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: "#f7d578",
      transparent: true,
      opacity: 0.98,
      fog: false,
    });
    const orionMaterial = new THREE.MeshBasicMaterial({ color: "#80f4ff" });

    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(BODY_RADII_KM.earth * DISTANCE_SCALE * BODY_VISUAL_SCALE, 56, 40),
      earthMaterial,
    );

    const earthAtmosphereMaterial = new THREE.MeshBasicMaterial({
      color: "#6ec8ff",
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const earthAtmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(BODY_RADII_KM.earth * DISTANCE_SCALE * BODY_VISUAL_SCALE * 1.12, 56, 40),
      earthAtmosphereMaterial,
    );

    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(BODY_RADII_KM.moon * DISTANCE_SCALE * BODY_VISUAL_SCALE, 40, 28),
      moonMaterial,
    );
    const moonHalo = new THREE.Mesh(
      new THREE.SphereGeometry(BODY_RADII_KM.moon * DISTANCE_SCALE * BODY_VISUAL_SCALE * 1.35, 32, 24),
      new THREE.MeshBasicMaterial({
        color: "#d8ebff",
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(BODY_RADII_KM.sun * DISTANCE_SCALE * 0.0053, 24, 16),
      sunMaterial,
    );
    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(BODY_RADII_KM.sun * DISTANCE_SCALE * 0.0092, 24, 16),
      new THREE.MeshBasicMaterial({
        color: "#ffe6a8",
        transparent: true,
        opacity: 0.46,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      }),
    );

    const orionMesh = new THREE.Mesh(
      new THREE.SphereGeometry(BODY_RADII_KM.orion * DISTANCE_SCALE * 30, 16, 12),
      orionMaterial,
    );

    const orionGlow = new THREE.Mesh(
      new THREE.SphereGeometry(BODY_RADII_KM.orion * DISTANCE_SCALE * 48, 16, 12),
      new THREE.MeshBasicMaterial({
        color: "#9ff8ff",
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    scene.add(earthMesh, earthAtmosphere, moonMesh, moonHalo, sunMesh, sunGlow, orionMesh, orionGlow);

    const grid = new THREE.GridHelper(68, 24, "#2f4f74", "#1f334a");
    grid.position.set(0, -4.8, 0);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.26;
    scene.add(grid);

    const starsGeometry = buildStars(1800, 420);
    const starsMaterial = new THREE.PointsMaterial({ color: "#9ab9e2", size: 0.28, transparent: true, opacity: 0.52 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const orbitGuideGroup = new THREE.Group();
    [80000, 160000, 320000].forEach((radiusKm) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radiusKm * DISTANCE_SCALE * 0.996, radiusKm * DISTANCE_SCALE, 220),
        new THREE.MeshBasicMaterial({
          color: "#245386",
          transparent: true,
          opacity: 0.24,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      ring.rotation.x = Math.PI / 2;
      orbitGuideGroup.add(ring);
    });

    const moonTrackGeometry = new THREE.BufferGeometry().setFromPoints(moonTrackPoints);
    const moonTrack = new THREE.LineLoop(
      moonTrackGeometry,
      new THREE.LineBasicMaterial({ color: "#4e7098", transparent: true, opacity: 0.46 }),
    );
    orbitGuideGroup.add(moonTrack);
    orbitGuideGroup.position.copy(earthAnchor);
    scene.add(orbitGuideGroup);

    let maxDistanceIndex = 0;
    for (let i = 1; i < metricsSeries.distanceEarth.length; i += 1) {
      if (metricsSeries.distanceEarth[i] > metricsSeries.distanceEarth[maxDistanceIndex]) {
        maxDistanceIndex = i;
      }
    }

    const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
    const outboundArcGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints.slice(0, maxDistanceIndex + 1));
    const inboundArcGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints.slice(maxDistanceIndex));

    const outboundArcLine = new THREE.Line(
      outboundArcGeometry,
      new THREE.LineBasicMaterial({ color: "#3a638c", transparent: true, opacity: 0.72 }),
    );
    const inboundArcLine = new THREE.Line(
      inboundArcGeometry,
      new THREE.LineBasicMaterial({ color: "#4f7aa6", transparent: true, opacity: 0.7 }),
    );

    const trailPastLine = new THREE.Line(
      trajectoryGeometry,
      new THREE.LineBasicMaterial({ color: "#27486b", transparent: true, opacity: 0.82 }),
    );
    const trailFutureLine = new THREE.Line(
      trajectoryGeometry,
      new THREE.LineBasicMaterial({ color: "#66d9ff", transparent: true, opacity: 0.9 }),
    );
    const trailFutureGlow = new THREE.Line(
      trajectoryGeometry,
      new THREE.LineBasicMaterial({
        color: "#98ecff",
        transparent: true,
        opacity: 0.36,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    scene.add(outboundArcLine, inboundArcLine, trailPastLine, trailFutureLine, trailFutureGlow);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const bodyMeshes: Array<{ mesh: THREE.Object3D; name: BodyName }> = [
      { mesh: earthMesh, name: "earth" },
      { mesh: moonMesh, name: "moon" },
      { mesh: sunMesh, name: "sun" },
      { mesh: orionMesh, name: "orion" },
    ];

    const onPointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(
        bodyMeshes.map((entry) => entry.mesh),
        false,
      );
      if (!hits.length) {
        return;
      }

      const hit = bodyMeshes.find((entry) => entry.mesh === hits[0].object);
      if (!hit) {
        return;
      }

      useArtemisStore.getState().setFocusTarget(hit.name);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    let hintEarth = 0;
    let hintMoon = 0;
    let hintSun = 0;
    let hintOrion = 0;
    let lastNowMs = performance.now();
    let rafId = 0;
    let lastHudUpdateMs = 0;

    const animate = (nowMs: number) => {
      const deltaRealSec = (nowMs - lastNowMs) / 1000;
      lastNowMs = nowMs;

      const snapshot = useArtemisStore.getState();
      const next = advanceMissionTime({
        currentTimeSec: snapshot.missionTimeSec,
        deltaRealSec,
        minTimeSec: missionMinSec,
        maxTimeSec: missionMaxSec,
        isPlaying: snapshot.isPlaying,
        speed: snapshot.speed,
      });

      if (next.nextTimeSec !== snapshot.missionTimeSec) {
        useArtemisStore.getState().setMissionTimeSec(next.nextTimeSec);
      }

      if (next.reachedEnd && snapshot.isPlaying) {
        useArtemisStore.getState().setPlaying(false);
      }

      const tSec = useArtemisStore.getState().missionTimeSec;

      const earthState = hermiteInterpolate(dataset.bodies.earth, tSec, hintEarth);
      const moonState = hermiteInterpolate(dataset.bodies.moon, tSec, hintMoon);
      const sunState = hermiteInterpolate(dataset.bodies.sun, tSec, hintSun);
      const orionState = hermiteInterpolate(dataset.bodies.orion, tSec, hintOrion);

      hintEarth = earthState.segmentIndex;
      hintMoon = moonState.segmentIndex;
      hintSun = sunState.segmentIndex;
      hintOrion = orionState.segmentIndex;

      const moonRelative = subtractKm(moonState.positionKm, earthState.positionKm);
      const sunRelative = subtractKm(sunState.positionKm, earthState.positionKm);
      const orionRelative = subtractKm(orionState.positionKm, earthState.positionKm);

      earthMesh.position.copy(earthAnchor);
      earthAtmosphere.position.copy(earthAnchor);
      moonMesh.position.copy(earthAnchor.clone().add(mapRelToScene(moonRelative)));
      moonHalo.position.copy(moonMesh.position);
      orionMesh.position.copy(earthAnchor.clone().add(mapRelToScene(orionRelative)));
      orionGlow.position.copy(orionMesh.position);

      moonMesh.scale.setScalar(1);
      moonHalo.scale.setScalar(1);

      const sunDirection = mapRelToScene(sunRelative).normalize().multiplyScalar(130).add(earthAnchor);
      sunMesh.position.copy(sunDirection);
      sunGlow.position.copy(sunDirection);
      sunLight.position.copy(sunDirection);

      const currentIndex = Math.max(1, Math.min(trajectoryPoints.length - 1, hintOrion + 1));
      trailPastLine.geometry.setDrawRange(0, currentIndex);
      trailFutureLine.geometry.setDrawRange(currentIndex - 1, trajectoryPoints.length - currentIndex + 1);
      trailFutureGlow.geometry.setDrawRange(currentIndex - 1, trajectoryPoints.length - currentIndex + 1);
      outboundArcLine.visible = snapshot.showOutboundArc;
      inboundArcLine.visible = snapshot.showInboundArc;
      trailPastLine.visible = snapshot.showTrajectory;
      trailFutureLine.visible = snapshot.showTrajectory;
      trailFutureGlow.visible = snapshot.showTrajectory;
      orbitGuideGroup.visible = snapshot.showOrbitGuides;

      const earthFocus = earthMesh.position.clone().add(new THREE.Vector3(0.5, 0.2, 0));
      const moonFocus = moonMesh.position.clone();
      const orionFocus = orionMesh.position.clone();

      if (snapshot.cameraResetTick !== previousCameraResetRef.current) {
        previousCameraResetRef.current = snapshot.cameraResetTick;
        setCameraPose(defaultTarget, defaultOffset);
      }

      if (snapshot.focusTarget !== previousFocusTargetRef.current) {
        previousFocusTargetRef.current = snapshot.focusTarget;

        if (snapshot.focusTarget === "earth") {
          setCameraPose(earthFocus, new THREE.Vector3(4.6, 2.1, 5.4));
        } else if (snapshot.focusTarget === "moon") {
          setCameraPose(moonFocus, new THREE.Vector3(3.2, 1.7, 3.8));
        } else if (snapshot.focusTarget === "orion") {
          setCameraPose(orionFocus, new THREE.Vector3(2.9, 1.45, 3.2));
        } else {
          setCameraPose(defaultTarget, defaultOffset);
        }
      }

      if (snapshot.followSpacecraft) {
        desiredTarget.lerp(orionFocus, 0.16);
        desiredOffset.lerp(new THREE.Vector3(2.6, 1.5, 3.3), 0.05);
        isCameraTransitioning = true;
      }

      if (isCameraTransitioning) {
        const desiredPosition = desiredTarget.clone().add(desiredOffset);
        controls.target.lerp(desiredTarget, 0.1);
        camera.position.lerp(desiredPosition, 0.085);

        if (!snapshot.followSpacecraft) {
          const targetSettled = controls.target.distanceTo(desiredTarget) < 0.02;
          const positionSettled = camera.position.distanceTo(desiredPosition) < 0.03;
          if (targetSettled && positionSettled) {
            isCameraTransitioning = false;
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (nowMs - lastHudUpdateMs > 120) {
        lastHudUpdateMs = nowMs;

        const distanceToEarthKm = vecDistanceKm(orionState.positionKm, earthState.positionKm);
        const distanceToMoonKm = vecDistanceKm(orionState.positionKm, moonState.positionKm);
        const relativeVelocity = vecSubtract(orionState.velocityKmS, earthState.velocityKmS);

        useArtemisStore.getState().setTelemetry({
          metSec: tSec,
          distanceToEarthKm,
          distanceToMoonKm,
          velocityKmS: vecMagnitudeKmS(relativeVelocity),
          missionPhase: missionPhaseAt(tSec),
        });

        setHudDetails({
          currentMoonMiniMapPoint: miniMap.toPoint(moonRelative),
        });

        const project = (obj: THREE.Object3D) => {
          const vector = obj.position.clone().project(camera);
          const labelOffsetX = 12;
          const labelOffsetY = -16;
          return {
            left: ((vector.x + 1) * 0.5 * root.clientWidth) + labelOffsetX,
            top: ((1 - vector.y) * 0.5 * root.clientHeight) + labelOffsetY,
          };
        };

        setLabelPositions({
          earth: project(earthMesh),
          moon: project(moonMesh),
          sun: project(sunMesh),
          orion: project(orionMesh),
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    const onResize = () => {
      const width = canvasHost.clientWidth;
      const height = canvasHost.clientHeight;
      if (!width || !height) {
        return;
      }
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(canvasHost);

    window.addEventListener("resize", onResize);
    onResize();
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);

      controls.dispose();
      earthMesh.geometry.dispose();
      moonMesh.geometry.dispose();
      moonHalo.geometry.dispose();
      sunMesh.geometry.dispose();
      sunGlow.geometry.dispose();
      orionMesh.geometry.dispose();
      orionGlow.geometry.dispose();
      earthAtmosphere.geometry.dispose();
      earthMaterial.dispose();
      moonMaterial.dispose();
      sunMaterial.dispose();
      orionMaterial.dispose();
      (earthAtmosphere.material as THREE.Material).dispose();
      (moonHalo.material as THREE.Material).dispose();
      (sunGlow.material as THREE.Material).dispose();
      (orionGlow.material as THREE.Material).dispose();
      moonTrackGeometry.dispose();
      trajectoryGeometry.dispose();
      outboundArcGeometry.dispose();
      inboundArcGeometry.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      outboundArcLine.material.dispose();
      inboundArcLine.material.dispose();
      trailPastLine.material.dispose();
      trailFutureLine.material.dispose();
      trailFutureGlow.material.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === canvasHost) {
        canvasHost.removeChild(renderer.domElement);
      }
    };
  }, [
    dataset.bodies.earth,
    dataset.bodies.moon,
    dataset.bodies.orion,
    dataset.bodies.sun,
    metricsSeries.distanceEarth,
    metricsSeries.distanceMoon,
    metricsSeries.velocity,
    miniMap,
    missionMaxSec,
    missionMinSec,
    sceneOrientation,
  ]);

  const miniMapIndex = Math.max(
    0,
    Math.min(miniMap.points.length - 1, Math.round((missionTimeSec / Math.max(1, missionMaxSec)) * (miniMap.points.length - 1))),
  );

  useEffect(() => {
    if (initialBodyOverflowRef.current === null) {
      initialBodyOverflowRef.current = document.body.style.overflow;
    }
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = initialBodyOverflowRef.current || "";
    }
    return () => {
      document.body.style.overflow = initialBodyOverflowRef.current || "";
    };
  }, [isExpanded]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
    return () => cancelAnimationFrame(rafId);
  }, [isExpanded]);

  return (
    <div className={`artemis-shell${isExpanded ? " is-expanded" : ""}`} ref={rootRef}>
      <div className="artemis-canvas" ref={canvasHostRef} />

      <HUD
        currentMiniMapPoint={miniMap.points[miniMapIndex] ?? { x: 90, y: 90 }}
        currentMoonMiniMapPoint={hudDetails.currentMoonMiniMapPoint}
        events={missionEvents}
        graphSeries={metricsSeries}
        guidance={guidance}
        miniMapPoints={miniMap.points}
        missionDurationSec={missionDurationSec}
        missionEpochUtc={dataset.metadata.missionEpochUtc}
        missionTimeSec={missionTimeSec}
        telemetry={telemetry}
      />

      <Controls missionMaxSec={missionMaxSec} missionMinSec={missionMinSec} />

      <button
        aria-label={isExpanded ? "Exit full window mode" : "Expand visualization to full window"}
        className={`artemis-expand-btn${isExpanded ? " is-expanded" : ""}`}
        onClick={() => setIsExpanded((prev) => !prev)}
        type="button"
      >
        <span className="artemis-expand-icon" aria-hidden>
          <span className="artemis-expand-arrow artemis-expand-arrow-a">{isExpanded ? "↗" : "↙"}</span>
          <span className="artemis-expand-arrow artemis-expand-arrow-b">{isExpanded ? "↙" : "↗"}</span>
        </span>
      </button>

      {showLabels ? (
        <div className="artemis-label-layer" aria-hidden>
          <span className="artemis-label" style={labelPositions.earth}>
            Earth
          </span>
          <span className="artemis-label" style={labelPositions.moon}>
            Moon
          </span>
          <span className="artemis-label" style={labelPositions.sun}>
            Sun
          </span>
          <span className="artemis-label" style={labelPositions.orion}>
            Orion
          </span>
        </div>
      ) : null}
    </div>
  );
}
