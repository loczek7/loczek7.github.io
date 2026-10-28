import type { Texture } from "@/components/cosmos/planets";

// Procedural planet surfaces: 3D noise sampled on the sphere itself (no
// texture seams, no pinched poles), plus lighting with a soft terminator,
// an atmospheric rim on the day side and ocean glint on the rocky world.

export type PlanetLook = {
  kind: number;
  // Atmosphere tint and strength (rim on the day side + outer halo).
  atmosphere: [number, number, number];
  atmosphereStrength: number;
};

export const planetLooks: Record<Texture, PlanetLook> = {
  earth: { kind: 0, atmosphere: [0.35, 0.6, 1.0], atmosphereStrength: 0.9 },
  gas: { kind: 1, atmosphere: [0.95, 0.8, 0.6], atmosphereStrength: 0.35 },
  ice: { kind: 2, atmosphere: [0.4, 0.62, 1.0], atmosphereStrength: 0.7 },
  violet: { kind: 3, atmosphere: [0.72, 0.52, 1.0], atmosphereStrength: 0.55 },
  teal: { kind: 4, atmosphere: [0.55, 0.95, 1.0], atmosphereStrength: 0.6 },
  moon: { kind: 5, atmosphere: [0.0, 0.0, 0.0], atmosphereStrength: 0.0 },
};

// Shared value noise, fbm (5 octaves) and Worley noise.
export const noiseGlsl = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  vec3 hash3(vec3 p) {
    return vec3(hash(p), hash(p + 17.31), hash(p + 41.77));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.02 + 0.13;
      a *= 0.5;
    }
    return v;
  }

  // Distance to the nearest cell point (craters).
  float worley(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    float d = 8.0;
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
    for (int z = -1; z <= 1; z++) {
      vec3 g = vec3(float(x), float(y), float(z));
      vec3 r = g + hash3(i + g) - f;
      d = min(d, dot(r, r));
    }
    return sqrt(d);
  }
