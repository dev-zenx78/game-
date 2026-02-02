export type Facing = 1 | -1;

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
