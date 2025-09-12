/**
 * City Grid System for EcoCityBuilder
 * Handles grid-based building placement, validation, and management
 */

import * as THREE from 'three';
import { GridPosition, GridCell, CityGrid, CityBuilding, BuildingType, PlacementValidation, CityBuilderState } from './ecoCityBuilderTypes';
import { getBuildingDefinition } from './ecoCityBuilderData';

export class CityGridManager {
  private grid: CityGrid;
  private buildings: CityBuilding[];
  private cellSize: number = 4; // Size of each grid cell in 3D units

  constructor(width: number = 50, height: number = 50) {
    this.grid = this.initializeGrid(width, height);
    this.buildings = [];
  }

  private initializeGrid(width: number, height: number): CityGrid {
    const cells: GridCell[][] = [];
    
    for (let x = 0; x < width; x++) {
      cells[x] = [];
      for (let z = 0; z < height; z++) {
        cells[x][z] = {
          position: { x, z },
          occupied: false,
          terrain: this.determineTerrain(x, z, width, height),
          elevation: this.calculateElevation(x, z, width, height)
        };
      }
    }

    return {
      width,
      height,
      cells,
      zoom: 1.0,
      center: { x: Math.floor(width / 2), z: Math.floor(height / 2) }
    };
  }

  private determineTerrain(x: number, z: number, width: number, height: number): 'land' | 'water' | 'park' | 'road' {
    // Create some natural water bodies
    const centerX = width / 2;
    const centerZ = height / 2;
    const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
    
    // River running through the city
    if (Math.abs(x - centerX) < 2 && z > height * 0.2 && z < height * 0.8) {
      return 'water';
    }
    
    // Small lake in one corner
    if (distanceFromCenter < 4 && x > width * 0.8 && z > height * 0.8) {
      return 'water';
    }
    
    // Existing roads (basic grid pattern)
    if ((x % 10 === 0 || z % 10 === 0) && x > 5 && x < width - 5 && z > 5 && z < height - 5) {
      return 'road';
    }
    
    // Some existing park areas
    if (x > width * 0.1 && x < width * 0.3 && z > height * 0.6 && z < height * 0.8) {
      return 'park';
    }
    
    return 'land';
  }

  private calculateElevation(x: number, z: number, width: number, height: number): number {
    // Create some gentle hills and valleys
    const noise1 = Math.sin(x * 0.1) * Math.cos(z * 0.1);
    const noise2 = Math.sin(x * 0.05) * Math.sin(z * 0.05);
    return (noise1 + noise2) * 2; // -4 to +4 elevation range
  }

  // Convert world position to grid coordinates
  public worldToGrid(worldPos: THREE.Vector3): GridPosition {
    const x = Math.floor((worldPos.x + (this.grid.width * this.cellSize) / 2) / this.cellSize);
    const z = Math.floor((worldPos.z + (this.grid.height * this.cellSize) / 2) / this.cellSize);
    
    return {
      x: Math.max(0, Math.min(this.grid.width - 1, x)),
      z: Math.max(0, Math.min(this.grid.height - 1, z))
    };
  }

  // Convert grid coordinates to world position
  public gridToWorld(gridPos: GridPosition): THREE.Vector3 {
    const worldX = (gridPos.x - this.grid.width / 2) * this.cellSize + this.cellSize / 2;
    const worldZ = (gridPos.z - this.grid.height / 2) * this.cellSize + this.cellSize / 2;
    const elevation = this.grid.cells[gridPos.x][gridPos.z].elevation;
    
    return new THREE.Vector3(worldX, elevation, worldZ);
  }

  // Check if a position is within grid bounds
  public isValidGridPosition(pos: GridPosition): boolean {
    return pos.x >= 0 && pos.x < this.grid.width && pos.z >= 0 && pos.z < this.grid.height;
  }

  // Get grid cell at position
  public getCell(pos: GridPosition): GridCell | null {
    if (!this.isValidGridPosition(pos)) return null;
    return this.grid.cells[pos.x][pos.z];
  }

