# Game Development & Asset Guide 🎮

This document describes how we will develop the combat prototype, how to test locally, the asset specifications (visuals & audio), and the immediate roadmap for gameplay improvements.

---

## Where to test (dev workflow) ✅
- Run locally: `npm install` (first time) then `npm run dev`.
- Open in browser: http://localhost:3000/ or use the Vite network URL printed in the terminal (e.g. `http://192.168.56.1:3000/`).
  - If `localhost` doesn't respond, use the printed network address or set `server.host = '127.0.0.1'` in `vite.config.ts` to force IPv4.
- Build & preview (production-like): `npm run build` then `npm run preview`.
- CI: GitHub Actions runs type checks and builds on pushes to `main` (see `.github/workflows/ci.yml`).

## Quick testing tips 🧪
- Use the **Combat Prototype** -> **INITIALIZE PILOT** to start the gameplay loop.
- Controls: WASD (move/jump), J / SPACE (heavy swing).
- Debug: we will add an in-game debug overlay (`?debug=1`) to show FPS, hitboxes, and spawning controls.

## Asset pipeline & conventions 🖼️
Folder layout (recommended):
```
/assets
  /sprites
    /player
    /enemies
    /companions
  /tilesets
  /backgrounds
  /ui
  /audio
    /music
    /sfx
  manifest.json (auto-generated mapping)
```

Visual specs & naming:
- Base resolution: **320x180** (native). Render at integer scale (nearest neighbor) for pixel crispness.
- Sprite frame sizes: 16×16, 32×32, 32×64, etc. Use powers of two / multiples of 8 when possible.
- Character sheets: `player_<action>_000.png` (e.g., `player_run_000.png`) or a sprite-sheet PNG plus `player_run.json` atlas.
- Tilemaps: export tileset images (e.g., `tileset_ashfields.png`) with a separate `.json` defining tile size.
- Backgrounds: provide parallax layers named: `bg_<biome>_far.png`, `bg_<biome>_mid.png`, `bg_<biome>_near.png`.
- Palette & format: PNG (lossless), indexed PNG if possible; keep color palette limited for stylistic cohesion.
- Recommended tools: Aseprite (sprites/animation), TexturePacker (atlases), Photoshop/GIMP for backgrounds.

Animation metadata:
- Include frame durations in milliseconds (e.g., `frames: [100,100,80,80]`) in a small JSON alongside sprite sheets.

## Audio pipeline 🔊
- Music: `/assets/audio/music/*.ogg` (stereo, 44.1 kHz). Provide loop points if necessary.
- SFX: `/assets/audio/sfx/*.ogg` (mono preferred, short, 22050 or 44100 Hz). Normalize to -6dB to avoid clipping.
- Licensing: provide source and license for any third-party assets.
- Integration: use WebAudio for low-latency playback (we will add a small audio manager in `engine/`).

## Integration notes for engineers 🔧
- Add art under `/assets` and update `assets/manifest.json` (we will provide a small loader to read this manifest).
- Keep art modular: each char/enemy in its own folder to simplify pruning and iteration.
- The engine currently expects simple rectangles for hitboxes; we will expand to per-frame hitboxes via an animation atlas JSON.
- For dev iteration, prefer submitting PRs that only add assets in `/assets` and include a small preview screenshot + usage notes in the PR body.

## Immediate gameplay roadmap (next tasks) 🎯
1. **Hit/attack system**: precise per-frame hitboxes, hitstop (brief freeze), and impactful knockback. (High priority)
2. **Particle & VFX**: blood splatter, sparks, and hit flashes (uses `engine/particles.ts`).
3. **Enemy AI**: state machine (Idle → Chase → Windup → Attack → Recover) with telegraphs.
4. **Boss framework**: phased healthbar, large telegraphed attacks, camera shake, and phase transitions.
5. **Sprite integration**: replace procedural rectangles with artist sprites and frame-based animations.
6. **Audio**: SFX for swing/hit/death and ambience music layers; audio manager for volume and mute.

## Testing & automation
- Add unit tests (Vitest) for engine physics and collision detection: `npm run test` (to be added).
- CI will run type checks and builds; we will add test runs once tests exist.

## How to deliver art & audio 🎁
- Preferred: open a GitHub PR adding files to `/assets` following the naming conventions.
- Alternative: upload a ZIP or share via Google Drive and I will import and add a PR.

---

### Next steps I can take immediately
- Implement **hit system + hitstop + knockback** and tune constants (fast feel-improvement).  
- Add an **asset loader** + manifest tooling so new art can be hot-loaded.  
- Add a small **debug overlay** and developer spawn controls for faster iteration.

Tell me which to prioritize first (my recommendation: Hit system & hitstop followed by Particles & VFX).