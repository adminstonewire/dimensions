import type { Experience, LensId } from '../contracts';

export interface State {
  d: number;
  e: string;
  v: LensId;
}

const DEFAULT_DIM = 3;

/** Turns possibly-wrong values (from the URL or a dropdown) into a state that always exists. */
export function resolve(all: Experience[], d: string | null, e: string | null, v: string | null): State {
  const dim = d !== null && /^\d+$/.test(d) && +d <= 10 ? +d : DEFAULT_DIM;
  const list = all.filter((x) => x.dim === dim);
  const exp = list.find((x) => x.id === e) ?? list[0];
  const lens = exp.lenses.find((l) => l === v) ?? exp.lenses[0];
  return { d: dim, e: exp.id, v: lens };
}

export function parseState(search: string, all: Experience[]): State {
  const p = new URLSearchParams(search);
  return resolve(all, p.get('d'), p.get('e'), p.get('v'));
}

export const toSearch = (s: State) => `?d=${s.d}&e=${s.e}&v=${s.v}`;

export const findExperience = (all: Experience[], s: State) =>
  all.find((x) => x.dim === s.d && x.id === s.e)!;
