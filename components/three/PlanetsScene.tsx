"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  layers,
  solarOrbits,
  type LayerName,
  type OrbitSpec,
  type PlanetSpec,
} from "@/components/cosmos/planets";
import { Globe3D } from "./Globe3D";
import {
  coronaFragment,
  coronaVertex,
  planetVertex,
  sunFragment,
} from "./planetShader";
import { setSceneFlag } from "./useCan3D";

const FOV = 45;
const CAMERA_Z = 10;

// Depth of each parallax layer. Positions and sizes are still computed in
// screen pixels (as in the CSS version), the depth only adds perspective.
const layerDepth: Record<LayerName, number> = { far: -6, mid: -3, near: 0 };

// World units per screen pixel at depth z, for a viewport `height` px tall.
function unitsPerPx(z: number, height: number) {
  const distance = CAMERA_Z - z;
  return (2 * distance * Math.tan((FOV * Math.PI) / 360)) / height;
}

// "8%" of `total` or "-330px".
function toPx(value: string, total: number) {
  return value.endsWith("%")
    ? (parseFloat(value) / 100) * total
    : parseFloat(value);
}

// 0 at the top of the page, 1 at the bottom (prototype: scroll(root)).
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, window.scrollY / max) : 0;
}

type ParallaxGlobeProps = {
  spec: PlanetSpec;
  layerHeight: number;
  depth: number;
  dim: number;
};

// A planet in a parallax layer. Like the CSS layer (translateY from 0 to
// -100% + 100vh while scrolling), taller layers drift up faster.
function ParallaxGlobe({ spec, layerHeight, depth, dim }: ParallaxGlobeProps) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((state) => state.size);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const { width: w, height: h } = size;
    const layerPx = (layerHeight / 100) * h;
    const left =
      spec.left !== undefined
        ? toPx(spec.left, w)
        : w - toPx(spec.right ?? "0", w) - spec.size;
    const centerX = left + spec.size / 2;
    const centerY =
      toPx(spec.top, layerPx) +
      spec.size / 2 -
      scrollProgress() * (layerPx - h);

    const k = unitsPerPx(depth, h);
    g.position.set((centerX - w / 2) * k, -(centerY - h / 2) * k, depth);
    g.scale.setScalar((spec.size / 2) * k);
  });

  return (
    <group ref={group}>
      <Globe3D
        texture={spec.texture}
        size={spec.size}
        roll={spec.roll}
        dim={dim}
      />
    </group>
  );
}

// Path of the solar system while scrolling: [progress, x in vw, y in vh,
// scale]. It starts where the prototype has it (lower right of the hero),
// then drifts up and off screen. The prototype flew it across the middle,
// but in 3D it then collided with the galaxy's own sun.
const camPath: [number, number, number, number][] = [
  [0, 34, 22, 0.9],
  [0.2, 70, -75, 0.95],
];
const SOLAR_END = camPath[camPath.length - 1]![0];

function camAt(p: number): [number, number, number] {
  const [p0, x0, y0, s0] = camPath[0]!;
  const [p1, x1, y1, s1] = camPath[1]!;
  const t = Math.min(1, Math.max(0, (p - p0) / (p1 - p0)));
  // Ease in, so it lingers in the hero and then accelerates away.
  const e = t * t;
  return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e, s0 + (s1 - s0) * e];
}

// Planets fade out as the black hole comes into view (prototype: cosfade),
// so nothing from the background sits on top of it.
function CosmosFade() {
  useFrame(({ gl }) => {
    const stage = document.querySelector("[data-bh-stage]");
    if (!stage) return;
    const t = stage.getBoundingClientRect().top / window.innerHeight;
    const k = Math.min(1, Math.max(0, (t - 0.15) / 0.75));
    gl.domElement.style.opacity = String(0.04 + 0.96 * k * k * (3 - 2 * k));
  });
  return null;
}

const SOLAR_DEPTH = -4;
// Orbit plane tilt, as rotateX(66deg) rotateZ(-18deg) in the prototype.
const tilt = new THREE.Matrix4().makeRotationFromEuler(
  new THREE.Euler(-66 * (Math.PI / 180), 0, 18 * (Math.PI / 180), "XYZ"),
);

function OrbitLine({ radius }: { radius: number }) {
  const line = useMemo(() => {
    const points = Array.from({ length: 128 }, (_, i) => {
      const a = (i / 128) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
      color: new THREE.Color(170 / 255, 180 / 255, 1),
      transparent: true,
      opacity: 0.28,
      dashSize: 6,
      gapSize: 6,
    });
    const loop = new THREE.LineLoop(geometry, material);
    loop.computeLineDistances();
    return loop;
  }, [radius]);
  return <primitive object={line} />;
}

