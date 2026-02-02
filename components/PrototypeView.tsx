
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Play, RefreshCw } from 'lucide-react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const GRAVITY = 0.8;
const GROUND_Y = 380;

const PrototypeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({ hp: 100, rage: 0, kills: 0 });
  const [gameOver, setGameOver] = useState(false);

  const keysRef = useRef<{ [key: string]: boolean }>({});

  const spawnEnemy = useCallback(() => {
    if (engineRef.current) engineRef.current.spawnEnemy();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI scaling for crisp pixels
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    // Lazy import of Engine to keep dev hot reload friendly
    const { Engine } = require('../engine/engine');

    if (!engineRef.current) {
      engineRef.current = new Engine(CANVAS_WIDTH, CANVAS_HEIGHT, s => setStats(s), () => setGameOver(true));
    }

    const handleKeyDown = (e: KeyboardEvent) => (keysRef.current[e.code] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keysRef.current[e.code] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId = 0;

    const loop = () => {
      engineRef.current!.step(keysRef.current);
      engineRef.current!.draw(ctx, dpr);

      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying && !gameOver) {
      loop();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, gameOver]);

  const resetGame = () => {
      setStats({ hp: 100, rage: 0, kills: 0 });
      setGameOver(false);
      if (engineRef.current) engineRef.current.reset();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-400 p-4">
      <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-red-500 transition-colors uppercase font-cinzel text-xs tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Escape
        </button>
        <div className="flex gap-8 text-xs font-pixel">
            <div className="text-red-500">VIT: {Math.ceil(stats.hp)}%</div>
            <div className="text-orange-500">RGE: {stats.rage}%</div>
            <div className="text-white">SOULS: {stats.kills}</div>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-xl border-4 border-zinc-900 bg-zinc-950 shadow-[0_0_50px_rgba(255,0,0,0.1)]">
        {!isPlaying && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                <h2 className="text-white font-cinzel text-3xl mb-8 uppercase tracking-[0.2em]">Enter the Eclipse</h2>
                <button 
                    onClick={() => setIsPlaying(true)}
                    className="flex items-center gap-4 px-12 py-4 bg-red-900 hover:bg-red-800 text-white rounded-full transition-all group hover:scale-105"
                >
                    <Play className="fill-white" />
                    <span className="font-pixel text-sm">INITIALIZE PILOT</span>
                </button>
                <div className="mt-8 text-zinc-500 font-pixel text-[10px] space-y-2">
                    <p>WASD: MOVE / JUMP</p>
                    <p>J/SPACE: HEAVY SWING</p>
                </div>
            </div>
        )}

        {gameOver && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-md">
                <h2 className="text-white font-cinzel text-6xl mb-4 italic font-bold">YOU DIED</h2>
                <p className="text-white/60 mb-8 font-pixel text-xs">The brand claims another soul.</p>
                <button 
                    onClick={resetGame}
                    className="flex items-center gap-4 px-12 py-4 bg-white text-black hover:bg-gray-200 rounded-full transition-all"
                >
                    <RefreshCw />
                    <span className="font-pixel text-sm">RESURRECT</span>
                </button>
            </div>
        )}

        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          className="block max-w-full h-auto"
        />
        
        {/* HUD OVERLAY */}
        <div className="absolute top-4 left-4 pointer-events-none font-pixel text-[10px]">
            <div className="bg-black/50 p-2 border border-white/10 text-white/50">
                PROTOTYPE v0.1: COMBAT_DYNAMICS
            </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-xs font-mono opacity-50">
          <div>// PHYSICS: 0.8G GRAVITY</div>
          <div>// SPRITE_RES: 32x64 PX</div>
          <div>// COLLISION: AABB DETECTION</div>
      </div>
    </div>
  );
};

export default PrototypeView;
