# Physics reference (short form)

The single source of truth for what the site simulates and what the video may claim.
Every law a scene uses must be listed here first. `n` = number of **space** dimensions.

The long form — derivations, exact formulas, simulation recipes and sources — is in:

- [theory/large-dimensions.md](theory/large-dimensions.md): worlds whose dimensions are
  all large, and time
- [theory/string-theory.md](theory/string-theory.md): curled-up dimensions, strings,
  M-theory, and what experiments say

**The status sentence for the whole project:** no experiment has ever found evidence of an
extra space dimension, of strings, or of supersymmetry. String theory and M-theory are
mathematically developed proposals; the extra dimensions they need are hypothetical.

Honesty levels used below and in on-screen captions:

- **Exact** — standard physics or mathematics, generalised without assumptions.
- **Analogy** — a consistent generalisation or teaching device, not a claim about nature.
- **Theory** — mathematically developed, experimentally unconfirmed.

## Counting

| Theory | Total | Space | Time | Where the number comes from |
|---|---|---|---|---|
| Everyday relativity | 4 | 3 | 1 | Observation |
| Kaluza–Klein | 5 | 4 = 3 large + 1 circle | 1 | Kaluza (1921) added the dimension; Klein (1926) made it a circle |
| Superstring theory | 10 | 9 | 1 | Quantum consistency: `(3/2)·D − 15 = 0` |
| M-theory | 11 | 10 | 1 | The largest dimension that allows supersymmetry without spins above 2 |
| Bosonic string theory | 26 | 25 | 1 | `D − 26 = 0`; it has no matter particles and is unstable, so it is not our world |

What the video must get right:

- **Time is one of the dimensions but not a direction of space.** You cannot turn around
  in it, and distances mix with a minus sign (`ds² = −c²dt² + dx² + …`). Every theory
  above has exactly one.
- **The extra dimensions are ordinary directions of space** — they have lengths, and
  things can move along them. They are not "possibilities", "timelines" or "probability".
  The popular ladder in which the 5th dimension is "possible futures" and the 10th is
  "everything" is not physics.
- **They have no individual identity or order.** The six extra dimensions of string
  theory are one six-dimensional shape; nothing distinguishes "the 6th" from "the 7th",
  any more than x from y. Never draw them as a numbered stack.
- **Six or seven are curled only if our three are the only large ones.** The theories are
  consistent in ten or eleven flat dimensions; curling is what would hide the rest.
- **Their size is unknown.** Experiments give upper limits only: under about 30 μm if only
  gravity reaches them, under about 10⁻¹⁹ m if ordinary particles do. Say "small enough
  that no experiment has detected them", not "far too small".

## Laws that change with n (all dimensions large)

