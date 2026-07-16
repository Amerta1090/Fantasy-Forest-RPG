# Sprint Planning — Fantasy Forest RPG

> **Game:** Fantasy Forest RPG (Web Browser)
> **Engine:** Phaser 3 + Arcade Physics
> **Genre:** Action RPG dengan Wave Defense + Skill Tree/Upgrade System
> **Platform:** Web (HTML5), mobile-responsive
> **Start Date:** TBD

---

## Asset Inventory & Utilization Strategy

### Folder 1: `FREE_Adventurer 2D Pixel Art/`
| Asset | Utilization |
|-------|-------------|
| `idle_down/left/right/up.png` | Player idle animation (4 arah) |
| `run_down/left/right/up.png` | Player movement animation (4 arah) |
| `attack1_down/left/right/up.png` | Basic attack animation |
| `attack2_down/left/right/up.png` | Skill attack animation (unlocked via skill tree) |

**Utilization: 100%** — Menjadi player character utama.

### Folder 2: `Free - Raven Fantasy Icons/`
| Asset | Utilization |
|-------|-------------|
| `64x64/` (2,192 icons) | UI icons: inventory, skill tree, equipment, status |
| `32x32/` (2,192 icons) | HUD icons: item pickup, buff/debuff, quickbar |
| `16x16/` (2,192 icons) | Mini-map icons, status effect indicators |
| `Full Spritesheet/64x64.png` | Sprite atlas untuk atlas-based loading |
| `IconSet.png` | Fallback icon atlas |

**Utilization: ~30% aktif** (600-800 icons dipakai untuk items, skills, equipment, potions, buffs)

### Folder 3: `Legacy-Fantasy - High Forest 2.3/`
| Asset | Utilization |
|-------|-------------|
| `Character/Idle-Sheet.png` | NPC idle sprite |
| `Character/Run-Sheet.png` | NPC walking sprite |
| `Character/Attack-01-Sheet.png` | NPC/NPC ally attack |
| `Character/Dead-Sheet.png` | Death animation (player & enemies) |
| `Character/Jump-All-Sheet.png` | Jump animation (jika ada platforming) |
| `Assets/Tiles.png` | Ground, wall, path tiles |
| `Assets/Buildings.png` | Village buildings, shops, shrines |
| `Assets/Props-Rocks.png` | Destructible rocks, cover |
| `Assets/Interior-01.png` | Indoor/shop interiors |
| `Background/Background.png` | Parallax background layer |
| `Trees/*.png` (5 variants) | Forest environment decoration |
| `HUD/Base-01.png` | Health/mana bar frame |
| `Mob/Boar/` (Idle, Run, Walk, Hit) | Enemy type 1 — melee charger |
| `Mob/Small Bee/` (Fly, Attack, Hit) | Enemy type 2 — flying ranged |
| `Mob/Snail/` (walk, Hide, Dead) | Enemy type 3 — tank/slow |

**Utilization: 100%** — Core game world, enemies, HUD, environment.

### Folder 4: `sample(idle&walk)/`
| Asset | Utilization |
|-------|-------------|
| `idle.png` | Companion/pet idle |
| `walk.png` | Companion/pet walk |
| `from idle.png` | Transition frame |

**Utilization: 100%** — Companion/pet system atau NPC tambahan.

---

## Game Design Summary

### Core Loop
```
Explore Forest → Encounter Enemies (Wave) → Fight → Collect Loot (Icons)
    → Upgrade Stats / Unlock Skills → Face Harder Waves → Repeat
```

### Fitur Utama
1. **Top-Down Action RPG** — Gerak 4 arah, attack, dodge
2. **Wave Defense System** — Enemy spawn dalam wave, difficulty naik
3. **Skill Tree** — 3 cabang: Warrior (melee), Mage (ranged), Ranger (speed)
4. **Equipment System** — Armor, weapon, accessory dari 6,581 icons
5. **Inventory** — Items, potions,材料
6. **NPC & Shops** — Beli items, accept quests
7. **Save System** — LocalStorage auto-save + manual save
8. **HUD** — HP, MP, XP bar, minimap, quickbar

---

## Sprint Breakdown

### Sprint 0: Project Setup (2 hari)
**Goal:** Phaser 3 project running dengan asset loading

| Task | Detail | Skills | Done |
|------|--------|--------|------|
| Init project | `npm init`, install Phaser 3, setup Vite dev server | phaser-core | ✅ |
| Scene structure | Boot → Preloader → MainMenu → Game | phaser-core | ✅ |
| Asset loading | Load semua sprite sheets, tiles dari semua folder | phaser-core | ✅ |
| Basic player | Player sprite idle + movement 4 arah + companion | phaser-arcade-physics | ✅ |
| Dev tools | Hot reload, FPS counter, keyboard hints | performance-optimization | ✅ |

