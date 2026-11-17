# Large dimensions: physics reference

Scope: worlds whose $N$ space dimensions are all large (not curled up), for $N = 0 \dots 5$
and general $N$, plus time as a dimension. Curled-up dimensions, Kaluza–Klein, strings and
M-theory are covered in a separate file.

Notation: $N$ = number of space dimensions (the `n` of `docs/PHYSICS.md`); $D = N+1$ =
spacetime dimension. $S_{N-1} = 2\pi^{N/2}/\Gamma(N/2)$ is the area of the unit sphere that
bounds the unit $N$-ball ($S_0 = 2,\ S_1 = 2\pi,\ S_2 = 4\pi,\ S_3 = 2\pi^2$).

Honesty levels (as in `docs/PHYSICS.md`): **Exact** = standard physics or mathematics,
generalised without extra assumptions. **Analogy** = a consistent generalisation that our
universe gives us no way to test. **Theory** = developed mathematically, not confirmed by
experiment. A tag of the form "Exact given X" means the mathematics is exact once X is assumed.

Source keys like [Tegmark97] point to the Sources section at the end. "(derived)" means I
worked it out myself and checked it; "(no source read)" means it is a standard result that I
did not look up for this document.

---

## 1. What a dimension is

**Statement.** The dimension of a space is the number of independent real coordinates needed
to label its points *continuously*. Formally, an $N$-dimensional manifold is a space that looks
locally like $\mathbb{R}^N$. Dimension is a topological invariant: $\mathbb{R}^m$ and
$\mathbb{R}^n$ are not homeomorphic when $m \ne n$ (Brouwer's invariance of domain, no source
read). Continuity matters: space-filling curves show that one real number can label every point
of a square if continuity is dropped, so "how many numbers" alone is not the definition.

**Dimensions of space vs degrees of freedom.** A system of $k$ particles in $N$-D space has a
$kN$-dimensional configuration space. That is not a world with $kN$ space dimensions.
Pop-science "dimensions" that are really parameters (colour, temperature) are degrees of
freedom, not directions you could move in.

| $N$ | What it is | Exact facts the site can show |
|---|---|---|
| 0 | A point | No motion and no direction. The configuration space of a particle is a single point. |
| 1 | A line (Lineland) | Bodies keep their order: to pass a neighbour, a continuous path would have to occupy the neighbour's position (intermediate value theorem). An eye at each end of a 1D creature sees one point, so its retina is 0-dimensional. |
| 2 | A plane (Flatland) | A tube running right through a 2D body cuts the body into two disconnected pieces. Some wiring diagrams ($K_5$, $K_{3,3}$) cannot be drawn without crossings (Kuratowski, no source read). The retina is a line (1D). |
| 3 | Our space | Circles can be knotted. The retina is a 2D image. |
| 4 | 4-space | Every knotted circle can be untied. The retina is a 3D volume. A mirror image can be produced by rotating through the extra direction. |

**Retina rule (Exact, geometry).** An eye records directions of incoming light. The set of
directions in $N$-D is the sphere $S^{N-1}$, which is $(N-1)$-dimensional, and a camera projects
the scene onto an $(N-1)$-dimensional sensor. So an $N$-D creature's retina is
$(N-1)$-dimensional: a point, a line, an image, a volume.

**Mirror images (Exact).** A reflection of $\mathbb{R}^N$ (for example $x_1 \to -x_1$) has
determinant $-1$, so no rotation inside $\mathbb{R}^N$ produces it. Embed $\mathbb{R}^N$ in
$\mathbb{R}^{N+1}$ and rotate by $\pi$ in the $(x_1, x_{N+1})$ plane: this maps
$x_1 \to -x_1$ and returns the object to the original $N$-space. So a left hand becomes a right
hand by turning it through one extra dimension.

**Knots (Exact, topology).** [Wiki-Knot] points to the primary results.

| Ambient $N$ | Closed loops (circles) | Notes |
|---|---|---|
| 2 | Never knotted | Every simple closed curve in the plane bounds a disc (Jordan–Schoenflies, no source read). |
| 3 | Knots exist | The trefoil cannot be untied. |
| 4 | Every loop can be untied | Codimension 3: PL and topological spheres are unknotted in codimension $\ge 3$ (Zeeman, Stallings); the smooth criterion $2n-3k-3>0$ gives $2\cdot4-3-3 = 2 > 0$. |
| 4 | **2-spheres can be knotted** | Knotted 2-spheres in $\mathbb{R}^4$ exist (spun knots). |

General rule: PL $k$-spheres knot only in dimension $k+2$ (Zeeman 1963, via [Wiki-Knot]).
Smooth spheres can also knot in some higher codimensions (Haefliger).

**Misconceptions to avoid.**
- "There are no knots in 4D." Wrong: loops untie, but knotted surfaces exist.
- "Time is the 4th dimension, so 4D space means time." No: time is the "+1" of spacetime, not a
  fourth direction of space.
