import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function CollectibleItems() {
  const { addToInventory, addScore, updateObjectiveProgress } = useGameState();
  const { playSuccess } = useAudio();
  
  const playerRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const collectedItems = useRef<Set<number>>(new Set());

  // Pre-calculate collectible positions
  const collectibles = useMemo(() => {
    const items = [];
    
    // Seeds/Plants
    for (let i = 0; i < 15; i++) {
      items.push({
        id: i,
        type: 'plant',
        position: [
          (Math.random() - 0.5) * 60,
          0.5,
          (Math.random() - 0.5) * 60
        ] as [number, number, number],
        color: '#4CAF50',
        points: 25
      });
    }
    
    // Energy orbs
    for (let i = 15; i < 25; i++) {
      items.push({
        id: i,
        type: 'energy',
        position: [
          (Math.random() - 0.5) * 70,
          2,
          (Math.random() - 0.5) * 70
        ] as [number, number, number],
        color: '#FFD700',
        points: 50
      });
    }

    return items;
  }, []);

  useFrame((state) => {
    // Update player position reference
    const camera = state.camera;
    playerRef.current.set(camera.position.x, 1, camera.position.z - 12);

    // Check for collectible interactions
    collectibles.forEach((item) => {
      if (collectedItems.current.has(item.id)) return;
      
      const distance = playerRef.current.distanceTo(new THREE.Vector3(...item.position));
      if (distance < 2) {
        // Collect the item
        collectedItems.current.add(item.id);
        addScore(item.points);
        
        if (item.type === 'plant') {
          addToInventory("Plants", 1);
          updateObjectiveProgress('collect', 'Plants', 1);
        } else if (item.type === 'energy') {
          addToInventory("Clean Energy", 1);
          updateObjectiveProgress('collect', 'Clean Energy', 1);
        }
        
        playSuccess();
      }
    });
  });

  return (
    <group>
      {collectibles.map((item) => {
        if (collectedItems.current.has(item.id)) return null;
        
        return (
          <CollectibleItem
            key={item.id}
            position={item.position}
            color={item.color}
            type={item.type}
          />
        );
      })}
    </group>
  );
}

function CollectibleItem({ 
  position, 
  color, 
  type 
}: { 
  position: [number, number, number], 
  color: string,
  type: string
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      // Rotation animation
      meshRef.current.rotation.y += 0.02;
    }
  });

  if (type === 'plant') {
    return (
      <mesh ref={meshRef} position={position} castShadow>
        <octahedronGeometry args={[0.3]} />
        <meshLambertMaterial color={color} />
      </mesh>
    );
  }

  if (type === 'energy') {
    return (
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    );
  }

  return null;
}
