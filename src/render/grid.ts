import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial, type Color } from 'three';

const MINOR = 0.25; // world units per small square
const MAJOR = 5; // small squares per heavy line, as on graph paper

/** Graph-paper ground plane: one quad, lines drawn in the shader so they stay crisp at any zoom and resolution. */
export function gridPlane(color: Color, y = -1.25) {
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: { uColor: { value: color } },
    vertexShader: /* glsl */ `
      varying vec2 vPos;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vPos = world.xz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying vec2 vPos;
      // Line coverage for one spacing. Fades out before squares shrink to a few pixels, which would shimmer.
      float grid(float cell) {
        vec2 c = vPos / cell;
        vec2 w = fwidth(c);
        vec2 d = abs(fract(c - 0.5) - 0.5) / w;
        float line = clamp(1.5 - min(d.x, d.y), 0.0, 1.0);
        return line * (1.0 - smoothstep(0.15, 0.5, max(w.x, w.y)));
      }
      void main() {
        float a = max(0.4 * grid(${MINOR.toFixed(3)}), grid(${(MINOR * MAJOR).toFixed(3)}));
        a *= 1.0 - smoothstep(5.0, 16.0, length(vPos)); // dissolve before the quad's edge shows
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new Mesh(new PlaneGeometry(40, 40), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  mesh.renderOrder = -1; // drawn under everything else that is transparent
  return mesh;
}