- "A 2D creature cannot have a gut." Precise version: it cannot have a gut that is open along
  its whole length at one time. A gut with zipper-like seals that open in sequence keeps the
  body connected. (Dewdney's *Planiverse* uses this; not read for this document.)
- "2D brains are impossible because nerves cannot cross." Not established. Planarity limits
  wiring, but signals can be passed through junctions; planar logic circuits are known to be
  able to emulate crossings with XOR gadgets (circuit-complexity folklore; I did not verify a
  source). Tegmark [Tegmark97] calls these "topological problems" and does not claim a proof.

---

## 2. Newtonian mechanics with a Gauss-law force

### 2.1 Force and potential (Exact as mathematics; physical status below)

Gauss's law says the flux of the field through any sphere around a point source is the same.
A sphere of radius $r$ in $N$-D has area $S_{N-1} r^{N-1}$, so

$$\nabla^2\Phi = S_{N-1}\,G_N\,\rho \quad\Rightarrow\quad \mathbf g = -\frac{G_N M}{r^{N-1}}\hat{\mathbf r},$$

$$\Phi_N(r) = \begin{cases} G_1 M\,|x| & N=1\\ G_2 M \ln(r/r_0) & N=2\\ -\dfrac{G_N M}{(N-2)\,r^{N-2}} & N\ge 3\end{cases}$$

Check for $N=1$: $\Phi'' = 2G_1 M\,\delta(x)$ with $S_0 = 2$ gives $\Phi = G_1 M|x|$ (derived).

**Physical status of "gravity" for each $N$.** Linearised general relativity in $D$ spacetime
dimensions gives $\nabla^2 h_{00}$ proportional to $16\pi G\,\frac{D-3}{D-2}\,\rho$ (derived:
trace reversal gives $h_{00} = \bar h_{00}\,(D-3)/(D-2)$). Hence:

- $N \ge 3$: the Newtonian $1/r^{N-1}$ force *is* the weak-field limit of GR in $N+1$
  (Tangherlini metric, §6). **Analogy** for $N\ne3$, but a consistent one.
- $N = 2$: the factor $(D-3)$ vanishes. GR in 2+1 has **no** Newtonian limit [Carlip05], so a
  $1/r$ "gravity" contradicts GR. Call it "a $1/r$ force" or "2D electrostatics".
- $N = 1$: GR is empty (§6). 1D Newtonian gravity is still physical as a model of infinite
  parallel sheets in our 3D world.
- Electrostatics: the same law follows from Maxwell's equations in $N+1$ (§5). It is realised
  in our world by long line charges ($N=2$) and charged planes ($N=1$).

### 2.2 Orbits: equations (Exact given the force law)

A central force keeps a particle in the plane spanned by $\mathbf r$ and $\mathbf v$, in any $N$:
the angular-momentum bivector $\mathbf r\wedge\mathbf v$ is conserved (§3). So every two-body
orbit is planar. Per unit mass, with $\mu = G_N M$ and specific angular momentum $L$:

$$\ddot r = \frac{L^2}{r^3} - \frac{\mu}{r^{N-1}},\qquad \dot\theta = \frac{L}{r^2},\qquad U_{\rm eff}(r) = \frac{L^2}{2r^2} + \Phi_N(r).$$

Circular orbit at $r_0$: $L^2 = \mu r_0^{4-N}$, $v_c^2 = \mu/r_0^{N-2}$, orbital frequency
$\Omega^2 = \mu/r_0^N$. Small radial oscillations have frequency $\kappa$ with (derived)

$$\kappa^2 = U_{\rm eff}''(r_0) = (4-N)\,\Omega^2 .$$

This one line contains the whole stability story:

| $N$ | $\kappa/\Omega$ | Circular orbits | Apsidal angle (peri→apo) | Period law | Escape |
|---|---|---|---|---|---|
| 1 | — | none (no angle) | — | oscillation, $T = 4\sqrt{2A/\mu}$ for amplitude $A$ | never: $\Phi\to\infty$ |
| 2 | $\sqrt2$ | **stable** | $\pi/\sqrt2 = 127.28^\circ$ (near-circular) | $T \propto r$ ($v_c=\sqrt{G_2M}$, the same at every radius) | never: $\ln r\to\infty$ |
| 3 | $1$ | stable | $180^\circ$: closed ellipses | $T^2\propto r^3$ | $v_{\rm esc}=\sqrt2\,v_c$ |
| 4 | $0$ | **marginal**: drift is polynomial | — | $T\propto r^2$ | $v_{\rm esc}=v_c$: circular orbits have exactly $E=0$ |
| $\ge5$ | imaginary | unstable, e-folding rate $\sqrt{N-4}\,\Omega$ | — | $T^2\propto r^N$ | $v_{\rm esc}<v_c$ |

General rules (derived): $T^2 = 4\pi^2 r^N/(G_N M)$, and $v_{\rm esc}/v_c = \sqrt{2/(N-2)}$ for $N\ge3$.

**Bertrand's theorem (1873)** [Wiki-Bertrand, SantosSoaresTort08]: the only central potentials
for which *every* bounded orbit closes are $-k/r$ and $kr^2$. Among Gauss-law potentials
($\propto r^{2-N}$, $\ln r$, $|x|$), only $N=3$ qualifies. A 2D orbit closes only in special
cases (rational apsidal ratio); its apsidal angle depends on the amplitude, so generic orbits
are rosettes.

### 2.3 The 4D case exactly (Cotes's spirals)

For $N=4$, $\Phi = -\mu/(2r^2)$ and the radial equation is **exactly**

$$\ddot r = \frac{A}{r^3},\qquad A \equiv L^2-\mu .$$

The energy $E = \tfrac12\dot r^2 + A/(2r^2)$ is conserved, and
$\frac{d^2}{dt^2}(r^2) = 2\dot r^2 + 2r\ddot r = 4E$, so (derived; checked against RK4 to 6 digits)

$$r(t)^2 = r_0^2 + 2r_0\dot r_0\,t + 2E\,t^2 .$$

- $A=0$ ($L^2=\mu$, independent of radius): $r = r_0 + \dot r_0 t$, so the drift is **exactly
  linear**. Every radius is a circular orbit for that single value of $L$: neutral equilibrium.
  Ehrenfest already noted that in $R_4$ the circular orbit fixes the angular momentum to one
  value [Ehrenfest17].
- Radial kick $\delta$ at $A=0$: $r=r_0\pm\delta t$. Outward the particle leaves linearly; inward
  it reaches $r=0$ at $t^*=r_0/\delta$.
- Speed kick ($A\ne0$, $\dot r_0=0$): $r^2 = r_0^2 + (A/r_0^2)t^2$. The departure starts
  *quadratically*, $r-r_0\approx At^2/(2r_0^3)$, then becomes linear outward ($A>0$), or the
  particle collapses at the finite time $t^* = r_0^2/\sqrt{-A}$ ($A<0$).
- Path shapes (Binet: $u''+(1-\mu/L^2)u=0$, $u=1/r$), the Cotes's spirals [Wiki-Cotes]:
  $A>0$: $1/r = C\cos k\theta$ (the particle escapes after a finite total sweep $\pi/2k$);
  $A=0$: $1/r = a+b\theta$ (hyperbolic spiral); $A<0$: $1/r = C\cosh k\theta$ (Poinsot spiral,
  infinitely many turns before the centre, reached in finite time).

So the engineer's claim is **right**, with one refinement: the growth is polynomial, never
exponential (linear for a radial nudge; quadratic, then linear, for a speed nudge). Inward
collapse takes finite time with $\dot\theta = L/r^2\to\infty$. Tegmark's Fig. 2 shows the same
dichotomy: escape to infinity or collision in finite time [Tegmark97]. In 5D GR
(Schwarzschild–Tangherlini) the marginal case becomes *strictly* unstable (§6).

### 2.4 Comparing $G$ across dimensions (recommended convention)

$G_N$ has different units in each $N$ ($[G_N] = \text{m}^{N}\,\text{kg}^{-1}\,\text{s}^{-2}$), so
"the same $G$" means nothing. Three options:

1. $F = G_N Mm/r^{N-1}$, with the $S_{N-1}$ kept in Poisson's equation (used above). Cleanest
   formulas.
2. $\nabla^2\Phi = 4\pi G\rho$ in every $N$, so $F = 4\pi G Mm/(S_{N-1}r^{N-1})$. Hides an
   $N$-dependent factor; avoid.
3. **Recommended for the Lab:** match the force at the reference radius $r_0$ where the
   experiment starts: $G_N = G\,r_0^{\,N-3}$, i.e. $F_N(r) = \frac{GMm}{r_0^2}\left(\frac{r_0}{r}\right)^{N-1}$.
   The circular orbit at $r_0$ then has the same speed $\sqrt{GM/r_0}$ and the same period in
   every $N$, so any difference the viewer sees comes only from the *shape* of the law. Use
   option 1's formulas with this $G_N$. A grid-based field solver must keep $S_{N-1}$ in
   $\nabla^2\Phi = S_{N-1}G_N\rho$.

### 2.5 What to simulate: orbit Lab

- **Equations:** integrate $\ddot{\mathbf x} = -\mu\,\mathbf x/|\mathbf x|^N$ with $N$-component
  vectors and a symplectic integrator (velocity Verlet or leapfrog). Energy
  $E=\tfrac12 v^2+\Phi_N$ must stay constant to about $10^{-6}$ over many orbits for $N=2,3$.
- **Parameters:** $\mu=1$ (convention 3), $r_0=1$, $v_0 = 1$ tangential. Three runs per $N$:
  exact circular speed; $v_0 = 1.02$; $v_0 = 0.98$.
- **Expected:** $N=2$: a rosette. For small eccentricity, successive periapses are
  $2\times127.3^\circ = 254.6^\circ$ apart in orbital angle, so the pattern turns *backwards* by
  about $105^\circ$ per radial cycle. It never escapes, even at large $v_0$. $N=3$: a closed ellipse. $N=4$: at $v_0=1.02$ it drifts outward slowly (quadratically,
  then linearly; $r(t)$ must match $\sqrt{1+2Et^2}$); at $0.98$ it spirals in and hits the centre
  at $t^*=1/\sqrt{1-0.98^2}\approx5.0$ time units ($A = v_0^2-1$ at $r_0=\mu=1$). $N=5$: departure
  is exponential with rate $\Omega$ (since $\sqrt{N-4}=1$).
- **Engine warnings:** near collapse in $N\ge4$ the speed diverges. A fixed 1/120 s step will
  give wrong results; stop the run at a collision radius (sum of the body radii) and show "impact".
  Never show a fixed-step artefact as a "slingshot".
- **Unit test:** the 4D solution $r(t)^2 = r_0^2+2r_0\dot r_0 t+2Et^2$ is exact; assert it.

**Misconceptions.** "2D has no stable orbits": false, they are stable but do not close. "4D
orbits decay exponentially": false. "4D orbits always crash": false, about half the nudges send
the body away. "Kepler's 3rd law is universal": it becomes $T^2\propto r^N$.

---

## 3. Rotation in $N$ dimensions

**Statements (Exact).**
- Rotations of $\mathbb{R}^N$ form $SO(N)$, of dimension $N(N-1)/2$. That is the number of
  independent *generators*: the coordinate planes $e_i\wedge e_j$, which are the components of
  an angular-velocity or angular-momentum **bivector**.
- Any single rotation, and any angular velocity at an instant, can be brought by a change of
  basis into $\lfloor N/2\rfloor$ mutually orthogonal planes, each with its own angle or rate,
  plus a fixed axis when $N$ is odd [Wiki-Plane]. So a body can spin in at most $\lfloor N/2\rfloor$
  independent planes **at once**.

| $N$ | Generators $N(N-1)/2$ | Simultaneous planes $\lfloor N/2\rfloor$ | Fixed set of a generic rotation |
|---|---|---|---|
| 1 | 0 | 0 | everything |
| 2 | 1 | 1 | the centre |
| 3 | 3 | 1 | an axis |
| 4 | 6 | 2 | the centre only |
| 5 | 10 | 2 | an axis |

**Derivation sketch.** An antisymmetric real matrix $\Omega$ is normal, so it is
block-diagonalised by an orthogonal change of basis into $2\times2$ blocks $\begin{pmatrix}0&-\omega_k\\ \omega_k&0\end{pmatrix}$,
with a zero row left over when $N$ is odd. Hence $\lfloor N/2\rfloor$ planes. The axis in 3D is
an accident of $N=3$: the plane orthogonal to a plane happens to be a line.

**4D rotations** [Wiki-Rot4D, Wiki-Plane]:
- *Simple*: one plane rotates by $\alpha$; the orthogonal plane is fixed point by point.
- *Double*: two orthogonal planes rotate by $\alpha\ne\beta$. Only the centre is fixed, and the
  pair of invariant planes is unique.
- *Isoclinic* ($|\alpha|=|\beta|$): every point moves through the same angle; infinitely many
  invariant planes; left- and right-handed types. Every 4D rotation is a product of one left and
  one right isoclinic rotation (unit quaternions acting from the left and from the right).

**Angular momentum.** $L_{ij} = \sum (x_i p_j - x_j p_i)$, a bivector with $N(N-1)/2$
components; in 3D its Hodge dual is the familiar vector. For one particle $L = x\wedge p$ is
*simple* (a single plane), which is why orbits are planar. In 4D a total $L$ can be non-simple,
$L = L_1 e_{12} + L_2 e_{34}$, with two invariants $L_1^2+L_2^2$ and $L_1L_2$ (the Pfaffian).

**Free rigid body (Euler–Arnold equations)** [Izosimov12]. With mass tensor
$J_{ij} = \int x_ix_j\,dm$ (not the inertia tensor), body-frame angular velocity $\Omega$
(antisymmetric) and angular momentum $M = J\Omega+\Omega J$:

$$\dot M = [M,\Omega],\qquad \Omega_{ij} = \frac{M_{ij}}{J_i+J_j}\ \text{(principal basis)},\qquad H = \tfrac12\sum_{i<j}\frac{M_{ij}^2}{J_i+J_j}.$$

For $N=3$ this is Euler's system with $I_1=J_2+J_3$ and so on. The system is integrable
(Manakov 1976) [Izosimov12]. Sign conventions differ between sources; check yours by verifying
that $H$ and $\operatorname{tr}M^2$ stay constant.

**Stability (Izosimov 2012, for distinct $J_1<J_2<\dots<J_N$, regular rotations):**
- One rotation plane, any $N$: stable **iff** the plane is spanned by two *adjacent* principal
  axes $\langle e_i,e_{i+1}\rangle$. In 3D, $\langle e_1,e_3\rangle$ is rotation about the middle
  axis: the tennis-racket instability.
- 4D double rotations: planes $\langle e_1,e_2\rangle+\langle e_3,e_4\rangle$ are stable;
  $\langle e_1,e_3\rangle+\langle e_2,e_4\rangle$ are unstable; $\langle e_1,e_4\rangle+\langle e_2,e_3\rangle$
  are stable if $\omega_1\ll\omega_2$ and unstable if $\omega_1\gg\omega_2$.

**What to simulate.**
- *Kinematics:* $x(t) = e^{t\Omega}x_0$ with $\Omega_{12}=\omega_1$, $\Omega_{34}=\omega_2$.
  Show a tesseract with $\omega_2=0$ (simple), $\omega_2=0.6\,\omega_1$ (double) and
  $\omega_2=\omega_1$ (isoclinic: every vertex moves at the same speed on a great circle). In the
  3D slice the cross-section changes shape: a slice effect, not deformation.
- *Dynamics test for the particle engine:* a 4D brick with half-sides $1:1.5:2:2.5$ (point masses
  at the 16 vertices give $J_i = m_{\rm tot}a_i^2$), spun in $\langle e_1,e_2\rangle$ with a $10^{-3}$
  perturbation, stays put; spun in $\langle e_1,e_3\rangle$, it tumbles (a 4D tennis racket).
  Compare with the ODE above integrated with RK4.
- *Engine caveat:* links are slightly soft. Any damping in them makes the body drift towards
  the lowest-energy rotation for its fixed $M$ (as Explorer 1 did in 3D), which spoils the
  comparison. Use conservative links for this test.

**Misconceptions.** "4D objects rotate about a plane." Better: they rotate *in* a plane; a simple
rotation leaves a plane fixed, and a general one fixes only the centre. "4D bodies can spin in 6
ways at once": no, 6 generators but only 2 simultaneous planes.

---

## 4. Waves and Huygens' principle

**Equation.** $u_{tt} - c^2\nabla^2u = f(t)\,\delta^N(\mathbf x)$. The listener's signal is
$u(r,t) = \int G_N(r,t-t')f(t')\,dt'$. With $c=1$ (restore by $G_N(r,t) = \tfrac1c G_N^{(c=1)}(r,ct)$):

| $N$ | Retarded Green's function $G_N(r,t)$ | Support |
|---|---|---|
| 1 | $\tfrac12\,\theta(t-|x|)$ | whole interior of the cone: a step |
| 2 | $\dfrac{\theta(t-r)}{2\pi\sqrt{t^2-r^2}}$ | interior: tail $\sim 1/(2\pi t)$ |
| 3 | $\dfrac{\delta(t-r)}{4\pi r}$ | the cone only |
| 4 | light-cone singular part $\;-\;\dfrac{\theta(t-r)}{4\pi^2(t^2-r^2)^{3/2}}$ (finite-part distribution) | interior: **negative** tail $\sim -t^{-3}$ |
| 5 | $\dfrac{1}{8\pi^2}\left[\dfrac{\delta'(t-r)}{r^2}+\dfrac{\delta(t-r)}{r^3}\right]$ | the cone only |

Sources: [DaiStojkovic13] (the 2+1 form, the general odd-$D$ formula and the 4+1 form),
[Galtsov01]; I checked the rows by the recursion below.

**Derivation.** For radial solutions the operator $-\frac{1}{2\pi r}\partial_r$ maps a solution in
$N$ dimensions to one in $N+2$ (Ehrenfest used the same step [Ehrenfest17]):
$G_{N+2} = -\frac{1}{2\pi r}\partial_r G_N$. Starting from $G_1$ it gives $G_3$, then $G_5$.
Starting from $G_2$ (method of descent: integrate $G_3$ along a line) it gives $G_4$. Each step
differentiates; odd $N$ start from a function supported *on* the cone (after one step), even $N$
from one supported *inside* it, so even $N$ keep a tail forever. General even $N$:
$G_N \propto (-1)^{(N-2)/2}\,\theta(t-r)/(t^2-r^2)^{(N-1)/2}$ [DaiStojkovic13], so the tail
changes sign with each step. Consistency check (derived): $\int_0^\infty G_N\,dt$ equals the
static Green's function $1/((N-2)S_{N-1}r^{N-2})$ for $N\ge3$, and it diverges logarithmically
for $N=2$, matching $\ln r$.

**Huygens' principle (strict form)** [Harvard212]: for odd $N\ge3$ the value at $(t_0,x_0)$
depends only on the data on the sphere $|x-x_0|=t_0$. It fails for all even $N$. $N=1$ is
special: displacement data travel undistorted (d'Alembert), but velocity data or a net
injection leave a permanent step. Wavefronts (singularities) travel at $c$ in *every* $N$.

**Shape as well as sharpness (derived; consistent with [Ehrenfest17]).** In the far field the
signal is $r^{-(N-1)/2}$ times an order-$\tfrac{N-3}{2}$ time derivative of the source (a
negative order means an integral). $N=3$ is the only dimension where a pulse arrives both
sharp *and* undistorted: $u = f(t-r/c)/(4\pi c^2r)$. For $N=5$,
$u = \frac{1}{8\pi^2c^2}\left[\frac{f'(t-r/c)}{c\,r^2}+\frac{f(t-r/c)}{r^3}\right]$, which is
sharp but differentiated at large $r$.

**What a listener hears from a clap** (a pulse $f$ of duration $\tau$; qualitative):
- **1D:** a thump that does not fade with distance. If $\int f\,dt\ne0$, the medium stays offset
  forever (a permanent step). If $\int f=0$, the listener hears one clean pulse shaped like the
  running integral of $f$.
- **2D:** a sharp onset, then a smooth after-sound decaying like $1/t$ (or $1/t^2$ if
  $\int f=0$). **No echoes**: a decaying tail, not reverberation.
- **3D:** an exact copy of the clap, quieter by $1/r$.
- **4D:** an onset, then a faint *negative* undershoot decaying like $t^{-3}$.
- **5D:** sharp with no tail, but far away the waveform is the derivative of the clap (a
  single-sided pulse becomes a two-sided one).

**What to simulate.**
- *Ground truth:* convolve $f$ (Gaussian, $\tau = 2$ ms, $c=343$ m/s, $r = 1,3,10$ m) with the
  table. For $N=2$, integrate the $1/\sqrt{\cdot}$ singularity by the substitution
  $t-t' = r\cosh s$. Get $N=4$ as $-\frac{1}{2\pi r}\partial_r$ of the $N=2$ result and $N=5$
  from $N=3$ in the same way.
- *Grid:* the radial equation $u_{tt} = c^2\,r^{1-N}\partial_r(r^{N-1}\partial_r u)$ on a staggered
  grid works for any $N$ in 1D cost. At $r=0$ the Laplacian equals $N u_{rr}$, so take
  $c\Delta t\le\Delta r/\sqrt N$ (my estimate; test it). Validate the grid against the
  convolution.
- *Expected plot:* the signal at fixed $r$ against time, all $N$ stacked. The tails in 2D and 4D
  are clearly visible on a log axis.

**Misconceptions.** "Waves are slower or blurrier in 2D": the front still moves at $c$; only
the wake differs. "Only 3D has clean sound": 5, 7, … are also sharp, but distorted.

---

## 5. Electromagnetism and light in $N$ dimensions

**Field content (Exact given Maxwell's equations in $N+1$).** $F_{\mu\nu}$ is an antisymmetric
$D\times D$ tensor with $D(D-1)/2$ components [Dunne99]: $E_i = F_{0i}$ ($N$ components) and
$B_{ij} = F_{ij}$, an antisymmetric tensor with $N(N-1)/2$ components [McDavid06]. Only for
$N=3$ can $B$ be written as a (pseudo)vector; for $N=2$ it is a single pseudoscalar
[Dunne99]; for $N=1$ there is no magnetic field.

| $N$ | $E$ | $B$ | Photon polarisations $D-2 = N-1$ | Point-charge potential |
|---|---|---|---|---|
| 1 | 1 | 0 | 0: no light, no radiation | $\propto|x|$: confining |
| 2 | 2 | 1 | 1 | $\propto\ln r$: confining |
| 3 | 3 | 3 | 2 | $\propto1/r$ |
| 4 | 4 | 6 | 3 | $\propto1/r^2$ |

**Equations ready to code (derived; reduces to the vector form for $N=3$ with $B_{ij}=\epsilon_{ijk}B_k$):**

$$\partial_i E_i = \rho/\varepsilon_0,\quad \partial_tB_{ij} = -(\partial_iE_j-\partial_jE_i),\quad \partial_tE_i = c^2\partial_jB_{ij} - J_i/\varepsilon_0,\quad F_i = q\,(E_i + B_{ij}v_j).$$

Point charge: $E = q/(\varepsilon_0 S_{N-1} r^{N-1})$.

**Polarisations.** A massless vector in $D$ dimensions has $D$ components, minus one for gauge
freedom and one for the constraint, leaving $D-2$ (the transverse directions; standard little-group
count, no source read beyond the analogous graviton count in [CardosoDiasLemos03]).

**Radiation.** Energy conservation through spheres gives an energy flux $\propto r^{-(N-1)}$
and a field amplitude $\propto r^{-(N-1)/2}$ ([CardosoDiasLemos03] give this scaling for
gravitational waves). In even $N$ the radiation has tails and the radiation-reaction force
depends on the whole past history of the charge; only $D=4$ has a local radiation-reaction
equation with consistent mass renormalisation [Galtsov01].

**2+1 and 1+1.** In 2+1 the photon has one polarisation and the static potential is
logarithmic, so two opposite charges can never be pulled fully apart: the energy grows like
$\ln r$ (derived). In 1+1 there is no propagating photon at all. The field of a charge is
uniform on each side, $E = \pm q/(2\varepsilon_0)$, so separating two charges costs energy
proportional to distance (derived).

**Lamp brightness (Exact).** A steady flux $\propto 1/r^{N-1}$: in 1D it never dims (lossless).
A *flash* in even $N$ leaves an afterglow (§4).

**What to simulate.** Lamp: intensity against $r$ on log–log axes, slope $-(N-1)$. A charge in
2D and 3D: field lines (2D lines spread as $1/r$). Optional: an FDTD grid in 2D (fields
$E_x,E_y,B_{12}$), a pulsed dipole showing the wake behind the front.

**Misconception.** "Light in 2D is like ours": it has one polarisation, not two; and in 1D there
is no light at all.

---

## 6. Gravity (general relativity) by dimension

**Counting (Exact).** In $D$ dimensions the Riemann tensor has $D^2(D^2-1)/12$ components and
the Ricci tensor $D(D+1)/2$ (no source read; standard):

| $D$ | Riemann | Ricci | Weyl (free curvature) | Graviton polarisations $D(D-3)/2$ |
|---|---|---|---|---|
| 2 | 1 | 3 (only 1 independent) | 0 | — (no dynamics) |
| 3 | 6 | 6 | 0 | 0 |
| 4 | 20 | 10 | 10 | 2 |
| 5 | 50 | 15 | 35 | 5 |

- **1+1:** $R_{\mu\nu} = \tfrac12 R\,g_{\mu\nu}$ identically, so $G_{\mu\nu}\equiv0$ and Einstein's
  equations would force $T_{\mu\nu}=0$. Einstein gravity is empty in 1+1 (derived).
- **2+1:** the Weyl tensor vanishes, so curvature is fixed algebraically by local matter.
  Empty regions are flat (or have constant curvature if $\Lambda\ne0$): no gravitational waves,
  no gravitons and **no local degrees of freedom** [Carlip95, Carlip05, DJtH84]. Field counting:
  6 metric components − 3 constraints − 3 gauge conditions = 0 [Welling95].
- **Point mass in 2+1** [Welling95, DJtH84]: $ds^2 = -dt^2+dr^2+(1-4Gm)^2r^2d\varphi^2$ with
  $c=1$. Space is a cone with **deficit angle $\delta = 8\pi Gm$** (a wedge removed), which
  requires $m<1/(4G)$. A test particle at rest stays at rest: there is no attraction. Moving
  particles travel on straight lines of the unrolled cone, so two parallel paths passing on
  opposite sides cross behind the mass at angle $\delta$ (lensing, no force).
- **BTZ black hole (1992)** [BTZ92, Carlip95]: requires $\Lambda=-1/\ell^2<0$.
  $ds^2 = -f^2dt^2+f^{-2}dr^2+r^2(d\varphi-\tfrac{4GJ}{r^2}dt)^2$ with
  $f^2 = -8GM + r^2/\ell^2 + 16G^2J^2/r^2$ (Carlip's form uses $8G=1$). For $J=0$:
  $r_+ = \ell\sqrt{8GM}$. AdS$_3$ is $M=-1/8G$, separated from the black holes by a mass gap.
  There is no BTZ hole at $\Lambda=0$.
- **$D\ge4$: Schwarzschild–Tangherlini (1963)** [Tangherlini63 via CardosoDiasLemos03]:
  $ds^2 = -f\,dt^2+f^{-1}dr^2+r^2d\Omega_{D-2}^2$ with $f = 1-\frac{k}{r^{D-3}}$ and
  $k = \frac{16\pi GM}{(D-2)\Omega_{D-2}}$. The weak field is the Newtonian $1/r^{N-1}$ force.
- **Orbits in Tangherlini** [Cardoso08]: timelike, $\dot r^2 = E^2 - f(1+L^2/r^2)$. For $D=4$,
  stable circular orbits exist for $r>6M$; **for $D>4$ every circular orbit is unstable**.
  Photon sphere at $r_c = \left(\frac{D-1}{2}\right)^{1/(D-3)}r_+$. For $D=5$ (derived):
  $V = 1+(L^2-k)/r^2 - kL^2/r^4$. Its only critical point is a maximum, so the extra GR term
  turns the Newtonian *marginal* 4D orbit into an exponentially unstable one.

**Where "Newtonian gravity in $N$-D" is an analogy.** $N\ge4$: a consistent weak-field limit of
an untested theory (Analogy). $N=2$: *contradicted* by GR, which has no Newtonian limit
[Carlip05]. $N=1$: GR is empty. A "2D gravity" scene must say "a $1/r$ force" or "2D
electrostatics".

**What to simulate (Analogy/Exact maths).** The 2+1 cone: cut a wedge $8\pi Gm$ out of a disc,
glue the edges, and draw straight test-particle paths; show two parallel paths crossing behind
the mass while a resting particle stays put. Contrast with the Lab's $1/r$ rosette, with the
caption "what Newton would predict vs what Einstein predicts in 2+1".

**Misconceptions.** "Flatland gravity pulls things together": not in GR. "Higher-D black holes
are just bigger": in $D\ge5$ no stable orbits exist around them, and other horizon shapes exist
(black rings, not covered here).

---

## 7. Quantum mechanics by dimension

**Radial equation (Exact).** With $\psi = r^{-(N-1)/2}u(r)\,Y_\ell$:

$$u'' + \left[\frac{2m}{\hbar^2}(E-V) - \frac{(\ell+\frac{N-2}{2})^2-\frac14}{r^2}\right]u = 0$$

(checked: $N=3$ gives $\ell(\ell+1)$, and $N=2$ gives $m_\ell^2-\tfrac14$).

**Two different "hydrogen atoms" (do not confuse them):**
1. *$1/r$ potential in $N$-D* (Nieto 1979, via [Hagen94]):
   $E_n = -\dfrac{me^4}{2\hbar^2\,[n+\frac12(N-3)]^2}$. For $N=2$: $E_n = -\mathrm{Ry}/(n-\tfrac12)^2$,
   so the ground state is **4 times** deeper than in 3D [Hagen94; Yang91]. This "2D hydrogen" is
   real physics for excitons in thin semiconductor layers (3D Coulomb force, motion confined to a
   plane). It is **not** what a 2D universe would have.
2. *Gauss-law potential* $V\propto r^{2-N}$ (a true $N$-D universe):

| $N$ | $V$ | Result | Level |
|---|---|---|---|
| 1 | $\kappa|x|$ | All states bound (Airy functions); no ionisation | Exact given the law (derived) |
| 2 | $\kappa\ln r$ | Purely discrete spectrum; every electron bound forever, no ionisation. Level spacings do not depend on the mass (scaling $r\to\lambda r$ shifts $E$ by a constant). Not hydrogen-like; no closed form. | Exact given the law (derived) |
| 3 | $-\kappa/r$ | Hydrogen | Exact |
| 4 | $-\kappa/r^2$ | With $g=2m\kappa/\hbar^2$: if $g\le(\ell+1)^2$, **no bound states** (Hardy inequality: $H\ge0$); if $g>(\ell+1)^2$, **no ground state** (fall to the centre). No stable atom either way. | Exact given the law (derived; agrees with [BragaDAndrea05], [Tegmark97]) |
| $\ge5$ | $-\kappa/r^{N-2}$ | More singular than the centrifugal term: $H$ unbounded below, fall to the centre for every $\ell$ | Exact given the law |

The classical 4D picture matches §2.3: collapse when $L^2>\mu$; quantum mechanically $L^2$
becomes $\hbar^2(\ell+1)^2$. In 4D $g$ is dimensionless (proportional to $Z$), so a small nuclear
charge binds nothing and a large one collapses.

Tegmark: no bound states for $N>3$, quoting Tangherlini [Tegmark97, Tangherlini63]; Ehrenfest
found the Bohr model singular at $n=4$ [Ehrenfest17]. *Dissent:* Caruso et al. (2013) report
numerical "tiny bound states" for $5\le D\le10$ [Caruso13]. I read only their abstract. Such
states need a boundary condition chosen at $r=0$ and do not cure the unbounded-below spectrum;
treat the claim as unconfirmed.

**Why chemistry fails for $N\ge4$ (Exact given point nuclei; caveat).** Chemistry needs atoms
with a stable ground state of size set by $\hbar$, $m_e$ and $e$ (the Bohr radius) and a shell
structure. For $N\ge4$ no such scale exists: in 4D the problem has no length scale at all, and
for $N\ge5$ the energy is unbounded below. *Caveat (my reasoning, consistent with Tegmark's
remark on short-distance corrections):* a nucleus of finite size makes $V$ finite at the origin,
so bound states can exist, but they shrink to the nuclear size and are governed by nuclear
physics, not by the electron cloud chemistry relies on. Say "no atoms like ours", not "no bound
states of any kind".

**What to simulate.** Radial Schrödinger (Numerov or finite differences) for 3D vs 4D. In 4D, show
the ground-state trial energy falling without limit as the grid is refined when $g>1$, and no
negative eigenvalue at all when $g<1$. In 2D (log potential), show the ladder of levels and that
raising $E$ never frees the electron.

---

## 8. Geometry and statistics that change with $N$

**Ball and sphere (Exact)** [Wiki-Ball]: $V_N(R) = \dfrac{\pi^{N/2}}{\Gamma(N/2+1)}R^N$,
$V_N = \frac{2\pi}{N}V_{N-2}$, and the bounding-sphere area is $A_{N-1} = N V_N$.
(Computed; matches [Wiki-Ball].)

| $N$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| $V_N$ (unit ball) | 2.0000 | 3.1416 | 4.1888 | 4.9348 | **5.2638** | 5.1677 | 4.7248 | 4.0587 | 3.2985 | 2.5502 |
| $A_{N-1}=NV_N$ | 2.0000 | 6.2832 | 12.566 | 19.739 | 26.319 | 31.006 | **33.073** | 32.470 | 29.687 | 25.502 |

Volume peaks at $N=5$ and area at $N=7$, **for radius 1 only**: $V_N(R) = R^NV_N(1)$, so the
peak moves with the unit. Volumes in different $N$ have different units, so "the 5-ball is
biggest" is a statement about unit balls, not about space.

- *Shell concentration:* the fraction of volume within $\varepsilon R$ of the surface is
  $1-(1-\varepsilon)^N$. For $\varepsilon = 0.1$: 19% ($N=2$), 27% (3), 65% (10), 99.997% (100).
- *Cube of side 2:* faces at distance 1, corners at $\sqrt N$. The inscribed ball fills
  $V_N/2^N$ of the cube: 52% at $N=3$, 0.25% at $N=10$.
- *Kissing numbers* [Wiki-Kiss]: proven exactly only for $N=1,2,3,4,8,24$: 2, 6, 12 (Schütte
  and van der Waerden 1953), 24 (Musin 2003), 240, 196560. Bounds: $N=5$: 40–44, 6: 72–77, 7:
  126–134, 9: 306–363, 10: 510–553 (lower bound by Ganzhinov 2025), as listed when I read it.

**Pólya's random walk (Exact)** [MathWorld-Polya]. A simple random walk on the cubic lattice
$\mathbb{Z}^N$ returns to its start with probability $p(N) = 1-1/u(N)$, where
$u(N) = \int_0^\infty [I_0(t/N)]^N e^{-t}\,dt$ is the expected number of visits:

| $N$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| $p(N)$ | 1 | 1 | 0.340537 | 0.193202 | 0.135178 | 0.104715 | 0.085845 | 0.072913 |

(My numerical evaluation of $u(N)$ agrees to $10^{-6}$.) $p(3)$ has a closed form in $\Gamma$
functions (Watson 1939). Caveats for the video: the values are for the *simple cubic* lattice;
other lattices give other numbers. A continuous Brownian particle in 2D returns arbitrarily close
to its start, but hits the exact point with probability 0. In 1D and 2D the expected return
*time* is infinite even though return is certain.

**Equipartition and Maxwell (Exact, classical ideal monatomic gas; derived).** Translational
energy per particle is $\frac N2kT$ and $C_V = \frac N2k$. The speed distribution is

$$f_N(v) = S_{N-1}\left(\frac{m}{2\pi kT}\right)^{N/2}v^{N-1}e^{-mv^2/2kT},\quad v_p = \sqrt{\tfrac{(N-1)kT}{m}},\quad \langle v\rangle = \sqrt{\tfrac{2kT}{m}}\frac{\Gamma(\frac{N+1}{2})}{\Gamma(\frac N2)},\quad v_{\rm rms} = \sqrt{\tfrac{NkT}{m}}.$$

In units of $\sqrt{kT/m}$: $v_p = 0, 1, 1.414, 1.732$ and $\langle v\rangle = 0.798, 1.253, 1.596,
1.880$ for $N=1\dots4$. In 1D the most probable speed is zero (half-Gaussian); in 2D the
distribution is Rayleigh.

**What to simulate.** Random walk: 10,000 walkers per $N$, plot the fraction that have returned
against steps; it approaches $p(N)$ slowly ($N\ge3$) or 1 ($N\le2$). Gas: hard spheres in an
$N$-D box; the speed histogram converges to $f_N$.

---

## 9. Time as a dimension (special relativity) — Exact

**Metric.** $ds^2 = -c^2dt^2 + \sum_{i=1}^N dx_i^2$. Events are *timelike*, *null* or
*spacelike* separated as $ds^2<0,=0,>0$. Massive worldlines are timelike everywhere
($|d\mathbf x/dt|<c$). The light cone of an event is $c|t-t_0| = |\mathbf x-\mathbf x_0|$: in a
2+1 diagram it is a literal cone with $45^\circ$ sides when $ct$ and $x$ use the same units.

**Boost (velocity $\mathbf v$, $\gamma = (1-v^2/c^2)^{-1/2}$)** [Tong13 §7]:

$$t' = \gamma\left(t-\frac{\mathbf v\cdot\mathbf x}{c^2}\right),\qquad \mathbf x' = \mathbf x + (\gamma-1)\frac{(\mathbf v\cdot\mathbf x)\mathbf v}{v^2} - \gamma\mathbf v t .$$

- *Relativity of simultaneity:* events with $\Delta t=0$ have $\Delta t' = -\gamma\,\mathbf v\cdot\Delta\mathbf x/c^2$.
  The moving observer's "now" is the plane $t = t'/\gamma + \mathbf v\cdot\mathbf x/c^2$, tilted
  with slope $v/c$ in a $(x, ct)$ diagram, towards the light cone.
- *Proper time:* $\tau = \int\sqrt{1-|\dot{\mathbf x}|^2/c^2}\,dt$ (i.e. $d\tau^2 = -ds^2/c^2$).
  Between two timelike-separated events the straight (inertial) worldline has the **longest**
  proper time. 4-velocity $u^\mu = dx^\mu/d\tau$ with $u\cdot u = -c^2$.
- *Twin paradox* [Tong13]: out and back at speed $v$ for coordinate time $T$ each way gives
  $\tau_{\rm home} = 2T$ and $\tau_{\rm traveller} = 2T/\gamma$. At $v=0.8c$ ($\gamma=5/3$) and
  $T=5$ yr: 10 yr against 6 yr. The asymmetry is the turnaround (the traveller's worldline is not
  straight), not acceleration as such.

**What to simulate (Time view).** Stack the 2D world's history along $ct$. Draw worldlines as
polylines in $(x,y,ct)$, the light cone of a chosen event, and the "now" sheet
$ct = ct'_0/\gamma + (\mathbf v/c)\cdot\mathbf x$ for a slider $v\in(-c,c)$. Twin paradox:
integrate $\tau$ along each polyline numerically and print both clocks at the reunion event.
Check that every simulated worldline obeys $|\Delta\mathbf x|<c\,\Delta t$.

**Why exactly one time dimension** [Tegmark97]. Field equations are classified by the signature
of their highest-derivative term. With 0 time dimensions they are *elliptic*: "initial" data on a
surface give an ill-posed problem, so local measurements predict nothing. With $\ge2$ time
dimensions they are *ultrahyperbolic*: no surface is spacelike or timelike in the needed sense,
and initial-value problems are ill-posed (Asgeirsson's theorem). With 1 time they are
*hyperbolic*, with well-posed prediction. $(N,m)=(1,3)$ is equivalent to $(3,1)$ with only
tachyons. Tegmark adds that with $m>1$ the mass constraint on decays disappears: protons could
decay to neutron + positron + neutrino (Dorling 1970). **Limits:** Craig and Weinstein (2009)
show that for codimension-one data with a *nonlocal constraint*, the ultrahyperbolic Cauchy
problem has global unique solutions [CraigWeinstein09]. So the argument is "no *local*
predictability", not a proof that physics with two times is impossible. Level: **Theory/argument**,
not Exact.

**Physics vs interpretation.** Exact: the metric, the light cones, the frame-dependence of
simultaneity, proper time. *Interpretation:* the "block universe" (all times equally real) and
"now is a flat slice moving through the block". A "now" sheet is a coordinate choice of
simultaneity, not a physical object, and whether relativity forces eternalism is debated
(Rietdijk–Putnam vs Stein) [Savitt21]. The phrase "you are watching a 4D object one slice at a
time" (PLAN §2.3) must be captioned as a picture, not a result.

---

## 10. Why 3 + 1? A balanced summary

| Argument | What it says | Status | Limits |
|---|---|---|---|
| Orbit stability [Ehrenfest17, Tangherlini63] | $N\ge4$: no stable bound orbits (Newton and GR) | Exact given Gauss-law forces | Assumes the force law keeps its form; extra short-range forces or compact dimensions change it |
| Atom stability [Tangherlini63, Tegmark97, BragaDAndrea05] | $N\ge4$: no hydrogen-like ground state | Exact given point nuclei + Gauss law | Finite nuclear size or other short-distance physics changes it; see Caruso13 dissent |
| Complexity [Tegmark97, Whitrow55 via Tegmark] | $N\le2$: no GR gravity, wiring limits, "too simple" | Weak, qualitative | 2D can still compute; Newtonian-style 2D gravity is consistent on its own |
| Waves [Ehrenfest17, Harvard212] | Only $N=3$ gives sharp *and* undistorted signals | Exact | $N=5,7,\dots$ are sharp; whether life needs undistorted signals is unknown |
| Time count [Tegmark97] | $m=1$ is needed for local prediction | Mathematical argument | Nonlocal constraints evade it [CraigWeinstein09] |
| Anthropic selection [Tegmark97, Caruso16] | We see 3+1 because only it permits observers | Interpretation | Needs an ensemble of worlds; explains nothing without one |

Key honesty points: every argument holds the *other* laws fixed while changing $N$; they show
that other dimensions would be radically different, not that observers are impossible there
(Tegmark says this explicitly). A critical philosophical review is Callender (2005) [Callender05,
found; only its section headings were readable to me].

---

## Answers to the engineer's specific questions

1. **"Independent planes of rotation: $n(n-1)/2$."** The number is right, the wording is not.
   $n(n-1)/2$ counts independent rotation *generators* (coordinate planes, i.e. components of
   angular velocity/momentum). A body spins at any instant in at most $\lfloor n/2\rfloor$
   mutually orthogonal planes (0, 1, 1, 2 for $n=1..4$). Show both rows.
2. **4D, $1/r^3$ force: $\ddot r = (L^2-\mu)/r^3$ exactly?** Yes (§2.3), with
   $r^2 = r_0^2+2r_0\dot r_0t+2Et^2$ exactly. The drift is linear for a radial nudge and
   quadratic-then-linear for a speed nudge, never exponential. Inward collapse takes finite time.
3. **"Only 3D has stable orbits" vs "2D stable but not closed".** PHYSICS.md is right; PLAN.md
   is wrong. Suggested line: "Only in 3D do orbits close; in 2D they are stable rosettes, in 4D
   they cannot last."
4. **$G$ across dimensions.** Use §2.4 option 3: $F_N = (GMm/r_0^2)(r_0/r)^{N-1}$, so the
   starting circular orbit is identical in every $N$.

---

## Sources

Marked **read** if I read the content (full text, or the relevant sections via the PDF text
layer or ar5iv), **abstract** if I read only the abstract or metadata, **found** if located but not
readable.

**Dimensionality arguments (general)**
- [Tegmark97] M. Tegmark, "On the dimensionality of spacetime", *Class. Quantum Grav.* 14, L69 (1997). https://arxiv.org/abs/gr-qc/9702052 — read (full text).
- [Ehrenfest17] P. Ehrenfest, "In what way does it become manifest in the fundamental laws of physics that space has three dimensions?", *Proc. KNAW* 20, 200–209 (1917/1918). https://dwc.knaw.nl/DL/publications/PU00012213.pdf — read in part (poor OCR: planetary-motion section, Bohr-atom remark, odd-n retarded potentials).
- [Tangherlini63] F. R. Tangherlini, "Schwarzschild field in n dimensions and the dimensionality of space problem", *Nuovo Cimento* 27, 636 (1963). https://inspirehep.net/literature/42421 — abstract (via search summary) only.
- [Caruso16] F. Caruso, "Life and space dimensionality: a brief review of old and new entangled arguments", *J. Astrobiol. Outreach* 4, 152 (2016). https://arxiv.org/abs/1608.05298 — abstract.
- [Callender05] C. Callender, "Answers in search of a question: 'proofs' of the tri-dimensionality of space", *Stud. Hist. Phil. Mod. Phys.* 36, 113–136 (2005). https://www.craigcallender.com/_files/ugd/b2eedd_715b6f8ea080494cac92ef7c54142cdc.pdf — found; only section headings were readable.
- Whitrow (1955), Dorling (1970), Asgeirsson (1936), Courant–Hilbert: cited via [Tegmark97], not read.

**Orbits and mechanics**
- [Wiki-Bertrand] Wikipedia, "Bertrand's theorem". https://en.wikipedia.org/wiki/Bertrand%27s_theorem — read (pointer).
- [SantosSoaresTort08] F. C. Santos, V. Soares, A. C. Tort, "The determination of the apsidal angles and Bertrand's theorem" (2008). https://arxiv.org/abs/0809.2069 — read (ar5iv).
- [Wiki-Cotes] Wikipedia, "Cotes's spiral". https://en.wikipedia.org/wiki/Cotes%27s_spiral — read (pointer); the 4D radial solution is my own derivation.

**Rotation**
- [Wiki-Rot4D] Wikipedia, "Rotations in 4-dimensional Euclidean space". https://en.wikipedia.org/wiki/Rotations_in_4-dimensional_Euclidean_space — read.
- [Wiki-Plane] Wikipedia, "Plane of rotation". https://en.wikipedia.org/wiki/Plane_of_rotation — read.
- [Izosimov12] A. Izosimov, "Stability of relative equilibria of multidimensional rigid body" (arXiv 2012). https://arxiv.org/abs/1203.3985 — read (ar5iv, Theorem 1 and Examples 2.2–2.3). Ratiu (1980) and Manakov (1976) are cited there, not read.

**Waves**
- [DaiStojkovic13] D.-C. Dai, D. Stojkovic, "Origin of the tail in Green's functions in odd dimensional space-times" (2013). https://arxiv.org/abs/1309.2996 — read (ar5iv).
- [Harvard212] Harvard Math 212b lecture notes, "The wave equation" (2 Feb 2001; author not stated in the text). https://legacy-www.math.harvard.edu/archive/212_spring01/lectures/waveeq.pdf — read (Huygens statement).
- [Galtsov01] D. V. Gal'tsov, "Radiation reaction in various dimensions" (2001). https://arxiv.org/abs/hep-th/0112110 — read (ar5iv).

**Electromagnetism**
- [Dunne99] G. V. Dunne, "Aspects of Chern–Simons theory", Les Houches lectures (1999). https://arxiv.org/abs/hep-th/9902115 — read (Maxwell in 2+1 parts).
- [McDavid06] A. W. McDavid, C. D. McMullen, "Generalizing cross products and Maxwell's equations to universal extra dimensions" (2006). https://arxiv.org/abs/hep-ph/0609260 — abstract.

**Gravity**
- [Carlip95] S. Carlip, "Lectures on (2+1)-dimensional gravity", *J. Korean Phys. Soc.* 28, S447 (1995). https://arxiv.org/abs/gr-qc/9503024 — read (first 100k characters: no local degrees of freedom, BTZ metric).
- [Carlip05] S. Carlip, "Quantum gravity in 2+1 dimensions: the case of a closed universe", *Living Rev. Relativ.* (2005). https://arxiv.org/abs/gr-qc/0409039 — read (first part: no local dof, $n(n-3)$ count, no good Newtonian limit).
- [Welling95] M. Welling, "Some approaches to 2+1-dimensional gravity coupled to point-particles" (1995). https://arxiv.org/abs/hep-th/9511211 — read (introduction: wedge $2\pi(1-4mG)$, 6−3−3 = 0 count).
- [DJtH84] S. Deser, R. Jackiw, G. 't Hooft, "Three-dimensional Einstein gravity: dynamics of flat space", *Ann. Phys.* 152, 220 (1984). https://authors.library.caltech.edu/86532 — abstract (via search); the deficit formula is taken from [Welling95].
- [BTZ92] M. Bañados, C. Teitelboim, J. Zanelli, "The black hole in three dimensional space time", *Phys. Rev. Lett.* 69, 1849 (1992). https://arxiv.org/abs/hep-th/9204099 — abstract.
- [CardosoDiasLemos03] V. Cardoso, Ó. J. C. Dias, J. P. S. Lemos, "Gravitational radiation in D-dimensional spacetimes" (2003). https://arxiv.org/abs/hep-th/0212168 — read (ar5iv: Tangherlini metric and constant, $D(D-3)/2$, even/odd Green's functions).
- [Cardoso08] V. Cardoso, A. S. Miranda, E. Berti, H. Witek, V. T. Zanchin, "Geodesic stability, Lyapunov exponents and quasinormal modes" (2008). https://arxiv.org/abs/0812.1806 — read (ar5iv).

**Quantum mechanics**
- [BragaDAndrea05] N. R. F. Braga, R. D'Andrea, "Bound states for one-electron atoms in higher dimensions" (2005). https://arxiv.org/abs/quant-ph/0511078 — abstract.
- [Caruso13] F. Caruso, J. Martins, V. Oguri, "Note on the existence of hydrogen atoms in higher dimensional Euclidean spaces", *Phys. Lett. A* 377, 694 (2013). https://arxiv.org/abs/1205.3740 — abstract.
- [Hagen94] C. R. Hagen, "Dimensionality as a perturbation parameter in the generalized hydrogen atom" (1994). https://arxiv.org/abs/hep-th/9410161 — read (ar5iv; quotes Nieto 1979, *Am. J. Phys.* 47, 1067, not read).
- [Yang91] X. L. Yang, S. H. Guo, F. T. Chan, K. W. Wong, W. Y. Ching, "Analytic solution of a two-dimensional hydrogen atom. I", *Phys. Rev. A* 43, 1186 (1991). https://journals.aps.org/pra/abstract/10.1103/PhysRevA.43.1186 — abstract.
- Burgbacher, Lämmerzahl, Macías, *J. Math. Phys.* 40, 625 (1999) — found via citations only, not read.

**Geometry and statistics**
- [Wiki-Ball] Wikipedia, "Volume of an n-ball". https://en.wikipedia.org/wiki/Volume_of_an_n-ball — read; values recomputed.
- [Wiki-Kiss] Wikipedia, "Kissing number". https://en.wikipedia.org/wiki/Kissing_number — read (pointer to Musin 2003 and others).
- [MathWorld-Polya] E. W. Weisstein, "Pólya's Random Walk Constants", MathWorld. https://mathworld.wolfram.com/PolyasRandomWalkConstants.html — read; values recomputed.
- [Wiki-Knot] Wikipedia, "Knot theory" (higher-dimensions section). https://en.wikipedia.org/wiki/Knot_theory — read (pointer to Zeeman 1963, Haefliger 1962).

**Time and relativity**
- [Tong13] D. Tong, *Lectures on Dynamics and Relativity*, Cambridge (2013). https://davidtong.org/pdfs/teaching/dynamics-and-relativity/dynrel.pdf — read (special relativity chapter, twin paradox).
- [CraigWeinstein09] W. Craig, S. Weinstein, "On determinism and well-posedness in multiple time dimensions", *Proc. R. Soc. A* 465, 3023 (2009). https://arxiv.org/abs/0812.0210 — abstract.
- [Savitt21] S. Savitt, "Being and becoming in modern physics", *Stanford Encyclopedia of Philosophy* (rev. 2021). https://plato.stanford.edu/entries/spacetime-bebecome/ — read.
