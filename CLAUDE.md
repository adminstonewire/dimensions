# Dimensions — rules for anyone writing code here

Interactive site simulating worlds of 0–10 space dimensions with real physics; also the
footage source for a science video. Read `PLAN.md` for scope, `docs/PHYSICS.md` for the
science, `docs/DESIGN.md` for the look.

## Commands

```bash
npm run dev      # local site
npm run check    # typecheck
npm test         # vitest
npm run build    # typecheck + production build
```

## Stack

Vite, TypeScript (strict), Three.js, Vitest. Nothing else. **Do not add a dependency**
without asking the orchestrator; say what you need and why in your report instead.

## Who owns what

| Path | Contents | Rule |
|---|---|---|
| `src/contracts.ts` | Types shared by all parts | Orchestrator only. Need a change? Report it. |
| `src/styles.css` (tokens block) | Colour and type tokens | Orchestrator only. UI styles go below the tokens. |
| `src/core/` | N-D maths and physics | Pure TypeScript. No DOM, no Three.js, no imports from other `src/` folders except `contracts.ts`. |
| `src/render/` | Lenses: world → pixels | May import `core`. |
| `src/scenes/` | One file per experience | May import `core` and `render`. |
| `src/app/`, `src/ui/`, `src/capture/` | Loop, input, URL state, top bar, recording | Must not contain physics. |

Stay inside the folder you were given.

## Non-negotiables

1. **Real physics.** A scene may only use laws listed in `docs/PHYSICS.md`. Never tune a
   result to look right. If something is approximate, say so in a code comment and in the
   scene's `caption`.
2. **Deterministic.** Simulation advances only in fixed `STEP`s from `contracts.ts`. No
   `Math.random()` (use the seeded generator in `core`), no clocks, no frame-time inside
   physics. The same inputs must give bit-identical state — video capture depends on it.
3. **Dimension-generic.** Core code takes the dimension as a number. No `Vector3`/`Vector4`
   in physics, no copy-pasted 2D/3D/4D variants.
4. **Least code that fully works.** No speculative options, wrappers or config. One small
   test for any non-trivial logic. Comments explain why, not what.
5. **Design tokens only.** No hard-coded colours outside `styles.css`.
6. **No git commits or pushes** unless the project owner asks.

## Conventions

- Vectors are `Float64Array` of length `dim`. Axis order is x, y, z, w; **y is up**.
- "Dimension" in code and UI always means number of *space* dimensions.
- The project path contains spaces — quote it in shell commands.
