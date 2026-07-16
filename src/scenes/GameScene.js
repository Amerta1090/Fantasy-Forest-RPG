import Phaser from 'phaser';
import { WORLD_WIDTH, WORLD_HEIGHT, PLAYER_SPEED } from '../config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init() {
    this.playerDir = 'down';
    this.isAttacking = false;
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x2a3a2a);

    this.placeEnvironment();

    this.player = this.physics.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'player_idle_down');
    this.player.setSize(30, 20);
    this.player.setOffset(17, 60);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    this.player.anims.play('player_idle_down');

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.fpsText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#00ff00',
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);

    this.add.text(10, 30, 'WASD: Move | Space: Attack', {
      fontSize: '12px',
      color: '#aaaaaa',
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);
  }

  update(time, delta) {
    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);

    if (this.isAttacking) return;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      vx = -PLAYER_SPEED;
      this.playerDir = 'left';
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      vx = PLAYER_SPEED;
      this.playerDir = 'right';
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      vy = -PLAYER_SPEED;
      this.playerDir = 'up';
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      vy = PLAYER_SPEED;
      this.playerDir = 'down';
    }

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.player.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      if (this.player.anims.currentAnim?.key !== `player_run_${this.playerDir}`) {
        this.player.anims.play(`player_run_${this.playerDir}`, true);
      }
    } else {
      if (this.player.anims.currentAnim?.key !== `player_idle_${this.playerDir}`) {
        this.player.anims.play(`player_idle_${this.playerDir}`, true);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.doAttack();
    }
  }

  doAttack() {
    this.isAttacking = true;
    this.player.setVelocity(0, 0);
    this.player.anims.play(`player_atk1_${this.playerDir}`);
    this.player.once('animationcomplete', () => {
      this.isAttacking = false;
    });
  }

  placeEnvironment() {
    const trees = ['tree_green', 'tree_dark', 'tree_red', 'tree_yellow', 'tree_golden'];
    const rng = new Phaser.Math.RandomDataGenerator(['forest']);

    for (let i = 0; i < 20; i++) {
      const tx = rng.integerInRange(100, WORLD_WIDTH - 100);
      const ty = rng.integerInRange(100, WORLD_HEIGHT - 100);
      const treeKey = rng.pick(trees);
      const tree = this.physics.add.staticImage(tx, ty, treeKey);
      tree.setScale(0.15);
      tree.refreshBody();
      tree.setDepth(ty);
    }
  }
}
