import Phaser from 'phaser';
import { Enemy } from './Enemy.js';
import { ENEMY_TYPES } from '../config.js';

export class Bee extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'bee_fly', ENEMY_TYPES.bee);
    this.sprite.setSize(14, 18);
    this.sprite.setOffset(9, 28);
    this.sprite.anims.play('bee_fly');
    this.attackTimer = 0;
    this.attackCooldown = 1500;
    this.orbitAngle = Math.random() * Math.PI * 2;

    if (!scene.textures.exists('bee_sting_tex')) {
      const gfx = scene.add.graphics();
      gfx.fillStyle(0xffff00, 1);
      gfx.fillCircle(4, 4, 4);
      gfx.generateTexture('bee_sting_tex', 8, 8);
      gfx.destroy();
    }

    this.projectiles = scene.physics.add.group({
      defaultKey: 'bee_sting_tex',
      maxSize: 5,
    });
  }

  update(time, delta, player) {
    if (this.isDead || this.isHit) return;

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y, player.x, player.y,
    );

    if (dist < this.config.aggroRange) {
      this.state = 'attack';
    } else {
      this.state = 'idle';
    }

    switch (this.state) {
      case 'idle':
        this.sprite.anims.play('bee_fly', true);
        this.orbitAngle += delta * 0.001;
        this.sprite.setVelocity(
          Math.cos(this.orbitAngle) * 20,
          Math.sin(this.orbitAngle) * 20,
        );
        break;

      case 'attack':
        if (dist < this.config.attackRange * 0.6) {
          const retreat = Phaser.Math.Angle.Between(
            player.x, player.y, this.sprite.x, this.sprite.y,
          );
          this.sprite.setVelocity(
            Math.cos(retreat) * this.config.speed * 0.5,
            Math.sin(retreat) * this.config.speed * 0.5,
          );
        } else if (dist > this.config.attackRange) {
          const approach = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y, player.x, player.y,
          );
          this.sprite.setVelocity(
            Math.cos(approach) * this.config.speed,
            Math.sin(approach) * this.config.speed,
          );
        } else {
          this.orbitAngle += delta * 0.002;
          this.sprite.setVelocity(
            Math.cos(this.orbitAngle) * 30,
            Math.sin(this.orbitAngle) * 30,
          );
        }

        if (dist < this.config.attackRange && time > this.attackTimer) {
          this.shootProjectile(player);
        }
        break;
    }

    this.sprite.setDepth(this.sprite.y);
  }

  shootProjectile(player) {
    this.attackTimer = this.scene.time.now + this.attackCooldown;
    this.sprite.anims.play('bee_attack', true);

    const sting = this.projectiles.get(this.sprite.x, this.sprite.y);
    if (!sting) return;

    sting.enableBody(true, this.sprite.x, this.sprite.y, true, true);
    sting.setCircle(3);
    sting.setDepth(999);
    sting.setTint(0xffff00);

    const angle = Phaser.Math.Angle.Between(
      this.sprite.x, this.sprite.y, player.x, player.y,
    );
    sting.setVelocity(
      Math.cos(angle) * this.config.projectileSpeed,
      Math.sin(angle) * this.config.projectileSpeed,
    );

    this.scene.time.delayedCall(2000, () => {
      if (sting.active) sting.disableBody(true, true);
    });
  }

  die() {
    this.projectiles.clear(true, true);
    super.die();
  }
}
