import { isWalkable } from './map.js';

const DIAGONAL_COST = Math.SQRT2;

const DIRECTIONS = [
    { dx: 0, dy: -1, cost: 1 },
    { dx: 0, dy: 1, cost: 1 },
    { dx: -1, dy: 0, cost: 1 },
    { dx: 1, dy: 0, cost: 1 },
    { dx: -1, dy: -1, cost: DIAGONAL_COST },
    { dx: 1, dy: -1, cost: DIAGONAL_COST },
    { dx: -1, dy: 1, cost: DIAGONAL_COST },
    { dx: 1, dy: 1, cost: DIAGONAL_COST },
];

const key = (c, r) => `${c},${r}`;

// Octile distance: admissible heuristic for 8-directional movement.
function heuristic(a, b) {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return Math.max(dx, dy) + (DIAGONAL_COST - 1) * Math.min(dx, dy);
}

// A diagonal step is only allowed if it isn't cutting across two orthogonal walls.
function canStep(current, dx, dy) {
    const next = { col: current.col + dx, row: current.row + dy };
    if (!isWalkable(next.col, next.row)) return false;

    if (dx !== 0 && dy !== 0) {
        if (!isWalkable(current.col + dx, current.row)) return false;
        if (!isWalkable(current.col, current.row + dy)) return false;
    }

    return true;
}

// A* search over 8 directions; returns an array of {col, row} steps
// from (excluding) the start tile to (including) the goal tile, or [] if unreachable.
export function findPath(start, goal) {
    if (start.col === goal.col && start.row === goal.row) return [];
    if (!isWalkable(goal.col, goal.row)) return [];

    const startKey = key(start.col, start.row);
    const cameFrom = new Map();
    const gScore = new Map([[startKey, 0]]);
    const open = [{ col: start.col, row: start.row, f: heuristic(start, goal) }];
    const closed = new Set();

    while (open.length) {
        let bestIndex = 0;
        for (let i = 1; i < open.length; i++) {
            if (open[i].f < open[bestIndex].f) bestIndex = i;
        }
        const current = open.splice(bestIndex, 1)[0];
        const currentKey = key(current.col, current.row);

        if (current.col === goal.col && current.row === goal.row) {
            const path = [];
            let node = current;
            let nodeKey = currentKey;
            while (nodeKey !== startKey) {
                path.unshift({ col: node.col, row: node.row });
                node = cameFrom.get(nodeKey);
                nodeKey = key(node.col, node.row);
            }
            return path;
        }

        if (closed.has(currentKey)) continue;
        closed.add(currentKey);

        for (const { dx, dy, cost } of DIRECTIONS) {
            if (!canStep(current, dx, dy)) continue;

            const next = { col: current.col + dx, row: current.row + dy };
            const nextKey = key(next.col, next.row);
            if (closed.has(nextKey)) continue;

            const tentativeG = gScore.get(currentKey) + cost;
            if (tentativeG < (gScore.get(nextKey) ?? Infinity)) {
                gScore.set(nextKey, tentativeG);
                cameFrom.set(nextKey, current);
                open.push({ col: next.col, row: next.row, f: tentativeG + heuristic(next, goal) });
            }
        }
    }

    return [];
}

