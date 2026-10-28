import { useSyncExternalStore } from "react";

// 3D runs on every device (owner's decision), except when WebGL is missing
// or the user asked for reduced motion; then the CSS/SVG fallback stays.
let cached: boolean | null = null;

function detect(): boolean {
  if (cached !== null) return cached;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }
  cached = !reduced && webgl;
  return cached;
}

const subscribe = () => () => {};

// false during prerendering, so the static HTML always contains the fallback.
export function useCan3D(): boolean {
  return useSyncExternalStore(subscribe, detect, () => false);
}

// Marks <html> while a 3D scene is on screen, so CSS can hide its fallback.
export function setSceneFlag(name: string, on: boolean) {
  const root = document.documentElement;
  if (on) root.setAttribute(`data-${name}`, "");
  else root.removeAttribute(`data-${name}`);
}
