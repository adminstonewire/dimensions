import type { Input } from '../contracts';
import { applyIntent, createCreature, type Body } from '../core/body';
import { World } from '../core/world';

// The one world of "one world, sliced": a single 4D world that the 1D, 2D and 3D World
// experiences all look at. Pure (no DOM, no Three.js) so it can be tested.

/** Below the origin, so the scene sits around the point the viewer's camera orbits. */
const GROUND = -0.5;
/** The creature's strongest push, about 2 g: enough to lift off. */
const ACCEL = 20;
/** The speed along the ground it settles at while a key is held, m/s. */
const TOP_SPEED = 2.5;
const SIZE = 0.16;
const RADIUS = 0.05;

export interface Sliced {
  world: World;
  creature: Body;
  /** Where the creature looks, [yaw, pitch] in radians. Turned by Input.look, so it is part of a take. */
  gaze: [number, number];
  /**
   * Hold the creature to its first k directions (1 = a line, 2 = a sheet, 3 = a room).
   * Only the creature is held: balls and the pendulum keep all four directions, which is
   * what lets them pass through the line or sheet. Nothing else in the world changes.
   */
  reach(k: number): void;
  step(input: Input): void;
}

export function createSliced(): Sliced {
  const world = new World(4);
  world.gravity[1] = -9.81;
  // Half-elastic, so a knocked-over creature settles instead of rocking for minutes.
  // Friction stays 0: the engine's friction on a confined body is not yet tested (PHYSICS.md).
  world.restitution = 0.5;
  world.addPlane([0, 1, 0, 0], GROUND);

  const box = (x0: number, x1: number, height: number, z0: number, z1: number) =>
    world.addBox([x0, GROUND, z0, -0.5], [x1, GROUND + height, z1, 0.5]);
  // Four kerbs keep loose balls from sliding away for good; the world is never reset.
  box(-2.35, -2.2, 0.25, -1.85, 1.85);
  box(2.2, 2.35, 0.25, -1.85, 1.85);
  box(-2.35, 2.35, 0.25, -1.85, -1.7);
  box(-2.35, 2.35, 0.25, 1.7, 1.85);
  box(1, 1.4, 0.3, -0.3, 0.3); // a block on the creature's line: a wall in 1D, a hop in 2D, a detour in 3D
  box(0.2, 0.6, 0.8, -1.3, -0.9); // a post away from the sheet: only the 3D creature can ever touch it

  const still = [0, 0, 0, 0];
  world.addParticle([0.3, GROUND + 0.2, 0, 0], still, 1, 0.2); // a neighbour on the line
  world.addParticle([-1.5, GROUND + 0.15, 0.9, 0], still, 1, 0.15);
  // A pendulum swinging across the sheet z = 0, so a flat creature sees a disc grow and shrink.
  // It touches nothing, so it keeps swinging whatever the bounce and friction settings are.
  // Its rod is a 5-12-13 triangle to start with: exact numbers, no Math.sin.
  const pivot = world.addParticle([-0.5, GROUND + 1.58, 0, 0], still, 1, 0.04);
  world.confine([pivot], 0); // fixed in space
  world.addLink(pivot, world.addParticle([-0.5, GROUND + 0.38, -0.5, 0], still, 1, 0.2));

  const centre = [-1.3, GROUND + RADIUS + SIZE / Math.sqrt(3), 0, 0];
  const creature = createCreature(world, centre, SIZE, 1, RADIUS);
  // createCreature stands it on one corner: a balance that rounding error would tip over after a
  // few seconds, differently on every machine. Turn it, before anything moves, to rest on a face.
  for (const p of creature.particles) {
    const x = world.pos[p * 4] - centre[0], y = world.pos[p * 4 + 1] - centre[1], z = world.pos[p * 4 + 2];
    world.pos[p * 4] = centre[0] + (x - y) / Math.SQRT2;
    world.pos[p * 4 + 1] = centre[1] - (x + y + z) / Math.sqrt(3);
    world.pos[p * 4 + 2] = (x + y - 2 * z) / Math.sqrt(6);
  }

  const gaze: [number, number] = [0, 0];
  return {
    world,
    creature,
    gaze,
    reach: (k) => world.confine(creature.particles, k),
    step(input) {
      gaze[0] += input.look[0];
      gaze[1] = Math.max(-1.5, Math.min(1.5, gaze[1] - input.look[1]));
      // The ground has no friction, so the creature stops itself: along the ground it pushes
      // toward the speed asked for (TOP_SPEED × intent), never harder than ACCEL. Up and down
      // is plain thrust, so it falls freely.
      const want = input.move.map((m, c) => {
        if (c === 1) return m;
        let v = 0;
        for (const p of creature.particles) v += world.vel[p * 4 + c];
        return m - v / creature.particles.length / TOP_SPEED; // equal masses: the mean is the body's velocity
      });
      applyIntent(world, creature, want, ACCEL);
      world.step();
    },
  };
}
