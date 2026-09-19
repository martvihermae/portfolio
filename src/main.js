import './style.css'
import { Application, Graphics } from 'pixi.js';

const app = new Application();

await app.init({
    resizeTo: window,
    background: '#1e1e2e'
});

document.body.appendChild(app.canvas);

const player = new Graphics();

player.rect(0, 0, 40, 40);
player.fill('#ffffff');

player.x = 100;
player.y = 100;

app.stage.addChild(player);

const keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

app.ticker.add(() => {
    const speed = 3;

    if (keys['w']) {
        player.y -= speed;
    }

    if (keys['s']) {
        player.y += speed;
    }

    if (keys['a']) {
        player.x -= speed;
    }

    if (keys['d']) {
        player.x += speed;
    }
});