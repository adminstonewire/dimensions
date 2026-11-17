// Shared types between the loop, the scenes and the renderers.
// Orchestrator-owned: if you need a change here, report it instead of editing.
import type { PerspectiveCamera, WebGLRenderer } from 'three';

/** Physics advances only in steps of this size, so any take replays frame-exact for video capture. */
export const STEP = 1 / 120;

export type LensId = 'be' | 'watch' | 'slice' | 'shadow' | 'time' | 'zoom';

/** Player intent for one physics step. Recording these per step is what makes a take replayable. */
export interface Input {
  /** Intent along x, y, z, w, each in -1..1. y is up. */
  move: [number, number, number, number];
  /** Look delta for this step in radians: [yaw, pitch]. */
  look: [number, number];
  act: boolean;
}

export interface Experience {
  /** URL slug, unique within a dimension. */
  id: string;
  /** Shown in the Experience dropdown. */
  title: string;
  /** Number of space dimensions, 0..10. */
  dim: number;
  /** Views that make sense here; the first is the default. */
  lenses: LensId[];
  /** One line shown on screen: what is physically real in this scene. */
  caption: string;
  create(renderer: WebGLRenderer): ExperienceInstance;
}

export interface ExperienceInstance {
  /** Advance exactly STEP seconds. Only called while the viewer has pressed Play. */
  step(input: Input): void;
  /**
   * Draw the current state. Must not advance the simulation.
   * `camera` is the viewer's own orbit/zoom/pan camera, live even while paused. Outside views
   * draw with it; a first-person lens ignores it and uses the creature's eye.
   */
  render(lens: LensId, camera: PerspectiveCamera): void;
  dispose(): void;
}
