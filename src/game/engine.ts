import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  PADDLE_WIDTH, 
  PADDLE_HEIGHT, 
  PADDLE_Y, 
  BALL_RADIUS, 
  INITIAL_BALL_SPEED, 
  BRICK_ROWS, 
  BRICK_COLS, 
  BRICK_WIDTH, 
  BRICK_HEIGHT, 
  BRICK_PADDING, 
  BRICK_OFFSET_TOP, 
  BRICK_OFFSET_LEFT,
  COLORS
} from './constants';
import { GameState, GameStatus, Brick, Ball, Paddle } from './types';

export const createInitialState = (): GameState => {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
        y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        status: 1,
        color: COLORS.bricks[r % COLORS.bricks.length],
      });
    }
  }

  return {
    ball: {
      x: CANVAS_WIDTH / 2,
      y: PADDLE_Y - BALL_RADIUS,
      dx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      dy: -INITIAL_BALL_SPEED,
      radius: BALL_RADIUS,
    },
    paddle: {
      x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
      y: PADDLE_Y,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    bricks,
    score: 0,
    lives: 3,
    status: GameStatus.IDLE,
  };
};

export const updateBall = (state: GameState): GameState => {
  if (state.status !== GameStatus.PLAYING) return state;

  let { ball, paddle, bricks, score, lives } = state;
  let status: GameStatus = state.status;
  let newBall = { ...ball, x: ball.x + ball.dx, y: ball.y + ball.dy };

  // Wall collision (Left/Right)
  if (newBall.x + newBall.radius > CANVAS_WIDTH || newBall.x - newBall.radius < 0) {
    newBall.dx = -newBall.dx;
  }

  // Wall collision (Top)
  if (newBall.y - newBall.radius < 0) {
    newBall.dy = -newBall.dy;
  }

  // Paddle collision
  if (
    newBall.y + newBall.radius > paddle.y &&
    newBall.y - newBall.radius < paddle.y + paddle.height &&
    newBall.x > paddle.x &&
    newBall.x < paddle.x + paddle.width
  ) {
    // Determine where it hit the paddle to change angle
    const hitPoint = (newBall.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    const angle = hitPoint * (Math.PI / 3); // Max 60 degrees
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    
    newBall.dx = speed * Math.sin(angle);
    newBall.dy = -speed * Math.cos(angle);
    
    // Move ball out of paddle to prevent sticking
    newBall.y = paddle.y - newBall.radius;
  }

  // Brick collision
  let hitBrick = false;
  const newBricks = bricks.map(brick => {
    if (brick.status === 0) return brick;

    if (
      newBall.x + newBall.radius > brick.x &&
      newBall.x - newBall.radius < brick.x + brick.width &&
      newBall.y + newBall.radius > brick.y &&
      newBall.y - newBall.radius < brick.y + brick.height
    ) {
      if (!hitBrick) {
        newBall.dy = -newBall.dy;
        score += 10;
        hitBrick = true;
        return { ...brick, status: 0 };
      }
    }
    return brick;
  });

  // Bottom boundary (Life loss)
  if (newBall.y + newBall.radius > CANVAS_HEIGHT) {
    lives -= 1;
    if (lives <= 0) {
      status = GameStatus.GAMEOVER;
    } else {
      // Reset ball position
      newBall = {
        ...ball,
        x: paddle.x + paddle.width / 2,
        y: paddle.y - ball.radius,
        dx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        dy: -INITIAL_BALL_SPEED,
      };
    }
  }

  // Win condition
  if (newBricks.every(b => b.status === 0)) {
    status = GameStatus.WON;
  }

  return {
    ...state,
    ball: newBall,
    bricks: newBricks,
    score,
    lives,
    status
  };
};

export const movePaddle = (state: GameState, mouseX: number): GameState => {
  const newX = Math.max(0, Math.min(CANVAS_WIDTH - state.paddle.width, mouseX - state.paddle.width / 2));
  return {
    ...state,
    paddle: {
      ...state.paddle,
      x: newX,
    }
  };
};
