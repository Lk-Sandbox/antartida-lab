export const CLUSTER_PX = 46;

export interface Positioned {
  x: number;
  y: number;
}

/**
 * Greedy clustering by on-screen distance: each unused point takes every later
 * unused point closer than `threshold` px at the current scale (px per map unit).
 */
export function clusterPoints<T extends Positioned>(points: readonly T[], scale: number, threshold = CLUSTER_PX): T[][] {
  const used = points.map(() => false);
  const groups: T[][] = [];
  points.forEach((p, i) => {
    if (used[i]) return;
    used[i] = true;
    const group = [p];
    points.forEach((q, j) => {
      if (!used[j] && Math.hypot(p.x - q.x, p.y - q.y) * scale < threshold) {
        used[j] = true;
        group.push(q);
      }
    });
    groups.push(group);
  });
  return groups;
}

export function centroid(group: readonly Positioned[]): Positioned {
  return {
    x: group.reduce((a, g) => a + g.x, 0) / group.length,
    y: group.reduce((a, g) => a + g.y, 0) / group.length,
  };
}

/** Zoom needed for a cluster's members to separate (prototype heuristic). */
export function separationZoom(group: readonly Positioned[], S: number, threshold = CLUSTER_PX): number {
  const c = centroid(group);
  const maxD = Math.max(...group.map((g) => Math.hypot(g.x - c.x, g.y - c.y)));
  return (threshold * 1.25 * 1000) / (S * Math.max(4, maxD * 2));
}
