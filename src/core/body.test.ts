import { describe, expect, it } from 'vitest';
import { STEP } from '../contracts';
import { applyIntent, bodyPose, createCreature, type Body } from './body';
import { Rng } from './rng';
import { World } from './world';

/** All n(n-1)/2 components L_ab = Σ m (x_a v_b − x_b v_a). */
function angularMomentum(w: World): number[] {
  const d = w.dim, L: number[] = [];
  for (let a = 0; a < d; a++) {
    for (let b = a + 1; b < d; b++) {
      let s = 0;
      for (let i = 0; i < w.count; i++) s += w.mass[i] * (w.pos[i * d + a] * w.vel[i * d + b] - w.pos[i * d + b] * w.vel[i * d + a]);
      L.push(s);
    }
  }
  return L;
}

/** Matrix exponential of a dim×dim row-major matrix by scaling and squaring a Taylor series. */
function expm(A: Float64Array, d: number): Float64Array {
  const mul = (X: Float64Array, Y: Float64Array) => {
    const Z = new Float64Array(d * d);
    for (let a = 0; a < d; a++) for (let b = 0; b < d; b++) for (let k = 0; k < d; k++) Z[a * d + b] += X[a * d + k] * Y[k * d + b];
    return Z;
  };
  const S = A.map((x) => x / 1024);
  let E = new Float64Array(d * d), term = new Float64Array(d * d);
  for (let a = 0; a < d; a++) E[a * d + a] = term[a * d + a] = 1;
  for (let k = 1; k < 20; k++) {
    term = mul(term, S).map((x) => x / k);
    E = E.map((x, i) => x + term[i]);
  }
  for (let k = 0; k < 10; k++) E = mul(E, E);
  return E;
}

/** A free creature at the origin moving with v_i = Ω·r_i + V (Ω antisymmetric). */
function spinning(dim: number, omega: Float64Array, V: number[]): { w: World; body: Body } {
  const w = new World(dim), body = createCreature(w, new Float64Array(dim), 1, 2 * dim + 1, 0);
  for (const p of body.particles) {
    for (let a = 0; a < dim; a++) {
      let s = V[a];
      for (let b = 0; b < dim; b++) s += omega[a * dim + b] * w.pos[p * dim + b];
      w.vel[p * dim + a] = s;
    }
  }
  return { w, body };
}

function maxAbsDiff(a: ArrayLike<number>, b: ArrayLike<number>): number {
  let m = 0;
  for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - b[i]));
  return m;
}

function checkRigidRotation(dim: number, planes: [number, number, number][], V: number[]) {
  const omega = new Float64Array(dim * dim);
  for (const [a, b, rate] of planes) {
    omega[a * dim + b] = -rate;
    omega[b * dim + a] = rate;
  }
  const { w, body } = spinning(dim, omega, V), L0 = angularMomentum(w), e0 = w.energy();
  const Lscale = Math.max(...L0.map(Math.abs));
  let maxDL = 0, maxOrtho = 0, maxLink = 0;
  const steps = 1200;
  for (let s = 0; s < steps; s++) {
    w.step();
    maxDL = Math.max(maxDL, maxAbsDiff(angularMomentum(w), L0) / Lscale); // about the fixed origin, so the drift V is included
    const R = bodyPose(w, body).rotation;
    for (let a = 0; a < dim; a++) {
      for (let b = 0; b < dim; b++) {
        let s2 = 0;
        for (let k = 0; k < dim; k++) s2 += R[k * dim + a] * R[k * dim + b];
        maxOrtho = Math.max(maxOrtho, Math.abs(s2 - (a === b ? 1 : 0)));
      }
    }
    for (const { i, j, length } of w.links) {
      let s2 = 0;
      for (let c = 0; c < dim; c++) s2 += (w.pos[i * dim + c] - w.pos[j * dim + c]) ** 2;
      maxLink = Math.max(maxLink, Math.abs(Math.sqrt(s2) / length - 1));
    }
  }
  const t = steps * STEP, pose = bodyPose(w, body);
  const rotErr = maxAbsDiff(pose.rotation, expm(omega.map((x) => x * t), dim));
  const centreErr = maxAbsDiff(pose.centre, V.map((v) => v * t));
  const dE = Math.abs(w.energy() - e0) / e0;
  return { L0, maxDL, maxOrtho, maxLink, rotErr, centreErr, dE };
}

