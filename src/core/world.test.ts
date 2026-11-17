import { describe, expect, it } from 'vitest';
import { STEP } from '../contracts';
import { Rng } from './rng';
import { World } from './world';

const DIMS = [1, 2, 3, 4];

function momentum(w: World): Float64Array {
  const p = new Float64Array(w.dim);
  for (let i = 0; i < w.count; i++) for (let c = 0; c < w.dim; c++) p[c] += w.mass[i] * w.vel[i * w.dim + c];
  return p;
}

function vec(w: World, arr: Float64Array, i: number): Float64Array {
  return arr.slice(i * w.dim, (i + 1) * w.dim);
}

function norm(v: ArrayLike<number>): number {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  return Math.sqrt(s);
}

/** Random non-overlapping balls in [-half, half]^dim. */
function scatter(w: World, rng: Rng, count: number, half: number, radius: number, speed: number, inward: number): void {
  const d = w.dim, placed: Float64Array[] = [];
  while (placed.length < count) {
    const p = Float64Array.from({ length: d }, () => (2 * rng.next() - 1) * half);
    if (placed.some((q) => norm(p.map((x, c) => x - q[c])) < 2 * radius * 1.05)) continue;
    placed.push(p);
    const v = p.map((x) => (2 * rng.next() - 1) * speed - inward * x);
    w.addParticle(p, v, 0.5 + 1.5 * rng.next(), radius);
  }
}

describe('rng', () => {
  it('is reproducible and uniform on [0, 1)', () => {
    const a = new Rng(42), b = new Rng(42);
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
      const x = a.next();
      expect(x).toBe(b.next());
      expect(x >= 0 && x < 1).toBe(true);
      sum += x;
    }
    expect(Math.abs(sum / 10000 - 0.5)).toBeLessThan(0.01);
  });
});

describe('conservation in free flight and elastic collisions', () => {
  for (const dim of DIMS) {
    it(`dim ${dim}: momentum to 1e-13 of Σm|v|, energy to 1e-12`, () => {
      const w = new World(dim);
      scatter(w, new Rng(7 + dim), 10, dim === 1 ? 6 : 1.2, 0.25, 0.3, 1);
      const p0 = momentum(w), e0 = w.energy();
      let scale = 0;
      for (let k = 0; k < w.vel.length; k++) scale += w.mass[Math.floor(k / dim)] * Math.abs(w.vel[k]);
      let hits = 0, prev = w.vel.slice(), maxDp = 0, maxDe = 0;
      for (let s = 0; s < 600; s++) {
        w.step();
        if (w.vel.some((v, k) => v !== prev[k])) hits++; // no forces: velocity changes only in a collision
        prev = w.vel.slice();
        const p = momentum(w);
        maxDp = Math.max(maxDp, norm(p.map((x, c) => x - p0[c])) / scale);
        maxDe = Math.max(maxDe, Math.abs(w.energy() - e0) / e0);
      }
      console.log(`elastic dim ${dim}: ${hits} collision steps, |dP|/Σm|v| ${maxDp.toExponential(1)}, dE/E ${maxDe.toExponential(1)}`);
      expect(hits).toBeGreaterThanOrEqual(3);
      expect(maxDp).toBeLessThan(1e-13);
      expect(maxDe).toBeLessThan(1e-12);
    });
  }
});

describe('free fall', () => {
  for (const dim of DIMS) {
    it(`dim ${dim}: matches x0 + v0 t + g t²/2 to 1e-12`, () => {
      const w = new World(dim);
      w.gravity[Math.min(1, dim - 1)] = -9.81;
      const x0 = Float64Array.from({ length: dim }, (_, c) => c + 1), v0 = Float64Array.from({ length: dim }, (_, c) => 3 - c);
      w.addParticle(x0, v0, 2, 0.1);
      for (let s = 0; s < 120; s++) w.step();
      const t = 120 * STEP;
      for (let c = 0; c < dim; c++) {
        expect(Math.abs(w.pos[c] - (x0[c] + v0[c] * t + 0.5 * w.gravity[c] * t * t))).toBeLessThan(1e-12);
        expect(Math.abs(w.vel[c] - (v0[c] + w.gravity[c] * t))).toBeLessThan(1e-12);
      }
    });
  }
});

