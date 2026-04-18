import { useState, useEffect, useRef, useCallback } from 'react';
import { Point } from '../types';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (!isStarted || gameOver) return;

    if (time - lastUpdateRef.current > BASE_SPEED - Math.min(score * 2, 100)) {
      lastUpdateRef.current = time;

      setSnake(prevSnake => {
        const head = { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y };

        // Collision detection
        if (
          head.x < 0 || head.x >= GRID_SIZE || 
          head.y < 0 || head.y >= GRID_SIZE ||
          prevSnake.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    gameLoopRef.current = requestAnimationFrame(update);
  }, [direction, food, gameOver, generateFood, highScore, isStarted, score]);

  useEffect(() => {
    if (isStarted && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isStarted, gameOver, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#00f3ff' : '#00a8b1';
      ctx.shadowBlur = i === 0 ? 15 : 0;
      ctx.shadowColor = '#00f3ff';
      
      const padding = 2;
      ctx.fillRect(
        seg.x * size + padding, 
        seg.y * size + padding, 
        size - padding * 2, 
        size - padding * 2
      );
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 glass-morphism rounded-[2rem] border-neon-magenta shadow-[0_0_30px_rgba(255,0,255,0.1)]">
      <div className="flex justify-between w-full px-2 mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-magenta-400 opacity-50 font-bold">Current Score</span>
          <span className="text-3xl font-mono font-bold glow-magenta">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-magenta-400 opacity-50 font-bold">Session Best</span>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-magenta-400" />
            <span className="text-3xl font-mono font-bold glow-magenta">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative border-4 border-magenta-500/30 rounded-lg overflow-hidden p-1 bg-black">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="rounded-sm"
        />

        {!isStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <h1 className="text-4xl font-bold glow-magenta mb-8 tracking-tighter uppercase italic">Rhythm Snake</h1>
            <button 
              onClick={resetGame}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-magenta-500/10 transition-all border border-transparent hover:border-magenta-500/50"
            >
              <div className="bg-magenta-500 p-4 rounded-full shadow-[0_0_20px_rgba(255,0,255,0.5)] group-hover:scale-110 transition-transform">
                <Play size={32} fill="white" className="text-white ml-1" />
              </div>
              <span className="text-sm font-mono tracking-widest uppercase">Start Mission</span>
            </button>
            <p className="mt-8 text-xs text-white/40 font-mono">USE ARROW KEYS TO NAVIGATE</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <h2 className="text-5xl font-bold text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] mb-2 uppercase italic">Game Over</h2>
            <p className="text-magenta-400 font-mono mb-8 brightness-150">SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-8 py-3 bg-magenta-500 rounded-full font-bold hover:bg-magenta-600 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,0,255,0.4)]"
            >
              <RefreshCcw size={18} />
              REBOOT SYSTEM
            </button>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center gap-4">
        {['UP', 'LEFT', 'DOWN', 'RIGHT'].map(dir => (
          <div key={dir} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono opacity-50">
            {dir}
          </div>
        ))}
      </div>
    </div>
  );
}
