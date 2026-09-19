// Tile legend: '.' floor, '#' wall, other chars are POI ids (see POIS below)
export const TILE_SIZE = 64;

export const MAP_LAYOUT = [
    '####################',
    '#................###',
    '#....C............##',
    '#....#.............#',
    '#.................##',
    '#..#####..........##',
    '..................##',
    '#......#...........#',
    '#S.....#........P###',
    '####################',
];

export const ROWS = MAP_LAYOUT.length;
export const COLS = MAP_LAYOUT[0].length;

export const WORLD_WIDTH = COLS * TILE_SIZE;
export const WORLD_HEIGHT = ROWS * TILE_SIZE;

// Metadata for each point-of-interest tile letter used in MAP_LAYOUT
export const POIS = {
    C: { title: 'CV / Resume', color: 0x4a90e2 },
    S: { title: 'Skills', color: 0x50c878 },
    P: { title: 'Portfolio', color: 0xe2a04a },
};

export function tileAt(col, row) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return '#';
    return MAP_LAYOUT[row][col];
}

export function isWalkable(col, row) {
    return tileAt(col, row) !== '#';
}

export function poiAt(col, row) {
    const tile = tileAt(col, row);
    return POIS[tile] ?? null;
}
