import Phaser from 'phaser';
import { Enemy } from './Enemy.js';
import { ENEMY_TYPES } from '../config.js';

export class Boar extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'boar_idle', ENEMY_TYPES.boar);
    this.sprite.setSize(24, 18);
    this.sprite.setOffset(4, 12);
    this.sprite.anims.play('boar_idle');
    this.chargeTimer = 0;
    this.chargeCooldown = 2000;
    this.isCharging = false;
  }

  update(time, delta, player) {
    if (this.isDead || this.isHit) return;

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
        this.sprite.anims.play('boar_idle', true);
        this.sprite.setVelocity(0, 0);
        break;

      case 'chase':
        if (dist < this.config.attackRange && time > this.chargeTimer) {
          this.charge(player);
        } else if (!this.isCharging) {
          this.sprite.anims.play('boar_run', true);
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

  charge(player) {
    this.isCharging = true;
    this.chargeTimer = this.scene.time.now + this.chargeCooldown;

    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y, player.x, player.y,
    );

    this.sprite.setVelocity(
      Math.cos(angle) * this.config.speed * 2.5,
      Math.sin(angle) * this.config.speed * 2.5,
    );

    this.sprite.setTint(0xff8888);

    this.scene.time.delayedCall(400, () => {
      this.isCharging = false;
      if (!this.isDead) {
        this.sprite.clearTint();
        this.sprite.setVelocity(0, 0);
      }
    });
  }

  die() {
    super.die();
  }
}
