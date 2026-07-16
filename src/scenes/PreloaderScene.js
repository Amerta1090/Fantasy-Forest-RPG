import Phaser from 'phaser';
import { SPRITE_FRAMES } from '../config.js';

const BASE = '';

function asset(path) {
  return `${BASE}${path}`;
}

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    const barW = 320;
    const barH = 20;
    const barX = (w - barW) / 2;
    const barY = h / 2 + 30;

    const bg = this.add.rectangle(w / 2, h / 2, barW + 4, barH + 4, 0x333344);
    const bar = this.add.rectangle(barX + 2, barY + 2, 0, barH, 0x5588ff);
    bar.setOrigin(0, 0);

    const loadingText = this.add.text(w / 2, h / 2 - 20, 'Loading...', {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      bar.width = barW * value;
    });

    this.load.on('complete', () => {
      bg.destroy();
      bar.destroy();
      loadingText.destroy();
    });

    // ── Player spritesheets (4 directions × idle/run/atk1/atk2) ──
    const dir = ['down', 'left', 'right', 'up'];
    const playerFrames = SPRITE_FRAMES.player;

    dir.forEach((d) => {
      this.load.spritesheet(
        `player_idle_${d}`,
        asset(`FREE_Adventurer 2D Pixel Art/Sprites/IDLE/idle_${d}.png`),
        playerFrames,
      );
      this.load.spritesheet(
        `player_run_${d}`,
        asset(`FREE_Adventurer 2D Pixel Art/Sprites/RUN/run_${d}.png`),
        playerFrames,
      );
      this.load.spritesheet(
        `player_atk1_${d}`,
        asset(`FREE_Adventurer 2D Pixel Art/Sprites/ATTACK 1/attack1_${d}.png`),
        SPRITE_FRAMES.playerAttack,
      );
      this.load.spritesheet(
        `player_atk2_${d}`,
        asset(`FREE_Adventurer 2D Pixel Art/Sprites/ATTACK 2/attack2_${d}.png`),
        SPRITE_FRAMES.playerAttack,
      );
    });

    // ── Legacy-Fantasy Character (NPC / fallback) ──
    this.load.spritesheet(
      'char_idle',
      asset('Legacy-Fantasy - High Forest 2.3/Character/Idle/Idle-Sheet.png'),
      SPRITE_FRAMES.char,
    );
    this.load.spritesheet(
      'char_run',
      asset('Legacy-Fantasy - High Forest 2.3/Character/Run/Run-Sheet.png'),
      SPRITE_FRAMES.char,
    );
    this.load.spritesheet(
      'char_dead',
      asset('Legacy-Fantasy - High Forest 2.3/Character/Dead/Dead-Sheet.png'),
      SPRITE_FRAMES.charDead,
    );
    this.load.spritesheet(
      'char_atk01',
      asset('Legacy-Fantasy - High Forest 2.3/Character/Attack-01/Attack-01-Sheet.png'),
      SPRITE_FRAMES.char,
    );

    // ── Boar mob ──
    this.load.spritesheet(
      'boar_idle',
      asset('Legacy-Fantasy - High Forest 2.3/Mob/Boar/Idle/Idle-Sheet.png'),
      SPRITE_FRAMES.boarIdle,
    );
    this.load.spritesheet(
      'boar_run',
      asset('Legacy-Fantasy - High Forest 2.3/Mob/Boar/Run/Run-Sheet.png'),
      SPRITE_FRAMES.boarRun,
    );

    // ── Small Bee mob ──
    this.load.spritesheet(
      'bee_fly',
      asset('Legacy-Fantasy - High Forest 2.3/Mob/Small Bee/Fly/Fly-Sheet.png'),
      SPRITE_FRAMES.beeFly,
    );
    this.load.spritesheet(
      'bee_attack',
      asset('Legacy-Fantasy - High Forest 2.3/Mob/Small Bee/Attack/Attack-Sheet.png'),
      SPRITE_FRAMES.beeAttack,
    );

    // ── Snail mob ──
    this.load.spritesheet(
      'snail_walk',
      asset('Legacy-Fantasy - High Forest 2.3/Mob/Snail/walk-Sheet.png'),
      SPRITE_FRAMES.snailWalk,
    );
    this.load.spritesheet(
      'snail_dead',
      asset('Legacy-Fantasy - High Forest 2.3/Mob/Snail/Dead-Sheet.png'),
      SPRITE_FRAMES.snailDead,
    );

    // ── Companion sprites ──
    this.load.spritesheet(
      'companion_idle',
      asset('sample(idle&walk)/idle/sprite sheets/idle.png'),
      SPRITE_FRAMES.companionIdle,
    );
    this.load.image(
      'companion_walk',
      asset('sample(idle&walk)/walk/sprite sheets/from idle.png'),
    );

    // ── Trees, HUD ──
    this.load.image('hud_base', asset('Legacy-Fantasy - High Forest 2.3/HUD/Base-01.png'));
    this.load.image('tree_green', asset('Legacy-Fantasy - High Forest 2.3/Trees/Green-Tree.png'));
    this.load.image('tree_dark', asset('Legacy-Fantasy - High Forest 2.3/Trees/Dark-Tree.png'));
    this.load.image('tree_red', asset('Legacy-Fantasy - High Forest 2.3/Trees/Red-Tree.png'));
    this.load.image('tree_yellow', asset('Legacy-Fantasy - High Forest 2.3/Trees/Yellow-Tree.png'));
    this.load.image('tree_golden', asset('Legacy-Fantasy - High Forest 2.3/Trees/Golden-Tree.png'));
  }

  create() {
    this.createAnimations();
    this.scene.start('mainMenu');
  }

  createAnimations() {
    const dirs = ['down', 'left', 'right', 'up'];

    dirs.forEach((d) => {
      this.anims.create({
        key: `player_idle_${d}`,
        frames: this.anims.generateFrameNumbers(`player_idle_${d}`, { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.create({
        key: `player_run_${d}`,
        frames: this.anims.generateFrameNumbers(`player_run_${d}`, { start: 0, end: 7 }),
        frameRate: 12,
        repeat: -1,
      });

      this.anims.create({
        key: `player_atk1_${d}`,
        frames: this.anims.generateFrameNumbers(`player_atk1_${d}`, { start: 0, end: 7 }),
        frameRate: 16,
        repeat: 0,
      });

      this.anims.create({
        key: `player_atk2_${d}`,
        frames: this.anims.generateFrameNumbers(`player_atk2_${d}`, { start: 0, end: 7 }),
        frameRate: 16,
        repeat: 0,
      });
    });

    this.anims.create({
      key: 'char_idle',
      frames: this.anims.generateFrameNumbers('char_idle', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'char_run',
      frames: this.anims.generateFrameNumbers('char_run', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'boar_idle',
      frames: this.anims.generateFrameNumbers('boar_idle', { start: 0, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'boar_run',
      frames: this.anims.generateFrameNumbers('boar_run', { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'bee_fly',
      frames: this.anims.generateFrameNumbers('bee_fly', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'bee_attack',
      frames: this.anims.generateFrameNumbers('bee_attack', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'snail_walk',
      frames: this.anims.generateFrameNumbers('snail_walk', { start: 0, end: 11 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'snail_dead',
      frames: this.anims.generateFrameNumbers('snail_dead', { start: 0, end: 8 }),
      frameRate: 8,
      repeat: 0,
    });

    this.anims.create({
      key: 'companion_idle',
      frames: this.anims.generateFrameNumbers('companion_idle', { start: 0, end: 9 }),
      frameRate: 8,
      repeat: -1,
    });
  }
}
