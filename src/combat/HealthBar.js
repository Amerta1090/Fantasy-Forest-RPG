import Phaser from 'phaser';

export class HealthBar {
  constructor(scene, parent, maxHp) {
    this.scene = scene;
    this.parent = parent;
    this.maxHp = maxHp;

    const barWidth = 30;
    const barHeight = 4;

    this.bg = scene.add.rectangle(0, 0, barWidth, barHeight, 0x000000);
    this.bg.setOrigin(0.5, 1);
    this.bg.setDepth(1000);

    this.fill = scene.add.rectangle(0, 0, barWidth, barHeight, 0xff3333);
    this.fill.setOrigin(0, 0.5);
    this.fill.setDepth(1001);

    this.barWidth = barWidth;
    this.update(maxHp, maxHp);
  }

  update(hp, maxHp) {
    const ratio = Math.max(0, hp / maxHp);
    this.fill.width = this.barWidth * ratio;

    if (ratio > 0.6) {
      this.fill.setFillStyle(0x33cc33);
    } else if (ratio > 0.3) {
      this.fill.setFillStyle(0xffcc00);
    } else {
      this.fill.setFillStyle(0xff3333);
    }

    this.bg.setPosition(this.parent.x, this.parent.y - 22);
    this.fill.setPosition(
      this.parent.x - this.barWidth / 2,
      this.parent.y - 22,
    );
  }

  destroy() {
    if (this.bg) this.bg.destroy();
    if (this.fill) this.fill.destroy();
  }
}
