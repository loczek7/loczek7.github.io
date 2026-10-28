// Gargantua-style black hole (reference: docs/design/*.jpg).
// Each pixel shoots a light ray that is bent by gravity (Schwarzschild
// geodesic, units where the event horizon radius = 1). Where the ray crosses
// the disk plane it picks up disk light; rays that fall in stay black. The
// lensed arc above and below the shadow and the photon ring come out of the
// physics, they are not drawn.

export const blackHoleVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const blackHoleFragment = /* glsl */ `
  uniform vec2 uRes;
  uniform float uTime;
  varying vec2 vUv;

  const float R_IN = 2.6;   // inner edge of the disk (~ISCO)
  const float R_OUT = 14.0; // outer edge of the disk
  const float DIST = 16.0;  // camera distance
  const int STEPS = 240;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
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
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  // Small rocky planet near the hole: oceans, land, clouds, lit by the
  // disk (warm, from the direction of the hole), faint starlight on the
  // night side, an atmospheric rim and the disk's glint on the water.
  vec3 shadePlanet(vec3 n, vec3 toLight, vec3 view) {
    float spin = uTime * 0.04;
    vec3 s = vec3(n.x * cos(spin) - n.z * sin(spin), n.y,
                  n.x * sin(spin) + n.z * cos(spin));
    float h = fbm(s * 2.6 + 11.0) + 0.12 * (fbm(s * 9.0 + 3.0) - 0.5);
    float land = smoothstep(0.5, 0.53, h);
    vec3 water = vec3(0.02, 0.06, 0.15);
    vec3 ground = mix(vec3(0.17, 0.15, 0.11), vec3(0.34, 0.28, 0.2),
                      smoothstep(0.53, 0.68, h));
    vec3 albedo = mix(water, ground, land);
    float cloud = smoothstep(0.55, 0.75,
      fbm(s * 3.6 + vec3(uTime * 0.02, 0.0, 0.0) + 20.0));
    albedo = mix(albedo, vec3(0.82), cloud * 0.8);

    float ndl = dot(n, toLight);
    float day = smoothstep(-0.1, 0.6, ndl);
    vec3 warm = vec3(1.0, 0.66, 0.36) * 1.3;
    vec3 col = albedo * warm * day;
    col += albedo * vec3(0.15, 0.2, 0.3) * 0.12;

    vec3 hv = normalize(toLight + view);
    col += (1.0 - land) * (1.0 - cloud) * warm * 0.6
      * pow(max(dot(n, hv), 0.0), 40.0) * step(0.0, ndl);

    float rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
    col += vec3(1.0, 0.7, 0.45) * rim * smoothstep(-0.3, 0.5, ndl) * 0.7;
    col += vec3(0.3, 0.5, 1.0) * rim * 0.15;
    return col;
  }

  // White-hot inner disk -> warm orange -> dark red rim.
  vec3 diskColor(float t) {
    vec3 c1 = vec3(1.0, 0.98, 0.94);
    vec3 c2 = vec3(1.0, 0.84, 0.58);
    vec3 c3 = vec3(1.0, 0.5, 0.17);
    vec3 c4 = vec3(0.45, 0.12, 0.03);
    if (t < 0.25) return mix(c1, c2, t / 0.25);
    if (t < 0.6) return mix(c2, c3, (t - 0.25) / 0.35);
    return mix(c3, c4, (t - 0.6) / 0.4);
  }

  // Smooth radial emission (no detail), used for the haze around the disk.
  float emission(float r) {
    float t = clamp((r - R_IN) / (R_OUT - R_IN), 0.0, 1.0);
    return smoothstep(R_IN - 0.4, R_IN + 0.8, r) * pow(1.0 - t, 3.0);
  }

  vec4 sampleDisk(vec3 p, vec3 rayDir) {
    float r = length(p.xz);
    if (r < R_IN || r > R_OUT) return vec4(0.0);
    float t = (r - R_IN) / (R_OUT - R_IN);

    // Differential rotation: inner rings orbit faster (Kepler).
    float angle = uTime * 0.8 * pow(r, -1.5);
    float c = cos(angle);
    float s = sin(angle);
    vec2 q = mat2(c, -s, s, c) * p.xz;

    // Many thin concentric rings with irregular brightness, like the
    // reference; after lensing they become the layered arc over the shadow.
    float n = fbm(vec3(q * 0.5, r * 1.6));
    float fine = 0.5 + 0.5 * sin(r * 22.0 + n * 5.0);
    float wide = 0.78 + 0.22 * sin(r * 5.0 + n * 3.0);
    float clumps = fbm(vec3(q * 0.22, r * 5.0));
    float density = mix(0.7, 1.0, pow(fine, 1.6)) * wide * (0.55 + 0.7 * clumps);

    float edge = smoothstep(R_IN, R_IN + 0.35, r)
      * (1.0 - smoothstep(R_OUT * 0.5, R_OUT, r));
    float intensity = pow(1.0 - t, 2.4) * 4.2 + 0.12;

    // Doppler beaming: the side moving towards us (right) is brighter.
    vec3 orbit = normalize(vec3(p.z, 0.0, -p.x)) * sqrt(0.5 / r);
    float doppler = clamp(1.0 + 2.0 * dot(orbit, -rayDir), 0.35, 2.4);

    float b = intensity * density * edge * doppler * doppler;
    vec3 col = diskColor(clamp(t * 1.15 + (1.0 - doppler) * 0.2, 0.0, 1.0)) * b;
    return vec4(col, clamp(b * 0.85, 0.0, 1.0));
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 uv = (vUv - 0.5) * vec2(aspect, 1.0);
    // Shadow slightly above the middle, leaving room for the lower arc.
    uv.y -= 0.03;

    // Focal length from the screen shape: the shadow, both lensed arcs and
    // the bright inner disk always fit (no cropping on phones or wide
    // screens); only the faint outer disk may fade out at the sides.
    float fitWidth = 0.46 * aspect * DIST / 7.5;
    float fitHeight = 0.42 * DIST / 5.4;
    float focal = min(fitWidth, fitHeight);

    // Camera ~4 degrees above the disk plane, with a small roll.
    vec3 camPos = vec3(0.0, 1.1, -DIST);
    vec3 fw = normalize(-camPos);
    vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
    vec3 up = cross(fw, rt);
    float roll = -0.05;
    vec3 rtR = rt * cos(roll) + up * sin(roll);
    vec3 upR = up * cos(roll) - rt * sin(roll);
    vec3 dir = normalize(fw * focal + rtR * uv.x + upR * uv.y);

    // Small planet on the left, lit by the disk (straight-ray hit test:
    // it is far enough from the hole for bending not to matter).
    vec3 planetC = vec3(-7.6, 0.45 + 0.08 * sin(uTime * 0.3), -6.0);
    float planetR = 0.42;
    vec3 oc = camPos - planetC;
    float bq = dot(oc, dir);
    float disc = bq * bq - (dot(oc, oc) - planetR * planetR);
    float planetT = disc > 0.0 ? -bq - sqrt(disc) : -1.0;
    // Thin atmospheric glow just outside the planet's edge.
    float closest = sqrt(max(dot(oc, oc) - bq * bq, 0.0));
    float planetGlow = bq < 0.0 && planetT < 0.0
      ? exp(-(closest - planetR) / 0.035) * 0.35
      : 0.0;

    vec3 pos = camPos;
    vec3 vel = dir;
    vec3 hv = cross(pos, vel);
    float h2 = dot(hv, hv);
    vec3 col = vec3(0.0);
    float alpha = 0.0;
    float glow = 0.0;
    float haze = 0.0;
    float travel = 0.0;
    bool captured = false;

    for (int i = 0; i < STEPS; i++) {
      float r2 = dot(pos, pos);
      float r = sqrt(r2);
      if (r < 1.0) { captured = true; break; }

      float dt = clamp(0.06 * r, 0.02, 0.6);
      vec3 prev = pos;
      vel += -1.5 * h2 * pos / (r2 * r2 * r) * dt;
      pos += vel * dt;
      travel += dt * length(vel);

      // Warm glow around the hole and a luminous haze hugging the disk.
      glow += 0.012 * dt / max(r2 - 1.0, 0.3);
      haze += 0.07 * dt * exp(-abs(pos.y) * 2.6) * emission(length(pos.xz));

      if (planetT > 0.0 && travel >= planetT) {
        vec3 n = normalize(camPos + dir * planetT - planetC);
        col += (1.0 - alpha) * shadePlanet(n, normalize(-planetC), -dir);
        alpha = 1.0;
        break;
      }

      if (prev.y * pos.y < 0.0) {
        float f = prev.y / (prev.y - pos.y);
        vec4 d = sampleDisk(mix(prev, pos, f), normalize(vel));
        col += (1.0 - alpha) * d.rgb;
        alpha += (1.0 - alpha) * d.a;
        if (alpha > 0.995) break;
      }

      if (r > 40.0 && dot(pos, vel) > 0.0) break;
    }

    vec3 light = vec3(1.0, 0.5, 0.18) * glow + vec3(1.0, 0.62, 0.3) * haze
      + vec3(1.0, 0.72, 0.5) * planetGlow;
    col += (1.0 - alpha) * light * (captured ? 0.15 : 1.0);
    float lightAlpha = clamp(max(light.r, max(light.g, light.b)), 0.0, 1.0);
    alpha = captured ? 1.0 : clamp(alpha + (1.0 - alpha) * lightAlpha, 0.0, 1.0);

    // Soft tone mapping, so the white-hot core does not clip harshly.
    col = 1.0 - exp(-col * 1.9);
    gl_FragColor = vec4(col, alpha);
  }
`;
