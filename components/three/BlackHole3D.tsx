"use client";

import dynamic from "next/dynamic";
import { useCan3D } from "./useCan3D";

// Loaded only in the browser when WebGL is available; the SVG black hole
// stays as the fallback (and in the static HTML).
const BlackHoleScene = dynamic(() => import("./BlackHoleScene"), {
  ssr: false,
});

export function BlackHole3D() {
  const can3D = useCan3D();
  return can3D ? <BlackHoleScene /> : null;
}