describe('Gauss-law point-source force', () => {
  for (const dim of DIMS) {
    it(`dim ${dim}: measured force ∝ 1/r^${dim - 1} to 1e-5`, () => {
      for (const r of [0.5, 1, 2, 4, 8]) {
        const w = new World(dim);
        w.G = 1e-3; // weak, so the probe barely moves during the measuring step
        const dir = new Float64Array(dim).fill(1 / Math.sqrt(dim));
        w.addParticle(new Float64Array(dim), new Float64Array(dim), 1, 0);
        w.addParticle(dir.map((x) => x * r), new Float64Array(dim), 1e-9, 0);
        w.step();
        const v = vec(w, w.vel, 1);
        const a = -v.reduce((s, x, c) => s + x * dir[c], 0) / STEP; // toward the source
        expect(norm(v.map((x, c) => x + a * STEP * dir[c]))).toBeLessThan(1e-12 * a * STEP); // pointing at the source
        expect(Math.abs((a / w.G) * r ** (dim - 1) - 1)).toBeLessThan(1e-5);
      }
    });
  }
});

/** Two-body orbit: star M=1, planet m=1e-3, G=1, at distance 1 with the circular speed times (1 + kick). */
function orbit(dim: number, kick: number): World {
  const w = new World(dim);
  w.G = 1;
  const M = 1, m = 1e-3, mu = w.G * (M + m), v = Math.sqrt(mu) * (1 + kick); // circular speed at r = 1 is √μ in every dim
  const zero = new Float64Array(dim), at = (x: number, vy: number) => [Float64Array.from(zero, (_, c) => (c === 0 ? x : 0)), Float64Array.from(zero, (_, c) => (c === 1 ? vy : 0))];
  const [ps, vs] = at(-m / (M + m), (-v * m) / (M + m)), [pp, vp] = at(M / (M + m), (v * M) / (M + m));
  w.addParticle(ps, vs, M, 0.05);
  w.addParticle(pp, vp, m, 0.01);
  return w;
}

function separation(w: World): number {
  return norm(vec(w, w.pos, 1).map((x, c) => x - w.pos[c]));
}

