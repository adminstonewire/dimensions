import { BufferAttribute, BufferGeometry, Matrix4, Mesh, ShaderMaterial, Vector2, Vector3, Vector4, type Color, type PerspectiveCamera } from 'three';
import { bodyPose, type Body } from '../core/body';
import type { World } from '../core/world';

// Signed-distance ray marching of a 4D world of balls, boxes and one creature, as seen in the 3D
// slice through the creature. Slicing is nothing more than giving every point on a ray the
// creature's own w; there is no 4D mesh anywhere.

export interface MarchView {
  /**
   * How many directions the creature can reach. At 3 the slice is drawn solid. Below 3 the slice
   * becomes a ghost and only the creature's own sheet (2) or line (1) is solid, showing the
   * cross-sections it actually lives among.
   */
  reach: number;
  /** Draw the creature. False for the view from its own eye. */
  self: boolean;
  /**
   * An eye whose retina is a line, looking along `gaze` (an angle in the x–y plane) with a field
   * of view `fov`. Its image is one row of pixels, shown as a strip; fov 0 is a single pixel.
   * Without this, the view is the camera's.
   */
  strip?: { gaze: number; fov: number };
}

const vertexShader = /* glsl */ `
  varying vec2 vNdc;
  varying vec3 vDir;
  void main() {
    vNdc = position.xy;
    // The ray through this corner, in world space. Unnormalised, so it interpolates exactly.
    vDir = vec3(position.xy / vec2(projectionMatrix[0][0], projectionMatrix[1][1]), -1.0) * mat3(viewMatrix);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }`;

