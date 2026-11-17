import type { Experience } from '../contracts';
import { hypercube } from './hypercube';
import { world } from './world';

// The first experience of a dimension is the one a dimension change lands on, so World comes first.
export const experiences: Experience[] = [...[1, 2, 3].map(world), ...Array.from({ length: 11 }, (_, n) => hypercube(n))];
