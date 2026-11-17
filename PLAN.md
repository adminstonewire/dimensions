# Dimensions — plan

An interactive website where you can live in, look at, and experiment with worlds of
different dimensions, from a point up to the 11 of M-theory. It has two jobs:

1. **Public site** — anyone can open it and play.
2. **Footage source** — the same scenes are re-rendered frame-exact in 4K for the video.

Status: Phase 0 done (engine, app shell, theory reference); Phase 1 is next. This file is
the source of truth for scope; `CLAUDE.md` is the rulebook for anyone (human or agent)
writing code; `docs/PHYSICS.md` is the science, with the long form and sources in
`docs/theory/`; `docs/DESIGN.md` is the look.

---

## 1. What "11 dimensions" actually means

This shapes everything, and the video must get it right:

- **M-theory: 11 = 10 of space + 1 of time.** Superstring theory: 10 = 9 + 1.
- **Time is one of the 11, but it is not "a 4th direction of space".** These are two
  different ideas that pop-science mixes up, and the site keeps them apart:
  - *Time as a dimension* (spacetime) — established physics (relativity).
  - *A 4th direction of space* — hypothetical. String theory's extra dimensions are
    all spatial, but curled up small enough that no experiment has detected them.
- **The extra dimensions have no individual meaning or order.** They are one shape, not
  a numbered stack; "the 6th" is no different from "the 7th". The popular ladder where
  each higher dimension is a space of "possibilities" is not physics, and the video says so.
- The UI therefore counts **space dimensions 0–10** and always shows the tag
  `N space + 1 time`. The top of the ladder reads `10 space + 1 time = 11`.

That gives three regimes, each shown the way physics says it exists:

| Regime | Space dims | How we show it | Physics status |
|---|---|---|---|
| Worlds you can live in | 0–4 | Fully simulated, walk around | Exact generalisation of Newtonian mechanics to N dimensions |
| Time | the "+1" | As a visible axis (all of history as a solid) | Established (relativity); the all-at-once picture is an interpretation |
| Curled-up dimensions | 4–10, as 3 large + the rest curled | Zoom in until they appear | Exact maths about hypothetical worlds. Kaluza–Klein failed as physics; string and M-theory are unconfirmed — always labelled so |

## 2. The creative ideas (what makes this not like the others)

1. **One world, sliced.** There is a single 4D world. The dimension dropdown only changes
   how much of it your creature can reach and see: a line, a sheet, a room, or all of it.
   So when you are a flat creature and a ball rolls through your sheet, you really see a
   dot grow into a disc and shrink — it is not an animation, it is the same simulated
   ball. Switching dimension keeps the world and just frees one more direction.
2. **Your eye has one dimension fewer than your world.** In first person a 2D creature
   sees a single *line* of pixels; a 1D creature sees one pixel. A 4D creature's retina is
   a 3D *volume* — we render that volume as a glowing cube of "sight" you can turn over in
   your hands. This is the honest answer to "what would a 4D being see".
3. **You already see a 4D object: one slice at a time.** A flat creature watching a
   ball pass through sees a circle that changes. You, watching anything change, are doing
   the same thing to spacetime. The *Time* view stacks every moment of a 1D or 2D world
   into a solid sculpture you can orbit (worldlines become threads, light becomes a
   literal cone), then drags a "now" sheet through it. Relativity tilts that sheet.
4. **The laws change with dimension.** Same experiment, different universe: throw a
   planet, clap your hands, light a lamp, let a drunk wander. Only 3D has orbits that
   close and sound that arrives both sharp and undistorted. This is the "why are we 3D?"
   moment of the video.
5. **Past 3: zoom, do not walk.** Every real proposal keeps our three large dimensions
   and adds curled ones. A hose looks like a line until you zoom in and find a circle at
   every point. A particle running around that hidden circle looks, from far away, like a
   particle with charge and mass — Kaluza–Klein theory, which is beautiful and gets the
   electron's mass wrong by a factor of 10²¹ (itself a great scene). Then two circles,
   then the six-dimensional Calabi–Yau shape of string theory, where a string can also
   *wrap* a hidden circle, and a tiny circle turns out to be the same as a huge one.
