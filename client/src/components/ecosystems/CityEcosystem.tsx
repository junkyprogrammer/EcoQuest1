import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";

interface CityEcosystemProps {
  isTransitioning: boolean;
}

export default function CityEcosystem({ isTransitioning }: CityEcosystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { addScore, addToInventory } = useGameState();
  const { playSuccess } = useAudio();
  
  // Textures
  const asphaltTexture = useTexture("/textures/asphalt.png");
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure textures
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(20, 20);
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);

  // Pre-calculated city layout
  const cityLayout = useMemo(() => {
    const buildings: Array<{
      position: [number, number, number]; 
      size: [number, number, number]; 
      type: 'residential' | 'commercial' | 'industrial';
      hasRenewable: boolean;
    }> = [];
    
    const vehicles: Array<{
      position: [number, number, number]; 
      type: 'electric' | 'hybrid' | 'gas' | 'bike';
      direction: number;
    }> = [];
    
    const pollutionSources: Array<{
      position: [number, number, number]; 
      type: 'smokestack' | 'traffic' | 'landfill';
      severity: 'low' | 'medium' | 'high';
    }> = [];
    
    const renewableEnergy: Array<{
      position: [number, number, number]; 
      type: 'solar' | 'wind' | 'hydro';
      installed: boolean;
    }> = [];
    
    const greenSpaces: Array<{
      position: [number, number, number]; 
      type: 'park' | 'garden' | 'tree';
      size: number;
    }> = [];

    // Generate city buildings in a grid pattern
    for (let x = -40; x <= 40; x += 15) {
      for (let z = -40; z <= 40; z += 15) {
        if (Math.random() > 0.3) { // Not every grid position has a building
          const height = 5 + Math.random() * 15;
          const buildingTypes: Array<'residential' | 'commercial' | 'industrial'> = ['residential', 'commercial', 'industrial'];
          const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
          
          buildings.push({
            position: [x + (Math.random() - 0.5) * 8, height / 2, z + (Math.random() - 0.5) * 8],
            size: [6 + Math.random() * 4, height, 6 + Math.random() * 4],
            type,
            hasRenewable: Math.random() > 0.6
          });
        }
      }
    }

    // Add vehicles on roads
    for (let i = 0; i < 20; i++) {
      const vehicleTypes: Array<'electric' | 'hybrid' | 'gas' | 'bike'> = ['electric', 'hybrid', 'gas', 'bike'];
      const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      
      vehicles.push({
        position: [
          (Math.random() - 0.5) * 90,
          0.2,
          Math.random() > 0.5 ? -2 : 2 // On road lanes
        ],
        type,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }

    // Add pollution sources
    for (let i = 0; i < 12; i++) {
      const pollutionTypes: Array<'smokestack' | 'traffic' | 'landfill'> = ['smokestack', 'traffic', 'landfill'];
      const type = pollutionTypes[Math.floor(Math.random() * pollutionTypes.length)];
      const severities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      pollutionSources.push({
        position: [
          (Math.random() - 0.5) * 80,
          type === 'smokestack' ? 8 + Math.random() * 10 : 0,
          (Math.random() - 0.5) * 80
        ],
        type,
        severity
      });
    }

    // Add potential renewable energy locations
    for (let i = 0; i < 18; i++) {
      const renewableTypes: Array<'solar' | 'wind' | 'hydro'> = ['solar', 'wind', 'hydro'];
      const type = renewableTypes[Math.floor(Math.random() * renewableTypes.length)];
      
      renewableEnergy.push({
        position: [
          (Math.random() - 0.5) * 85,
          type === 'wind' ? 8 : type === 'hydro' ? 0 : 4,
          (Math.random() - 0.5) * 85
        ],
        type,
        installed: Math.random() > 0.7
      });
    }

    // Add green spaces and parks
    for (let i = 0; i < 15; i++) {
      const spaceTypes: Array<'park' | 'garden' | 'tree'> = ['park', 'garden', 'tree'];
      const type = spaceTypes[Math.floor(Math.random() * spaceTypes.length)];
      const size = type === 'park' ? 8 + Math.random() * 6 : type === 'garden' ? 3 + Math.random() * 3 : 1;
      
      greenSpaces.push({
        position: [
          (Math.random() - 0.5) * 85,
          0,
          (Math.random() - 0.5) * 85
        ],
        type,
        size
      });
    }

    return { buildings, vehicles, pollutionSources, renewableEnergy, greenSpaces };
  }, []);

  // City animation and dynamics
  useFrame((state, delta) => {
    if (groupRef.current && !isTransitioning) {
      const time = state.clock.elapsedTime;
      
      // Animate vehicles moving along roads
      groupRef.current.children.forEach((child, index) => {
        if (child.userData.type === 'vehicle') {
          child.position.x += child.userData.direction * delta * (child.userData.vehicleType === 'bike' ? 3 : 8);
          
          // Reset position when vehicle goes off screen
          if (Math.abs(child.position.x) > 50) {
            child.position.x = -child.userData.direction * 50;
          }
        }
        
        // Animate pollution smoke
        if (child.userData.type === 'pollution' && child.userData.pollutionType === 'smokestack') {
          child.position.y += Math.sin(time * 2 + index) * delta * 0.5;
          child.rotation.y += delta * 0.3;
        }
        
        // Wind turbine rotation
        if (child.userData.type === 'renewable' && child.userData.renewableType === 'wind') {
          child.rotation.z += delta * 3; // Wind turbine spinning
        }
        
        // Solar panel sun tracking (subtle rotation)
        if (child.userData.type === 'renewable' && child.userData.renewableType === 'solar') {
          child.rotation.y = Math.sin(time * 0.1) * 0.3; // Following the sun
        }
        
        // Gentle swaying for trees and plants
        if (child.userData.type === 'greenspace' && child.userData.greenType === 'tree') {
          child.rotation.z = Math.sin(time * 0.8 + index) * 0.05;
        }
        
        // Floating effect for renewable energy indicators
        if (child.userData.type === 'renewable' && !child.userData.installed) {
          child.position.y += Math.sin(time * 1.5 + index) * delta * 0.2;
        }
      });
    }
  });

  const handleRenewableInstall = (type: string, position: THREE.Vector3) => {
    addScore(100);
    addToInventory('Renewable Energy Installed', 1);
    playSuccess();
    
    console.log(`Installed ${type} renewable energy at`, position);
  };

  const handlePollutionCleanup = (type: string, severity: string, position: THREE.Vector3) => {
    const points = severity === 'high' ? 80 : severity === 'medium' ? 60 : 40;
    addScore(points);
    addToInventory('Pollution Reduced', 1);
    playSuccess();
    
    console.log(`Cleaned up ${severity} ${type} pollution`);
  };

  const handleGreenSpaceCreate = (type: string, size: number, position: THREE.Vector3) => {
    addScore(50 + size * 5);
    addToInventory('Green Spaces Created', 1);
    playSuccess();
    
    console.log(`Created ${type} green space of size ${size}`);
  };

  const renderBuilding = (building: typeof cityLayout.buildings[0], index: number) => {
    const { position, size, type, hasRenewable } = building;
    const buildingColor = type === 'residential' ? '#8B7D6B' : type === 'commercial' ? '#708090' : '#2F4F4F';
    
    return (
      <group key={`building-${index}`} position={position} userData={{ type: 'building' }}>
        {/* Main building structure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshLambertMaterial color={buildingColor} />
        </mesh>
        
        {/* Windows */}
        {Array.from({ length: Math.floor(size[1] / 3) }).map((_, floor) => (
          <group key={`floor-${floor}`}>
            {Array.from({ length: 4 }).map((_, window) => (
              <mesh 
                key={`window-${window}`}
                position={[
                  size[0] / 2 + 0.01,
                  -size[1] / 2 + (floor + 1) * 2.5,
                  -size[2] / 2 + (window + 1) * (size[2] / 5)
                ]}
              >
                <boxGeometry args={[0.02, 1, 0.8]} />
                <meshBasicMaterial color={Math.random() > 0.5 ? '#FFFF99' : '#4169E1'} />
              </mesh>
            ))}
          </group>
        ))}
        
        {/* Rooftop renewable energy */}
        {hasRenewable && (
          <mesh position={[0, size[1] / 2 + 0.1, 0]}>
            <boxGeometry args={[size[0] * 0.8, 0.1, size[2] * 0.8]} />
            <meshLambertMaterial color="#191970" />
          </mesh>
        )}
      </group>
    );
  };

  const renderVehicle = (vehicle: typeof cityLayout.vehicles[0], index: number) => {
    const { position, type, direction } = vehicle;
    const vehicleColor = type === 'electric' ? '#00FF00' : type === 'hybrid' ? '#FFFF00' : type === 'gas' ? '#FF6347' : '#4169E1';
    
    return (
      <group 
        key={`vehicle-${index}`} 
        position={position}
        userData={{ 
          type: 'vehicle', 
          vehicleType: type, 
          direction 
        }}
      >
        {type === 'bike' ? (
          <>
            {/* Bicycle frame */}
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.1, 0.4]} />
              <meshLambertMaterial color={vehicleColor} />
            </mesh>
            {/* Wheels */}
            <mesh position={[-0.4, -0.2, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1]} />
              <meshLambertMaterial color="#2F4F4F" />
            </mesh>
            <mesh position={[0.4, -0.2, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1]} />
              <meshLambertMaterial color="#2F4F4F" />
            </mesh>
          </>
        ) : (
          <>
            {/* Car body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2, 0.8, 1]} />
              <meshLambertMaterial color={vehicleColor} />
            </mesh>
            {/* Car windows */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[1.8, 0.4, 0.98]} />
              <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
            </mesh>
            {/* Wheels */}
            {[-0.7, 0.7].map((x, i) => (
              <mesh key={i} position={[x, -0.5, 0.6]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2]} />
                <meshLambertMaterial color="#2F4F4F" />
              </mesh>
            ))}
          </>
        )}
        
        {/* Eco indicator for electric/hybrid vehicles */}
        {(type === 'electric' || type === 'hybrid') && (
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshBasicMaterial color="#00FF00" />
          </mesh>
        )}
      </group>
    );
  };

  const renderPollutionSource = (pollution: typeof cityLayout.pollutionSources[0], index: number) => {
    const { position, type, severity } = pollution;
    const severityColor = severity === 'high' ? '#8B0000' : severity === 'medium' ? '#FF4500' : '#FFA500';
    
    return (
      <group 
        key={`pollution-${index}`} 
        position={position}
        userData={{ 
          type: 'pollution', 
          pollutionType: type, 
          severity 
        }}
        onClick={(e) => {
          e.stopPropagation();
          handlePollutionCleanup(type, severity, new THREE.Vector3(...position));
        }}
      >
        {type === 'smokestack' && (
          <>
            {/* Smokestack structure */}
            <mesh castShadow>
              <cylinderGeometry args={[0.8, 1, 8]} />
              <meshLambertMaterial color="#696969" />
            </mesh>
            {/* Smoke clouds */}
            <mesh position={[0, 5, 0]}>
              <sphereGeometry args={[1.5, 8, 6]} />
              <meshBasicMaterial color={severityColor} transparent opacity={0.4} />
            </mesh>
            <mesh position={[1, 6, 0]}>
              <sphereGeometry args={[1.2, 8, 6]} />
              <meshBasicMaterial color={severityColor} transparent opacity={0.3} />
            </mesh>
          </>
        )}
        
        {type === 'traffic' && (
          <>
            {/* Traffic pollution cloud */}
            <mesh>
              <sphereGeometry args={[2, 8, 6]} />
              <meshBasicMaterial color={severityColor} transparent opacity={0.3} />
            </mesh>
          </>
        )}
        
        {type === 'landfill' && (
          <>
            {/* Landfill pile */}
            <mesh castShadow>
              <coneGeometry args={[3, 2, 8]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            {/* Methane gas */}
            <mesh position={[0, 3, 0]}>
              <sphereGeometry args={[1, 8, 6]} />
              <meshBasicMaterial color={severityColor} transparent opacity={0.4} />
            </mesh>
          </>
        )}
        
        {/* Warning indicator */}
        <mesh position={[0, type === 'smokestack' ? 10 : 4, 0]}>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
      </group>
    );
  };

  const renderRenewableEnergy = (renewable: typeof cityLayout.renewableEnergy[0], index: number) => {
    const { position, type, installed } = renewable;
    
    if (installed) {
      // Already installed renewable energy
      return (
        <group key={`renewable-installed-${index}`} position={position} userData={{ type: 'renewable', renewableType: type, installed: true }}>
          {type === 'solar' && (
            <mesh castShadow>
              <boxGeometry args={[4, 0.1, 3]} />
              <meshLambertMaterial color="#191970" />
            </mesh>
          )}
          
          {type === 'wind' && (
            <>
              {/* Wind turbine tower */}
              <mesh castShadow>
                <cylinderGeometry args={[0.3, 0.5, 12]} />
                <meshLambertMaterial color="#F5F5F5" />
              </mesh>
              {/* Turbine blades */}
              <group position={[0, 6, 0]}>
                {[0, 120, 240].map((angle, i) => (
                  <mesh 
                    key={i}
                    position={[
                      Math.cos((angle * Math.PI) / 180) * 3,
                      0,
                      Math.sin((angle * Math.PI) / 180) * 3
                    ]}
                    rotation={[0, 0, (angle * Math.PI) / 180]}
                    castShadow
                  >
                    <boxGeometry args={[0.2, 6, 0.1]} />
                    <meshLambertMaterial color="#E0E0E0" />
                  </mesh>
                ))}
              </group>
            </>
          )}
          
          {type === 'hydro' && (
            <>
              {/* Hydro generator */}
              <mesh castShadow>
                <cylinderGeometry args={[1.5, 1.5, 3]} />
                <meshLambertMaterial color="#4682B4" />
              </mesh>
              <mesh position={[0, 0, 2]} castShadow>
                <cylinderGeometry args={[0.8, 0.8, 2]} />
                <meshLambertMaterial color="#2F4F4F" />
              </mesh>
            </>
          )}
        </group>
      );
    } else {
      // Installation opportunity
      return (
        <group 
          key={`renewable-opportunity-${index}`} 
          position={position}
          userData={{ type: 'renewable', renewableType: type, installed: false }}
          onClick={(e) => {
            e.stopPropagation();
            handleRenewableInstall(type, new THREE.Vector3(...position));
          }}
        >
          {/* Installation marker */}
          <mesh>
            <boxGeometry args={[2, 0.5, 2]} />
            <meshBasicMaterial color="#00FF00" transparent opacity={0.3} />
          </mesh>
          
          {/* Icon indicator */}
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.3, 8, 6]} />
            <meshBasicMaterial color="#32CD32" />
          </mesh>
          
          {/* Type indicator */}
          <mesh position={[0, 1.8, 0]}>
            {type === 'solar' && <boxGeometry args={[0.6, 0.1, 0.4]} />}
            {type === 'wind' && <cylinderGeometry args={[0.05, 0.05, 1]} />}
            {type === 'hydro' && <cylinderGeometry args={[0.2, 0.2, 0.4]} />}
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        </group>
      );
    }
  };

  const renderGreenSpace = (space: typeof cityLayout.greenSpaces[0], index: number) => {
    const { position, type, size } = space;
    
    return (
      <group 
        key={`greenspace-${index}`} 
        position={position}
        userData={{ type: 'greenspace', greenType: type }}
        onClick={(e) => {
          e.stopPropagation();
          handleGreenSpaceCreate(type, size, new THREE.Vector3(...position));
        }}
      >
        {type === 'park' && (
          <>
            {/* Stylized park grass area with vibrant colors */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[size, size]} />
              <meshLambertMaterial 
                map={grassTexture} 
                color="#32CD32"  // Vibrant lime green tint
              />
            </mesh>
            {/* Subtle overlay for Free Fire style */}
            <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[size * 0.9, size * 0.9]} />
              <meshBasicMaterial 
                color="#7CFC00" 
                transparent 
                opacity={0.1}
              />
            </mesh>
            {/* Stylized Park trees with Free Fire aesthetic */}
            {Array.from({ length: Math.floor(size / 2) }).map((_, i) => (
              <group 
                key={i}
                position={[
                  (Math.random() - 0.5) * size * 0.8,
                  0,
                  (Math.random() - 0.5) * size * 0.8
                ]}
              >
                {/* Modern tree trunk */}
                <mesh position={[0, 2, 0]} castShadow>
                  <cylinderGeometry args={[0.25, 0.35, 4, 8]} />
                  <meshLambertMaterial color="#A0522D" />
                </mesh>
                
                {/* Layered vibrant foliage */}
                <mesh position={[0, 4.5, 0]} castShadow>
                  <sphereGeometry args={[1.8, 12, 8]} />
                  <meshLambertMaterial color="#32CD32" />
                </mesh>
                <mesh position={[0, 5.2, 0]} castShadow>
                  <sphereGeometry args={[1.4, 12, 8]} />
                  <meshLambertMaterial color="#7CFC00" />
                </mesh>
                <mesh position={[0, 5.8, 0]} castShadow>
                  <sphereGeometry args={[1, 12, 8]} />
                  <meshLambertMaterial color="#00FF00" />
                </mesh>
                
                {/* Subtle glow effect */}
                <mesh position={[0, 4.8, 0]}>
                  <sphereGeometry args={[2.2, 16, 12]} />
                  <meshBasicMaterial 
                    color="#90EE90" 
                    transparent 
                    opacity={0.08}
                  />
                </mesh>
              </group>
            ))}
          </>
        )}
        
        {type === 'garden' && (
          <>
            {/* Garden bed */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[size, size]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Flowers and plants */}
            {Array.from({ length: Math.floor(size * 2) }).map((_, i) => (
              <mesh 
                key={i}
                position={[
                  (Math.random() - 0.5) * size * 0.9,
                  0.2,
                  (Math.random() - 0.5) * size * 0.9
                ]}
                castShadow
              >
                <sphereGeometry args={[0.1, 6, 4]} />
                <meshLambertMaterial color={`hsl(${Math.random() * 360}, 70%, 50%)`} />
              </mesh>
            ))}
          </>
        )}
        
        {type === 'tree' && (
          <>
            {/* Stylized single tree with vibrant Free Fire colors */}
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.45, 4, 8]} />
              <meshLambertMaterial color="#A0522D" />
            </mesh>
            
            {/* Layered foliage for depth and vibrancy */}
            <mesh position={[0, 5, 0]} castShadow>
              <sphereGeometry args={[2.2, 12, 8]} />
              <meshLambertMaterial color="#32CD32" />
            </mesh>
            <mesh position={[0, 5.8, 0]} castShadow>
              <sphereGeometry args={[1.8, 12, 8]} />
              <meshLambertMaterial color="#7CFC00" />
            </mesh>
            <mesh position={[0, 6.4, 0]} castShadow>
              <sphereGeometry args={[1.2, 12, 8]} />
              <meshLambertMaterial color="#00FF00" />
            </mesh>
            
            {/* Glow effect for Free Fire style */}
            <mesh position={[0, 5.2, 0]}>
              <sphereGeometry args={[2.6, 16, 12]} />
              <meshBasicMaterial 
                color="#90EE90" 
                transparent 
                opacity={0.08}
              />
            </mesh>
          </>
        )}
        
        {/* Eco benefit indicator */}
        <mesh position={[0, size + 2, 0]}>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshBasicMaterial color="#00FF00" transparent opacity={0.6} />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* City streets and sidewalks */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial map={asphaltTexture} />
      </mesh>

      {/* Main roads */}
      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 100]} />
        <meshLambertMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 100]} />
        <meshLambertMaterial color="#2F4F4F" />
      </mesh>

      {/* Road markings */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh 
          key={`road-marking-${i}`}
          position={[0, 0.02, -45 + i * 5]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.2, 2]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      ))}

      {/* Render all city elements */}
      {cityLayout.buildings.map(renderBuilding)}
      {cityLayout.vehicles.map(renderVehicle)}
      {cityLayout.pollutionSources.map(renderPollutionSource)}
      {cityLayout.renewableEnergy.map(renderRenewableEnergy)}
      {cityLayout.greenSpaces.map(renderGreenSpace)}

      {/* City atmosphere and smog */}
      <group>
        {Array.from({ length: 25 }).map((_, i) => (
          <mesh
            key={`smog-${i}`}
            position={[
              (Math.random() - 0.5) * 90,
              3 + Math.random() * 8,
              (Math.random() - 0.5) * 90
            ]}
          >
            <sphereGeometry args={[1 + Math.random() * 2, 8, 6]} />
            <meshBasicMaterial color="#696969" transparent opacity={0.15} />
          </mesh>
        ))}
      </group>

      {/* Street lights */}
      {Array.from({ length: 16 }).map((_, i) => (
        <group 
          key={`streetlight-${i}`}
          position={[
            (Math.random() - 0.5) * 85,
            0,
            (Math.random() - 0.5) * 85
          ]}
        >
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 8]} />
            <meshLambertMaterial color="#A0A0A0" />
          </mesh>
          <mesh position={[0, 8.2, 0]}>
            <sphereGeometry args={[0.3, 8, 6]} />
            <meshBasicMaterial color="#FFFF99" />
          </mesh>
        </group>
      ))}
    </group>
  );
}