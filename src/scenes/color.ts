import { Color, SRGBColorSpace } from 'three';

const pixel = document.createElement('canvas');
pixel.width = pixel.height = 1;
const ctx = pixel.getContext('2d', { willReadFrequently: true })!;

/** Resolves a CSS custom property (even an oklch() one) to a Three.js colour by letting the browser paint it. */
export function cssColor(name: string): Color {
  const probe = document.createElement('i');
  probe.style.color = `var(${name})`;
  document.body.append(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
}
