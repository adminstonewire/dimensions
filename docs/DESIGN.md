# Design

**Feel:** crafty — a drawing on graph paper, built by hand. Coloured ink, a ruled ground
plane under everything, no glow. The world is the hero; the interface almost disappears.
It must look good as 4K video footage, not only as a web page.

## Rules

- **One bar.** Top of screen: `Play` · `Dimension` · `Experience` · `View`. Native
  elements, styled. No sidebars, panels, modals or onboarding.
- **Still until you press Play.** Every scene opens paused (`P` also toggles). While
  paused you can still look around.
- **The camera is always yours.** Drag to orbit, scroll or pinch to zoom, right-drag or
  two-finger drag to move. It glides to a stop rather than halting dead.
- **A ground plane in every scene.** The ruled grid (`src/render/grid.ts`) gives scale
  and a sense of space, and is what makes the look.
- **Two lines of text on the canvas, maximum.** Bottom-left: a one-line caption saying
  what is physically real here. Bottom-right: the tag `3 space + 1 time`.
- **`H` hides all UI.** Capture never includes UI.
- **Every state is a URL** (`?d=4&e=world&v=slice`).

## Colour

Tokens live in `src/styles.css`. Do not hard-code colours elsewhere.

- Background: warm off-white paper with pale blue ruling; dark ink for text. (Chosen
  over light gray and blueprint blue.)
- **Each dimension has its own ink colour**, hand-picked so neighbours are far apart:
  graphite (0), blue (1), green (2), crimson (3), violet (4), then teal, olive, rust,
  indigo, magenta, amber. Viewers should know which dimension they are in from colour
  alone. 1–4 avoid orange so the creature always stands out.
- **The ground grid is neutral gray and faint.** It must never compete with the drawing,
  least of all with a single line or square.
- **The creature is always warm orange** (`--you`). It is "you" in every dimension.
- Depth is shown by ink fading into the paper (fog to the background colour), never by
  glow or additive blending — those only work on black.
- Shaders take colours as uniforms read from the tokens; they do not invent colours.

## Type

System UI font for now; tabular monospace for numbers. A real typeface is a Phase 7
decision, taken with screens in front of us.

## Motion

- Changing dimension is **the lift**: one continuous camera move into the new direction.
  Never a cut, never a fade.
- Respect `prefers-reduced-motion`: replace the lift with a 150 ms cross-fade.

## Accessibility

- Dropdowns keyboard-operable with visible focus; labels for screen readers.
- Text contrast at least 4.5:1 against the darkest and brightest scene behind the bar
  (the bar has its own translucent backing for this).
- Nothing conveyed by colour alone — the dimension is also written in the tag.

## Later (Phase 7)

Pull reference top bars from Mobbin, run a design critique and an accessibility review
against the real screens, then choose the typeface.
