import './style.css';
import { Application, Container } from 'pixi.js';
import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE, tileAt } from './map.js';
import { createGridView } from './gridView.js';
import { Player } from './player.js';
import { findPath } from './pathfinding.js';
import { Dialog } from './dialog.js';
import { POI_CONTENT } from './content.js';
import { PathPreview } from './pathPreview.js';

const app = new Application();

await app.init({
    resizeTo: window,
    background: '#1e1e2e',
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

document.getElementById('app').appendChild(app.canvas);

// Everything gameplay-related lives in a world container that the camera
// pans (at a fixed 1:1 tile scale) so only the area around the player is revealed.
const world = new Container();
app.stage.addChild(world);

world.addChild(createGridView());

const pathPreview = new PathPreview();
world.addChild(pathPreview.graphics);

const player = await Player.create(15, 15);
world.addChild(player.view);

const dialog = new Dialog();

// Reference viewport width at which the world renders at native tile scale (1x).
// Wider viewports (desktop) zoom in so the character reads at a similar relative
// size everywhere, instead of shrinking as the screen gets bigger.
const BASE_VIEWPORT_WIDTH = 420;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.2;

function computeZoom() {
    const raw = app.screen.width / BASE_VIEWPORT_WIDTH;
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, raw));
}

// Centers the camera on the player, clamped so the map edges never scroll past the viewport.
function updateCamera() {
    const zoom = computeZoom();
    world.scale.set(zoom);

    const screenW = app.screen.width;
    const screenH = app.screen.height;
    const worldPixelWidth = WORLD_WIDTH * zoom;
    const worldPixelHeight = WORLD_HEIGHT * zoom;

    const minX = Math.min(0, screenW - worldPixelWidth);
    const minY = Math.min(0, screenH - worldPixelHeight);
    const maxX = Math.max(0, screenW - worldPixelWidth);
    const maxY = Math.max(0, screenH - worldPixelHeight);

    const desiredX = screenW / 2 - player.view.x * zoom;
    const desiredY = screenH / 2 - player.view.y * zoom;

    world.x = Math.min(maxX, Math.max(minX, desiredX));
    world.y = Math.min(maxY, Math.max(minY, desiredY));
}

updateCamera();
window.addEventListener('resize', updateCamera);

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

// pointertap fires for both mouse clicks and touch taps.
app.stage.on('pointertap', (event) => {
    if (dialog.isOpen) return;

    const local = event.getLocalPosition(world);
    const col = Math.floor(local.x / TILE_SIZE);
    const row = Math.floor(local.y / TILE_SIZE);

    // If already moving, keep finishing the in-flight step and chain the new
    // path onto it, instead of snapping back to the last settled tile.
    const isMoving = player.isMoving();
    const start = isMoving ? player.path[0] : { col: player.col, row: player.row };

    const continuation = findPath(start, { col, row });
    if (isMoving && (start.col !== col || start.row !== row) && !continuation.length) return;

    const path = isMoving ? [start, ...continuation] : continuation;
    if (!path.length) return;

    player.walk(path, () => {
        const tile = tileAt(player.col, player.row);
        const content = POI_CONTENT[tile];
        if (content) dialog.show(content);
    });
});

app.ticker.add((ticker) => {
    player.update(ticker.deltaMS);
    pathPreview.update(player.path);
    updateCamera();
});
