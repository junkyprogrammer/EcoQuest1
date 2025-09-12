/**
 * City Resource Management System
 * Handles real-time calculation and tracking of city resources and environmental impacts
 */

import { CityResources, CityBuilding, EnvironmentalConsequence, CityStatistics, CityBuilderState } from './ecoCityBuilderTypes';
import { getBuildingDefinition, calculateEnvironmentalScore } from './ecoCityBuilderData';
import { CityGridManager } from './cityGridSystem';

export class CityResourceManager {
  private resources: CityResources;
  private lastUpdateTime: number;
  private consequences: EnvironmentalConsequence[];
  private statistics: CityStatistics;
  private eventCallbacks: Map<string, ((data: any) => void)[]>;

  constructor(initialResources?: Partial<CityResources>) {
    this.resources = this.initializeResources(initialResources);
    this.lastUpdateTime = Date.now();
    this.consequences = [];
    this.statistics = this.initializeStatistics();
    this.eventCallbacks = new Map();
  }

  private initializeResources(initial?: Partial<CityResources>): CityResources {
    return {
      population: {
        total: initial?.population?.total || 0,
        capacity: initial?.population?.capacity || 0,
        happiness: initial?.population?.happiness || 75,
        growth: initial?.population?.growth || 0
      },
      energy: {
        production: initial?.energy?.production || 0,
        consumption: initial?.energy?.consumption || 0,
        storage: initial?.energy?.storage || 0,
        renewablePercentage: initial?.energy?.renewablePercentage || 0
      },
      environment: {
        airQuality: initial?.environment?.airQuality || 85,
        waterQuality: initial?.environment?.waterQuality || 90,
        noiseLevel: initial?.environment?.noiseLevel || 20,
        co2Level: initial?.environment?.co2Level || 400,
        greenSpacePercentage: initial?.environment?.greenSpacePercentage || 30,
        biodiversityIndex: initial?.environment?.biodiversityIndex || 70
      },
      waste: {
        production: initial?.waste?.production || 0,
        recycling: initial?.waste?.recycling || 0,
        landfill: initial?.waste?.landfill || 0,
        recyclingRate: initial?.waste?.recyclingRate || 0
      },
      economy: {
        funds: initial?.economy?.funds || 1000000,
        income: initial?.economy?.income || 0,
        expenses: initial?.economy?.expenses || 0,
        taxRate: initial?.economy?.taxRate || 15
      }
    };
  }

  private initializeStatistics(): CityStatistics {
    return {
      totalBuildings: 0,
      buildingsByCategory: {
        residential: 0,
        commercial: 0,
        industrial: 0,
        infrastructure: 0,
        energy: 0,
        environment: 0
      },
      sustainabilityScore: 75,
      environmentalScore: 75,
      cityLevel: 1,
      daysActive: 0,
      achievements: [],
      challenges: []
    };
  }

  // Main update function - called every frame or at regular intervals
  public updateResources(buildings: CityBuilding[], gridManager: CityGridManager, deltaTimeMs: number): void {
    const deltaTimeDays = deltaTimeMs / (24 * 60 * 60 * 1000); // Convert to days
    
    // Reset resource calculations
    this.resetResourceCalculations();
    
    // Calculate building impacts
    this.calculateBuildingImpacts(buildings);
    
    // Update dynamic systems
    this.updatePopulationDynamics(deltaTimeDays);
    this.updateEconomicSystem(deltaTimeDays);
    this.updateEnvironmentalSystems(deltaTimeDays);
    this.updateWasteManagement();
    
    // Check for consequences and events
    this.checkEnvironmentalConsequences();
    this.updateStatistics(buildings, gridManager);
    this.updateCityLevel();
    
    // Update timing
    this.statistics.daysActive += deltaTimeDays;
    this.lastUpdateTime = Date.now();
    
    // Trigger events
    this.triggerUpdateEvents();
  }