// The shape counts are written into the shader: loops of a fixed length measured a third faster
// than loops up to a uniform (5 ms against 8 ms a frame).
const fragmentShader = (balls: number, boxes: number, rods: number) => /* glsl */ `
  uniform vec3 uBg, uInk, uYou, uGrid;
  uniform vec4 uBall[${balls || 1}];
  uniform float uBallR[${balls || 1}];
  uniform vec4 uBoxC[${boxes || 1}], uBoxH[${boxes || 1}];
  uniform vec4 uRodA[${rods || 1}], uRodB[${rods || 1}];
  uniform int uReach;
  uniform vec4 uAt;      // the creature's centre; its w is the slice, its z the sheet, its y and z the line
  uniform mat4 uTurn;    // world to the creature's rest frame
  uniform vec2 uBody;    // the creature's size and corner radius
  uniform float uSelf, uGround, uGhost, uFog, uGaze, uFov;
  uniform vec2 uBand;    // half-size of the strip; y = 0 means the camera's view
  uniform vec3 uLo, uHi; // a box around every shape: rays are only marched inside it
  varying vec2 vNdc;
  varying vec3 vDir;

  const int STEPS = 80;
  const float FAR = 60.0;
  const float STRIDE = 0.05; // step through the inside of a shape, where the exact way out does not matter
  const float ROD = 0.012;
  const float LINE = 0.015;
  const vec3 LIGHT = vec3(0.3216, 0.9189, 0.2297);

  float things(vec4 p) {
    float d = FAR;
    for (int i = 0; i < ${balls}; i++) d = min(d, length(p - uBall[i]) - uBallR[i]);
    for (int i = 0; i < ${boxes}; i++) {
      vec4 q = abs(p - uBoxC[i]) - uBoxH[i];
      float m = max(max(q.x, q.y), max(q.z, q.w)); // never more than the true distance: skips the far boxes cheaply
      if (m < d) d = min(d, length(max(q, 0.0)) + min(m, 0.0));
    }
    for (int i = 0; i < ${rods}; i++) {
      vec4 a = p - uRodA[i], b = uRodB[i] - uRodA[i];
      d = min(d, length(a - b * clamp(dot(a, b) / dot(b, b), 0.0, 1.0)) - ROD);
    }
    return d;
  }

  // The creature is drawn as the hull of its corner particles: the cross-polytope |x|+|y|+|z|+|w| <= size,
  // rounded by the particle radius. Exact distance: outside, the nearest point of the polytope is
  // the projection onto a simplex (Michelot 1986), three passes for four coordinates.
  // Approximation: collisions use the particles themselves, so a ball can sink a little way
  // into a face of the hull before it is stopped. Against the ground and box faces they agree.
  float creature(vec4 p) {
    float far = length(p - uAt) - uBody.x - uBody.y; // to the ball around it: enough when that is far away
    if (far > 0.2) return far;
    vec4 q = abs(uTurn * (p - uAt));
    float over = q.x + q.y + q.z + q.w - uBody.x;
    if (over < 0.0) return 0.5 * over - uBody.y;
    vec4 on = vec4(1.0);
    for (int i = 0; i < 3; i++) on *= step((dot(q, on) - uBody.x) / dot(on, on), q);
    return length(q - max(q - (dot(q, on) - uBody.x) / dot(on, on), 0.0)) - uBody.y;
  }

  float map(vec4 p) {
    return uSelf > 0.5 ? min(things(p), creature(p)) : things(p);
  }

  vec3 ink(vec4 p) {
    return uSelf > 0.5 && creature(p) < things(p) ? uYou : uInk;
  }

  vec3 normal(vec4 p) {
    vec2 e = vec2(1.0, -1.0) * 0.001;
    return normalize(e.xyy * map(p + vec4(e.xyy, 0.0)) + e.yyx * map(p + vec4(e.yyx, 0.0)) +
                     e.yxy * map(p + vec4(e.yxy, 0.0)) + e.xxx * map(p + vec4(e.xxx, 0.0)));
  }

  // The stretch of a ray, as (from, to), that lies inside the box around every shape.
  vec2 span(vec3 o, vec3 d) {
    vec3 inv = 1.0 / (d + step(abs(d), vec3(1e-6)) * 1e-6);
    vec3 a = (uLo - o) * inv, b = (uHi - o) * inv, near = min(a, b), far = max(a, b);
    return vec2(max(max(near.x, near.y), max(near.z, 0.0)), min(far.x, min(far.y, far.z)));
  }

  // How much of the light a point on the ground loses to the shapes above it.
  float shadow(vec4 p) {
    float lit = 1.0, t = 0.03, last = 1e9, end = span(p.xyz, LIGHT).y;
    for (int i = 0; i < 12; i++) {
      if (lit < 0.0 || t > end) break;
      float d = map(p + vec4(LIGHT, 0.0) * t);
      // The nearest miss lies between this sample and the last one (Aaltonen 2018); taking it
      // from the samples alone leaves rings in a wide penumbra.
      float back = d * d / (2.0 * last);
      lit = min(lit, 8.0 * sqrt(max(d * d - back * back, 0.0)) / max(t - back, 1e-4));
      last = d;
      t += max(d, 0.03);
    }
    return 1.0 - clamp(lit, 0.0, 1.0);
  }

  vec4 acc = vec4(0.0); // front to back
  void over(vec3 c, float a) {
    acc.rgb += (1.0 - acc.a) * a * c;
    acc.a += (1.0 - acc.a) * a;
  }

  void main() {
    bool strip = uBand.y > 0.0;
    vec4 ro = vec4(cameraPosition, uAt.w), rd = vec4(normalize(vDir), 0.0);
    float frame = 0.0;
    if (strip) {
      vec2 e = (abs(vNdc) - uBand) / fwidth(vNdc);
      frame = max(e.x, e.y); // pixels outside the strip
      if (frame > 1.5) discard;
      float a = uGaze - 0.5 * uFov * vNdc.x / uBand.x; // left of the strip is anticlockwise: up, when facing +x
      ro = uAt;
      rd = vec4(cos(a), sin(a), 0.0, 0.0);
    }
    float tg = (uGround - ro.y) / rd.y;
    bool ground = rd.y < 0.0 && tg > 0.0; // the ground only hides things from above
    float tEnd = ground ? tg : FAR;

    // What the creature can reach, where this ray meets it, at distance tr.
    float tr = -1.0;
    vec4 layer = vec4(0.0);
    if (!strip && uReach < 3) {
      float t, cover = 1.0, faint = 0.07;
      if (uReach == 2) {
        t = (uAt.z - ro.z) / (abs(rd.z) < 1e-6 ? 1e-6 : rd.z); // its sheet
      } else {
        vec2 oc = ro.yz - uAt.yz; // its line, drawn as a ribbon
        t = -dot(oc, rd.yz) / (dot(rd.yz, rd.yz) + 1e-9);
        float miss = length(oc + rd.yz * t);
        cover = clamp(0.5 + (LINE - miss) / fwidth(miss), 0.0, 1.0);
        faint = 0.35;
      }
      vec4 p = ro + rd * t;
      if (uReach == 1) p.yz = uAt.yz;
      float d = map(p);
      float solid = clamp(0.5 - d / fwidth(d), 0.0, 1.0); // inside a shape: its cross-section
      faint *= 1.0 - smoothstep(2.0, 3.5, distance(p.xy, uAt.xy));
      if (t > 0.0 && t < tEnd) {
        tr = t;
        layer = vec4(mix(uInk, ink(p), solid), cover * mix(faint, 1.0, solid));
        if (layer.a > 0.99) tEnd = t;
      }
    }

    // Sphere tracing. A ghost lets the ray carry on, so it is drawn where the ray enters it and
    // then crossed in strides. "armed" keeps a surface the ray skims along from being drawn twice.
    vec2 s = span(ro.xyz, rd.xyz);
    float t = s.x, end = frame > 0.0 ? -1.0 : min(tEnd, s.y);
    bool armed = true;
    for (int i = 0; i < STEPS; i++) {
      if (t >= end || acc.a > 0.99) break;
      vec4 p = ro + rd * t;
      float d = map(p);
      if (d < 0.0) {
        t += max(-d, STRIDE);
      } else if (d < 0.0003 + 0.0006 * t) {
        if (armed) {
          if (tr > 0.0 && tr < t) {
            over(layer.rgb, layer.a);
            tr = -1.0;
          }
          vec3 n = normal(p);
          float rim = 1.0 - abs(dot(n, rd.xyz));
          vec3 c = mix(ink(p), uBg, 0.02 + 0.2 * max(dot(n, LIGHT), 0.0)); // lit ink is thinner ink
          over(mix(c, uBg, 1.0 - exp(-uFog * t)), uGhost + (1.0 - uGhost) * 0.7 * rim * rim);
          armed = false;
        }
        t += STRIDE;
      } else {
        armed = true;
        t += d;
      }
    }
    if (tr > 0.0) over(layer.rgb, layer.a);
    if (ground && acc.a < 0.99) {
      vec4 p = ro + rd * tg;
      if (strip) over(mix(uGrid, uBg, 1.0 - exp(-uFog * tg)), 1.0); // the ground edge-on
      else over(uGrid, 0.6 * sqrt(uGhost) * shadow(p) * (1.0 - smoothstep(8.0, 16.0, tg)));
    }

    gl_FragColor = frame > 0.0 ? vec4(uGrid, 1.0) : vec4(acc.rgb / max(acc.a, 1e-4), acc.a);
    #include <colorspace_fragment>
  }`;

