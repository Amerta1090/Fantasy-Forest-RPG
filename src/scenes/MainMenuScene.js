import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('mainMenu');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1d1d28');

    this.add.text(GAME_WIDTH / 2, 160, 'Fantasy Forest RPG', {
      fontSize: '40px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 220, 'Action RPG — Wave Defense', {
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    const startBtn = this.add.rectangle(
      GAME_WIDTH / 2, 340, 220, 50, 0x5588ff,
    ).setInteractive({ useHandCursor: true });

    const startText = this.add.text(GAME_WIDTH / 2, 340, 'Start Game', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    startBtn.on('pointerover', () => startBtn.setFillStyle(0x77aaff));
    startBtn.on('pointerout', () => startBtn.setFillStyle(0x5588ff));
    startBtn.on('pointerdown', () => {
      this.scene.start('game');
    });

    this.add.text(GAME_WIDTH / 2, 540, 'Sprint 2 — Combat System', {
      fontSize: '12px',
      color: '#666666',
    }).setOrigin(0.5);
  }
}