// Every link correction conserves L exactly in exact arithmetic; what remains is rounding,
// amplified because velocity is re-derived from positions (|x| / (h·|v|) is ~1e3 here).
// The pose is compared with exp(Ωt): the 16-cell and octahedron are isotropic, so Ω stays constant.
describe('rigid body', () => {
  it('dim 3: conserves all 3 angular-momentum components; pose stays orthonormal and matches exp(Ωt)', () => {
    const r = checkRigidRotation(3, [[0, 1, 1.3], [0, 2, -0.7], [1, 2, 2.1]], [0.3, -0.2, 0.5]);
    console.log('rigid dim 3:', r);
    expect(r.L0.length).toBe(3);
    expect(r.maxDL).toBeLessThan(1e-9);
    expect(r.maxOrtho).toBeLessThan(1e-12);
    expect(r.maxLink).toBeLessThan(1e-6);
    expect(r.rotErr).toBeLessThan(1e-4);
    expect(r.centreErr).toBeLessThan(1e-10);
    expect(r.dE).toBeLessThan(1e-5);
  });

  it('dim 4: a double rotation (xy and zw at once) conserves all 6 components', () => {
    const r = checkRigidRotation(4, [[0, 1, 1.0], [2, 3, 2.7]], [0.1, 0.2, -0.3, 0.4]);
    console.log('rigid dim 4:', r);
    expect(r.L0.length).toBe(6);
    expect(Math.abs(r.L0[0]) > 1 && Math.abs(r.L0[5]) > 1).toBe(true); // spinning in both planes
    expect(r.maxDL).toBeLessThan(1e-9);
    expect(r.maxOrtho).toBeLessThan(1e-12);
    expect(r.maxLink).toBeLessThan(1e-6);
    expect(r.rotErr).toBeLessThan(1e-4);
    expect(r.centreErr).toBeLessThan(1e-10);
    expect(r.dE).toBeLessThan(1e-5);
  });
});

describe('creature', () => {
  for (const dim of [2, 3, 4]) {
    it(`dim ${dim}: dropped with a slight spin, it tips onto a facet and stays put`, () => {
      const w = new World(dim);
      w.gravity[1] = -9.81;
      w.restitution = 0.3;
      w.friction = 0.8;
      const up = new Float64Array(dim);
      up[1] = 1;
      w.addPlane(up, 0);
      const start = new Float64Array(dim);
      start[1] = 2;
      const body = createCreature(w, start, 0.5, 1, 0.1);
      for (const p of body.particles) w.vel[p * dim] = -0.5 * (w.pos[p * dim + 1] - 2); // 0.5 rad/s in the xy plane
      for (let s = 0; s < 960; s++) w.step();
      const c1 = bodyPose(w, body).centre;
      for (let s = 0; s < 120; s++) w.step();
      const c2 = bodyPose(w, body).centre, drift = Math.max(...c2.map((x, c) => Math.abs(x - c1[c])));
      // Resting on a facet of the cross-polytope: centre height = size/√dim + vertex radius.
      const facet = 0.5 / Math.sqrt(dim) + 0.1;
      console.log(`creature dim ${dim}: centre height ${c2[1].toFixed(6)} (facet ${facet.toFixed(6)}), drift in last second ${drift.toExponential(1)}`);
      expect(Math.abs(c2[1] - facet)).toBeLessThan(1e-4);
      expect(drift).toBeLessThan(1e-5);
    });
  }
});

describe('body restitution', () => {
  // Dropped vertex-down, the contact impulse passes through the centre of mass, so a rigid
  // body should bounce exactly like a ball: apex height above resting = e² × drop height.
  for (const dim of [2, 3, 4]) {
    it(`dim ${dim}: a creature dropped onto a vertex bounces back at 0.99–1.0 × e`, () => {
      for (const e of [0.5, 1]) {
        const w = new World(dim);
        w.gravity[1] = -9.81;
        w.restitution = e;
        const up = new Float64Array(dim);
        up[1] = 1;
        w.addPlane(up, 0);
        const start = new Float64Array(dim);
        start[1] = 1.5;
        const body = createCreature(w, start, 0.5, 1, 0.1), rest = 0.6; // size + vertex radius
        let falling = true, apex = 0;
        for (let s = 0; s < 120; s++) {
          w.step();
          const y = bodyPose(w, body).centre[1];
          if (falling && y < rest + 0.05) falling = false;
          if (!falling) apex = Math.max(apex, y);
        }
        const eff = Math.sqrt((apex - rest) / (1.5 - rest));
        console.log(`body restitution dim ${dim}, e ${e}: effective ${eff.toFixed(4)} (${(eff / e).toFixed(4)} × e)`);
        expect(eff / e).toBeGreaterThan(0.99); // measured 0.993–0.998
        expect(eff / e).toBeLessThanOrEqual(1);
      }
    });
  }
});

/**
 * A creature lying on a facet on flat ground (y = 0): the cross-polytope is reflected so its
 * facet {−s·e_k} faces straight down (a reflection keeps every link length). Its centre then
 * sits at size/√dim + radius. Tilting gravity by θ toward +x is the same physics as an
 * incline of angle θ (the engine has no preferred direction apart from axis-aligned boxes).
 */
