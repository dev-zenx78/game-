import type { EngineEnemy, Player, Particle, Stats, Facing } from './types';
import { spawnHitParticles, updateParticles } from './particles';

const GRAVITY = 0.8;
const GROUND_Y = 380;
const CANVAS_WIDTH = 800;

// Impact tuning
const HITSTOP_FRAMES = 8;
const KNOCKBACK = 3;

export type StatsCallback = (s: Stats) => void;
export type GameOverCallback = () => void;

export class Engine {
  player: Player;
  enemies: EngineEnemy[] = [];
  particles: Particle[] = [];
  stats: Stats = { hp: 100, rage: 0, kills: 0 };
  gameOver = false;
  onStats?: StatsCallback;
  onGameOver?: GameOverCallback;
  width: number;
  height: number;

  // Impact/feedback state
  hitStopTimer = 0;
  flashTimer = 0;
  shake = 0;

  constructor(width = CANVAS_WIDTH, height = 450, onStats?: StatsCallback, onGameOver?: GameOverCallback) {
    this.width = width;
    this.height = height;
    this.onStats = onStats;
    this.onGameOver = onGameOver;

    this.player = this.createPlayer();
  }

  createPlayer(): Player {
    return {
      x: 100,
      y: GROUND_Y,
      width: 40,
      height: 60,
      vx: 0,
      vy: 0,
      isGrounded: true,
      state: 'IDLE',
      facing: 1 as Facing,
      attackTimer: 0,
    };
  }

  reset() {
    this.player = this.createPlayer();
    this.enemies = [];
    this.particles = [];
    this.stats = { hp: 100, rage: 0, kills: 0 };
    this.gameOver = false;
    this.notifyStats();
  }

  notifyStats() {
    if (this.onStats) this.onStats({ ...this.stats });
  }

  spawnEnemy() {
    this.enemies.push({
      x: this.width + 100,
      y: GROUND_Y,
      width: 45,
      height: 65,
      hp: 50,
      type: Math.random() > 0.6 ? 'Angel' : 'Husk',
      vx: -(1 + Math.random() * 2),
      hurtTimer: 0,
    });
  }

  step(keys: Record<string, boolean>) {
    if (this.gameOver) return;

    // If hitstop is active, only advance particles and timer for dramatic impact
    if (this.hitStopTimer > 0) {
      updateParticles(this.particles);
      this.hitStopTimer--;
      if (this.flashTimer > 0) this.flashTimer--;
      // decay shake
      this.shake *= 0.7;
      return;
    }

    const p = this.player;

    // Input
    if (p.attackTimer === 0) {
      if (keys['ArrowLeft'] || keys['KeyA']) {
        p.vx = -5;
        p.facing = -1;
        p.state = 'RUN';
      } else if (keys['ArrowRight'] || keys['KeyD']) {
        p.vx = 5;
        p.facing = 1;
        p.state = 'RUN';
      } else {
        p.vx = 0;
        p.state = 'IDLE';
      }

      if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && p.isGrounded) {
        p.vy = -15;
        p.isGrounded = false;
      }

      if (keys['KeyJ'] || keys['KeyZ']) {
        p.attackTimer = 25;
        p.vx = 0;
      }
    } else {
      p.state = 'ATTACK';
      p.attackTimer--;
    }

    // Physics
    p.vy += GRAVITY;
    p.x += p.vx;
    p.y += p.vy;
    if (p.y > GROUND_Y) {
      p.y = GROUND_Y;
      p.vy = 0;
      p.isGrounded = true;
    }
    p.x = Math.max(0, Math.min(p.x, this.width - p.width));

