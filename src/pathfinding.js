import { isWalkable } from './map.js';

const DIRECTIONS = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
];

// Breadth-first search on the grid; returns an array of {col, row} steps
// from (excluding) the start tile to (including) the goal tile, or [] if unreachable.
export function findPath(start, goal) {
    if (start.col === goal.col && start.row === goal.row) return [];
    if (!isWalkable(goal.col, goal.row)) return [];

    const key = (c, r) => `${c},${r}`;
    const visited = new Set([key(start.col, start.row)]);
    const cameFrom = new Map();
    const queue = [start];

    while (queue.length) {
        const current = queue.shift();

        if (current.col === goal.col && current.row === goal.row) {
            const path = [];
            let node = current;
            while (node.col !== start.col || node.row !== start.row) {
                path.unshift(node);
                node = cameFrom.get(key(node.col, node.row));
            }
            return path;
        }

        for (const [dx, dy] of DIRECTIONS) {
            const next = { col: current.col + dx, row: current.row + dy };
            const nextKey = key(next.col, next.row);

            if (visited.has(nextKey) || !isWalkable(next.col, next.row)) continue;

            visited.add(nextKey);
            cameFrom.set(nextKey, current);
            queue.push(next);
        }
    }

    return [];
}
