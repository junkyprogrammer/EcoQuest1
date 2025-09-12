import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import Player from "./Player";
import EcosystemManager from "./EcosystemManager";
import Lights from "./Lights";
import Terrain from "./Terrain";
import EnvironmentalObjects from "./EnvironmentalObjects";
import CollectibleItems from "./CollectibleItems";
import { useGameState } from "../lib/stores/useGameState";

export default function Game() {
  const groupRef = useRef<THREE.Group>(null);
  const { gamePhase, currentLevel, currentEcosystem, ecosystemTransitioning, isPaused } = useGameState();

  useFrame((state, delta) => {
    // Pause game loop when pause menu is open
    if (isPaused) return;
    
    // Game loop logic here
    if (gamePhase === 'playing') {
      // Update game state each frame
    }
  });

  useEffect(() => {
    console.log(`Game phase: ${gamePhase}, Level: ${currentLevel}`);
  }, [gamePhase, currentLevel]);

  return (
    <group ref={groupRef}>
      <Lights />
      <EcosystemManager 
        currentEcosystem={currentEcosystem}
        transitionDuration={2.0}
      />
      <Player />
      <EnvironmentalObjects />
      <CollectibleItems />
    </group>
  );
}
