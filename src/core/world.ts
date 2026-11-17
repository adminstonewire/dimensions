import { STEP } from '../contracts';

// How a substep works, and why:
// - Störmer–Verlet (kick-drift-kick): symplectic, second order, and exact for constant
//   acceleration, so free fall lands on the analytic parabola.
// - Stiff links are distance constraints solved with SHAKE (Ryckaert et al. 1977),
//   iterated Gauss–Seidel the way PBD/XPBD does. Unlike plain XPBD, SHAKE pushes each
//   pair along the link as it was at the *start* of the substep. That keeps positions on
//   the symplectic SHAKE/RATTLE path and makes every correction conserve linear and every
//   component of angular momentum exactly, in any dimension, with no rotational maths.
// - Many substeps with few iterations, as XPBD recommends (Macklin et al. 2019, "Small
//   Steps"): substeps buy more accuracy per unit of work, and leftover error does not
//   pile up because every substep solves for the absolute link length again.
//   Approximation: links are not perfectly rigid. Measured strain: ~1e-7 for a free
//   spinning body, ~3e-6 for bodies piling into each other, and up to ~1e-4 for a moment
//   when a body is shoved along or slams into the ground.
// - Contacts are non-penetration constraints solved in the same loop, with time-of-impact
//   kinematics; then a velocity solve at the end of the substep (see solveVelocities) sets
//   bounces and applies Coulomb friction, together with the links of touched bodies so a
//   contact acts on the whole body. A two-ball hit with e = 1 gives the exact elastic result;
//   a creature dropped onto a vertex bounces back at 0.993–0.998 × e (measured from apex
//   height, dim 2–4, e = 0.5 and 1; it was 0.02–0.3 before body links joined this solve).
//   A linked body slides at g(sinθ − μcosθ) and stops after v²/(2μg) to 1e-5, and holds
//   below the friction angle to ~1e-8 m/s (measured, dim 2–4).
//   Approximations: contacts are found once per substep, so one created during the solve
//   waits for the next substep; time of impact assumes constant acceleration within a
//   substep; the velocity solve stops at VEL_TOL or MAX_VEL_ITERS.

/** Substeps per STEP. A ball moves v·STEP/8 per substep, so it cannot tunnel while that is below its radius. */
export const SUBSTEPS = 8;
const MAX_ITERS = 4;
/** Relative constraint error at which the position solve may stop early (free particles need zero iterations). */
const TOL = 1e-9;
// The velocity solve must carry an impulse through a whole body. Gauss–Seidel does that
// slowly from a cold start, so link impulses are warm-started from the last substep (a
// resting body then converges in ~2 passes); it stops once no correction exceeds VEL_TOL (m/s).
const MAX_VEL_ITERS = 64;
const VEL_TOL = 1e-6;

/** Solid half-space: points with x·normal < offset are inside the solid. */
export interface Plane {
  normal: Float64Array;
  offset: number;
}

/** Solid axis-aligned n-box. */
export interface Box {
  min: Float64Array;
  max: Float64Array;
}

export class World {
  readonly dim: number;
  readonly gravity: Float64Array;
  /** Gauss-law attraction between every pair: F = G·m_i·m_j / r^(dim-1). 0 switches it off. */
  G = 0;
  restitution = 1;
  friction = 0;
  /** Flat per-particle vectors: particle i occupies [i*dim, (i+1)*dim). */
  pos = new Float64Array(0);
  vel = new Float64Array(0);
  /** External force for the next step only (cleared after it), e.g. from applyIntent. */
  force = new Float64Array(0);
  readonly mass: number[] = [];
  readonly radius: number[] = [];
  /** Particle i moves only in its first free[i] coordinates; the rest are never written. */
  readonly free: number[] = [];
  /** Body id per particle (-1 = none). Particles of one body do not collide with each other. */
  readonly body: number[] = [];
  readonly links: { i: number; j: number; length: number }[] = [];
  readonly springs: { i: number; j: number; stiffness: number; length: number }[] = [];
  readonly planes: Plane[] = [];
  readonly boxes: Box[] = [];

