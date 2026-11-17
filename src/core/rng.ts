// Mulberry32: integer-only arithmetic, so the sequence is bit-identical on every machine.
// `state` is public so a scene can store it next to a world snapshot.
export class Rng {
  constructor(public state: number) {
    this.state = state | 0;
  }

  /** Uniform in [0, 1). */
  next(): number {
    let t = (this.state = (this.state + 0x6d2b79f5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
