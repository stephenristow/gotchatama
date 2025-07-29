import { Expansion } from './expansion.ts';

export interface Tama {
  id: number;
  name: String;
  expansion: Expansion;
  image: any;
  acquired: boolean;
}