| Topic | Rule | n=1 | n=2 | n=3 | n=4 | Level |
|---|---|---|---|---|---|---|
| Force from a point source (Gauss's law) | F ∝ 1/r^(n−1) | constant | 1/r | 1/r² | 1/r³ | Exact for electric force. For gravity see the note below |
| Potential | — | ∝ \|x\| | ∝ ln r | ∝ −1/r | ∝ −1/r² | same |
| Circular orbits | stable only for n < 4 | — | stable, never escape, do not close (rosettes) | stable, closed ellipses | borderline: any nudge → slow spiral in or drift away | Exact (given the force law) |
| Brightness of a lamp | ∝ 1/r^(n−1) | never dims | 1/r | 1/r² | 1/r³ | Exact |
| A clap heard far away | sharp only for odd n ≥ 3 | arrives unchanged (a net push leaves a permanent step) | a smooth tail that never quite ends — no echoes | sharp and undistorted | a tail again (opposite sign, fading as t⁻³) | Exact |
| Random walk returns home (Pólya, cubic lattice) | certain only for n ≤ 2 | 100% | 100% | 34.05% | 19.32% | Exact |
| Independent rotations | n(n−1)/2 | 0 | 1 | 3 | 6 | Exact |
| Planes a body can spin in at once | ⌊n/2⌋ | 0 | 1 | 1 | 2 | Exact |
| Knotted loops | only in n = 3 | — | every loop is unknotted | knots | every loop falls open | Exact |
| A creature's retina | has n−1 dimensions | a point | a line | an image | a volume | Exact (geometry) |
| Mirror image | a turn through dimension n+1 flips handedness | | | | | Exact |
| Thermal energy per particle (classical gas of single atoms) | (n/2)·k·T | ½kT | kT | 3⁄2 kT | 2kT | Exact |
| Atoms (point nucleus, Gauss-law force) | stable chemistry only at n = 3 | — | every electron is bound forever; nothing can be ionised | yes | none: no bound state, or the electron falls to the centre | Exact under those assumptions |

Notes that the video must respect:

- **Gravity.** For n ≥ 3 the Gauss-law force is the weak-field limit of general
  relativity in n + 1 dimensions: a consistent analogy. For n = 2 general relativity
  disagrees: resting masses do not attract at all. Space around a mass is a cone (the
  missing angle is 8πGm) and moving bodies are bent as if by a lens. For n = 1 general
  relativity says nothing. On screen, call the 2D orbit experiment "a 1/r force" or
  "electric attraction", not "gravity in Flatland".
- **Orbits.** Only 3D has orbits that close into ellipses (Bertrand's theorem). 2D orbits
  are stable but do not close. In 4D the radius obeys `r″ = (L² − GM)/r³` exactly, so
  `r(t)² = r₀² + 2·r₀·ṙ₀·t + 2E·t²`: the drift is steady, never explosive; a fall reaches
  the centre in finite time after infinitely many turns; and circular orbits exist at
  every radius for the single value L² = GM. Explosive instability starts at n = 5.
- **Sound.** Only 3D is both sharp and undistorted. 5D is sharp but the far listener
  hears the *rate of change* of the clap. Never say "echo" or "reverberation" for 2D.
- **Rotation happens in a plane, not around an axis.** A simple 4D rotation leaves a
  whole plane fixed; a double rotation (two independent planes at once) fixes only the
  centre. The engine does not special-case this; it emerges from particles and links.
- **Knots.** Say "no knotted loops in 4D", never "no knots in 4D": knotted spheres exist.
- **A 2D body cannot have a tube open along its whole length** — it would be two pieces.
- **Comparing dimensions fairly (Lab convention).** Match the force at the starting
  radius: `F = (GMm/r₀²)·(r₀/r)^(n−1)`. The starting circular orbit then has the same
  speed and period in every n, so every difference on screen comes from the shape of the
  law alone.
- **"Why 3 + 1?"** The stability arguments (Ehrenfest 1917, Tegmark 1997) are arguments,
  not theorems. The one-time argument in particular has known loopholes.

## Geometry trivia (not physics)

`V_n = π^(n/2) / Γ(n/2 + 1)` for a ball of radius 1: 2.00, 3.14, 4.19, 4.93, **5.26**
(n = 5), 5.17, 4.72, 4.06, 3.30, 2.55 (n = 10), then on toward zero. The surface area
peaks at n = 7. Both peaks depend on choosing radius 1 — volumes in different dimensions
have different units — so present them as curiosities. What is unit-free: in high
dimensions almost all of a ball's volume sits in a thin shell at its surface, and a cube
of side 2 has corners √n from its centre while its faces stay at distance 1. Level: Exact.

## Time (relativity) — Level: Exact

- A thing's history is a **worldline**. In a picture of a 2D world's history, light from
  an event is a literal cone. Massive things stay inside it; light travels on it.
- Which events count as "now" depends on the observer's motion: for someone moving at
  speed v the slice of simultaneous events is tilted. That part is physics.
- Showing all of history at once as a solid (the "block universe") is a **picture and an
  interpretation**, not a measured fact. Caption it that way.
- Time elapsed for a traveller is the length of their worldline measured with the minus
  sign: `dτ² = dt² − dx²/c²`. The straight path is the *longest* (twin paradox).

## Curled-up dimensions

**Site convention:** past 4, a world with N space dimensions means **3 large + (N − 3)
curled**. The on-screen tag stays `N space + 1 time`, as everywhere; the scene's caption
says `3 large + k curled`. Worlds with 5–8 are toy Kaluza–Klein
worlds: exact mathematics, not proposals about nature. String theory always has 9 in
total and M-theory 10. Caption for the middle rungs: *nature does not add dimensions one
at a time.*

- **Kaluza–Klein (3 large + 1 circle of radius R).** Level: Exact maths; **failed as
  physics.** Five-dimensional gravity looks, from far away, like four-dimensional gravity
  plus electromagnetism *plus an extra massless field that is not observed*. Momentum
  around the circle is quantised, `p = k·ħ/R`, and appears as electric charge
  `q = k·√(16πG)/R` and mass `m = |k|·ħ/(R·c)`. To carry the electron's charge the circle
  must be about 23 Planck lengths around (3.8×10⁻³⁴ m) — and the particle then weighs
  about 5×10¹⁷ GeV, some 10²¹ times too heavy. A beautiful idea that does not describe
  the electron.
- **Tori (3 large + 2 or more circles).** Level: Exact maths, toy worlds. Each circle
  gives its own charge; `m² = (k₁/R₁)² + (k₂/R₂)² + …`. A torus cannot produce the
  particles we observe.
- **Strings (9 + 1).** Level: Theory. Every particle would be a tiny string. All known
  particles would be the *lowest* level of the string; what tells them apart is how the
  string sits in the hidden dimensions, not the pitch of its vibration. The higher
  harmonics are a tower of enormously heavy states nobody has seen. Do not say "each
  particle is a different note".
- **A string on a circle.** Level: Exact maths. A string can move around the circle
  (number k) and also *wrap* it (number w):
  `M² = (k/R)² + (w·R/α′)² + (2/α′)·(N + Ñ − 2)`. Swapping `R ↔ α′/R` and `k ↔ w` gives
  exactly the same physics (T-duality): to a string, a very small circle is the same as
  a very large one.
- **Calabi–Yau spaces.** Level: Theory. One leading option for the six curled
  dimensions, in some versions of the theory. The shape, *together with other choices*,
  would fix which particles exist; there are at least hundreds of millions of candidate
  shapes. A Calabi–Yau has no circle directions at all. Required label for the familiar
  picture: *"A 2D slice of the 6D Calabi–Yau quintic, drawn in 4D and projected to 3D.
  Not to scale, not the real metric. Whether our universe has such a space is unknown."*
- **M-theory (10 + 1).** Level: Theory. For type IIA strings, the string is a membrane
  wrapped around one more circle whose radius is `R₁₁ = g·ℓ` (string coupling × string
  length): the eleventh dimension opens as strings interact more strongly. For another
  string theory (heterotic E₈×E₈) the extra dimension is a line segment with a wall at
  each end, not a circle.
- **Brane worlds.** Level: Theory. Matter and light could be stuck to a 3D surface while
  only gravity spreads into the extra dimensions. The site's "one world, sliced" mode is
  an analogy for this, not a model of it: see below.

## What the engine does

- Newton's second law per particle with n-component vectors (Exact for any n).
- Bodies are particles joined by stiff links, so they are very slightly soft: measured
  stretch is about 1 part in 10⁷ for a free spinning body and up to 1 part in 10⁴ for a
  moment during an impact. Nobody may say "perfectly rigid" on screen. A linked body
  returns 99.3–99.8% of the ideal bounce.
- Fixed step of 1/120 s (8 substeps). Results are reproducible bit-for-bit on the same
  machine; across machines and browsers this is not yet verified.
- Known limits: a ball faster than about 96 m/s (radius 0.1) can pass through a wall; near
  a 4D orbital collapse speeds diverge, so a run must stop at a collision radius;
  bodies resting on other bodies, friction between a body and a box, and friction on a
  confined body are not yet tested.
- **"One world, sliced"** confines a creature to a line or sheet inside the 4D world. It
  teaches geometry and perception. It is **not** a universe that truly has fewer
  dimensions (the force laws above would differ — the Lab shows that), and it is **not**
  brane-world physics: on a real brane the forces are confined too, and nothing made of
  ordinary matter exists off it to come passing through.
