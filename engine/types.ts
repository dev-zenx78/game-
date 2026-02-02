export type Facing = 1 | -1;

export interface Hitbox {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  state: 'IDLE' | 'RUN' | 'ATTACK' | 'JUMP';
  facing: Facing;
  attackTimer: number;
  attackPower?: number;
  // optional default attack hitbox relative to player
  attackBox?: Hitbox;
}

export interface EngineEnemy {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  type: 'Husk' | 'Angel' | 'Apostle';
  vx: number;
  hurtTimer: number;
  stun?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export interface Stats {
  hp: number;
  rage: number;
  kills: number;
}
