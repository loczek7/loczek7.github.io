"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Texture } from "@/components/cosmos/planets";
import { planetFragment, planetLooks, planetVertex } from "./planetShader";

// Light from the upper left, in view space (matches the CSS highlight).
const LIGHT = new THREE.Vector3(-0.6, 0.5, 0.6).normalize();

// Fresnel halo on a slightly larger back-facing sphere: bright at the rim,
// fading outwards.
const haloVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  void main() {
    float rim = pow(max(0.0, 0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    // Premultiplied: alpha follows the light, so the halo never darkens
    // the transparent canvas (stars and nebulae stay visible behind it).
    vec3 c = uColor * rim * uStrength;
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }
`;

type HaloProps = {
  color: [number, number, number];
  strength: number;
  scale?: number;
};

export function Halo({ color, strength, scale = 1.15 }: HaloProps) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(...color) },
      uStrength: { value: strength },
    }),
    [color, strength],
  );
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1, 48, 32]} />
      <shaderMaterial
        vertexShader={haloVertex}
        fragmentShader={haloFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// Stable per-planet variation, so two planets of one kind differ.
function seedFor(texture: Texture, size: number) {
  let h = size;
  for (const ch of texture) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return h / 37;
}

type Globe3DProps = {
  texture: Texture;
  size: number;
  // CSS duration of one texture tile, e.g. "50s" (= half a turn here).
  roll: string;
  // Brightness multiplier (nearer parallax layers are darker).
  dim?: number;
  children?: ReactNode;
};

// Unit-radius procedural planet; the parent positions and scales it.
export function Globe3D({
  texture,
  size,
  roll,
  dim = 1,
  children,
}: Globe3DProps) {
  const surface = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const look = planetLooks[texture];
  const speed = Math.PI / parseFloat(roll);

  const uniforms = useMemo(
    () => ({
      uKind: { value: look.kind },
      uDim: { value: dim },
      uSeed: { value: seedFor(texture, size) },
      uTime: { value: 0 },
      uLight: { value: LIGHT },
      uAtmosphere: { value: new THREE.Color(...look.atmosphere) },
      uAtmosphereStrength: { value: look.atmosphereStrength },
    }),
    [look, dim, texture, size],
  );

  useFrame(({ clock }, delta) => {
    if (surface.current) surface.current.rotation.y += delta * speed;
    const u = material.current?.uniforms;
    if (u?.uTime) u.uTime.value = clock.elapsedTime;
  });

  return (
    <>
      {/* Axial tilt, so bands and poles are not perfectly horizontal. */}
      <group rotation={[0.2, 0, 0.14]}>
        <mesh ref={surface}>
          <sphereGeometry args={[1, 96, 64]} />
          <shaderMaterial
            ref={material}
            vertexShader={planetVertex}
            fragmentShader={planetFragment}
            uniforms={uniforms}
          />
        </mesh>
      </group>
      {look.atmosphereStrength > 0 && (
        <Halo
          color={look.atmosphere}
          strength={look.atmosphereStrength * dim * 0.9}
        />
      )}
      {children}
    </>
  );
}