describe('orbits under the Gauss-law force', () => {
  it('dim 3: a 1% kick stays in a narrow band for 100 orbits with tiny energy drift', () => {
    const w = orbit(3, 0.01), e0 = w.energy();
    let rMin = Infinity, rMax = 0, maxDe = 0, laps = 0, prevY = 0;
    const steps = Math.ceil((100 * 2 * Math.PI * 1.0205 ** 1.5) / STEP) + 600; // 100 periods of the kicked orbit (a = 1.0205)
    for (let s = 0; s < steps; s++) {
      w.step();
      const r = separation(w), y = w.pos[w.dim + 1] - w.pos[1];
      rMin = Math.min(rMin, r);
      rMax = Math.max(rMax, r);
      if (prevY < 0 && y >= 0) laps++;
      prevY = y;
      if (s % 100 === 0) maxDe = Math.max(maxDe, Math.abs((w.energy() - e0) / e0));
    }
    // Kepler: r from 1 to a(1 + e) = 1.0410 for this kick.
    console.log(`orbit dim 3: ${laps} laps, r in [${rMin.toFixed(5)}, ${rMax.toFixed(5)}], dE/E ${maxDe.toExponential(1)}`);
    expect(laps).toBeGreaterThanOrEqual(100);
    expect(rMin).toBeGreaterThan(0.999);
    expect(rMax).toBeLessThan(1.042);
    expect(maxDe).toBeLessThan(1e-6);
  });

  it('dim 4: a ±1% kick departs, following the exact r(t)² = 1 + (L² − μ)t²', () => {
    for (const kick of [0.01, -0.01]) {
      const w = orbit(4, kick), mu = w.G * 1.001, L2 = mu * (1 + kick) ** 2;
      // In 4D the 1/r³ force and the centrifugal term both scale as 1/r³, so r'' = (L² − μ)/r³ exactly.
      const t = 6;
      for (let s = 0; s < Math.round(t / STEP); s++) w.step();
      const expected = Math.sqrt(1 + (L2 - mu) * t * t);
      console.log(`orbit dim 4, kick ${kick}: r(${t}) = ${separation(w).toFixed(6)}, exact ${expected.toFixed(6)}`);
      expect(Math.abs(separation(w) / expected - 1)).toBeLessThan(1e-4);
      for (let s = 0; s < Math.round(20 / STEP) && separation(w) > 0.3 && separation(w) < 3; s++) w.step();
      if (kick > 0) expect(separation(w)).toBeGreaterThan(3);
      else expect(separation(w)).toBeLessThan(0.3);
    }
  });

  it('dim 2: doubling the circular speed still leaves the orbit bound', () => {
    const w = orbit(2, 1), e0 = w.energy();
    // Turning points of the relative motion: L²/(2r²) + μ ln r = E with L = 2√μ, E = 2μ (from r = 1).
    let lo = 2, hi = 20;
    for (let k = 0; k < 100; k++) {
      const r = (lo + hi) / 2;
      if (2 / (r * r) + Math.log(r) < 2) lo = r;
      else hi = r;
    }
    let rMax = 0, rMinLate = Infinity, maxDe = 0;
    const steps = Math.round(400 / STEP);
    for (let s = 0; s < steps; s++) {
      w.step();
      const r = separation(w);
      rMax = Math.max(rMax, r);
      if (s > steps / 2) rMinLate = Math.min(rMinLate, r);
      if (s % 100 === 0) maxDe = Math.max(maxDe, Math.abs((w.energy() - e0) / e0));
    }
    console.log(`orbit dim 2: r max ${rMax.toFixed(4)} (exact ${lo.toFixed(4)}), late r min ${rMinLate.toFixed(4)}, dE/E ${maxDe.toExponential(1)}`);
    expect(Math.abs(rMax / lo - 1)).toBeLessThan(1e-3);
    expect(rMinLate).toBeLessThan(1.01); // still coming back in after 400 s
    expect(maxDe).toBeLessThan(1e-5);
  });
});

describe('smoke tests, dim 5 to 10', () => {
  for (const dim of [5, 6, 7, 8, 9, 10]) {
    it(`dim ${dim}: 20 balls in a closed box with gravity for 1000 steps: finite, energy bounded`, () => {
      const w = new World(dim);
      w.gravity[1] = -9.81;
      for (let c = 0; c < dim; c++) {
        const n = new Float64Array(dim);
        n[c] = 1;
        w.addPlane(n, -2);
        n[c] = -1;
        w.addPlane(n, -2);
      }
      scatter(w, new Rng(dim), 20, 1.6, 0.3, 2, 0);
      const e0 = w.energy();
      let maxDe = 0;
      for (let s = 0; s < 1000; s++) {
        w.step();
        maxDe = Math.max(maxDe, Math.abs(w.energy() - e0) / Math.abs(e0));
      }
      console.log(`dim ${dim} box: dE/E ${maxDe.toExponential(2)}`);
      expect(w.pos.every(Number.isFinite) && w.vel.every(Number.isFinite)).toBe(true);
      for (let i = 0; i < w.count; i++) for (let c = 0; c < dim; c++) expect(Math.abs(w.pos[i * dim + c])).toBeLessThan(2);
      expect(maxDe).toBeLessThan(0.01);
    });
  }
});

