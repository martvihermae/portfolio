import { Container, Graphics, Text } from 'pixi.js';
import { COLS, ROWS, TILE_SIZE, tileAt, poiAt } from './map.js';

const FLOOR_COLOR = 0x2a2a3d;
const FLOOR_LINE_COLOR = 0x3a3a52;
const WALL_COLOR = 0x111119;

// Builds the static tile map (floor, walls, POIs) as a single container.
export function createGridView() {
    const view = new Container();

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const tile = tileAt(col, row);
            const poi = poiAt(col, row);
            const g = new Graphics();
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (tile === '#') {
                g.rect(0, 0, TILE_SIZE, TILE_SIZE).fill(WALL_COLOR);
            } else {
                g.rect(0, 0, TILE_SIZE, TILE_SIZE)
                    .fill(poi ? poi.color : FLOOR_COLOR)
                    .stroke({ width: 1, color: FLOOR_LINE_COLOR });
            }

            g.x = x;
            g.y = y;
            view.addChild(g);

            if (poi) {
                const label = new Text({
                    text: poi.title,
                    style: {
                        fontFamily: 'sans-serif',
                        fontSize: 12,
                        fill: 0xffffff,
                        wordWrap: true,
                        wordWrapWidth: TILE_SIZE - 6,
                        align: 'center',
                    },
                });
                label.anchor.set(0.5);
                label.x = x + TILE_SIZE / 2;
                label.y = y + TILE_SIZE / 2;
                view.addChild(label);
            }
        }
    }

    return view;
}
