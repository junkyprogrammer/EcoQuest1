/**
 * EcoCityBuilder Main Component
 * 3D City Builder with environmental focus for educational gameplay
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CityGridManager, DragDropManager, RayCastHelper } from '../../lib/cityGridSystem';
import { CityResourceManager } from '../../lib/cityResourceManager';
import { buildingDefinitions, getBuildingDefinition } from '../../lib/ecoCityBuilderData';
import { 
  BuildingType, 
  CityBuilding, 
  GridPosition, 
  CityBuilderState,
  PlacementValidation 
} from '../../lib/ecoCityBuilderTypes';
import { useGameState } from '../../lib/stores/useGameState';
import { useAudio } from '../../lib/stores/useAudio';

interface EcoCityBuilderProps {
  isActive: boolean;
  onClose: () => void;
}

// Grid cell visualization component
function GridCell({ position, terrain, occupied, highlighted, warning }: {
  position: [number, number, number];
  terrain: string;
  occupied: boolean;
  highlighted: boolean;
  warning: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getTerrainColor = () => {
    if (warning) return '#ff4444';
    if (highlighted) return '#44ff44';
    switch (terrain) {
      case 'water': return '#4a90e2';
      case 'park': return '#7ed321';
      case 'road': return '#4a4a4a';
      default: return occupied ? '#8b7d6b' : '#f5f5f5';
    }
  };

  useFrame((state) => {
    if (meshRef.current && highlighted) {
      meshRef.current.position.y = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    } else if (meshRef.current) {
      meshRef.current.position.y = terrain === 'water' ? -0.1 : 0;
    }
  });

  return (
    <mesh ref={meshRef} position={position} receiveShadow>
      <boxGeometry args={[3.8, 0.1, 3.8]} />
      <meshLambertMaterial 
        color={getTerrainColor()} 
        transparent 
        opacity={terrain === 'water' ? 0.7 : 1.0}
      />
    </mesh>
  );
}

// Building visualization component
function Building3D({ building, highlighted, constructionProgress }: {
  building: CityBuilding;
  highlighted: boolean;
  constructionProgress: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const buildingDef = getBuildingDefinition(building.type);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Construction animation
      const targetScale = constructionProgress;
      meshRef.current.scale.lerp(new THREE.Vector3(1, targetScale, 1), 0.1);
      
      // Highlight animation
      if (highlighted) {
        meshRef.current.position.y = buildingDef.size.height / 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      } else {
        meshRef.current.position.y = buildingDef.size.height / 2;
      }
      
      // Efficiency glow effect
      if (building.efficiency < 0.8) {
        // Add some visual indication of low efficiency
      }
    }
  });

  const getBuildingColor = () => {
    if (building.status === 'constructing') return '#ffaa00';
    if (building.status === 'needs_maintenance') return '#ff6666';
    return buildingDef.visualProperties.color;
  };

  return (
    <group ref={meshRef} position={[0, buildingDef.size.height / 2, 0]}>
      {/* Main building structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[buildingDef.size.width, buildingDef.size.height, buildingDef.size.depth]} />
        <meshLambertMaterial color={getBuildingColor()} />
      </mesh>
      
      {/* Building type indicators */}
      {buildingDef.category === 'energy' && (
        <mesh position={[0, buildingDef.size.height / 2 + 0.5, 0]}>
          <sphereGeometry args={[0.3, 8, 6]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}
      
      {/* Emissions visualization */}
      {buildingDef.visualProperties.emissions === 'smoke' && building.status === 'operational' && (
        <Smoke position={[0, buildingDef.size.height / 2 + 1, 0]} />
      )}
      
      {/* Construction progress indicator */}
      {building.status === 'constructing' && (
        <Text
          position={[0, buildingDef.size.height + 1, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`${Math.round(building.constructionProgress * 100)}%`}
        </Text>
      )}
      
      {/* Status indicators */}
      {!building.powered && (
        <mesh position={[-buildingDef.size.width / 2 - 0.3, buildingDef.size.height / 2, 0]}>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      )}
    </group>
  );
}

// Smoke effect component
function Smoke({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.children.forEach((child, index) => {
        child.position.y += 0.02;
        child.position.x += Math.sin(state.clock.elapsedTime + index) * 0.005;
        if (child.position.y > 5) {
          child.position.y = 0;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.5, 0]}>
          <sphereGeometry args={[0.3 + i * 0.1, 8, 6]} />
          <meshBasicMaterial 
            color="#666666" 
            transparent 
            opacity={0.6 - i * 0.1} 
          />
        </mesh>
      ))}
    </group>
  );
}

