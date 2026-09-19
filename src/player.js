import { Graphics } from 'pixi.js';
import { TILE_SIZE } from './map.js';

const MOVE_SPEED = 220; // pixels per second

export class Player {
    constructor(startCol, startRow) {
        this.col = startCol;
        this.row = startRow;
        this.path = [];
        this.onArrive = null;

        this.view = new Graphics()
            .circle(0, 0, TILE_SIZE * 0.3)
            .fill(0xffffff);

        this.view.x = this.tileCenterX(startCol);
        this.view.y = this.tileCenterY(startRow);
    }

    tileCenterX(col) {
        return col * TILE_SIZE + TILE_SIZE / 2;
    }

    tileCenterY(row) {
        return row * TILE_SIZE + TILE_SIZE / 2;
    }

    // Queue a sequence of {col, row} steps to walk through, then invoke onArrive.
    walk(path, onArrive) {
        this.path = path;
        this.onArrive = onArrive;
    }

    isMoving() {
        return this.path.length > 0;
    }

    update(deltaMS) {
        if (!this.path.length) return;

        const target = this.path[0];
        const targetX = this.tileCenterX(target.col);
        const targetY = this.tileCenterY(target.row);

        const dx = targetX - this.view.x;
        const dy = targetY - this.view.y;
        const distance = Math.hypot(dx, dy);
        const step = (MOVE_SPEED * deltaMS) / 1000;

        if (distance <= step) {
            this.view.x = targetX;
            this.view.y = targetY;
            this.col = target.col;
            this.row = target.row;
            this.path.shift();

            if (!this.path.length && this.onArrive) {
                const callback = this.onArrive;
                this.onArrive = null;
                callback();
            }
        } else {
            this.view.x += (dx / distance) * step;
            this.view.y += (dy / distance) * step;
        }
    }
}
