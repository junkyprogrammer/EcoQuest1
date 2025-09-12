import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// NPC Types
type NPCType = 'adult' | 'child';
type ChildActivity = 'slide' | 'swing' | 'seesaw' | 'running' | 'spring-rider' | 'monkey-bars' | 'merry-go-round' | 'waiting';
type AdultActivity = 'walking' | 'sitting' | 'watching' | 'standing';

interface NPCData {
  id: string;
  type: NPCType;
  position: THREE.Vector3;
  rotation: number;
  activity: ChildActivity | AdultActivity;
  targetPosition: THREE.Vector3 | null;
  clothingColor: string;
  shirtColor: string;
  pantsColor: string;
  skinColor: string;
  speed: number;
  animationPhase: number;
  equipmentTarget: string | null;
  activityTimer: number;
}

// Color palettes
const adultClothingColors = {
  shirts: ['#4169E1', '#8B4513', '#2F4F4F', '#800080', '#008B8B', '#B22222'],
  pants: ['#000080', '#696969', '#2F4F4F', '#8B4513', '#000000', '#4B0082'],
  skin: ['#FDBCB4', '#F5DEB3', '#D2691E', '#8B4513', '#FFE4C4']
};

const childClothingColors = {
  shirts: ['#FF69B4', '#00CED1', '#FFD700', '#32CD32', '#FF4500', '#FF1493', '#00BFFF'],
  pants: ['#9370DB', '#FF6347', '#4169E1', '#FFA500', '#20B2AA', '#FF69B4'],
  skin: ['#FDBCB4', '#F5DEB3', '#D2691E', '#8B4513', '#FFE4C4']
};

// Playground equipment positions for NPC interactions
const playgroundEquipment = {
  slides: [
    { position: new THREE.Vector3(20, 0, 20), ladderPos: new THREE.Vector3(20, 0, 17), topPos: new THREE.Vector3(20, 8, 18.5) },
    { position: new THREE.Vector3(35, 0, 15), ladderPos: new THREE.Vector3(35, 0, 12), topPos: new THREE.Vector3(35, 12, 13.5) },
    { position: new THREE.Vector3(15, 0, 35), ladderPos: new THREE.Vector3(15, 0, 32), topPos: new THREE.Vector3(15, 10, 33.5) }
  ],
  swings: [
    { position: new THREE.Vector3(-22.5, 3.5, 23), id: 'swing1' },
    { position: new THREE.Vector3(-20, 3.5, 23), id: 'swing2' },
    { position: new THREE.Vector3(-17.5, 3.5, 23), id: 'swing3' },
    { position: new THREE.Vector3(-32.5, 3.5, -7), id: 'swing4' },
    { position: new THREE.Vector3(-30, 3.5, -7), id: 'swing5' },
    { position: new THREE.Vector3(-27.5, 3.5, -7), id: 'swing6' }
  ],
  seesaws: [
    { position1: new THREE.Vector3(-3, 2, 15), position2: new THREE.Vector3(3, 2, 15), id: 'seesaw1' },
    { position1: new THREE.Vector3(-18, 2, -20), position2: new THREE.Vector3(-12, 2, -20), id: 'seesaw2' }
  ],
  springRiders: [
    { position: new THREE.Vector3(10, 2.5, 5), id: 'spring1' },
    { position: new THREE.Vector3(12, 2.5, 8), id: 'spring2' },
    { position: new THREE.Vector3(14, 2.5, 5), id: 'spring3' },
    { position: new THREE.Vector3(-10, 2.5, 5), id: 'spring4' }
  ],
  merryGoRound: { position: new THREE.Vector3(0, 0.5, -15), radius: 5 },
  monkeyBars: { startPos: new THREE.Vector3(23, 6.5, -20), endPos: new THREE.Vector3(37, 6.5, -20) },
  benches: [
    { position: new THREE.Vector3(25, 1, 5), rotation: -Math.PI / 4 },
    { position: new THREE.Vector3(-25, 1, 10), rotation: Math.PI / 4 },
    { position: new THREE.Vector3(10, 1, -25), rotation: Math.PI / 2 },
    { position: new THREE.Vector3(-10, 1, 30), rotation: 0 }
  ]
};

