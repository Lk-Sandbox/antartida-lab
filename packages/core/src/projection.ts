export const MAP_SIZE = 1000;
export const STEREO_RADIUS = 1590;

const RAD = Math.PI / 180;

/** Polar stereographic projection into the 0..1000 map space, Greenwich up. */
export function project(lon: number, lat: number): { x: number; y: number } {
  const r = STEREO_RADIUS * Math.tan(((90 - Math.abs(lat)) / 2) * RAD);
  return { x: 500 + r * Math.sin(lon * RAD), y: 500 - r * Math.cos(lon * RAD) };
}