  private resetResourceCalculations(): void {
    // Reset values that are recalculated each frame
    this.resources.energy.production = 0;
    this.resources.energy.consumption = 0;
    this.resources.waste.production = 0;
    this.resources.waste.recycling = 0;
    this.resources.population.capacity = 0;
    this.resources.economy.income = 0;
    this.resources.economy.expenses = 0;
    
    // Reset environmental impacts
    let airImpact = 0;
    let waterImpact = 0;
    let noiseImpact = 0;
    let co2Impact = 0;
    let greenSpaceTotal = 0;
    let biodiversityImpact = 0;
  }

  private calculateBuildingImpacts(buildings: CityBuilding[]): void {
    let totalAirImpact = 0;
    let totalWaterImpact = 0;
    let totalNoiseImpact = 0;
    let totalCO2Impact = 0;
    let totalGreenSpace = 0;
    let totalBiodiversityImpact = 0;
    let totalRenewableProduction = 0;
    let totalEnergyProduction = 0;

    // Reset building category counts
    Object.keys(this.statistics.buildingsByCategory).forEach(category => {
      this.statistics.buildingsByCategory[category as keyof typeof this.statistics.buildingsByCategory] = 0;
    });

    for (const building of buildings) {
      if (building.status !== 'operational') continue;

      const buildingDef = getBuildingDefinition(building.type);
      const efficiency = building.efficiency;
      
      // Count buildings by category
      this.statistics.buildingsByCategory[buildingDef.category]++;
      
      // Energy calculations
      const energyProduction = buildingDef.environmentalImpact.energyProduction * efficiency;
      const energyConsumption = buildingDef.environmentalImpact.energyConsumption * efficiency;
      
      this.resources.energy.production += energyProduction;
      this.resources.energy.consumption += energyConsumption;
      
      // Track renewable vs non-renewable energy
      if (buildingDef.category === 'energy' && energyProduction > 0) {
        totalEnergyProduction += energyProduction;
        if (['solar_panel', 'wind_turbine', 'hydroelectric'].includes(building.type)) {
          totalRenewableProduction += energyProduction;
        }
      }
      
      // Population and capacity
      this.resources.population.capacity += buildingDef.stats.population;
      
      // Waste management
      this.resources.waste.production += buildingDef.environmentalImpact.wasteProduction * efficiency;
      this.resources.waste.recycling += buildingDef.environmentalImpact.wasteProcessing * efficiency;
      
      // Environmental impacts
      totalAirImpact += buildingDef.environmentalImpact.airQuality * efficiency;
      totalWaterImpact += buildingDef.environmentalImpact.waterQuality * efficiency;
      totalNoiseImpact += buildingDef.environmentalImpact.noiseLevel * efficiency;
      totalCO2Impact += buildingDef.environmentalImpact.co2Emissions * efficiency;
      totalGreenSpace += buildingDef.environmentalImpact.greenSpaceContribution * efficiency;
      totalBiodiversityImpact += buildingDef.environmentalImpact.biodiversity * efficiency;
      
      // Economic calculations
      this.resources.economy.income += this.calculateBuildingIncome(building, buildingDef);
      this.resources.economy.expenses += buildingDef.stats.maintenanceCost * efficiency;
    }

    // Update renewable percentage
    this.resources.energy.renewablePercentage = totalEnergyProduction > 0 
      ? (totalRenewableProduction / totalEnergyProduction) * 100 
      : 0;

    // Apply environmental impacts with baseline values
    this.applyEnvironmentalImpacts(
      totalAirImpact,
      totalWaterImpact,
      totalNoiseImpact,
      totalCO2Impact,
      totalGreenSpace,
      totalBiodiversityImpact
    );

    this.statistics.totalBuildings = buildings.filter(b => b.status === 'operational').length;
  }

