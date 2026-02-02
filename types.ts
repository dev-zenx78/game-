
export enum GameState {
  MENU = 'MENU',
  GDD = 'GDD',
  PROTOTYPE = 'PROTOTYPE',
  CONCEPTS = 'CONCEPTS'
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  rage: number;
  maxRage: number;
  level: number;
  exp: number;
}

export interface Dialogue {
  character: string;
  characterColor: string;
  text: string;
}

export interface Enemy {
  id?: string;
  x: number;
  y: number;
  hp: number;
  maxHp?: number;
  type: 'Apostle' | 'Angel' | 'Husk';
  state?: 'IDLE' | 'ATTACK' | 'HURT';
}

export interface EngineEnemy extends Enemy {
  width: number;
  height: number;
  vx: number;
  hurtTimer: number;
} 
