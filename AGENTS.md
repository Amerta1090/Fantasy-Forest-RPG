# AGENTS.md — Project Agent Configuration

> Auto-updated per sprint. Do not edit manually during sprint execution.

---

## Project Info

| Field | Value |
|-------|-------|
| **Name** | Fantasy Forest RPG |
| **Type** | Web Browser Game |
| **Engine** | Phaser 3.80+ |
| **Language** | JavaScript (ES Modules) |
| **Bundler** | Vite 5.x |
| **Root Dir** | `/home/amerta/nyobagame simple/` |

---

## Active Skills (per Sprint)

| Sprint | Skills | Status |
|--------|--------|--------|
| 0 | `phaser-core` | PENDING |
| 1 | `phaser-core`, `phaser-arcade-physics`, `input-systems` | PENDING |
| 2 | `phaser-arcade-physics`, `game-feel` | PENDING |
| 3 | `procedural-gen`, `game-ui-ux`, `save-systems` | PENDING |
| 4 | `game-ui-ux`, `input-systems`, `game-feel` | PENDING |
| 5 | `game-ui-ux`, `save-systems`, `procedural-gen` | PENDING |
| 6 | `game-ui-ux` | PENDING |
| 7 | `save-systems`, `audio-design` | PENDING |
| 8 | `game-feel`, `game-ui-ux` | PENDING |
| 9 | `performance-optimization`, `phaser-core` | PENDING |

---

## Skill Invocation Reference

Setiap kali memulai task, invoke skill yang relevan:

```bash
# Project setup / scene management
/skills phaser-core

# Movement, collision, physics
/skills phaser-arcade-physics

# Player input, keybinds, gamepad
/skills input-systems

# HUD, menus, UI layout
/skills game-ui-ux

# Screen shake, hit-stop, particles, tween
/skills game-feel

# Save/load, localStorage, serialization
/skills save-systems

# Wave spawning, random generation, loot tables
/skills procedural-gen

# Audio buses, music, SFX
/skills audio-design

# FPS, profiling, object pooling
/skills performance-optimization

# Quick prototype, greybox
/skills prototype-fast
```

---

## Asset Map

```
nyobagame simple/
├── FREE_Adventurer 2D Pixel Art/
│   └── Sprites/
│       ├── IDLE/        → player idle (4 arah)
│       ├── RUN/         → player run (4 arah)
│       ├── ATTACK 1/    → basic attack (4 arah)
│       └── ATTACK 2/    → skill attack (4 arah)
│
├── Free - Raven Fantasy Icons/
│   └── Separated Files/
│       ├── 64x64/       → UI icons (inventory, skill tree)
│       ├── 32x32/       → HUD icons (quickbar, status)
│       └── 16x16/       → minimap icons, indicators
│
├── Legacy-Fantasy - High Forest 2.3/
│   ├── Assets/          → tiles, buildings, rocks, interior
│   ├── Background/      → parallax background
│   ├── Character/       → NPC sprites (idle, run, attack, dead, jump)
│   ├── HUD/             → HP/MP bar frame (Base-01.png)
│   ├── Mob/
│   │   ├── Boar/        → enemy: melee charger
│   │   ├── Small Bee/   → enemy: flying ranged
│   │   └── Snail/       → enemy: tank/slow
│   └── Trees/           → 5 tree variants (environment)
│
└── sample(idle&walk)/
    ├── idle/            → companion idle
    └── walk/            → companion walk
```

---

## File Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Scene | `PascalCase.js` | `MainMenu.js`, `GameScene.js` |
| Component | `camelCase.js` | `playerController.js`, `waveManager.js` |
| Data | `camelCase.json` | `items.json`, `skills.json` |
| Asset folder | `kebab-case/` | `raven-icons/`, `legacy-fantasy/` |
| CSS | `kebab-case.css` | `game-ui.css` |

---

## Code Style

- ES modules (`import`/`export`)
- No classes longer than 200 lines
- Separate logic from presentation
- Use Phaser signals/events for decoupling
- Constants in `config.js`
- All tunable values as `@export`-equivalent config objects

---

## Sprint Progress

| Sprint | Status | Completed | Notes |
|--------|--------|-----------|-------|
| 0 | ✅ DONE | 2026-07-16 | Vite+Phaser3 setup, 4 scenes, all assets loaded, player+companion |
| 1 | ⏳ PENDING | — | — |
| 2 | ⏳ PENDING | — | — |
| 3 | ⏳ PENDING | — | — |
| 4 | ⏳ PENDING | — | Skill tree — core feature |
| 5 | ⏳ PENDING | — | — |
| 6 | ⏳ PENDING | — | — |
| 7 | ⏳ PENDING | — | — |
| 8 | ⏳ PENDING | — | — |
| 9 | ⏳ PENDING | — | Deploy milestone |

---

## Auto-Update Rules

1. **Sprint selesai** → Update status di tabel Sprint Progress
2. **Task selesai** → Centang di sprint_planning.md
3. **Skill baru ditambah** → Update Active Skills table
4. **Bug ditemukan** → Tambah di Risk Register
5. **File dipindah** → Update Asset Map
6. **Commit** → Message format: `sprint[X]: [description]`

---

## Quick Reference: How to Start a Sprint

```
1. Baca sprint_planning.md → cari sprint yang akan dikerjakan
2. Baca prompt.md → copy prompt untuk sprint tersebut
3. Paste prompt ke chat opencode
4. Skill akan auto-invoke berdasarkan /skills directive
5. Kerjakan task satu per satu
6. Setelah selesai, update AGENTS.md status
7. Git commit
```

---

*Last Updated: 2026-07-16 | Sprint 0 (done)*
