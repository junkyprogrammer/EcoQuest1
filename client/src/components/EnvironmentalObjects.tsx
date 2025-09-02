import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { Controls } from "../App";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function EnvironmentalObjects() {
  const { openMiniGame, openQuiz, addToInventory, addScore } = useGameState();
  const { playSuccess } = useAudio();
  const [, get] = useKeyboardControls<Controls>();
  
  const playerRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Pre-calculate positions for recycling bins
  const recyclingBins = useMemo(() => [
    { position: [10, 1, 5], type: 'plastic', color: '#2196F3' },
    { position: [12, 1, 5], type: 'paper', color: '#4CAF50' },
    { position: [14, 1, 5], type: 'glass', color: '#FF9800' },
    { position: [-10, 1, -10], type: 'plastic', color: '#2196F3' }
  ], []);

  // Quiz stations
  const quizStations = useMemo(() => [
    { position: [-15, 2, 15], topic: 'Climate Change' },
    { position: [25, 2, -15], topic: 'Renewable Energy' }
  ], []);

  useFrame((state) => {
    // Update player position reference
    const camera = state.camera;
    playerRef.current.set(camera.position.x, 1, camera.position.z - 12);

    // Check for interactions
    const controls = get();
    if (controls.interact) {
      checkInteractions();
    }
  });

  const checkInteractions = () => {
    const playerPos = playerRef.current;
    
    // Check recycling bin interactions
    recyclingBins.forEach((bin, index) => {
      const distance = playerPos.distanceTo(new THREE.Vector3(...bin.position));
      if (distance < 3) {
        openMiniGame();
        addToInventory("Recyclables", 1);
        playSuccess();
      }
    });

    // Check quiz station interactions
    quizStations.forEach((station, index) => {
      const distance = playerPos.distanceTo(new THREE.Vector3(...station.position));
      if (distance < 3) {
        openQuiz();
        addScore(50);
      }
    });
  };

  return (
    <group>
      {/* Recycling Bins */}
      {recyclingBins.map((bin, index) => (
        <group key={`bin-${index}`} position={bin.position}>
          {/* Bin body */}
          <mesh castShadow>
            <cylinderGeometry args={[1, 1.2, 2, 8]} />
            <meshLambertMaterial color={bin.color} />
          </mesh>
          {/* Bin lid */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[1.1, 1.1, 0.2, 8]} />
            <meshLambertMaterial color={bin.color} />
          </mesh>
          {/* Interaction indicator */}
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.3, 8, 6]} />
            <meshBasicMaterial color="#FFFF00" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Quiz Stations */}
      {quizStations.map((station, index) => (
        <group key={`quiz-${index}`} position={station.position}>
          {/* Station base */}
          <mesh castShadow>
            <boxGeometry args={[2, 3, 0.5]} />
            <meshLambertMaterial color="#1976D2" />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 0, 0.26]}>
            <planeGeometry args={[1.5, 1]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          {/* Interaction indicator */}
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.3, 8, 6]} />
            <meshBasicMaterial color="#00FF00" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Wind Turbines */}
      <WindTurbine position={[30, 0, 30]} />
      <WindTurbine position={[35, 0, 25]} />
      <WindTurbine position={[-30, 0, -30]} />
    </group>
  );
}

function WindTurbine({ position }: { position: [number, number, number] }) {
  const turbineRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (turbineRef.current) {
      turbineRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Turbine tower */}
      <mesh position={[0, 8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 16, 8]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Turbine blades */}
      <group ref={turbineRef} position={[0, 16, 0]}>
        {/* Blade 1 */}
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[0.3, 6, 0.1]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
        {/* Blade 2 */}
        <mesh position={[-2.6, -1.5, 0]} rotation={[0, 0, Math.PI * 2 / 3]} castShadow>
          <boxGeometry args={[0.3, 6, 0.1]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
        {/* Blade 3 */}
        <mesh position={[2.6, -1.5, 0]} rotation={[0, 0, -Math.PI * 2 / 3]} castShadow>
          <boxGeometry args={[0.3, 6, 0.1]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
        {/* Hub */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
      </group>
    </group>
  );
}
