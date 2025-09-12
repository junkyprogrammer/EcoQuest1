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
  
  // Enhanced movement state
  const [isMoving, setIsMoving] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'walking' | 'running' | 'jumping'>('idle');
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const jumpAnimationTime = useRef(0);
  const runningEffectTime = useRef(0);
  const walkingTime = useRef(0);
  const [isJumping, setIsJumping] = useState(false);
  
  // Enhanced movement constants
  const moveSpeed = 8;
  const runSpeed = 12;
  const rotationSpeed = 8; // Speed of character rotation
  const jumpAnimationDuration = 1.0; // Extended duration for more dramatic jump
  const runningEffectIntensity = 1.2; // Running visual effect intensity
  
  // Minecraft-like walking animation constants
  const walkingBobSpeed = 6; // Speed of walking bob animation
  const walkingBobIntensity = 0.2; // How much the character bobs up/down
  const walkingSwayIntensity = 0.1; // Arm/leg sway simulation
  const walkingTiltIntensity = 0.08; // Character tilting during movement
  const runningBobSpeed = 10; // Faster bob for running
  const runningBobIntensity = 0.35; // More intense bob for running
  
  // Enhanced jump effects constants
  const jumpScaleIntensity = 0.8; // More dramatic scale changes
  const jumpRotationIntensity = 0.3; // Enhanced rotation during jump
  const jumpGlowIntensity = 1.5; // Visual glow effect during jump
  
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
    
    // ENHANCED DRAMATIC JUMP INPUT - Visual effects only, NO Y position changes
    if (controls.jump && !isJumping) {
      setIsJumping(true);
      jumpAnimationTime.current = 0;
      setAnimationState('jumping');
      playHit();
      console.log('🚀 SPACE - DRAMATIC JUMPING! (Enhanced visual effects - Y stays at 4.0)');
    }
    
    // Normalize input for consistent movement speed
    if (inputVector.length() > 0) {
      inputVector.normalize();
      
      // ENHANCED DIRECTIONAL ROTATION - Calculate target rotation based on movement direction
      targetRotation.current = Math.atan2(inputVector.x, inputVector.z);
      console.log(`🧭 Movement direction: ${(targetRotation.current * 180 / Math.PI).toFixed(1)}°`);
    }
    
    // Calculate movement speed
    const currentSpeed = controls.sprint ? runSpeed : moveSpeed;
    const speedMode = controls.sprint ? 'RUNNING' : 'WALKING';
    
    // Apply horizontal movement with enhanced effects
    if (playerIsMoving) {
      const movement = inputVector.clone().multiplyScalar(currentSpeed * delta);
      
      // Apply movement but keep Y locked at 4.0
      const newX = player.position.x + movement.x;
      const newZ = player.position.z + movement.z;
      player.position.set(newX, 4.0, newZ); // CRITICAL: Y always stays at 4.0
      
      // Update walking/running animation timers
      if (controls.sprint) {
        runningEffectTime.current += delta * runningBobSpeed;
        console.log(`🏃‍♂️ MINECRAFT RUNNING: (${player.position.x.toFixed(2)}, 4.0, ${player.position.z.toFixed(2)}) Speed: ${currentSpeed}u/s - Bob effects active!`);
      } else {
        walkingTime.current += delta * walkingBobSpeed;
        console.log(`🚶 MINECRAFT WALKING: (${player.position.x.toFixed(2)}, 4.0, ${player.position.z.toFixed(2)}) Speed: ${currentSpeed}u/s - Bob effects active!`);
      }
      
      // Update animation state (only if not jumping)
      if (!isJumping) {
        setAnimationState(controls.sprint ? 'running' : 'walking');
      }
      setIsMoving(true);
    } else {
      // Only change to idle if not jumping
      if (!isJumping) {
        setAnimationState('idle');
      }
      setIsMoving(false);
      runningEffectTime.current = 0;
      walkingTime.current = 0;
    }
    
    // ENHANCED ROTATION SYSTEM - Smooth character rotation to face movement direction
    if (inputVector.length() > 0) {
      // Smooth rotation interpolation
      const rotationDifference = targetRotation.current - currentRotation.current;
      
      // Handle rotation wrapping around 360 degrees
      let adjustedDifference = rotationDifference;
      if (adjustedDifference > Math.PI) adjustedDifference -= 2 * Math.PI;
      if (adjustedDifference < -Math.PI) adjustedDifference += 2 * Math.PI;
      
      currentRotation.current += adjustedDifference * rotationSpeed * delta;
      player.rotation.y = currentRotation.current;
      
      console.log(`🔄 Character rotation: ${(currentRotation.current * 180 / Math.PI).toFixed(1)}° (facing movement direction)`);
    }
    
    // 🚀 ENHANCED DRAMATIC JUMPING VISUAL EFFECTS - NO Y position changes, purely visual
    if (isJumping) {
      jumpAnimationTime.current += delta;
      
      // More dramatic bounce effect using advanced animation curves
      const jumpProgress = jumpAnimationTime.current / jumpAnimationDuration;
      const bounceEffect = Math.sin(jumpProgress * Math.PI) * jumpScaleIntensity;
      const squashStretch = Math.sin(jumpProgress * Math.PI * 2) * 0.2;
      
      // Apply dramatic visual jump effects
      const jumpScale = characterScale + bounceEffect;
      const jumpRotationX = Math.sin(jumpProgress * Math.PI * 6) * jumpRotationIntensity;
      const jumpRotationZ = Math.sin(jumpProgress * Math.PI * 3) * 0.15;
      
      // Enhanced scale effects - squash and stretch like Minecraft
      const scaleX = jumpScale + squashStretch;
      const scaleY = jumpScale - squashStretch * 0.5;
      const scaleZ = jumpScale + squashStretch;
      
      model.scale.set(scaleX, scaleY, scaleZ);
      model.rotation.x = jumpRotationX;
      model.rotation.z = jumpRotationZ;
      
      // Add glow effect simulation through rapid scale pulsing
      if (jumpProgress < 0.3) {
        const glowPulse = Math.sin(jumpProgress * Math.PI * 20) * 0.1;
        model.scale.multiplyScalar(1 + glowPulse);
      }
      
      console.log(`🚀 DRAMATIC JUMP: Progress: ${(jumpProgress * 100).toFixed(1)}%, Scale: (${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}, ${scaleZ.toFixed(2)}), Y stays at 4.0!`);
      
      // End jump animation with smooth return
      if (jumpAnimationTime.current >= jumpAnimationDuration) {
        setIsJumping(false);
        jumpAnimationTime.current = 0;
        model.scale.setScalar(characterScale);
        model.rotation.x = 0;
        model.rotation.z = 0;
        setAnimationState(playerIsMoving ? (controls.sprint ? 'running' : 'walking') : 'idle');
        console.log('🎯 Dramatic jump animation complete - returned to normal state');
      }
    }
    
    // 🎮 MINECRAFT-LIKE WALKING AND RUNNING VISUAL EFFECTS
    if (playerIsMoving && !isJumping) {
      if (controls.sprint) {
        // Enhanced Minecraft-style running effects
        const runBob = Math.sin(runningEffectTime.current) * runningBobIntensity;
        const runSway = Math.sin(runningEffectTime.current * 1.5) * walkingSwayIntensity * 1.5;
        const runTilt = Math.sin(runningEffectTime.current * 0.7) * walkingTiltIntensity * 1.3;
        
        // Apply running scale and rotation effects
        const runScaleY = characterScale + Math.abs(runBob) * 0.3;
        const runScaleX = characterScale - Math.abs(runBob) * 0.1; // Slight compression during impact
        
        model.scale.set(runScaleX, runScaleY, characterScale);
        model.rotation.x = runSway;
        model.rotation.z = runBob * 0.1 + runTilt;
        
        console.log(`💨 MINECRAFT RUNNING: Bob: ${runBob.toFixed(2)}, Sway: ${runSway.toFixed(2)}, Tilt: ${runTilt.toFixed(2)}`);
      } else {
        // Minecraft-style walking effects
        const walkBob = Math.sin(walkingTime.current) * walkingBobIntensity;
        const walkSway = Math.sin(walkingTime.current * 1.2) * walkingSwayIntensity;
        const walkTilt = Math.sin(walkingTime.current * 0.5) * walkingTiltIntensity;
        
        // Apply walking scale and rotation effects
        const walkScaleY = characterScale + Math.abs(walkBob) * 0.5;
        const walkScaleX = characterScale - Math.abs(walkBob) * 0.05;
        
        model.scale.set(walkScaleX, walkScaleY, characterScale);
        model.rotation.x = walkSway;
        model.rotation.z = walkBob * 0.08 + walkTilt;
        
        console.log(`🚶 MINECRAFT WALKING: Bob: ${walkBob.toFixed(2)}, Sway: ${walkSway.toFixed(2)}, Tilt: ${walkTilt.toFixed(2)}`);
      }
    } else if (!isJumping) {
      // Reset to normal scale when idle (not moving or jumping)
      model.scale.setScalar(characterScale);
      model.rotation.x = 0;
      model.rotation.z = 0;
    }
    
    // CRITICAL: Always ensure Y position stays at 4.0
    if (player.position.y !== 4.0) {
      player.position.y = 4.0;
      console.log('🔒 Y POSITION LOCKED: Corrected to 4.0 (as required)');
    }
    
    // Terrain-based movement boundaries - keep character within the 100x100 ground area
    const terrainBoundary = 48; // Slightly smaller than the 50-unit terrain radius for safety buffer
    let hitBoundary = false;
    
    // X-axis boundary check (left/right movement)
    if (player.position.x > terrainBoundary) {
      player.position.x = terrainBoundary;
      hitBoundary = true;
      console.log('🚧 TERRAIN BOUNDARY HIT: Right edge - staying within ground area');
    } else if (player.position.x < -terrainBoundary) {
      player.position.x = -terrainBoundary;
      hitBoundary = true;
      console.log('🚧 TERRAIN BOUNDARY HIT: Left edge - staying within ground area');
    }
    
    // Z-axis boundary check (forward/backward movement)
    if (player.position.z > terrainBoundary) {
      player.position.z = terrainBoundary;
      hitBoundary = true;
      console.log('🚧 TERRAIN BOUNDARY HIT: Front edge - staying within ground area');
    } else if (player.position.z < -terrainBoundary) {
      player.position.z = -terrainBoundary;
      hitBoundary = true;
      console.log('🚧 TERRAIN BOUNDARY HIT: Back edge - staying within ground area');
    }
    
    if (hitBoundary) {
      console.log(`🏔️ Character contained within terrain: (${player.position.x.toFixed(2)}, ${player.position.z.toFixed(2)}) - Ground area: ${terrainBoundary*2}x${terrainBoundary*2} units`);
      playHit(); // Audio feedback when hitting boundary
    } else if (playerIsMoving) {
      console.log(`🌍 Moving within terrain bounds: (${player.position.x.toFixed(2)}, ${player.position.z.toFixed(2)})`);
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

  // Enhanced animation state logging
  useEffect(() => {
    console.log(`🎭 Animation state: ${animationState} ${isJumping ? '(JUMPING)' : ''} ${isMoving ? '(MOVING)' : '(IDLE)'}`);
    if (animationState === 'jumping') {
      console.log('🚀 Enhanced dramatic jump effects activated!');
    }
    if (animationState === 'walking') {
      console.log('🚶 Minecraft-style walking effects activated!');
    }
    if (animationState === 'running') {
      console.log('💨 Minecraft-style running effects activated!');
    }
  }, [animationState, isJumping, isMoving]);

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      <primitive 
        object={model} 
        scale={[characterScale, characterScale, characterScale]}
        position={[0, -characterHeight/2, 0]}
        castShadow 
        receiveShadow
      />
      
      {/* Enhanced debug helpers - show player position and animation state */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshBasicMaterial 
          color={isJumping ? "orange" : (animationState === 'running' ? "blue" : (animationState === 'walking' ? "purple" : "red"))} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Ground level indicator - shows where terrain surface is (Y=0) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshBasicMaterial color="yellow" transparent opacity={0.5} />
      </mesh>
      
      {/* Character feet position indicator with animation state */}
      <mesh position={[0, -characterHeight/2, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshBasicMaterial 
          color={isJumping ? "cyan" : (isMoving ? "lime" : "green")} 
          transparent 
          opacity={0.6} 
        />
      </mesh>
      
      {/* Jump effect visual indicator */}
      {isJumping && (
        <mesh position={[0, 1, 0]}>
          <ringGeometry args={[1, 1.5, 8]} />
          <meshBasicMaterial color="gold" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}