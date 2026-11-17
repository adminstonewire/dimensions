import type { Experience, LensId } from '../contracts';
import { resolve, type State } from '../app/url';

const DIMENSIONS = ['Point', 'Line', 'Plane', 'Space', 'Hyperspace', 'Five', 'Six', 'Seven', 'Eight', 'Superstrings', 'M-theory'];
const LENSES: Record<LensId, string> = { be: 'Be it', watch: 'Watch it', slice: 'Slice', shadow: 'Shadow', time: 'Time', zoom: 'Zoom' };

const field = (label: string) => `<label><span class="sr">${label}</span><select></select></label>`;

const PLAY = `<button class="play" type="button"><svg viewBox="0 0 12 12" aria-hidden="true"><path class="i-play" d="M3 1.5v9l7.5-4.5z"/><path class="i-pause" d="M2.5 1.5H5v9H2.5zM7 1.5h2.5v9H7z"/></svg><span>Play</span></button>`;

export function mountUI(all: Experience[], initial: State, onChange: (s: State) => void, onPlay: (playing: boolean) => void) {
  const root = document.createElement('div');
  root.className = 'ui';
  root.innerHTML = `
    <header class="bar">${PLAY}${field('Dimension')}${field('Experience')}${field('View')}</header>
    <footer class="foot"><p class="caption"></p><p class="tag"></p></footer>`;
  document.body.append(root);
  const [selD, selE, selV] = root.querySelectorAll('select');
  const caption = root.querySelector('.caption')!;
  const tag = root.querySelector('.tag')!;

  const fill = (sel: HTMLSelectElement, items: [string, string][], value: string) => {
    sel.replaceChildren(...items.map(([v, t]) => new Option(t, v)));
    sel.value = value;
  };

  function show(s: State) {
    const exp = all.find((x) => x.dim === s.d && x.id === s.e)!;
    document.documentElement.dataset.n = String(s.d); // selects --accent in styles.css
    fill(selD, DIMENSIONS.map((name, i) => [String(i), `${i} · ${name}`]), String(s.d));
    fill(selE, all.filter((x) => x.dim === s.d).map((x) => [x.id, x.title]), s.e);
    fill(selV, exp.lenses.map((l) => [l, LENSES[l]]), s.v);
    caption.textContent = exp.caption;
    tag.innerHTML = `<b>${s.d}</b> space + 1 time`;
  }

  const change = () => {
    const s = resolve(all, selD.value, selE.value, selV.value);
    show(s);
    onChange(s);
  };
  // Changing a higher-level select resets the ones below it to their defaults.
  selD.addEventListener('change', () => { selE.value = ''; selV.value = ''; change(); });
  selE.addEventListener('change', () => { selV.value = ''; change(); });
  selV.addEventListener('change', change);

  const play = root.querySelector('button')!;
  const playLabel = play.querySelector('span')!;
  const togglePlay = () => {
    const on = play.classList.toggle('on');
    playLabel.textContent = on ? 'Pause' : 'Play';
    onPlay(on);
  };
  play.addEventListener('click', togglePlay);
  // A mouse click must not leave focus on the button, or Space and Enter (move up, act) would press it too.
  play.addEventListener('mousedown', (e) => e.preventDefault());

  addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || document.activeElement instanceof HTMLSelectElement) return;
    if (e.code === 'KeyH') root.hidden = !root.hidden;
    if (e.code === 'KeyP') togglePlay();
  });

  show(initial);
}