  private acc = new Float64Array(0);
  private old = new Float64Array(0);
  /** Per contact (stride 7): kind (0 ball, 1 plane, 2 box), particle a, other b, free normal speed at substep end, target gap, target normal speed, accumulated normal impulse. */
  private contacts: number[] = [];
  /** Per particle (as body id): its body has a contact this substep. */
  private touched = new Uint8Array(0);
  /**
   * Velocity-solve impulse per link from the last substep, reused as the starting guess
   * (warm start). A body at rest solves the same problem every substep; from a cold start
   * Gauss–Seidel needed 50–100 passes, and stopping early left a residual velocity that made
   * stuck bodies creep. Part of the snapshot, so restore stays bit-exact.
   */
  private linkImp = new Float64Array(0);
  /** Accumulated friction impulse per contact, a tangential vector (dim per contact). */
  private fric = new Float64Array(0);
  private order: number[] = [];
  private lo = new Float64Array(0);
  private n: Float64Array;
  private t: Float64Array;
  private u: Float64Array;

  constructor(dim: number) {
    if (!Number.isInteger(dim) || dim < 1) throw new Error(`dim must be an integer >= 1, got ${dim}`);
    this.dim = dim;
    this.gravity = new Float64Array(dim);
    this.n = new Float64Array(dim);
    this.t = new Float64Array(dim);
    this.u = new Float64Array(dim);
  }

  get count(): number {
    return this.mass.length;
  }

  addParticle(position: ArrayLike<number>, velocity: ArrayLike<number>, mass: number, radius: number): number {
    if (!(mass > 0 && mass < Infinity)) throw new Error(`mass must be positive and finite, got ${mass}`);
    if (!(radius >= 0 && radius < Infinity)) throw new Error(`radius must be >= 0, got ${radius}`);
    this.pos = grow(this.pos, position, this.dim);
    this.vel = grow(this.vel, velocity, this.dim);
    this.force = grow(this.force, new Float64Array(this.dim), this.dim);
    this.mass.push(mass);
    this.radius.push(radius);
    this.free.push(this.dim);
    this.body.push(-1);
    return this.count - 1;
  }

  /** Stiff link holding i and j at their current distance. Make links through createBody: linked particles outside a body still collide with each other. */
  addLink(i: number, j: number): void {
    this.checkPair(i, j);
    const length = Math.sqrt(this.dist2(i, j));
    if (!(length > 0)) throw new Error('cannot link two particles at the same place');
    this.links.push({ i, j, length });
  }

  addSpring(i: number, j: number, stiffness: number, length: number): void {
    this.checkPair(i, j);
    if (!(stiffness >= 0 && stiffness < Infinity)) throw new Error(`spring stiffness must be finite and >= 0, got ${stiffness}`);
    if (!(length >= 0 && length < Infinity)) throw new Error(`spring length must be finite and >= 0, got ${length}`);
    this.springs.push({ i, j, stiffness, length });
  }

  private checkPair(i: number, j: number): void {
    for (const p of [i, j]) if (!Number.isInteger(p) || p < 0 || p >= this.count) throw new Error(`no particle ${p}`);
    if (i === j) throw new Error('cannot join a particle to itself');
  }

  addPlane(normal: ArrayLike<number>, offset: number): void {
    const n = Float64Array.from(normal);
    const len = Math.sqrt(n.reduce((s, x) => s + x * x, 0));
    if (n.length !== this.dim || !(len > 0)) throw new Error('plane normal must be a nonzero vector of length dim');
    this.planes.push({ normal: n.map((x) => x / len), offset });
  }

  addBox(min: ArrayLike<number>, max: ArrayLike<number>): void {
    if (min.length !== this.dim || max.length !== this.dim) throw new Error('box corners must have length dim');
    this.boxes.push({ min: Float64Array.from(min), max: Float64Array.from(max) });
  }

  /**
   * Restrict particles to their first k coordinates; the others stay at their current
   * values and their velocity is zeroed (an ideal frictionless rail catching them).
   * k = dim releases them.
   */
  confine(particles: readonly number[], k: number): void {
    if (!Number.isInteger(k) || k < 0 || k > this.dim) throw new Error(`k must be 0..${this.dim}, got ${k}`);
    for (const i of particles) {
      this.free[i] = k;
      for (let c = k; c < this.dim; c++) this.vel[i * this.dim + c] = 0;
    }
  }

