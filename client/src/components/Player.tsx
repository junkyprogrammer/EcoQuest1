import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { Controls } from "../App";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function Player() {
  // Use the new rigged student character with proper animations
  const gltf = useGLTF('/models/rigged_student.glb');
  const model = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  const playerRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Object3D>(null);
  const { actions, mixer, clips } = useAnimations(gltf.animations, modelRef);
  const [subscribe, get] = useKeyboardControls<Controls>();
  const { addScore } = useGameState();
  const { playHit } = useAudio();
  
  // Enhanced movement physics and state
  const velocity = useRef(new THREE.Vector3());
  const momentum = useRef(new THREE.Vector3());
  const isOnGround = useRef(true);
  const isDashing = useRef(false);
  const dashDirection = useRef(new THREE.Vector3());
  const dashCooldown = useRef(0);
  
  // Movement constants with enhanced dynamics
  const baseSpeed = 6;
  const runSpeedMultiplier = 1.8;
  const dashSpeedMultiplier = 3.5;
  const acceleration = 25;
  const deceleration = 15;
  const rotationSpeed = 12;
  const jumpForce = 10;
  const dashDuration = 0.3;
  const dashCooldownTime = 1.0;
  
  // Enhanced animation states for dynamic movement
  const [animationState, setAnimationState] = useState<'idle' | 'walking' | 'running' | 'jumping' | 'dashing' | 'strafe_left' | 'strafe_right' | 'walking_backward'>('idle');
  const [movementDirection, setMovementDirection] = useState(new THREE.Vector3());
  const [lastTapTimes, setLastTapTimes] = useState<{[key: string]: number}>({});
  const walkCycle = useRef(0);
  const jumpAnimation = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  
  // Realistic walking animation system
  const leftLeg = useRef(new THREE.Object3D());
  const rightLeg = useRef(new THREE.Object3D());
  const leftArm = useRef(new THREE.Object3D());
  const rightArm = useRef(new THREE.Object3D());
  const torso = useRef(new THREE.Object3D());
  const head = useRef(new THREE.Object3D());
  
  // Enhanced animation timing and physics
  const walkPhase = useRef(0);
  const stepLength = useRef(0.8);
  const armSwingAmount = useRef(0.3);
  const headBobAmount = useRef(0.05);
  const legLiftHeight = useRef(0.2);
  const bodyLeanAmount = useRef(0.1);
  const speedBasedAnimationMultiplier = useRef(1);
  
  // Camera enhancement variables
  const cameraOffset = useRef(new THREE.Vector3(0, 8, 12));
  const targetCameraOffset = useRef(new THREE.Vector3(0, 8, 12));
  const cameraLookAhead = useRef(new THREE.Vector3());
  
  // Track current animation action
  const currentActionRef = useRef<string>('idle');

  useEffect(() => {
    // Log when controls change
    const unsubscribe = subscribe(
      (state) => state.forward,
      (pressed) => console.log("Forward control:", pressed)
    );
    return unsubscribe;
  }, [subscribe]);

  // Initialize animations and setup skeletal animation system
  useEffect(() => {
    console.log('Model loading complete. Checking for skeletal structure...');
    
    // Check if model has skeleton
    let hasSkinnedMesh = false;
    let boneCount = 0;
    model.traverse((child) => {
      if ((child as any).isSkinnedMesh) {
        hasSkinnedMesh = true;
        if ((child as any).skeleton) {
          boneCount = (child as any).skeleton.bones.length;
        }
      }
    });
    
    console.log(`Skeletal analysis: SkinnedMesh=${hasSkinnedMesh}, Bones=${boneCount}`);
    
    if (gltf.animations.length > 0) {
      console.log('Available animations:', gltf.animations.map(anim => anim.name));
      
      // Find appropriate animations
      const idleClip = clips.find(clip => /idle|stand/i.test(clip.name));
      const walkClip = clips.find(clip => /walk/i.test(clip.name));
      const runClip = clips.find(clip => /run|sprint/i.test(clip.name));
      
      console.log('Animation mapping:', { 
        idle: idleClip?.name, 
        walk: walkClip?.name, 
        run: runClip?.name 
      });
      
      // Start with idle animation
      const idleAction = actions[idleClip?.name || ''] || actions.idle || Object.values(actions)[0];
      if (idleAction) {
        idleAction.play();
        currentActionRef.current = idleClip?.name || 'idle';
        console.log('Started skeletal animation:', currentActionRef.current);
      }
    } else {
      console.log('No animations found - using procedural fallback');
    }
  }, [gltf.animations, actions, clips, model]);

  // Handle animation state changes with cross-fading
  useEffect(() => {
    if (!mixer || gltf.animations.length === 0) return;

    // Map animation states to actual clip names
    const idleClip = clips.find(clip => /idle|stand/i.test(clip.name));
    const walkClip = clips.find(clip => /walk/i.test(clip.name));
    const runClip = clips.find(clip => /run|sprint/i.test(clip.name));
    
    const nextActionName = animationState === 'idle' ? idleClip?.name : 
                          animationState === 'walking' ? walkClip?.name : 
                          animationState === 'running' ? runClip?.name : 
                          idleClip?.name;

    if (nextActionName && nextActionName !== currentActionRef.current) {
      const current = actions[currentActionRef.current];
      const next = actions[nextActionName];
      
      if (current && next) {
        console.log(`Skeletal animation transition: ${currentActionRef.current} -> ${nextActionName}`);
        current.fadeOut(0.25);
        next.reset().fadeIn(0.25).play();
        currentActionRef.current = nextActionName;
      }
    }
  }, [animationState, actions, mixer, gltf.animations, clips]);

  // Fixed dash mechanics - only on key events, not every frame
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  
  // Handle dash input on key press events (not every frame)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code;
      
      // Only handle movement keys for dash detection
      const movementKeys = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (!movementKeys.includes(key)) return;
      
      const currentTime = Date.now();
      const lastTap = lastTapTimes[key] || 0;
      const timeDiff = currentTime - lastTap;
      
      // Strict double-tap detection (much tighter window)
      const isDoubleTap = timeDiff < 250 && timeDiff > 50 && dashCooldown.current <= 0;
      
      if (isDoubleTap && !isDashing.current) {
        console.log(`Dash triggered by double-tap: ${key}`);
        isDashing.current = true;
        dashCooldown.current = dashCooldownTime;
        setAnimationState('dashing');
        
        // Set dash direction based on key
        if (key === 'KeyW' || key === 'ArrowUp') dashDirection.current.set(0, 0, -1);
        else if (key === 'KeyS' || key === 'ArrowDown') dashDirection.current.set(0, 0, 1);
        else if (key === 'KeyA' || key === 'ArrowLeft') dashDirection.current.set(-1, 0, 0);
        else if (key === 'KeyD' || key === 'ArrowRight') dashDirection.current.set(1, 0, 0);
        
        playHit();
        
        // End dash after duration
        setTimeout(() => {
          isDashing.current = false;
          console.log('Dash ended, returning to normal movement');
        }, dashDuration * 1000);
      }
      
      setLastTapTimes(prev => ({ ...prev, [key]: currentTime }));
      setPressedKeys(prev => new Set(prev).add(key));
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.code);
        return newSet;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [lastTapTimes, playHit]);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const controls = get();
    const player = playerRef.current;

    // Enhanced movement system with momentum
    const inputVector = new THREE.Vector3();
    let isMoving = false;
    let movementType = 'forward';
    
    // Enhanced movement input with precision mode support
    const precisionMode = controls.precision_mode;
    const walkMode = controls.walk;
    const speedMultiplier = precisionMode ? 0.4 : walkMode ? 0.7 : 1.0;
    
    // Clean directional movement input (no more frame-by-frame dash calls)
    if (controls.forward) {
      inputVector.z -= 1;
      isMoving = true;
      movementType = 'forward';
    }
    if (controls.backward) {
      inputVector.z += 1;
      isMoving = true;
      movementType = 'backward';
    }
    if (controls.leftward) {
      inputVector.x -= 1;
      isMoving = true;
      movementType = 'leftward';
    }
    if (controls.rightward) {
      inputVector.x += 1;
      isMoving = true;
      movementType = 'rightward';
    }
    
    // Handle dedicated dash key
    if (controls.dash && dashCooldown.current <= 0 && !isDashing.current) {
      console.log('Dash triggered by dash key');
      isDashing.current = true;
      dashCooldown.current = dashCooldownTime;
      setAnimationState('dashing');
      
      // Use current movement direction for dash
      if (inputVector.length() > 0) {
        dashDirection.current.copy(inputVector.normalize());
      } else {
        dashDirection.current.set(0, 0, -1); // Default forward
      }
      
      playHit();
      
      setTimeout(() => {
        isDashing.current = false;
        console.log('Dash ended by timeout');
      }, dashDuration * 1000);
    }
    
    // Dedicated strafe controls
    if (controls.strafe_left && !controls.leftward) {
      inputVector.x -= 1;
      isMoving = true;
      movementType = 'strafe_left';
    }
    if (controls.strafe_right && !controls.rightward) {
      inputVector.x += 1;
      isMoving = true;
      movementType = 'strafe_right';
    }
    
    // Apply speed modifiers
    if (inputVector.length() > 0) {
      inputVector.normalize().multiplyScalar(speedMultiplier);
    }

    // Normalize input for consistent speed in all directions
    if (inputVector.length() > 0) {
      inputVector.normalize();
    }
    
    // Calculate target rotation for smooth 360-degree movement
    if (isMoving) {
      targetRotation.current = Math.atan2(inputVector.x, inputVector.z);
    }

    // Enhanced smooth rotation with momentum
    const rotationDiff = targetRotation.current - currentRotation.current;
    let shortestAngle = ((rotationDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
    
    // Faster rotation during dash for responsiveness
    const currentRotationSpeed = isDashing.current ? rotationSpeed * 2 : rotationSpeed;
    currentRotation.current += shortestAngle * currentRotationSpeed * delta;
    player.rotation.y = currentRotation.current;

    // Fixed speed system with consistent values
    let targetSpeed = baseSpeed; // Base: 6 units/sec
    let speedMode = 'normal';
    
    if (isDashing.current) {
      targetSpeed = baseSpeed * dashSpeedMultiplier; // 21 units/sec
      speedMode = 'dash';
    } else if (controls.sprint && !walkMode && !precisionMode) {
      targetSpeed = baseSpeed * runSpeedMultiplier; // 10.8 units/sec  
      speedMode = 'run';
    } else if (walkMode) {
      targetSpeed = baseSpeed * 0.7; // 4.2 units/sec
      speedMode = 'walk';
    } else if (precisionMode) {
      targetSpeed = baseSpeed * 0.4; // 2.4 units/sec
      speedMode = 'precision';
    } else {
      targetSpeed = baseSpeed; // 6 units/sec
      speedMode = 'normal';
    }
    
    // Only apply input vector if moving (no more fractional speeds)
    if (inputVector.length() > 0) {
      // Normalize to maintain consistent speed in all directions
      inputVector.normalize();
    } else {
      targetSpeed = 0;
      speedMode = 'stopped';
    }
    
    if (isMoving) {
      // Accelerate towards target velocity
      const targetVelocity = inputVector.clone().multiplyScalar(targetSpeed);
      momentum.current.lerp(targetVelocity, acceleration * delta);
    } else {
      // Decelerate when no input
      momentum.current.lerp(new THREE.Vector3(0, 0, 0), deceleration * delta);
    }
    
    // Apply momentum to player position with logging
    const frameMovement = momentum.current.clone().multiplyScalar(delta);
    const oldPosition = player.position.clone();
    player.position.add(frameMovement);
    
    // Reduced position logging - only significant changes
    const actualMovement = player.position.distanceTo(oldPosition);
    if (actualMovement > 0.1) { // Log every 0.1 units of movement
      console.log(`Position: (${player.position.x.toFixed(1)}, ${player.position.z.toFixed(1)}) | ${speedMode} ${(actualMovement/delta).toFixed(1)} u/s`);
    }
    
    // Fixed animation state machine with proper progression
    if (controls.jump && isOnGround.current) {
      setAnimationState('jumping');
      jumpAnimation.current = 0;
      velocity.current.y = jumpForce;
      isOnGround.current = false;
      playHit();
      console.log('Movement State: jumping');
    } else if (isDashing.current) {
      // Dashing state - set elsewhere, don't override
      console.log('Movement State: dashing (maintained)');
    } else if (isMoving && isOnGround.current) {
      // Proper movement state progression based on speed and input
      let newState = 'walking';
      
      if (controls.sprint && !walkMode && !precisionMode) {
        newState = 'running';
      } else if (movementType === 'backward') {
        newState = 'walking_backward';
      } else if (movementType === 'leftward' && !controls.forward && !controls.backward) {
        newState = 'strafe_left';
      } else if (movementType === 'rightward' && !controls.forward && !controls.backward) {
        newState = 'strafe_right';
      }
      
      // Only change state if it's actually different to avoid constant updates
      if (animationState !== newState) {
        setAnimationState(newState as typeof animationState);
        console.log(`Movement State: ${animationState} → ${newState}`);
      }
    } else if (isOnGround.current && animationState !== 'idle') {
      setAnimationState('idle');
      console.log('Movement State: → idle');
    }
    
    // Update movement direction for animations
    setMovementDirection(momentum.current.clone().normalize());

    // Apply gravity
    velocity.current.y -= 20 * delta;
    player.position.y += velocity.current.y * delta;

    // Ground collision (simple)
    if (player.position.y <= 1) {
      player.position.y = 1;
      velocity.current.y = 0;
      isOnGround.current = true;
    }

    // Update animation mixer for skeletal animations
    if (mixer) {
      mixer.update(delta);
    }

    // Enhanced procedural animation system for all movement states
    if (gltf.animations.length === 0) {
      const character = playerRef.current?.children[0];
      if (!character) return;
      
      // Determine animation speed based on state and momentum
      const currentSpeed = momentum.current.length();
      const normalizedSpeed = Math.min(currentSpeed / baseSpeed, 2.0);
      
      if (animationState !== 'idle' && isMoving) {
        let walkSpeed = 8; // Base walk speed
        let amplitudeMultiplier = 1;
        let bodyLeanDirection = 0;
        
        // Adjust animation parameters based on state
        switch (animationState) {
          case 'running':
            walkSpeed = 12;
            amplitudeMultiplier = 1.3;
            character.rotation.x = -0.1; // Forward lean
            break;
          case 'dashing':
            walkSpeed = 20;
            amplitudeMultiplier = 1.8;
            character.rotation.x = -0.2; // Aggressive forward lean
            bodyLeanDirection = Math.sin(state.clock.elapsedTime * 15) * 0.15;
            break;
          case 'walking_backward':
            walkSpeed = 6;
            amplitudeMultiplier = 0.8;
            character.rotation.x = 0.05; // Slight backward lean
            break;
          case 'strafe_left':
            walkSpeed = 7;
            amplitudeMultiplier = 0.9;
            bodyLeanDirection = -0.1; // Lean into the strafe
            break;
          case 'strafe_right':
            walkSpeed = 7;
            amplitudeMultiplier = 0.9;
            bodyLeanDirection = 0.1; // Lean into the strafe
            break;
          default:
            character.rotation.x = THREE.MathUtils.lerp(character.rotation.x, 0, delta * 5);
        }
        
        // Update walk phase with speed-based multiplier
        walkPhase.current += delta * walkSpeed * speedBasedAnimationMultiplier.current;
        
        // Enhanced leg and arm animations
        const leftLegPhase = Math.sin(walkPhase.current) * amplitudeMultiplier;
        const rightLegPhase = Math.sin(walkPhase.current + Math.PI) * amplitudeMultiplier;
        const leftArmPhase = Math.sin(walkPhase.current + Math.PI) * armSwingAmount.current;
        const rightArmPhase = Math.sin(walkPhase.current) * armSwingAmount.current;
        
        // Enhanced head bobbing with speed variation
        const headBob = Math.sin(walkPhase.current * 2) * headBobAmount.current * normalizedSpeed;
        character.position.y = headBob;
        
        // Dynamic body lean based on movement type and speed
        const baseLean = Math.sin(walkPhase.current) * 0.03 * normalizedSpeed;
        character.rotation.z = baseLean + bodyLeanDirection;
        
        // Apply enhanced limb animations
        character.traverse((child) => {
          if (child.type === 'Bone' || child.type === 'Object3D' || child.name.includes('Bone')) {
            const limbName = child.name.toLowerCase();
            
            // Enhanced left leg animation
            if (limbName.includes('left') && (limbName.includes('leg') || limbName.includes('thigh') || limbName.includes('foot'))) {
              child.rotation.x = leftLegPhase * 0.8;
              child.position.z = Math.sin(leftLegPhase) * 0.1 * normalizedSpeed;
              if (animationState === 'strafe_left') {
                child.rotation.y = Math.sin(walkPhase.current) * 0.3;
              }
            }
            
            // Enhanced right leg animation
            if (limbName.includes('right') && (limbName.includes('leg') || limbName.includes('thigh') || limbName.includes('foot'))) {
              child.rotation.x = rightLegPhase * 0.8;
              child.position.z = Math.sin(rightLegPhase) * 0.1 * normalizedSpeed;
              if (animationState === 'strafe_right') {
                child.rotation.y = Math.sin(walkPhase.current) * -0.3;
              }
            }
            
            // Enhanced arm animations with state variations
            if (limbName.includes('left') && (limbName.includes('arm') || limbName.includes('shoulder') || limbName.includes('hand'))) {
              child.rotation.x = leftArmPhase * (isDashing.current ? 1.5 : 1.0);
              if (animationState === 'dashing') {
                child.rotation.z = Math.sin(walkPhase.current * 1.5) * 0.2;
              }
            }
            
            if (limbName.includes('right') && (limbName.includes('arm') || limbName.includes('shoulder') || limbName.includes('hand'))) {
              child.rotation.x = rightArmPhase * (isDashing.current ? 1.5 : 1.0);
              if (animationState === 'dashing') {
                child.rotation.z = Math.sin(walkPhase.current * 1.5) * -0.2;
              }
            }
          }
        });
        
        // Reduced logging - only log on state changes
        if (Math.floor(walkPhase.current / 10) % 50 === 0) { // Log every 50 animation cycles
          console.log(`Animation: ${animationState}, Speed: ${normalizedSpeed.toFixed(2)}`);
        }
      } else {
        // Enhanced idle state with subtle animations
        const breatheIntensity = 0.02;
        const fidgetIntensity = 0.01;
        
        // Breathing animation
        const breathe = Math.sin(state.clock.elapsedTime * 1.5) * breatheIntensity;
        character.scale.y = 1 + breathe;
        
        // Subtle fidget movements
        const fidget = Math.sin(state.clock.elapsedTime * 0.8) * fidgetIntensity;
        character.rotation.z = fidget;
        
        // Smoothly return to neutral pose
        character.position.y = THREE.MathUtils.lerp(character.position.y, 0, delta * 5);
        character.rotation.x = THREE.MathUtils.lerp(character.rotation.x, 0, delta * 5);
      }
    }

    // Enhanced jumping animation with better physics
    if (animationState === 'jumping') {
      jumpAnimation.current += delta * 8;
      const character = playerRef.current?.children[0];
      if (character) {
        // More dynamic jump animation with rotation
        const jumpProgress = jumpAnimation.current / Math.PI;
        const jumpStretch = Math.sin(jumpAnimation.current) * 0.15;
        const jumpRotation = Math.sin(jumpAnimation.current * 0.5) * 0.1;
        
        character.scale.y = 1 + jumpStretch;
        character.scale.x = 1 - jumpStretch * 0.2;
        character.scale.z = 1 - jumpStretch * 0.2;
        character.rotation.x += jumpRotation * delta;
        
        // Add slight forward momentum during jump
        if (isMoving) {
          character.rotation.x = THREE.MathUtils.lerp(character.rotation.x, -0.2, delta * 3);
        }
      }
      
      // Enhanced landing detection and transition
      if (isOnGround.current && jumpAnimation.current > Math.PI) {
        const nextState = isMoving ? (controls.sprint ? 'running' : 'walking') : 'idle';
        setAnimationState(nextState);
        if (playerRef.current?.children[0]) {
          playerRef.current.children[0].scale.set(1, 1, 1);
        }
        playHit(); // Landing sound
      }
    }

    // Enhanced boundary system with momentum preservation
    const boundarySize = 45;
    if (Math.abs(player.position.x) > boundarySize) {
      player.position.x = Math.sign(player.position.x) * boundarySize;
      momentum.current.x *= -0.3; // Soft bounce effect
    }
    if (Math.abs(player.position.z) > boundarySize) {
      player.position.z = Math.sign(player.position.z) * boundarySize;
      momentum.current.z *= -0.3; // Soft bounce effect
    }

    // Update cooldowns
    if (dashCooldown.current > 0) {
      dashCooldown.current -= delta;
    }
    
    // Enhanced dynamic camera system
    const currentSpeed = momentum.current.length();
    speedBasedAnimationMultiplier.current = Math.max(0.5, currentSpeed / baseSpeed);
    
    // Adjust camera distance based on movement speed and state
    if (isDashing.current) {
      targetCameraOffset.current.set(0, 10, 15); // Pull back during dash
    } else if (controls.sprint) {
      targetCameraOffset.current.set(0, 9, 14); // Slightly back during run
    } else {
      targetCameraOffset.current.set(0, 8, 12); // Normal distance
    }
    
    // Smooth camera offset interpolation
    cameraOffset.current.lerp(targetCameraOffset.current, 5 * delta);
    
    // Camera look-ahead based on movement direction
    if (isMoving) {
      cameraLookAhead.current.lerp(
        momentum.current.clone().normalize().multiplyScalar(3),
        3 * delta
      );
    } else {
      cameraLookAhead.current.lerp(new THREE.Vector3(0, 0, 0), 2 * delta);
    }
    
    // Apply enhanced camera positioning
    const cameraTarget = player.position.clone().add(cameraLookAhead.current);
    state.camera.position.x = player.position.x + cameraOffset.current.x;
    state.camera.position.y = player.position.y + cameraOffset.current.y;
    state.camera.position.z = player.position.z + cameraOffset.current.z;
    state.camera.lookAt(cameraTarget);
  });

  return (
    <group ref={playerRef} position={[0, 1, 0]}>
      <primitive 
        ref={modelRef}
        object={model} 
        scale={[2.5, 2.5, 2.5]}
        castShadow 
        receiveShadow
      />
    </group>
  );
}
