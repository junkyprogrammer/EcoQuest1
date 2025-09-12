import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import ForestEcosystem from "./ecosystems/ForestEcosystem";
import OceanEcosystem from "./ecosystems/OceanEcosystem";
import CityEcosystem from "./ecosystems/CityEcosystem";

export interface Ecosystem {
  id: string;
  name: string;
  description: string;
  environment: string;
  difficulty: 'easy' | 'medium' | 'hard';
  unlockScore: number;
  objectives: {
    primary: string[];
    secondary: string[];
    educational: string[];
  };
  rewards: {
    points: number;
    items: string[];
    unlocks?: string[];
  };
  timeLimit?: number;
  backgroundColor: string;
  ambientColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

export const ecosystems: Ecosystem[] = [
  {
    id: 'forest',
    name: 'Enchanted Forest',
    description: 'Restore the magical forest ecosystem by planting trees, protecting wildlife, and learning about biodiversity.',
    environment: 'forest',
    difficulty: 'easy',
    unlockScore: 0,
    objectives: {
      primary: [
        'Plant 10 native trees',
        'Protect 5 endangered species',
        'Clean up 3 pollution sources'
      ],
      secondary: [
        'Discover 15 plant species',
        'Complete forest conservation quiz',
        'Build 2 wildlife sanctuaries'
      ],
      educational: [
        'Learn about forest food chains',
        'Understand deforestation impacts',
        'Master carbon cycle concepts'
      ]
    },
    rewards: {
      points: 500,
      items: ['Forest Guardian Badge', 'Seedling Kit', 'Wildlife Guide'],
      unlocks: ['Ocean Ecosystem']
    },
    backgroundColor: '#87CEEB',
    ambientColor: '#90EE90',
    fogColor: '#B0E0E6',
    fogNear: 20,
    fogFar: 80
  },
  {
    id: 'ocean',
    name: 'Deep Blue Ocean',
    description: 'Dive into marine conservation by cleaning ocean plastic, protecting coral reefs, and saving sea creatures.',
    environment: 'ocean',
    difficulty: 'medium',
    unlockScore: 500,
    objectives: {
      primary: [
        'Remove 20 pieces of ocean plastic',
        'Restore 5 coral reef sections',
        'Rescue 8 marine animals'
      ],
      secondary: [
        'Catalog 12 marine species',
        'Complete ocean conservation quiz',
        'Establish 3 marine protected areas'
      ],
      educational: [
        'Learn about ocean acidification',
        'Understand marine food webs',
        'Master water pollution effects'
      ]
    },
    rewards: {
      points: 750,
      items: ['Ocean Protector Badge', 'Diving Gear', 'Marine Biology Kit'],
      unlocks: ['City Ecosystem']
    },
    timeLimit: 600, // 10 minutes
    backgroundColor: '#006994',
    ambientColor: '#4169E1',
    fogColor: '#1E90FF',
    fogNear: 15,
    fogFar: 60
  },
  {
    id: 'city',
    name: 'Green Metropolis',
    description: 'Transform the urban environment by implementing renewable energy, reducing pollution, and creating sustainable cities.',
    environment: 'city',
    difficulty: 'hard',
    unlockScore: 1250,
    objectives: {
      primary: [
        'Install 15 renewable energy sources',
        'Reduce air pollution by 50%',
        'Create 5 green spaces'
      ],
      secondary: [
        'Implement 8 recycling programs',
        'Complete urban planning quiz',
        'Design 3 eco-friendly buildings'
      ],
      educational: [
        'Learn about urban heat islands',
        'Understand renewable energy systems',
        'Master sustainable city planning'
      ]
    },
    rewards: {
      points: 1000,
      items: ['Eco-City Planner Badge', 'Solar Panel Kit', 'Green Architecture Guide'],
      unlocks: ['Master Challenge']
    },
    timeLimit: 900, // 15 minutes
    backgroundColor: '#2F4F4F',
    ambientColor: '#708090',
    fogColor: '#696969',
    fogNear: 25,
    fogFar: 100
  }
];

interface EcosystemManagerProps {
  currentEcosystem: string;
  transitionDuration?: number;
}

export default function EcosystemManager({ 
  currentEcosystem = 'forest', 
  transitionDuration = 2.0 
}: EcosystemManagerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gamePhase, score, addScore } = useGameState();
  const { playSuccess } = useAudio();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayEcosystem, setDisplayEcosystem] = useState(currentEcosystem);
  const transitionProgress = useRef(0);
  
  // Get current ecosystem data
  const ecosystem = ecosystems.find(eco => eco.id === displayEcosystem) || ecosystems[0];
  
  // Handle ecosystem transitions with smooth fade effects
  useEffect(() => {
    if (currentEcosystem !== displayEcosystem) {
      setIsTransitioning(true);
      transitionProgress.current = 0;
      
      const timer = setTimeout(() => {
        setDisplayEcosystem(currentEcosystem);
        playSuccess();
        console.log(`Transitioning to ${currentEcosystem} ecosystem`);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, transitionDuration * 500); // Half duration for fade in
        
      }, transitionDuration * 500); // Half duration for fade out
      
      return () => clearTimeout(timer);
    }
  }, [currentEcosystem, displayEcosystem, transitionDuration, playSuccess]);

  // Update scene lighting and atmosphere based on ecosystem
  useEffect(() => {
    if (groupRef.current) {
      const scene = groupRef.current.parent as THREE.Scene;
      if (scene) {
        // Update scene background
        scene.background = new THREE.Color(ecosystem.backgroundColor);
        
        // Update fog
        scene.fog = new THREE.Fog(
          ecosystem.fogColor, 
          ecosystem.fogNear, 
          ecosystem.fogFar
        );
        
        console.log(`Applied ${ecosystem.name} atmosphere settings`);
      }
    }
  }, [ecosystem]);

  // Ecosystem transition animation
  useFrame((state, delta) => {
    if (isTransitioning && groupRef.current) {
      transitionProgress.current += delta / transitionDuration;
      
      // Smooth fade transition using opacity
      const fadeValue = Math.sin(transitionProgress.current * Math.PI);
      groupRef.current.children.forEach(child => {
        if (child.isMesh) {
          const material = (child as THREE.Mesh).material as THREE.Material;
          if (material.transparent !== undefined) {
            material.transparent = true;
            (material as any).opacity = fadeValue;
          }
        }
      });
      
      if (transitionProgress.current >= 1) {
        transitionProgress.current = 0;
      }
    }
  });

  // Check if ecosystem is unlocked
  const isUnlocked = score >= ecosystem.unlockScore;
  
  if (!isUnlocked && gamePhase === 'playing') {
    return (
      <group ref={groupRef}>
        {/* Locked ecosystem placeholder */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshLambertMaterial color="#444444" transparent opacity={0.5} />
        </mesh>
        {/* Lock icon */}
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
      </group>
    );
  }

  // Render appropriate ecosystem based on current selection
  const renderEcosystem = () => {
    switch (displayEcosystem) {
      case 'forest':
        return <ForestEcosystem isTransitioning={isTransitioning} />;
      case 'ocean':
        return <OceanEcosystem isTransitioning={isTransitioning} />;
      case 'city':
        return <CityEcosystem isTransitioning={isTransitioning} />;
      default:
        return <ForestEcosystem isTransitioning={isTransitioning} />;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Dynamic lighting based on ecosystem */}
      <ambientLight intensity={0.4} color={ecosystem.ambientColor} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        color={ecosystem.ambientColor}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Ecosystem-specific environment */}
      {renderEcosystem()}
      
      {/* Transition overlay effect */}
      {isTransitioning && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[100, 32, 16]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Ecosystem boundary markers */}
      <group position={[0, 0.1, 0]}>
        {/* Invisible boundaries for collision detection */}
        <mesh position={[50, 0, 0]} visible={false}>
          <boxGeometry args={[1, 10, 100]} />
        </mesh>
        <mesh position={[-50, 0, 0]} visible={false}>
          <boxGeometry args={[1, 10, 100]} />
        </mesh>
        <mesh position={[0, 0, 50]} visible={false}>
          <boxGeometry args={[100, 10, 1]} />
        </mesh>
        <mesh position={[0, 0, -50]} visible={false}>
          <boxGeometry args={[100, 10, 1]} />
        </mesh>
      </group>
    </group>
  );
}