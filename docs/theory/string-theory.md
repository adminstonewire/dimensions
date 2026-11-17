# Extra dimensions, strings and M-theory: reference for the engine and the video

Scope: compact ("curled-up") and brane-world extra dimensions, string theory and M-theory.
Worlds with N *large* dimensions (Newtonian mechanics, waves, rotation, relativity) are in a
separate file and are not covered here.

Honesty levels, as in `docs/PHYSICS.md`:

- **Exact maths**: a theorem or a calculation that follows from stated assumptions.
- **Theory**: worked out mathematically, never confirmed by experiment.
- **Analogy**: a teaching device that is consistent in itself but is not what the theory says.

Conventions, unless a section says otherwise: natural units $\hbar = c = 1$; mostly-plus metric
$(-,+,+,\dots)$; $D$ = total spacetime dimension; $n$ = number of space dimensions; $\alpha'$ = Regge
slope, $\ell_s = \sqrt{\alpha'}$ = string length, string tension $T = 1/(2\pi\alpha')$.
Planck length $\ell_P = \sqrt{\hbar G/c^3} = 1.616\times10^{-35}$ m. Planck mass $M_{Pl} = 1.221\times10^{19}$ GeV;
reduced Planck mass $M_P = M_{Pl}/\sqrt{8\pi} = 2.435\times10^{18}$ GeV (the PDG uses the reduced one).
Conversion: $\hbar c = 1.973\times10^{-16}$ GeV·m.

**The status sentence for the whole video:** *No experiment has ever found evidence of an extra
space dimension, of strings, or of supersymmetry. String theory and M-theory are mathematically
developed proposals; the extra dimensions they need are hypothetical.*

---

## 1. Counting dimensions: why 26, 10 and 11

| Theory | Total $D$ | Space | Time | Where the number comes from | Level |
|---|---|---|---|---|---|
| Bosonic string | 26 | 25 | 1 | Weyl anomaly cancels: $c_{\text{matter}} = 26$ | Exact maths (theory has a tachyon, no fermions: not our world) |
| Superstring (all five) | 10 | 9 | 1 | $\tfrac32 D - 15 = 0$ | Exact maths within the theory; Theory as physics |
| 11D supergravity / M-theory | 11 | 10 | 1 | Largest $D$ with a supersymmetry multiplet of spin $\le 2$ (Nahm) | Exact maths (bound); Theory (M-theory) |

### 1.1 Central charge / Weyl anomaly (the cleanest argument)

The Polyakov string has two gauge symmetries on the worldsheet: reparametrisations and Weyl
rescalings $g_{ab}\to e^{2\omega}g_{ab}$. Fixing them introduces Faddeev–Popov ghosts $b,c$ with
central charge $c_{gh} = -26$. In a curved worldsheet the trace of the stress tensor picks up an
anomaly proportional to the total central charge, $\langle T^a{}_a\rangle = -\tfrac{c}{12}R^{(2)}$
(Tong eq. 4.35). Weyl symmetry is a gauge symmetry, so the anomaly must vanish:
$$c_{\text{total}} = c_{\text{matter}} - 26 = 0.$$
Each free scalar $X^\mu$ contributes $c = 1$, so $D$ free scalars give $c = D$ and $D = 26$.

Superstring: worldsheet supersymmetry adds superghosts $\beta,\gamma$ with $c = +11$, so the ghosts
total $-26 + 11 = -15$. Each spacetime direction now carries a boson ($c=1$) and a Majorana fermion
($c = \tfrac12$):
$$\tfrac32 D - 15 = 0 \;\Rightarrow\; D = 10.$$

**Key subtlety for the video (Tong §5.3):** the requirement is really a *critical central charge*,
not a critical dimension. Any conformal field theory with $c = 26$ (or $c = 15$ for the superstring)
is allowed. For 4D spacetime you take 4 free scalars plus some $c = 22$ "internal" CFT (superstring:
$c = 9$ internal), which may or may not be a geometric space at all. "Six curled dimensions" is
the case where that internal CFT happens to be a sigma model on a 6-manifold.

### 1.2 Light-cone gauge and the regularised sum

In light-cone gauge, $X^\pm = (X^0 \pm X^{D-1})/\sqrt2$, the constraints are solved explicitly and
only the $D-2$ transverse oscillators $\alpha_n^i$ are physical. Quantising them, each transverse
direction is an infinite set of harmonic oscillators with frequencies $n = 1,2,3,\dots$ and
zero-point energy $\tfrac12\sum n$. For the open string (or each side of the closed string)
$$E_0 = \frac{D-2}{2}\sum_{n=1}^\infty n .$$
**How the sum enters.** Regulate with a cutoff: $\sum n\,e^{-\epsilon n} = \frac{1}{\epsilon^2} - \frac1{12} + O(\epsilon)$.
The $1/\epsilon^2$ term is a worldsheet cosmological-constant-like divergence that must be removed
by a counterterm to keep Weyl invariance; the cutoff-independent part is $-1/12 = \zeta(-1)$. So
$E_0 = -(D-2)/24 \equiv -a$. This is *not* the claim that $1+2+3+\dots$ "equals" $-1/12$; it is the
finite part left after a symmetry-required subtraction, and it agrees with two independent
derivations (Lorentz algebra, and the central-charge count above).

Open string mass formula: $M^2 = \frac{1}{\alpha'}(N - a)$, $a = \frac{D-2}{24}$, $N = \sum_{n\ge1}\alpha^i_{-n}\alpha^i_n$.
The first excited states $\alpha^i_{-1}|0;p\rangle$ form a vector with only $D-2$ components. A massive
vector in $D$ dimensions needs $D-1$ (a representation of $SO(D-1)$), so Lorentz invariance demands
these states be massless: $1 - a = 0 \Rightarrow D = 26$. Tong §2.4 shows the same thing by
requiring the Lorentz generators to close: $[M^{i-}, M^{j-}] = 0$ only for $D = 26,\ a = 1$.

Superstring (NS sector): bosons contribute $-\tfrac1{24}$ per transverse direction, fermions with
half-integer modes $-\tfrac12\sum_{r=1/2,3/2,\dots} r = -\tfrac12\zeta(-1,\tfrac12) = -\tfrac1{48}$. Total
$a_{NS} = (D-2)(\tfrac1{24}+\tfrac1{48}) = \tfrac{D-2}{16}$. The state $\psi^i_{-1/2}|0\rangle$ is again a $D-2$
component vector, so $M^2 = \tfrac1{\alpha'}(\tfrac12 - a_{NS}) = 0 \Rightarrow D = 10$. (In the Ramond sector
boson and fermion zero-point energies cancel.)

### 1.3 Nahm's bound and 11-dimensional supergravity

Argument a programmer can check: a massless particle's supersymmetry multiplet is built by
acting with supercharges. For massless states, half of the $Q$ real supercharges annihilate the
state; the other $Q/2$ form $Q/4$ fermionic creation operators, each raising helicity by $\tfrac12$.
The multiplet therefore spans a helicity range of $Q/8$. Requiring no helicity beyond $\pm2$
(no consistent interacting massless higher-spin fields in flat space) gives range $\le 4$, so
$Q \le 32$. The smallest spinor has 32 real components in $D = 11$ and 64 in $D = 12$ with one
time, so $D = 11$ is the largest dimension with $Q \le 32$ (Nahm 1978). In 4D, 32 supercharges is
$\mathcal N = 8$ supergravity.

11D supergravity (Cremmer–Julia–Scherk 1978) is unique: fields are the metric $g_{MN}$ (44
physical polarisations: symmetric traceless of $SO(9)$), a 3-form $C_{MNP}$ (84 $=\binom93$) and a
Majorana gravitino (128). $44 + 84 = 128$ bosons match 128 fermions. It has no adjustable
dimensionless parameter; its only scale is the 11D Planck length $\ell_p$. M-theory is the
(conjectured, not fully formulated) quantum theory whose low-energy limit is this supergravity.

### 1.4 Space versus time in each case

Every count above assumes exactly **one** time direction: the light-cone construction uses one
timelike and one spacelike direction to form $X^\pm$, the Virasoro constraints remove exactly one
pair of negative-norm oscillator families, and Nahm's spinor count is for signature $(D-1,1)$. So
26 = 25 + 1, 10 = 9 + 1, 11 = 10 + 1. None of these theories requires any compact dimension in
itself (flat 10D or 11D space is a valid solution); compactness is added to match our 3 + 1.

**Misconceptions to avoid.** "String theory proves there are 10 dimensions" (it requires them for
consistency; nature has not confirmed it). "11 dimensions = 11 directions of space." "The 26 of the
bosonic string is a rival prediction" (that theory is inconsistent with our world: tachyon, no
fermions). "1+2+3+… = −1/12, so string theory is nonsense" or "…so the sum is literally −1/12".