`;

export const planetVertex = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vObj = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const planetFragment = /* glsl */ `
  uniform float uKind;
  uniform float uDim;
  uniform float uSeed;
  uniform float uTime;
  uniform vec3 uLight;
  uniform vec3 uAtmosphere;
  uniform float uAtmosphereStrength;
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vView;

  ${noiseGlsl}

  // Turbulent latitude bands of a gas or ice giant.
  vec3 bands(vec3 p, vec3 c0, vec3 c1, vec3 c2, vec3 c3,
             float freq, float warpAmount) {
    float warp = fbm(p * vec3(2.0, 5.0, 2.0) + uSeed) * 2.0 - 1.0;
    float b = p.y * freq + warp * warpAmount;
    float b1 = 0.5 + 0.5 * sin(b);
    float b2 = 0.5 + 0.5 * sin(b * 2.3 + 1.7);
    float turb = fbm(p * vec3(5.0, 16.0, 5.0) + uSeed * 1.7);
    vec3 col = mix(c0, c1, b1);
    col = mix(col, c2, b2 * 0.45);
    col = mix(col, c3, smoothstep(0.55, 0.8, turb) * 0.35);
    return col * (1.0 - 0.3 * smoothstep(0.65, 1.0, abs(p.y)));
  }

  void main() {
    vec3 p = normalize(vObj);
    vec3 albedo;
    float ocean = 0.0;
    float cloud = 0.0;
    float city = 0.0;

    if (uKind < 0.5) {
      // Earth-like world. Domain-warped noise gives natural coastlines;
      // biomes follow latitude (deserts in the subtropics, tundra and ice
      // near the poles); swirling clouds; city lights on the night side.
      vec3 q = p * 1.6 + uSeed;
      vec3 w = vec3(fbm(q), fbm(q + 5.2), fbm(q + 9.7));
      float detail = fbm(p * 12.0 + uSeed);
      float h = fbm(q + w * 1.4) + 0.12 * (detail - 0.5);
      float sea = 0.53;
      float lat = abs(p.y);

      vec3 deep = vec3(0.01, 0.05, 0.16);
      vec3 open = vec3(0.02, 0.12, 0.3);
      vec3 shallow = vec3(0.06, 0.3, 0.42);
      vec3 water = mix(deep, open, smoothstep(sea - 0.25, sea - 0.08, h));
      water = mix(water, shallow, smoothstep(sea - 0.05, sea, h));

      float dry = smoothstep(0.1, 0.28, lat) * (1.0 - smoothstep(0.38, 0.5, lat));
      dry *= 0.55 + 0.45 * fbm(p * 5.0 + 2.0);
      vec3 land = mix(vec3(0.06, 0.18, 0.06), vec3(0.2, 0.31, 0.12), detail);
      land = mix(land, vec3(0.6, 0.48, 0.3), dry);
      land = mix(land, vec3(0.34, 0.32, 0.27), smoothstep(0.55, 0.72, lat));
      land = mix(land, vec3(0.42, 0.37, 0.32), smoothstep(sea + 0.14, sea + 0.26, h));

      ocean = 1.0 - smoothstep(sea - 0.004, sea + 0.004, h);
      albedo = mix(land, water, ocean);
      float ice = smoothstep(0.78, 0.86, lat + 0.06 * (detail - 0.5));
      albedo = mix(albedo, vec3(0.92, 0.95, 0.98), ice);
      ocean *= 1.0 - ice;

      vec3 cp = p * 2.6 + vec3(uTime * 0.006, 0.0, 0.0) + 7.0;
      vec3 cw = vec3(fbm(cp), fbm(cp + 3.1), fbm(cp + 6.3));
      cloud = smoothstep(0.5, 0.72, fbm(cp * 1.4 + cw * 2.2)) * 0.9;
      cloud = max(cloud, smoothstep(0.62, 0.8, fbm(p * 7.0 + cw)) * 0.45);

      city = (1.0 - ocean) * (1.0 - ice) * (1.0 - dry)
        * smoothstep(0.6, 0.78, fbm(p * 30.0 + uSeed));
    } else if (uKind < 1.5) {
      // Warm gas giant with a storm spot.
      albedo = bands(p, vec3(0.86, 0.73, 0.56), vec3(0.6, 0.41, 0.27),
                     vec3(0.95, 0.89, 0.77), vec3(0.48, 0.3, 0.2), 14.0, 0.9);
      vec3 d = p - normalize(vec3(0.7, -0.32, 0.62));
      d.y *= 1.9;
      albedo = mix(albedo, vec3(0.74, 0.33, 0.21), smoothstep(0.2, 0.1, length(d)) * 0.85);
    } else if (uKind < 2.5) {
      // Ice giant (Neptune-like).
      albedo = bands(p, vec3(0.17, 0.37, 0.8), vec3(0.08, 0.2, 0.55),
                     vec3(0.45, 0.68, 0.95), vec3(0.88, 0.94, 1.0), 9.0, 0.7);
    } else if (uKind < 3.5) {
      // Violet giant.
      albedo = bands(p, vec3(0.42, 0.26, 0.75), vec3(0.24, 0.12, 0.5),
                     vec3(0.76, 0.55, 0.95), vec3(0.85, 0.42, 0.76), 12.0, 1.0);
    } else if (uKind < 4.5) {
      // Pale cyan giant (Uranus-like): soft, barely visible bands.
      albedo = bands(p, vec3(0.47, 0.82, 0.86), vec3(0.34, 0.68, 0.74),
                     vec3(0.62, 0.9, 0.93), vec3(0.86, 0.98, 1.0), 6.0, 0.35);
    } else {
      // Cratered moon.
      float base = fbm(p * 3.0 + uSeed);
      albedo = vec3(0.5, 0.5, 0.53) * (0.75 + 0.5 * base);
      float maria = smoothstep(0.55, 0.65, fbm(p * 1.4 + uSeed + 3.0));
      albedo *= 1.0 - maria * 0.3;
      float c = worley(p * 4.5 + uSeed);
      float bowl = 1.0 - smoothstep(0.0, 0.28, c);
      float rim = smoothstep(0.24, 0.3, c) * (1.0 - smoothstep(0.3, 0.4, c));
      albedo *= 1.0 - bowl * 0.28 + rim * 0.22;
      float small = worley(p * 12.0 + uSeed);
      albedo *= 1.0 - (1.0 - smoothstep(0.0, 0.2, small)) * 0.15;
    }

    vec3 n = normalize(vNormal);
    vec3 l = normalize(uLight);
    float ndl = dot(n, l);
    // Soft terminator between day and night side.
    float light = smoothstep(-0.12, 0.55, ndl);

    vec3 col = albedo * light * (1.0 - cloud * 0.25);
    col = mix(col, vec3(0.95) * light, cloud * 0.85);
    if (uKind < 0.5) {
      col = mix(col, uAtmosphere * 0.5 * light, 0.1);
      float night = 1.0 - smoothstep(-0.25, 0.05, ndl);
      col += vec3(1.0, 0.72, 0.38) * city * night * (1.0 - cloud) * 0.45;
    }

    // Sun glint on water.
    vec3 hv = normalize(l + vView);
    col += ocean * (1.0 - cloud) * pow(max(dot(n, hv), 0.0), 48.0) * 0.5 * step(0.0, ndl);

    // Atmosphere: bright rim on the lit side.
    float rimAmount = pow(1.0 - max(dot(n, vView), 0.0), 2.6);
    col += uAtmosphere * rimAmount * smoothstep(-0.25, 0.6, ndl) * uAtmosphereStrength;

    col += albedo * 0.012;
    gl_FragColor = vec4(col * uDim, 1.0);
  }
