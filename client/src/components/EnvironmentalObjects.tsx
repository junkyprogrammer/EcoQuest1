import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Controls } from "../App";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

// Component for the realistic tree
function RealisticTree({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/realistic_tree.glb');
  const meshRef = useRef<THREE.Group>(null);

  // Gentle swaying animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <primitive 
        object={scene.clone()} 
        scale={[2.5, 2.5, 2.5]}
        castShadow 
        receiveShadow
      />
    </group>
  );
}

export default function EnvironmentalObjects() {
  const { openMiniGame, openQuiz, addToInventory, addScore, updateObjectiveProgress } = useGameState();
  const { playSuccess } = useAudio();
  const [, get] = useKeyboardControls<Controls>();
  
  const playerRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [nearbyInteractables, setNearbyInteractables] = useState<{type: string, id: number, distance: number}[]>([]);

  // Pre-calculate positions for recycling bins
  const recyclingBins = useMemo(() => [
    { position: [10, 1, 5] as [number, number, number], type: 'plastic', color: '#2196F3' },
    { position: [12, 1, 5] as [number, number, number], type: 'paper', color: '#4CAF50' },
    { position: [14, 1, 5] as [number, number, number], type: 'glass', color: '#FF9800' },
    { position: [-10, 1, -10] as [number, number, number], type: 'plastic', color: '#2196F3' }
  ], []);

  // Quiz stations
  const quizStations = useMemo(() => [
    { position: [-15, 2, 15] as [number, number, number], topic: 'Climate Change' },
    { position: [25, 2, -15] as [number, number, number], topic: 'Renewable Energy' }
  ], []);

  useFrame((state) => {
    // Update player position reference
    const camera = state.camera;
    playerRef.current.set(camera.position.x, 1, camera.position.z - 12);

    // Track nearby interactables for UI feedback
    const nearby: {type: string, id: number, distance: number}[] = [];
    const playerPos = playerRef.current;

    // Check recycling bins
    recyclingBins.forEach((bin, index) => {
      const distance = playerPos.distanceTo(new THREE.Vector3(...bin.position));
      if (distance < 5) {
        nearby.push({type: 'recycling', id: index, distance});
      }
    });

    // Check quiz stations
    quizStations.forEach((station, index) => {
      const distance = playerPos.distanceTo(new THREE.Vector3(...station.position));
      if (distance < 5) {
        nearby.push({type: 'quiz', id: index, distance});
      }
    });

    setNearbyInteractables(nearby);

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
        updateObjectiveProgress('recycle', 'Recyclables', 1);
        playSuccess();
      }
    });

    // Check quiz station interactions
    quizStations.forEach((station, index) => {
      const distance = playerPos.distanceTo(new THREE.Vector3(...station.position));
      if (distance < 3) {
        openQuiz();
        addScore(50);
        updateObjectiveProgress('quiz', station.topic === 'Climate Change' ? 'climate' : 'all', 1);
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
          {/* Enhanced Interaction indicator */}
          <InteractionIndicator 
            position={[0, 3, 0]} 
            isNearby={nearbyInteractables.some(item => item.type === 'recycling' && item.id === index)}
            distance={nearbyInteractables.find(item => item.type === 'recycling' && item.id === index)?.distance || 10}
            label="Press E to Recycle"
          />
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
          {/* Enhanced Interaction indicator */}
          <InteractionIndicator 
            position={[0, 4, 0]} 
            isNearby={nearbyInteractables.some(item => item.type === 'quiz' && item.id === index)}
            distance={nearbyInteractables.find(item => item.type === 'quiz' && item.id === index)?.distance || 10}
            label="Press E for Quiz"
          />
        </group>
      ))}

      {/* Realistic Trees */}
      <RealisticTree position={[-5, 0, -8]} />
      <RealisticTree position={[8, 0, -12]} />
      <RealisticTree position={[-12, 0, 8]} />
      <RealisticTree position={[15, 0, 10]} />
      <RealisticTree position={[-18, 0, -5]} />

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

function InteractionIndicator({ 
  position, 
  isNearby, 
  distance, 
  label 
}: { 
  position: [number, number, number], 
  isNearby: boolean,
  distance: number,
  label: string
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      // Pulsing effect when nearby
      const scale = isNearby ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2 : 1;
      meshRef.current.scale.setScalar(scale);
    }

    if (textRef.current && isNearby) {
      // Text floating animation
      textRef.current.position.y = position[1] + 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const opacity = isNearby ? Math.max(0.8, 1 - distance / 5) : 0.4;
  const color = isNearby ? "#FFD700" : "#FFFF00";

  return (
    <group>
      {/* Main indicator sphere */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 12, 8]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={opacity}
        />
      </mesh>
      
      {/* Interaction prompt text when nearby */}
      {isNearby && distance < 3 && (
        <mesh ref={textRef} position={[0, position[1] + 0.8, 0]}>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* Outer ring for enhanced visibility */}
      {isNearby && (
        <mesh position={position}>
          <ringGeometry args={[0.4, 0.5, 16]} />
          <meshBasicMaterial 
            color={color}
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
