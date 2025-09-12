import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Controls } from "../App";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function Player() {
  const { scene } = useGLTF('/models/student_character.glb');
  const playerRef = useRef<THREE.Group>(null);
  const [subscribe, get] = useKeyboardControls<Controls>();
  const { addScore } = useGameState();
  const { playHit } = useAudio();
  
  const velocity = useRef(new THREE.Vector3());
  const isOnGround = useRef(true);
  const speed = 5;
  const jumpForce = 8;
  
  // Animation states
  const [animationState, setAnimationState] = useState<'idle' | 'walking' | 'jumping'>('idle');
  const walkCycle = useRef(0);
  const jumpAnimation = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);

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

    // Animation state management
    if (controls.jump && isOnGround.current) {
      setAnimationState('jumping');
      jumpAnimation.current = 0;
      velocity.current.y = jumpForce;
      isOnGround.current = false;
      playHit();
    } else if (isMoving && isOnGround.current) {
      setAnimationState('walking');
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

    // Walking animation (bobbing effect)
    if (animationState === 'walking' && isMoving) {
      walkCycle.current += delta * 8; // Walking speed
      const bobHeight = Math.sin(walkCycle.current) * 0.1;
      const tilt = Math.sin(walkCycle.current) * 0.05;
      
      if (playerRef.current?.children[0]) {
        playerRef.current.children[0].position.y = bobHeight;
        playerRef.current.children[0].rotation.z = tilt;
        playerRef.current.children[0].rotation.x = Math.sin(walkCycle.current * 0.5) * 0.02;
      }
    } else {
      // Reset walking animations when not walking
      if (playerRef.current?.children[0]) {
        playerRef.current.children[0].position.y = THREE.MathUtils.lerp(
          playerRef.current.children[0].position.y, 0, delta * 5
        );
        playerRef.current.children[0].rotation.z = THREE.MathUtils.lerp(
          playerRef.current.children[0].rotation.z, 0, delta * 5
        );
        playerRef.current.children[0].rotation.x = THREE.MathUtils.lerp(
          playerRef.current.children[0].rotation.x, 0, delta * 5
        );
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
