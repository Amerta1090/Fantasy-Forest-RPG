# Prompt.md — Auto-Generated Skill Invocation Reference

> File ini berisi prompt siap-pakai untuk setiap sprint.
> Update otomatis saat sprint berubah atau skill baru ditambahkan.

---

## How to Use

1. Copy prompt di bawah ke chat opencode sebelum memulai sprint
2. Prompt akan trigger skill yang tepat secara otomatis
3. Setelah selesai sprint, update bagian "Last Updated" di bawah

---

## Sprint 0: Project Setup ✅ DONE

```
/skills phaser-core

Status: SUDAH SELESAI — 2026-07-16
Delivered:
- Vite bundler, Phaser 3.90, Arcade Physics (no gravity)
- 4 scenes: Boot → Preloader → MainMenu → Game
- Semua assets loaded: player (4 arah, idle/run/atk1/atk2), mobs (boar, bee, snail),
  character NPC, HUD base, 5 tree variants, companion (idle/walk)
- Player WASD/Arrow movement + idle/run animasi + Space attack
- Companion follows player dengan delay
- Camera follow player, world bounds 2000x2000, 20 trees placed
- FPS counter, keyboard hints

Run: npm run dev → http://localhost:5173/
```

---

## Sprint 1: Movement & World

```
/skills phaser-core,phaser-arcade-physics,input-systems

Lanjut dari Sprint 0. Player sudah bisa gerak dan companion sudah follow.
Yang belum: tilemap, collision, environment interaction.

Top-down movement & world untuk Fantasy Forest RPG:
- Tilemap: render forest dari Legacy-Fantasy tiles (ground, wall, path)
- Collision: player vs trees/rocks/buildings (static bodies), sudah ada 20 trees
- Camera: tambah deadzone 50x50, pastikan world bounds clamping benar
- Input: tambah gamepad support + configurable keybinds
- Environment: tempatkan buildings, rocks (selain trees yang sudah ada)
- Player animasi: refine idle↔run transitions, tambah facing indicator
- Companion: refine follow delay behavior, add leash distance
```

---

## Sprint 2: Combat

```
/skills phaser-arcade-physics,game-feel

Combat system untuk Fantasy Forest RPG:
- Basic attack: Attack1 spritesheet, 4方向, hitbox aktif di frame 2-4
- 3 Enemy types dari Legacy-Fantasy Mob/:
  - Boar: melee charge, run ke player, damage on contact
  - Small Bee: fly pattern, ranged attack, faster but weaker
  - Snail: slow walk, hide (invuln state), emerge attack
- HP system: all entities punya HP bar
- Damage calc: attack - defense + random variance
- Knockback on hit, 0.5s i-frames player
- Death: play Dead-Sheet.png, drop loot, destroy after anim
- Hit feedback: screen shake (5px, 100ms), sprite flash white, hit-stop 3 frames
- Loot drop: random items dari Raven Icons 64x64
```

---

## Sprint 3: Wave & Progression

```
/skills procedural-gen,game-ui-ux,save-system

Wave-based progression untuk Fantasy Forest RPG:
- Wave manager: spawn enemies per wave, 5s休歇 antar wave
- Difficulty: HP +20%, damage +15%, speed +10% per wave
- Wave UI: display "Wave X", enemy alive counter
- Boss wave: setiap 5 wave, 1 boss (3x HP, 2x damage, special attack)
- XP system: each enemy type gives different XP amount
- Level up: stat increase, +1 skill point
- Level up VFX: sparkle particle, screen flash, "LEVEL UP!" text
- Save progression after each wave
```

---

## Sprint 4: Skill Tree ⭐

```
/skills game-ui-ux,input-systems,game-feel

Skill tree system untuk Fantasy Forest RPG:
- 3 Branches: Warrior (melee), Mage (ranged), Ranger (speed)
- UI: fullscreen overlay, 3 columns, connected nodes
- Icons: map dari Raven Fantasy Icons 64x64 (pilih sesuai tema)
- Skills per branch (3 each, unlock bertingkat):

WARRIOR:
1. Power Strike (+50% melee dmg) — 1 skill point
2. Shield Bash (stun 1.5s, requires Power Strike) — 2 points
3. War Cry (AoE dmg around player, requires Shield Bash) — 3 points

MAGE:
1. Fireball (ranged projectile, piercing) — 1 skill point
2. Ice Shield (block 50% dmg for 5s, requires Fireball) — 2 points
3. Thunder (chain 3 enemies, requires Ice Shield) — 3 points

RANGER:
1. Quick Strike (+30% attack speed) — 1 skill point
2. Poison Blade (DOT 3s, requires Quick Strike) — 2 points
3. Evade (20% dodge chance, requires Poison Blade) — 3 points

- Hotbar: 4 skill slots, assign via drag or number keys
- Cooldown: per-skill cooldown, visual indicator
- VFX: particle effects per skill (fire, ice, lightning, poison green)
- Skill data structure: JSON, savable
```

---

## Sprint 5: Equipment & Inventory

