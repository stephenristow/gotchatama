import { Expansion } from './expansion.ts';

export interface Filters {
  showAcquired: boolean;
  showUnacquired: boolean;
  onlyBaseGame: boolean;
  onlyExpansions: boolean;
  expansions: Expansion[];
}