`;

// Star surface: boiling granulation and limb darkening (the edge of a real
// star is darker and redder than its centre).
export const sunFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vView;

  ${noiseGlsl}

  void main() {
    vec3 p = normalize(vObj);
    float coarse = fbm(p * 6.0 + vec3(0.0, uTime * 0.05, 0.0));
    float fine = fbm(p * 22.0 - uTime * 0.09);
    float granulation = 0.6 * coarse + 0.4 * fine;

    float mu = max(dot(normalize(vNormal), vView), 0.0);
    float limb = pow(mu, 0.5);
    vec3 col = mix(vec3(0.92, 0.38, 0.1), vec3(1.0, 0.78, 0.4), limb);
    col = mix(col, vec3(1.0, 0.97, 0.88), pow(limb, 3.0));
    col *= 0.82 + 0.4 * granulation;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Corona on a camera-facing quad around the star: soft glow plus slowly
// shifting streamers. The star's radius is 1/3 of the quad's half-size.
export const coronaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const coronaFragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  ${noiseGlsl}

  void main() {
    vec2 c = vUv * 2.0 - 1.0;
    float r = length(c);
    float a = atan(c.y, c.x);
    float d = max(r - 0.333, 0.0);

    float glow = exp(-d * 7.0) * 0.85 + exp(-d * 2.4) * 0.22;
    // Angle sampled on a circle, so the streamers have no seam.
    float streams = fbm(vec3(cos(a) * 2.5, sin(a) * 2.5, uTime * 0.12 - d * 2.0));
    float rays = pow(streams, 2.2) * exp(-d * 3.2) * 1.1;

    vec3 col = vec3(1.0, 0.6, 0.24) * (glow + rays);
    col += vec3(1.0, 0.92, 0.75) * exp(-d * 20.0) * 0.6;
    col *= 1.0 - smoothstep(0.82, 1.0, r);
    // Premultiplied for additive blending over the transparent canvas.
    gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
  }
`;
