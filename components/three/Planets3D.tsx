"use client";

import dynamic from "next/dynamic";
import { useCan3D } from "./useCan3D";

// three.js is loaded only in the browser and only when 3D is possible,
// after the first paint, so it never blocks LCP.
const PlanetsScene = dynamic(() => import("./PlanetsScene"), { ssr: false });

export function Planets3D() {
  const can3D = useCan3D();
  return can3D ? <PlanetsScene /> : null;
}
