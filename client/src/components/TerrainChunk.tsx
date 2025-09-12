import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CHUNK_SIZE } from '../lib/ChunkManager';

interface TerrainChunkProps {
  worldX: number;
  worldZ: number;
  lod: 'high' | 'medium' | 'low';
}

export default function TerrainChunk({ worldX, worldZ, lod }: TerrainChunkProps) {
  const grassTexture = useTexture('/textures/grass.png');
  
  // Configure texture based on LOD
  useMemo(() => {
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    
    // Adjust texture repeat based on LOD for performance
    if (lod === 'high') {
      grassTexture.repeat.set(4, 4); // Detailed texture
    } else if (lod === 'medium') {
      grassTexture.repeat.set(2, 2); // Less detailed
    } else {
      grassTexture.repeat.set(1, 1); // Minimal detail
    }
    
    // Update texture settings for performance
    grassTexture.magFilter = lod === 'high' ? THREE.LinearFilter : THREE.NearestFilter;
    grassTexture.minFilter = lod === 'high' ? THREE.LinearMipMapLinearFilter : THREE.NearestFilter;
    
    if (lod !== 'high') {
      grassTexture.anisotropy = 1; // Reduce anisotropy for distant chunks
    }
  }, [grassTexture, lod]);

  // Geometry segments based on LOD
  const segments = useMemo(() => {
    switch (lod) {
      case 'high':
        return 4; // 4x4 segments for detailed terrain
      case 'medium':
        return 2; // 2x2 segments
      case 'low':
        return 1; // Single quad
      default:
        return 1;
    }
  }, [lod]);

  // Material quality based on LOD
  const material = useMemo(() => {
    if (lod === 'high') {
      // High quality material for nearby chunks
      return (
        <meshLambertMaterial 
          map={grassTexture} 
          color="#32CD32"
          side={THREE.FrontSide}
        />
      );
    } else if (lod === 'medium') {
      // Medium quality material
      return (
        <meshLambertMaterial 
          map={grassTexture} 
          color="#32CD32"
          side={THREE.FrontSide}
        />
      );
    } else {
      // Low quality material for distant chunks (no texture for performance)
      return (
        <meshBasicMaterial 
          color="#228B22"
          side={THREE.FrontSide}
        />
      );
    }
  }, [grassTexture, lod]);

  return (
    <mesh 
      position={[worldX + CHUNK_SIZE / 2, 0, worldZ + CHUNK_SIZE / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow={lod === 'high'} // Only cast shadows for nearby chunks
      frustumCulled={true} // Enable frustum culling for performance
    >
      <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE, segments, segments]} />
      {material}
    </mesh>
  );
}