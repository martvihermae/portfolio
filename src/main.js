import './style.css';
import { Application, Container } from 'pixi.js';
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE, tileAt } from './map.js';
import { createGridView } from './gridView.js';
import { Player } from './player.js';
import { findPath } from './pathfinding.js';
import { Dialog } from './dialog.js';
import { POI_CONTENT } from './content.js';

const app = new Application();

await app.init({
    resizeTo: window,
    background: '#1e1e2e',
    antialias: true,
});

document.getElementById('app').appendChild(app.canvas);

// Everything gameplay-related lives in a fixed-resolution world container that
// gets scaled/centered to fit the screen, so the grid works the same on PC and mobile.
const world = new Container();
app.stage.addChild(world);

world.addChild(createGridView());

const player = new Player(1, 1);
world.addChild(player.view);

const dialog = new Dialog();

function fitWorldToScreen() {
    const scale = Math.min(
        (app.screen.width * 0.95) / WORLD_WIDTH,
        (app.screen.height * 0.95) / WORLD_HEIGHT
    );

    world.scale.set(scale);
    world.x = (app.screen.width - WORLD_WIDTH * scale) / 2;
    world.y = (app.screen.height - WORLD_HEIGHT * scale) / 2;
}

fitWorldToScreen();
window.addEventListener('resize', fitWorldToScreen);

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

// pointertap fires for both mouse clicks and touch taps.
app.stage.on('pointertap', (event) => {
    if (dialog.isOpen || player.isMoving()) return;

    const local = event.getLocalPosition(world);
    const col = Math.floor(local.x / TILE_SIZE);
    const row = Math.floor(local.y / TILE_SIZE);

    const path = findPath({ col: player.col, row: player.row }, { col, row });
    if (!path.length) return;

    player.walk(path, () => {
        const tile = tileAt(player.col, player.row);
        const content = POI_CONTENT[tile];
        if (content) dialog.show(content);
    });
});

app.ticker.add((ticker) => {
    player.update(ticker.deltaMS);
});