// Single NPC Component (Minecraft blocky style)
function NPC({ data, onUpdateActivity }: { data: NPCData, onUpdateActivity: (id: string, activity: any) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  
  const walkPhase = useRef(0);
  const activityPhase = useRef(0);
  
  // Animation based on activity
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const npc = groupRef.current;
    const time = state.clock.elapsedTime;
    
    // Handle different activities
    if (data.type === 'child') {
      switch (data.activity) {
        case 'running':
          // Fast leg movement for running
          walkPhase.current += delta * 8;
          if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.rotation.x = Math.sin(walkPhase.current) * 0.8;
            rightLegRef.current.rotation.x = -Math.sin(walkPhase.current) * 0.8;
          }
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.x = -Math.sin(walkPhase.current) * 0.6;
            rightArmRef.current.rotation.x = Math.sin(walkPhase.current) * 0.6;
          }
          // Bobbing motion
          npc.position.y = data.position.y + Math.abs(Math.sin(walkPhase.current * 2)) * 0.2;
          break;
          
        case 'swing':
          // Swinging motion
          activityPhase.current += delta;
          const swingAngle = Math.sin(activityPhase.current * 1.5) * 0.4;
          npc.rotation.z = swingAngle;
          // Leg dangle
          if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.rotation.x = Math.sin(activityPhase.current * 3) * 0.2;
            rightLegRef.current.rotation.x = Math.sin(activityPhase.current * 3 + Math.PI) * 0.2;
          }
          break;
          
        case 'slide':
          // Sliding animation - arms up in excitement
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.z = -Math.PI / 4;
            rightArmRef.current.rotation.z = Math.PI / 4;
            leftArmRef.current.rotation.x = -Math.PI / 6;
            rightArmRef.current.rotation.x = -Math.PI / 6;
          }
          break;
          
        case 'seesaw':
          // Seesaw motion
          activityPhase.current += delta;
          npc.position.y = data.position.y + Math.sin(activityPhase.current * 0.8) * 1.5;
          // Excited arm movement
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.z = Math.sin(activityPhase.current * 2) * 0.3;
            rightArmRef.current.rotation.z = -Math.sin(activityPhase.current * 2) * 0.3;
          }
          break;
          
        case 'spring-rider':
          // Bouncing motion
          activityPhase.current += delta;
          npc.position.y = data.position.y + Math.abs(Math.sin(activityPhase.current * 3)) * 0.5;
          // Holding handles
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.x = -Math.PI / 3;
            rightArmRef.current.rotation.x = -Math.PI / 3;
          }
          break;
          
        case 'merry-go-round':
          // Circular motion handled by parent update
          // Just add some excitement
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.z = -Math.PI / 6;
            rightArmRef.current.rotation.z = Math.PI / 6;
          }
          break;
          
        case 'monkey-bars':
          // Hand over hand motion
          activityPhase.current += delta;
          const handPhase = Math.sin(activityPhase.current * 2);
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.z = -Math.PI / 2 + handPhase * 0.3;
            rightArmRef.current.rotation.z = Math.PI / 2 - handPhase * 0.3;
            leftArmRef.current.rotation.x = -Math.PI / 2;
            rightArmRef.current.rotation.x = -Math.PI / 2;
          }
          break;
      }
    } else {
      // Adult animations
      switch (data.activity) {
        case 'walking':
          // Slower, calmer walking
          walkPhase.current += delta * 4;
          if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.rotation.x = Math.sin(walkPhase.current) * 0.4;
            rightLegRef.current.rotation.x = -Math.sin(walkPhase.current) * 0.4;
          }
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.x = -Math.sin(walkPhase.current) * 0.3;
            rightArmRef.current.rotation.x = Math.sin(walkPhase.current) * 0.3;
          }
          break;
          
        case 'sitting':
          // Sitting posture
          if (leftLegRef.current && rightLegRef.current) {
            leftLegRef.current.rotation.x = Math.PI / 2;
            rightLegRef.current.rotation.x = Math.PI / 2;
          }
          break;
          
        case 'watching':
          // Standing with arms crossed
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.z = Math.PI / 6;
            rightArmRef.current.rotation.z = -Math.PI / 6;
            leftArmRef.current.rotation.y = Math.PI / 4;
            rightArmRef.current.rotation.y = -Math.PI / 4;
          }
          break;
      }
    }
  });
  
  const scale = data.type === 'child' ? 0.7 : 1;
  const height = data.type === 'child' ? 1.4 : 2;
  
  return (
    <group ref={groupRef} position={[data.position.x, data.position.y, data.position.z]} rotation={[0, data.rotation, 0]}>
      {/* Head */}
      <mesh position={[0, height * 0.85, 0]} castShadow>
        <boxGeometry args={[0.5 * scale, 0.5 * scale, 0.5 * scale]} />
        <meshLambertMaterial color={data.skinColor} />
      </mesh>
      
      {/* Body (shirt) */}
      <mesh position={[0, height * 0.5, 0]} castShadow>
        <boxGeometry args={[0.6 * scale, 0.7 * scale, 0.3 * scale]} />
        <meshLambertMaterial color={data.shirtColor} />
      </mesh>
      
      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.4 * scale, height * 0.5, 0]} castShadow>
        <boxGeometry args={[0.15 * scale, 0.6 * scale, 0.15 * scale]} />
        <meshLambertMaterial color={data.shirtColor} />
      </mesh>
      
      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.4 * scale, height * 0.5, 0]} castShadow>
        <boxGeometry args={[0.15 * scale, 0.6 * scale, 0.15 * scale]} />
        <meshLambertMaterial color={data.shirtColor} />
      </mesh>
      
      {/* Left Leg */}
      <mesh ref={leftLegRef} position={[-0.15 * scale, height * 0.1, 0]} castShadow>
        <boxGeometry args={[0.2 * scale, 0.7 * scale, 0.2 * scale]} />
        <meshLambertMaterial color={data.pantsColor} />
      </mesh>
      
      {/* Right Leg */}
      <mesh ref={rightLegRef} position={[0.15 * scale, height * 0.1, 0]} castShadow>
        <boxGeometry args={[0.2 * scale, 0.7 * scale, 0.2 * scale]} />
        <meshLambertMaterial color={data.pantsColor} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1 * scale, height * 0.88, 0.26 * scale]}>
        <boxGeometry args={[0.08 * scale, 0.08 * scale, 0.01 * scale]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1 * scale, height * 0.88, 0.26 * scale]}>
        <boxGeometry args={[0.08 * scale, 0.08 * scale, 0.01 * scale]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Hair (simple block on top) */}
      <mesh position={[0, height * 0.95, 0]} castShadow>
        <boxGeometry args={[0.45 * scale, 0.2 * scale, 0.45 * scale]} />
        <meshLambertMaterial color={data.type === 'child' ? '#8B4513' : '#696969'} />
      </mesh>
    </group>
  );
}

