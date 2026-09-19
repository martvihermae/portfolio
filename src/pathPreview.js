import { Graphics } from 'pixi.js';
import { TILE_SIZE } from './map.js';

// Subtle dots along the remaining walk path; shrinks as the player advances.
export class PathPreview {
    constructor() {
        this.graphics = new Graphics();
    }

    update(path) {
        this.graphics.clear();

        path.forEach(({ col, row }, index) => {
            const x = col * TILE_SIZE + TILE_SIZE / 2;
            const y = row * TILE_SIZE + TILE_SIZE / 2;
            const isDestination = index === path.length - 1;

            const radius = TILE_SIZE * (isDestination ? 0.11 : 0.06);
            this.graphics
                .circle(x, y, radius)
                .fill({ color: 0xffffff, alpha: isDestination ? 0.45 : 0.25 });
        });
    }
}