  private calculateBuildingIncome(building: CityBuilding, buildingDef: any): number {
    // Income varies by building type and efficiency
    let baseIncome = 0;
    
    switch (buildingDef.category) {
      case 'residential':
        baseIncome = buildingDef.stats.population * 100; // $100 per person per day
        break;
      case 'commercial':
        baseIncome = buildingDef.stats.population * 200; // $200 per worker per day
        break;
      case 'industrial':
        baseIncome = buildingDef.stats.population * 300; // $300 per worker per day
        break;
      case 'energy':
        // Energy buildings generate income from power sales
        baseIncome = buildingDef.environmentalImpact.energyProduction * 5; // $5 per kWh
        break;
      default:
        baseIncome = buildingDef.stats.population * 50; // Basic income for other buildings
    }
    
    // Apply tax rate and efficiency
    return baseIncome * (this.resources.economy.taxRate / 100) * building.efficiency;
  }

  private applyEnvironmentalImpacts(
    airImpact: number,
    waterImpact: number,
    noiseImpact: number,
    co2Impact: number,
    greenSpace: number,
    biodiversityImpact: number
  ): void {
    // Air quality (0-100, higher is better)
    const baselineAir = 85;
    this.resources.environment.airQuality = Math.max(0, Math.min(100, 
      baselineAir + (airImpact / this.statistics.totalBuildings || 1)
    ));

    // Water quality (0-100, higher is better)
    const baselineWater = 90;
    this.resources.environment.waterQuality = Math.max(0, Math.min(100,
      baselineWater + (waterImpact / this.statistics.totalBuildings || 1)
    ));

    // Noise level (0-100, lower is better)
    const baselineNoise = 20;
    this.resources.environment.noiseLevel = Math.max(0, Math.min(100,
      baselineNoise + (noiseImpact / this.statistics.totalBuildings || 1)
    ));

    // CO2 level (ppm, lower is better)
    const baselineCO2 = 400;
    this.resources.environment.co2Level = Math.max(350, 
      baselineCO2 + (co2Impact / 10) // Scale down CO2 impact
    );

    // Green space percentage
    const totalCityArea = 50 * 50; // Grid size assumption
    this.resources.environment.greenSpacePercentage = Math.max(0, Math.min(100,
      (greenSpace / totalCityArea) * 100
    ));

    // Biodiversity index (0-100, higher is better)
    const baselineBiodiversity = 70;
    this.resources.environment.biodiversityIndex = Math.max(0, Math.min(100,
      baselineBiodiversity + (biodiversityImpact / this.statistics.totalBuildings || 1)
    ));
  }

  private updatePopulationDynamics(deltaTimeDays: number): void {
    // Population growth based on happiness and capacity
    if (this.resources.population.total < this.resources.population.capacity) {
      const happinessFactor = this.resources.population.happiness / 100;
      const growthRate = 0.02 * happinessFactor; // 2% max growth per day based on happiness
      
      const growthAmount = this.resources.population.total * growthRate * deltaTimeDays;
      this.resources.population.total = Math.min(
        this.resources.population.capacity,
        this.resources.population.total + growthAmount
      );
      
      this.resources.population.growth = growthAmount / deltaTimeDays; // Growth per day
    }

    // Update happiness based on environmental factors
    this.updatePopulationHappiness();
  }

  private updatePopulationHappiness(): void {
    let happiness = 50; // Base happiness
    
    // Environmental factors
    happiness += (this.resources.environment.airQuality - 50) * 0.3;
    happiness += (this.resources.environment.waterQuality - 50) * 0.2;
    happiness -= (this.resources.environment.noiseLevel - 50) * 0.2;
    happiness += this.resources.environment.greenSpacePercentage * 0.3;
    
    // Infrastructure factors
    const energySecurity = Math.min(100, (this.resources.energy.production / Math.max(1, this.resources.energy.consumption)) * 100);
    happiness += (energySecurity - 50) * 0.2;
    
    // Waste management
    happiness += this.resources.waste.recyclingRate * 0.1;
    
    // Economic factors
    const populationDensity = this.resources.population.total / Math.max(1, this.resources.population.capacity);
    if (populationDensity > 0.9) {
      happiness -= (populationDensity - 0.9) * 100; // Overcrowding penalty
    }
    
    this.resources.population.happiness = Math.max(0, Math.min(100, happiness));
  }