describe('springs', () => {
  for (const dim of DIMS) {
    it(`dim ${dim}: two masses oscillate with period 2π√(m_reduced/k) and keep their energy`, () => {
      const w = new World(dim), k = 50, m1 = 1, m2 = 2, L = 1, stretch = 0.2;
      const dir = new Float64Array(dim).fill(1 / Math.sqrt(dim)), zero = new Float64Array(dim);
      w.addParticle(zero, zero, m1, 0);
      w.addParticle(dir.map((x) => x * (L + stretch)), zero, m2, 0);
      w.addSpring(0, 1, k, L);
      const mr = (m1 * m2) / (m1 + m2), T = 2 * Math.PI * Math.sqrt(mr / k), e0 = w.energy();
      const crossings: number[] = [];
      let prev = stretch, maxDe = 0;
      for (let s = 1; crossings.length < 21; s++) {
        w.step();
        const x = Math.sqrt(w.pos.slice(dim, 2 * dim).reduce((a, p, c) => a + (p - w.pos[c]) ** 2, 0)) - L;
        if (prev > 0 !== x > 0) crossings.push((s - 1 + prev / (prev - x)) * STEP); // linear interpolation
        prev = x;
        maxDe = Math.max(maxDe, Math.abs(w.energy() - e0) / e0);
      }
      const measured = (crossings[20] - crossings[0]) / 10;
      console.log(`spring dim ${dim}: period ${measured.toFixed(7)} s (exact ${T.toFixed(7)}), dE/E ${maxDe.toExponential(1)}`);
      expect(Math.abs(measured / T - 1)).toBeLessThan(1e-4);
      expect(maxDe).toBeLessThan(1e-4);
      expect(Math.abs(momentum(w).reduce((a, p) => a + p * p, 0))).toBeLessThan(1e-24); // internal force only
    });
  }

  it('addSpring rejects bad input like addLink does', () => {
    const w = new World(2);
    w.addParticle([0, 0], [0, 0], 1, 0);
    w.addParticle([1, 0], [0, 0], 1, 0);
    for (const [i, j, k, L] of [
      [0, 2, 1, 1], [-1, 1, 1, 1], [0.5, 1, 1, 1], [0, 0, 1, 1],
      [0, 1, -1, 1], [0, 1, NaN, 1], [0, 1, Infinity, 1], [0, 1, 1, -1], [0, 1, 1, NaN],
    ]) expect(() => w.addSpring(i, j, k, L)).toThrow();
    expect(() => w.addLink(0, 5)).toThrow();
    w.addSpring(0, 1, 0, 0); // zero stiffness and zero rest length are legitimate
    expect(w.springs.length).toBe(1);
  });
});

describe('Gauss-law potential in energy() matches the force', () => {
  for (const dim of [1, 2, 3, 4, 5]) {
    it(`dim ${dim}: −dU/dr equals the force stepped by the engine, apart and overlapping, to 1e-5`, () => {
      // Radii sum to 0.5, so r = 0.3 is the overlapping branch (force held at its contact value).
      for (const r of [0.3, 0.7, 1.5, 3]) {
        const make = (x: number) => {
          const w = new World(dim);
          w.G = 1e-3;
          const zero = new Float64Array(dim), at = Float64Array.from(zero, (_, c) => (c === 0 ? x : 0));
          w.addParticle(zero, zero, 2, 0.3);
          w.addParticle(at, zero, 1e-9, 0.2);
          w.body[0] = w.body[1] = 0; // same body: they attract but never collide, so the overlap branch is reachable
          return w;
        };
        const dr = 1e-6 * r, slope = (make(r + dr).energy() - make(r - dr).energy()) / (2 * dr);
        const w = make(r);
        w.step();
        const force = (-w.vel[dim] / STEP) * w.mass[1]; // toward the source, as measured
        expect(Math.abs(force / slope - 1)).toBeLessThan(1e-5);
      }
    });
  }
});

