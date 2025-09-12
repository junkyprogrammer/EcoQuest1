import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

// Define interface for collectible items
interface CollectibleItemData {
  id: number;
  type: string;
  name: string;
  color: string;
  emissive: string;
  points: number;
  shape: string;
  position: [number, number, number];
  rotationSpeed: number;
  floatOffset: number;
  scale: number;
}

export default function CollectibleItems() {
  const { addToInventory, addScore, updateObjectiveProgress } = useGameState();
  const { playSuccess } = useAudio();
  
  const playerRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const collectedItems = useRef<Set<number>>(new Set());

  // Pre-calculate collectible positions with all 14 inventory types
  const collectibles = useMemo<CollectibleItemData[]>(() => {
    const items: CollectibleItemData[] = [];
    
    const itemTypes = [
      { type: 'recyclable', name: 'Recyclables', color: '#2196F3', points: 10, shape: 'cylinder', emissive: '#1976D2' },
      { type: 'energy', name: 'Clean Energy', color: '#FFD700', points: 50, shape: 'sphere', emissive: '#FFC700' },
      { type: 'plant', name: 'Plants', color: '#4CAF50', points: 25, shape: 'cone', emissive: '#388E3C' },
      { type: 'seed', name: 'Seeds', color: '#8B4513', points: 15, shape: 'dodecahedron', emissive: '#6B3410' },
      { type: 'flower', name: 'Flowers', color: '#FF69B4', points: 20, shape: 'tetrahedron', emissive: '#FF1493' },
      { type: 'mushroom', name: 'Mushrooms', color: '#DC143C', points: 30, shape: 'torus', emissive: '#B91C1C' },
      { type: 'pearl', name: 'Pearls', color: '#F8F8FF', points: 40, shape: 'sphere', emissive: '#E0E0E0' },
      { type: 'shell', name: 'Shells', color: '#FFA500', points: 35, shape: 'cone', emissive: '#FF8C00' },
      { type: 'seaweed', name: 'Seaweed', color: '#2E8B57', points: 20, shape: 'box', emissive: '#228B22' },
      { type: 'ocean_cleanup', name: 'Ocean Cleanup Points', color: '#00CED1', points: 45, shape: 'icosahedron', emissive: '#00A9AC' },
      { type: 'renewable', name: 'Renewable Energy Installed', color: '#FF8C00', points: 60, shape: 'octahedron', emissive: '#FF6F00' },
      { type: 'pollution_reduced', name: 'Pollution Reduced', color: '#696969', points: 55, shape: 'torusKnot', emissive: '#90EE90' },
      { type: 'green_space', name: 'Green Spaces Created', color: '#32CD32', points: 50, shape: 'tetrahedron', emissive: '#228B22' },
      { type: 'cleaned', name: 'Cleaned Pollution', color: '#F0F8FF', points: 40, shape: 'dodecahedron', emissive: '#ADD8E6' }
    ];
    
    // Generate 10-15 items for each type distributed across the playground
    itemTypes.forEach((itemType, typeIndex) => {
      const itemCount = 10 + Math.floor(Math.random() * 6); // 10-15 items per type
      
      for (let i = 0; i < itemCount; i++) {
        // Distribute items across a wider area
        const angle = (Math.PI * 2 * i) / itemCount + (Math.random() - 0.5) * 0.5;
        const radius = 15 + Math.random() * 50; // 15-65 units from center
        
        items.push({
          id: typeIndex * 100 + i,
          type: itemType.type,
          name: itemType.name,
          color: itemType.color,
          emissive: itemType.emissive,
          points: itemType.points,
          shape: itemType.shape,
          position: [
            Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
            0.5 + Math.random() * 2, // Vary height between 0.5 and 2.5
            Math.sin(angle) * radius + (Math.random() - 0.5) * 20
          ] as [number, number, number],
          rotationSpeed: 0.5 + Math.random() * 1.5, // Random rotation speed
          floatOffset: Math.random() * Math.PI * 2, // Random float phase
          scale: 0.8 + Math.random() * 0.4 // Size variation
        });
      }
    });

    return items.sort(() => Math.random() - 0.5); // Shuffle for better distribution
  }, []);

  useFrame((state) => {
    // Update player position reference
    const camera = state.camera;
    playerRef.current.set(camera.position.x, 1, camera.position.z - 12);

    // Check for collectible interactions
    collectibles.forEach((item) => {
      if (collectedItems.current.has(item.id)) return;
      
      const distance = playerRef.current.distanceTo(new THREE.Vector3(...item.position));
      if (distance < 2.5) { // Slightly larger collection radius
        // Collect the item
        collectedItems.current.add(item.id);
        addScore(item.points);
        addToInventory(item.name, 1);
        updateObjectiveProgress('collect', item.name, 1);
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
            emissive={item.emissive}
            shape={item.shape}
            rotationSpeed={item.rotationSpeed}
            floatOffset={item.floatOffset}
            scale={item.scale}
          />
        );
      })}
    </group>
  );
}

function CollectibleItem({ 
  position, 
  color, 
  emissive,
  shape,
  rotationSpeed,
  floatOffset,
  scale
}: { 
  position: [number, number, number], 
  color: string,
  emissive: string,
  shape: string,
  rotationSpeed: number,
  floatOffset: number,
  scale: number
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation with unique offset
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + floatOffset) * 0.3;
      // Rotation animation with varying speed
      meshRef.current.rotation.y += 0.01 * rotationSpeed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + floatOffset) * 0.1;
    }
  });

  // Render different geometries based on shape type
  const renderGeometry = () => {
    switch(shape) {
      case 'sphere':
        return <sphereGeometry args={[0.4 * scale, 16, 12]} />;
      case 'box':
        return <boxGeometry args={[0.6 * scale, 0.6 * scale, 0.6 * scale]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.3 * scale, 0.3 * scale, 0.8 * scale, 8]} />;
      case 'cone':
        return <coneGeometry args={[0.4 * scale, 0.8 * scale, 8]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.5 * scale]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.6 * scale]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.4 * scale]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.5 * scale]} />;
      case 'torus':
        return <torusGeometry args={[0.4 * scale, 0.15 * scale, 8, 16]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={[0.3 * scale, 0.1 * scale, 64, 8]} />;
      default:
        return <octahedronGeometry args={[0.4 * scale]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      {renderGeometry()}
      <meshPhongMaterial 
        color={color} 
        emissive={emissive}
        emissiveIntensity={0.3}
        shininess={100}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
