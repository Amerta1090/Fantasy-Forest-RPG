import Phaser from 'phaser';
import {
  GAME_WIDTH, GAME_HEIGHT, WORLD_WIDTH, WORLD_HEIGHT, PLAYER_SPEED,
  COMPANION_SPEED, COMPANION_LEASH, COMPANION_FOLLOW_DELAY,
  CAMERA_DEADZONE, TREE_COUNT, ROCK_COUNT,
  PLAYER_MAX_HP, PLAYER_ATTACK, PLAYER_DEFENSE,
  ATTACK_RANGE, ATTACK_ARC,
} from '../config.js';
import { Boar } from '../combat/Boar.js';
import { Bee } from '../combat/Bee.js';
import { Snail } from '../combat/Snail.js';
import { calcDamage, grantIframes } from '../combat/DamageSystem.js';
import { HitFeedback } from '../combat/HitFeedback.js';
import { LootDrop } from '../combat/LootDrop.js';

const GROUND_COLOR = 0x2a3a2a;
const GROUND_DARK = 0x232f23;
const ROCK_COLOR = 0x5a5a5a;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init() {
    this.playerDir = 'down';
    this.isAttacking = false;
    this.gamepad = null;
    this.positionBuffer = [];
    this.enemies = [];
    this.playerHp = PLAYER_MAX_HP;
    this.playerMaxHp = PLAYER_MAX_HP;
    this.playerAtk = PLAYER_ATTACK;
    this.playerDef = PLAYER_DEFENSE;
    this.gold = 0;
    this.attackHitActive = false;
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.createGround();
    this.obstacles = this.physics.add.staticGroup();
    this.placeTrees();
    this.placeRocks();

    this.createPlayer();
    this.createFacingIndicator();
    this.createCompanion();
    this.createPlayerHpBar();
    this.createGoldDisplay();

    this.feedback = new HitFeedback(this);
    this.lootDrop = new LootDrop(this);

    this.spawnEnemies();
    this.setupEnemyCollisions();

    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.companion, this.obstacles);

    this.events.on('enemy-killed', (enemy) => this.onEnemyKilled(enemy));
    this.events.on('gold-pickup', (amount) => this.onGoldPickup(amount));

    this.setupCamera();
    this.setupInput();
    this.createHUD();
  }

  createGround() {
    this.add.rectangle(
      WORLD_WIDTH / 2, WORLD_HEIGHT / 2,
      WORLD_WIDTH, WORLD_HEIGHT,
      GROUND_COLOR,
    );

    const rng = new Phaser.Math.RandomDataGenerator(['ground_detail']);
    for (let i = 0; i < 60; i++) {
      const gx = rng.integerInRange(0, WORLD_WIDTH);
      const gy = rng.integerInRange(0, WORLD_HEIGHT);
      const size = rng.integerInRange(20, 60);
      this.add.rectangle(gx, gy, size, size, GROUND_DARK, 0.3).setDepth(0);
    }
  }

  createPlayer() {
    this.player = this.physics.add.sprite(
      WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'player_idle_down',
    );
    this.player.setSize(30, 20);
    this.player.setOffset(17, 60);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    this.player.anims.play('player_idle_down');
  }

  createFacingIndicator() {
    this.facingArrow = this.add.triangle(
      0, 0,
      0, -8, -5, 2, 5, 2,
      0x5588ff,
    );
    this.facingArrow.setAlpha(0.8);
    this.facingArrow.setDepth(11);
  }

  createCompanion() {
    this.companion = this.physics.add.sprite(
      WORLD_WIDTH / 2 + 80, WORLD_HEIGHT / 2,
      'companion_idle',
    );
    this.companion.setScale(0.4);
    this.companion.setSize(20, 20);
    this.companion.setOffset(13, 28);
    this.companion.setDepth(9);
    this.companion.anims.play('companion_idle');
    this.companionMoving = false;
  }

  createPlayerHpBar() {
    const barW = 60;
    const barH = 6;
    this.hpBg = this.add.rectangle(0, 0, barW + 2, barH + 2, 0x000000)
      .setScrollFactor(0).setDepth(100).setPosition(200, 16);
    this.hpFill = this.add.rectangle(0, 0, barW, barH, 0xff3333)
      .setScrollFactor(0).setDepth(101).setOrigin(0, 0.5).setPosition(199, 16);
    this.hpBarW = barW;
    this.hpLabel = this.add.text(200, 6, 'HP', {
      fontSize: '10px', color: '#ff6666', fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(101).setOrigin(0.5, 1);
  }

  createGoldDisplay() {
    this.goldText = this.add.text(GAME_WIDTH - 10, 10, 'Gold: 0', {
      fontSize: '14px', color: '#ffdd00', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 2,
    }).setScrollFactor(0).setDepth(101).setOrigin(1, 0);
  }

  updatePlayerHpBar() {
    const ratio = Math.max(0, this.playerHp / this.playerMaxHp);
    this.hpFill.width = this.hpBarW * ratio;
    if (ratio > 0.6) this.hpFill.setFillStyle(0x33cc33);
    else if (ratio > 0.3) this.hpFill.setFillStyle(0xffcc00);
    else this.hpFill.setFillStyle(0xff3333);
  }

  spawnEnemies() {
    const rng = new Phaser.Math.RandomDataGenerator(['enemies_sprint2']);
    const safeZone = 250;

    for (let i = 0; i < 5; i++) {
      const pos = this.getSpawnPos(rng, safeZone);
      const boar = new Boar(this, pos.x, pos.y);
      this.enemies.push(boar);
      this.physics.add.collider(boar.sprite, this.obstacles);
      this.physics.add.overlap(this.player, boar.sprite, () => {
        this.onEnemyTouchPlayer(boar);
      });
    }

    for (let i = 0; i < 4; i++) {
      const pos = this.getSpawnPos(rng, safeZone);
      const bee = new Bee(this, pos.x, pos.y);
      this.enemies.push(bee);
      this.physics.add.overlap(this.player, bee.sprite, () => {
        this.onEnemyTouchPlayer(bee);
      });
      this.physics.add.overlap(this.player, bee.projectiles, (player, sting) => {
        this.onProjectileHitPlayer(sting, bee);
      });
    }

    for (let i = 0; i < 3; i++) {
      const pos = this.getSpawnPos(rng, safeZone);
      const snail = new Snail(this, pos.x, pos.y);
      this.enemies.push(snail);
      this.physics.add.collider(snail.sprite, this.obstacles);
      this.physics.add.overlap(this.player, snail.sprite, () => {
        this.onEnemyTouchPlayer(snail);
      });
    }
  }

  getSpawnPos(rng, safeZone) {
    let x, y;
    let attempts = 0;
    do {
      x = rng.integerInRange(100, WORLD_WIDTH - 100);
      y = rng.integerInRange(100, WORLD_HEIGHT - 100);
      attempts++;
    } while (
      Phaser.Math.Distance.Between(x, y, WORLD_WIDTH / 2, WORLD_HEIGHT / 2) < safeZone
      && attempts < 50
    );
    return { x, y };
  }

  setupEnemyCollisions() {
    this.enemies.forEach((enemy) => {
      this.enemies.forEach((other) => {
        if (enemy === other) return;
        this.physics.add.collider(enemy.sprite, other.sprite);
      });
    });
  }

  onEnemyTouchPlayer(enemy) {
    if (this.player.getData('iframes') || this.isAttacking) return;
    if (enemy.isDead) return;

    const dmg = calcDamage(enemy.config.attack, this.playerDef);
    this.playerHp -= dmg;
    this.updatePlayerHpBar();

    grantIframes(this.player, 500);
    this.feedback.flashSprite(this.player);

    const angle = Phaser.Math.Angle.Between(
      enemy.sprite.x, enemy.sprite.y, this.player.x, this.player.y,
    );
    this.player.setVelocity(
      Math.cos(angle) * 200,
      Math.sin(angle) * 200,
    );

    this.showDamageNumber(this.player.x, this.player.y - 20, dmg, 0xff3333);

    if (this.playerHp <= 0) {
      this.playerHp = 0;
      this.onPlayerDeath();
    }
  }

  onProjectileHitPlayer(sting, bee) {
    if (!sting.active || this.player.getData('iframes')) return;

    sting.disableBody(true, true);

    const dmg = calcDamage(bee.config.attack, this.playerDef);
    this.playerHp -= dmg;
    this.updatePlayerHpBar();

    grantIframes(this.player, 500);
    this.feedback.flashSprite(this.player);
    this.showDamageNumber(this.player.x, this.player.y - 20, dmg, 0xff6600);

    if (this.playerHp <= 0) {
      this.playerHp = 0;
      this.onPlayerDeath();
    }
  }

  onPlayerDeath() {
    this.player.setVelocity(0, 0);
    this.player.setTint(0x888888);
    this.player.body.enable = false;

    this.cameras.main.shake(300, 0.015);

    this.time.delayedCall(1500, () => {
      this.scene.restart();
    });

    const deathText = this.add.text(
      this.cameras.main.scrollX + GAME_WIDTH / 2,
      this.cameras.main.scrollY + GAME_HEIGHT / 2,
      'YOU DIED',
      {
        fontSize: '48px',
        color: '#ff3333',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      },
    ).setOrigin(0.5).setDepth(1000);

    this.tweens.add({
      targets: deathText,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  setupCamera() {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(CAMERA_DEADZONE, CAMERA_DEADZONE);
    this.cameras.main.setZoom(1);
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    if (this.input.gamepad) {
      this.input.gamepad.once('connected', (pad) => {
        this.gamepad = pad;
      });
    }
  }

  createHUD() {
    this.fpsText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#00ff00',
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);

    this.controlsText = this.add.text(10, 30, 'WASD: Move | Space: Attack | Gamepad supported', {
      fontSize: '12px',
      color: '#aaaaaa',
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);

    this.padText = this.add.text(10, 48, '', {
      fontSize: '12px',
      color: '#55ff55',
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);
  }

  update(time, delta) {
    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);

    if (this.gamepad && !this._padLogged) {
      this.padText.setText(`Gamepad: ${this.gamepad.id}`);
      this._padLogged = true;
    }

    this.handleMovement();
    this.updateFacingIndicator();
    this.updateCompanion(delta);
    this.updateEnemies(time, delta);
  }

  handleMovement() {
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

    if (this.gamepad) {
      const lx = this.gamepad.leftStick.x;
      const ly = this.gamepad.leftStick.y;
      const deadzone = 0.2;

      if (Math.abs(lx) > deadzone || Math.abs(ly) > deadzone) {
        if (Math.abs(lx) > Math.abs(ly)) {
          vx = lx * PLAYER_SPEED;
          this.playerDir = lx < 0 ? 'left' : 'right';
        } else {
          vy = ly * PLAYER_SPEED;
          this.playerDir = ly < 0 ? 'up' : 'down';
        }
      }

      if (this.gamepad.A && this.gamepad.A.justPressed()) {
        this.doAttack();
      }
    }

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.player.setVelocity(vx, vy);

    const moving = vx !== 0 || vy !== 0;
    const animKey = moving
      ? `player_run_${this.playerDir}`
      : `player_idle_${this.playerDir}`;

    if (this.player.anims.currentAnim?.key !== animKey) {
      this.player.anims.play(animKey, true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.doAttack();
    }
  }

  updateFacingIndicator() {
    const offsets = {
      down: { x: 0, y: 16, angle: Math.PI },
      up: { x: 0, y: -16, angle: 0 },
      left: { x: -14, y: 0, angle: Math.PI / 2 },
      right: { x: 14, y: 0, angle: -Math.PI / 2 },
    };
    const off = offsets[this.playerDir];
    this.facingArrow.setPosition(this.player.x + off.x, this.player.y + off.y);
    this.facingArrow.setRotation(off.angle);
    this.facingArrow.setVisible(!this.isAttacking);
  }

  updateCompanion(delta) {
    this.positionBuffer.push({ x: this.player.x, y: this.player.y });
    if (this.positionBuffer.length > COMPANION_FOLLOW_DELAY) {
      this.positionBuffer.shift();
    }

    const target = this.positionBuffer[0];
    const distToPlayer = Phaser.Math.Distance.Between(
      this.companion.x, this.companion.y, this.player.x, this.player.y,
    );

    if (distToPlayer > COMPANION_LEASH) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      this.companion.setPosition(
        this.player.x + Math.cos(angle) * 30,
        this.player.y + Math.sin(angle) * 30,
      );
      this.companion.setVelocity(0, 0);
      this.companion.setTexture('companion_idle');
      this.companion.anims.play('companion_idle');
      this.positionBuffer = [{ x: this.player.x, y: this.player.y }];
      return;
    }

    const dist = Phaser.Math.Distance.Between(
      this.companion.x, this.companion.y, target.x, target.y,
    );

    if (dist > 5) {
      const angle = Phaser.Math.Angle.Between(
        this.companion.x, this.companion.y, target.x, target.y,
      );
      this.companion.setVelocity(
        Math.cos(angle) * COMPANION_SPEED,
        Math.sin(angle) * COMPANION_SPEED,
      );
      if (!this.companionMoving) {
        this.companion.setTexture('companion_walk');
        this.companionMoving = true;
      }
    } else {
      this.companion.setVelocity(0, 0);
      if (this.companionMoving) {
        this.companion.setTexture('companion_idle');
        this.companion.anims.play('companion_idle');
        this.companionMoving = false;
      }
    }

    this.companion.setDepth(this.companion.y);
  }

  updateEnemies(time, delta) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.isDead) {
        if (!enemy.sprite.active) {
          this.enemies.splice(i, 1);
        }
        continue;
      }
      enemy.update(time, delta, this.player);
      enemy.sprite.setDepth(enemy.sprite.y);
    }
  }

  doAttack() {
    if (this.isAttacking) return;
    this.isAttacking = true;
    this.player.setVelocity(0, 0);
    this.player.anims.play(`player_atk1_${this.playerDir}`);

    const attackX = this.player.x + this.getAttackOffsetX();
    const attackY = this.player.y + this.getAttackOffsetY();

    this.time.delayedCall(150, () => {
      this.checkAttackHits(attackX, attackY);
    });

    this.player.once('animationcomplete', () => {
      this.isAttacking = false;
    });
  }

  getAttackOffsetX() {
    if (this.playerDir === 'left') return -ATTACK_RANGE;
    if (this.playerDir === 'right') return ATTACK_RANGE;
    return 0;
  }

  getAttackOffsetY() {
    if (this.playerDir === 'up') return -ATTACK_RANGE;
    if (this.playerDir === 'down') return ATTACK_RANGE;
    return 0;
  }

  checkAttackHits(hitX, hitY) {
    let hitSomething = false;

    this.enemies.forEach((enemy) => {
      if (enemy.isDead || enemy.isHit) return;
      if (!enemy.sprite.active) return;

      if (enemy.isHiding) return;

      const dist = Phaser.Math.Distance.Between(hitX, hitY, enemy.sprite.x, enemy.sprite.y);
      if (dist < ATTACK_RANGE) {
        const angleToEnemy = Phaser.Math.Angle.Between(
          this.player.x, this.player.y, enemy.sprite.x, enemy.sprite.y,
        );
        let dirAngle;
        switch (this.playerDir) {
          case 'right': dirAngle = 0; break;
          case 'down': dirAngle = Math.PI / 2; break;
          case 'left': dirAngle = Math.PI; break;
          case 'up': dirAngle = -Math.PI / 2; break;
        }
        let angleDiff = Math.abs(angleToEnemy - dirAngle);
        if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

        if (angleDiff <= ATTACK_ARC) {
          const dmg = calcDamage(this.playerAtk, enemy.config.defense);
          const finalDmg = enemy.takeDamage(dmg, this.player.x, this.player.y);
          hitSomething = true;

          this.feedback.onHit(enemy.sprite.x, enemy.sprite.y);
          this.showDamageNumber(enemy.sprite.x, enemy.sprite.y - 20, finalDmg, 0xffff00);

          if (enemy.hp <= 0) {
            this.feedback.spawnDeathParticles(enemy.sprite.x, enemy.sprite.y);
            this.feedback.hitStop();
          }
        }
      }
    });

    if (hitSomething) {
      this.feedback.hitStop();
    }
  }

  showDamageNumber(x, y, amount, color) {
    const text = this.add.text(x, y, `-${amount}`, {
      fontSize: '16px',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(1000);

    this.tweens.add({
      targets: text,
      y: y - 25,
      alpha: 0,
      duration: 700,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });
  }

  onEnemyKilled(enemy) {
    const goldRange = enemy.config.goldDrop;
    this.lootDrop.drop(enemy.sprite.x, enemy.sprite.y, goldRange);
  }

  onGoldPickup(amount) {
    this.gold += amount;
    this.goldText.setText(`Gold: ${this.gold}`);
  }

  isOccupied(x, y, minDist, placed) {
    for (const p of placed) {
      if (Phaser.Math.Distance.Between(x, y, p.x, p.y) < minDist) return true;
    }
    return false;
  }

  placeTrees() {
    const treeKeys = ['tree_green', 'tree_dark', 'tree_red', 'tree_yellow', 'tree_golden'];
    const rng = new Phaser.Math.RandomDataGenerator(['forest_sprint1']);
    const safeZone = 200;
    const minSeparation = 100;
    const placed = [];
    let attempts = 0;

    for (let i = 0; i < TREE_COUNT && attempts < 500; i++) {
      let tx, ty;
      let valid = false;

      while (!valid && attempts < 500) {
        tx = rng.integerInRange(80, WORLD_WIDTH - 80);
        ty = rng.integerInRange(80, WORLD_HEIGHT - 80);
        attempts++;

        const inSafeZone = Phaser.Math.Distance.Between(
          tx, ty, WORLD_WIDTH / 2, WORLD_HEIGHT / 2,
        ) < safeZone;

        if (!inSafeZone && !this.isOccupied(tx, ty, minSeparation, placed)) {
          valid = true;
        }
      }

      if (!valid) continue;

      const key = rng.pick(treeKeys);
      const tree = this.physics.add.staticImage(tx, ty, key);
      tree.setScale(0.12);
      tree.setSize(50, 30);
      tree.setOffset(tree.width * 0.5 - 25, tree.height * 0.85);
      tree.refreshBody();
      tree.setDepth(ty);
      placed.push({ x: tx, y: ty });
    }
  }

  placeRocks() {
    const rng = new Phaser.Math.RandomDataGenerator(['rocks_sprint1']);
    const safeZone = 150;
    const minSeparation = 80;
    const placed = [];
    let attempts = 0;

    const gfx = this.add.graphics();
    gfx.fillStyle(ROCK_COLOR, 1);
    gfx.fillEllipse(16, 12, 32, 24);
    gfx.fillStyle(0x6a6a6a, 0.5);
    gfx.fillEllipse(14, 10, 18, 12);
    gfx.generateTexture('rock_tex', 32, 24);
    gfx.destroy();

    for (let i = 0; i < ROCK_COUNT && attempts < 300; i++) {
      let rx, ry;
      let valid = false;

      while (!valid && attempts < 300) {
        rx = rng.integerInRange(60, WORLD_WIDTH - 60);
        ry = rng.integerInRange(60, WORLD_HEIGHT - 60);
        attempts++;

        const inSafeZone = Phaser.Math.Distance.Between(
          rx, ry, WORLD_WIDTH / 2, WORLD_HEIGHT / 2,
        ) < safeZone;

        if (!inSafeZone && !this.isOccupied(rx, ry, minSeparation, placed)) {
          valid = true;
        }
      }

      if (!valid) continue;

      const scale = Phaser.Math.FloatBetween(0.6, 1.2);
      const rock = this.physics.add.staticImage(rx, ry, 'rock_tex');
      rock.setScale(scale);
      rock.setSize(24, 16);
      rock.setOffset(4, 8);
      rock.refreshBody();
      rock.setDepth(ry);
      placed.push({ x: rx, y: ry });
    }
  }
}
