export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const PADDLE_WIDTH = 120;
export const PADDLE_HEIGHT = 15;
export const PADDLE_SPEED = 8;
export const PADDLE_Y = CANVAS_HEIGHT - 40;

export const BALL_RADIUS = 8;
export const INITIAL_BALL_SPEED = 5;

export const BRICK_ROWS = 5;
export const BRICK_COLS = 8;
export const BRICK_PADDING = 10;
export const BRICK_OFFSET_TOP = 60;
export const BRICK_OFFSET_LEFT = 35;
export const BRICK_WIDTH = (CANVAS_WIDTH - (BRICK_OFFSET_LEFT * 2) - (BRICK_COLS - 1) * BRICK_PADDING) / BRICK_COLS;
export const BRICK_HEIGHT = 20;

export const COLORS = {
  background: '#020617',
  paddle: '#38bdf8',
  ball: '#f8fafc',
  bricks: [
    '#f43f5e', // Rose
    '#fb923c', // Orange
    '#fbbf24', // Amber
    '#4ade80', // Green
    '#38bdf8', // Sky
  ],
  text: '#f8fafc',
  label: '#94a3b8',
  primary: '#38bdf8',
  accent: '#fbbf24',
  ui: '#1e293b',
  containerBg: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
};
