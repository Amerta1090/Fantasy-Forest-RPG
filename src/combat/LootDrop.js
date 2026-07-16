import Phaser from 'phaser';
import { LOOT_ICONS } from '../config.js';

export class LootDrop {
  constructor(scene) {
    this.scene = scene;
    this.drops = [];
  }

  drop(x, y, goldRange) {
    const gold = Phaser.Math.Between(goldRange[0], goldRange[1]);
    const iconKey = Phaser.Utils.Array.GetRandom(LOOT_ICONS);

    const icon = this.scene.add.image(x, y, iconKey);
    icon.setScale(0.35);
    icon.setDepth(998);
    icon.setAlpha(0);

    this.scene.tweens.add({
      targets: icon,
      alpha: 1,
      y: y - 15,
      duration: 300,
      ease: 'Back.easeOut',
    });

    this.scene.tweens.add({
      targets: icon,
      y: y - 15 + 15,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    icon.setInteractive({ useHandCursor: true });
    icon.on('pointerdown', () => {
      this.collect(icon, gold);
    });

    this.drops.push(icon);

    this.scene.time.delayedCall(8000, () => {
      if (icon.active) {
        this.scene.tweens.add({
          targets: icon,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            icon.destroy();
            const idx = this.drops.indexOf(icon);
            if (idx > -1) this.drops.splice(idx, 1);
          },
        });
      }
    });
  }

  collect(icon, gold) {
    if (!icon.active) return;

    const text = this.scene.add.text(icon.x, icon.y - 10, `+${gold}g`, {
      fontSize: '14px',
      color: '#ffdd00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(1001);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });

    this.scene.tweens.add({
      targets: icon,
      scale: 0.6,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        icon.destroy();
        const idx = this.drops.indexOf(icon);
        if (idx > -1) this.drops.splice(idx, 1);
      },
    });

    this.scene.events.emit('gold-pickup', gold);
  }

  destroy() {
    this.drops.forEach(d => { if (d.active) d.destroy(); });
    this.drops = [];
  }
}
