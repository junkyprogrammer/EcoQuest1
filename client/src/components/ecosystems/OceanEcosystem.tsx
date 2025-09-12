import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";

interface OceanEcosystemProps {
  isTransitioning: boolean;
}

export default function OceanEcosystem({ isTransitioning }: OceanEcosystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const oceanRef = useRef<THREE.Mesh>(null);
  const { addScore, addToInventory } = useGameState();
  const { playSuccess } = useAudio();
  
  // Textures
  const sandTexture = useTexture("/textures/sand.jpg");
  
  // Configure sand texture
  sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
  sandTexture.repeat.set(30, 30);

  // Pre-calculated ocean layout
  const oceanLayout = useMemo(() => {
    const coralReefs: Array<{position: [number, number, number]; health: 'healthy' | 'bleached' | 'damaged'}> = [];
    const marineLife: Array<{position: [number, number, number]; type: 'fish' | 'turtle' | 'dolphin' | 'octopus'}> = [];
    const plasticWaste: Array<{position: [number, number, number]; type: 'bottle' | 'bag' | 'microplastic'}> = [];
    const treasures: Array<{position: [number, number, number]; type: 'pearl' | 'shell' | 'seaweed'}> = [];

    // Generate coral reef formations
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      const healthStates: Array<'healthy' | 'bleached' | 'damaged'> = ['healthy', 'bleached', 'damaged'];
      const health = healthStates[Math.floor(Math.random() * healthStates.length)];
      
      coralReefs.push({
        position: [x, -2 - Math.random() * 3, z],
        health
      });
    }

    // Add diverse marine life
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 90;
      const y = -1 - Math.random() * 8; // Various depths
      const z = (Math.random() - 0.5) * 90;
      const marineTypes: Array<'fish' | 'turtle' | 'dolphin' | 'octopus'> = ['fish', 'turtle', 'dolphin', 'octopus'];
      const type = marineTypes[Math.floor(Math.random() * marineTypes.length)];
      
      marineLife.push({
        position: [x, y, z],
        type
      });
    }

    // Add plastic pollution to clean up
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 85;
      const y = -0.5 - Math.random() * 5;
      const z = (Math.random() - 0.5) * 85;
      const wasteTypes: Array<'bottle' | 'bag' | 'microplastic'> = ['bottle', 'bag', 'microplastic'];
      const type = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      
      plasticWaste.push({
        position: [x, y, z],
        type
      });
    }

    // Add ocean treasures and educational items
    for (let i = 0; i < 18; i++) {
      const x = (Math.random() - 0.5) * 85;
      const y = -1 - Math.random() * 4;
      const z = (Math.random() - 0.5) * 85;
      const treasureTypes: Array<'pearl' | 'shell' | 'seaweed'> = ['pearl', 'shell', 'seaweed'];
      const type = treasureTypes[Math.floor(Math.random() * treasureTypes.length)];
      
      treasures.push({
        position: [x, y, z],
        type
      });
    }

    return { coralReefs, marineLife, plasticWaste, treasures };
  }, []);

  // Ocean wave animation and marine life behavior
  useFrame((state, delta) => {
    if (groupRef.current && !isTransitioning) {
      const time = state.clock.elapsedTime;
      
      // Animate ocean waves
      if (oceanRef.current) {
        const position = oceanRef.current.geometry.attributes.position;
        const array = position.array as Float32Array;
        
        for (let i = 0; i < array.length; i += 3) {
          const x = array[i];
          const z = array[i + 2];
          array[i + 1] = Math.sin(time * 0.8 + x * 0.1) * 0.3 + Math.cos(time * 0.5 + z * 0.1) * 0.2;
        }
        position.needsUpdate = true;
      }
      
      // Animate marine life
      groupRef.current.children.forEach((child, index) => {
        if (child.userData.type === 'fish') {
          // Fish swimming in schools
          const fishPhase = time * 1.5 + index;
          child.position.x += Math.sin(fishPhase * 0.5) * delta * 2;
          child.position.z += Math.cos(fishPhase * 0.3) * delta * 1.5;
          child.rotation.y = Math.atan2(Math.sin(fishPhase * 0.5), Math.cos(fishPhase * 0.3)) + Math.PI / 2;
          
          // Vertical bobbing
          child.position.y += Math.sin(fishPhase * 2) * delta * 0.5;
        }
        
        if (child.userData.type === 'turtle') {
          // Slow, graceful turtle movement
          const turtlePhase = time * 0.3 + index;
          child.position.x += Math.sin(turtlePhase) * delta * 0.8;
          child.rotation.y = turtlePhase * 0.5;
        }
        
        if (child.userData.type === 'dolphin') {
          // Dolphins jumping and diving
          const dolphinPhase = time * 2 + index;
          child.position.y = -2 + Math.sin(dolphinPhase) * 3;
          child.position.x += Math.cos(dolphinPhase * 0.4) * delta * 3;
          child.rotation.z = Math.sin(dolphinPhase) * 0.5;
        }
        
        if (child.userData.type === 'octopus') {
          // Octopus tentacle movement
          child.rotation.x = Math.sin(time + index) * 0.3;
          child.rotation.z = Math.cos(time * 1.2 + index) * 0.2;
        }
        
        // Floating effect for treasures
        if (child.userData.type === 'treasure') {
          child.position.y += Math.sin(time * 1.5 + index) * delta * 0.3;
          child.rotation.y += delta * 0.8;
        }
        
        // Bobbing plastic waste
        if (child.userData.type === 'pollution') {
          child.position.y += Math.sin(time + index) * delta * 0.4;
          child.rotation.x += delta * 0.5;
          child.rotation.z += delta * 0.3;
        }
        
        // Coral reef gentle swaying
        if (child.userData.type === 'coral') {
          child.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
          child.rotation.z = Math.cos(time * 0.3 + index) * 0.1;
        }
      });
    }
  });

  const handleTreasureClick = (type: string, position: THREE.Vector3) => {
    addScore(35);
    addToInventory(type === 'pearl' ? 'Pearls' : type === 'shell' ? 'Shells' : 'Seaweed', 1);
    playSuccess();
    
    console.log(`Collected ocean ${type} at`, position);
  };

  const handlePollutionCleanup = (type: string, position: THREE.Vector3) => {
    addScore(60);
    addToInventory('Ocean Cleanup Points', 1);
    playSuccess();
    
    console.log(`Cleaned up ${type} pollution from ocean`);
  };

  const renderCoralReef = (coral: typeof oceanLayout.coralReefs[0], index: number) => {
    const { position, health } = coral;
    const healthColor = health === 'healthy' ? '#FF6347' : health === 'bleached' ? '#F5F5DC' : '#8B4513';
    
    return (
      <group key={`coral-${index}`} position={position} userData={{ type: 'coral' }}>
        {/* Main coral structure */}
        <mesh castShadow receiveShadow>
          <coneGeometry args={[0.8, 1.5, 6]} />
          <meshLambertMaterial color={healthColor} />
        </mesh>
        
        {/* Coral branches */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh 
            key={i}
            position={[
              Math.cos((i * Math.PI * 2) / 5) * 0.6,
              0.3,
              Math.sin((i * Math.PI * 2) / 5) * 0.6
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.15, 0.8]} />
            <meshLambertMaterial color={healthColor} />
          </mesh>
        ))}
        
        {/* Coral polyps */}
        {health === 'healthy' && Array.from({ length: 8 }).map((_, i) => (
          <mesh 
            key={`polyp-${i}`}
            position={[
              (Math.random() - 0.5) * 1.5,
              Math.random() * 1,
              (Math.random() - 0.5) * 1.5
            ]}
            castShadow
          >
            <sphereGeometry args={[0.08, 6, 4]} />
            <meshLambertMaterial color="#FF69B4" />
          </mesh>
        ))}
      </group>
    );
  };

  const renderMarineLife = (marine: typeof oceanLayout.marineLife[0], index: number) => {
    const { position, type } = marine;
    
    return (
      <group key={`marine-${index}`} position={position} userData={{ type }}>
        {type === 'fish' && (
          <>
            {/* Fish body */}
            <mesh castShadow>
              <sphereGeometry args={[0.3, 8, 6]} />
              <meshLambertMaterial color="#4169E1" />
            </mesh>
            {/* Fish tail */}
            <mesh position={[-0.4, 0, 0]} castShadow>
              <coneGeometry args={[0.2, 0.4, 4]} />
              <meshLambertMaterial color="#1E90FF" />
            </mesh>
            {/* Fish fins */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.05]} />
              <meshLambertMaterial color="#87CEEB" />
            </mesh>
          </>
        )}
        
        {type === 'turtle' && (
          <>
            {/* Turtle shell */}
            <mesh castShadow>
              <sphereGeometry args={[0.8, 8, 6]} />
              <meshLambertMaterial color="#8FBC8F" />
            </mesh>
            {/* Turtle flippers */}
            <mesh position={[-0.6, 0, 0.4]} castShadow>
              <boxGeometry args={[0.4, 0.1, 0.6]} />
              <meshLambertMaterial color="#2F4F4F" />
            </mesh>
            <mesh position={[0.6, 0, 0.4]} castShadow>
              <boxGeometry args={[0.4, 0.1, 0.6]} />
              <meshLambertMaterial color="#2F4F4F" />
            </mesh>
            {/* Turtle head */}
            <mesh position={[0, 0, 1]} castShadow>
              <sphereGeometry args={[0.3, 8, 6]} />
              <meshLambertMaterial color="#556B2F" />
            </mesh>
          </>
        )}
        
        {type === 'dolphin' && (
          <>
            {/* Dolphin body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.4, 0.2, 2]} />
              <meshLambertMaterial color="#708090" />
            </mesh>
            {/* Dolphin nose */}
            <mesh position={[0, 0, 1.2]} castShadow>
              <coneGeometry args={[0.15, 0.4]} />
              <meshLambertMaterial color="#696969" />
            </mesh>
            {/* Dolphin fin */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.1, 0.6, 0.3]} />
              <meshLambertMaterial color="#2F4F4F" />
            </mesh>
          </>
        )}
        
        {type === 'octopus' && (
          <>
            {/* Octopus head */}
            <mesh castShadow>
              <sphereGeometry args={[0.5, 8, 6]} />
              <meshLambertMaterial color="#8B008B" />
            </mesh>
            {/* Octopus tentacles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh 
                key={`tentacle-${i}`}
                position={[
                  Math.cos((i * Math.PI * 2) / 8) * 0.8,
                  -0.3,
                  Math.sin((i * Math.PI * 2) / 8) * 0.8
                ]}
                castShadow
              >
                <cylinderGeometry args={[0.08, 0.15, 1.2]} />
                <meshLambertMaterial color="#9932CC" />
              </mesh>
            ))}
          </>
        )}
      </group>
    );
  };

  const renderPlasticWaste = (waste: typeof oceanLayout.plasticWaste[0], index: number) => {
    const { position, type } = waste;
    
    return (
      <group 
        key={`waste-${index}`} 
        position={position}
        userData={{ type: 'pollution' }}
        onClick={(e) => {
          e.stopPropagation();
          handlePollutionCleanup(type, new THREE.Vector3(...position));
        }}
      >
        {type === 'bottle' && (
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.08, 0.6]} />
            <meshLambertMaterial color="#FF6B6B" transparent opacity={0.8} />
          </mesh>
        )}
        
        {type === 'bag' && (
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.6, 0.1]} />
            <meshLambertMaterial color="#2F4F4F" transparent opacity={0.7} />
          </mesh>
        )}
        
        {type === 'microplastic' && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh 
                key={i}
                position={[
                  (Math.random() - 0.5) * 0.5,
                  (Math.random() - 0.5) * 0.3,
                  (Math.random() - 0.5) * 0.5
                ]}
                castShadow
              >
                <sphereGeometry args={[0.02, 6, 4]} />
                <meshLambertMaterial color="#FF4500" />
              </mesh>
            ))}
          </>
        )}
        
        {/* Warning indicator */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.08, 8, 6]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
      </group>
    );
  };

  const renderTreasure = (treasure: typeof oceanLayout.treasures[0], index: number) => {
    const { position, type } = treasure;
    
    return (
      <group 
        key={`treasure-${index}`} 
        position={position}
        userData={{ type: 'treasure' }}
        onClick={(e) => {
          e.stopPropagation();
          handleTreasureClick(type, new THREE.Vector3(...position));
        }}
      >
        {type === 'pearl' && (
          <mesh castShadow>
            <sphereGeometry args={[0.15, 12, 8]} />
            <meshLambertMaterial color="#F0F8FF" />
          </mesh>
        )}
        
        {type === 'shell' && (
          <>
            <mesh castShadow>
              <sphereGeometry args={[0.25, 8, 4]} />
              <meshLambertMaterial color="#FFE4E1" />
            </mesh>
            <mesh position={[0, 0.1, 0]} castShadow>
              <coneGeometry args={[0.15, 0.2, 8]} />
              <meshLambertMaterial color="#FFF8DC" />
            </mesh>
          </>
        )}
        
        {type === 'seaweed' && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <mesh 
                key={i}
                position={[
                  (Math.random() - 0.5) * 0.4,
                  0.5 + Math.random() * 0.8,
                  (Math.random() - 0.5) * 0.4
                ]}
                castShadow
              >
                <cylinderGeometry args={[0.05, 0.08, 1.2]} />
                <meshLambertMaterial color="#228B22" />
              </mesh>
            ))}
          </>
        )}
        
        {/* Glow effect */}
        <mesh>
          <sphereGeometry args={[0.4, 16, 12]} />
          <meshBasicMaterial color="#00FFFF" transparent opacity={0.1} />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Ocean floor */}
      <mesh position={[0, -5, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial map={sandTexture} />
      </mesh>

      {/* Ocean water surface with waves */}
      <mesh 
        ref={oceanRef}
        position={[0, 0, 0]} 
        receiveShadow 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshLambertMaterial 
          color="#006994" 
          transparent 
          opacity={0.7} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Underwater lighting effects */}
      <group>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={`light-ray-${i}`}
            position={[
              (Math.random() - 0.5) * 90,
              -1,
              (Math.random() - 0.5) * 90
            ]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          >
            <cylinderGeometry args={[0.1, 0.5, 8]} />
            <meshBasicMaterial color="#87CEEB" transparent opacity={0.2} />
          </mesh>
        ))}
      </group>

      {/* Render all ocean elements */}
      {oceanLayout.coralReefs.map(renderCoralReef)}
      {oceanLayout.marineLife.map(renderMarineLife)}
      {oceanLayout.plasticWaste.map(renderPlasticWaste)}
      {oceanLayout.treasures.map(renderTreasure)}

      {/* Bubbles and ocean atmosphere */}
      <group>
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh
            key={`bubble-${i}`}
            position={[
              (Math.random() - 0.5) * 85,
              -1 - Math.random() * 8,
              (Math.random() - 0.5) * 85
            ]}
          >
            <sphereGeometry args={[0.08 + Math.random() * 0.12, 8, 6]} />
            <meshBasicMaterial color="#87CEEB" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}