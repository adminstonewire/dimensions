import { describe, expect, it } from 'vitest';
import type { Input } from '../contracts';
import { bodyPose } from '../core/body';
import { createSliced } from './sliced';

const input = (...move: number[]): Input => ({ move: [move[0] ?? 0, move[1] ?? 0, move[2] ?? 0, 0], look: [0, 0], act: false });
const run = (s: ReturnType<typeof createSliced>, steps: number, i: Input) => {
  for (let n = 0; n < steps; n++) s.step(i);
};

describe('the sliced world', () => {
  it('changing reach keeps every position and only holds the creature', () => {
    const s = createSliced(), { world, creature } = s;
    s.reach(3);
    run(s, 120, input(1, 0, 1));
    const pos = world.pos.slice(), free = world.free.slice();
    s.reach(2);
    expect(world.pos).toEqual(pos); // nothing moved or reset
    for (let i = 0; i < world.count; i++) expect(world.free[i]).toBe(creature.particles.includes(i) ? 2 : free[i]);

    run(s, 240, input(1, 1, 1)); // z is asked for but out of reach now
    for (const p of creature.particles) expect(world.pos[p * 4 + 2]).toBe(pos[p * 4 + 2]);
    const bob = world.count - creature.particles.length - 1;
    expect(world.pos[bob * 4 + 2]).not.toBe(pos[bob * 4 + 2]); // the pendulum still swings through z
  });

  it('the pendulum keeps crossing the sheet', () => {
    const s = createSliced(), bob = s.world.count - s.creature.particles.length - 1;
    let crossings = 0, reach = 0, last = s.world.pos[bob * 4 + 2];
    for (let n = 0; n < 2400; n++) {
      s.step(input());
      const z = s.world.pos[bob * 4 + 2];
      if (z * last < 0) crossings++;
      if (n >= 1800) reach = Math.max(reach, Math.abs(z));
      last = z;
    }
    expect(crossings).toBeGreaterThan(14); // period 2.3 s, 20 s
    expect(reach).toBeCloseTo(0.5, 3); // still the starting swing
  });

  it('the creature rests on the ground, and stops when the keys are released', () => {
    const s = createSliced(), [x0, y0] = bodyPose(s.world, s.creature).centre;
    s.reach(3);
    run(s, 600, input());
    const rest = bodyPose(s.world, s.creature).centre;
    expect(rest[1]).toBeCloseTo(y0, 4);
    expect(rest[0]).toBeCloseTo(x0, 6);

    run(s, 60, input(0, 0, 1));
    const moving = bodyPose(s.world, s.creature).centre[2];
    expect(moving).toBeGreaterThan(0.5);
    run(s, 240, input());
    const a = bodyPose(s.world, s.creature).centre[2];
    run(s, 60, input());
    expect(bodyPose(s.world, s.creature).centre[2]).toBeCloseTo(a, 5);
  });

  it('the same inputs give the same world, bit for bit', () => {
    const worlds = [0, 1].map(() => {
      const s = createSliced();
      s.reach(3);
      run(s, 200, input(1, 1, -1));
      s.reach(2);
      run(s, 200, input(-1, 0, 1));
      return Array.from(new BigUint64Array(s.world.snapshot().buffer));
    });
    expect(worlds[0]).toEqual(worlds[1]);
  });
});