  private updateEconomicSystem(deltaTimeDays: number): void {
    // Calculate daily net income
    const dailyIncome = this.resources.economy.income * deltaTimeDays;
    const dailyExpenses = this.resources.economy.expenses * deltaTimeDays;
    const netIncome = dailyIncome - dailyExpenses;
    
    // Update funds
    this.resources.economy.funds += netIncome;
    
    // Trigger economic events if funds are low
    if (this.resources.economy.funds < 0) {
      this.triggerEconomicCrisis();
    }
  }

  private updateEnvironmentalSystems(deltaTimeDays: number): void {
    // Environmental recovery/degradation over time
    const recoveryRate = 0.1 * deltaTimeDays; // Small daily recovery
    
    // Air quality slowly recovers if no major pollution sources
    if (this.resources.environment.airQuality < 85) {
      this.resources.environment.airQuality += recoveryRate;
    }
    
    // Water quality recovery
    if (this.resources.environment.waterQuality < 90) {
      this.resources.environment.waterQuality += recoveryRate * 0.5;
    }
    
    // CO2 levels slowly stabilize
    if (this.resources.environment.co2Level > 400) {
      this.resources.environment.co2Level -= recoveryRate * 2;
    }
    
    // Biodiversity recovery in green areas
    if (this.resources.environment.greenSpacePercentage > 20) {
      this.resources.environment.biodiversityIndex += recoveryRate * 0.3;
    }
  }

  private updateWasteManagement(): void {
    // Calculate recycling rate
    const totalWaste = this.resources.waste.production;
    const processedWaste = this.resources.waste.recycling;
    
    if (totalWaste > 0) {
      this.resources.waste.recyclingRate = Math.min(100, (processedWaste / totalWaste) * 100);
      this.resources.waste.landfill = Math.max(0, totalWaste - processedWaste);
    } else {
      this.resources.waste.recyclingRate = 0;
      this.resources.waste.landfill = 0;
    }
  }

  private checkEnvironmentalConsequences(): void {
    const newConsequences: EnvironmentalConsequence[] = [];
    
    // Air pollution crisis
    if (this.resources.environment.airQuality < 30) {
      newConsequences.push({
        type: 'pollution_spike',
        severity: 'critical',
        message: 'Severe air pollution is causing a health crisis!',
        cause: 'Too many polluting buildings without proper air quality management',
        effects: {
          happiness: -20,
          population: -0.05,
          funds: -10000,
          environmentalScore: -15
        },
        duration: 7,
        solutions: [
          'Build air purification towers',
          'Replace coal plants with renewable energy',
          'Add more parks and forests',
          'Implement strict emission controls'
        ]
      });
    }
    
    // Power shortage
    if (this.resources.energy.consumption > this.resources.energy.production * 1.1) {
      newConsequences.push({
        type: 'power_shortage',
        severity: 'high',
        message: 'Rolling blackouts due to insufficient power generation!',
        cause: 'Energy consumption exceeds production capacity',
        effects: {
          happiness: -15,
          population: 0,
          funds: -5000,
          environmentalScore: -5
        },
        duration: 3,
        solutions: [
          'Build more power plants',
          'Invest in energy storage',
          'Improve energy efficiency',
          'Add renewable energy sources'
        ]
      });
    }
    
    // Waste overflow
    if (this.resources.waste.recyclingRate < 20 && this.resources.waste.production > 100) {
      newConsequences.push({
        type: 'waste_overflow',
        severity: 'medium',
        message: 'Waste management crisis - landfills are overflowing!',
        cause: 'Insufficient recycling and waste processing facilities',
        effects: {
          happiness: -10,
          population: 0,
          funds: -3000,
          environmentalScore: -8
        },
        duration: 5,
        solutions: [
          'Build more recycling centers',
          'Implement waste-to-energy plants',
          'Reduce waste production',
          'Improve recycling programs'
        ]
      });
    }
    
    // Population exodus
    if (this.resources.population.happiness < 25) {
      newConsequences.push({
        type: 'population_exodus',
        severity: 'high',
        message: 'Citizens are leaving the city due to poor living conditions!',
        cause: 'Very low population happiness',
        effects: {
          happiness: -5,
          population: -0.1,
          funds: -8000,
          environmentalScore: -10
        },
        duration: 10,
        solutions: [
          'Improve air and water quality',
          'Add more parks and recreation',
          'Better public transportation',
          'Reduce noise pollution'
        ]
      });
    }
    
    // Add new consequences
    this.consequences.push(...newConsequences);
    
    // Remove expired consequences
    this.consequences = this.consequences.filter(c => c.duration > 0);
    
    // Update consequence durations
    this.consequences.forEach(c => c.duration -= 1/24); // Decrease by 1 hour equivalent
  }

