import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Slide Component with vibrant Free Fire colors
function Slide({ position, height = 10, color = '#FF69B4' }: { position: [number, number, number], height?: number, color?: string }) {
  const slideRef = useRef<THREE.Group>(null);

  return (
    <group ref={slideRef} position={position}>
      {/* Support structure */}
      <mesh position={[-2, height/2, 0]} castShadow>
        <boxGeometry args={[0.3, height, 0.3]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      <mesh position={[2, height/2, 0]} castShadow>
        <boxGeometry args={[0.3, height, 0.3]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      <mesh position={[-2, height/2, -3]} castShadow>
        <boxGeometry args={[0.3, height, 0.3]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      <mesh position={[2, height/2, -3]} castShadow>
        <boxGeometry args={[0.3, height, 0.3]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      
      {/* Platform at top */}
      <mesh position={[0, height, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.3, 3]} />
        <meshLambertMaterial color="#00CED1" />
      </mesh>
      
      {/* Safety rails */}
      <mesh position={[-2.2, height + 1, -1.5]} castShadow>
        <boxGeometry args={[0.2, 2, 3]} />
        <meshLambertMaterial color="#FF4500" />
      </mesh>
      <mesh position={[2.2, height + 1, -1.5]} castShadow>
        <boxGeometry args={[0.2, 2, 3]} />
        <meshLambertMaterial color="#FF4500" />
      </mesh>
      <mesh position={[0, height + 1, -3]} castShadow>
        <boxGeometry args={[4.5, 2, 0.2]} />
        <meshLambertMaterial color="#FF4500" />
      </mesh>
      
      {/* Slide surface */}
      <mesh position={[0, height/2, 1.5]} rotation={[-Math.PI/6, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, height * 1.2, 0.2]} />
        <meshLambertMaterial color={color} />
      </mesh>
      
      {/* Slide sides */}
      <mesh position={[-2, height/2, 1.5]} rotation={[-Math.PI/6, 0, 0]} castShadow>
        <boxGeometry args={[0.2, height * 1.2, 1]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      <mesh position={[2, height/2, 1.5]} rotation={[-Math.PI/6, 0, 0]} castShadow>
        <boxGeometry args={[0.2, height * 1.2, 1]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      
      {/* Ladder rungs */}
      {Array.from({ length: Math.floor(height / 1.5) }).map((_, i) => (
        <mesh key={i} position={[0, 1.5 + i * 1.5, -3.2]} castShadow>
          <boxGeometry args={[3, 0.3, 0.3]} />
          <meshLambertMaterial color="#32CD32" />
        </mesh>
      ))}
    </group>
  );
}

// Swing Set Component
function SwingSet({ position }: { position: [number, number, number] }) {
  const swing1Ref = useRef<THREE.Group>(null);
  const swing2Ref = useRef<THREE.Group>(null);
  const swing3Ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (swing1Ref.current) {
      swing1Ref.current.rotation.z = Math.sin(time * 1.2) * 0.3;
    }
    if (swing2Ref.current) {
      swing2Ref.current.rotation.z = Math.sin(time * 1.0 + Math.PI/3) * 0.25;
    }
    if (swing3Ref.current) {
      swing3Ref.current.rotation.z = Math.sin(time * 1.4 + Math.PI/2) * 0.35;
    }
  });

  return (
    <group position={position}>
      {/* A-frame structure */}
      <mesh position={[-4, 4, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.4, 8, 0.4]} />
        <meshLambertMaterial color="#FF4500" />
      </mesh>
      <mesh position={[4, 4, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.4, 8, 0.4]} />
        <meshLambertMaterial color="#FF4500" />
      </mesh>
      <mesh position={[-4, 4, 6]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.4, 8, 0.4]} />
        <meshLambertMaterial color="#FF4500" />
      </mesh>
      <mesh position={[4, 4, 6]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.4, 8, 0.4]} />
        <meshLambertMaterial color="#FF4500" />
      </mesh>
      
      {/* Top bar */}
      <mesh position={[0, 7.5, 3]} castShadow>
        <boxGeometry args={[8, 0.4, 0.4]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      
      {/* Swings */}
      <group ref={swing1Ref} position={[-2.5, 7.5, 3]}>
        {/* Chains */}
        <mesh position={[-0.3, -2, 0]} castShadow>
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
        <mesh position={[0.3, -2, 0]} castShadow>
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
        {/* Seat */}
        <mesh position={[0, -4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.2, 0.8]} />
          <meshLambertMaterial color="#00CED1" />
        </mesh>
      </group>
      
      <group ref={swing2Ref} position={[0, 7.5, 3]}>
        {/* Chains */}
        <mesh position={[-0.3, -2, 0]} castShadow>
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
        <mesh position={[0.3, -2, 0]} castShadow>
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
        {/* Seat */}
        <mesh position={[0, -4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.2, 0.8]} />
          <meshLambertMaterial color="#FF69B4" />
        </mesh>
      </group>
      
      <group ref={swing3Ref} position={[2.5, 7.5, 3]}>
        {/* Chains */}
        <mesh position={[-0.3, -2, 0]} castShadow>
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
        <mesh position={[0.3, -2, 0]} castShadow>
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
        {/* Seat */}
        <mesh position={[0, -4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.2, 0.8]} />
          <meshLambertMaterial color="#32CD32" />
        </mesh>
      </group>
    </group>
  );
}

// Seesaw Component
function Seesaw({ position }: { position: [number, number, number] }) {
  const seesawRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (seesawRef.current) {
      const time = state.clock.elapsedTime;
      seesawRef.current.rotation.z = Math.sin(time * 0.8) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Central pivot */}
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[1, 2, 4]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      
      {/* Seesaw plank */}
      <group ref={seesawRef} position={[0, 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8, 0.3, 1.5]} />
          <meshLambertMaterial color="#32CD32" />
        </mesh>
        
        {/* Handles */}
        <mesh position={[-3.5, 0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshLambertMaterial color="#FF4500" />
        </mesh>
        <mesh position={[3.5, 0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshLambertMaterial color="#FF4500" />
        </mesh>
        
        {/* Seats */}
        <mesh position={[-3, 0.2, 0]} castShadow>
          <boxGeometry args={[1.5, 0.1, 1.2]} />
          <meshLambertMaterial color="#00CED1" />
        </mesh>
        <mesh position={[3, 0.2, 0]} castShadow>
          <boxGeometry args={[1.5, 0.1, 1.2]} />
          <meshLambertMaterial color="#FF69B4" />
        </mesh>
      </group>
    </group>
  );
}

// Merry-Go-Round Component
function MerryGoRound({ position }: { position: [number, number, number] }) {
  const merryRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (merryRef.current) {
      merryRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      {/* Central post */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 2]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      
      {/* Rotating platform */}
      <group ref={merryRef} position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[5, 5, 0.3, 16]} />
          <meshLambertMaterial color="#FF1493" />
        </mesh>
        
        {/* Handles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 4;
          const z = Math.sin(angle) * 4;
          return (
            <mesh key={i} position={[x, 1, z]} castShadow>
              <boxGeometry args={[0.2, 2, 0.2]} />
              <meshLambertMaterial color="#FFD700" />
            </mesh>
          );
        })}
        
        {/* Decorative segments */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 2.5;
          const z = Math.sin(angle) * 2.5;
          const colors = ['#00CED1', '#32CD32', '#FFD700', '#FF4500'];
          return (
            <mesh key={`seg-${i}`} position={[x, 0.2, z]} castShadow>
              <boxGeometry args={[1.5, 0.1, 1.5]} />
              <meshLambertMaterial color={colors[i % 4]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// Monkey Bars Component
function MonkeyBars({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Support posts */}
      <mesh position={[-7, 3.5, 0]} castShadow>
        <boxGeometry args={[0.3, 7, 0.3]} />
        <meshLambertMaterial color="#00BFFF" />
      </mesh>
      <mesh position={[7, 3.5, 0]} castShadow>
        <boxGeometry args={[0.3, 7, 0.3]} />
        <meshLambertMaterial color="#00BFFF" />
      </mesh>
      <mesh position={[-7, 3.5, 2]} castShadow>
        <boxGeometry args={[0.3, 7, 0.3]} />
        <meshLambertMaterial color="#00BFFF" />
      </mesh>
      <mesh position={[7, 3.5, 2]} castShadow>
        <boxGeometry args={[0.3, 7, 0.3]} />
        <meshLambertMaterial color="#00BFFF" />
      </mesh>
      
      {/* Side rails */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[14, 0.2, 0.2]} />
        <meshLambertMaterial color="#00BFFF" />
      </mesh>
      <mesh position={[0, 6.5, 2]} castShadow>
        <boxGeometry args={[14, 0.2, 0.2]} />
        <meshLambertMaterial color="#00BFFF" />
      </mesh>
      
      {/* Rungs */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[-6 + i * 1.5, 6.5, 1]} castShadow>
          <boxGeometry args={[0.2, 0.2, 2]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
      ))}
    </group>
  );
}

// Spring Rider Component
function SpringRider({ position, color = '#FF69B4', animalType = 'horse' }: { position: [number, number, number], color?: string, animalType?: string }) {
  const riderRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (riderRef.current) {
      const time = state.clock.elapsedTime;
      riderRef.current.position.y = Math.sin(time * 3) * 0.3;
      riderRef.current.rotation.x = Math.sin(time * 3) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 0.4]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      
      {/* Spring (visual representation) */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8, 10]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>
      
      {/* Animal body */}
      <group ref={riderRef} position={[0, 2.5, 0]}>
        {/* Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 1, 2.5]} />
          <meshLambertMaterial color={color} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.3, 1.2]} castShadow>
          <boxGeometry args={[0.8, 0.8, 1]} />
          <meshLambertMaterial color={color} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.2, 0.8, 1.2]} castShadow>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[0.2, 0.8, 1.2]} castShadow>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshLambertMaterial color={color} />
        </mesh>
        
        {/* Handles */}
        <mesh position={[-0.5, 0.3, 0.5]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0.5, 0.3, 0.5]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
        
        {/* Seat */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.8, 0.1, 1]} />
          <meshLambertMaterial color="#32CD32" />
        </mesh>
      </group>
    </group>
  );
}

// Garden Path Component
function GardenPath({ points }: { points: [number, number, number][] }) {
  const pathMesh = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    );
    const tubeGeometry = new THREE.TubeGeometry(curve, 50, 1.5, 8, false);
    return tubeGeometry;
  }, [points]);

  return (
    <mesh geometry={pathMesh} position={[0, 0.1, 0]} receiveShadow>
      <meshLambertMaterial color="#FFA500" />
    </mesh>
  );
}

// Park Bench Component
function ParkBench({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.2, 1]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Back */}
      <mesh position={[0, 1.5, -0.4]} castShadow>
        <boxGeometry args={[3, 1, 0.2]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-1.3, 0.5, 0.3]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshLambertMaterial color="#00CED1" />
      </mesh>
      <mesh position={[1.3, 0.5, 0.3]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshLambertMaterial color="#00CED1" />
      </mesh>
      <mesh position={[-1.3, 0.5, -0.3]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshLambertMaterial color="#00CED1" />
      </mesh>
      <mesh position={[1.3, 0.5, -0.3]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshLambertMaterial color="#00CED1" />
      </mesh>
    </group>
  );
}

// Flower Bed Component
function FlowerBed({ position, size = [4, 0.5, 4] }: { position: [number, number, number], size?: [number, number, number] }) {
  const flowerColors = ['#FF69B4', '#FFD700', '#00CED1', '#32CD32', '#FF1493'];
  
  return (
    <group position={position}>
      {/* Bed border */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Flowers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = (Math.random() - 0.5) * (size[0] - 0.5);
        const z = (Math.random() - 0.5) * (size[2] - 0.5);
        const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        const height = 0.8 + Math.random() * 0.4;
        
        return (
          <group key={i} position={[x, 0.5, z]}>
            {/* Stem */}
            <mesh position={[0, height/2, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, height]} />
              <meshLambertMaterial color="#228B22" />
            </mesh>
            {/* Flower */}
            <mesh position={[0, height, 0]} castShadow>
              <sphereGeometry args={[0.3, 8, 6]} />
              <meshLambertMaterial color={color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Central Fountain Component
function Fountain({ position }: { position: [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (waterRef.current) {
      const time = state.clock.elapsedTime;
      waterRef.current.position.y = 2 + Math.sin(time * 2) * 0.5;
      waterRef.current.scale.y = 1 + Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Base pool */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[6, 6, 0.4, 16]} />
        <meshLambertMaterial color="#A9A9A9" />
      </mesh>
      
      {/* Water in pool */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[5.8, 5.8, 0.2, 16]} />
        <meshLambertMaterial color="#00BFFF" transparent opacity={0.7} />
      </mesh>
      
      {/* Central pillar */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 2, 8]} />
        <meshLambertMaterial color="#A9A9A9" />
      </mesh>
      
      {/* Water jet (animated) */}
      <mesh ref={waterRef} position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 3, 8]} />
        <meshLambertMaterial color="#00BFFF" transparent opacity={0.6} />
      </mesh>
      
      {/* Water particles effect */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        return (
          <mesh key={i} position={[x, 1.5, z]}>
            <sphereGeometry args={[0.1, 4, 4]} />
            <meshBasicMaterial color="#00BFFF" transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function PlaygroundEnvironment() {
  return (
    <group name="playground-environment">
      {/* Multiple Slides */}
      <Slide position={[20, 0, 20]} height={8} color="#FF69B4" />
      <Slide position={[35, 0, 15]} height={12} color="#00CED1" />
      <Slide position={[15, 0, 35]} height={10} color="#FFD700" />
      
      {/* Multiple Swing Sets */}
      <SwingSet position={[-20, 0, 20]} />
      <SwingSet position={[-30, 0, -10]} />
      
      {/* Seesaws */}
      <Seesaw position={[0, 0, 15]} />
      <Seesaw position={[-15, 0, -20]} />
      
      {/* Merry-Go-Round */}
      <MerryGoRound position={[0, 0, -15]} />
      
      {/* Monkey Bars */}
      <MonkeyBars position={[30, 0, -20]} />
      
      {/* Spring Riders */}
      <SpringRider position={[10, 0, 5]} color="#FF69B4" />
      <SpringRider position={[12, 0, 8]} color="#00CED1" />
      <SpringRider position={[14, 0, 5]} color="#32CD32" />
      <SpringRider position={[-10, 0, 5]} color="#FFD700" />
      
      {/* Garden Paths */}
      <GardenPath points={[
        [-40, 0.1, -40],
        [-20, 0.1, -20],
        [0, 0.1, 0],
        [20, 0.1, 20],
        [40, 0.1, 40]
      ]} />
      <GardenPath points={[
        [-40, 0.1, 40],
        [-20, 0.1, 20],
        [0, 0.1, 0],
        [20, 0.1, -20],
        [40, 0.1, -40]
      ]} />
      
      {/* Park Benches */}
      <ParkBench position={[25, 0, 5]} rotation={-Math.PI / 4} />
      <ParkBench position={[-25, 0, 10]} rotation={Math.PI / 4} />
      <ParkBench position={[10, 0, -25]} rotation={Math.PI / 2} />
      <ParkBench position={[-10, 0, 30]} rotation={0} />
      <ParkBench position={[0, 0, 25]} rotation={Math.PI} />
      
      {/* Flower Beds */}
      <FlowerBed position={[40, 0, 0]} size={[6, 0.5, 6]} />
      <FlowerBed position={[-40, 0, 0]} size={[6, 0.5, 6]} />
      <FlowerBed position={[0, 0, 40]} size={[8, 0.5, 4]} />
      <FlowerBed position={[0, 0, -40]} size={[8, 0.5, 4]} />
      <FlowerBed position={[25, 0, -10]} size={[4, 0.5, 4]} />
      <FlowerBed position={[-25, 0, -10]} size={[4, 0.5, 4]} />
      
      {/* Central Fountain */}
      <Fountain position={[0, 0, 0]} />
      
      {/* Decorative Trees */}
      <Tree position={[45, 0, 45]} />
      <Tree position={[-45, 0, 45]} />
      <Tree position={[45, 0, -45]} />
      <Tree position={[-45, 0, -45]} />
      <Tree position={[30, 0, 0]} />
      <Tree position={[-30, 0, 0]} />
    </group>
  );
}

// Simple Decorative Tree Component
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 6]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Foliage layers */}
      <mesh position={[0, 6, 0]} castShadow>
        <sphereGeometry args={[3, 12, 8]} />
        <meshLambertMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <sphereGeometry args={[2.5, 12, 8]} />
        <meshLambertMaterial color="#32CD32" />
      </mesh>
      <mesh position={[0, 9, 0]} castShadow>
        <sphereGeometry args={[1.8, 12, 8]} />
        <meshLambertMaterial color="#90EE90" />
      </mesh>
    </group>
  );
}