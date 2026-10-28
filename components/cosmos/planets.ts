// Background planets, shared by the CSS fallback (Cosmos.tsx) and the WebGL
// scene (components/three). Positions and sizes come from the prototype;
// the owner asked for fewer planets, so each layer keeps two of them.

export type Texture = "earth" | "gas" | "ice" | "violet" | "moon" | "teal";

export type PlanetSpec = {
  texture: Texture;
  // Time for the texture to scroll one tile (half a turn in 3D).
  roll: string;
  // Glow of the CSS fallback (the 3D version derives it from the texture).
  glow: string;
  size: number;
  // Position inside its parallax layer: left/right/top, in px or %.
  left?: string;
  right?: string;
  top: string;
};

export type LayerName = "far" | "mid" | "near";

export type Layer = {
  name: LayerName;
  // Layer height in vh; taller layers move faster while scrolling.
  height: number;
  // Brightness, as the CSS filter on that layer (nearer = darker).
  dim: number;
  planets: PlanetSpec[];
};

export const layers: Layer[] = [
  {
    name: "far",
    height: 160,
    dim: 1,
    planets: [
      {
        texture: "violet",
        roll: "50s",
        glow: "rgba(205, 170, 255, 0.25)",
        size: 46,
        left: "8%",
        top: "10%",
      },
      {
        texture: "earth",
        roll: "45s",
        glow: "rgba(90, 170, 255, 0.3)",
        size: 54,
        left: "72%",
        top: "48%",
      },
    ],
  },
  {
    name: "mid",
    height: 260,
    dim: 0.65,
    planets: [
      {
        texture: "ice",
        roll: "110s",
        glow: "rgba(105, 178, 251, 0.3)",
        size: 160,
        right: "6%",
        top: "14%",
      },
      {
        texture: "teal",
        roll: "140s",
        glow: "rgba(120, 220, 230, 0.3)",
        size: 170,
        left: "12%",
        top: "70%",
      },
    ],
  },
  {
    name: "near",
    height: 450,
    dim: 0.55,
    planets: [
      {
        texture: "violet",
        roll: "240s",
        glow: "rgba(197, 140, 255, 0.3)",
        size: 560,
        left: "-330px",
        top: "19%",
      },
      {
        texture: "moon",
        roll: "260s",
        glow: "rgba(200, 205, 230, 0.2)",
        size: 420,
        right: "-200px",
        top: "62%",
      },
    ],
  },
];

// Solar system (prototype: .scene3d). Orbit radius and period in px / s.
export type OrbitSpec = {
  radius: number;
  period: number;
  planet: Omit<PlanetSpec, "left" | "right" | "top">;
  ringed?: boolean;
};

export const solarOrbits: OrbitSpec[] = [
  {
    radius: 260,
    period: 46,
    planet: {
      texture: "earth",
      roll: "40s",
      glow: "rgba(90, 170, 255, 0.4)",
      size: 72,
    },
  },
  {
    radius: 430,
    period: 84,
    ringed: true,
    planet: {
      texture: "gas",
      roll: "70s",
      glow: "rgba(240, 190, 120, 0.35)",
      size: 120,
    },
  },
];