  private updateStatistics(buildings: CityBuilding[], gridManager: CityGridManager): void {
    // Calculate sustainability score
    this.statistics.sustainabilityScore = this.calculateSustainabilityScore();
    
    // Calculate environmental score
    this.statistics.environmentalScore = calculateEnvironmentalScore(buildings);
    
    // Update challenges
    this.statistics.challenges = this.consequences;
  }

  private calculateSustainabilityScore(): number {
    let score = 0;
    
    // Renewable energy factor (0-25 points)
    score += (this.resources.energy.renewablePercentage / 100) * 25;
    
    // Waste management factor (0-20 points)
    score += (this.resources.waste.recyclingRate / 100) * 20;
    
    // Environmental quality factor (0-30 points)
    const envScore = (
      this.resources.environment.airQuality +
      this.resources.environment.waterQuality +
      (100 - this.resources.environment.noiseLevel) +
      this.resources.environment.biodiversityIndex
    ) / 4;
    score += (envScore / 100) * 30;
    
    // Green space factor (0-15 points)
    score += (this.resources.environment.greenSpacePercentage / 100) * 15;
    
    // Population happiness factor (0-10 points)
    score += (this.resources.population.happiness / 100) * 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private updateCityLevel(): void {
    // Level up based on sustainability score and population
    const populationTier = Math.floor(this.resources.population.total / 100);
    const sustainabilityTier = Math.floor(this.statistics.sustainabilityScore / 20);
    
    this.statistics.cityLevel = Math.max(1, Math.min(populationTier, sustainabilityTier));
  }

  private triggerEconomicCrisis(): void {
    // Handle economic crisis consequences
    this.resources.population.happiness -= 5;
    
    if (!this.consequences.find(c => c.type === 'population_exodus')) {
      // Add economic consequence if not already present
    }
  }

  private triggerUpdateEvents(): void {
    // Trigger registered callbacks
    this.eventCallbacks.get('resources_updated')?.forEach(callback => {
      callback(this.resources);
    });
    
    this.eventCallbacks.get('statistics_updated')?.forEach(callback => {
      callback(this.statistics);
    });
    
    if (this.consequences.length > 0) {
      this.eventCallbacks.get('consequences_triggered')?.forEach(callback => {
        callback(this.consequences);
      });
    }
  }

  // Event system
  public addEventListener(event: string, callback: (data: any) => void): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
  }

  public removeEventListener(event: string, callback: (data: any) => void): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Getters
  public getResources(): CityResources { return this.resources; }
  public getConsequences(): EnvironmentalConsequence[] { return this.consequences; }
  public getStatistics(): CityStatistics { return this.statistics; }

  // Resource manipulation methods for testing and special events
  public addFunds(amount: number): void {
    this.resources.economy.funds += amount;
  }

  public setTaxRate(rate: number): void {
    this.resources.economy.taxRate = Math.max(0, Math.min(100, rate));
  }

  public applyEnvironmentalEvent(effects: Partial<CityResources['environment']>): void {
    Object.assign(this.resources.environment, effects);
  }

  // Save/Load functions
  public exportState() {
    return {
      resources: this.resources,
      consequences: this.consequences,
      statistics: this.statistics,
      lastUpdateTime: this.lastUpdateTime
    };
  }

  public importState(state: any) {
    this.resources = state.resources;
    this.consequences = state.consequences;
    this.statistics = state.statistics;
    this.lastUpdateTime = state.lastUpdateTime;
  }
}

export default CityResourceManager;