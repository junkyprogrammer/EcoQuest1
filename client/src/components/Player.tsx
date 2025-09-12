import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Controls } from "../App";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function Player() {
  const { scene } = useGLTF('/models/player_character.glb');
  const playerRef = useRef<THREE.Group>(null);
  const [subscribe, get] = useKeyboardControls<Controls>();
  const { addScore } = useGameState();
  const { playHit } = useAudio();
  
  const velocity = useRef(new THREE.Vector3());
  const isOnGround = useRef(true);
  const speed = 5;
  const jumpForce = 8;

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
    
    if (controls.forward) {
      moveVector.z -= 1;
    }
    if (controls.backward) {
      moveVector.z += 1;
    }
    if (controls.leftward) {
      moveVector.x -= 1;
    }
    if (controls.rightward) {
      moveVector.x += 1;
    }

    // Normalize movement to prevent diagonal speed boost
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(speed * delta);
      player.position.add(moveVector);
    }

    // Jump
    if (controls.jump && isOnGround.current) {
      velocity.current.y = jumpForce;
      isOnGround.current = false;
      playHit(); // Play sound effect for jump
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
