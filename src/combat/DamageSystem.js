import Phaser from 'phaser';
import { KNOCKBACK_FORCE, IFRAME_DURATION } from '../config.js';

export function calcDamage(attackerAtk, defenderDef) {
  const variance = Math.floor(Math.random() * 5) - 2;
  return Math.max(1, attackerAtk - defenderDef + variance);
}

export function applyKnockback(target, sourceX, sourceY, force = KNOCKBACK_FORCE) {
  const angle = Phaser.Math.Angle.Between(sourceX, sourceY, target.x, target.y);
  target.setVelocity(
    Math.cos(angle) * force,
    Math.sin(angle) * force,
  );
}

export function grantIframes(entity, duration = IFRAME_DURATION) {
  entity.setData('iframes', true);
  entity.setAlpha(0.5);

  entity.scene.time.delayedCall(duration, () => {
    entity.setData('iframes', false);
    entity.setAlpha(1);
  });
}