6. **Missions.** Small game goals that can only be solved with the next dimension:
   escape a sealed room by stepping around its wall, untie a knot, turn a left hand into
   a right hand, keep a planet alive for 30 seconds in 4D.
7. **The lift.** Changing dimension is one continuous camera move out of the old world
   into the new direction. It is the signature transition and the best footage.

## 3. The interface

One thin bar at the top — a Play button and three dropdowns, nothing else:

`▶ Play` · `Dimension ▾` · `Experience ▾` · `View ▾`

- **Play** — every scene opens still. You can orbit, zoom and move around it while
  paused, then press Play (or `P`) to let time run.
- **Dimension** — 0 to 10 space dimensions.
- **Experience** — what is on offer in that dimension (World, Lab experiments, Missions,
  and the Hypercube, which stays as one option in every dimension).
- **View** — the lens:

| View | What it is |
|---|---|
| **Be it** | First person, through the creature's own (N−1)-dimensional eye |
| **Watch it** | Third person from one dimension up — you see inside closed things |
| **Slice** | A higher-dimensional thing passing through your world |
| **Shadow** | Projection down to what a screen can show |
| **Time** | All of history at once, as a solid |
| **Zoom** | Into the curled-up dimensions (5–10) |

Plus a one-line caption bottom-left saying what is physically real in the scene, and the
`N space + 1 time` tag. `H` hides everything for clean footage. Every view is a URL, so a
shot in the video can be reopened exactly.

Controls: `A/D` x · `Space/Shift` y · `W/S` z · `Q/E` the 4th direction · drag to orbit ·
scroll to zoom · right-drag to move · `P` play/pause · `H` hide the interface.

## 4. Experiences by dimension

| Space dims | World | Lab | Notes |
|---|---|---|---|
| 0 | A point. Nothing can move. | — | 10-second scene; sets up the ladder |
| 1 | Lineland: you can never pass your neighbour | Wave on a line, random walk | Eye = 1 pixel |
| 2 | Flatland sheet in the same world | Orbits (1/r) that never close, a clap with a tail, random walk | Eye = 1 line; a gut would cut you in half |
| 3 | The room | Closed orbits (1/r²), sharp clap, random walk escapes | Baseline everyone knows |
| 3 + time | History of the 1D and 2D worlds as a solid | Light cone, twin paradox, tilted "now" | The real "4th dimension" of physics |
| 4, all large | Full 4D world; slice, shadow, 3D retina | Orbits drift away (1/r³), double rotation, knotted loops fall open | Fully simulated. A geometry world, not a physics proposal |
| 4, as 3 + 1 curled | Kaluza–Klein: one hidden circle | Charge and mass from hidden momentum, and why it fails for the electron | Exact maths; failed as physics |
| 5, as 3 + 2 curled | Two hidden circles (a torus) | Two charges; the torus's shape as a dial | Toy world |
| 6–8 | Higher tori; gravity leaking off a sheet (brane world) | The force law changing with distance | Toy worlds. "Nature does not add dimensions one at a time" |
| 9 (+1 = 10) | 3 large + a Calabi–Yau slice at every point | A string moving around and wrapping a circle; small = large (T-duality) | Superstring theory |
| 10 (+1 = 11) | M-theory: for one kind of string, it was a membrane all along | The 11th dimension opens as strings interact more strongly | Finale |

The Hypercube stays available in every dimension. Geometry curiosities (ball volume,
cube corners) live in the Lab, not on the curled rungs.

## 5. Technical decisions

- **Stack:** Vite + TypeScript + Three.js, Vitest for tests. No UI framework — the UI is
  three `<select>` elements. Builds to a static site, hostable anywhere for free.
- **MuJoCo: not used.** It is free to use (Apache-2.0) and has an official browser build,
  but it simulates 3D rigid bodies only. It cannot do 4D at all, so we need our own
  N-dimensional engine regardless, and one engine for every dimension is what makes the
  dimensions comparable. Revisit only if we want a showpiece 3D-only scene (e.g. a
  walking robot); nothing in this plan needs it.
