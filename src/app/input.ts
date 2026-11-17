import type { Input } from '../contracts';

const RAD_PER_PX = 0.005;
// [negative key, positive key] per axis x, y, z, w. y is up.
const AXES = [
  ['KeyA', 'KeyD'],
  [['ShiftLeft', 'ShiftRight'], 'Space'],
  ['KeyS', 'KeyW'],
  ['KeyQ', 'KeyE'],
] as const;

const typingInSelect = () => document.activeElement instanceof HTMLSelectElement;

export function createInput(canvas: HTMLElement) {
  const down = new Set<string>();
  let yaw = 0;
  let pitch = 0;
  let dragging = false;

  addEventListener('keydown', (e) => {
    if (!typingInSelect()) down.add(e.code);
  });
  addEventListener('keyup', (e) => down.delete(e.code));
  addEventListener('blur', () => down.clear());

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointerup', () => (dragging = false));
  canvas.addEventListener('pointercancel', () => (dragging = false));
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    yaw += e.movementX * RAD_PER_PX;
    pitch += e.movementY * RAD_PER_PX;
  });

  const held = (k: string | readonly string[]) => (typeof k === 'string' ? down.has(k) : k.some((c) => down.has(c)));

  /** One Input per step; look is what accumulated since the last call. */
  return {
    take(): Input {
      const move = AXES.map(([neg, pos]) => +held(pos) - +held(neg)) as Input['move'];
      const input: Input = { move, look: [yaw, pitch], act: down.has('KeyF') || down.has('Enter') };
      yaw = pitch = 0;
      return input;
    },
  };
}
