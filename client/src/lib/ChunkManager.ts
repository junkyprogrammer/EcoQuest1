import * as THREE from 'three';

// Chunk configuration
const CHUNK_SIZE = 8; // Each chunk is 8x8 units
const WORLD_SIZE = 2000; // 2000x2000 chunks
const WORLD_UNITS = WORLD_SIZE * CHUNK_SIZE; // 16,000x16,000 units

// LOD distances in world units
const LOD_DISTANCES = {
  HIGH: 100,      // < 100 units: full detail
  MEDIUM: 300,    // 100-300 units: medium detail
  LOW: 500,       // 300-500 units: low detail
  CULL: 800       // > 800 units: don't render (increased for better visibility)
};

export type LODLevel = 'high' | 'medium' | 'low' | 'unloaded';

export interface Chunk {
  x: number;           // Chunk grid X (0-1999)
  z: number;           // Chunk grid Z (0-1999)
  worldX: number;      // World position X
  worldZ: number;      // World position Z
  centerX: number;     // Center of chunk in world space
  centerZ: number;     // Center of chunk in world space
  loaded: boolean;
  lod: LODLevel;
  key: string;         // Unique identifier "x,z"
}

export class ChunkManager {
  private chunks: Map<string, Chunk> = new Map();
  private visibleChunks: Set<string> = new Set();
  private playerPosition: THREE.Vector3 = new THREE.Vector3();
  private lastUpdatePosition: THREE.Vector3 = new THREE.Vector3();
  private updateDistance = 50; // Update chunks when player moves this far

  constructor() {
    console.log('🌍 ChunkManager initialized');
    console.log(`📏 World size: ${WORLD_SIZE}x${WORLD_SIZE} chunks (${WORLD_UNITS}x${WORLD_UNITS} units)`);
    console.log(`📦 Chunk size: ${CHUNK_SIZE}x${CHUNK_SIZE} units`);
    console.log(`👁️ LOD distances: High=${LOD_DISTANCES.HIGH}, Medium=${LOD_DISTANCES.MEDIUM}, Low=${LOD_DISTANCES.LOW}, Cull=${LOD_DISTANCES.CULL}`);
  }

  /**
   * Update player position and determine which chunks should be visible
   */
  updatePlayerPosition(position: THREE.Vector3): boolean {
    this.playerPosition.copy(position);
    
    // Check if we need to update chunks
    const distance = this.playerPosition.distanceTo(this.lastUpdatePosition);
    if (distance < this.updateDistance && this.visibleChunks.size > 0) {
      return false; // No update needed
    }

    this.lastUpdatePosition.copy(this.playerPosition);
    return this.updateVisibleChunks();
  }

  /**
   * Determine which chunks should be visible based on player position
   */
  private updateVisibleChunks(): boolean {
    const oldVisible = new Set(this.visibleChunks);
    this.visibleChunks.clear();

    // Convert player position to chunk coordinates
    const playerChunkX = Math.floor((this.playerPosition.x + WORLD_UNITS / 2) / CHUNK_SIZE);
    const playerChunkZ = Math.floor((this.playerPosition.z + WORLD_UNITS / 2) / CHUNK_SIZE);

    // Calculate chunk radius to check (based on cull distance)
    const chunkRadius = Math.ceil(LOD_DISTANCES.CULL / CHUNK_SIZE);

    // Check chunks within radius
    for (let dx = -chunkRadius; dx <= chunkRadius; dx++) {
      for (let dz = -chunkRadius; dz <= chunkRadius; dz++) {
        const chunkX = playerChunkX + dx;
        const chunkZ = playerChunkZ + dz;

        // Skip chunks outside world bounds
        if (chunkX < 0 || chunkX >= WORLD_SIZE || chunkZ < 0 || chunkZ >= WORLD_SIZE) {
          continue;
        }

        const chunk = this.getOrCreateChunk(chunkX, chunkZ);
        const distance = this.getChunkDistance(chunk);

        // Determine if chunk should be visible
        if (distance <= LOD_DISTANCES.CULL) {
          // Determine LOD level
          if (distance <= LOD_DISTANCES.HIGH) {
            chunk.lod = 'high';
          } else if (distance <= LOD_DISTANCES.MEDIUM) {
            chunk.lod = 'medium';
          } else if (distance <= LOD_DISTANCES.LOW) {
            chunk.lod = 'low';
          } else {
            continue; // Skip chunks beyond cull distance
          }

          chunk.loaded = true;
          this.visibleChunks.add(chunk.key);
        }
      }
    }

    // Unload chunks that are no longer visible
    for (const key of Array.from(oldVisible)) {
      if (!this.visibleChunks.has(key)) {
        const chunk = this.chunks.get(key);
        if (chunk) {
          chunk.loaded = false;
          chunk.lod = 'unloaded';
        }
      }
    }

    // Return true if visible chunks changed
    return oldVisible.size !== this.visibleChunks.size || 
           !Array.from(oldVisible).every(key => this.visibleChunks.has(key));
  }

  /**
   * Get or create a chunk at the specified grid coordinates
   */
  private getOrCreateChunk(x: number, z: number): Chunk {
    const key = `${x},${z}`;
    
    let chunk = this.chunks.get(key);
    if (!chunk) {
      // Convert chunk grid coordinates to world coordinates
      // Center the world around origin (0,0)
      const worldX = (x * CHUNK_SIZE) - (WORLD_UNITS / 2);
      const worldZ = (z * CHUNK_SIZE) - (WORLD_UNITS / 2);
      
      chunk = {
        x,
        z,
        worldX,
        worldZ,
        centerX: worldX + CHUNK_SIZE / 2,
        centerZ: worldZ + CHUNK_SIZE / 2,
        loaded: false,
        lod: 'unloaded',
        key
      };
      
      this.chunks.set(key, chunk);
    }
    
    return chunk;
  }

  /**
   * Calculate distance from player to chunk center
   */
  private getChunkDistance(chunk: Chunk): number {
    const dx = this.playerPosition.x - chunk.centerX;
    const dz = this.playerPosition.z - chunk.centerZ;
    return Math.sqrt(dx * dx + dz * dz);
  }

  /**
   * Get all currently visible chunks
   */
  getVisibleChunks(): Chunk[] {
    const visible: Chunk[] = [];
    for (const key of Array.from(this.visibleChunks)) {
      const chunk = this.chunks.get(key);
      if (chunk && chunk.loaded) {
        visible.push(chunk);
      }
    }
    return visible;
  }

  /**
   * Get statistics about current chunk state
   */
  getStats() {
    const visible = this.getVisibleChunks();
    const stats = {
      total: this.chunks.size,
      visible: visible.length,
      high: visible.filter(c => c.lod === 'high').length,
      medium: visible.filter(c => c.lod === 'medium').length,
      low: visible.filter(c => c.lod === 'low').length
    };
    return stats;
  }

  /**
   * Clear all chunks (for cleanup)
   */
  clear() {
    this.chunks.clear();
    this.visibleChunks.clear();
  }
}

// Export constants for use in other components
export { CHUNK_SIZE, WORLD_SIZE, WORLD_UNITS, LOD_DISTANCES };