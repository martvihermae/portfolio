# Interactive Portfolio (WIP)

An interactive game-style portfolio built with:

- JavaScript
- PixiJS
- Vite
- HTML/CSS

## Live Demo

https://...

## About

My personal portfolio presented as a small 2D game.
Navigate the world to explore my projects, experience,
skills and other information.

## Controls

Click/Tap a tile to walk there. The character pathfinds around obstacles
automatically. Walking onto a colored tile (CV, Skills, Portfolio, ...)
opens a dialog with that content. Works the same on desktop and mobile.

## Project structure

- `src/map.js` - grid size, tile legend (ASCII map) and POI metadata
- `src/pathfinding.js` - BFS pathfinding on the grid
- `src/gridView.js` - renders the static tile map
- `src/player.js` - player token + tile-by-tile walk animation
- `src/dialog.js` - HTML overlay used for POI content
- `src/content.js` - text/HTML shown per POI (edit this to update your CV/skills/portfolio copy)
- `src/main.js` - wires everything together, handles taps/clicks and responsive scaling

To edit the map layout, change the ASCII grid in `MAP_LAYOUT` (`src/map.js`):
`.` is floor, `#` is a wall, and any other letter is a POI tied to an entry
in `POIS` (same file) and `POI_CONTENT` (`src/content.js`).

## Development

npm install
npm run dev

## Build

npm run build