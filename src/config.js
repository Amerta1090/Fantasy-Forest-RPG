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
export const ROCK_COUNT = 12;

export const KEYBINDS = {
  moveUp: ['W', 'UP'],
  moveDown: ['S', 'DOWN'],
  moveLeft: ['A', 'LEFT'],
  moveRight: ['D', 'RIGHT'],
  attack: ['SPACE'],
};

export const PLAYER_MAX_HP = 100;
export const PLAYER_ATTACK = 15;
export const PLAYER_DEFENSE = 5;
export const IFRAME_DURATION = 500;
export const KNOCKBACK_FORCE = 200;
export const ATTACK_RANGE = 45;
export const ATTACK_ARC = Math.PI / 2;

export const ENEMY_TYPES = {
  boar: {
    hp: 40,
    attack: 10,
    defense: 3,
    speed: 80,
    aggroRange: 200,
    attackRange: 30,
    xpReward: 15,
    goldDrop: [1, 3],
  },
  bee: {
    hp: 20,
    attack: 8,
    defense: 1,
    speed: 100,
    aggroRange: 250,
    attackRange: 150,
    projectileSpeed: 200,
    xpReward: 12,
    goldDrop: [1, 2],
  },
  snail: {
    hp: 60,
    attack: 12,
    defense: 6,
    speed: 40,
    aggroRange: 150,
    attackRange: 35,
    hideDuration: 2000,
    xpReward: 20,
    goldDrop: [2, 5],
  },
};

export const LOOT_ICONS = [
  'fc52', 'fc67', 'fc131', 'fc133', 'fc136', 'fc169', 'fc171', 'fc189',
  'fc220', 'fc237', 'fc245', 'fc246', 'fc277', 'fc285', 'fc305', 'fc306',
  'fc321', 'fc340', 'fc370', 'fc446', 'fc452', 'fc462', 'fc463', 'fc466',
  'fc470', 'fc476', 'fc477', 'fc506', 'fc526', 'fc527', 'fc551', 'fc567',
];

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
  boarIdle: { frameWidth: 32, frameHeight: 32 },
  boarRun: { frameWidth: 32, frameHeight: 32 },
  beeFly: { frameWidth: 32, frameHeight: 64 },
  beeAttack: { frameWidth: 32, frameHeight: 64 },
  snailWalk: { frameWidth: 32, frameHeight: 32 },
  snailDead: { frameWidth: 32, frameHeight: 32 },
};
