import type { World } from './world';

/** Particles held together by stiff links. `rest` holds each particle's offset from the centre of mass at creation (flat, dim per particle). */
export interface Body {
  particles: number[];
  rest: Float64Array;
}

export interface Pose {
  centre: Float64Array;
  /** dim × dim, row-major. Maps rest offsets to current offsets: x_i ≈ centre + R·rest_i. */
  rotation: Float64Array;
}

/** Join particles into a body with links between the given pairs (indices into `particles`). The rest shape must span all dim axes. */
export function createBody(world: World, particles: number[], links: [number, number][]): Body {
  const d = world.dim;
  for (const [a, b] of links) world.addLink(particles[a], particles[b]);
  for (const p of particles) world.body[p] = particles[0];
  const centre = centreOfMass(world, particles);
  const rest = new Float64Array(particles.length * d);
  particles.forEach((p, i) => {
    for (let c = 0; c < d; c++) rest[i * d + c] = world.pos[p * d + c] - centre[c];
  });
  return { particles, rest };
}

/**
 * Centre of mass, and the rotation that best maps the rest shape onto the current one
 * (orthogonal Procrustes: the polar factor of A = Σ m·current·restᵀ). Built from particle
 * positions alone, so it works for any dim, including double rotations in 4D.
 */
export function bodyPose(world: World, body: Body): Pose {
  const d = world.dim, { particles, rest } = body;
  const centre = centreOfMass(world, particles);
  let X = new Float64Array(d * d);
  particles.forEach((p, i) => {
    const m = world.mass[p];
    for (let a = 0; a < d; a++) {
      const x = m * (world.pos[p * d + a] - centre[a]);
      for (let b = 0; b < d; b++) X[a * d + b] += x * rest[i * d + b];
    }
  });
  let norm = 0;
  for (const x of X) norm += x * x;
  norm = Math.sqrt(norm);
  if (!(norm > 0)) throw new Error('body has no extent');
  for (let k = 0; k < X.length; k++) X[k] /= norm;
  // Newton–Schulz: X ← X(3I − XᵀX)/2 converges to the polar factor when the singular
  // values of X lie in (0, √3), which dividing by the Frobenius norm guarantees.
  for (let iter = 0; iter < 100; iter++) {
    const M = new Float64Array(d * d);
    let err = 0;
    for (let a = 0; a < d; a++) {
      for (let b = 0; b < d; b++) {
        let s = 0;
        for (let k = 0; k < d; k++) s += X[k * d + a] * X[k * d + b];
        M[a * d + b] = (a === b ? 3 : 0) - s;
        err = Math.max(err, Math.abs((a === b ? 1 : 0) - s));
      }
    }
    const Y = new Float64Array(d * d);
    for (let a = 0; a < d; a++) {
      for (let b = 0; b < d; b++) {
        let s = 0;
        for (let k = 0; k < d; k++) s += X[a * d + k] * M[k * d + b];
        Y[a * d + b] = 0.5 * s;
      }
    }
    X = Y;
    if (err < 1e-9) break; // convergence is quadratic, so this last update reaches rounding level
  }
  return { centre, rotation: X };
}

/**
 * A creature for a world of any dim: the cross-polytope (segment, square, octahedron,
 * 16-cell, ...) with 2·dim vertex particles plus one centre particle, all of equal mass.
 * Every pair is linked except opposite vertices (redundant: they line up through the
 * centre), which makes the frame rigid in every dim. Particles: centre, then +x, −x, +y, −y, ...
 */
export function createCreature(world: World, centre: ArrayLike<number>, size: number, mass: number, radius: number): Body {
  const d = world.dim, m = mass / (2 * d + 1), still = new Float64Array(d);
  const particles = [world.addParticle(centre, still, m, radius)];
  for (let axis = 0; axis < d; axis++) {
    for (const sign of [1, -1]) {
      const p = Float64Array.from(centre);
      p[axis] += sign * size;
      particles.push(world.addParticle(p, still, m, radius));
    }
  }
  const links: [number, number][] = [];
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      if (a > 0 && (a - 1) >> 1 === (b - 1) >> 1) continue;
      links.push([a, b]);
    }
  }
  return createBody(world, particles, links);
}

/**
 * Player intent (Input.move, each -1..1 along x, y, z, w) as a force for the next step:
 * every particle gets m·accel·move, so intent accelerates the body without spinning it.
 * Axes beyond the world's dim are ignored; confined axes are ignored by the world.
 */
export function applyIntent(world: World, body: Body, move: ArrayLike<number>, accel: number): void {
  const d = world.dim, axes = Math.min(d, move.length);
  for (const p of body.particles) {
    for (let c = 0; c < axes; c++) world.force[p * d + c] += world.mass[p] * accel * Math.max(-1, Math.min(1, move[c]));
  }
}

function centreOfMass(world: World, particles: number[]): Float64Array {
  const d = world.dim, centre = new Float64Array(d);
  let total = 0;
  for (const p of particles) {
    total += world.mass[p];
    for (let c = 0; c < d; c++) centre[c] += world.mass[p] * world.pos[p * d + c];
  }
  for (let c = 0; c < d; c++) centre[c] /= total;
  return centre;
}
