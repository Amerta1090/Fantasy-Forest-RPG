import Phaser from 'phaser';
import { Enemy } from './Enemy.js';
import { ENEMY_TYPES } from '../config.js';

export class Snail extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'snail_walk', ENEMY_TYPES.snail);
    this.sprite.setSize(24, 20);
    this.sprite.setOffset(4, 12);
    this.sprite.anims.play('snail_walk');
    this.isHiding = false;
    this.hideTimer = 0;
    this.attackCooldown = 1500;
    this.attackTimer = 0;
  }

  update(time, delta, player) {
    if (this.isDead) return;

    if (this.isHiding) {
      if (time > this.hideTimer) {
        this.emerge();
      }
      return;
    }

    if (this.isHit) return;

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y, player.x, player.y,
    );

    if (dist < this.config.aggroRange) {
      this.state = 'chase';
    } else {
      this.state = 'idle';
    }

    switch (this.state) {
      case 'idle':
        this.sprite.anims.play('snail_walk', true);
        this.sprite.setVelocity(0, 0);
        break;

      case 'chase':
        if (dist < this.config.attackRange && time > this.attackTimer) {
          this.hide(player);
        } else {
          this.sprite.anims.play('snail_walk', true);
          const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y, player.x, player.y,
          );
          this.sprite.setVelocity(
            Math.cos(angle) * this.config.speed,
            Math.sin(angle) * this.config.speed,
          );
        }
        break;
    }

    this.sprite.setDepth(this.sprite.y);
  }

  hide(player) {
    this.isHiding = true;
    this.attackTimer = this.scene.time.now + this.attackCooldown;
    this.hideTimer = this.scene.time.now + this.config.hideDuration;
    this.sprite.setVelocity(0, 0);
    this.sprite.setAlpha(0.3);
    this.sprite.setTint(0x8888ff);
    this.sprite.body.enable = false;
  }

  emerge() {
    this.isHiding = false;
    this.sprite.setAlpha(1);
    this.sprite.clearTint();
    this.sprite.body.enable = true;
  }

  die() {
    super.die();
  }
}
