import type { Experience } from '../contracts';
import { hypercube } from './hypercube';

export const experiences: Experience[] = Array.from({ length: 11 }, (_, n) => hypercube(n));
