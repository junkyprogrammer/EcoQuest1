import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import TerrainChunk from './TerrainChunk';
import { ChunkManager, Chunk, WORLD_UNITS } from '../lib/ChunkManager';

export default function Terrain() {
  const { camera } = useThree();
  const chunkManagerRef = useRef<ChunkManager>(new ChunkManager());
  const [visibleChunks, setVisibleChunks] = useState<Chunk[]>([]);
  const [stats, setStats] = useState({ total: 0, visible: 0, high: 0, medium: 0, low: 0 });
  const lastUpdateTime = useRef(0);
  const updateInterval = 100; // Update chunks every 100ms

  // Initialize chunk manager
  useEffect(() => {
    console.log('🌍 Massive Terrain System Initialized');
    console.log(`📏 Total world size: ${WORLD_UNITS}x${WORLD_UNITS} units`);
    console.log('⚡ Chunk-based rendering with LOD enabled');
    
    // Force initial chunk update with player at origin
    chunkManagerRef.current.updatePlayerPosition(new THREE.Vector3(0, 0, 0));
    const initialChunks = chunkManagerRef.current.getVisibleChunks();
    setVisibleChunks(initialChunks);
    console.log(`🔥 Initial chunks loaded: ${initialChunks.length} chunks`);
    
    return () => {
      chunkManagerRef.current.clear();
    };
  }, []);

  // Update visible chunks based on camera position
  useFrame((state, delta) => {
    const now = performance.now();
    
    // Throttle chunk updates for performance
    if (now - lastUpdateTime.current < updateInterval) {
      return;
    }
    lastUpdateTime.current = now;

    // Update chunk manager with camera position
    const hasChanged = chunkManagerRef.current.updatePlayerPosition(camera.position);
    
    if (hasChanged) {
      const chunks = chunkManagerRef.current.getVisibleChunks();
      setVisibleChunks(chunks);
      
      // Update stats for debugging
      const newStats = chunkManagerRef.current.getStats();
      setStats(newStats);
      
      // Log chunk updates periodically
      if (Math.random() < 0.1) { // Log 10% of updates
        console.log(`📊 Terrain chunks - Visible: ${newStats.visible} (High: ${newStats.high}, Med: ${newStats.medium}, Low: ${newStats.low})`);
      }
    }
  });

  return (
    <group name="terrain">
      {/* Render visible chunks */}
      {visibleChunks.map((chunk) => (
        <TerrainChunk
          key={chunk.key}
          worldX={chunk.worldX}
          worldZ={chunk.worldZ}
          lod={chunk.lod as 'high' | 'medium' | 'low'}
        />
      ))}
      
      {/* Optional: Render debug info */}
      {process.env.NODE_ENV === 'development' && (
        <group name="debug-info">
          {/* Debug plane at origin for reference */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial color="red" opacity={0.3} transparent />
          </mesh>
        </group>
      )}
      
      {/* Paths and roads system */}
      <PathSystem />
    </group>
  );
}

// Path system that scales with the massive world
function PathSystem() {
  const asphaltTexture = useTexture('/textures/asphalt.png');
  
  // Configure texture
  React.useMemo(() => {
    asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
    asphaltTexture.repeat.set(100, 4); // Scale for massive world
  }, [asphaltTexture]);

  return (
    <group name="paths">
      {/* Main road through center of world */}
      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 8]} />
        <meshLambertMaterial map={asphaltTexture} />
      </mesh>
      
      {/* Cross road */}
      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 1000]} />
        <meshLambertMaterial map={asphaltTexture} />
      </mesh>
      
      {/* Additional paths can be added here */}
    </group>
  );
}