- **Our own N-D physics core.** Everything is particles joined by stiff links. Newton's
  laws for particles are the same in any number of dimensions, so rotation — including
  4D double rotation — falls out for free with no special maths. Fixed 120 Hz step,
  fully deterministic, covered by tests that check real physics (energy, momentum,
  orbit stability per dimension).
- **One renderer for all dimensions: signed-distance ray marching.** The world is a short
  list of N-D shapes. Slicing a 4D world to 3D is just fixing one coordinate inside the
  shader, so there is no 4D mesh code, and soft shadows and glow come free. Three.js
  lines/meshes are used only for worldlines, shadows and the Calabi–Yau surface.
  *Risk: GPU cost of the 4D "3D retina" view — spike it first in Phase 2.*
- **Capture for the video.** Because physics is deterministic, a take is just the
  recorded key presses. Play it like a game at normal quality, then replay the same take
  offline at 4K/60 and save a PNG sequence into a folder (Chrome's folder picker — no
  extra software), which DaVinci Resolve imports directly.

## 6. Folder structure

```
PLAN.md  CLAUDE.md  README.md
docs/PHYSICS.md  docs/DESIGN.md
index.html
src/
  contracts.ts   shared types between all parts (orchestrator-owned)
  main.ts        boot
  styles.css     design tokens + UI styles
  core/          N-D maths + physics. Pure, no DOM, tested.
  render/        lenses: turn a world into pixels (shaders, projections)
  scenes/        one file per experience
  app/           render loop, input, URL state
  ui/            top bar, caption
  capture/       record / replay / export frames
```

## 7. Phases

| # | Phase | Done when |
|---|---|---|
| 0 | **Foundations** — scaffold, contracts, N-D physics core, app shell + top bar | Tests green; site opens; dropdowns switch a placeholder N-cube for every dimension |
| 1 | **First playable** — ray-march renderer; the sliced world in 1D, 2D, 3D; Be it / Watch it | You can walk the creature in 1D–3D and switch dimension without the world resetting |
| 2 | **4D** — slice, shadow, 3D retina; first missions | Escape-the-room works in 2D→3D and 3D→4D |
| 3 | **Time** — block universe, light cone, tilted "now" | 2D world history renders as a solid you can scrub |
| 4 | **Lab** — orbits, clap, lamp, random walk across dimensions | Each experiment runs in 1D–4D from one parameter |
| 5 | **Curled-up dimensions** — Kaluza–Klein circle, torus, brane-world leak, Calabi–Yau slice, string on a circle, M-theory | Ladder complete to 10 + 1 |
| 6 | **Capture** — record, replay, 4K PNG export | A 10-second take replays identically and lands in Resolve |
| 7 | **Polish + publish** — design critique, accessibility, performance, deploy | Public URL |

Capture (6) can be pulled forward as soon as footage is needed; it only depends on Phase 0.

## 8. Open questions

1. **Counting.** Is "space 0–10, plus time" right for the video's script, or does the
   script count 1–11 with time as number 4? (Recommended: the former; it is what the
   physics says and avoids the usual confusion.)
2. **Scope of the top end.** Dimensions 6–8 are quick steps in this plan. Enough, or
   does the video dwell on each?
3. **Audience device.** Desktop-first with a simplified phone version, or phone-first?
   (4D views are GPU-heavy.)

## 9. Risks

- 4D retina view may be too heavy for laptops → fall back to lower voxel count; spike early.
- "Real physics" at 5–10 is real maths about unconfirmed theory → captions always say so.
- Newtonian "gravity" in 2D is an analogy (see PHYSICS.md) → Lab uses the wording there.
- Engine cost: the heaviest test scene (20 creatures, 20 balls, 4D) takes about 6.5 ms
  per step after the contact and friction fixes → keep scenes small; reusing contact
  impulses between substeps is the known remedy if a scene needs more.