    // Enemies
    for (const e of this.enemies) {
      if (e.hurtTimer > 0) {
        e.hurtTimer--;
        e.x += 1;
      } else {
        e.x += e.vx;
      }

      if (p.state === 'ATTACK' && p.attackTimer === 15) {
        const attackBox = {
          x: p.facing === 1 ? p.x + p.width : p.x - 80,
          y: p.y - 20,
          width: 80,
          height: p.height + 40,
        };
        if (e.x < attackBox.x + attackBox.width && e.x + e.width > attackBox.x && e.y < attackBox.y + attackBox.height && e.y + e.height > attackBox.y) {
          e.hp -= 25;
          e.hurtTimer = 10;
          // Knockback impulse
          e.vx = (p.facing === 1 ? KNOCKBACK : -KNOCKBACK);
          // Impact feedback
          this.hitStopTimer = HITSTOP_FRAMES;
          this.flashTimer = HITSTOP_FRAMES;
          this.shake = 8;

          this.particles.push(...spawnHitParticles(e.x + e.width / 2, e.y + e.height / 2));
          this.stats.rage = Math.min(100, this.stats.rage + 5);
          this.notifyStats();
        }
      }

      // Player collision
      if (e.x < p.x + p.width && e.x + e.width > p.x && e.y < p.y + p.height && e.y + e.height > p.y) {
        if (this.stats.hp <= 0) {
          this.gameOver = true;
          if (this.onGameOver) this.onGameOver();
        } else {
          this.stats.hp = Math.max(0, this.stats.hp - 0.2);
          this.notifyStats();
        }
      }
    }

    // Cleanup & kills
    const alive = this.enemies.filter(e => e.hp > 0 && e.x > -100);
    if (alive.length < this.enemies.length) {
      this.stats.kills += this.enemies.length - alive.length;
      this.notifyStats();
    }
    this.enemies = alive;

    // Spawn
    if (Math.random() < 0.01 && this.enemies.length < 5) this.spawnEnemy();

    // Particles update
    updateParticles(this.particles);
  }

  draw(ctx: CanvasRenderingContext2D, dpr = 1) {
    // Clear
    ctx.clearRect(0, 0, this.width, this.height);

    // Apply small camera shake transform
    ctx.save();
    if (this.shake > 0) {
      const sx = (Math.random() * 2 - 1) * this.shake;
      const sy = (Math.random() * 2 - 1) * this.shake;
      ctx.translate(sx, sy);
    }

    // Background (parallax simple)
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, this.width, this.height);

    // Distant mountains (parallax layer)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(150, 150);
    ctx.lineTo(300, GROUND_Y);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, GROUND_Y + 50, this.width, this.height - GROUND_Y);
    ctx.strokeStyle = '#400';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 50);
    ctx.lineTo(this.width, GROUND_Y + 50);
    ctx.stroke();

    // Enemies
    for (const e of this.enemies) {
      ctx.fillStyle = e.hurtTimer > 0 ? '#fff' : (e.type === 'Husk' ? '#444' : '#600');
      ctx.fillRect(e.x, e.y - 10, e.width, e.height);
      // HP bar
      ctx.fillStyle = '#222';
      ctx.fillRect(e.x, e.y - 25, e.width, 5);
      ctx.fillStyle = '#f00';
      ctx.fillRect(e.x, e.y - 25, e.width * (e.hp / 50), 5);
    }

    // Player draw
    const p = this.player;
    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
    if (p.facing === -1) ctx.scale(-1, 1);

    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
    ctx.fillStyle = '#300';
    ctx.fillRect(-p.width / 2 - 5, -p.height / 2 + 5, p.width + 5, p.height - 5);

    if (p.state === 'ATTACK') {
      ctx.rotate((p.attackTimer / 25) * Math.PI - Math.PI / 2);
      ctx.fillStyle = '#555';
      ctx.fillRect(0, -100, 15, 120);
    } else {
      ctx.fillStyle = '#555';
      ctx.fillRect(5, -20, 10, 80);
    }

    ctx.restore();

    // Particles (draw small rectangles)
    ctx.save();
    for (const pt of this.particles) {
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    }
    ctx.restore();

    // Flash overlay for hits
    if (this.flashTimer > 0) {
      ctx.fillStyle = 'rgba(255,80,80,0.12)';
      ctx.fillRect(0, 0, this.width, this.height);
    }

    ctx.restore();
  }
}