  // Check if area is available for building
  public isAreaAvailable(pos: GridPosition, width: number, height: number): boolean {
    for (let x = pos.x; x < pos.x + width; x++) {
      for (let z = pos.z; z < pos.z + height; z++) {
        const cell = this.getCell({ x, z });
        if (!cell || cell.occupied || cell.terrain === 'water') {
          return false;
        }
      }
    }
    return true;
  }

  // Validate building placement
  public validatePlacement(buildingType: BuildingType, pos: GridPosition): PlacementValidation {
    const buildingDef = getBuildingDefinition(buildingType);
    const { width, height } = buildingDef.gridSize;
    const warnings: string[] = [];
    const errors: string[] = [];
    let canPlace = true;

    // Check if area is available
    if (!this.isAreaAvailable(pos, width, height)) {
      errors.push('Area is occupied or contains water');
      canPlace = false;
    }

    // Check building requirements
    if (buildingDef.requirements) {
      const { nearWater, nearRoad, minimumDistance, maximumPerCity } = buildingDef.requirements;

      // Check water requirement
      if (nearWater && !this.isNearTerrain(pos, width, height, 'water', 3)) {
        errors.push('This building must be placed near water');
        canPlace = false;
      }

      // Check road requirement
      if (nearRoad && !this.isNearTerrain(pos, width, height, 'road', 2)) {
        errors.push('This building must be connected to a road');
        canPlace = false;
      }

      // Check minimum distance requirements
      if (minimumDistance) {
        for (const req of minimumDistance) {
          if (this.isTooCloseToBuilding(pos, width, height, req.building, req.distance)) {
            warnings.push(`Should be at least ${req.distance} cells away from ${req.building}`);
            // Don't block placement for distance warnings, just warn
          }
        }
      }

      // Check maximum per city
      if (maximumPerCity) {
        const existingCount = this.buildings.filter(b => b.type === buildingType).length;
        if (existingCount >= maximumPerCity) {
          errors.push(`Maximum ${maximumPerCity} of this building type allowed per city`);
          canPlace = false;
        }
      }
    }

    // Terrain-specific warnings
    const centerCell = this.getCell(pos);
    if (centerCell) {
      if (centerCell.terrain === 'park' && buildingDef.category !== 'environment') {
        warnings.push('Building on park land reduces green space');
      }
      
      if (Math.abs(centerCell.elevation) > 3) {
        warnings.push('Building on steep terrain increases construction costs');
      }
    }

    // Environmental impact warnings
    const impact = buildingDef.environmentalImpact;
    if (impact.airQuality < -20) {
      warnings.push('This building will significantly impact air quality');
    }
    if (impact.co2Emissions > 50) {
      warnings.push('High CO2 emissions - consider renewable alternatives');
    }
    if (impact.noiseLevel > 60) {
      warnings.push('High noise levels may affect nearby residents');
    }

    return {
      isValid: this.isValidGridPosition(pos) && this.isValidGridPosition({ x: pos.x + width - 1, z: pos.z + height - 1 }),
      canPlace,
      warnings,
      errors,
      suggestedPosition: canPlace ? undefined : this.findNearbyValidPosition(buildingType, pos)
    };
  }

  // Check if position is near specific terrain type
  private isNearTerrain(pos: GridPosition, width: number, height: number, terrainType: 'water' | 'road' | 'park' | 'land', maxDistance: number): boolean {
    for (let x = pos.x - maxDistance; x <= pos.x + width + maxDistance; x++) {
      for (let z = pos.z - maxDistance; z <= pos.z + height + maxDistance; z++) {
        const cell = this.getCell({ x, z });
        if (cell && cell.terrain === terrainType) {
          return true;
        }
      }
    }
    return false;
  }

  // Check if too close to specific building type
  private isTooCloseToBuilding(pos: GridPosition, width: number, height: number, buildingType: BuildingType, minDistance: number): boolean {
    for (const building of this.buildings) {
      if (building.type === buildingType) {
        const distance = Math.max(
          Math.abs(pos.x - building.position.x),
          Math.abs(pos.z - building.position.z)
        );
        if (distance < minDistance) {
          return true;
        }
      }
    }
    return false;
  }