  /** Advance exactly STEP seconds. */
  step(): void {
    const d = this.dim, N = this.count, h = STEP / SUBSTEPS;
    const { pos, vel, free } = this;
    if (this.acc.length !== pos.length) {
      this.acc = new Float64Array(pos.length);
      this.old = new Float64Array(pos.length);
      this.touched = new Uint8Array(N);
    }
    const { acc, old } = this;
    this.accelerations();
    for (let s = 0; s < SUBSTEPS; s++) {
      old.set(pos);
      for (let i = 0; i < N; i++) {
        for (let c = 0, k = i * d; c < free[i]; c++, k++) {
          vel[k] += 0.5 * h * acc[k];
          pos[k] += h * vel[k];
        }
      }
      this.detect();
      this.solvePositions();
      // Velocity picks up the constraint corrections. Written as a difference from the
      // prediction so that an untouched particle's velocity stays bit-for-bit unchanged.
      for (let i = 0; i < N; i++) {
        for (let c = 0, k = i * d; c < free[i]; c++, k++) vel[k] += (pos[k] - (old[k] + h * vel[k])) / h;
      }
      this.accelerations();
      for (let i = 0; i < N; i++) {
        for (let c = 0, k = i * d; c < free[i]; c++, k++) vel[k] += 0.5 * h * acc[k];
      }
      this.solveVelocities();
    }
    this.force.fill(0);
  }

