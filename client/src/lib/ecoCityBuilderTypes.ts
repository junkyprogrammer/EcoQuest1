/**
 * EcoCityBuilder Types and Data Structures
 * Comprehensive type definitions for the Virtual Eco-City Builder system
 */

export interface GridPosition {
  x: number;
  z: number;
}

export interface GridCell {
  position: GridPosition;
  occupied: boolean;
  building?: CityBuilding;
  terrain: 'land' | 'water' | 'park' | 'road';
  elevation: number;
}

export type BuildingCategory = 
  | 'residential' 
  | 'commercial' 
  | 'industrial' 
  | 'infrastructure' 
  | 'energy' 
  | 'environment';

export type BuildingType = 
  // Residential
  | 'house' | 'apartment' | 'eco_home' | 'co_housing'
  // Commercial  
  | 'shop' | 'office' | 'green_market' | 'eco_mall'
  // Industrial
  | 'factory' | 'recycling_center' | 'water_treatment' | 'waste_facility'
  // Infrastructure
  | 'road' | 'bus_stop' | 'metro_station' | 'bike_lane' | 'park' | 'hospital' | 'school'
  // Energy
  | 'solar_panel' | 'wind_turbine' | 'hydroelectric' | 'coal_plant' | 'nuclear_plant'
  // Environment
  | 'forest' | 'lake' | 'green_roof' | 'urban_farm' | 'air_purifier';

export interface EnvironmentalImpact {
  airQuality: number;        // -100 to +100 (negative = pollution, positive = clean)
  waterQuality: number;      // -100 to +100
  noiseLevel: number;        // 0 to 100 (higher = more noise)
  co2Emissions: number;      // kg CO2 per day
  energyProduction: number;  // kWh per day
  energyConsumption: number; // kWh per day
  wasteProduction: number;   // kg per day
  wasteProcessing: number;   // kg per day (recycling/treatment capacity)
  biodiversity: number;      // -100 to +100
  greenSpaceContribution: number; // m² of green space
}

export interface BuildingStats {
  cost: number;
  maintenanceCost: number;
  population: number;        // How many people it houses/employs
  happiness: number;         // Contribution to citizen happiness
  constructionTime: number; // Days to build
  unlockLevel: number;       // Required city level to unlock
}

export interface BuildingDefinition {
  id: BuildingType;
  name: string;
  description: string;
  category: BuildingCategory;
  size: { width: number; height: number; depth: number }; // 3D size
  gridSize: { width: number; height: number }; // Grid cells occupied
  environmentalImpact: EnvironmentalImpact;
  stats: BuildingStats;
  educationalInfo: {
    realWorldExample: string;
    environmentalTip: string;
    sustainabilityRating: 1 | 2 | 3 | 4 | 5; // 5 = most sustainable
  };
  visualProperties: {
    color: string;
    model?: string; // 3D model path
    texture?: string;
    emissions?: 'smoke' | 'steam' | 'none';
  };
  requirements?: {
    nearWater?: boolean;
    nearRoad?: boolean;
    minimumDistance?: { building: BuildingType; distance: number }[];
    maximumPerCity?: number;
  };
}

export interface CityBuilding {
  id: string;
  type: BuildingType;
  position: GridPosition;
  level: number; // Building can be upgraded
  efficiency: number; // 0.5 to 1.5 (affected by maintenance, age, etc.)
  age: number; // Days since construction
  powered: boolean;
  connected: boolean; // Connected to roads/infrastructure
  status: 'constructing' | 'operational' | 'needs_maintenance' | 'abandoned';
  constructionProgress: number; // 0 to 1
}

export interface CityResources {
  population: {
    total: number;
    capacity: number;
    happiness: number; // 0 to 100
    growth: number; // Population growth rate
  };
  energy: {
    production: number; // kWh per day
    consumption: number; // kWh per day
    storage: number; // Battery capacity
    renewablePercentage: number; // 0 to 100
  };
  environment: {
    airQuality: number; // 0 to 100 (100 = perfect)
    waterQuality: number; // 0 to 100
    noiseLevel: number; // 0 to 100 (0 = quiet)
    co2Level: number; // ppm
    greenSpacePercentage: number; // 0 to 100
    biodiversityIndex: number; // 0 to 100
  };
  waste: {
    production: number; // kg per day
    recycling: number; // kg per day processed
    landfill: number; // kg per day to landfill
    recyclingRate: number; // 0 to 100%
  };
  economy: {
    funds: number;
    income: number; // Per day
    expenses: number; // Per day
    taxRate: number; // 0 to 100%
  };
}