// City grid visualization
function CityGrid({ 
  gridManager, 
  hoveredPosition, 
  selectedBuildingType, 
  placementValidation 
}: {
  gridManager: CityGridManager;
  hoveredPosition: GridPosition | null;
  selectedBuildingType: BuildingType | null;
  placementValidation: PlacementValidation | null;
}) {
  const grassTexture = useTexture('/textures/grass.png');
  const asphaltTexture = useTexture('/textures/asphalt.png');
  
  const grid = gridManager.getGrid();
  const buildings = gridManager.getBuildings();

  // Configure textures
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(0.5, 0.5);
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(0.5, 0.5);

  const gridCells = useMemo(() => {
    const cells = [];
    const cellSize = gridManager.getCellSize();
    
    for (let x = 0; x < grid.width; x++) {
      for (let z = 0; z < grid.height; z++) {
        const cell = grid.cells[x][z];
        const worldPos = gridManager.gridToWorld({ x, z });
        
        const isHovered = hoveredPosition && hoveredPosition.x === x && hoveredPosition.z === z;
        const hasWarning = placementValidation && !placementValidation.canPlace && 
                          hoveredPosition && hoveredPosition.x === x && hoveredPosition.z === z;
        
        cells.push(
          <GridCell
            key={`${x}-${z}`}
            position={[worldPos.x, worldPos.y, worldPos.z]}
            terrain={cell.terrain}
            occupied={cell.occupied}
            highlighted={isHovered && selectedBuildingType !== null}
            warning={hasWarning || false}
          />
        );
      }
    }
    return cells;
  }, [grid, hoveredPosition, selectedBuildingType, placementValidation, gridManager]);

  const buildingMeshes = useMemo(() => {
    return buildings.map((building) => {
      const worldPos = gridManager.gridToWorld(building.position);
      const isHighlighted = hoveredPosition && 
                           hoveredPosition.x === building.position.x && 
                           hoveredPosition.z === building.position.z;
      
      return (
        <group key={building.id} position={[worldPos.x, worldPos.y, worldPos.z]}>
          <Building3D 
            building={building}
            highlighted={isHighlighted || false}
            constructionProgress={building.constructionProgress}
          />
        </group>
      );
    });
  }, [buildings, hoveredPosition, gridManager]);

  return (
    <>
      {/* Base terrain */}
      <mesh position={[0, -0.2, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[grid.width * 4, grid.height * 4]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>
      
      {/* Grid cells */}
      {gridCells}
      
      {/* Buildings */}
      {buildingMeshes}
    </>
  );
}

// Building selection UI
function BuildingPalette({ 
  selectedBuildingType, 
  onSelectBuilding,
  resources,
  unlockedBuildings 
}: {
  selectedBuildingType: BuildingType | null;
  onSelectBuilding: (type: BuildingType | null) => void;
  resources: any;
  unlockedBuildings: BuildingType[];
}) {
  const categories = ['residential', 'commercial', 'industrial', 'energy', 'infrastructure', 'environment'] as const;
  
  return (
    <div className="absolute left-4 top-4 bg-black/80 text-white p-4 rounded-lg max-w-xs">
      <h3 className="text-lg font-bold mb-3">Building Menu</h3>
      
      {categories.map(category => {
        const categoryBuildings = Object.values(buildingDefinitions)
          .filter(def => def.category === category && unlockedBuildings.includes(def.id));
        
        if (categoryBuildings.length === 0) return null;
        
        return (
          <div key={category} className="mb-4">
            <h4 className="text-sm font-semibold mb-2 capitalize">{category}</h4>
            <div className="grid grid-cols-2 gap-1">
              {categoryBuildings.map(building => {
                const canAfford = resources.economy.funds >= building.stats.cost;
                const isSelected = selectedBuildingType === building.id;
                
                return (
                  <button
                    key={building.id}
                    onClick={() => onSelectBuilding(isSelected ? null : building.id)}
                    disabled={!canAfford}
                    className={`p-2 text-xs rounded border transition-all ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-400' 
                        : canAfford 
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600' 
                          : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium">{building.name}</div>
                    <div className="text-xs">${building.stats.cost.toLocaleString()}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {selectedBuildingType && (
        <button
          onClick={() => onSelectBuilding(null)}
          className="w-full mt-3 p-2 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Cancel Selection
        </button>
      )}
    </div>
  );
}

// Resource display UI
function ResourceDisplay({ resources, statistics }: {
  resources: any;
  statistics: any;
}) {
  return (
    <div className="absolute right-4 top-4 bg-black/80 text-white p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-3">City Statistics</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Population:</span>
          <span>{Math.round(resources.population.total)}/{resources.population.capacity}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Happiness:</span>
          <span className={resources.population.happiness > 70 ? 'text-green-400' : resources.population.happiness > 40 ? 'text-yellow-400' : 'text-red-400'}>
            {Math.round(resources.population.happiness)}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Funds:</span>
          <span className={resources.economy.funds > 0 ? 'text-green-400' : 'text-red-400'}>
            ${resources.economy.funds.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Energy:</span>
          <span className={resources.energy.production >= resources.energy.consumption ? 'text-green-400' : 'text-red-400'}>
            {Math.round(resources.energy.production)}/{Math.round(resources.energy.consumption)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Air Quality:</span>
          <span className={resources.environment.airQuality > 70 ? 'text-green-400' : resources.environment.airQuality > 40 ? 'text-yellow-400' : 'text-red-400'}>
            {Math.round(resources.environment.airQuality)}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Sustainability:</span>
          <span className={statistics.sustainabilityScore > 70 ? 'text-green-400' : statistics.sustainabilityScore > 40 ? 'text-yellow-400' : 'text-red-400'}>
            {Math.round(statistics.sustainabilityScore)}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Renewables:</span>
          <span className="text-blue-400">
            {Math.round(resources.energy.renewablePercentage)}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Recycling:</span>
          <span className={resources.waste.recyclingRate > 70 ? 'text-green-400' : 'text-yellow-400'}>
            {Math.round(resources.waste.recyclingRate)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// Mouse interaction handler
function MouseHandler({ 
  gridManager, 
  selectedBuildingType,
  onHover,
  onPlace,
  onValidationChange
}: {
  gridManager: CityGridManager;
  selectedBuildingType: BuildingType | null;
  onHover: (pos: GridPosition | null) => void;
  onPlace: (type: BuildingType, pos: GridPosition) => void;
  onValidationChange: (validation: PlacementValidation | null) => void;
}) {
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new RayCastHelper(), []);
  
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!selectedBuildingType) {
      onHover(null);
      onValidationChange(null);
      return;
    }
    
    // Create a ground plane for raycasting
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const worldPos = raycaster.getMouseWorldPosition(event, camera, groundPlane);
    
    if (worldPos) {
      const gridPos = gridManager.worldToGrid(worldPos);
      onHover(gridPos);
      
      // Validate placement
      const validation = gridManager.validatePlacement(selectedBuildingType, gridPos);
      onValidationChange(validation);
    }
  }, [selectedBuildingType, camera, gridManager, onHover, onValidationChange, raycaster]);
  
  const handleClick = useCallback((event: MouseEvent) => {
    if (!selectedBuildingType) return;
    
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const worldPos = raycaster.getMouseWorldPosition(event, camera, groundPlane);
    
    if (worldPos) {
      const gridPos = gridManager.worldToGrid(worldPos);
      const validation = gridManager.validatePlacement(selectedBuildingType, gridPos);
      
      if (validation.canPlace) {
        onPlace(selectedBuildingType, gridPos);
      }
    }
  }, [selectedBuildingType, camera, gridManager, onPlace, raycaster]);
  
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gl, handleMouseMove, handleClick]);
  
  return null;
}

// Main EcoCityBuilder component
export default function EcoCityBuilder({ isActive, onClose }: EcoCityBuilderProps) {
  const { addScore, subtractScore } = useGameState();
  const { playSuccess, playError } = useAudio();
  
  // Core systems
  const [gridManager] = useState(() => new CityGridManager(40, 40));
  const [resourceManager] = useState(() => new CityResourceManager());
  
  // UI state
  const [selectedBuildingType, setSelectedBuildingType] = useState<BuildingType | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<GridPosition | null>(null);
  const [placementValidation, setPlacementValidation] = useState<PlacementValidation | null>(null);
  const [showStats, setShowStats] = useState(true);
  
  // Resource state
  const [resources, setResources] = useState(resourceManager.getResources());
  const [statistics, setStatistics] = useState(resourceManager.getStatistics());
  const [unlockedBuildings, setUnlockedBuildings] = useState<BuildingType[]>([
    'house', 'shop', 'solar_panel', 'park', 'road', 'wind_turbine'
  ]);
  
  // Update loop
  useEffect(() => {
    let lastTime = Date.now();
    const updateInterval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Update construction progress
      gridManager.updateConstruction(deltaTime);
      
      // Update resources
      resourceManager.updateResources(gridManager.getBuildings(), gridManager, deltaTime);
      
      // Update state
      setResources(resourceManager.getResources());
      setStatistics(resourceManager.getStatistics());
    }, 100); // Update 10 times per second
    
    return () => clearInterval(updateInterval);
  }, [gridManager, resourceManager]);
  
  // Handle building placement
  const handleBuildingPlace = useCallback((buildingType: BuildingType, position: GridPosition) => {
    const buildingDef = getBuildingDefinition(buildingType);
    
    // Check if can afford
    if (resources.economy.funds < buildingDef.stats.cost) {
      playError();
      return;
    }
    
    // Place building
    const building = gridManager.placeBuilding(buildingType, position);
    if (building) {
      // Deduct cost
      resourceManager.addFunds(-buildingDef.stats.cost);
      playSuccess();
      addScore(Math.floor(buildingDef.stats.cost / 1000));
      
      // Clear selection
      setSelectedBuildingType(null);
      setHoveredPosition(null);
      setPlacementValidation(null);
      
      console.log(`Placed ${buildingType} at (${position.x}, ${position.z})`);
    } else {
      playError();
    }
  }, [gridManager, resourceManager, resources.economy.funds, playSuccess, playError, addScore]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [20, 30, 20], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[50, 50, 25]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <CityGrid 
          gridManager={gridManager}
          hoveredPosition={hoveredPosition}
          selectedBuildingType={selectedBuildingType}
          placementValidation={placementValidation}
        />
        
        <MouseHandler
          gridManager={gridManager}
          selectedBuildingType={selectedBuildingType}
          onHover={setHoveredPosition}
          onPlace={handleBuildingPlace}
          onValidationChange={setPlacementValidation}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={10}
          maxDistance={100}
        />
      </Canvas>
      
      {/* UI Overlays */}
      <BuildingPalette
        selectedBuildingType={selectedBuildingType}
        onSelectBuilding={setSelectedBuildingType}
        resources={resources}
        unlockedBuildings={unlockedBuildings}
      />
      
      {showStats && (
        <ResourceDisplay 
          resources={resources}
          statistics={statistics}
        />
      )}
      
      {/* Placement validation feedback */}
      {placementValidation && !placementValidation.canPlace && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-3 rounded-lg">
          <div className="font-semibold">Cannot place building:</div>
          {placementValidation.errors.map((error, i) => (
            <div key={i} className="text-sm">• {error}</div>
          ))}
        </div>
      )}
      
      {/* Control buttons */}
      <div className="absolute bottom-4 right-4 space-x-2">
        <button
          onClick={() => setShowStats(!showStats)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
        
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Close City Builder
        </button>
      </div>
      
      {/* Environmental consequences notification */}
      {statistics.challenges.length > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-600 text-white p-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Environmental Alert!</h3>
          {statistics.challenges.map((challenge, i) => (
            <div key={i} className="mb-2">
              <div className="font-medium">{challenge.message}</div>
              <div className="text-sm">{challenge.cause}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}