/**
 * A full-screen mesh that draws `world` and its `creature`, and the function that hands it their
 * current state. The world has at most 4 dimensions and one ground plane, facing up; its shapes
 * are counted here, once, so it must not gain or lose any afterwards.
 */
export function createMarch(colors: { bg: Color; ink: Color; you: Color; grid: Color }, world: World, creature: Body) {
  const d = world.dim, { radius, body } = world;
  const balls = radius.flatMap((r, i) => (body[i] < 0 && r > 0 ? [i] : [])); // the creature's particles are drawn as its hull
  const rods = world.links.filter(({ i }) => body[i] < 0);
  const boxes = world.boxes;
  const vec4s = (n: number) => Array.from({ length: n || 1 }, () => new Vector4());
  const u = {
    uBg: { value: colors.bg },
    uInk: { value: colors.ink },
    uYou: { value: colors.you },
    uGrid: { value: colors.grid },
    uBall: { value: vec4s(balls.length) },
    uBallR: { value: Float32Array.from(balls.length ? balls.map((i) => radius[i]) : [0]) },
    uBoxC: { value: vec4s(boxes.length) },
    uBoxH: { value: vec4s(boxes.length) },
    uRodA: { value: vec4s(rods.length) },
    uRodB: { value: vec4s(rods.length) },
    uReach: { value: 3 },
    uAt: { value: new Vector4() },
    uTurn: { value: new Matrix4() },
    uBody: { value: new Vector2(Math.hypot(...creature.rest.subarray(d, 2 * d)), radius[creature.particles[0]]) },
    uSelf: { value: 1 },
    uGround: { value: world.planes[0].offset },
    uGhost: { value: 1 },
    uFog: { value: 0 },
    uGaze: { value: 0 },
    uFov: { value: 0 },
    uBand: { value: new Vector2() },
    uLo: { value: new Vector3() },
    uHi: { value: new Vector3() },
  };
  const geometry = new BufferGeometry().setAttribute('position', new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const material = new ShaderMaterial({
    uniforms: u,
    vertexShader,
    fragmentShader: fragmentShader(balls.length, boxes.length, rods.length),
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false; // it is the whole screen
  mesh.renderOrder = 1; // over the ground grid

  const put = (v: Vector4, a: ArrayLike<number>, at = 0) => v.set(a[at], a[at + 1] ?? 0, a[at + 2] ?? 0, d > 3 ? a[at + 3] : 0);

  return {
    mesh,
    update(camera: PerspectiveCamera, view: MarchView) {
      const { pos } = world;
      const lo = u.uLo.value.setScalar(Infinity), hi = u.uHi.value.setScalar(-Infinity);
      const hold = (c: Vector4, x: number, y = x, z = x) => {
        lo.set(Math.min(lo.x, c.x - x), Math.min(lo.y, c.y - y), Math.min(lo.z, c.z - z));
        hi.set(Math.max(hi.x, c.x + x), Math.max(hi.y, c.y + y), Math.max(hi.z, c.z + z));
      };
      balls.forEach((i, n) => hold(put(u.uBall.value[n], pos, i * d), radius[i]));
      rods.forEach(({ i, j }, n) => {
        put(u.uRodA.value[n], pos, i * d); // inside the box already: both ends are balls
        put(u.uRodB.value[n], pos, j * d);
      });
      boxes.forEach(({ min, max }, n) => {
        const half = put(u.uBoxH.value[n], min.map((x, c) => (max[c] - x) / 2));
        hold(put(u.uBoxC.value[n], min.map((x, c) => (x + max[c]) / 2)), half.x, half.y, half.z);
      });

      const pose = bodyPose(world, creature), turn = u.uTurn.value.identity().elements;
      // pose.rotation is row-major and maps rest to world; read as column-major it is the transpose, world to rest.
      for (let r = 0; r < d; r++) for (let c = 0; c < d; c++) turn[r * 4 + c] = pose.rotation[r * d + c];
      hold(put(u.uAt.value, pose.centre), u.uBody.value.x + u.uBody.value.y);

      u.uSelf.value = +view.self;
      u.uReach.value = view.reach;
      u.uGhost.value = view.reach < 3 && !view.strip ? 0.2 : 1;
      // Depth is ink fading into the paper. A line-eye has no other depth cue, so it gets the most.
      u.uFog.value = view.strip ? 0.3 : view.self ? 0.02 : 0.1;
      u.uGaze.value = view.strip?.gaze ?? 0;
      u.uFov.value = view.strip?.fov ?? 0;
      if (!view.strip) u.uBand.value.set(0, 0);
      else u.uBand.value.set(view.strip.fov ? 0.92 : 0.1 / camera.aspect, 0.1); // one pixel is shown as a square
    },
  };
}
