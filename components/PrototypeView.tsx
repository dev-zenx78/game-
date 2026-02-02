
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Play, RefreshCw } from 'lucide-react';
import type { EngineEnemy } from '../types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const GRAVITY = 0.8;
const GROUND_Y = 380;

const PrototypeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({ hp: 100, rage: 0, kills: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Use refs for engine state to avoid re-renders during loop
  const playerRef = useRef({
    x: 100,
    y: GROUND_Y,
    width: 40,
    height: 60,
    vx: 0,
    vy: 0,
    isGrounded: true,
    state: 'IDLE', // IDLE, RUN, ATTACK, JUMP
    facing: 1, // 1 for right, -1 for left
    attackTimer: 0,
  });

  const enemiesRef = useRef<EngineEnemy[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const spawnEnemy = useCallback(() => {
    enemiesRef.current.push({
      x: CANVAS_WIDTH + 100,
      y: GROUND_Y,
      width: 45,
      height: 65,
      hp: 50,
      type: Math.random() > 0.5 ? 'Husk' : 'Angel',
      vx: -(1 + Math.random() * 2),
      hurtTimer: 0,
    });
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => (keysRef.current[e.code] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keysRef.current[e.code] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;

    const update = () => {
      const p = playerRef.current;

      // Handle Input
      if (p.attackTimer === 0) {
        if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
          p.vx = -5;
          p.facing = -1;
          p.state = 'RUN';
        } else if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
          p.vx = 5;
          p.facing = 1;
          p.state = 'RUN';
        } else {
          p.vx = 0;
          p.state = 'IDLE';
        }

        if ((keysRef.current['Space'] || keysRef.current['ArrowUp'] || keysRef.current['KeyW']) && p.isGrounded) {
          p.vy = -15;
          p.isGrounded = false;
        }

        if (keysRef.current['KeyJ'] || keysRef.current['KeyZ']) {
          p.attackTimer = 25; // Attack frames
          p.vx = 0;
        }
      } else {
        p.state = 'ATTACK';
        p.attackTimer--;
      }

      // Gravity & Physics
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;

      if (p.y > GROUND_Y) {
        p.y = GROUND_Y;
        p.vy = 0;
        p.isGrounded = true;
      }
      
      // Keep in bounds
      p.x = Math.max(0, Math.min(p.x, CANVAS_WIDTH - p.width));

      // Enemies Update
      enemiesRef.current.forEach((e, idx) => {
        if (e.hurtTimer > 0) {
            e.hurtTimer--;
            e.x += 1; // Knockback
        } else {
            e.x += e.vx;
        }

        // Collision detection with attack
        if (p.state === 'ATTACK' && p.attackTimer === 15) {
            const attackBox = {
                x: p.facing === 1 ? p.x + p.width : p.x - 80,
                y: p.y - 20,
                width: 80,
                height: p.height + 40
            };
            
            if (e.x < attackBox.x + attackBox.width && e.x + e.width > attackBox.x &&
                e.y < attackBox.y + attackBox.height && e.y + e.height > attackBox.y) {
                e.hp -= 25;
                e.hurtTimer = 10;
                setStats(s => ({ ...s, rage: Math.min(100, s.rage + 5) }));
            }
        }

        // Collision with player
        if (e.x < p.x + p.width && e.x + e.width > p.x && e.y < p.y + p.height && e.y + e.height > p.y) {
           setStats(s => {
               if (s.hp <= 0) {
                   setGameOver(true);
                   return s;
               }
               return { ...s, hp: Math.max(0, s.hp - 0.2) };
           });
        }
      });

      // Cleanup dead enemies
      const aliveEnemies = enemiesRef.current.filter(e => e.hp > 0 && e.x > -100);
      if (aliveEnemies.length < enemiesRef.current.length) {
          setStats(s => ({ ...s, kills: s.kills + (enemiesRef.current.length - aliveEnemies.length) }));
      }
      enemiesRef.current = aliveEnemies;

      // Spawn new enemies
      if (Math.random() < 0.01 && enemiesRef.current.length < 5) {
          spawnEnemy();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Distant mountains
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(150, 150);
      ctx.lineTo(300, GROUND_Y);
      ctx.fill();

      // Ground
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, GROUND_Y + 50, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
      ctx.strokeStyle = '#400';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 50);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 50);
      ctx.stroke();

      const p = playerRef.current;

      // Draw Enemies
      enemiesRef.current.forEach(e => {
        ctx.fillStyle = e.hurtTimer > 0 ? '#fff' : (e.type === 'Husk' ? '#444' : '#600');
        ctx.fillRect(e.x, e.y - 10, e.width, e.height);
        
        // Enemy Healthbar
        ctx.fillStyle = '#222';
        ctx.fillRect(e.x, e.y - 25, e.width, 5);
        ctx.fillStyle = '#f00';
        ctx.fillRect(e.x, e.y - 25, e.width * (e.hp / 50), 5);
      });

      // Draw Player
      ctx.save();
      ctx.translate(p.x + p.width/2, p.y + p.height/2);
      if (p.facing === -1) ctx.scale(-1, 1);
      
      // Body (The Branded Warrior)
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(-p.width/2, -p.height/2, p.width, p.height);
      
      // Cloak
      ctx.fillStyle = '#300';
      ctx.fillRect(-p.width/2 - 5, -p.height/2 + 5, p.width + 5, p.height - 5);

      // Sword (The Slab)
      if (p.state === 'ATTACK') {
          ctx.rotate((p.attackTimer / 25) * Math.PI - Math.PI/2);
          ctx.fillStyle = '#555';
          ctx.fillRect(0, -100, 15, 120);
      } else {
          ctx.fillStyle = '#555';
          ctx.fillRect(5, -20, 10, 80); // Sheathed/Idle
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(() => {
        update();
        draw();
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, gameOver, spawnEnemy]);

  const resetGame = () => {
      setStats({ hp: 100, rage: 0, kills: 0 });
      setGameOver(false);
      playerRef.current.x = 100;
      enemiesRef.current = [];
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