  // Find a nearby valid position for building placement
  private findNearbyValidPosition(buildingType: BuildingType, preferredPos: GridPosition): GridPosition | undefined {
    const buildingDef = getBuildingDefinition(buildingType);
    const { width, height } = buildingDef.gridSize;
    
    // Search in expanding circles around preferred position
    for (let radius = 1; radius <= 10; radius++) {
      for (let x = preferredPos.x - radius; x <= preferredPos.x + radius; x++) {
        for (let z = preferredPos.z - radius; z <= preferredPos.z + radius; z++) {
          const testPos = { x, z };
          const validation = this.validatePlacement(buildingType, testPos);
          if (validation.canPlace) {
            return testPos;
          }
        }
      }
    }
    return undefined;
  }

  // Place a building on the grid
  public placeBuilding(buildingType: BuildingType, pos: GridPosition): CityBuilding | null {
    const validation = this.validatePlacement(buildingType, pos);
    if (!validation.canPlace) {
      return null;
    }

    const buildingDef = getBuildingDefinition(buildingType);
    const { width, height } = buildingDef.gridSize;
    
    // Create building instance
    const building: CityBuilding = {
      id: `${buildingType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: buildingType,
      position: pos,
      level: 1,
      efficiency: 1.0,
      age: 0,
      powered: true,
      connected: buildingDef.requirements?.nearRoad ? this.isNearTerrain(pos, width, height, 'road', 2) : true,
      status: 'constructing',
      constructionProgress: 0
    };

    // Mark grid cells as occupied
    for (let x = pos.x; x < pos.x + width; x++) {
      for (let z = pos.z; z < pos.z + height; z++) {
        const cell = this.getCell({ x, z });
        if (cell) {
          cell.occupied = true;
          cell.building = building;
        }
      }
    }

    this.buildings.push(building);
    return building;
  }

  // Remove a building from the grid
  public removeBuilding(buildingId: string): boolean {
    const buildingIndex = this.buildings.findIndex(b => b.id === buildingId);
    if (buildingIndex === -1) return false;

    const building = this.buildings[buildingIndex];
    const buildingDef = getBuildingDefinition(building.type);
    const { width, height } = buildingDef.gridSize;

    // Clear grid cells
    for (let x = building.position.x; x < building.position.x + width; x++) {
      for (let z = building.position.z; z < building.position.z + height; z++) {
        const cell = this.getCell({ x, z });
        if (cell) {
          cell.occupied = false;
          cell.building = undefined;
        }
      }
    }

    this.buildings.splice(buildingIndex, 1);
    return true;
  }

  // Get building at grid position
  public getBuildingAt(pos: GridPosition): CityBuilding | null {
    const cell = this.getCell(pos);
    return cell?.building || null;
  }

  // Get all buildings of a specific type
  public getBuildingsByType(buildingType: BuildingType): CityBuilding[] {
    return this.buildings.filter(b => b.type === buildingType);
  }

  // Update building construction progress
  public updateConstruction(deltaTime: number): void {
    for (const building of this.buildings) {
      if (building.status === 'constructing') {
        const buildingDef = getBuildingDefinition(building.type);
        const constructionSpeed = 1 / (buildingDef.stats.constructionTime * 24 * 60 * 60 * 1000); // Convert days to milliseconds
        
        building.constructionProgress += deltaTime * constructionSpeed;
        
        if (building.constructionProgress >= 1.0) {
          building.constructionProgress = 1.0;
          building.status = 'operational';
        }
      }
      
      // Age buildings
      building.age += deltaTime / (24 * 60 * 60 * 1000); // Convert to days
      
      // Efficiency decreases with age (very slowly)
      if (building.age > 365) { // After 1 year
        const ageYears = building.age / 365;
        building.efficiency = Math.max(0.7, 1.0 - (ageYears * 0.01)); // 1% efficiency loss per year, minimum 70%
      }
    }
  }

  // Generate height map for visualization
  public generateHeightMap(): number[][] {
    const heightMap: number[][] = [];
    for (let x = 0; x < this.grid.width; x++) {
      heightMap[x] = [];
      for (let z = 0; z < this.grid.height; z++) {
        const cell = this.grid.cells[x][z];
        let height = cell.elevation;
        
        // Add building height
        if (cell.building) {
          const buildingDef = getBuildingDefinition(cell.building.type);
          height += buildingDef.size.height * cell.building.constructionProgress;
        }
        
        heightMap[x][z] = height;
      }
    }
    return heightMap;
  }

  // Get grid statistics
  public getGridStats() {
    let occupiedCells = 0;
    let waterCells = 0;
    let roadCells = 0;
    let parkCells = 0;
    
    for (let x = 0; x < this.grid.width; x++) {
      for (let z = 0; z < this.grid.height; z++) {
        const cell = this.grid.cells[x][z];
        if (cell.occupied) occupiedCells++;
        
        switch (cell.terrain) {
          case 'water': waterCells++; break;
          case 'road': roadCells++; break;
          case 'park': parkCells++; break;
        }
      }
    }
    
    const totalCells = this.grid.width * this.grid.height;
    
    return {
      totalCells,
      occupiedCells,
      availableCells: totalCells - occupiedCells - waterCells,
      occupancyPercentage: (occupiedCells / totalCells) * 100,
      waterPercentage: (waterCells / totalCells) * 100,
      roadPercentage: (roadCells / totalCells) * 100,
      parkPercentage: (parkCells / totalCells) * 100,
      totalBuildings: this.buildings.length,
      buildingsUnderConstruction: this.buildings.filter(b => b.status === 'constructing').length
    };
  }

  // Export/Import functions for save/load
  public exportState() {
    return {
      grid: this.grid,
      buildings: this.buildings,
      cellSize: this.cellSize
    };
  }

  public importState(state: any) {
    this.grid = state.grid;
    this.buildings = state.buildings;
    this.cellSize = state.cellSize;
  }

  // Getters
  public getGrid(): CityGrid { return this.grid; }
  public getBuildings(): CityBuilding[] { return this.buildings; }
  public getCellSize(): number { return this.cellSize; }
}

// Utility functions for drag and drop
export class DragDropManager {
  private isDragging: boolean = false;
  private draggedBuildingType: BuildingType | null = null;
  private dragStartPosition: THREE.Vector2 | null = null;
  private currentMousePosition: THREE.Vector2 | null = null;

  public startDrag(buildingType: BuildingType, startPos: THREE.Vector2) {
    this.isDragging = true;
    this.draggedBuildingType = buildingType;
    this.dragStartPosition = startPos.clone();
    this.currentMousePosition = startPos.clone();
  }

  public updateDrag(mousePos: THREE.Vector2) {
    if (!this.isDragging) return;
    this.currentMousePosition = mousePos.clone();
  }

  public endDrag(): { buildingType: BuildingType | null; successful: boolean } {
    const result = {
      buildingType: this.draggedBuildingType,
      successful: this.isDragging && this.draggedBuildingType !== null
    };
    
    this.isDragging = false;
    this.draggedBuildingType = null;
    this.dragStartPosition = null;
    this.currentMousePosition = null;
    
    return result;
  }

  public cancelDrag() {
    this.isDragging = false;
    this.draggedBuildingType = null;
    this.dragStartPosition = null;
    this.currentMousePosition = null;
  }

  // Getters
  public getIsDragging(): boolean { return this.isDragging; }
  public getDraggedBuildingType(): BuildingType | null { return this.draggedBuildingType; }
  public getCurrentMousePosition(): THREE.Vector2 | null { return this.currentMousePosition; }
}

// Ray casting utilities for 3D interaction
export class RayCastHelper {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  public getIntersection(event: MouseEvent, camera: THREE.Camera, gridMesh: THREE.Mesh): GridPosition | null {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    
    // Convert mouse coordinates to normalized device coordinates
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, camera);
    
    const intersects = this.raycaster.intersectObject(gridMesh);
    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Convert world position to grid position - this will be implemented by the grid manager
      return { x: Math.floor(point.x), z: Math.floor(point.z) };
    }
    
    return null;
  }

  public getMouseWorldPosition(event: MouseEvent, camera: THREE.Camera, groundPlane: THREE.Plane): THREE.Vector3 | null {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, camera);
    
    const intersection = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(groundPlane, intersection)) {
      return intersection;
    }
    
    return null;
  }
}

export default {
  CityGridManager,
  DragDropManager,
  RayCastHelper
};