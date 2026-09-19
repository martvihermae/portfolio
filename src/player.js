import { Container, AnimatedSprite } from 'pixi.js';
import { TILE_SIZE } from './map.js';
import { loadCharacterFrames, directionFromDelta, idleFrameFor } from './characterSheet.js';

const TILES_PER_SECOND = 3.4375; // walk speed, independent of TILE_SIZE
const MOVE_SPEED = TILE_SIZE * TILES_PER_SECOND; // pixels per second
const ANIMATION_SPEED = 0.5; // fraction of a sheet frame advanced per rendered frame

export class Player {
    // Async factory since the sprite sheet must be loaded/sliced before the sprite exists.
    static async create(startCol, startRow) {
        const frames = await loadCharacterFrames();
        return new Player(startCol, startRow, frames);
    }

    constructor(startCol, startRow, frames) {
        this.col = startCol;
        this.row = startRow;
        this.path = [];
        this.onArrive = null;
        this.frames = frames;
        this.direction = 'down';

        this.sprite = new AnimatedSprite(frames[this.direction]);
        this.sprite.animationSpeed = ANIMATION_SPEED;
        this.sprite.anchor.set(0.5, 1);
        // Sheet frames are larger than a tile; scale so the sprite's width matches one tile.
        this.sprite.scale.set(TILE_SIZE / this.sprite.texture.width);
        this.sprite.y = TILE_SIZE / 2; // feet rest on the tile's bottom edge
        this.sprite.gotoAndStop(idleFrameFor(this.direction));

        this.view = new Container();
        this.view.addChild(this.sprite);
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

    setDirection(direction) {
        if (!direction || direction === this.direction) return;
        this.direction = direction;
        this.sprite.textures = this.frames[direction];
        this.sprite.play();
    }

    update(deltaMS) {
        if (!this.path.length) {
            this.sprite.gotoAndStop(idleFrameFor(this.direction)); // plant feet on this direction's standing frame
            return;
        }

        const target = this.path[0];
        this.setDirection(directionFromDelta(target.col - this.col, target.row - this.row));
        if (!this.sprite.playing) this.sprite.play();

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