**Deliverable:** Browser running, player bisa gerak di empty scene dengan semua asset loaded.

---

### Sprint 1: Core Movement & World (3 hari)
**Goal:** Player bergerak di forest world dengan collision

| Task | Detail | Skills |
|------|--------|--------|
| Tilemap | Render forest tilemap dari `Tiles.png` | phaser-core |
| Collision | Player vs trees, rocks, buildings | phaser-arcade-physics |
| Camera | Follow player, smooth cam, world bounds | phaser-core |
| Environment | Place trees (5 varian), buildings, rocks, background | game-feel |
| Player animasi | Idle ↔ Run animasi smooth transitions | phaser-core |
| Input | WASD + Arrow keys + gamepad support | input-systems |
| Kompanion | Spawn companion dari `sample(idle&walk)` | phaser-core |

**Deliverable:** Player bisa explore forest, collision jalan, camera follow, companion ikut.

---

### Sprint 2: Combat System (3 hari)
**Goal:** Player bisa attack, enemy spawn & fight

| Task | Detail | Skills |
|------|--------|--------|
| Basic attack | Attack1 animasi + hitbox detection | phaser-arcade-physics |
| Enemy: Boar | Idle → Run → attack player, HP system | phaser-arcade-physics |
| Enemy: Bee | Fly pattern → ranged attack, HP system | phaser-arcade-physics |
| Enemy: Snail | Slow walk → hide (invuln) → emerge, HP system | phaser-arcade-physics |
| Damage system | Damage calculation, knockback, i-frames | game-feel |
| Death animasi | pakai `Dead-Sheet.png` untuk semua character | phaser-core |
| Hit feedback | Screen shake, flash white, knockback | game-feel |
| Loot drop | Enemies drop items (pilih dari Raven Icons) | procedural-gen |

**Deliverable:** 3 tipe enemy aktif, combat jalan, loot drop, feedback mantap.

---

### Sprint 3: Wave System & Progression (2 hari)
**Goal:** Wave-based enemy spawning dengan difficulty scaling

| Task | Detail | Skills |
|------|--------|--------|
| Wave manager | Spawn enemy per wave,休歇 antar wave | procedural-gen |
| Difficulty curve | HP/damage/speed enemy naik per wave | procedural-gen |
| Wave UI | "Wave X" display, enemy counter, boss warning | game-ui-ux |
| XP system | Kill enemy → gain XP → level up | save-system |
| Level up | Stat increase per level, skill point reward | game-ui-ux |
| Boss waves | Wave 5, 10, 15 = boss (boss = buffed Boar/Bee/Snail) | game-feel |
| Auto-spawn | Hewan spawn di random positions, avoid player | phaser-arcade-physics |

**Deliverable:** Wave system jalan, difficulty scaling, boss tiap 5 wave, level up.

---

### Sprint 4: Skill Tree System (3 hari) ⭐
**Goal:** Full skill tree dengan 3 cabang

| Task | Detail | Skills |
|------|--------|--------|
| Skill tree UI | Open/close panel, 3 branch layout | game-ui-ux |
| Warrior branch | Power Strike (dmg↑), Shield Bash (stun), War Cry (AoE) | game-ui-ux |
| Mage branch | Fireball (ranged), Ice Shield (def), Thunder (chain) | game-ui-ux |
| Ranger branch | Quick Strike (speed), Poison (DOT), Evade (dodge%) | game-ui-ux |
| Skill icons | Map 64x64 Raven Icons ke skill nodes | game-ui-ux |
| Skill activation | Hotbar assign, cooldown system | input-systems |
| Skill VFX | Particle effects per skill type | game-feel |
| Skill data | JSON data structure untuk semua skill | save-system |

**Deliverable:** Skill tree panel lengkap, 9 skills aktif, icons, VFX, cooldown.

---

### Sprint 5: Equipment & Inventory (3 hari)
**Goal:** Equipment system + inventory UI

| Task | Detail | Skills |
|------|--------|--------|
| Inventory UI | Grid inventory, drag & drop | game-ui-ux |
| Equipment slots | Weapon, Armor, Accessory (3 slots) | game-ui-ux |
| Item database | ~100 items dari Raven Icons (weapons, armor, potions) | save-system |
| Item stats | Attack, Defense, HP, Speed modifiers | save-system |
| Equip/unequip | Apply/remove stat bonuses | phaser-core |
| Consumable | Potion HP, Potion MP, Buff items | phaser-arcade-physics |
| Shop NPC | Beli items dengan gold (drop dari enemy) | game-ui-ux |
| Item tooltips | Hover/click untuk detail stats | game-ui-ux |

**Deliverable:** 100+ items, inventory jalan, equip system, shop.

---

