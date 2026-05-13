import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from './constants';
import { GameState, GameStatus } from './types';

export const draw = (ctx: CanvasRenderingContext2D, state: GameState) => {
  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Background (optional if handled by CSS, but good for completeness)
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw Bricks
  state.bricks.forEach(brick => {
    if (brick.status === 0) return;

    // Outer brick
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

    // Inner highlight for 3D look
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(brick.x, brick.y, brick.width, 2);
    ctx.fillRect(brick.x, brick.y, 2, brick.height);

    // Inner shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(brick.x, brick.y + brick.height - 2, brick.width, 2);
    ctx.fillRect(brick.x + brick.width - 2, brick.y, 2, brick.height);
  });

  // Draw Paddle
  ctx.fillStyle = COLORS.paddle;
  ctx.beginPath();
  ctx.roundRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height, 5);
  ctx.fill();
  
  // Highlighting the paddle
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw Ball
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Ball glow
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(248, 250, 252, 0.5)';
  ctx.fill();
  ctx.shadowBlur = 0; // Reset for others

  // Draw Overlay based on status
  if (state.status !== GameStatus.PLAYING) {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 32px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let message = '';
    let subMessage = 'Click or Press Space to Start';

    switch (state.status) {
      case GameStatus.IDLE:
        message = 'NEON BREAK';
        break;
      case GameStatus.PAUSED:
        message = 'PAUSED';
        subMessage = 'Press P to Resume';
        break;
      case GameStatus.GAMEOVER:
        message = 'GAME OVER';
        subMessage = `Score: ${state.score} - Click to Retry`;
        break;
      case GameStatus.WON:
        message = 'YOU WON!';
        subMessage = `Score: ${state.score} - Click to Play Again`;
        break;
    }

    ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(subMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  }
};