// Main NPCs Component
export default function NPCs() {
  const [npcs, setNpcs] = useState<NPCData[]>([]);
  const npcUpdateTimer = useRef(0);
  
  // Initialize NPCs
  useEffect(() => {
    const initialNpcs: NPCData[] = [];
    
    // Create adult NPCs (15-20)
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 30 + Math.random() * 20;
      initialNpcs.push({
        id: `adult-${i}`,
        type: 'adult',
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ),
        rotation: Math.random() * Math.PI * 2,
        activity: Math.random() > 0.7 ? 'sitting' : 'walking',
        targetPosition: null,
        clothingColor: '',
        shirtColor: adultClothingColors.shirts[Math.floor(Math.random() * adultClothingColors.shirts.length)],
        pantsColor: adultClothingColors.pants[Math.floor(Math.random() * adultClothingColors.pants.length)],
        skinColor: adultClothingColors.skin[Math.floor(Math.random() * adultClothingColors.skin.length)],
        speed: 2 + Math.random(),
        animationPhase: Math.random() * Math.PI * 2,
        equipmentTarget: null,
        activityTimer: 0
      });
    }
    
    // Create child NPCs (20-25)
    for (let i = 0; i < 23; i++) {
      const activities: ChildActivity[] = ['slide', 'swing', 'running', 'spring-rider', 'seesaw'];
      const activity = activities[Math.floor(Math.random() * activities.length)];
      
      // Position based on activity
      let position = new THREE.Vector3(Math.random() * 40 - 20, 0, Math.random() * 40 - 20);
      if (activity === 'swing' && i < playgroundEquipment.swings.length) {
        position = playgroundEquipment.swings[i % playgroundEquipment.swings.length].position.clone();
      } else if (activity === 'slide' && i < playgroundEquipment.slides.length) {
        position = playgroundEquipment.slides[i % playgroundEquipment.slides.length].ladderPos.clone();
      }
      
      initialNpcs.push({
        id: `child-${i}`,
        type: 'child',
        position: position,
        rotation: Math.random() * Math.PI * 2,
        activity: activity,
        targetPosition: null,
        clothingColor: '',
        shirtColor: childClothingColors.shirts[Math.floor(Math.random() * childClothingColors.shirts.length)],
        pantsColor: childClothingColors.pants[Math.floor(Math.random() * childClothingColors.pants.length)],
        skinColor: childClothingColors.skin[Math.floor(Math.random() * childClothingColors.skin.length)],
        speed: 3 + Math.random() * 2,
        animationPhase: Math.random() * Math.PI * 2,
        equipmentTarget: null,
        activityTimer: Math.random() * 10
      });
    }
    
    setNpcs(initialNpcs);
  }, []);
  
  // Update NPC positions and activities
  useFrame((state, delta) => {
    npcUpdateTimer.current += delta;
    
    // Update NPCs every frame for smooth movement
    setNpcs(prevNpcs => {
      return prevNpcs.map(npc => {
        const updated = { ...npc };
        updated.activityTimer += delta;
        
        // Update position based on activity
        if (npc.type === 'child') {
          switch (npc.activity) {
            case 'running':
              // Move toward target or pick new target
              if (!npc.targetPosition || npc.position.distanceTo(npc.targetPosition) < 2) {
                // Pick random playground equipment as target
                const targets = [
                  ...playgroundEquipment.slides.map(s => s.ladderPos),
                  ...playgroundEquipment.swings.map(s => s.position),
                  ...playgroundEquipment.springRiders.map(s => s.position)
                ];
                updated.targetPosition = targets[Math.floor(Math.random() * targets.length)].clone();
              }
              
              // Move toward target
              if (npc.targetPosition) {
                const direction = new THREE.Vector3().subVectors(npc.targetPosition, npc.position).normalize();
                updated.position = npc.position.clone().add(direction.multiplyScalar(npc.speed * delta));
                updated.rotation = Math.atan2(direction.x, direction.z);
              }
              
              // Change activity when reached target
              if (npc.targetPosition && npc.position.distanceTo(npc.targetPosition) < 1) {
                const activities: ChildActivity[] = ['slide', 'swing', 'spring-rider', 'running'];
                updated.activity = activities[Math.floor(Math.random() * activities.length)];
                updated.activityTimer = 0;
              }
              break;
              
            case 'slide':
              // Climb ladder then slide down
              if (updated.activityTimer < 3) {
                // Climbing
                updated.position.y = Math.min(8, updated.activityTimer * 2.5);
              } else if (updated.activityTimer < 5) {
                // Sliding down
                updated.position.y = Math.max(0, 8 - (updated.activityTimer - 3) * 4);
                updated.position.z += delta * 3;
              } else {
                // Done sliding, run away
                updated.activity = 'running';
                updated.position.y = 0;
                updated.activityTimer = 0;
              }
              break;
              
            case 'swing':
              // Stay on swing for a while then switch activity
              if (updated.activityTimer > 10) {
                updated.activity = 'running';
                updated.activityTimer = 0;
              }
              break;
              
            case 'spring-rider':
              // Bounce for a while then switch
              if (updated.activityTimer > 8) {
                updated.activity = 'running';
                updated.activityTimer = 0;
              }
              break;
              
            case 'seesaw':
              // Seesaw for a while then switch
              if (updated.activityTimer > 12) {
                updated.activity = 'running';
                updated.activityTimer = 0;
              }
              break;
          }
        } else {
          // Adult behavior
          switch (npc.activity) {
            case 'walking':
              // Pick new target if needed
              if (!npc.targetPosition || npc.position.distanceTo(npc.targetPosition) < 2) {
                updated.targetPosition = new THREE.Vector3(
                  Math.random() * 80 - 40,
                  0,
                  Math.random() * 80 - 40
                );
              }
              
              // Move toward target
              if (npc.targetPosition) {
                const direction = new THREE.Vector3().subVectors(npc.targetPosition, npc.position).normalize();
                updated.position = npc.position.clone().add(direction.multiplyScalar(npc.speed * delta));
                updated.rotation = Math.atan2(direction.x, direction.z);
              }
              
              // Occasionally stop to watch or sit
              if (updated.activityTimer > 15 && Math.random() < 0.01) {
                updated.activity = Math.random() > 0.5 ? 'watching' : 'sitting';
                updated.activityTimer = 0;
              }
              break;
              
            case 'sitting':
            case 'watching':
              // Stand up and walk after a while
              if (updated.activityTimer > 10) {
                updated.activity = 'walking';
                updated.activityTimer = 0;
              }
              break;
          }
        }
        
        return updated;
      });
    });
  });
  
  const updateActivity = (id: string, activity: any) => {
    setNpcs(prevNpcs => 
      prevNpcs.map(npc => 
        npc.id === id ? { ...npc, activity } : npc
      )
    );
  };
  
  return (
    <group name="npcs">
      {npcs.map(npc => (
        <NPC key={npc.id} data={npc} onUpdateActivity={updateActivity} />
      ))}
    </group>
  );
}