function lyingCreature(dim: number, mu: number, thetaDeg: number, drop = 0) {
  const w = new World(dim), size = 0.5, radius = 0.1, th = (thetaDeg * Math.PI) / 180;
  w.friction = mu;
  w.restitution = 0;
  w.gravity[0] = 9.81 * Math.sin(th);
  w.gravity[1] = -9.81 * Math.cos(th);
  const up = new Float64Array(dim);
  up[1] = 1;
  w.addPlane(up, 0);
  const body = createCreature(w, new Float64Array(dim), size, 1, radius);
  const v = Float64Array.from({ length: dim }, (_, k) => -1 / Math.sqrt(dim) + (k === 1 ? 1 : 0)); // p − q, p = −(1,..,1)/√dim, q = −e_y
  const vv = v.reduce((s, x) => s + x * x, 0), rest = size / Math.sqrt(dim) + radius;
  for (const p of body.particles) {
    const o = w.pos.slice(p * dim, (p + 1) * dim), vo = o.reduce((s, x, k) => s + x * v[k], 0);
    for (let k = 0; k < dim; k++) w.pos[p * dim + k] = o[k] - (2 * v[k] * vo) / vv + (k === 1 ? rest + drop : 0);
  }
  return { w, body, rest, g: 9.81, th };
}

describe('friction on a linked body', () => {
  // mu = 0.3: friction angle 16.7°. Tipping needs more than 45° (dim 2), 35.3° (dim 3) or 30°
  // (dim 4), even while sliding (that needs mu < tan of those), so the body never tumbles here.
  for (const dim of [2, 3, 4]) {
    it(`dim ${dim}: holds on a 12° slope and slides on a 25° one at g(sinθ − μcosθ), without tipping`, () => {
      for (const deg of [12, 25]) {
        const { w, body, rest, g, th } = lyingCreature(dim, 0.3, deg), T = 1;
        const p0 = bodyPose(w, body);
        for (let s = 0; s < Math.round(T / STEP); s++) w.step();
        const p1 = bodyPose(w, body), slid = p1.centre[0] - p0.centre[0];
        const expected = deg === 12 ? 0 : 0.5 * g * (Math.sin(th) - 0.3 * Math.cos(th)) * T * T;
        const turn = Math.max(...p1.rotation.map((x, k) => Math.abs(x - p0.rotation[k])));
        console.log(`body slope dim ${dim} ${deg}°: slid ${slid.toExponential(4)} (exact ${expected.toExponential(4)}), height ${(p1.centre[1] - rest).toExponential(1)}, turn ${turn.toExponential(1)}`);
        if (expected === 0) expect(Math.abs(slid)).toBeLessThan(1e-6);
        else expect(Math.abs(slid / expected - 1)).toBeLessThan(1e-3);
        expect(Math.abs(p1.centre[1] - rest)).toBeLessThan(1e-5); // still lying on the facet
        expect(turn).toBeLessThan(1e-4); // not tipping
      }
    });

    it(`dim ${dim}: sliding on flat ground it stops after v²/(2μg)`, () => {
      const { w, body } = lyingCreature(dim, 0.3, 0), v0 = 2, g = 9.81;
      for (const p of body.particles) w.vel[p * dim] = v0;
      const x0 = bodyPose(w, body).centre[0];
      for (let s = 0; s < 120; s++) w.step();
      const slid = bodyPose(w, body).centre[0] - x0, exact = (v0 * v0) / (2 * 0.3 * g);
      console.log(`body slide dim ${dim}: ${slid.toFixed(6)} m (exact ${exact.toFixed(6)})`);
      expect(Math.abs(slid / exact - 1)).toBeLessThan(1e-3);
    });

    it(`dim ${dim}: landing flat on a facet (e = 0, ${dim} vertices at once) it stops without gaining energy`, () => {
      const { w, body, rest } = lyingCreature(dim, 0.5, 0, 0.3);
      for (const p of body.particles) w.vel[p * dim] = 0.5; // some sideways motion for friction to remove
      const e0 = w.energy();
      let e = e0, maxRise = 0;
      for (let s = 0; s < 240; s++) {
        w.step();
        maxRise = Math.max(maxRise, w.energy() - e);
        e = w.energy();
      }
      const centre = bodyPose(w, body).centre, speed = Math.sqrt(w.vel.reduce((s, v) => s + v * v, 0));
      const restEnergy = 9.81 * rest; // mass 1 resting on the facet: all motion gone, only m·g·y left
      console.log(`body landing dim ${dim}: E ${e0.toFixed(4)} → ${e.toFixed(9)} J (resting ${restEnergy.toFixed(9)}), max rise per step ${maxRise.toExponential(1)} J, height ${(centre[1] - rest).toExponential(1)}, speed ${speed.toExponential(1)}`);
      expect(maxRise / e0).toBeLessThan(1e-8); // solver precision: measured at most 2e-9 of E, once, as it comes to rest
      expect(Math.abs(e / restEnergy - 1)).toBeLessThan(1e-5);
      expect(Math.abs(centre[1] - rest)).toBeLessThan(1e-5);
      expect(speed).toBeLessThan(1e-6);
    });
  }
});

