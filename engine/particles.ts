import type { Particle } from './types';

export function spawnHitParticles(x: number, y: number, count = 8) {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2;
    out.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 20 + Math.floor(Math.random() * 20),
      size: 1 + Math.random() * 2,
      color: '#b71c1c',
    });
  }
  return out;
}

export function updateParticles(particles: Particle[]) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += 0.15; // gravity
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], dpr = 1) {
  ctx.save();
  ctx.scale(1 / dpr, 1 / dpr); // because canvas is scaled by dpr elsewhere
  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x * dpr, p.y * dpr, p.size * dpr, p.size * dpr);
  }
  ctx.restore();
}