---

## 2. What the extra dimensions are, and what they are not

Precise statement (Theory): in every string or M-theory scenario the extra dimensions are
**ordinary directions of space** in the sense of general relativity: they enter the metric with a
plus sign, have lengths, and particles can have momentum along them. They are hypothesised to be
compact (finite in extent, like a circle or a Calabi–Yau space) or strongly warped, which is why
we would not notice them. They are not time, not "probability", not "parallel timelines".

**No individual identity or order.** The six extra dimensions of a Calabi–Yau compactification are
one six-dimensional shape. Labelling its coordinates $y^4,\dots,y^9$ is a choice like choosing $x,y,z$:
a rotation or a holomorphic coordinate change mixes them, and nothing distinguishes "the 6th" from
"the 7th". For a genuine Calabi–Yau threefold there is not even a circle direction to point at: its
first Betti number is zero (no non-contractible loops; the quintic is simply connected). In
M-theory the 11th dimension is singled out only *relative to* a chosen description (the circle
whose size is the type IIA coupling); in a $G_2$ compactification the seven are again one shape.

**The online "ladder" is not physics.** A widely shared animation and book (R. Bryanton, *Imagining
the Tenth Dimension*, 2006–2007) assigns each dimension a meaning: the 4th is
time, the 5th is "branching possible futures", the 6th "all possible timelines", up to the 10th as
"every possibility". The author himself describes it as not what physicists accept. It has no
connection to the equations of string theory: no step in the theory gives any dimension a
"meaning", dimensions beyond 3 are spatial and interchangeable, and "possibilities" in physics are
described by quantum states in Hilbert space, which has nothing to do with the number of spacetime
dimensions. The video should say so plainly.

**Why exactly one time.** (a) The string theories above are only consistent with one time
(§1.4). (b) Tegmark (1997): with more than one time the field equations become ultrahyperbolic and
initial data do not determine the future (no predictability); with zero time, no evolution.
(c) Two times allow closed timelike paths in the time plane. F-theory's formal "(10,2)" is
discussed in §6.4; it does not add a second physical time. Level: Theory (a), argued consensus (b, c).

**What to show.** Tag every world `N space + 1 time`. Draw the compact dimensions as one shape
attached at every point, never as a numbered stack. When labelling axes inside a compact space,
use neutral labels ($y^1, y^2, \dots$) and let the user rotate them into each other.

---

## 3. Kaluza–Klein theory (4 space + 1 time, one circle)

### 3.1 The ansatz and the reduction

History: Kaluza (1921) wrote 5D general relativity with the "cylinder condition" $\partial_5 = 0$;
Klein (1926) made the fifth dimension a **circle**, interpreted dependence on it quantum
mechanically, and derived charge quantisation and a size.

Metric ansatz (Overduin–Wesson 1997, eq. 5, written there in signature $(+,-,-,-)$; same block
form here in mostly-plus), with $y \sim y + 2\pi R$:
$$ds^2_5 = g_{\mu\nu}dx^\mu dx^\nu + \phi^2\,(dy + \kappa A_\mu dx^\mu)^2,\qquad \kappa = \sqrt{16\pi G}.$$
For $\phi = 1$ the 5D Ricci scalar is $R_5 = R_4 - \tfrac{\kappa^2}{4}F_{\mu\nu}F^{\mu\nu}$, and integrating the 5D
Einstein–Hilbert action over the circle gives
$$S = \frac{2\pi R}{16\pi G_5}\int d^4x\sqrt{-g}\,R_5 = \int d^4x\sqrt{-g}\Big[\frac{R_4}{16\pi G} - \frac14F_{\mu\nu}F^{\mu\nu}\Big],\qquad G = \frac{G_5}{2\pi R}.$$
That is 4D gravity plus Maxwell (Heaviside–Lorentz units). For general $\phi(x)$ one also gets a
scalar coupled to both: Overduin–Wesson eq. 9 (their signature)
$S=-\int d^4x\sqrt{-g}\,\phi\big(\tfrac{R}{16\pi G}+\tfrac14\phi^2F^2+\tfrac{2}{3\kappa^2}\tfrac{\partial\phi\,\partial\phi}{\phi^2}\big)$,
or after a conformal rescaling to Einstein frame, a canonical scalar $\sigma = \ln\phi/(\sqrt3\kappa)$ (their
eqs. 16–19). **So one 5D theory of gravity = 4D gravity + electromagnetism + a massless scalar**,
keeping only the $y$-independent ("zero") modes. Level: Exact maths.

Gauge symmetry is geometry: $y \to y + \lambda(x)$ shifts $A_\mu \to A_\mu - \partial_\mu\lambda/\kappa$.

### 3.2 Geodesics give the Lorentz force

Because $\partial_y$ is a symmetry, the 5D geodesic conserves $p_y = m_5\,\phi^2(\dot y + \kappa A_\mu\dot x^\mu)$.
Projecting the 5D geodesic equation onto 4D (Overduin–Wesson eqs. 96–100) gives, for $\phi = 1$,
$$m\frac{du^\mu}{d\tau} = q\,F^\mu{}_\nu u^\nu,\qquad q = \kappa\,p_y ,$$
plus scalar-gradient terms when $\phi$ varies. **Electric charge is momentum around the circle.**
The 4D mass is $m^2 = m_5^2 + p_y^2/\phi^2$.

### 3.3 Quantisation, the tower, the radius and the mass problem

