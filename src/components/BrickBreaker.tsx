import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Heart, Play, Pause, RotateCcw } from 'lucide-react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../game/constants';
import { GameState, GameStatus } from '../game/types';
import { createInitialState, updateBall, movePaddle } from '../game/engine';
import { draw } from '../game/renderer';
import { useRequestAnimationFrame } from '../hooks/useRequestAnimationFrame';

export const BrickBreaker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>(createInitialState());
  const [uiState, setUiState] = useState<{ score: number; lives: number; status: GameStatus }>({
    score: 0,
    lives: 3,
    status: GameStatus.IDLE,
  });

  const updateUI = useCallback(() => {
    setUiState({
      score: gameStateRef.current.score,
      lives: gameStateRef.current.lives,
      status: gameStateRef.current.status,
    });
  }, []);

  // Controls
  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    gameStateRef.current = movePaddle(gameStateRef.current, mouseX);
  };

  const handleClick = () => {
    const { status } = gameStateRef.current;
    if (status === GameStatus.IDLE || status === GameStatus.GAMEOVER || status === GameStatus.WON) {
      gameStateRef.current = {
        ...createInitialState(),
        status: GameStatus.PLAYING,
      };
      updateUI();
    } else if (status === GameStatus.PAUSED) {
      gameStateRef.current.status = GameStatus.PLAYING;
      updateUI();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      handleClick();
    }
    if (e.code === 'KeyP') {
      if (gameStateRef.current.status === GameStatus.PLAYING) {
        gameStateRef.current.status = GameStatus.PAUSED;
      } else if (gameStateRef.current.status === GameStatus.PAUSED) {
        gameStateRef.current.status = GameStatus.PLAYING;
      }
      updateUI();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game Loop
  useRequestAnimationFrame(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Logic update
    if (gameStateRef.current.status === GameStatus.PLAYING) {
      const prevState = gameStateRef.current;
      gameStateRef.current = updateBall(gameStateRef.current);
      
      // Update UI only when status, lives, or score change significantly to avoid React overhead
      if (
        gameStateRef.current.status !== prevState.status || 
        gameStateRef.current.lives !== prevState.lives ||
        gameStateRef.current.score !== prevState.score
      ) {
        updateUI();
      }
    }

    // Rendering
    draw(ctx, gameStateRef.current);
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans overflow-hidden" 
         style={{ background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)' }}>
      
      <div className="flex flex-col gap-6 w-[800px]">
        {/* Header Section */}
        <header className="grid grid-cols-[1fr_auto_1fr] items-end w-full border-b border-white/10 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#94a3b8]">Score</span>
            <span className="text-2xl font-bold text-[#38bdf8] tabular-nums drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              {uiState.score.toString().padStart(5, '0')}
            </span>
          </div>

          <h1 className="text-3xl font-black uppercase tracking-wider text-white">NEON BREAK</h1>

          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#94a3b8]">Lives</span>
            <span className="text-2xl font-bold text-[#f43f5e] tracking-tighter">
              {'❤'.repeat(uiState.lives)}
            </span>
          </div>
        </header>

        {/* Main Canvas Area */}
        <motion.div 
          layoutId="game-container"
          className="relative bg-[#020617] border-2 border-[#1e293b] rounded shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          onMouseMove={handleMouseMove}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleClick}
            className="cursor-none block"
            style={{ width: '100%', height: 'auto' }}
          />
        </motion.div>

        {/* Footer Section */}
        <footer className="flex justify-between items-center pt-4 border-t border-white/10">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-[#1e293b] rounded text-[#cbd5e1] font-bold border-b-2 border-[#0f172a]">←</kbd>
                <kbd className="px-2 py-1 bg-[#1e293b] rounded text-[#cbd5e1] font-bold border-b-2 border-[#0f172a]">→</kbd>
              </div>
              <span className="uppercase tracking-widest text-[10px]">Move Paddle</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <kbd className="px-2 py-1 bg-[#1e293b] rounded text-[#cbd5e1] font-bold border-b-2 border-[#0f172a]">SPACE</kbd>
              <span className="uppercase tracking-widest text-[10px]">Launch Ball</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#fbbf24]">
              {uiState.status === GameStatus.PLAYING ? 'In Progress' : 
               uiState.status === GameStatus.PAUSED ? 'Paused' : 
               uiState.status === GameStatus.GAMEOVER ? 'Game Over' : 
               uiState.status === GameStatus.WON ? 'Winner!' : 'Game Ready'}
            </span>
            
            <div className="flex gap-2">
              <button 
                onClick={handleClick}
                className="p-1.5 hover:bg-white/5 rounded transition-colors text-[#94a3b8]"
              >
                {uiState.status === GameStatus.PLAYING ? <Pause size={18} /> : <Play size={18} />}
              </button>
              
              <button 
                onClick={() => {
                  gameStateRef.current = createInitialState();
                  updateUI();
                }}
                className="p-1.5 hover:bg-white/5 rounded transition-colors text-[#94a3b8]"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
