import { Assets, Rectangle, Texture } from 'pixi.js';

const SHEET_URL = '/character_example.png';
const SHEET_COLUMNS = 12;
const SHEET_ROWS = 8;

// Row order in the sheet, as laid out by the artist (clockwise from down-right).
const ROW_DIRECTIONS = [
    'down-right',
    'down',
    'down-left',
    'left',
    'up-left',
    'up',
    'up-right',
    'right',
];

// Frame index (0-based) where feet are together/standing for each direction.
// Left/right use frame 0 for that pose; every other direction uses frame 3.
const IDLE_FRAME = {
    'down-right': 3,
    down: 3,
    'down-left': 3,
    left: 0,
    'up-left': 3,
    up: 3,
    'up-right': 3,
    right: 0,
};

export function idleFrameFor(direction) {
    return IDLE_FRAME[direction] ?? 0;
}

let framesPromise = null;

// Slices the sheet into { [direction]: Texture[] }, loading/caching it once.
export function loadCharacterFrames() {
    if (!framesPromise) {
        framesPromise = Assets.load(SHEET_URL).then((baseTexture) => {
            // Nearest-neighbor sampling keeps sprite edges crisp instead of smeared when scaled up.
            baseTexture.source.scaleMode = 'nearest';

            const frameWidth = baseTexture.width / SHEET_COLUMNS;
            const frameHeight = baseTexture.height / SHEET_ROWS;
            const frames = {};

            ROW_DIRECTIONS.forEach((direction, row) => {
                frames[direction] = Array.from({ length: SHEET_COLUMNS }, (_, col) =>
                    new Texture({
                        source: baseTexture.source,
                        frame: new Rectangle(col * frameWidth, row * frameHeight, frameWidth, frameHeight),
                    })
                );
            });

            return frames;
        });
    }

    return framesPromise;
}

// Maps a grid movement step (dx/dy each -1, 0, or 1) to one of the 8 sheet directions.
export function directionFromDelta(dx, dy) {
    const sx = Math.sign(dx);
    const sy = Math.sign(dy);

    if (sx === 0 && sy === 0) return null;
    if (sx === 1 && sy === 1) return 'down-right';
    if (sx === 0 && sy === 1) return 'down';
    if (sx === -1 && sy === 1) return 'down-left';
    if (sx === -1 && sy === 0) return 'left';
    if (sx === -1 && sy === -1) return 'up-left';
    if (sx === 0 && sy === -1) return 'up';
    if (sx === 1 && sy === -1) return 'up-right';
    return 'right';
}
