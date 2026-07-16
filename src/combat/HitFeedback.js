import Phaser from 'phaser';

export class HitFeedback {
  constructor(scene) {
    this.scene = scene;
    this.shakeIntensity = 5;
    this.shakeDuration = 100;
    this.hitStopFrames = 3;
  }

  onHit(x, y) {
    this.scene.cameras.main.shake(this.shakeDuration, this.shakeIntensity / 1000);
    this.flashSprite(this.scene.player);
    this.spawnHitParticles(x, y);
  }

  flashSprite(sprite) {
    if (!sprite || !sprite.active) return;
    sprite.setTintFill(0xffffff);
    this.scene.time.delayedCall(60, () => {
      if (sprite.active) sprite.clearTint();
    });
  }

  spawnHitParticles(x, y) {
    for (let i = 0; i < 6; i++) {
      const particle = this.scene.add.circle(
        x, y, 2, 0xffff00,
      );
      particle.setDepth(999);

      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 30;

      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.3,
        duration: 200 + Math.random() * 150,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  spawnDeathParticles(x, y) {
    for (let i = 0; i < 12; i++) {
      const particle = this.scene.add.circle(
        x, y, 3, 0xff6600,
      );
      particle.setDepth(999);

      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 40;

      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.2,
        duration: 300 + Math.random() * 200,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  hitStop() {
    this.scene.physics.world.timeScale = 100;
    this.scene.time.delayedCall(50, () => {
      this.scene.physics.world.timeScale = 1;
    });
  }
}