### Sprint 6: UI/UX & HUD (2 hari)
**Goal:** Polished HUD dan game screens

| Task | Detail | Skills |
|------|--------|--------|
| HUD layout | HP/MP bars (pakai `Base-01.png`), XP bar, gold, wave# | game-ui-ux |
| Minimap | Small forest overview, enemy dots, NPC markers | game-ui-ux |
| Quickbar | 4 skill slots + 4 item slots | game-ui-ux |
| Main menu | Start, Continue, Settings, Credits | game-ui-ux |
| Pause menu | Resume, Settings, Save, Quit | game-ui-ux |
| Settings | Volume, fullscreen, controls | game-ui-ux |
| Dialog system | NPC interaction dialog box | game-ui-ux |
| Responsive | Scale to any screen size, mobile touch | game-ui-ux |

**Deliverable:** Semua UI screens polished, responsive, mobile-friendly.

---

### Sprint 7: Save System & Audio (2 hari)
**Goal:** Persistent progress + audio

| Task | Detail | Skills |
|------|--------|--------|
| Auto-save | Save setelah setiap wave | save-system |
| Manual save | 3 save slots | save-system |
| Save data | Player stats, inventory, skills, equipment, wave progress | save-system |
| Schema versioning | Forward-compatible save format | save-system |
| SFX | Attack, hit, death, pickup, level up sounds | audio-design |
| Music | Main theme, battle music, boss music | audio-design |
| Audio bus | Music bus + SFX bus, volume control | audio-design |
| Adaptive music | Battle music intensity scales with wave | audio-design |

**Deliverable:** Save/load jalan sempurna, audio full.

---

### Sprint 8: Polish & Game Feel (2 hari)
**Goal:** Juice dan polish

| Task | Detail | Skills |
|------|--------|--------|
| Screen shake | On hit, on boss spawn, on level up | game-feel |
| Hit-stop | Freeze 2-3 frames on critical hit | game-feel |
| Particle effects | Level up sparkle, gold pickup, skill VFX | game-feel |
| Tween animations | Menu transitions, panel slides | game-feel |
| Squash & stretch | Player/enemy hit reaction | game-feel |
| Combo system | Chain attacks for bonus damage | game-feel |
| Screen transitions | Fade between areas | game-feel |
| Achievement pop | Toast notification for achievements | game-ui-ux |

**Deliverable:** Game terasa punchy dan satisfying.

---

### Sprint 9: Performance & Deploy (1 hari)
**Goal:** Optimize dan deploy

| Task | Detail | Skills |
|------|--------|--------|
| Texture atlas | Merge all sprites into single atlas | performance-optimization |
| Object pooling | Enemy/projectile pooling | performance-optimization |
| Asset lazy load | Only load current area assets | performance-optimization |
| Mobile test | Touch controls, performance on low-end | performance-optimization |
| Build | Vite production build, minify | phaser-core |
| Deploy | Deploy ke Vercel/Netlify/GitHub Pages | — |
| QA | Full playthrough test | — |

**Deliverable:** Game deployed, playable di browser, performa smooth.

---

## Total Effort

| Sprint | Days | Focus |
|--------|------|-------|
| Sprint 0 | 2 | Setup |
| Sprint 1 | 3 | Movement & World |
| Sprint 2 | 3 | Combat |
| Sprint 3 | 2 | Waves & Progression |
| Sprint 4 | 3 | Skill Tree ⭐ |
| Sprint 5 | 3 | Equipment & Inventory |
| Sprint 6 | 2 | UI/UX |
| Sprint 7 | 2 | Save & Audio |
| Sprint 8 | 2 | Polish |
| Sprint 9 | 1 | Deploy |
| **Total** | **23 hari** | |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Game Engine | Phaser 3.80+ |
| Physics | Phaser Arcade Physics |
| Bundler | Vite 5.x |
| Language | JavaScript (ES modules) |
| Audio | Howler.js |
| UI | Phaser DOM elements + HTML overlay |
| Save | LocalStorage + JSON |
| Deploy | Static hosting (Vercel/Netlify) |
| Version Control | Git |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| 6,581 icons too many to process | Medium | Pre-select ~200 icons per category, use atlas |
| Sprite sheet frame sizes inconsistent | High | Normalize all sprite sheets in pre-sprint |
| Mobile performance | Medium | Object pooling, reduce draw calls, test early |
| Save data corruption | Low | Schema versioning, try-catch, backup |
| Scope creep | High | Strict sprint boundaries, cut features if needed |

---

## Definition of Done (per Sprint)

- [ ] Semua task dalam sprint selesai
- [ ] Tidak ada runtime error di console
- [ ] Feature bisa di-test manual end-to-end
- [ ] Code clean, no debug logs
- [ ] Performance stable (60 FPS)
- [ ] Commit ke git dengan message jelas
