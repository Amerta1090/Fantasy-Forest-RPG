import Phaser from 'phaser';
import { HealthBar } from './HealthBar.js';

export class Enemy {
  constructor(scene, x, y, texture, config) {
    this.scene = scene;
    this.config = config;
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.isDead = false;
    this.isHit = false;
    this.state = 'idle';
    this.target = null;

    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setSize(24, 24);
    this.sprite.setOffset(4, 4);
    this.sprite.setDepth(y);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setData('enemy', this);

    this.healthBar = new HealthBar(scene, this.sprite, config.hp);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  takeDamage(amount, attackerX, attackerY) {
    if (this.isDead || this.isHit) return 0;

    const finalDamage = Math.max(1, amount - this.config.defense);
    this.hp -= finalDamage;
    this.isHit = true;
    this.healthBar.update(this.hp, this.maxHp);

    const angle = Phaser.Math.Angle.Between(attackerX, attackerY, this.sprite.x, this.sprite.y);
    this.sprite.setVelocity(
      Math.cos(angle) * 200,
      Math.sin(angle) * 200,
    );

    this.sprite.setTintFill(0xffffff);
    this.scene.time.delayedCall(80, () => {
      if (!this.isDead) this.sprite.clearTint();
      this.isHit = false;
    });

    if (this.hp <= 0) {
      this.die();
    }

    return finalDamage;
  }

  die() {
    this.isDead = true;
    this.sprite.setVelocity(0, 0);
    this.sprite.body.enable = false;
    this.healthBar.destroy();

    this.sprite.setTint(0x888888);
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      y: this.sprite.y - 10,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        this.sprite.destroy();
      },
    });

    this.scene.events.emit('enemy-killed', this);
  }

  destroy() {
    this.healthBar.destroy();
    if (this.sprite) this.sprite.destroy();
  }
}
