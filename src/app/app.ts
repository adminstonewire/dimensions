import { PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STEP, type Experience, type ExperienceInstance, type LensId } from '../contracts';
import { createInput } from './input';

const MAX_STEPS_PER_FRAME = 8; // beyond this we drop time rather than spiral after a stall

const canvas = document.createElement('canvas');
document.body.prepend(canvas);
const renderer = new WebGLRenderer({ canvas, antialias: true });
const input = createInput(canvas);

// The viewer's camera is not part of the simulation, so it stays live while time is paused.
const camera = new PerspectiveCamera(40, 1, 0.05, 200);
camera.position.set(1.9, 1.1, 2.6).setLength(3.4 / Math.min(1, innerWidth / innerHeight)); // back off in a narrow window
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // glide to a stop instead of halting dead
controls.minDistance = 0.3;
controls.maxDistance = 30;

let instance: ExperienceInstance | null = null;
let lens: LensId = 'be';
let playing = false; // time stands still until the viewer presses Play

export function setPlaying(on: boolean) {
  playing = on;
}

function resize() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

function draw() {
  controls.update();
  instance?.render(lens, camera);
}

export function show(exp: Experience, view: LensId) {
  instance?.dispose();
  instance = exp.create(renderer);
  lens = view;
  draw();
}

/** Advance exactly `steps` steps and render once. The capture module drives the app with this. */
export function advance(steps: number) {
  for (let i = 0; i < steps; i++) instance?.step(input.take());
  draw();
}

let last = performance.now();
let owed = 0; // simulated steps not yet run
function frame(now: number) {
  requestAnimationFrame(frame);
  let steps = (now - last) / 1000 / STEP;
  last = now;
  // A 60 or 120 Hz frame is a whole number of steps. Raw timer jitter would run 1 then 3 steps instead of 2 and 2,
  // which shows as stutter, so near-whole values are snapped.
  // shortcut: other refresh rates (75, 90, 144 Hz) still judder slightly; add render interpolation if that matters.
  if (Math.abs(steps - Math.round(steps)) < 0.02) steps = Math.round(steps); // wider would slow time on e.g. a 110 Hz screen
  if (playing) {
    owed = Math.min(owed + steps, MAX_STEPS_PER_FRAME);
    for (; owed >= 1; owed--) instance?.step(input.take());
  } else {
    owed = 0;
    input.take(); // drop look deltas gathered while paused
  }
  draw();
}
requestAnimationFrame(frame);