describe('confinement ("one world, sliced")', () => {
  it('a confined creature never leaves its subspace; raising k frees the next direction', () => {
    const dim = 4, w = new World(dim);
    w.gravity[1] = -9.81;
    const up = new Float64Array(dim);
    up[1] = 1;
    w.addPlane(up, 0);
    const body = createCreature(w, [0, 0.6, 0.3, -0.2], 0.5, 1, 0.1);
    const run = (k: number, move: number[]) => {
      w.confine(body.particles, k);
      const before = w.pos.slice(), c0 = bodyPose(w, body).centre;
      for (let s = 0; s < 240; s++) {
        applyIntent(w, body, move, 3);
        w.step();
        for (const p of body.particles) for (let c = k; c < dim; c++) expect(w.pos[p * dim + c]).toBe(before[p * dim + c]);
      }
      for (const { i, j, length } of w.links) {
        let s2 = 0;
        for (let c = 0; c < dim; c++) s2 += (w.pos[i * dim + c] - w.pos[j * dim + c]) ** 2;
        expect(Math.abs(Math.sqrt(s2) / length - 1)).toBeLessThan(5e-4); // still rigid (measured peak 6.5e-5 while shoved along the ground)
      }
      return bodyPose(w, body).centre.map((x, c) => x - c0[c]);
    };
    // Frictionless ground and a uniform push of 3 m/s² for 2 s: the centre of mass must move
    // exactly as Newton says along every free axis, and not at all along frozen ones.
    const onLine = run(1, [1, 1, 1, 1]);
    expect(onLine[0]).toBeCloseTo(6, 6); // ½·3·2² from rest
    const onSheet = run(2, [-1, 0, 1, 1]);
    expect(onSheet[0]).toBeCloseTo(6, 6); // 6 m/s braked to rest: 6·2 − ½·3·2²
    const inRoom = run(3, [0, 0, 1, 1]);
    expect(inRoom[2]).toBeCloseTo(6, 6); // z is free now
    const everywhere = run(4, [0, 0, 0, 1]);
    expect(everywhere[3]).toBeCloseTo(6, 6); // and finally w
  });
});

describe('determinism', () => {
  function build(): { w: World; body: Body; moves: number[][] } {
    const dim = 4, w = new World(dim), rng = new Rng(2026);
    w.gravity[1] = -9.81;
    w.G = 0.05;
    w.restitution = 0.4;
    w.friction = 0.6;
    const up = new Float64Array(dim);
    up[1] = 1;
    w.addPlane(up, 0);
    w.addBox([1, 0, -1, -1], [2, 1, 1, 1]);
    const body = createCreature(w, [0, 1, 0, 0], 0.4, 2, 0.1);
    for (let i = 0; i < 12; i++) {
      const p = Float64Array.from({ length: dim }, () => 3 * rng.next() - 1.5);
      p[1] = 0.5 + 2 * rng.next();
      w.addParticle(p, Float64Array.from({ length: dim }, () => rng.next() - 0.5), 0.5 + rng.next(), 0.15);
    }
    w.addSpring(body.particles.length, body.particles.length + 1, 20, 0.5);
    w.confine(body.particles, 3);
    const moves = Array.from({ length: 600 }, () => [0, 1, 2, 3].map(() => 2 * rng.next() - 1));
    return { w, body, moves };
  }
  const bits = (a: Float64Array) => Array.from(new BigUint64Array(a.slice().buffer));

  it('two identical runs give bit-identical snapshots', () => {
    const runs = [build(), build()].map(({ w, body, moves }) => {
      for (const m of moves) {
        applyIntent(w, body, m, 4);
        w.step();
      }
      return w.snapshot();
    });
    expect(runs[0].every(Number.isFinite)).toBe(true);
    expect(bits(runs[0])).toEqual(bits(runs[1]));
  });

  it('restoring a snapshot replays the same future', () => {
    const { w, body, moves } = build();
    const go = (from: number, to: number) => {
      for (let s = from; s < to; s++) {
        applyIntent(w, body, moves[s], 4);
        w.step();
      }
    };
    go(0, 300);
    const mid = w.snapshot();
    go(300, 600);
    const first = w.snapshot();
    w.restore(mid);
    go(300, 600);
    expect(bits(w.snapshot())).toEqual(bits(first));
  });
});
