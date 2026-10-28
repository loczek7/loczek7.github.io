"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { blackHoleFragment, blackHoleVertex } from "./blackHoleShader";
import { setSceneFlag } from "./useCan3D";

// Full-screen quad running the ray-traced black hole shader.
function BlackHoleQuad() {
  const size = useThree((state) => state.size);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  const material = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    const u = material.current?.uniforms;
    if (!u?.uTime || !u.uRes) return;
    u.uTime.value = clock.elapsedTime;
    (u.uRes.value as THREE.Vector2).set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={blackHoleVertex}
        fragmentShader={blackHoleFragment}
        uniforms={uniforms}
        transparent
        premultipliedAlpha
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function BlackHoleScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  // The shader is heavy: render only while the section is on screen.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      setSceneFlag("bh3d", false);
    };
  }, []);

  return (
    <div ref={wrapper} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        // Bigger stage now, so a lower pixel ratio keeps the shader smooth.
        dpr={[1, 1.25]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        onCreated={() => setSceneFlag("bh3d", true)}
      >
        <BlackHoleQuad />
      </Canvas>
    </div>
  );
}
