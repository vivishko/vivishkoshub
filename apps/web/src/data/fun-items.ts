export type FunItem = {
  title: string;
  summary: string;
  type: string;
  status: string;
  tags: string[];
  accent: string;
  href?: string;
  coverSrc?: string;
};

export const funItems: FunItem[] = [
  {
    title: "Artemis II Visualization",
    summary: "Interactive mission trajectory viewer with real JPL Horizons state vectors.",
    type: "mission-viz",
    status: "live",
    tags: ["three.js", "space", "simulation"],
    accent: "#8edbff",
    href: "/artemis-2-visualization",
    coverSrc: "/covers/studio-drift.svg",
  },
  {
    title: "Neon Drift",
    summary: "A tiny racing loop with pastel trails and ripple physics.",
    type: "mini-game",
    status: "prototype",
    tags: ["webgl", "motion", "play"],
    accent: "#ffb8d9",
  },
  {
    title: "Orbit Choir",
    summary: "Orbital dots that sing when their paths intersect.",
    type: "audio-viz",
    status: "live sketch",
    tags: ["sound", "canvas", "rhythm"],
    accent: "#c7d2ff",
  },
  {
    title: "Echo Tiles",
    summary: "Tap a grid, build a melody, and watch it dissolve.",
    type: "interaction",
    status: "idea",
    tags: ["ui", "music", "touch"],
    accent: "#ffe3a3",
  },
  {
    title: "Constellation Lab",
    summary: "A sandbox for drawing constellations with soft gravity.",
    type: "simulation",
    status: "in progress",
    tags: ["particles", "viz", "space"],
    accent: "#b9f5e8",
  },
];
