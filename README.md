# Dimensions

Walk through worlds of 0 to 10 space dimensions, simulated with real physics. Built as a
free interactive site and as the footage source for a science video on the 11 dimensions
of M-theory.

**Status:** early. The N-dimensional physics engine and the app shell work; the worlds,
views and experiments in [PLAN.md](PLAN.md) are being built on top of them.

## Run it

```bash
npm install
npm run dev
```

`npm test` runs the physics tests (energy, momentum, orbits per dimension, 4D double
rotation, determinism). Every scene opens paused: drag to orbit, scroll to zoom, press
**Play** or `P` to let time run.

## What is real here

Every law a scene uses is listed, with its sources and its limits, before it is drawn:

- [docs/PHYSICS.md](docs/PHYSICS.md) — the short reference and what the video may claim
- [docs/theory/](docs/theory/) — the long form: mechanics, waves and relativity in N
  dimensions, and what string theory and M-theory actually say about the extra ones

What exists today: the engine, which applies Newton's laws to particles in any number of
dimensions (exact for particles; bodies built from them are very slightly soft, see
docs/PHYSICS.md), and one scene, the shadow of an N-cube, in every dimension from 0 to 10.

What is planned: worlds of 1 to 4 space dimensions you can walk through; time shown as
relativity describes it; and dimensions past 4 shown the way string theory says they
would exist — curled up — and always labelled as unconfirmed theory.

## Project docs

- [PLAN.md](PLAN.md) — what is being built and in what order
- [docs/DESIGN.md](docs/DESIGN.md) — the look
- [CLAUDE.md](CLAUDE.md) — rules for writing code here

## Licence

Free to use, change and build into your own apps and projects. You may not sell it, or
sell a product or service whose value comes entirely or substantially from it. Legally: MIT with the Commons Clause —
see [LICENSE](LICENSE). That makes it source-available rather than "open source" in the
strict sense.
