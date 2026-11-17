import { PerspectiveCamera, Scene } from 'three';
import type { Experience } from '../contracts';
import { gridPlane } from '../render/grid';
import { createMarch } from '../render/march';
import { cssColor } from './color';
import { createSliced, type Sliced } from './sliced';

// One simulation behind all three experiences. The app makes a new instance on every dropdown
// change, and "one world, sliced" means changing dimension must not reset anything, so the world
// lives here and an instance only holds what it needs to draw it.
let shared: Sliced | undefined;

const CAPTIONS = [
  '',
  'You are held on one line of a 4D world; the things you meet are slices of it. Geometry and perception, not a universe with one dimension.',
  'The same world: you are held on one flat sheet of it, so a ball passing through is a disc that grows and shrinks. Not a true 2D universe.',
  'The same world: you can reach a 3D slice of it. Newtonian balls and boxes on frictionless ground; a geometry lesson, not a brane world.',
];

/** The sliced world with the creature held to its first k directions. */
export function world(k: number): Experience {
  return {
    id: 'world',
    title: 'World',
    dim: k,
    lenses: ['watch', 'be'],
    caption: CAPTIONS[k],
    create(renderer) {
      const sim = (shared ??= createSliced());
      sim.reach(k);

      const bg = cssColor('--bg');
      const scene = new Scene();
      scene.background = bg;
      const grid = gridPlane(cssColor('--grid'), sim.world.planes[0].offset);
      const march = createMarch({ bg, ink: cssColor('--accent'), you: cssColor('--you'), grid: cssColor('--grid') }, sim.world, sim.creature);
      scene.add(grid, march.mesh);
      const eye = new PerspectiveCamera(75, 1, 0.05, 200);

      return {
        step: (input) => sim.step(input),
        render(lens, camera) {
          const { world: w, creature, gaze: [yaw, pitch] } = sim;
          const be = lens === 'be';
          // The eye is steadied: it follows the look input, not the tumbling of the body.
          // Its gaze in 3D, cut down to what the creature has: an angle in its sheet, or a side of its line.
          const strip = !be || k === 3 ? undefined : k === 2 ? { gaze: -yaw, fov: Math.PI / 2 } : { gaze: Math.cos(yaw) < 0 ? Math.PI : 0, fov: 0 };
          let cam = camera;
          if (be && k === 3) {
            const [x, y, z] = w.pos.subarray(creature.particles[0] * 4); // its centre particle
            eye.position.set(x, y, z);
            eye.lookAt(x + Math.cos(pitch) * Math.cos(yaw), y + Math.sin(pitch), z + Math.cos(pitch) * Math.sin(yaw));
            eye.aspect = camera.aspect;
            eye.updateProjectionMatrix();
            cam = eye;
          }
          grid.visible = !strip; // a line-eye sees the ground edge-on, in the strip
          march.update(camera, { reach: k, self: !be, strip });
          renderer.render(scene, cam);
        },
        dispose() {
          for (const mesh of [grid, march.mesh]) {
            mesh.geometry.dispose();
            mesh.material.dispose();
          }
        },
      };
    },
  };
}
