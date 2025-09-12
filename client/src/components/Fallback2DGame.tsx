import { useEffect, useRef, useState } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { useGameState } from '../lib/stores/useGameState';

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  jump = 'jump',
}

interface Player {
  x: number;
  y: number;
  velocityY: number;
  isGrounded: boolean;
  facing: number; // rotation in radians
}

interface Item {
  x: number;
  y: number;
  type: 'recyclable' | 'energy';
  collected: boolean;
}

export default function Fallback2DGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [subscribe, getState] = useKeyboardControls<Controls>();
  const { score, addScore, gamePhase } = useGameState();
  
  const playerRef = useRef<Player>({
    x: 100,
    y: 350,
    velocityY: 0,
    isGrounded: true,
    facing: 0
  });
  
  const itemsRef = useRef<Item[]>([
    { x: 200, y: 370, type: 'recyclable', collected: false },
    { x: 350, y: 370, type: 'energy', collected: false },
    { x: 500, y: 370, type: 'recyclable', collected: false },
    { x: 650, y: 370, type: 'energy', collected: false },
  ]);
  
  const cameraRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const gravity = 0.8;
    const jumpPower = -15;
    const moveSpeed = 3;
    const groundY = 370;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    function gameLoop() {
      const currentControls = getState();
      const player = playerRef.current;
      const camera = cameraRef.current;
      const items = itemsRef.current;
      
      // Update player physics
      let moved = false;
      if (currentControls.leftward) {
        player.x -= moveSpeed;
        player.facing = Math.PI; // Face left
        moved = true;
      }
      if (currentControls.rightward) {
        player.x += moveSpeed;
        player.facing = 0; // Face right
        moved = true;
      }
      if (currentControls.forward) {
        player.y -= moveSpeed * 0.5; // Move up on screen
        moved = true;
      }
      if (currentControls.backward) {
        player.y += moveSpeed * 0.5; // Move down on screen
        moved = true;
      }
      
      // Jumping
      if (currentControls.jump && player.isGrounded) {
        player.velocityY = jumpPower;
        player.isGrounded = false;
      }
      
      // Apply gravity
      player.velocityY += gravity;
      player.y += player.velocityY;
      
      // Ground collision
      if (player.y >= groundY) {
        player.y = groundY;
        player.velocityY = 0;
        player.isGrounded = true;
      }
      
      // Keep player on screen
      player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
      player.y = Math.max(20, Math.min(canvas.height - 20, player.y));
      
      // Update camera to follow player
      camera.x = Math.max(0, Math.min(400, player.x - canvas.width / 2));
      camera.y = Math.max(0, Math.min(200, player.y - canvas.height / 2));
      
      // Render
      ctx.fillStyle = '#87CEEB'; // Sky blue background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Apply camera transform
      ctx.save();
      ctx.translate(-camera.x, -camera.y);
      
      // Draw ground
      ctx.fillStyle = '#90EE90'; // Light green ground
      ctx.fillRect(-100, groundY + 20, canvas.width + 200, 100);
      
      // Draw items
      items.forEach(item => {
        if (item.collected) return;
        
        // Check collision with player
        const dx = item.x - player.x;
        const dy = item.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 25) {
          item.collected = true;
          addScore(10);
          console.log(`Collected ${item.type}! Score: ${score + 10}`);
        }
        
        // Draw item
        ctx.fillStyle = item.type === 'recyclable' ? '#4CAF50' : '#FFC107';
        ctx.beginPath();
        ctx.arc(item.x, item.y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw item label
        ctx.fillStyle = '#000';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(item.type === 'recyclable' ? '♻️' : '⚡', item.x, item.y - 20);
      });
      
      // Draw player
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.facing);
      
      // Player body
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(-15, -15, 30, 30);
      
      // Player face direction indicator
      ctx.fillStyle = '#FFF';
      ctx.fillRect(8, -5, 4, 10);
      
      ctx.restore();
      
      // Draw simple walking animation when moving
      if (moved) {
        ctx.save();
        ctx.translate(player.x, player.y + 20);
        ctx.fillStyle = '#1976D2';
        // Simple bobbing feet
        const bobOffset = Math.sin(Date.now() * 0.01) * 3;
        ctx.fillRect(-10, bobOffset, 6, 8);
        ctx.fillRect(4, -bobOffset, 6, 8);
        ctx.restore();
      }
      
      ctx.restore(); // Restore camera transform
      
      // Draw UI elements (not affected by camera)
      ctx.fillStyle = '#000';
      ctx.font = '16px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 10, 30);
      ctx.fillText(`2D Mode (WebGL Fallback)`, 10, 50);
      ctx.fillText(`Controls: WASD/Arrow Keys + J (Jump)`, 10, canvas.height - 20);
      
      animationId = requestAnimationFrame(gameLoop);
    }
    
    // Start game loop
    gameLoop();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [score, addScore, getState]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          backgroundColor: '#87CEEB'
        }}
      />
    </div>
  );
}