import { BufferAttribute, BufferGeometry, Fog, Points, PointsMaterial, Scene, type InterleavedBufferAttribute } from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { STEP, type Experience } from '../contracts';
import { gridPlane } from '../render/grid';
import { cssColor } from './color';

// Across all the projections together, the nearest part of the cube looks this many times bigger than the
// farthest, whatever n is. With a fixed strength per projection instead, a 10-cube is crushed into a knot.
const DEPTH_RATIO = 3;

/** Shadow of the unit n-cube: rotate in n coordinate planes, then perspective-project one dimension at a time. */
export function hypercube(n: number): Experience {
  return {
    id: 'hypercube',
    title: 'Hypercube',
    dim: n,
    lenses: ['shadow'],
    caption:
      n === 0
        ? 'A point is the 0-cube: no edges, nothing to distort.'
        : n === 1
          ? 'A 1-cube is a segment. One dimension has no plane to turn in, so it cannot rotate.'
          : `Shadow of ${n === 8 ? 'an' : 'a'} ${n}-cube. Every edge is really the same length — the distortion is perspective.`,
    create(renderer) {
      const count = 1 << n;
      const base = new Float64Array(count * n); // vertices at ±0.5
      for (let v = 0; v < count; v++) for (let k = 0; k < n; k++) base[v * n + k] = (v >> k) & 1 ? 0.5 : -0.5;
      const edges: number[] = [];
      for (let v = 0; v < count; v++) for (let k = 0; k < n; k++) if (!((v >> k) & 1)) edges.push(v, v | (1 << k));

      const planes = n < 2 ? 0 : n === 2 ? 1 : n; // plane k spins x_k into x_(k+1)
      const angle = new Float64Array(planes);

      const levels = Math.max(0, n - 3); // projections needed to get down to 3D
      const rho = DEPTH_RATIO ** (1 / (levels || 1)); // near/far size ratio of one projection
      const eyeDist = (rho + 1) / (rho - 1); // eye distance, in units of the shape's radius, that gives that ratio
      const growth = 1 / Math.sqrt(1 - 1 / eyeDist ** 2); // the most one projection can enlarge the radius
      const scale = growth ** -levels; // fixed, so the shadow fits the unit sphere without resizing every frame

      const accent = cssColor('--accent');
      const bg = cssColor('--bg');
      const scene = new Scene();
      scene.background = bg;
      const fog = new Fog(bg, 1, 10); // far edges fade into the paper; the range follows the camera in render()
      scene.fog = fog;
      const grid = gridPlane(cssColor('--grid'));
      scene.add(grid);

      const pos = new BufferAttribute(new Float32Array(count * 3), 3);
      const dotGeo = new BufferGeometry().setAttribute('position', pos);
      // Fat lines: plain WebGL lines are always 1px and vanish in 4K footage.
      const segPos = new Float32Array(edges.length * 3);
      const lineGeo = new LineSegmentsGeometry().setPositions(segPos);
      const segBuf = (lineGeo.getAttribute('instanceStart') as InterleavedBufferAttribute).data;
      const dotMat = new PointsMaterial({ color: accent, size: n ? 6 : 12, sizeAttenuation: false });
      const lineMat = new LineMaterial({
        color: accent,
        linewidth: 2,
        fog: true,
        transparent: true,
        depthWrite: false,
        opacity: Math.min(1, Math.cbrt(160 / (edges.length + 1))), // thousands of overlapping edges would turn solid
      });
      const dots = new Points(dotGeo, dotMat);
      dots.frustumCulled = false; // positions change every step
      scene.add(dots);
      if (n > 0) {
        const lines = new LineSegments2(lineGeo, lineMat);
        lines.frustumCulled = false;
        scene.add(lines);
      }

      const x = new Float64Array(Math.max(n, 3)); // scratch for one vertex; spare slots stay 0 when n < 3
      const radius = n > 0 ? 0.5 * Math.sqrt(n) : 1;

      function layout() {
        const cs = Array.from(angle, (a) => [Math.cos(a), Math.sin(a)]);
        const p = pos.array as Float32Array;
        for (let v = 0; v < count; v++) {
          for (let k = 0; k < n; k++) x[k] = base[v * n + k] / radius;
          for (let k = 0; k < planes; k++) {
            const j = (k + 1) % n;
            const [c, s] = cs[k];
            const a = x[k];
            const b = x[j];
            x[k] = c * a - s * b;
            x[j] = s * a + c * b;
          }
          let r = 1; // bound on the vertex's distance from the centre so far
          for (let d = n; d > 3; d--) {
            const f = (eyeDist * r) / (eyeDist * r - x[d - 1]);
            for (let i = 0; i < d - 1; i++) x[i] *= f;
            r *= growth;
          }
          p.set([x[0] * scale, x[1] * scale, x[2] * scale], v * 3);
        }
        for (let i = 0; i < edges.length; i++) segPos.set(p.subarray(edges[i] * 3, edges[i] * 3 + 3), i * 3);
        pos.needsUpdate = segBuf.needsUpdate = true;
      }
      layout();

      return {
        step() {
          for (let k = 0; k < planes; k++) angle[k] += (0.12 + 0.05 * k) * STEP;
          layout();
        },
        render(_lens, camera) {
          const d = camera.position.length();
          fog.near = d - 1;
          fog.far = d + 1.7; // the far side of the unit sphere keeps about a quarter of its ink
          renderer.render(scene, camera);
        },
        dispose() {
          dotGeo.dispose();
          lineGeo.dispose();
          dotMat.dispose();
          lineMat.dispose();
          grid.geometry.dispose();
          grid.material.dispose();
        },
      };
    },
  };
}