A field periodic in $y$ has modes $e^{iky/R}$, so $p_y = k\hbar/R$, $k\in\mathbb Z$ (Klein). Then
(Overduin–Wesson eqs. 25, 27; field massless in 5D):
$$q_k = \frac{k\sqrt{16\pi G}}{R\sqrt\phi}\ \ (\text{HL}) = \frac{2k\sqrt G}{R\sqrt\phi}\ \ (\text{Gaussian}),\qquad m_k = \frac{|k|\hbar}{R\sqrt\phi\,c}.$$
- **Charge quantisation** follows: all charges are integer multiples of one unit. (Exact maths.)
- **Every** KK particle has the same charge-to-mass ratio, $q/m = 2\sqrt G$ (Gaussian). Electrons have
  $e/m_e \approx 2\times10^{21}\sqrt G$.
- **Radius needed for the electron's charge** (unit-independent form, my own evaluation):
  $R\sqrt\phi = 2\ell_P/\sqrt\alpha = 23.4\,\ell_P = 3.8\times10^{-34}$ m; circumference $2.4\times10^{-33}$ m.
  Equivalently $\alpha = 4\ell_P^2/(R^2\phi)$ (O–W eq. 26).
- **Mass of that charged particle:** $m_1 c^2 = \hbar c/(R\sqrt\phi) = \tfrac12\sqrt\alpha\,M_{Pl}c^2 \approx 5\times10^{17}$ GeV,
  about $10^{21}$ times the electron mass. This is the classic failure of KK as a theory of matter.
- Klein's 1926 letter quotes a period of about $0.8\times10^{-30}$ cm (digits read from an OCR scan,
  not verified against the original). That number is reproduced by $\ell = h\sqrt{16\pi G}/(ce)$ with $e$ in
  Gaussian units, i.e. it is $\sqrt{4\pi}$ larger than the consistent-unit circumference above. For the
  video use "about $10^{-32}$ cm radius, roughly 20 Planck lengths" and show the formula.
- Further failures (PDG: "their initial idea failed"): no chiral fermions from a circle, and the
  scalar $\phi$ is a massless Brans–Dicke-like field (with $A=0$ it is Brans–Dicke with $\omega = 0$,
  excluded by solar-system tests, which need $\omega$ in the hundreds or more per O–W; the Cassini
  bound $\omega > 4\times10^4$ is from memory, not re-read). Modern versions must give the scalar a
  mass ("modulus stabilisation").

### 3.4 What to show or simulate

- Hose zoom: a line that is a circle of radius $R$ at every point. Particle state = ($x$-motion,
  integer $k$ windings of its wave around the circle). Show the wave $e^{iky/R}$ wrapped on the
  circle; $k=0$ uniform (neutral, massless), $k=\pm1,\pm2$ have 1, 2 wavelengths.
- From far away label it with $q = k\,q_1$, $m = |k|\,\hbar/(Rc)$. The sign of $k$ = sign of charge
  (direction of circulation). A slider for $R$: masses scale as $1/R$, $q_1$ as $1/R$.
- Lorentz force demo: integrate the 5D geodesic in the 5D metric with a chosen $A_\mu(x)$ (e.g. a
  uniform magnetic field, $A = \tfrac{B}{2}(-x_2,x_1,0)$), $\phi=1$, and show the projected 4D path
  curving as a charge with $q=\kappa p_y$. Exact maths.
- Caption: "Kaluza–Klein: exact mathematics. As a theory of our electron it fails: the charged
  particle would weigh $\sim10^{17}$ GeV."

**Misconceptions.** "KK explains electromagnetism" (it reproduces Maxwell but predicts the wrong
particles). "Kaluza curled the dimension" (Klein did). "The fifth dimension is the 5th of string
theory" (there is no such identification; see §2).

---

## 4. Compactification: circles, tori, orbifolds, Calabi–Yau spaces

### 4.1 Circles and tori

$T^k = \mathbb R^k/\Lambda$ (identify points differing by a lattice vector). For a rectangular torus with
radii $R_i$, a field massless in the full space gives a 4D tower
$$m^2_{\vec n}c^4 = \sum_{i=1}^k \Big(\frac{n_i\hbar c}{R_i}\Big)^2\qquad\big(m^2 = \textstyle\sum_i n_i^2/R_i^2 \text{ in natural units}\big),$$
one U(1) charge per circle. For a general lattice $m^2 = |\sum n_i\,\vec e_i^{\,*}|^2$ with the dual basis. Flat
tori are honest compactifications (Exact maths), but string theory on $T^6$ gives 4D theories with
$\mathcal N = 4$ (heterotic) or $\mathcal N = 8$ (type II) supersymmetry, which cannot contain chiral fermions:
**a torus cannot give the Standard Model.**

Orbifolds: a torus divided by a discrete symmetry, e.g. $S^1/\mathbb Z_2$ (an interval with two fixed
endpoints, used by Hořava–Witten and Randall–Sundrum) or $T^6/\mathbb Z_3$. Fixed points are mild
singularities where strings still behave well; many orbifolds are singular limits of Calabi–Yau
spaces. Orbifolding can produce chiral fermions.

### 4.2 Why Calabi–Yau threefolds

Requirement for a 4D theory with $\mathcal N = 1$ supersymmetry from heterotic (or type I) string
theory on $\mathbb R^{3,1}\times K_6$ (Candelas–Horowitz–Strominger–Witten 1985): $K_6$ must admit one
covariantly constant spinor. Equivalently its holonomy is in $SU(3)\subset SO(6)$, which means $K_6$ is
a compact Kähler manifold with vanishing first Chern class; by Yau's theorem (1977–78) it then
admits a **Ricci-flat** Kähler metric. That is a Calabi–Yau threefold (3 complex = 6 real
dimensions). Holonomy $SU(3)$ preserves 1/4 of the supercharges: heterotic 16 → 4 ($\mathcal N=1$ in 4D);
type II 32 → 8 ($\mathcal N=2$ in 4D). Type II needs extra ingredients (orientifolds, D-branes, fluxes)
to reach $\mathcal N = 1$. Ricci-flat also means the space solves the vacuum Einstein equations, which
is the leading-order string consistency condition. Level: Exact maths (the geometry);
Theory (that nature uses it). No explicit Ricci-flat metric on a compact Calabi–Yau has ever been
written down; it is known to exist (Hanson 2019 slides stress this; numerical approximations exist).

### 4.3 Hodge numbers, Euler characteristic, generations

For strict $SU(3)$ holonomy the Hodge diamond is fixed except for two numbers:
$h^{0,0}=h^{3,3}=h^{3,0}=h^{0,3}=1$, $h^{1,0}=h^{2,0}=0$, free: $h^{1,1}$ and $h^{2,1}$. Then
$$\chi = \sum_{p,q}(-1)^{p+q}h^{p,q} = 2\,(h^{1,1}-h^{2,1}).$$
- $h^{1,1}$ = number of Kähler moduli (sizes); $h^{2,1}$ = number of complex-structure moduli (shapes).
- **Generations.** In the heterotic $E_8\times E_8$ string with the *standard embedding* (gauge bundle =
  tangent bundle), $E_8$ breaks to $E_6$; massless $\mathbf{27}$s are counted by $h^{2,1}$ and $\overline{\mathbf{27}}$s by
  $h^{1,1}$, so the net number of chiral generations is
  $$N_{gen} = |h^{2,1}-h^{1,1}| = |\chi|/2 .$$
  Assumptions: heterotic string, standard embedding, smooth CY. For a general $SU(n)$ bundle $V$
  ($n=3,4,5$, giving $E_6$, $SO(10)$, $SU(5)$ GUTs) the net count is $\tfrac12|\int c_3(V)|$ instead (He 2010).
  In type II / F-theory models the counting is different again (brane intersections, fluxes).
