export interface Point {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

export interface Ball extends Point, Velocity {
  radius: number;
}

export interface Paddle extends Point {
  width: number;
  height: number;
}

export interface Brick extends Point {
  width: number;
  height: number;
  status: number; // 0: destroyed, 1+: health
  color: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  WON = 'WON',
  GAMEOVER = 'GAMEOVER',
}

export interface GameState {
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[];
  score: number;
  lives: number;
  status: GameStatus;
}