```
/skills game-ui-ux,save-system,procedural-gen

Equipment & inventory untuk Fantasy Forest RPG:
- Inventory UI: grid layout 6x4, scrollable
- Equipment: 3 slots (Weapon, Armor, Accessory)
- Item database: ~100 items dari Raven Icons:
  - 20 weapons (swords, staffs, daggers — each with ATK bonus)
  - 20 armors (light, medium, heavy — each with DEF bonus)
  - 20 accessories (rings, amulets — various stats)
  - 20 potions (HP, MP, ATK buff, DEF buff, speed buff)
  - 20 materials (for crafting future feature)
- Equip/unequip: apply/remove stat bonuses realtime
- Consumable: use from inventory, apply effect, remove item
- Shop NPC: buy items dengan gold (drop dari enemies)
- Item tooltip: hover/tap shows name, description, stats
- Drag & drop: equip items from inventory to equipment slot
```

---

## Sprint 6: UI/UX & HUD

```
/skills game-ui-ux

Complete HUD & UI untuk Fantasy Forest RPG:
- HUD: pakai Legacy-Fantasy HUD/Base-01.png sebagai bar frame
  - HP bar (red), MP bar (blue), XP bar (yellow)
  - Gold counter, Wave number, Player level
- Minimap: top-right corner, 120x120px, shows:
  - Player position (green dot)
  - Enemy positions (red dots)
  - NPC positions (yellow dots)
- Quickbar: bottom center, 4 skill + 4 item slots
- Main menu: Start New, Continue, Settings, Credits
- Pause menu: ESC to pause, overlay with options
- Settings: volume sliders, fullscreen toggle, keybind display
- Dialog box: NPC interaction, typewriter text, choices
- Responsive: scale to window, center on screen
- Mobile: virtual joystick + attack button (if screen < 768px)
```

---

## Sprint 7: Save & Audio

```
/skills save-system,audio-design

Save system & audio untuk Fantasy Forest RPG:
- Save format: JSON schema, versioned (v1)
- Save data:
  - player: { level, xp, hp, mp, stats, position }
  - inventory: { items[], equipment{} }
  - skills: { unlocked[], active[] }
  - progression: { wave, gold, playtime }
- Auto-save: after each wave completion
- Manual save: 3 slots, accessible from pause menu
- Load: restore all state, resume gameplay
- Schema migration: version field untuk forward-compat

Audio:
- Music bus + SFX bus (Howler.js)
- Music: main menu theme, battle theme, boss theme
- SFX: attack swing, hit impact, enemy death, item pickup,
  level up fanfare, skill activation, menu click
- Adaptive: battle music intensity scales with wave number
- Volume: per-bus volume control, saved in settings
```

---

## Sprint 8: Polish & Game Feel

```
/skills game-feel,game-ui-ux

Polish pass untuk Fantasy Forest RPG:
- Screen shake: on hit (5px), boss spawn (10px), level up (8px)
- Hit-stop: 3 frames freeze on critical hit, 2 frames on normal
- Tween animations: menu slide-in, panel fade, button hover scale
- Squash & stretch: player/enemy hit reaction (0.9x/1.1x bounce)
- Particles: level up sparkles, gold pickup glow, skill VFX trails
- Combo: chain attacks within 1s = +10% bonus damage per chain
- Screen transitions: fade to black between areas (0.5s)
- Achievement toast: slide-in notification on unlock
- Polish pass: review all animations, smooth jittery movements
```

---

## Sprint 9: Deploy

```
/skills performance-optimization,phaser-core

Performance optimization & deployment untuk Fantasy Forest RPG:
- Texture atlas: merge all sprites ke single atlas (TexturePacker)
- Object pooling: enemies, projectiles, particles
- Asset loading: lazy load per area, preload current area only
- Mobile: test on 320px width, touch controls, 30fps minimum
- Build: Vite production, tree-shake, minify, gzip
- Deploy: static hosting (Vercel/Netlify/GitHub Pages)
- QA: full playthrough test, verify all features
```

---

## Recurring Prompts (Use Every Sprint)

### Start of Sprint
```
/skills [relevant-skills]

Mulai Sprint [X]: [nama sprint].
Goal: [goal dari sprint_planning.md].
Asset yang dipakai: [list asset folders].
Baca sprint_planning.md untuk detail task.
```

### End of Sprint
```
/skills performance-optimization

Selesai Sprint [X]. Lakukan quality check:
1. Test semua fitur yang baru dibuat
2. Cek console untuk errors
3. Pastikan 60 FPS
4. Clean debug logs
5. Update sprint_planning.md: centang task yang selesai
6. Git commit dengan message: "sprint[X]: [nama sprint]"
```

### Bug Fix
```
/skills [relevant-skill]

Bug di Sprint [X]: [deskripsi bug].
Location: [file/line jika tahu].
Expected: [apa yang harusnya terjadi].
Actual: [apa yang terjadi].
Fix this.
```

---

## Last Updated
- Sprint: 1 (done)
- Date: 2026-07-16
- Skills registered: 12
- Prompts: 10 (9 sprint + 1 recurring template)