- **Quintic** $Q=\{\sum_{i=0}^4 z_i^5=0\}\subset\mathbb{CP}^4$: $h^{1,1}=1$, $h^{2,1}=101$ ($126$ quintic monomials minus
  $25$ from $GL(5,\mathbb C)$), $\chi=-200$. Standard embedding would give 100 net generations: not our
  world. Tian–Yau quotient: $(h^{1,1},h^{2,1})=(6,9)$, $\chi=-6$, three generations (He 2010).
- Mirror symmetry pairs Calabi–Yaus with $h^{1,1}\leftrightarrow h^{2,1}$ exchanged and identical physics.

### 4.4 Moduli and the landscape

The Hodge numbers count massless scalar fields (moduli) in 4D. Unfixed, they would mediate new
long-range forces and let couplings drift; they must be given masses ("stabilised") by fluxes or
non-perturbative effects. Commonly cited counts, and exactly what they count:

| Number | What it counts | Source |
|---|---|---|
| 473,800,776 | 4D reflexive polytopes; each gives at least one CY threefold as a toric hypersurface | Kreuzer–Skarke 2000 |
| 30,108 | distinct $(h^{1,1},h^{2,1})$ pairs among those | Kreuzer–Skarke 2000 |
| $\sim10^{500}$ | heuristic estimate of type IIB flux vacua on typical CYs, $N\sim(2\pi L)^{K/2}/(K/2)!$; counts flux choices only, none shown to contain the Standard Model | Ashok–Douglas 2004, Denef–Douglas; as summarised by Schellekens 2013 |
| $\sim10^{272{,}000}$ | F-theory flux vacua on a single elliptic fourfold | Taylor–Wang 2015 |

None of these is a count of "universes that exist". They are counts of candidate solutions, with
known caveats (stability, control of approximations).

### 4.5 What "the shape determines the particles" means

Means (for a fixed construction, e.g. heterotic with a chosen bundle): topology fixes discrete
data (gauge group left unbroken, net number of generations, numbers of moduli); the continuous
shape and size (moduli values) fix couplings such as Yukawa couplings and hence mass ratios.
Does **not** mean: that the shape alone fixes everything (the gauge bundle, branes and fluxes are
extra choices); that a unique shape is predicted; that anyone has derived the Standard Model with
its measured masses from a Calabi–Yau; or that particles are "vibrations in the shape". Level: Theory.

### 4.6 How the famous Calabi–Yau picture is made (Hanson)

The standard image is **not** the 6D Calabi–Yau. It is a 2-real-dimensional surface inside the
Fermat quintic, in one coordinate chart, embedded in $\mathbb C^2 = \mathbb R^4$ and projected to $\mathbb R^3$. In the
affine chart $z_0 = 1$, hold $z_3,z_4$ fixed and rescale; what remains is the complex curve
$$z_1^5 + z_2^5 = 1 .$$
(Hanson 2019: "setting all the terms to constants except $z_1$ and $z_2$".) This curve has genus
$g=(n-1)(n-2)/2 = 6$ and Euler characteristic $3n-n^2=-10$ for $n=5$; it is *not* itself a Calabi–Yau.
Hanson's grid images vary the frozen coordinates over a 4D grid to suggest the full 6D space.
Hanson's 1994 paper is about Fermat curves; the Calabi–Yau use came via Brian Greene's 1999 book
(Hanson 2019 slides).

Parametrisation (Hanson 1994, eqs. 4–7 and Table 1), for any integer $n$ (use $n=5$):
```
u1(xi, th) = cosh(xi + i*th)            // = (e^(xi+i th) + e^(-xi-i th))/2
u2(xi, th) = -i * sinh(xi + i*th)       // = (e^(xi+i th) - e^(-xi-i th))/(2i);  u1^2 + u2^2 = 1
z1 = exp(2*pi*i*k1/n) * u1^(2/n)        // principal branch
z2 = exp(2*pi*i*k2/n) * u2^(2/n)
th in [0, pi/2],  xi in [-xiMax, xiMax] (Hanson uses xiMax = 1),  k1, k2 in {0..n-1}  -> n^2 = 25 patches
3D point: ( Re z1, Re z2, cos(a)*Im z1 + sin(a)*Im z2 ),  a = pi/4 in Hanson's sample
```
Checks done for this file: $z_1^5+z_2^5-1$ evaluates to $\sim10^{-15}$ at random parameters, and on this
domain $\mathrm{Re}\,u_1\ge0$, $\mathrm{Re}\,u_2\ge0$, so the principal branch of $u^{2/n}$ never jumps. Colour each patch
by $(k_1,k_2)$ (Hanson does). Use an odd number of $\xi$ steps so the mesh hits the fixed points.
The surface is cut off at $|\xi|=\xi_{max}$; the rest runs off to infinity in this chart.
Rotating the angle $a$ (or the 4D→3D projection generally) is honest and shows that the shape on
screen depends on the projection.

**Required on-screen label:** "A 2D slice of the 6D Calabi–Yau quintic (z₁⁵ + z₂⁵ = 1), drawn in 4D
and projected to 3D. Not to scale, not the real metric. Whether our universe has such a space is
unknown."

**Misconceptions.** "This is what the extra dimensions look like." "The Calabi–Yau" (there are at
least hundreds of millions). "Each bulge is one dimension."

---

## 5. Strings

### 5.1 Actions and the classical string