describe('bouncing under gravity (e = 1)', () => {
  for (const dim of DIMS) {
    it(`dim ${dim}: a ball bouncing on the floor for 1000 steps keeps its energy to 2e-5`, () => {
      const w = new World(dim), up = new Float64Array(dim), axis = Math.min(1, dim - 1);
      w.gravity[axis] = -9.81;
      up[axis] = 1;
      w.addPlane(up, -2);
      const p = new Float64Array(dim), v = new Float64Array(dim);
      p[axis] = 1.2345;
      if (dim > 1) v[0] = 1.3;
      w.addParticle(p, v, 1, 0.3);
      const e0 = w.energy();
      let maxDe = 0, bounces = 0, prev = 0;
      for (let s = 0; s < 1000; s++) {
        w.step();
        if (prev < 0 && w.vel[axis] > 0) bounces++;
        prev = w.vel[axis];
        maxDe = Math.max(maxDe, Math.abs(w.energy() - e0) / e0);
      }
      console.log(`bounce dim ${dim}: ${bounces} bounces, dE/E ${maxDe.toExponential(1)}`);
      expect(bounces).toBeGreaterThanOrEqual(5);
      expect(maxDe).toBeLessThan(2e-5);
    });
  }
});

/** Box [-1,1]^dim, one ball (r = 0.2) aimed at the feature whose outward normal is n, through the point q. */
function boxShot(dim: number, q: number[], tangent: number[]) {
  const w = new World(dim), r = 0.2;
  w.addBox(new Float64Array(dim).fill(-1), new Float64Array(dim).fill(1));
  const nn = Math.sqrt(q.reduce((s, x, c) => s + (Math.abs(x) === 1 ? 1 : 0), 0));
  const n = q.map((x) => (Math.abs(x) === 1 ? x / nn : 0));
  const v = n.map((x, c) => -2 * x + tangent[c]);
  const start = q.map((x, c) => x + (r + 0.5) * n[c]); // touches after 0.25 s
  w.addParticle(start, v, 1, r);
  const e0 = w.energy(), T = 120 * STEP;
  for (let s = 0; s < 120; s++) w.step();
  const vn = v.reduce((s, x, c) => s + x * n[c], 0), vOut = v.map((x, c) => x - 2 * vn * n[c]);
  const hit = start.map((x, c) => x + 0.25 * v[c]), xOut = hit.map((x, c) => x + (T - 0.25) * vOut[c]);
  return { w, e0, vOut, xOut };
}

describe('ball against a static box (e = 1)', () => {
  for (const dim of [2, 3, 4]) {
    const zeros = () => new Array(dim).fill(0);
    const along = (k: number) => zeros().map((_, c) => (c === k ? 0.7 : 0));
    const cases: [string, number[], number[]][] = [
      ['face', zeros().map((_, c) => (c === 0 ? 1 : 0.3 * (c === 1 ? 1 : 0))), along(1)],
      ['corner', zeros().map(() => 1), zeros()],
    ];
    if (dim >= 3) cases.splice(1, 0, ['edge', zeros().map((_, c) => (c < 2 ? 1 : 0)), along(2)]);
    for (const [name, q, tangent] of cases) {
      it(`dim ${dim} ${name}: reflects about the right normal, keeps energy, follows the reflected path`, () => {
        const { w, e0, vOut, xOut } = boxShot(dim, q, tangent);
        const dv = Math.max(...vOut.map((x, c) => Math.abs(w.vel[c] - x))), dx = Math.max(...xOut.map((x, c) => Math.abs(w.pos[c] - x)));
        console.log(`box dim ${dim} ${name}: |dv| ${dv.toExponential(1)}, |dx| ${dx.toExponential(1)}, dE/E ${(Math.abs(w.energy() - e0) / e0).toExponential(1)}`);
        expect(dv).toBeLessThan(1e-12);
        expect(dx).toBeLessThan(1e-9);
        expect(Math.abs(w.energy() - e0) / e0).toBeLessThan(1e-12);
      });
    }
    it(`dim ${dim}: a ball whose centre starts inside leaves through the nearest face, without being launched`, () => {
      const w = new World(dim), start = zeros().map((_, c) => [0.7, 0.1, -0.2, 0.4][c]);
      w.addBox(new Float64Array(dim).fill(-1), new Float64Array(dim).fill(1));
      w.addParticle(start, new Float64Array(dim), 1, 0.2);
      for (let s = 0; s < 120; s++) w.step();
      const speed = Math.sqrt(w.vel.reduce((s, v) => s + v * v, 0));
      console.log(`box dim ${dim} inside: x ${w.pos[0]}, speed ${speed.toExponential(1)}`);
      expect(w.pos[0]).toBeCloseTo(1.2, 9); // out through +x, the nearest face (depth 0.3)
      for (let c = 1; c < dim; c++) expect(w.pos[c]).toBe(start[c]);
      expect(speed).toBeLessThan(1e-9); // overlap is removed, not turned into kinetic energy
    });
  }
});

