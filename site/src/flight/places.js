// World layout. Cities sit where an equirectangular projection of their real
// coordinates puts them (x = (lon - 79) * 10, z = -(lat - 18) * 10), so the
// flight directions are true. No country outline is drawn, only local coast.
import { Vector2, Vector3 } from 'three';

export const CITY = {
  BOM: new Vector3(-61.2, 0, -10.8),
  IXW: new Vector3(72.0, 0, -48.0),
  MAA: new Vector3(12.7, 0, 49.2),
};

// Signed coast lines (land on the side the normal points to).
export const COAST = {
  westA: new Vector2(-63.6, -11.0),
  westB: new Vector2(-27.0, 80.0),
  eastA: new Vector2(15.4, 49.2),
  eastB: new Vector2(92.0, -44.0),
};

// Small water bodies: Mumbai harbour, Jubilee Park lake (x, z, rx, rz).
export const HARBOUR = [-55.2, -6.0, 3.3, 10.5];
export const LAKE = [70.6, -46.2, 0.9, 0.55];

// x of the west coastline at a given z (straight line, before noise).
export function westCoastX(z) {
  const { westA: a, westB: b } = COAST;
  return a.x + ((z - a.y) / (b.y - a.y)) * (b.x - a.x);
}

// Marine Drive, the "Queen's Necklace": streetlights along the south-west
// shore that light up at night (z range on the west coast).
export const NECKLACE = { z0: -8.6, z1: -2.2, inset: 0.45, count: 26 };

// Mumbai airport runway (plane starts here, heading south).
export const RUNWAY = { x: -62.2, z0: -26, z1: -18.5 };

// Mumbai's suburban rail line (the local train runs on it).
export const TRACK = { x: -59.7, z0: -27, z1: -1 };
