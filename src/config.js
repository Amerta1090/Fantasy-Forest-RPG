export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const WORLD_WIDTH = 2000;
export const WORLD_HEIGHT = 2000;
export const BG_COLOR = '#1d1d28';

export const PLAYER_SPEED = 160;
export const COMPANION_SPEED = 120;
export const COMPANION_LEASH = 300;
export const COMPANION_FOLLOW_DELAY = 20;
export const CAMERA_DEADZONE = 50;

export const TREE_COUNT = 30;
export const BUILDING_COUNT = 4;
export const ROCK_COUNT = 12;

export const KEYBINDS = {
  moveUp: ['W', 'UP'],
  moveDown: ['S', 'DOWN'],
  moveLeft: ['A', 'LEFT'],
  moveRight: ['D', 'RIGHT'],
  attack: ['SPACE'],
};

export const SPRITE_FRAMES = {
  player: {
    frameWidth: 96,
    frameHeight: 80,
  },
  playerAttack: {
    frameWidth: 96,
    frameHeight: 80,
  },
  char: {
    frameWidth: 64,
    frameHeight: 80,
  },
  charDead: {
    frameWidth: 64,
    frameHeight: 64,
  },
  companionIdle: { frameWidth: 46, frameHeight: 55 },
  companionWalk: { frameWidth: 90, frameHeight: 87 },
  boarIdle: { frameWidth: 32, frameHeight: 32 },
  boarRun: { frameWidth: 32, frameHeight: 32 },
  beeFly: { frameWidth: 32, frameHeight: 64 },
  beeAttack: { frameWidth: 32, frameHeight: 64 },
  snailWalk: { frameWidth: 32, frameHeight: 32 },
  snailDead: { frameWidth: 32, frameHeight: 32 },
};
