import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { Controls } from "../App";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function Player() {
  const { scene, animations } = useGLTF('/models/student_character.glb');
  const playerRef = useRef<THREE.Group>(null);
  const { actions, mixer } = useAnimations(animations, playerRef);
  const [subscribe, get] = useKeyboardControls<Controls>();
  const { addScore } = useGameState();
  const { playHit } = useAudio();
  
  const velocity = useRef(new THREE.Vector3());
  const isOnGround = useRef(true);
  const speed = 5;
  const jumpForce = 8;
  
  // Animation states for realistic walking like Free Fire/BGMI
  const [animationState, setAnimationState] = useState<'idle' | 'walking' | 'running' | 'jumping'>('idle');
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
  
  // Animation timing for realistic walking
  const walkPhase = useRef(0);
  const stepLength = useRef(0.8);
  const armSwingAmount = useRef(0.3);
  const headBobAmount = useRef(0.05);
  const legLiftHeight = useRef(0.2);

  useEffect(() => {
    // Log when controls change
    const unsubscribe = subscribe(
      (state) => state.forward,
      (pressed) => console.log("Forward control:", pressed)
    );
    return unsubscribe;
  }, [subscribe]);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const controls = get();
    const player = playerRef.current;

    // Movement
    const moveVector = new THREE.Vector3();
    let isMoving = false;
    
    if (controls.forward) {
      moveVector.z -= 1;
      targetRotation.current = 0;
      isMoving = true;
    }
    if (controls.backward) {
      moveVector.z += 1;
      targetRotation.current = Math.PI;
      isMoving = true;
    }
    if (controls.leftward) {
      moveVector.x -= 1;
      targetRotation.current = Math.PI / 2;
      isMoving = true;
    }
    if (controls.rightward) {
      moveVector.x += 1;
      targetRotation.current = -Math.PI / 2;
      isMoving = true;
    }

    // Handle diagonal movement rotations
    if (controls.forward && controls.rightward) {
      targetRotation.current = -Math.PI / 4;
    } else if (controls.forward && controls.leftward) {
      targetRotation.current = Math.PI / 4;
    } else if (controls.backward && controls.rightward) {
      targetRotation.current = -3 * Math.PI / 4;
    } else if (controls.backward && controls.leftward) {
      targetRotation.current = 3 * Math.PI / 4;
    }

    // Smooth rotation
    const rotationDiff = targetRotation.current - currentRotation.current;
    const shortestAngle = ((rotationDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
    currentRotation.current += shortestAngle * 8 * delta;
    player.rotation.y = currentRotation.current;

    // Animation state management like Free Fire/BGMI
    if (controls.jump && isOnGround.current) {
      setAnimationState('jumping');
      jumpAnimation.current = 0;
      velocity.current.y = jumpForce;
      isOnGround.current = false;
      playHit();
    } else if (isMoving && isOnGround.current) {
      // Different walking speeds like in battle royale games
      const movementSpeed = moveVector.length();
      if (movementSpeed > 0.8) {
        setAnimationState('running');
      } else {
        setAnimationState('walking');
      }
    } else if (isOnGround.current) {
      setAnimationState('idle');
    }

    // Normalize movement to prevent diagonal speed boost
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(speed * delta);
      player.position.add(moveVector);
    }

    // Apply gravity
    velocity.current.y -= 20 * delta;
    player.position.y += velocity.current.y * delta;

    // Ground collision (simple)
    if (player.position.y <= 1) {
      player.position.y = 1;
      velocity.current.y = 0;
      isOnGround.current = true;
    }

    // Realistic walking animation system like Free Fire/BGMI
    if ((animationState === 'walking' || animationState === 'running') && isMoving) {
      // Walking speed affects animation speed
      const walkSpeed = animationState === 'running' ? 12 : 8;
      walkPhase.current += delta * walkSpeed;
      
      // Create realistic walking cycle with proper leg and arm movements
      const leftLegPhase = Math.sin(walkPhase.current);
      const rightLegPhase = Math.sin(walkPhase.current + Math.PI);
      const leftArmPhase = Math.sin(walkPhase.current + Math.PI); // Arms opposite to legs
      const rightArmPhase = Math.sin(walkPhase.current);
      
      if (playerRef.current?.children[0]) {
        const character = playerRef.current.children[0];
        
        // Natural head bobbing like in popular games
        const headBob = Math.sin(walkPhase.current * 2) * headBobAmount.current;
        character.position.y = headBob;
        
        // Subtle body lean during walking
        const bodyLean = Math.sin(walkPhase.current) * 0.02;
        character.rotation.z = bodyLean;
        
        // Forward lean while running like in action games
        if (animationState === 'running') {
          character.rotation.x = -0.1;
        } else {
          character.rotation.x = THREE.MathUtils.lerp(character.rotation.x, 0, delta * 5);
        }
        
        // Traverse model to find and animate limbs
        character.traverse((child) => {
          if (child.name.toLowerCase().includes('leg') && child.name.toLowerCase().includes('left')) {
            child.rotation.x = leftLegPhase * 0.5;
            child.position.y = Math.max(0, leftLegPhase * legLiftHeight.current);
          }
          if (child.name.toLowerCase().includes('leg') && child.name.toLowerCase().includes('right')) {
            child.rotation.x = rightLegPhase * 0.5;
            child.position.y = Math.max(0, rightLegPhase * legLiftHeight.current);
          }
          if (child.name.toLowerCase().includes('arm') && child.name.toLowerCase().includes('left')) {
            child.rotation.x = leftArmPhase * armSwingAmount.current;
          }
          if (child.name.toLowerCase().includes('arm') && child.name.toLowerCase().includes('right')) {
            child.rotation.x = rightArmPhase * armSwingAmount.current;
          }
        });
      }
    } else {
      // Smoothly return to idle pose
      if (playerRef.current?.children[0]) {
        const character = playerRef.current.children[0];
        character.position.y = THREE.MathUtils.lerp(character.position.y, 0, delta * 5);
        character.rotation.z = THREE.MathUtils.lerp(character.rotation.z, 0, delta * 5);
        character.rotation.x = THREE.MathUtils.lerp(character.rotation.x, 0, delta * 5);
        
        // Reset limb positions smoothly
        character.traverse((child) => {
          if (child.name.toLowerCase().includes('leg') || child.name.toLowerCase().includes('arm')) {
            child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, 0, delta * 5);
            child.position.y = THREE.MathUtils.lerp(child.position.y, 0, delta * 5);
          }
        });
      }
    }

    // Jumping animation
    if (animationState === 'jumping') {
      jumpAnimation.current += delta * 5;
      if (playerRef.current?.children[0]) {
        const jumpStretch = Math.sin(jumpAnimation.current) * 0.1;
        playerRef.current.children[0].scale.y = 1 + jumpStretch;
        playerRef.current.children[0].scale.x = 1 - jumpStretch * 0.3;
        playerRef.current.children[0].scale.z = 1 - jumpStretch * 0.3;
      }
      
      // Reset jump animation when landing
      if (isOnGround.current && jumpAnimation.current > Math.PI) {
        setAnimationState(isMoving ? 'walking' : 'idle');
        if (playerRef.current?.children[0]) {
          playerRef.current.children[0].scale.set(1, 1, 1);
        }
      }
    }

    // Breathing animation for idle state
    if (animationState === 'idle' && isOnGround.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      if (playerRef.current?.children[0]) {
        playerRef.current.children[0].scale.y = 1 + breathe;
      }
    }

    // Keep player within bounds
    player.position.x = Math.max(-50, Math.min(50, player.position.x));
    player.position.z = Math.max(-50, Math.min(50, player.position.z));

    // Update camera to follow player
    state.camera.position.x = player.position.x;
    state.camera.position.z = player.position.z + 12;
    state.camera.lookAt(player.position);
  });

  return (
    <group ref={playerRef} position={[0, 1, 0]}>
      <primitive 
        object={scene.clone()} 
        scale={[2.5, 2.5, 2.5]}
        castShadow 
        receiveShadow
      />
    </group>
  );
}
