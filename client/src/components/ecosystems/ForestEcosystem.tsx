import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";

interface ForestEcosystemProps {
  isTransitioning: boolean;
}

export default function ForestEcosystem({ isTransitioning }: ForestEcosystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { addScore, addToInventory } = useGameState();
  const { playSuccess } = useAudio();
  
  // Textures
  const grassTexture = useTexture("/textures/grass.png");
  const woodTexture = useTexture("/textures/wood.jpg");
  
  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(25, 25);
  
  // Configure wood texture
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(2, 8);

  // Pre-calculated forest layout
  const forestLayout = useMemo(() => {
    const trees: Array<{position: [number, number, number]; scale: number; type: 'oak' | 'pine' | 'birch'}> = [];
    const animals: Array<{position: [number, number, number]; type: 'deer' | 'rabbit' | 'bird'}> = [];
    const collectibles: Array<{position: [number, number, number]; type: 'seed' | 'flower' | 'mushroom'}> = [];
    const pollutionSources: Array<{position: [number, number, number]; type: 'litter' | 'deadTree'}> = [];

    // Generate diverse tree types across the forest
    for (let i = 0; i < 35; i++) {
      const x = (Math.random() - 0.5) * 90;
      const z = (Math.random() - 0.5) * 90;
      const scale = 0.8 + Math.random() * 0.6;
      const types: Array<'oak' | 'pine' | 'birch'> = ['oak', 'pine', 'birch'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      trees.push({
        position: [x, 0, z],
        scale,
        type
      });
    }

    // Add forest animals
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 70;
      const z = (Math.random() - 0.5) * 70;
      const animalTypes: Array<'deer' | 'rabbit' | 'bird'> = ['deer', 'rabbit', 'bird'];
      const type = animalTypes[Math.floor(Math.random() * animalTypes.length)];
      
      animals.push({
        position: [x, type === 'bird' ? 3 + Math.random() * 2 : 0, z],
        type
      });
    }

    // Add collectible educational items
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      const collectibleTypes: Array<'seed' | 'flower' | 'mushroom'> = ['seed', 'flower', 'mushroom'];
      const type = collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
      
      collectibles.push({
        position: [x, 0.2, z],
        type
      });
    }

    // Add pollution sources to clean up
    for (let i = 0; i < 8; i++) {
      const x = (Math.random() - 0.5) * 85;
      const z = (Math.random() - 0.5) * 85;
      const pollutionTypes: Array<'litter' | 'deadTree'> = ['litter', 'deadTree'];
      const type = pollutionTypes[Math.floor(Math.random() * pollutionTypes.length)];
      
      pollutionSources.push({
        position: [x, type === 'litter' ? 0.1 : 0, z],
        type
      });
    }

    return { trees, animals, collectibles, pollutionSources };
  }, []);

  // Animated wildlife behavior
  useFrame((state, delta) => {
    if (groupRef.current && !isTransitioning) {
      const time = state.clock.elapsedTime;
      
      // Animate birds flying in patterns
      groupRef.current.children.forEach((child, index) => {
        if (child.userData.type === 'bird') {
          const birdPhase = time * 0.5 + index;
          child.position.y = 3 + Math.sin(birdPhase) * 1.5;
          child.position.x += Math.sin(birdPhase * 0.3) * delta * 0.5;
          child.rotation.y = Math.sin(birdPhase * 0.2) * 0.2;
        }
        
        // Make animals look around
        if (child.userData.type === 'deer' || child.userData.type === 'rabbit') {
          child.rotation.y = Math.sin(time * 0.8 + index) * 0.3;
        }
        
        // Gentle tree swaying in the wind
        if (child.userData.type === 'tree') {
          const treeWind = Math.sin(time * 0.4 + index * 0.1) * 0.02;
          child.rotation.z = treeWind;
        }
        
        // Floating effect for collectibles
        if (child.userData.type === 'collectible') {
          child.position.y = 0.2 + Math.sin(time * 2 + index) * 0.1;
          child.rotation.y += delta * 0.5;
        }
      });
    }
  });

  const handleCollectibleClick = (type: string, position: THREE.Vector3) => {
    addScore(25);
    addToInventory(type === 'seed' ? 'Seeds' : type === 'flower' ? 'Flowers' : 'Mushrooms', 1);
    playSuccess();
    
    console.log(`Collected forest ${type} at`, position);
    // TODO: Remove collectible from scene after collection
  };

  const renderTree = (tree: typeof forestLayout.trees[0], index: number) => {
    const { position, scale, type } = tree;
    
    return (
      <group key={`tree-${index}`} position={position} scale={scale} userData={{ type: 'tree' }}>
        {/* Stylized tree trunk with vibrant colors */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[
            type === 'birch' ? 0.25 : type === 'pine' ? 0.3 : 0.4,
            type === 'birch' ? 0.35 : type === 'pine' ? 0.4 : 0.5,
            type === 'pine' ? 5 : 4,
            8
          ]} />
          <meshLambertMaterial 
            color={type === 'birch' ? '#DEB887' : type === 'pine' ? '#8B4513' : '#A0522D'}
          />
        </mesh>
        
        {/* Stylized foliage with bright, vibrant colors */}
        {type === 'pine' ? (
          // Stylized cone for pine trees with multiple layers
          <>
            <mesh position={[0, 5.5, 0]} castShadow>
              <coneGeometry args={[2.5, 4, 8]} />
              <meshLambertMaterial color="#32CD32" />
            </mesh>
            <mesh position={[0, 6.5, 0]} castShadow>
              <coneGeometry args={[2, 3, 8]} />
              <meshLambertMaterial color="#7CFC00" />
            </mesh>
            <mesh position={[0, 7.2, 0]} castShadow>
              <coneGeometry args={[1.5, 2, 8]} />
              <meshLambertMaterial color="#00FF00" />
            </mesh>
          </>
        ) : (
          // Layered spherical foliage for oak and birch
          <>
            {/* Main foliage layer */}
            <mesh position={[0, type === 'birch' ? 4.5 : 5, 0]} castShadow>
              <sphereGeometry args={[
                type === 'birch' ? 1.8 : 2.2,
                12, 8
              ]} />
              <meshLambertMaterial color={type === 'birch' ? '#7CFC00' : '#32CD32'} />
            </mesh>
            
            {/* Secondary foliage layer for depth */}
            <mesh position={[0, type === 'birch' ? 5.2 : 5.8, 0]} castShadow>
              <sphereGeometry args={[
                type === 'birch' ? 1.4 : 1.8,
                12, 8
              ]} />
              <meshLambertMaterial color={type === 'birch' ? '#00FF00' : '#228B22'} />
            </mesh>
            
            {/* Top highlight for cartoon effect */}
            <mesh position={[0, type === 'birch' ? 5.8 : 6.5, 0]} castShadow>
              <sphereGeometry args={[
                type === 'birch' ? 1 : 1.2,
                12, 8
              ]} />
              <meshLambertMaterial color="#ADFF2F" />
            </mesh>
          </>
        )}
        
        {/* Stylized glow effect for Free Fire aesthetic */}
        <mesh position={[0, type === 'pine' ? 6 : 5, 0]}>
          <sphereGeometry args={[
            type === 'pine' ? 3 : (type === 'birch' ? 2.2 : 2.6),
            16, 12
          ]} />
          <meshBasicMaterial 
            color="#90EE90" 
            transparent 
            opacity={0.08}
          />
        </mesh>
      </group>
    );
  };

  const renderAnimal = (animal: typeof forestLayout.animals[0], index: number) => {
    const { position, type } = animal;
    
    return (
      <group key={`animal-${index}`} position={position} userData={{ type }}>
        {type === 'deer' && (
          <>
            {/* Minecraft-style deer body - larger and more blocky */}
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[1.0, 0.8, 1.6]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Minecraft-style deer head - cubic */}
            <mesh position={[0, 1.6, 0.9]} castShadow>
              <boxGeometry args={[0.5, 0.5, 0.7]} />
              <meshLambertMaterial color="#A0522D" />
            </mesh>
            {/* Minecraft-style blocky antlers */}
            <mesh position={[-0.15, 2.1, 0.8]} castShadow>
              <boxGeometry args={[0.08, 0.6, 0.08]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            <mesh position={[0.15, 2.1, 0.8]} castShadow>
              <boxGeometry args={[0.08, 0.6, 0.08]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            {/* Antler branches - blocky style */}
            <mesh position={[-0.15, 2.3, 0.6]} castShadow>
              <boxGeometry args={[0.06, 0.06, 0.3]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            <mesh position={[0.15, 2.3, 0.6]} castShadow>
              <boxGeometry args={[0.06, 0.06, 0.3]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            {/* Minecraft-style deer legs */}
            <mesh position={[-0.3, 0.4, 0.4]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            <mesh position={[0.3, 0.4, 0.4]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            <mesh position={[-0.3, 0.4, -0.4]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            <mesh position={[0.3, 0.4, -0.4]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
          </>
        )}
        
        {type === 'rabbit' && (
          <>
            {/* Minecraft-style rabbit body - cubic */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.5, 0.4, 0.7]} />
              <meshLambertMaterial color="#F0F0F0" />
            </mesh>
            {/* Minecraft-style rabbit head - cubic */}
            <mesh position={[0, 0.7, 0.4]} castShadow>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshLambertMaterial color="#F0F0F0" />
            </mesh>
            {/* Minecraft-style blocky rabbit ears */}
            <mesh position={[-0.08, 1.1, 0.35]} castShadow>
              <boxGeometry args={[0.06, 0.4, 0.06]} />
              <meshLambertMaterial color="#FFB6C1" />
            </mesh>
            <mesh position={[0.08, 1.1, 0.35]} castShadow>
              <boxGeometry args={[0.06, 0.4, 0.06]} />
              <meshLambertMaterial color="#FFB6C1" />
            </mesh>
            {/* Minecraft-style rabbit tail */}
            <mesh position={[0, 0.5, -0.4]} castShadow>
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshLambertMaterial color="#FFFFFF" />
            </mesh>
            {/* Blocky rabbit feet */}
            <mesh position={[-0.15, 0.1, 0.2]} castShadow>
              <boxGeometry args={[0.12, 0.2, 0.25]} />
              <meshLambertMaterial color="#FFB6C1" />
            </mesh>
            <mesh position={[0.15, 0.1, 0.2]} castShadow>
              <boxGeometry args={[0.12, 0.2, 0.25]} />
              <meshLambertMaterial color="#FFB6C1" />
            </mesh>
          </>
        )}
        
        {type === 'bird' && (
          <>
            {/* Minecraft-style bird body - rectangular */}
            <mesh castShadow>
              <boxGeometry args={[0.25, 0.2, 0.35]} />
              <meshLambertMaterial color="#4169E1" />
            </mesh>
            {/* Minecraft-style bird head */}
            <mesh position={[0, 0.15, 0.25]} castShadow>
              <boxGeometry args={[0.15, 0.15, 0.15]} />
              <meshLambertMaterial color="#1E90FF" />
            </mesh>
            {/* Minecraft-style blocky bird wings */}
            <mesh position={[-0.25, 0, 0]} castShadow rotation={[0, 0, Math.PI/6]}>
              <boxGeometry args={[0.35, 0.08, 0.2]} />
              <meshLambertMaterial color="#0000FF" />
            </mesh>
            <mesh position={[0.25, 0, 0]} castShadow rotation={[0, 0, -Math.PI/6]}>
              <boxGeometry args={[0.35, 0.08, 0.2]} />
              <meshLambertMaterial color="#0000FF" />
            </mesh>
            {/* Minecraft-style bird tail */}
            <mesh position={[0, 0, -0.3]} castShadow>
              <boxGeometry args={[0.15, 0.08, 0.2]} />
              <meshLambertMaterial color="#000080" />
            </mesh>
            {/* Minecraft-style bird beak */}
            <mesh position={[0, 0.15, 0.35]} castShadow>
              <boxGeometry args={[0.04, 0.04, 0.1]} />
              <meshLambertMaterial color="#FFA500" />
            </mesh>
          </>
        )}
      </group>
    );
  };

  const renderCollectible = (collectible: typeof forestLayout.collectibles[0], index: number) => {
    const { position, type } = collectible;
    
    return (
      <group 
        key={`collectible-${index}`} 
        position={position}
        userData={{ type: 'collectible' }}
        onClick={(e) => {
          e.stopPropagation();
          handleCollectibleClick(type, new THREE.Vector3(...position));
        }}
      >
        {type === 'seed' && (
          <mesh castShadow>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
        )}
        
        {type === 'flower' && (
          <>
            {/* Flower center */}
            <mesh position={[0, 0.1, 0]} castShadow>
              <sphereGeometry args={[0.08, 8, 6]} />
              <meshLambertMaterial color="#FFD700" />
            </mesh>
            {/* Flower petals */}
            {[0, 1, 2, 3, 4].map(i => (
              <mesh 
                key={i}
                position={[
                  Math.cos((i * Math.PI * 2) / 5) * 0.15,
                  0.1,
                  Math.sin((i * Math.PI * 2) / 5) * 0.15
                ]}
                castShadow
              >
                <sphereGeometry args={[0.06, 6, 4]} />
                <meshLambertMaterial color="#FF69B4" />
              </mesh>
            ))}
          </>
        )}
        
        {type === 'mushroom' && (
          <>
            {/* Mushroom stem */}
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.2]} />
              <meshLambertMaterial color="#F5F5DC" />
            </mesh>
            {/* Mushroom cap */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <sphereGeometry args={[0.12, 8, 6]} />
              <meshLambertMaterial color="#DC143C" />
            </mesh>
          </>
        )}
        
        {/* Glow effect */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 12]} />
          <meshBasicMaterial color="#90EE90" transparent opacity={0.1} />
        </mesh>
      </group>
    );
  };

  const renderPollutionSource = (pollution: typeof forestLayout.pollutionSources[0], index: number) => {
    const { position, type } = pollution;
    
    return (
      <group 
        key={`pollution-${index}`} 
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          addScore(50);
          addToInventory('Cleaned Pollution', 1);
          playSuccess();
          console.log(`Cleaned up ${type} pollution`);
        }}
      >
        {type === 'litter' && (
          <>
            {/* Trash bag */}
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.4, 0.2]} />
              <meshLambertMaterial color="#2F4F4F" />
            </mesh>
            {/* Warning sign */}
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.1, 8, 6]} />
              <meshBasicMaterial color="#FF0000" />
            </mesh>
          </>
        )}
        
        {type === 'deadTree' && (
          <>
            {/* Dead tree trunk */}
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.4, 4]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Dead branches */}
            <mesh position={[0, 3.5, 0]} castShadow>
              <sphereGeometry args={[1.5, 6, 4]} />
              <meshLambertMaterial color="#654321" transparent opacity={0.3} />
            </mesh>
          </>
        )}
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Stylized forest floor with vibrant grass */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial 
          map={grassTexture} 
          color="#228B22"  // Forest green tint for variety
        />
      </mesh>
      
      {/* Add forest-style overlay for depth */}
      <mesh position={[0, 0.003, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[95, 95]} />
        <meshBasicMaterial 
          color="#32CD32" 
          transparent 
          opacity={0.12}
        />
      </mesh>

      {/* Forest paths */}
      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 90]} />
        <meshLambertMaterial color="#8B7D6B" />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 90]} />
        <meshLambertMaterial color="#8B7D6B" />
      </mesh>

      {/* Render all forest elements */}
      {forestLayout.trees.map(renderTree)}
      {forestLayout.animals.map(renderAnimal)}
      {forestLayout.collectibles.map(renderCollectible)}
      {forestLayout.pollutionSources.map(renderPollutionSource)}

      {/* Forest atmosphere particles */}
      <group>
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh
            key={`particle-${i}`}
            position={[
              (Math.random() - 0.5) * 80,
              1 + Math.random() * 3,
              (Math.random() - 0.5) * 80
            ]}
          >
            <sphereGeometry args={[0.05, 6, 4]} />
            <meshBasicMaterial color="#90EE90" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}