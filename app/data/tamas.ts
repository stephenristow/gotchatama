import { tamaImages } from './tamaImages.ts';
import json from '../../data/tamas.json';
import { Expansion } from '../../app/types/expansion.ts';

export interface PackedTama {
  id:        number;
  name:      string;
  expansion: Expansion;
  imageFile: string;            // "./assets/tamas/1.png", etc.
}

export const tamas: Array<{
  id:        number;
  name:      string;
  expansion: Expansion;
  image:     any;
}> = (json as PackedTama[]).map(t => ({
  id:        t.id,
  name:      t.name,
  expansion: t.expansion,
  image:     tamaImages[t.id], 
}));