export interface EnvironmentalConsequence {
  type: 'pollution_spike' | 'power_shortage' | 'traffic_jam' | 'waste_overflow' | 'population_exodus' | 'health_crisis';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  cause: string;
  effects: {
    happiness: number;
    population: number;
    funds: number;
    environmentalScore: number;
  };
  duration: number; // Days the consequence lasts
  solutions: string[]; // Suggested solutions
}

export interface CityStatistics {
  totalBuildings: number;
  buildingsByCategory: Record<BuildingCategory, number>;
  sustainabilityScore: number; // 0 to 100
  environmentalScore: number; // 0 to 100
  cityLevel: number;
  daysActive: number;
  achievements: string[];
  challenges: EnvironmentalConsequence[];
}

export interface CityGrid {
  width: number;
  height: number;
  cells: GridCell[][];
  zoom: number;
  center: GridPosition;
}

export interface CityBuilderState {
  grid: CityGrid;
  buildings: CityBuilding[];
  resources: CityResources;
  statistics: CityStatistics;
  selectedBuildingType: BuildingType | null;
  isPlacingBuilding: boolean;
  showStatistics: boolean;
  showEnvironmentalImpact: boolean;
  gameSpeed: 1 | 2 | 3; // Game speed multiplier
  isPaused: boolean;
  currentObjectives: CityObjective[];
}

export interface CityObjective {
  id: string;
  title: string;
  description: string;
  type: 'build' | 'achieve' | 'maintain' | 'reduce';
  target: number;
  current: number;
  reward: {
    points: number;
    funds?: number;
    unlocks?: BuildingType[];
  };
  timeLimit?: number; // Days to complete
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PlacementValidation {
  isValid: boolean;
  canPlace: boolean;
  warnings: string[];
  errors: string[];
  suggestedPosition?: GridPosition;
}

export interface CityBuilderAction {
  type: 'PLACE_BUILDING' | 'REMOVE_BUILDING' | 'UPGRADE_BUILDING' | 'PAUSE_GAME' | 'CHANGE_SPEED' | 'SELECT_BUILDING_TYPE' | 'UPDATE_RESOURCES' | 'TRIGGER_CONSEQUENCE' | 'COMPLETE_OBJECTIVE';
  payload: any;
}

// Educational content for buildings
export interface EducationalContent {
  facts: string[];
  tips: string[];
  realWorldExamples: string[];
  environmentalImpactExplanation: string;
  sustainabilityBenefits: string[];
  interactiveChallenges: string[];
}

// Preset city scenarios for educational purposes
export interface CityScenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  initialResources: Partial<CityResources>;
  objectives: CityObjective[];
  preplacedBuildings?: CityBuilding[];
  environmentalChallenges: string[];
  learningGoals: string[];
  estimatedPlayTime: number; // minutes
}

// Sustainability metrics for educational assessment
export interface SustainabilityAssessment {
  energyEfficiency: number; // 0-100
  wasteManagement: number; // 0-100
  airQuality: number; // 0-100
  waterManagement: number; // 0-100
  greenInfrastructure: number; // 0-100
  publicTransport: number; // 0-100
  overallRating: 'F' | 'D' | 'C' | 'B' | 'A' | 'A+';
  improvements: string[];
  achievements: string[];
}

// City builder events for educational storytelling
export interface CityEvent {
  id: string;
  title: string;
  description: string;
  type: 'random' | 'consequence' | 'achievement' | 'tutorial';
  choices: {
    text: string;
    consequence: Partial<CityResources>;
    educationalNote: string;
  }[];
  educationalValue: EducationalContent;
  frequency: 'once' | 'rare' | 'common';
}

export default {
  GridPosition,
  GridCell,
  BuildingCategory,
  BuildingType,
  EnvironmentalImpact,
  BuildingStats,
  BuildingDefinition,
  CityBuilding,
  CityResources,
  EnvironmentalConsequence,
  CityStatistics,
  CityGrid,
  CityBuilderState,
  CityObjective,
  PlacementValidation,
  CityBuilderAction,
  EducationalContent,
  CityScenario,
  SustainabilityAssessment,
  CityEvent
};