Nambu–Goto (area of the worldsheet): $S_{NG} = -T\int d^2\sigma\,\sqrt{-\det(\partial_a X^\mu\partial_b X_\mu)}
= -T\int d^2\sigma\sqrt{(\dot X\cdot X')^2-\dot X^2X'^2}$, $T = 1/(2\pi\alpha')$.
Polyakov (classically equivalent, quantisable): $S_P = -\frac{1}{4\pi\alpha'}\int d^2\sigma\sqrt{-g}\,g^{ab}\partial_aX^\mu\partial_bX^\nu\eta_{\mu\nu}$.

Conformal gauge $g_{ab}=\eta_{ab}$: the equation of motion is the **free wave equation**
$(\partial_\tau^2-\partial_\sigma^2)X^\mu = 0$, with the constraints (from $T_{ab}=0$)
$$\dot X\cdot X' = 0,\qquad \dot X^2 + X'^2 = 0 .$$
Closed string, $\sigma\in[0,2\pi)$, $X = X_L(\tau+\sigma)+X_R(\tau-\sigma)$ with (Tong 1.39)
$X_R^\mu = \tfrac12x^\mu+\tfrac12\alpha'p^\mu(\tau-\sigma)+i\sqrt{\tfrac{\alpha'}2}\sum_{n\ne0}\tfrac1n\alpha_n^\mu e^{-in(\tau-\sigma)}$ and
$X_L$ the same with $\tilde\alpha_n$ and $\tau+\sigma$; reality $\alpha_{-n} = \alpha_n^*$.

### 5.2 Spectrum

| | Mass formula | Ground state | First level |
|---|---|---|---|
| Open bosonic | $M^2 = \frac1{\alpha'}(N-1)$ | tachyon $M^2=-1/\alpha'$ | massless vector (photon-like) |
| Closed bosonic | $M^2 = \frac4{\alpha'}(N-1) = \frac4{\alpha'}(\tilde N-1)$, level matching $N=\tilde N$ | tachyon $-4/\alpha'$ | massless $G_{\mu\nu}, B_{\mu\nu}, \Phi$ |

**Why closed strings contain a graviton.** At $N=\tilde N=1$ the states $\alpha^i_{-1}\tilde\alpha^j_{-1}|0;p\rangle$ form a
$(D-2)^2$ tensor; it splits into symmetric traceless (graviton $G_{\mu\nu}$), antisymmetric ($B_{\mu\nu}$) and
trace (dilaton $\Phi$). A massless spin-2 particle can only couple consistently as gravity, and
independently, requiring the worldsheet theory in a curved background to stay Weyl-invariant
gives Einstein's equations $R_{\mu\nu}=0$ at lowest order in $\alpha'$ (Tong ch. 7). Every closed-string
theory contains gravity; that is the main reason string theory is studied. Superstrings remove the
tachyon (GSO projection). Level: Exact maths within the theory.

**Regge trajectories.** Maximum spin at open level $N$ is $J=N=\alpha'M^2+1$ (closed: $J=\alpha'M^2/2+2$).
Classically a rigid rotating open string has $J=\alpha'E^2$. Straight lines $J$ vs $M^2$ are seen in
hadrons ($\alpha'\approx0.9$ GeV⁻²), which is where string theory began; for fundamental strings $\alpha'$ is
unknown and enormously smaller.

### 5.3 Exact classical string motions to animate

Both satisfy the wave equation and both constraints exactly (checked by hand for this file):
- **Rotating open rod** ($\sigma\in[0,\pi]$, $X^0 = A\tau$): $X^1 = A\cos\sigma\cos\tau$, $X^2 = A\cos\sigma\sin\tau$.
  Length $2A$, ends move at $c$, $A = 2\alpha'E$, $J=\alpha'E^2$.
- **Pulsating closed loop** ($\sigma\in[0,2\pi)$, $X^0=A\tau$): $X^1 = A\cos\tau\cos\sigma$, $X^2 = A\cos\tau\sin\sigma$.
  A circle that collapses and re-expands.
- **General wiggles:** in light-cone gauge the constraints are solved by determining $X^-$, so any
  choice of transverse oscillators $\alpha^i_n,\tilde\alpha^i_n$ (with $\sum_n\alpha_{-n}\cdot\alpha_n = \sum_n\tilde\alpha_{-n}\cdot\tilde\alpha_n$ for closed
  strings) is a valid string; plot $X^i(\tau,\sigma)$ with $\tau$ as (light-cone) time. Caption that the
  animation clock is light-cone time.

**Biggest misconception to avoid:** "an electron is a string vibrating at one note, a quark at
another." In superstring theory all known particles would sit in the **massless** level; they differ
by their quantum numbers in the compact space and by gauge charges, not by vibration frequency.
Excited vibration levels have masses $\sim M_s = 1/\ell_s$, far above anything observed. Showing
harmonics as "different particles" is wrong; showing harmonics as "a tower of very heavy states"
is right.

### 5.4 Strings on a circle: momentum, winding, T-duality

Compactify $X^{25}\sim X^{25}+2\pi R$. A closed string has momentum $n/R$ and can wind $w$ times
(Tong 8.5–8.6; Tong writes $m$ for $w$):
$$M^2 = \frac{n^2}{R^2}+\frac{w^2R^2}{\alpha'^2}+\frac2{\alpha'}(N+\tilde N-2),\qquad N-\tilde N = nw .$$
- Winding mass $= 2\pi R w\,T = wR/\alpha'$: the stretched string's energy.
- **T-duality:** the full spectrum (and the interacting theory) is invariant under
  $R\leftrightarrow\alpha'/R$, $n\leftrightarrow w$, with the coupling shifting $g_s\to\sqrt{\alpha'}g_s/R$ (Tong 8.10).
- **Self-dual radius** $R=\sqrt{\alpha'}=\ell_s$: extra massless vectors appear, $U(1)^2\to SU(2)^2$
  (bosonic and heterotic strings; not type II).
- For superstrings the same formula structure holds without the tachyon; T-duality on a circle
  exchanges IIA ↔ IIB and the two heterotic theories.

**"Minimum length": does and does not mean.** Does: a circle smaller than $\ell_s$ is physically the
same as a larger one; strings cannot resolve distances below $\sim\ell_s$ because they are themselves
fuzzy at that size; high-energy string scattering is exponentially soft. Does not: space is a grid
of pixels; nothing can be smaller than $\ell_s$ (D-branes probe shorter distances, Tong §6); the
minimum is the Planck length (in weakly coupled strings $\ell_s$ and $\ell_P$ differ).

**What to show.** Slider for $R/\ell_s$ from 0.2 to 5. Plot the lowest levels $(n,w)$ as dots on a mass
axis using the formula above (with $N,\tilde N$ chosen to satisfy level matching). The plot at $R$ and at
$\ell_s^2/R$ is identical with the labels $n,w$ swapped; at $R=\ell_s$ highlight the extra massless states.
Visual: momentum = wave around the circle, winding = string wrapped $w$ times.

### 5.5 D-branes (one paragraph)

Open strings may have Dirichlet boundary conditions: their endpoints are fixed to a $p$-dimensional
surface, a D$p$-brane (Polchinski 1995; see his 1996 TASI lectures). The branes are dynamical objects with tension
$T_{Dp} = 1/\big((2\pi)^p g_s\ell_s^{p+1}\big)$ (so heavy at weak coupling, mass $\propto1/g_s$), they carry
Ramond–Ramond charge, and the open strings ending on them give a gauge field living on the brane:
$N$ coincident branes carry $U(N)$. Closed strings (gravity) are not tied to the brane. This is the
string-theory origin of brane worlds (§8). Level: Theory (exact within string theory).

---

## 6. The five superstrings, dualities and M-theory

### 6.1 The theories and the web

| Theory (10D) | Supersymmetry | Strings | Gauge group |
|---|---|---|---|
| Type I | $\mathcal N=1$ (16) | open + closed, unoriented | $SO(32)$ |
| Type IIA | $\mathcal N=2$ (32), non-chiral | closed | none perturbatively (RR fields) |
| Type IIB | $\mathcal N=2$ (32), chiral | closed | none perturbatively |
| Heterotic $SO(32)$ | $\mathcal N=1$ | closed | $SO(32)$ |
| Heterotic $E_8\times E_8$ | $\mathcal N=1$ | closed | $E_8\times E_8$ |

Dualities (Witten 1995 and related 1995 work): IIA ↔ IIB and HO ↔ HE by T-duality on a circle;
type I ↔ HO by strong/weak (S-)duality; IIB is S-dual to itself ($g_s\to1/g_s$); **strongly coupled IIA
is 11D M-theory on a circle**; strongly coupled HE is M-theory on an interval (§6.3). Level: Theory
(dualities are conjectures with extensive checks; not proven, not tested experimentally).

### 6.2 M2, M5 and the IIA relation

The 3-form $C$ couples electrically to the **M2-brane** (2 space dimensions, tension
$T_{M2}=1/((2\pi)^2\ell_p^3)$) and magnetically to the **M5-brane** ($T_{M5}=1/((2\pi)^5\ell_p^6)$, standard; not
re-derived here). Put M-theory on a circle of radius $R_{11}$:
- An 11D graviton with momentum $k/R_{11}$ around the circle is, in 10D, a D0-brane bound state with
  mass $k/(g_s\ell_s)$. Matching: $R_{11} = g_s\ell_s$.
- An M2 wrapped on the circle is the IIA fundamental string: $\frac{1}{2\pi\ell_s^2} = 2\pi R_{11}\cdot\frac{1}{(2\pi)^2\ell_p^3}$, so
$$\boxed{\ell_p = g_s^{1/3}\ell_s,\qquad R_{11} = g_s\ell_s = g_s^{2/3}\ell_p}$$
  (Lin 2025, eqs. 141–142; Witten 1995 wrote $r = \lambda^{2/3}$ in 11D units with $\lambda = g_s$). Factors of $2\pi$
  in the definition of $\ell_p$ differ between references; this file uses Lin's.
- Unwrapped M2 = D2-brane ($T_{D2}=T_{M2}$ reproduces $\ell_p^3=g_s\ell_s^3$, a consistency check); wrapped M5 =
  D4-brane; unwrapped M5 = NS5-brane.
- Weak coupling $g_s\to0$: circle smaller than $\ell_s$, theory looks 10D. Strong coupling: circle large
  in 11D Planck units ($R_{11}/\ell_p = g_s^{2/3}$), an 11th dimension opens up.

### 6.3 Hořava–Witten

The $E_8\times E_8$ heterotic string at strong coupling is M-theory on $\mathbb R^{10}\times S^1/\mathbb Z_2$: an interval
whose two ends are 10-dimensional boundary walls. Anomaly cancellation forces exactly one $E_8$
gauge multiplet (248 vectors) on each wall; the interval length grows with the coupling,
$R \propto\lambda_{E8}^{2/3}$ (Hořava–Witten 1996). The heterotic string is an M2 stretched between the walls.
This is a brane world in M-theory (gauge fields on the walls, gravity in between). Level: Theory.

### 6.4 Down to four dimensions; F-theory

- M-theory on a compact 7-manifold with **$G_2$ holonomy** keeps 1/8 of 32 supercharges = 4, i.e. 4D
  $\mathcal N=1$. Smooth $G_2$ manifolds give no non-abelian gauge group and no chiral fermions; these need
  singularities (Acharya–Gukov 2004). So "10 + 1 = 3 large + 7 compact" is consistent, and the 7
  are one $G_2$ shape, not a CY plus a separate "11th".
- Also used: IIA on CY₃ (= M-theory on CY₃ × small circle), heterotic on CY₃, F-theory on CY₄.
- **F-theory's "12 dimensions" (careful).** Type IIB has a complex field $\tau = C_0 + ie^{-\phi}$ that
  transforms under $SL(2,\mathbb Z)$ exactly like the shape parameter of a torus. F-theory (Vafa 1996)
  geometrises this: the 10D spacetime is the base of an elliptic fibration and $\tau$ is the shape of
  an auxiliary torus at each point. Vafa speaks of a 12D theory "with signature (10,2)", but says
  the physical on-shell states carry only 10-dimensional momenta. The two extra dimensions are a
  bookkeeping device for $\tau$, not two more physical dimensions, and there is no 12D field theory
  behind it. On the site: never put "12" on the ladder.

**Misconceptions.** "M-theory is the theory of membranes" (it contains M2 and M5; it is not
defined as a membrane theory; "M" was left unexplained by Witten). "The 11th dimension was found."
"All strings are membranes in disguise" (true for IIA and, as stretched membranes, HE; the other
three theories relate to M-theory only via further dualities).

---

## 7. Sizes and experiment

### 7.1 Planck and string lengths

$\ell_P = 1.616\times10^{-35}$ m. $\ell_s$ is a free parameter. In type II, $16\pi G_{10} = (2\pi)^7g_s^2\alpha'^4$ and
$G_4 = G_{10}/V_6$ (consistent with the D-brane tensions above; Polchinski conventions). In weakly
coupled heterotic models $M_s$ lands near $10^{17}$ GeV ($\ell_s$ a few to ten times $\ell_P$; standard
estimate, original not read). In brane constructions $M_s$ can be as low as the TeV range: the LHC
excludes string resonances below about 7.9–8 TeV (CMS/ATLAS dijets, PDG 2024).

### 7.2 Large extra dimensions (ADD 1998)

Only gravity moves in $\delta$ extra flat dimensions of radius $R$ (torus, volume $(2\pi R)^\delta$); the
Standard Model lives on a 3-brane. PDG convention: $M_P^2 = R^\delta M_D^{2+\delta}$ ($M_P$ reduced, $M_D$ the
fundamental scale). For $M_D = 1$ TeV (computed for this file; matches PDG eq. 85.11):

| $\delta$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $R$ ($M_D=1$ TeV) | $1.2\times10^{12}$ m | 0.48 mm | 3.6 nm | 10 pm | 0.28 pm | 27 fm |
| $R$ ($M_D=10$ TeV) | $1.2\times10^{9}$ m | 4.8 μm | 0.077 nm | 0.31 pm | 11 fm | 1.2 fm |

$\delta=1$ is excluded (solar-system gravity). With the non-reduced $M_{Pl}$ (as in ADD's paper) the
radii are about 2–5 times larger: always state the convention.

**Force law (exact for Newtonian gravity on $\mathbb R^3\times T^\delta$).** Using $F=G_nMm/r^{n-1}$ in $n=3+\delta$ space:
- $r\ll R$: $F\propto1/r^{2+\delta}$; $r\gg R$: $F = G_{\text{eff}}Mm/r^2$ with $G_{\text{eff}} = \Omega_{n-1}G_n/(4\pi V_\delta)$,
  $\Omega_{n-1}=2\pi^{n/2}/\Gamma(n/2)$, $V_\delta=(2\pi R)^\delta$. Example $\delta=1$: $G_{\text{eff}} = G_5/(4R)$.
- Exact potential, $\delta=1$, source on the brane, field point at brane distance $\rho$ and circle angle $y/R$:
  $$\Phi(\rho,y) = -\frac{G_{\text{eff}}M}{\rho}\,\frac{\sinh(\rho/R)}{\cosh(\rho/R)-\cos(y/R)}$$
  (sum of images = sum of KK Yukawas $\sum_ne^{-|n|\rho/R}e^{iny/R}$; identity checked numerically for this file).
  General $\delta$: $\Phi = -\frac{G_{\text{eff}}M}{\rho}\sum_{\vec n\in\mathbb Z^\delta}e^{-|\vec n|\rho/R}e^{i\vec n\cdot\vec y/R}$.
- Experiments parametrise $V=-\frac{GMm}{r}(1+\alpha e^{-r/\lambda})$. Newtonian counting gives $\alpha=2\delta$ (the $2\delta$
  lightest KK modes); in general relativity massive KK gravitons couple more strongly and the PDG
  gives $\alpha=16/3$ for $\delta=2$ (i.e. $8\delta/3$), $\lambda=R$. The site's Newtonian simulation will be off by
  this factor 4/3: caption it "Newtonian model".

**Bounds (most recent I could find and read):**
- Short-range gravity: Lee, Adelberger, Cook, Fleischer, Heckel, *PRL* 124, 101101 (2020), torsion
  pendulum, separations 52 μm–3 mm: no deviation; gravitational-strength Yukawa ($|\alpha|=1$) excluded
  for $\lambda>38.6$ μm (95% CL); the largest extra dimension must have toroidal radius $<30$ μm. PDG
  2024 (citing Tan et al., *PRL* 116, 131101, 2016): $R<30$ μm for $\delta=2$, i.e. $M_D>4.0$ TeV (my
  conversion reproduces 4.0 TeV). I found no stronger result from 2021–2026, but did not search
  exhaustively.
- Colliders (graviton emission, jet + missing momentum, 13 TeV, 95% CL, PDG 2024): ATLAS
  (139 fb⁻¹) $M_D>11.2$ TeV ($\delta=2$) to 5.9 TeV ($\delta=6$); CMS (137 fb⁻¹) 10.7 to 5.5 TeV.
  Newest: CMS-PAS-NPS-25-008 (preliminary, July 2026, 62 fb⁻¹ at 13.6 TeV): $M_D$ > about 10.6 to
  5.1 TeV for 2–7 extra dimensions.
- Astrophysics (PDG 2024): SN1987A $M_D>27$ TeV ($\delta=2$); neutron-star heating $M_D>1700$ TeV ($\delta=2$),
  weaker if KK gravitons decay invisibly.
- If Standard Model fields also move in the extra dimensions: KK masses $\gtrsim$ 3–10 TeV from
  electroweak precision (PDG), i.e. $R\lesssim10^{-19}$–$10^{-20}$ m.

### 7.3 Warped extra dimensions (Randall–Sundrum 1999)

RS1: one extra dimension, an interval $y\in[0,\pi R]$ ($S^1/\mathbb Z_2$) in 5D anti-de Sitter space,
$$ds^2 = e^{-2k|y|}\eta_{\mu\nu}dx^\mu dx^\nu + dy^2 ,$$
with $M_P^2 = \frac{M_5^3}{k}(1-e^{-2k\pi R})$ (PDG 85.17; PDG writes the action with $\tfrac12M_5^3$). Scales on the
"IR" brane at $y=\pi R$ are redshifted by $e^{-k\pi R}$; $kR\approx11$ gives $e^{-k\pi R}\sim10^{-15}$, turning
$10^{18}$ GeV into TeV: an exponential hierarchy from a small extra dimension. KK graviton masses
$\approx(n+\tfrac14)\pi k e^{-\pi kR}$ for large $n$ (PDG 85.20). Bounds: lightest KK graviton $>4.5$ TeV for
$k/M_P=0.1$ (ATLAS diphoton, 139 fb⁻¹); CMS dileptons 2.47–4.78 TeV for $k/M_P=0.01$–$0.1$ (PDG 2024).
RS2 (hep-th/9906064): the extra dimension is infinite, yet 4D gravity is reproduced because the
graviton is bound to the brane; corrections to Newton fall like $1/(kr)^2$ and short-range tests
bound $1/k$ to tens of μm (coefficient not checked here). Level: Theory.

### 7.4 Status statement for the video

"Extra dimensions have been searched for with torsion pendulums down to about 50 micrometres, at
the Large Hadron Collider, and in supernovae and neutron stars. Nothing has been found. If gravity
alone spreads into extra dimensions they are smaller than about 30 micrometres; if ordinary
particles do, smaller than about $10^{-19}$ metres. String theory most often puts them near
$10^{-34}$ m, far beyond any experiment. There is no experimental evidence for them to date."

---

## 8. Brane worlds versus the site's "confined creature" mode

**Physics (Theory).** In ADD, RS and Hořava–Witten (and with D-branes in string theory), Standard
Model particles and forces are confined to a 3+1-dimensional brane: open strings end on it, so
photons, gluons, electrons cannot leave. Gravity (closed strings) propagates in the full space.

**How close the site's mode is.** The site confines a creature to a line or sheet inside a large
4D world. Correct as analogy: the creature cannot move or look off its surface; its experience is
lower-dimensional while the world is not.

**Where the analogy stops:**
1. In a brane world the *forces* that hold matter together and carry light are confined too, so on
   the brane electromagnetism falls off as $1/r^2$ and atoms are normal. In the site, if 4D forces act
   on the creature, its forces would spread into 4D ($1/r^3$), which is the "true lower/higher world"
   difference `PHYSICS.md` already notes.
2. Bulk objects: in a brane world nothing made of Standard Model matter exists off the brane, and
   light from the bulk never reaches the creature. A 4D ball made of ordinary matter passing through
   the brane (the "dot grows into a disc" scene) is good geometry teaching but not brane-world
   physics. The only things that cross are gravitons, and bulk matter would be felt by gravity only.
3. The bulk must be compact (ADD, $R\lesssim30$ μm) or strongly warped (RS) so that gravity on the brane
   is $1/r^2$ at large distances. A creature's sheet inside an infinite flat 4D bulk would feel
   $1/r^3$ gravity at all distances: excluded for our world.
4. Real branes have tension, can wobble (their position is a field on the brane) and have thickness
   $\lesssim1/\text{TeV}$; the site's sheet is a rigid geometric constraint.

**What to show.** A "Brane world" Lab variant: two masses on a 2D sheet ($\delta=1$ extra compact
dimension of radius $R$), Newtonian force from the closed-form $\Phi$ in §7.2: force goes from $1/r^2$
(sheet+1) at $r\ll R$ to $1/r$ (sheet) at $r\gg R$; light (rendering) stays on the sheet. Caption
"Analogy: Newtonian gravity leaking into one hidden direction".

---

## 9. Recommendation for the site's ladder (5–10 space dimensions)

Two facts drive this:
- In superstring theory the total is always 9 space dimensions (M-theory 10). A "world with 6
  space dimensions" is not a string-theory world; worlds with 5–8 are toy Kaluza–Klein worlds
  (general relativity with extra compact dimensions), exact as maths, not proposed as ours.
- Our world has 3 large dimensions; every physical proposal adds compact ones to those 3. The
  site's 4 = "4 large" is a geometry teaching world, not a physics proposal.

Recommended convention: in the Zoom branch, **N space = 3 large + (N−3) compact**, tagged
`3 large + k curled + 1 time`. Then:

| Space dims | What to show | Formulas | Label |
|---|---|---|---|
| 4 (alt. experience) | Kaluza–Klein circle: charge = momentum around it | §3: $q_k=k\sqrt{16\pi G}/R$, $m_k=|k|/R$, $R=2\ell_P/\sqrt\alpha$ | Exact maths; fails as a model of the electron |
| 5 | 2-torus: two circles, two charges; shape of the torus is a field (modulus) | $m^2=(n_1/R_1)^2+(n_2/R_2)^2$; square with opposite edges glued | Exact maths; toy world |
| 6–8 | Higher tori; optionally a K3 surface at 3+4 (a genuine 4-dimensional Ricci-flat space used in string dualities); brane-world gravity leak (§8) | §4.1, §7.2 | Exact maths; toy worlds. Caption: "Nature does not add dimensions one at a time." |
| 9 | 3 large + one Calabi–Yau: Hanson slice at every point; string at the massless level; T-duality slider on a circle | §4.6, §5.2–5.4 | Theory (superstring) |
| 10 | 3 large + 7: IIA as M-theory, circle radius $R_{11}=g_s\ell_s$ grows with a coupling slider; or a $G_2$ space shown abstractly; Hořava–Witten walls | §6.2–6.4 | Theory (M-theory) |

Ball-volume facts (5D peak) belong with the large-dimension geometry, not the curled ladder.

---

## Sources

Marked **[read]** where I read the text (full or the relevant sections), **[abstract]** where I read
only the abstract/summary page, **[search]** where I relied on a search-result summary only.

Counting, strings, T-duality, minimum length
- D. Tong, *Lectures on String Theory* (2009, arXiv:0908.0333), https://davidtong.org/pdfs/teaching/string-theory/string.pdf and https://arxiv.org/abs/0908.0333 [read: §1–2, §4.4, §5.3, §6, §8]
- J. Polchinski, *TASI Lectures on D-Branes* (1996), https://arxiv.org/abs/hep-th/9611050 [read, first part]
- W. Nahm, "Supersymmetries and their representations", Nucl. Phys. B135, 149 (1978), https://inspirehep.net/record/120988 [search; original not read]
- M. Tegmark, "On the dimensionality of spacetime", Class. Quantum Grav. 14, L69 (1997), https://arxiv.org/abs/gr-qc/9702052 [abstract]
- Not read (cited as standard): Zwiebach, *A First Course in String Theory*; Polchinski, *String Theory* vols 1–2; Becker–Becker–Schwarz; Cremmer–Julia–Scherk 1978.

Popular ladder
- R. Bryanton, *Imagining the Tenth Dimension* (2006 animation, 2007 book); author's blog https://imaginingthetenthdimension.blogspot.com and discussion https://www.physicsforums.com/threads/imagining-the-10th-dimension-by-rob-bryanton.384140 [search]

Kaluza–Klein
- J.M. Overduin, P.S. Wesson, "Kaluza–Klein gravity", Phys. Rept. 283, 303 (1997), https://arxiv.org/abs/gr-qc/9805018 [read, §1–3, §6]
- O. Klein, "The atomicity of electricity as a quantum theory law", Nature 118, 516 (1926), https://ui.adsabs.harvard.edu/abs/1926Natur.118..516K/abstract [search; OCR snippet only]
- T. Kaluza, "Zum Unitätsproblem der Physik", Sitzungsber. Preuss. Akad. Wiss. (1921) [not read; via Overduin–Wesson]

Calabi–Yau, generations, landscape, pictures
- B. Greene, *String Theory on Calabi–Yau Manifolds* (TASI 1996), https://arxiv.org/abs/hep-th/9702155 [read: Calabi–Yau definition, Hodge numbers, quintic]
- Y.-H. He, *An Algorithmic Approach to Heterotic String Phenomenology* (2010), https://arxiv.org/abs/1001.2419 [read, §1, §3: standard embedding, |χ|/2, Tian–Yau, c₃(V)]
- P. Candelas, G. Horowitz, A. Strominger, E. Witten, "Vacuum configurations for superstrings", Nucl. Phys. B258, 46 (1985) [search: catalog/abstract only]
- M. Kreuzer, H. Skarke, "Complete classification of reflexive polyhedra in four dimensions", Adv. Theor. Math. Phys. 4, 1209 (2002), https://arxiv.org/abs/hep-th/0002240 [abstract]
- W. Taylor, Y.-N. Wang, "The F-theory geometry with most flux vacua", JHEP 12 (2015) 164, https://arxiv.org/abs/1511.03209 [abstract]
- S. Ashok, M. Douglas, "Counting flux vacua", JHEP 0401:060 (2004), https://arxiv.org/abs/hep-th/0307049; A.N. Schellekens, "Life at the interface of particle physics and string theory", Rev. Mod. Phys. (2013), https://arxiv.org/abs/1306.5083 [search]
- A.J. Hanson, "A construction for computer visualization of certain complex curves", Notices AMS 41(9), 1156–1163 (1994), https://homes.luddy.indiana.edu/hansona/papers/CP2-94.pdf [read]
- A.J. Hanson, "Illustrating string theory using Fermat surfaces", slides, Illustrating Geometry and Topology, Brown/ICERM (2019), https://homes.luddy.indiana.edu/hansona/papers/Brown-IGT-Sep19.pdf [read]

Dualities, M-theory, F-theory, G₂
- E. Witten, "String theory dynamics in various dimensions", Nucl. Phys. B443, 85 (1995), https://arxiv.org/abs/hep-th/9503124 [read, IIA/11D section]
- P. Hořava, E. Witten, "Heterotic and type I string dynamics from eleven dimensions", Nucl. Phys. B460, 506 (1996), https://arxiv.org/abs/hep-th/9510209 [read, relevant sections]
- H.W. Lin, *TASI lectures on Matrix Theory from a modern viewpoint* (2025), https://arxiv.org/abs/2508.20970 [read: M-theory/IIA appendix, eqs. 141–142]
- C. Vafa, "Evidence for F-theory", Nucl. Phys. B469, 403 (1996), https://arxiv.org/abs/hep-th/9602022 [read, relevant passages]
- B.S. Acharya, S. Gukov, "M theory and singularities of exceptional holonomy manifolds", Phys. Rept. 392, 121 (2004), https://arxiv.org/abs/hep-th/0409191 [abstract]

Sizes, experiments, brane worlds
- Z. Demiragli, A. Pomarol, "Extra dimensions", review 85 in S. Navas et al. (Particle Data Group), Phys. Rev. D 110, 030001 (2024), revised Aug 2023, https://ccwww.kek.jp/pdg/2024/reviews/rpp2024-rev-extra-dimensions.pdf [read]
- J.G. Lee, E.G. Adelberger, T.S. Cook, S.M. Fleischer, B.R. Heckel, "New test of the gravitational 1/r² law at separations down to 52 μm", PRL 124, 101101 (2020), https://arxiv.org/abs/2002.11761 [read: abstract and conclusions]
- W.-H. Tan et al., PRL 116, 131101 (2016) [via PDG]
- CMS Collaboration, CMS-PAS-NPS-25-008 (preliminary, 2026), https://cms-results.web.cern.ch/cms-results/public-results/preliminary-results/NPS-25-008/index.html [summary page]
- N. Arkani-Hamed, S. Dimopoulos, G. Dvali, "The hierarchy problem and new dimensions at a millimeter", PLB 429, 263 (1998), https://arxiv.org/abs/hep-ph/9803315 [abstract]
- L. Randall, R. Sundrum, "A large mass hierarchy from a small extra dimension", PRL 83, 3370 (1999), https://arxiv.org/abs/hep-ph/9905221 [abstract]; "An alternative to compactification", PRL 83, 4690 (1999), https://arxiv.org/abs/hep-th/9906064 [abstract]