  /** Kinetic plus potential energy (gravity, springs, Gauss-law attraction). External forces are not counted. */
  energy(): number {
    const d = this.dim, N = this.count, { pos, vel, mass, gravity } = this;
    let e = 0;
    for (let i = 0; i < N; i++) {
      for (let c = 0, k = i * d; c < d; c++, k++) e += 0.5 * mass[i] * vel[k] * vel[k] - mass[i] * gravity[c] * pos[k];
    }
    for (const s of this.springs) {
      const x = Math.sqrt(this.dist2(s.i, s.j)) - s.length;
      e += 0.5 * s.stiffness * x * x;
    }
    if (this.G !== 0) {
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const r = Math.sqrt(this.dist2(i, j)), re = Math.max(r, this.radius[i] + this.radius[j]);
          if (re === 0) continue;
          const gmm = this.G * mass[i] * mass[j], pw = power(re, d - 1);
          e += d === 1 ? gmm * re : d === 2 ? gmm * Math.log(re) : -gmm * re / ((d - 2) * pw);
          if (r < re) e += (r - re) * gmm / pw; // matches the force held at its contact value
        }
      }
    }
    return e;
  }

  /** Everything step() changes, plus confinement: [pos, vel, free, link impulses (the solver's warm start)]. Structure (particles, links, planes, parameters) is not included. */
  snapshot(): Float64Array {
    const nd = this.pos.length, out = new Float64Array(2 * nd + this.count + this.links.length);
    out.set(this.pos, 0);
    out.set(this.vel, nd);
    out.set(this.free, 2 * nd);
    out.set(this.linkImpulses(), 2 * nd + this.count);
    return out;
  }

  restore(s: Float64Array): void {
    const nd = this.pos.length;
    if (s.length !== 2 * nd + this.count + this.links.length) throw new Error('snapshot does not match this world');
    this.pos.set(s.subarray(0, nd));
    this.vel.set(s.subarray(nd, 2 * nd));
    for (let i = 0; i < this.count; i++) this.free[i] = s[2 * nd + i];
    this.linkImpulses().set(s.subarray(2 * nd + this.count));
  }

  private linkImpulses(): Float64Array {
    if (this.linkImp.length !== this.links.length) {
      const a = new Float64Array(this.links.length);
      a.set(this.linkImp.subarray(0, Math.min(a.length, this.linkImp.length)));
      this.linkImp = a;
    }
    return this.linkImp;
  }

  private dist2(i: number, j: number): number {
    const d = this.dim;
    let s = 0;
    for (let c = 0; c < d; c++) {
      const x = this.pos[i * d + c] - this.pos[j * d + c];
      s += x * x;
    }
    return s;
  }

  private accelerations(): void {
    const d = this.dim, N = this.count, { pos, mass, force, gravity, acc } = this;
    for (let i = 0; i < N; i++) {
      for (let c = 0, k = i * d; c < d; c++, k++) acc[k] = gravity[c] + force[k] / mass[i];
    }
    for (const s of this.springs) {
      const len = Math.sqrt(this.dist2(s.i, s.j));
      if (len === 0) continue;
      const f = (s.stiffness * (len - s.length)) / len;
      for (let c = 0; c < d; c++) {
        const x = f * (pos[s.j * d + c] - pos[s.i * d + c]);
        acc[s.i * d + c] += x / mass[s.i];
        acc[s.j * d + c] -= x / mass[s.j];
      }
    }
    if (this.G === 0) return;
    // Two separated balls attract exactly like point sources (the shell theorem follows from
    // Gauss's law in any dimension). Approximation: when they overlap, the force is held at
    // its touching value instead of the true overlap force, so close encounters stay finite;
    // collisions normally keep balls from overlapping. Two radius-0 particles at one point exert nothing.
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const r = Math.sqrt(this.dist2(i, j));
        if (r === 0) continue;
        const f = this.G / (power(Math.max(r, this.radius[i] + this.radius[j]), d - 1) * r);
        for (let c = 0; c < d; c++) {
          const x = f * (pos[j * d + c] - pos[i * d + c]);
          acc[i * d + c] += x * mass[j];
          acc[j * d + c] -= x * mass[i];
        }
      }
    }
  }

  private detect(): void {
    const d = this.dim, N = this.count, { pos, radius, body, order: o } = this;
    this.contacts.length = 0;
    if (this.lo.length !== N) {
      this.lo = new Float64Array(N);
      o.length = 0;
      for (let i = 0; i < N; i++) o.push(i);
    }
    const lo = this.lo;
    for (let i = 0; i < N; i++) lo[i] = pos[i * d] - radius[i];
    // Sort-and-sweep along x. Insertion sort is O(n) on the nearly sorted order kept from the
    // last substep. Ties go by index, so the result (and so the contact order) is unique
    // whatever the previous order was, which keeps restore() bit-exact.
    for (let a = 1; a < N; a++) {
      const i = o[a], key = lo[i];
      let b = a - 1;
      for (; b >= 0 && (lo[o[b]] > key || (lo[o[b]] === key && o[b] > i)); b--) o[b + 1] = o[b];
      o[b + 1] = i;
    }
    for (let a = 0; a < N; a++) {
      const p = o[a], hi = pos[p * d] + radius[p];
      for (let b = a + 1; b < N && lo[o[b]] < hi; b++) {
        const i = Math.min(p, o[b]), j = Math.max(p, o[b]), rs = radius[i] + radius[j];
        if (rs === 0 || (body[i] >= 0 && body[i] === body[j])) continue;
        let s = 0;
        for (let c = 0; c < d && s < rs * rs; c++) {
          const x = pos[i * d + c] - pos[j * d + c];
          s += x * x;
        }
        if (s < rs * rs) this.tryContact(0, i, j);
      }
    }
    for (let i = 0; i < N; i++) {
      for (let p = 0; p < this.planes.length; p++) this.tryContact(1, i, p);
      for (let b = 0; b < this.boxes.length; b++) this.tryContact(2, i, b);
    }
  }

  private tryContact(kind: number, a: number, b: number): void {
    const c = this.contacts.length;
    this.contacts.push(kind, a, b, 0, 0, 0, 0);
    const g = this.gap(c);
    if (g >= 0) {
      this.contacts.length = c;
      return;
    }
    const h = STEP / SUBSTEPS, e = this.restitution, d = this.dim, acc = this.acc, cs = this.contacts, o = this.other(c);
    const vn = this.relVel(c); // mid-substep
    let aN = 0; // relative acceleration along n from the forces
    // Only coordinates a particle can move in count: a force along a frozen one produces no motion.
    for (let k = 0; k < d; k++) {
      aN += ((k < this.free[a] ? acc[a * d + k] : 0) - (o >= 0 && k < this.free[o] ? acc[o * d + k] : 0)) * this.n[k];
    }
    cs[c + 3] = vn + 0.5 * aN * h;
    if (vn >= 0) {
      cs[c + 5] = cs[c + 3]; // not approaching (an overlap left over or spawned): no bounce, and removing it adds no speed
      return;
    }
    // Time of impact: exact constant-acceleration kinematics within the substep. The hit
    // happens at fraction tau (from the overlap this substep's approach made); the pair then
    // flies apart at e × the impact speed for the rest of the substep. If that flight would
    // come straight back (resting contact), it ends touching at zero normal speed instead.
    // Pushing out only to touching would lift a falling ball without slowing it, and
    // reflecting the mid-substep speed would gain or lose up to m·g·h·v per bounce.
    const motion = Math.min(-g, -vn * h), tau = 1 - motion / (-vn * h), rest = (1 - tau) * h;
    const vImp = vn + aN * h * (tau - 0.5);
    cs[c + 4] = Math.max(0, -e * vImp * rest + 0.5 * aN * rest * rest);
    cs[c + 5] = Math.max(0, -e * vImp + aN * rest);
  }

  /** Signed gap of contact c (negative = overlapping); writes its unit normal (pushing a away from b) into this.n. */
  private gap(c: number): number {
    const cs = this.contacts, kind = cs[c], a = cs[c + 1], b = cs[c + 2];
    const d = this.dim, p = this.pos, n = this.n, oa = a * d;
    if (kind === 0) {
      let s = 0;
      for (let k = 0; k < d; k++) {
        n[k] = p[oa + k] - p[b * d + k];
        s += n[k] * n[k];
      }
      const r = Math.sqrt(s);
      if (r > 0) for (let k = 0; k < d; k++) n[k] /= r;
      else {
        n.fill(0);
        n[0] = 1; // coincident centres: any direction is as good, this one is deterministic
      }
      return r - this.radius[a] - this.radius[b];
    }
    if (kind === 1) {
      const plane = this.planes[b];
      n.set(plane.normal);
      let s = -plane.offset - this.radius[a];
      for (let k = 0; k < d; k++) s += p[oa + k] * n[k];
      return s;
    }
    const { min, max } = this.boxes[b];
    let s = 0, depth = Infinity, axis = 0, side = 1;
    for (let k = 0; k < d; k++) {
      const x = p[oa + k];
      n[k] = x - Math.min(Math.max(x, min[k]), max[k]);
      s += n[k] * n[k];
      if (x - min[k] < depth) {
        depth = x - min[k];
        axis = k;
        side = -1;
      }
      if (max[k] - x < depth) {
        depth = max[k] - x;
        axis = k;
        side = 1;
      }
    }
    if (s > 0) {
      const r = Math.sqrt(s);
      for (let k = 0; k < d; k++) n[k] /= r;
      return r - this.radius[a];
    }
    n.fill(0);
    n[axis] = side; // centre inside the box: leave through the nearest face
    return -depth - this.radius[a];
  }

  private other(c: number): number {
    return this.contacts[c] === 0 ? this.contacts[c + 2] : -1;
  }

  /** Relative velocity of contact c along this.n. */
  private relVel(c: number): number {
    const d = this.dim, a = this.contacts[c + 1], b = this.other(c), v = this.vel;
    let s = 0;
    for (let k = 0; k < d; k++) s += (v[a * d + k] - (b >= 0 ? v[b * d + k] : 0)) * this.n[k];
    return s;
  }

  /** Σ over the two particles of w·(x·y) restricted to each one's free coordinates (b < 0 = static). */
  private wdot(a: number, b: number, x: Float64Array, y: Float64Array): number {
    let sa = 0, sb = 0;
    for (let k = 0; k < this.free[a]; k++) sa += x[k] * y[k];
    if (b >= 0) for (let k = 0; k < this.free[b]; k++) sb += x[k] * y[k];
    return sa / this.mass[a] + (b >= 0 ? sb / this.mass[b] : 0);
  }

  /**
   * Inverse mass along dir in the pair's free coordinates, or 0 when dir lies (almost)
   * entirely in frozen ones. Such a constraint cannot be corrected by free motion; the
   * frozen coordinates already hold it, and dividing by a near-zero weight would amplify
   * rounding without bound (e.g. a confined creature's link between its z and w vertices).
   */
  private movable(a: number, b: number, dir: Float64Array): number {
    let dd = 0;
    for (let k = 0; k < this.dim; k++) dd += dir[k] * dir[k];
    const w = this.wdot(a, b, dir, dir), full = (1 / this.mass[a] + (b >= 0 ? 1 / this.mass[b] : 0)) * dd;
    return w > 1e-6 * full ? w : 0;
  }

  /** arr[a] += j·w_a·dir, arr[b] -= j·w_b·dir, in free coordinates only. Equal and opposite, so momentum is kept. */
  private push(arr: Float64Array, a: number, b: number, dir: Float64Array, j: number): void {
    const d = this.dim;
    for (let k = 0; k < this.free[a]; k++) arr[a * d + k] += (j * dir[k]) / this.mass[a];
    if (b >= 0) for (let k = 0; k < this.free[b]; k++) arr[b * d + k] -= (j * dir[k]) / this.mass[b];
  }

  private solvePositions(): void {
    const d = this.dim, { pos, old, contacts: cs, n: r, t: x } = this;
    for (let iter = 0; iter < MAX_ITERS; iter++) {
      let err = 0;
      for (let c = 0; c < cs.length; c += 7) {
        const g = this.gap(c) - cs[c + 4];
        if (g >= 0) continue;
        const a = cs[c + 1], b = this.other(c), w = this.movable(a, b, this.n);
        if (w === 0) continue;
        err = Math.max(err, -g / (this.radius[a] + (b >= 0 ? this.radius[b] : 0) || 1));
        this.push(pos, a, b, this.n, -g / w);
        cs[c + 6] -= (g / w) / (STEP / SUBSTEPS); // momentum this push delivers once velocity is re-derived
      }
      for (const { i, j, length } of this.links) {
        let xx = 0;
        for (let k = 0; k < d; k++) {
          r[k] = old[i * d + k] - old[j * d + k];
          x[k] = pos[i * d + k] - pos[j * d + k];
          xx += x[k] * x[k];
        }
        const C = xx - length * length, du = this.wdot(i, j, x, r);
        if (du <= 0 || this.movable(i, j, r) === 0) continue;
        err = Math.max(err, Math.abs(C) / (length * length));
        this.push(pos, i, j, r, -C / (2 * du)); // one Newton step on |x - λu|² = length²
      }
      if (err <= TOL) break;
    }
  }

  /**
   * Velocity solve at the end of the substep. Contacts are driven to their target normal
   * speed with an accumulated impulse that never pulls (sequential impulses), and Coulomb
   * friction, an accumulated tangential vector, is held to at most mu × that impulse. The links of every body that has a contact are
   * solved here too, as velocity constraints (RATTLE's second half), in the same Gauss–Seidel
   * loop: that is what makes a bounce or a push act on the whole body with its real
   * effective mass, instead of on one vertex that the links then drag back into the ground.
   * Free balls take one pass, which resolves simultaneous hits as pairwise sequential ones
   * (exact for e = 1). Link impulses act along the link, so momentum and L stay exact.
   */
  private solveVelocities(): void {
    const d = this.dim, { vel, pos, contacts: cs, body, touched, n, t, u: x } = this, mu = this.friction, h = STEP / SUBSTEPS;
    const links = this.links, imp = this.linkImpulses();
    if (cs.length === 0) {
      imp.fill(0);
      return;
    }
    const nf = (cs.length / 7) * d;
    if (this.fric.length < nf) this.fric = new Float64Array(nf);
    const fric = this.fric;
    fric.fill(0, 0, nf);
    touched.fill(0);
    for (let c = 0; c < cs.length; c += 7) {
      const a = cs[c + 1], b = this.other(c);
      if (body[a] >= 0) touched[body[a]] = 1;
      if (b >= 0 && body[b] >= 0) touched[body[b]] = 1;
    }
    for (let l = 0; l < links.length; l++) {
      const { i, j } = links[l];
      if (body[i] < 0 || !touched[body[i]]) {
        imp[l] = 0; // no contact on this body: its links carry no load
        continue;
      }
      for (let k = 0; k < d; k++) x[k] = pos[i * d + k] - pos[j * d + k];
      this.push(vel, i, j, x, imp[l]);
    }
    for (let iter = 0; iter < MAX_VEL_ITERS; iter++) {
      let err = 0;
      for (let c = 0; c < cs.length; c += 7) {
        const a = cs[c + 1], b = this.other(c);
        if (iter > 0 && body[a] < 0 && (b < 0 || body[b] < 0)) continue;
        this.gap(c);
        const w = this.movable(a, b, n);
        if (w === 0) continue;
        const vn = this.relVel(c);
        const P = cs[c + 6], P1 = Math.max(0, P + (cs[c + 5] - vn) / w); // P starts as what the position solve gave
        this.push(vel, a, b, n, P1 - P);
        cs[c + 6] = P1;
        err = Math.max(err, Math.abs(P1 - P) * w);
        if (mu === 0) continue;
        // Coulomb with an accumulated vector: try to stop the tangential slip, then clamp the
        // total friction to mu × the *current* normal impulse and apply only the change. The
        // normal impulse can shrink in later passes as the links share the load, and the
        // clamp then gives friction back; a running scalar total could not, so it let
        // friction exceed mu × N (a body on a slope too steep to hold stayed stuck).
        const f = (c / 7) * d, vnNow = this.relVel(c);
        let tt = 0;
        for (let k = 0; k < d; k++) {
          t[k] = vel[a * d + k] - (b >= 0 ? vel[b * d + k] : 0) - vnNow * n[k];
          tt += t[k] * t[k];
        }
        const speed = Math.sqrt(tt), wt = speed > 0 ? this.wdot(a, b, t, t) / tt : 0;
        let ff = 0;
        for (let k = 0; k < d; k++) {
          x[k] = fric[f + k]; // previous total
          if (wt > 0) fric[f + k] -= t[k] / wt; // plus the impulse that would stop the slip
          ff += fric[f + k] * fric[f + k];
        }
        const limit = mu * P1, scale = ff > limit * limit ? limit / Math.sqrt(ff) : 1;
        let dd = 0;
        for (let k = 0; k < d; k++) {
          fric[f + k] *= scale;
          x[k] = fric[f + k] - x[k];
          dd += x[k] * x[k];
        }
        this.push(vel, a, b, x, 1);
        err = Math.max(err, Math.sqrt(dd) * w);
      }
      for (let l = 0; l < links.length; l++) {
        const { i, j, length } = links[l];
        if (body[i] < 0 || !touched[body[i]]) continue;
        let rv = 0;
        for (let k = 0; k < d; k++) {
          x[k] = pos[i * d + k] - pos[j * d + k];
          rv += (vel[i * d + k] - vel[j * d + k]) * x[k];
        }
        const w = this.movable(i, j, x);
        if (w === 0) continue;
        err = Math.max(err, Math.abs(rv) / length);
        this.push(vel, i, j, x, -rv / w);
        imp[l] -= rv / w;
      }
      if (err <= VEL_TOL) break;
    }
    // Friction acts over the whole substep, so it moves position by h/2 × its velocity change,
    // as any constant force does in Verlet. That makes sliding stops right to O(h²), and for a
    // stuck contact it exactly cancels the creep of the drift (which moved everything by
    // a·h²/2 before friction could act). Applied at the contact particle, it still moves a
    // body's centre of mass by h/2 · F / M, and the links (which keep the centre of mass)
    // pull the rest of the body along.
    if (mu === 0) return;
    for (let c = 0; c < cs.length; c += 7) {
      for (let k = 0; k < d; k++) x[k] = fric[(c / 7) * d + k];
      this.push(pos, cs[c + 1], this.other(c), x, 0.5 * h);
    }
  }
}

function grow(a: Float64Array, values: ArrayLike<number>, d: number): Float64Array<ArrayBuffer> {
  if (values.length !== d) throw new Error(`expected a vector of length ${d}, got ${values.length}`);
  const b = new Float64Array(a.length + d);
  b.set(a);
  for (let c = 0; c < d; c++) b[a.length + c] = values[c];
  return b;
}

/** x^k by repeated multiplication: exact integer exponent, identical on every machine (Math.pow is not guaranteed to be). */
function power(x: number, k: number): number {
  let p = 1;
  for (let i = 0; i < k; i++) p *= x;
  return p;
}
