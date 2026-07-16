import Phaser from 'phaser';
import {
  WORLD_WIDTH, WORLD_HEIGHT, PLAYER_SPEED,
  COMPANION_SPEED, COMPANION_LEASH, COMPANION_FOLLOW_DELAY,
  CAMERA_DEADZONE, TREE_COUNT, BUILDING_COUNT, ROCK_COUNT,
} from '../config.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init() {
    this.playerDir = 'down';
    this.isAttacking = false;
    this.gamepad = null;
    this.positionBuffer = [];
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.createGround();
    this.obstacles = this.physics.add.staticGroup();
    this.placeTrees();
    this.placeBuildings();
    this.placeRocks();

    this.createPlayer();
    this.createFacingIndicator();
    this.createCompanion();

    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.companion, this.obstacles);

    this.setupCamera();
    this.setupInput();
    this.createHUD();
  }

  createGround() {
    this.add.tileSprite(
      WORLD_WIDTH / 2, WORLD_HEIGHT / 2,
      WORLD_WIDTH, WORLD_HEIGHT,
      'tiles',
    );
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
      WORLD_WIDTH / 2 + 40, WORLD_HEIGHT / 2 + 40,
      'companion_idle',
    );
    this.companion.setScale(0.6);
    this.companion.setSize(30, 30);
    this.companion.setOffset(10, 20);
    this.companion.setDepth(9);
    this.companion.anims.play('companion_idle');
    this.companionMoving = false;
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
        this.companion.anims.play('companion_walk');
        this.companionMoving = true;
      }
    } else {
      this.companion.setVelocity(0, 0);
      if (this.companionMoving) {
        this.companion.anims.play('companion_idle');
        this.companionMoving = false;
      }
    }

    this.companion.setDepth(this.companion.y);
  }

  doAttack() {
    this.isAttacking = true;
    this.player.setVelocity(0, 0);
    this.player.anims.play(`player_atk1_${this.playerDir}`);
    this.player.once('animationcomplete', () => {
      this.isAttacking = false;
    });
  }

  placeTrees() {
    const treeKeys = ['tree_green', 'tree_dark', 'tree_red', 'tree_yellow', 'tree_golden'];
    const rng = new Phaser.Math.RandomDataGenerator(['forest_sprint1']);
    const safeZone = 200;

    for (let i = 0; i < TREE_COUNT; i++) {
      let tx, ty;
      do {
        tx = rng.integerInRange(50, WORLD_WIDTH - 50);
        ty = rng.integerInRange(50, WORLD_HEIGHT - 50);
      } while (
        Phaser.Math.Distance.Between(tx, ty, WORLD_WIDTH / 2, WORLD_HEIGHT / 2) < safeZone
      );

      const key = rng.pick(treeKeys);
      const tree = this.physics.add.staticImage(tx, ty, key);
      tree.setScale(0.15);
      tree.setSize(tree.width * 0.3, tree.height * 0.15);
      tree.setOffset(tree.width * 0.35, tree.height * 0.8);
      tree.refreshBody();
      tree.setDepth(ty);
    }
  }

  placeBuildings() {
    const rng = new Phaser.Math.RandomDataGenerator(['buildings_sprint1']);
    const positions = [
      { x: 300, y: 300 },
      { x: WORLD_WIDTH - 300, y: 300 },
      { x: 300, y: WORLD_HEIGHT - 300 },
      { x: WORLD_WIDTH - 300, y: WORLD_HEIGHT - 300 },
    ];

    for (let i = 0; i < BUILDING_COUNT; i++) {
      const pos = positions[i % positions.length];
      const offsetX = rng.integerInRange(-50, 50);
      const offsetY = rng.integerInRange(-50, 50);
      const building = this.physics.add.staticImage(
        pos.x + offsetX, pos.y + offsetY, 'buildings',
      );
      building.setScale(0.25);
      building.setSize(building.width * 0.5, building.height * 0.3);
      building.setOffset(building.width * 0.25, building.height * 0.65);
      building.refreshBody();
      building.setDepth(pos.y + offsetY);
    }
  }

  placeRocks() {
    const rng = new Phaser.Math.RandomDataGenerator(['rocks_sprint1']);
    const safeZone = 150;

    for (let i = 0; i < ROCK_COUNT; i++) {
      let rx, ry;
      do {
        rx = rng.integerInRange(50, WORLD_WIDTH - 50);
        ry = rng.integerInRange(50, WORLD_HEIGHT - 50);
      } while (
        Phaser.Math.Distance.Between(rx, ry, WORLD_WIDTH / 2, WORLD_HEIGHT / 2) < safeZone
      );

      const rock = this.physics.add.staticImage(rx, ry, 'rocks');
      rock.setScale(Phaser.Math.FloatBetween(0.08, 0.15));
      rock.setSize(rock.width * 0.4, rock.height * 0.25);
      rock.setOffset(rock.width * 0.3, rock.height * 0.7);
      rock.refreshBody();
      rock.setDepth(ry);
    }
  }
}