// Planetary ring with fine bands and a Cassini-like gap (RingGeometry lies
// in the XY plane, so the radius is the length of position.xy).
const ringVertex = /* glsl */ `
  varying float vR;
  void main() {
    vR = length(position.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  uniform float uInner;
  uniform float uOuter;
  varying float vR;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  void main() {
    float t = (vR - uInner) / (uOuter - uInner);
    float fine = 0.65 + 0.35 * hash(floor(t * 90.0));
    float bands = 0.75 + 0.25 * sin(t * 38.0);
    float gap = smoothstep(0.58, 0.6, t) * (1.0 - smoothstep(0.64, 0.66, t));
    float edge = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.92, 1.0, t));
    float a = 0.55 * fine * bands * edge * (1.0 - gap * 0.9);
    vec3 col = mix(vec3(0.62, 0.52, 0.4), vec3(0.95, 0.86, 0.7), fine);
    gl_FragColor = vec4(col, a);
  }
`;

function PlanetRing() {
  const uniforms = useMemo(
    () => ({ uInner: { value: 1.3 }, uOuter: { value: 2.2 } }),
    [],
  );
  return (
    <mesh rotation={[-1.25, 0.2, -0.3]}>
      <ringGeometry args={[1.3, 2.2, 128, 1]} />
      <shaderMaterial
        vertexShader={ringVertex}
        fragmentShader={ringFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbitingGlobe({ orbit }: { orbit: OrbitSpec }) {
  const group = useRef<THREE.Group>(null);
  const position = useMemo(() => new THREE.Vector3(), []);

  // Planets move along the tilted orbit but stay upright, like the
  // prototype's counter-rotating .pl3.
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const angle =
      Math.PI / 2 + (clock.elapsedTime / orbit.period) * Math.PI * 2;
    position
      .set(Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius, 0)
      .applyMatrix4(tilt);
    g.position.copy(position);
  });

  const r = orbit.planet.size / 2;
  return (
    <group ref={group} scale={r}>
      <Globe3D {...orbit.planet}>{orbit.ringed && <PlanetRing />}</Globe3D>
    </group>
  );
}

// Unit-radius star: granulated surface with limb darkening, plus a corona
// with streamers on a camera-facing quad (the scene is never rotated).
function Star() {
  const surface = useRef<THREE.ShaderMaterial>(null);
  const corona = useRef<THREE.ShaderMaterial>(null);
  const surfaceUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const coronaUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    for (const material of [surface.current, corona.current]) {
      const time = material?.uniforms.uTime;
      if (time) time.value = clock.elapsedTime;
    }
  });

  return (
    <>
      <mesh>
        <sphereGeometry args={[1, 64, 48]} />
        <shaderMaterial
          ref={surface}
          vertexShader={planetVertex}
          fragmentShader={sunFragment}
          uniforms={surfaceUniforms}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[6, 6]} />
        <shaderMaterial
          ref={corona}
          vertexShader={coronaVertex}
          fragmentShader={coronaFragment}
          uniforms={coronaUniforms}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

// Solar system in the lower right of the hero that drifts away while
// scrolling (prototype: .scene3d with camfly). Hidden below 900px, as there.
function SolarSystem() {
  const root = useRef<THREE.Group>(null);
  const size = useThree((state) => state.size);

  useFrame(() => {
    const g = root.current;
    if (!g) return;
    const { width: w, height: h } = size;
    const p = scrollProgress();
    g.visible = w > 900 && p < SOLAR_END;
    const [vx, vy, s] = camAt(p);
    const k = unitsPerPx(SOLAR_DEPTH, h);
    g.position.set((vx / 100) * w * k, -((vy / 100) * h) * k, SOLAR_DEPTH);
    g.scale.setScalar(s * k);
  });

  return (
    <group ref={root}>
      <group matrixAutoUpdate={false} matrix={tilt}>
        {solarOrbits.map((orbit) => (
          <OrbitLine key={orbit.radius} radius={orbit.radius} />
        ))}
      </group>
      <group scale={40}>
        <Star />
      </group>
      {solarOrbits.map((orbit) => (
        <OrbitingGlobe key={orbit.radius} orbit={orbit} />
      ))}
    </group>
  );
}

// WebGL version of the background planets. Surfaces and lighting are in the
// planet shader (light from the upper left, like the CSS highlight).
export default function PlanetsScene() {
  useEffect(() => () => setSceneFlag("planets3d", false), []);

  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={() => setSceneFlag("planets3d", true)}
    >
      {layers.map((layer) =>
        layer.planets.map((spec) => (
          <ParallaxGlobe
            key={`${layer.name}-${spec.left ?? spec.right}-${spec.top}`}
            spec={spec}
            layerHeight={layer.height}
            depth={layerDepth[layer.name]}
            dim={layer.dim}
          />
        )),
      )}
      <SolarSystem />
      <CosmosFade />
    </Canvas>
  );
}