describe('Coulomb friction', () => {
  for (const e of [0, 0.5]) {
    it(`e = ${e}: a ball sliding on the ground stops after v²/(2μg) in v/(μg)`, () => {
      const dim = 3, w = new World(dim), mu = 0.5, g = 9.81, v0 = 3;
      w.gravity[1] = -g;
      w.friction = mu;
      w.restitution = e;
      w.addPlane([0, 1, 0], 0);
      w.addParticle([0, 0.1, 0], [v0, 0, 0], 1, 0.1); // set down touching the ground
      let stopped = -1;
      for (let s = 1; s <= 240 && stopped < 0; s++) {
        w.step();
        if (w.vel[0] === 0) stopped = s;
      }
      for (let s = 0; s < 120; s++) w.step();
      const tStop = v0 / (mu * g), dStop = (v0 * v0) / (2 * mu * g);
      console.log(`friction e=${e}: stop at ${(stopped * STEP).toFixed(4)} s (exact ${tStop.toFixed(4)}), distance ${w.pos[0].toFixed(5)} (exact ${dStop.toFixed(5)}), height ${w.pos[1]}`);
      expect(Math.abs(stopped * STEP - tStop)).toBeLessThanOrEqual(STEP);
      expect(Math.abs(w.pos[0] / dStop - 1)).toBeLessThan(1e-5);
      expect(w.vel[1]).toBe(0); // resting contact reports exactly zero normal speed
      expect(Math.abs(w.pos[1] - 0.1)).toBeLessThan(1e-4); // on the ground, not bouncing
    });
  }

  it('on an incline it stays put below the friction angle and slides at g(sinθ − μcosθ) above it', () => {
    const mu = 0.5, g = 9.81, T = 2; // friction angle atan(0.5) = 26.6°
    for (const deg of [20, 26, 27, 33]) {
      const th = (deg * Math.PI) / 180, n = [-Math.sin(th), Math.cos(th), 0], down = [-Math.cos(th), -Math.sin(th), 0];
      const w = new World(3);
      w.gravity[1] = -g;
      w.friction = mu;
      w.restitution = 0;
      w.addPlane(n, 0);
      w.addParticle(n.map((x) => 0.1 * x), [0, 0, 0], 1, 0.1);
      const x0 = w.pos.slice(0, 3);
      for (let s = 0; s < Math.round(T / STEP); s++) w.step();
      const slid = w.pos.slice(0, 3).reduce((s, x, c) => s + (x - x0[c]) * down[c], 0);
      const expected = Math.max(0, 0.5 * g * (Math.sin(th) - mu * Math.cos(th)) * T * T);
      console.log(`incline ${deg}°: slid ${slid.toExponential(3)} m, exact ${expected.toExponential(3)}`);
      if (expected === 0) expect(Math.abs(slid)).toBeLessThan(1e-9);
      else expect(Math.abs(slid / expected - 1)).toBeLessThan(1e-5);
    }
  });
});
