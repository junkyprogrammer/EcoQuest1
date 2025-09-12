import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Controls } from "../App";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function Player() {
  // Load character model
  const { scene: characterModel } = useGLTF('/models/player_character.glb');
  const model = useMemo(() => {
    const clonedModel = characterModel.clone();
    clonedModel.position.set(0, 0, 0);
    clonedModel.rotation.y = 0;
    clonedModel.scale.setScalar(1);
    
    console.log('✅ Character loaded: player_character.glb');
    console.log('📍 Model positioned at origin for optimal visibility');
    
    return clonedModel;
  }, [characterModel]);
  
  const playerRef = useRef<THREE.Group>(null);
  const [subscribe, get] = useKeyboardControls<Controls>();
  const { isPaused } = useGameState();
  const { playHit } = useAudio();
  
  // Simple movement state
  const velocity = useRef(new THREE.Vector3());
  const [isMoving, setIsMoving] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'walking' | 'running' | 'jumping'>('idle');
  
  // Movement constants - simple and clear
  const moveSpeed = 8;
  const runSpeed = 12;
  const jumpForce = 12;
  const gravity = 25;
  const isOnGround = useRef(true);
  
  // Character positioning - position character well above ground level for maximum visibility
  const characterScale = 2.5; // Increased scale for better visibility
  const characterHeight = characterScale * 1.0; // Approximate height based on scale
  const groundLevel = 4.0; // Character positioned significantly above ground level for optimal visibility

  // Keyboard input detection with clear logging
  useEffect(() => {
    console.log('🎮 Setting up keyboard control listeners...');
    
    // Subscribe to all movement controls
    const unsubscribeForward = subscribe(
      (state) => state.forward,
      (pressed) => console.log(`🔥 FORWARD KEY: ${pressed ? 'PRESSED' : 'RELEASED'}`)
    );
    
    const unsubscribeBackward = subscribe(
      (state) => state.backward,
      (pressed) => console.log(`🔥 BACKWARD KEY: ${pressed ? 'PRESSED' : 'RELEASED'}`)
    );
    
    const unsubscribeLeft = subscribe(
      (state) => state.leftward,
      (pressed) => console.log(`🔥 LEFT KEY: ${pressed ? 'PRESSED' : 'RELEASED'}`)
    );
    
    const unsubscribeRight = subscribe(
      (state) => state.rightward,
      (pressed) => console.log(`🔥 RIGHT KEY: ${pressed ? 'PRESSED' : 'RELEASED'}`)
    );
    
    const unsubscribeJump = subscribe(
      (state) => state.jump,
      (pressed) => console.log(`🔥 JUMP KEY: ${pressed ? 'PRESSED' : 'RELEASED'}`)
    );

    console.log('✅ All keyboard listeners active');

    return () => {
      unsubscribeForward();
      unsubscribeBackward();
      unsubscribeLeft();
      unsubscribeRight();
      unsubscribeJump();
    };
  }, [subscribe]);

  // Simple movement system
  useFrame((state, delta) => {
    if (!playerRef.current) return;
    
    // Only pause for game menu, but allow movement testing in all phases
    if (isPaused) {
      console.log('🚫 Movement paused - game paused');
      return;
    }
    
    const controls = get();
    const player = playerRef.current;
    
    // CLEAR INPUT DETECTION - Log every frame when keys are pressed
    const inputVector = new THREE.Vector3();
    let playerIsMoving = false;
    
    if (controls.forward) {
      inputVector.z -= 1;
      playerIsMoving = true;
      console.log('🎮 W - Moving FORWARD');
    }
    if (controls.backward) {
      inputVector.z += 1;
      playerIsMoving = true;
      console.log('🎮 S - Moving BACKWARD');
    }
    if (controls.leftward) {
      inputVector.x -= 1;
      playerIsMoving = true;
      console.log('🎮 A - Moving LEFT');
    }
    if (controls.rightward) {
      inputVector.x += 1;
      playerIsMoving = true;
      console.log('🎮 D - Moving RIGHT');
    }
    
    // Jump input
    if (controls.jump && isOnGround.current) {
      velocity.current.y = jumpForce;
      isOnGround.current = false;
      setAnimationState('jumping');
      playHit();
      console.log('🎮 SPACE - JUMPING!');
    }
    
    // Normalize input for consistent movement speed
    if (inputVector.length() > 0) {
      inputVector.normalize();
    }
    
    // Calculate movement speed
    const currentSpeed = controls.sprint ? runSpeed : moveSpeed;
    const speedMode = controls.sprint ? 'RUNNING' : 'WALKING';
    
    // Apply horizontal movement
    if (playerIsMoving) {
      const movement = inputVector.clone().multiplyScalar(currentSpeed * delta);
      const oldPosition = player.position.clone();
      player.position.add(movement);
      
      // Log movement with clear position tracking
      console.log(`🏃 ${speedMode}: (${player.position.x.toFixed(2)}, ${player.position.z.toFixed(2)}) Speed: ${currentSpeed}u/s`);
      
      // Update animation state
      setAnimationState(controls.sprint ? 'running' : 'walking');
      setIsMoving(true);
    } else {
      setAnimationState('idle');
      setIsMoving(false);
    }
    
    // Apply gravity
    velocity.current.y -= gravity * delta;
    player.position.y += velocity.current.y * delta;
    
    // Ground collision - keep character above ground level
    if (player.position.y <= groundLevel) {
      player.position.y = groundLevel;
      velocity.current.y = 0;
      isOnGround.current = true;
      
      console.log(`🏃 Character elevated at Y: ${groundLevel.toFixed(2)} (significantly above terrain surface for optimal visibility)`);
      
      // Return to idle/walking when landing
      if (animationState === 'jumping') {
        setAnimationState(playerIsMoving ? 'walking' : 'idle');
      }
    }
    
    // Simple boundary system to keep character visible
    const boundary = 15;
    if (Math.abs(player.position.x) > boundary) {
      player.position.x = Math.sign(player.position.x) * boundary;
      console.log(`🚧 Hit X boundary at ${player.position.x}`);
    }
    if (Math.abs(player.position.z) > boundary) {
      player.position.z = Math.sign(player.position.z) * boundary;
      console.log(`🚧 Hit Z boundary at ${player.position.z}`);
    }
    
    // Camera follows player smoothly
    const camera = state.camera;
    const targetX = player.position.x;
    const targetY = player.position.y + 8;
    const targetZ = player.position.z + 12;
    
    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 5);
    camera.lookAt(player.position);
  });

  // Initialize character above ground level as requested
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(0, groundLevel, 0);
      console.log(`🎯 Character initialized at elevated position (0,${groundLevel.toFixed(2)},0)`);
      console.log('👟 Character positioned significantly above ground level for optimal visibility');
      console.log('📷 Camera setup for elevated viewing of character');
      console.log(`📏 Character scale: ${characterScale}, Height: ${characterHeight.toFixed(2)}, Elevated ground level: ${groundLevel.toFixed(2)} (${groundLevel.toFixed(1)}x higher than before)`);
    }
  }, [groundLevel, characterHeight, characterScale]);

  // Animation state logging
  useEffect(() => {
    console.log(`🎭 Animation state: ${animationState}`);
  }, [animationState]);

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      <primitive 
        object={model} 
        scale={[characterScale, characterScale, characterScale]}
        position={[0, -characterHeight/2, 0]}
        castShadow 
        receiveShadow
      />
      
      {/* Debug helpers - show player position and ground level */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshBasicMaterial color="red" transparent opacity={0.8} />
      </mesh>
      
      {/* Ground level indicator - shows where terrain surface is (Y=0) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshBasicMaterial color="yellow" transparent opacity={0.5} />
      </mesh>
      
      {/* Character feet position indicator */}
      <mesh position={[0, -characterHeight/2, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshBasicMaterial color="green" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}