import { describe, expect, it } from 'vitest';
import type { Experience } from '../contracts';
import { parseState } from './url';

const ex = (dim: number, id: string, lenses: Experience['lenses']) => ({ dim, id, lenses }) as Experience;
const all = [ex(3, 'world', ['be', 'watch']), ex(3, 'lab', ['slice']), ex(4, 'world', ['shadow'])];

describe('parseState', () => {
  it('reads a valid URL', () => {
    expect(parseState('?d=3&e=lab&v=slice', all)).toEqual({ d: 3, e: 'lab', v: 'slice' });
  });
  it('falls back to dimension 3, first experience, first lens', () => {
    expect(parseState('', all)).toEqual({ d: 3, e: 'world', v: 'be' });
    expect(parseState('?d=99&e=nope&v=zoom', all)).toEqual({ d: 3, e: 'world', v: 'be' });
    expect(parseState('?d=abc', all)).toEqual({ d: 3, e: 'world', v: 'be' });
  });
  it('repairs a bad experience or lens within a valid dimension', () => {
    expect(parseState('?d=4&e=lab&v=be', all)).toEqual({ d: 4, e: 'world', v: 'shadow' });
    expect(parseState('?d=3&e=lab&v=be', all)).toEqual({ d: 3, e: 'lab', v: 'slice' });
  });
});
