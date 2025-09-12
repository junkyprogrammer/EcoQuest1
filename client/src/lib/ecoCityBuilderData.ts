/**
 * EcoCityBuilder Building Definitions and Game Data
 * Comprehensive data for all building types, scenarios, and educational content
 */

import { BuildingDefinition, BuildingType, CityScenario, CityObjective, EducationalContent } from './ecoCityBuilderTypes';

export const buildingDefinitions: Record<BuildingType, BuildingDefinition> = {
  // RESIDENTIAL BUILDINGS
  house: {
    id: 'house',
    name: 'Single Family House',
    description: 'Basic housing for a small family. Uses moderate energy and produces household waste.',
    category: 'residential',
    size: { width: 2, height: 2, depth: 2 },
    gridSize: { width: 1, height: 1 },
    environmentalImpact: {
      airQuality: -5,
      waterQuality: -3,
      noiseLevel: 15,
      co2Emissions: 8,
      energyProduction: 0,
      energyConsumption: 25,
      wasteProduction: 12,
      wasteProcessing: 0,
      biodiversity: -2,
      greenSpaceContribution: 15
    },
    stats: {
      cost: 50000,
      maintenanceCost: 200,
      population: 4,
      happiness: 70,
      constructionTime: 30,
      unlockLevel: 1
    },
    educationalInfo: {
      realWorldExample: "Suburban homes consume 30% of total energy in cities",
      environmentalTip: "Adding solar panels and better insulation reduces environmental impact",
      sustainabilityRating: 3
    },
    visualProperties: {
      color: '#8B7D6B',
      emissions: 'none'
    }
  },

  apartment: {
    id: 'apartment',
    name: 'Apartment Building',
    description: 'Multi-family housing that efficiently uses space and resources per person.',
    category: 'residential',
    size: { width: 3, height: 8, depth: 3 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: -8,
      waterQuality: -6,
      noiseLevel: 35,
      co2Emissions: 15,
      energyProduction: 0,
      energyConsumption: 80,
      wasteProduction: 35,
      wasteProcessing: 0,
      biodiversity: -5,
      greenSpaceContribution: 5
    },
    stats: {
      cost: 200000,
      maintenanceCost: 800,
      population: 20,
      happiness: 60,
      constructionTime: 60,
      unlockLevel: 2
    },
    educationalInfo: {
      realWorldExample: "Dense housing reduces per-capita land use by 75%",
      environmentalTip: "Apartments are more energy-efficient per person than houses",
      sustainabilityRating: 4
    },
    visualProperties: {
      color: '#696969',
      emissions: 'none'
    }
  },

  eco_home: {
    id: 'eco_home',
    name: 'Eco-Friendly Home',
    description: 'Sustainable housing with solar panels, rainwater collection, and energy efficiency.',
    category: 'residential',
    size: { width: 2.5, height: 2.5, depth: 2.5 },
    gridSize: { width: 1, height: 1 },
    environmentalImpact: {
      airQuality: 5,
      waterQuality: 3,
      noiseLevel: 8,
      co2Emissions: 2,
      energyProduction: 15,
      energyConsumption: 12,
      wasteProduction: 6,
      wasteProcessing: 3,
      biodiversity: 8,
      greenSpaceContribution: 25
    },
    stats: {
      cost: 120000,
      maintenanceCost: 150,
      population: 4,
      happiness: 85,
      constructionTime: 45,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "Green homes use 50-70% less energy than conventional homes",
      environmentalTip: "Green roofs and walls improve air quality and biodiversity",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#228B22',
      emissions: 'none'
    }
  },

  co_housing: {
    id: 'co_housing',
    name: 'Co-Housing Community',
    description: 'Shared community living with common spaces and shared resources.',
    category: 'residential',
    size: { width: 4, height: 3, depth: 4 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 10,
      waterQuality: 8,
      noiseLevel: 20,
      co2Emissions: 5,
      energyProduction: 8,
      energyConsumption: 40,
      wasteProduction: 18,
      wasteProcessing: 12,
      biodiversity: 15,
      greenSpaceContribution: 50
    },
    stats: {
      cost: 300000,
      maintenanceCost: 400,
      population: 16,
      happiness: 90,
      constructionTime: 75,
      unlockLevel: 4
    },
    educationalInfo: {
      realWorldExample: "Co-housing communities reduce resource consumption by 30%",
      environmentalTip: "Shared spaces and resources lower per-person environmental impact",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#32CD32',
      emissions: 'none'
    }
  },

  // COMMERCIAL BUILDINGS
  shop: {
    id: 'shop',
    name: 'Local Shop',
    description: 'Small retail store serving the local community.',
    category: 'commercial',
    size: { width: 2, height: 3, depth: 2 },
    gridSize: { width: 1, height: 1 },
    environmentalImpact: {
      airQuality: -3,
      waterQuality: -2,
      noiseLevel: 25,
      co2Emissions: 12,
      energyProduction: 0,
      energyConsumption: 40,
      wasteProduction: 20,
      wasteProcessing: 0,
      biodiversity: 0,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 80000,
      maintenanceCost: 300,
      population: 5,
      happiness: 50,
      constructionTime: 20,
      unlockLevel: 1
    },
    educationalInfo: {
      realWorldExample: "Local shops reduce transportation emissions from shopping trips",
      environmentalTip: "Supporting local businesses reduces packaging and transport",
      sustainabilityRating: 3
    },
    visualProperties: {
      color: '#4682B4',
      emissions: 'none'
    },
    requirements: {
      nearRoad: true
    }
  },

  office: {
    id: 'office',
    name: 'Office Building',
    description: 'Modern office space for businesses and services.',
    category: 'commercial',
    size: { width: 3, height: 6, depth: 3 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: -8,
      waterQuality: -3,
      noiseLevel: 30,
      co2Emissions: 20,
      energyProduction: 0,
      energyConsumption: 120,
      wasteProduction: 25,
      wasteProcessing: 0,
      biodiversity: -3,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 250000,
      maintenanceCost: 1000,
      population: 40,
      happiness: 55,
      constructionTime: 90,
      unlockLevel: 2
    },
    educationalInfo: {
      realWorldExample: "Office buildings consume 20% of total urban energy",
      environmentalTip: "Green building design can reduce office energy use by 40%",
      sustainabilityRating: 2
    },
    visualProperties: {
      color: '#708090',
      emissions: 'none'
    },
    requirements: {
      nearRoad: true
    }
  },

  green_market: {
    id: 'green_market',
    name: 'Green Market',
    description: 'Eco-friendly marketplace promoting local and organic products.',
    category: 'commercial',
    size: { width: 3, height: 2, depth: 3 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 5,
      waterQuality: 3,
      noiseLevel: 20,
      co2Emissions: 3,
      energyProduction: 5,
      energyConsumption: 25,
      wasteProduction: 8,
      wasteProcessing: 15,
      biodiversity: 8,
      greenSpaceContribution: 20
    },
    stats: {
      cost: 150000,
      maintenanceCost: 400,
      population: 12,
      happiness: 75,
      constructionTime: 45,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "Farmers markets reduce food transportation by 95%",
      environmentalTip: "Local food systems reduce packaging and preservatives",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#90EE90',
      emissions: 'none'
    }
  },

  eco_mall: {
    id: 'eco_mall',
    name: 'Eco Shopping Center',
    description: 'Sustainable shopping complex with green design and renewable energy.',
    category: 'commercial',
    size: { width: 6, height: 4, depth: 6 },
    gridSize: { width: 3, height: 3 },
    environmentalImpact: {
      airQuality: 0,
      waterQuality: 5,
      noiseLevel: 40,
      co2Emissions: 15,
      energyProduction: 30,
      energyConsumption: 80,
      wasteProduction: 35,
      wasteProcessing: 25,
      biodiversity: 5,
      greenSpaceContribution: 40
    },
    stats: {
      cost: 800000,
      maintenanceCost: 2000,
      population: 80,
      happiness: 70,
      constructionTime: 120,
      unlockLevel: 4
    },
    educationalInfo: {
      realWorldExample: "Green malls use 25% less energy with natural lighting",
      environmentalTip: "Green roofs on large buildings create urban habitats",
      sustainabilityRating: 4
    },
    visualProperties: {
      color: '#20B2AA',
      emissions: 'none'
    }
  },

  // INDUSTRIAL BUILDINGS
  factory: {
    id: 'factory',
    name: 'Manufacturing Factory',
    description: 'Traditional factory producing goods but creating pollution.',
    category: 'industrial',
    size: { width: 4, height: 4, depth: 6 },
    gridSize: { width: 3, height: 3 },
    environmentalImpact: {
      airQuality: -30,
      waterQuality: -20,
      noiseLevel: 80,
      co2Emissions: 100,
      energyProduction: 0,
      energyConsumption: 200,
      wasteProduction: 80,
      wasteProcessing: 0,
      biodiversity: -15,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 400000,
      maintenanceCost: 1500,
      population: 60,
      happiness: 30,
      constructionTime: 90,
      unlockLevel: 2
    },
    educationalInfo: {
      realWorldExample: "Traditional factories are responsible for 21% of global emissions",
      environmentalTip: "Cleaner production methods can reduce industrial pollution by 60%",
      sustainabilityRating: 1
    },
    visualProperties: {
      color: '#696969',
      emissions: 'smoke'
    },
    requirements: {
      minimumDistance: [{ building: 'house', distance: 3 }, { building: 'school', distance: 5 }]
    }
  },

  recycling_center: {
    id: 'recycling_center',
    name: 'Recycling Center',
    description: 'Facility that processes waste and turns it into reusable materials.',
    category: 'industrial',
    size: { width: 4, height: 3, depth: 4 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 10,
      waterQuality: 15,
      noiseLevel: 45,
      co2Emissions: -20,
      energyProduction: 5,
      energyConsumption: 60,
      wasteProduction: 0,
      wasteProcessing: 150,
      biodiversity: 3,
      greenSpaceContribution: 10
    },
    stats: {
      cost: 300000,
      maintenanceCost: 800,
      population: 25,
      happiness: 65,
      constructionTime: 60,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "Recycling 1 ton of paper saves 17 trees and 7,000 gallons of water",
      environmentalTip: "Recycling reduces landfill waste by up to 75%",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#32CD32',
      emissions: 'none'
    }
  },

  water_treatment: {
    id: 'water_treatment',
    name: 'Water Treatment Plant',
    description: 'Facility that cleans wastewater and ensures safe water supply.',
    category: 'industrial',
    size: { width: 5, height: 3, depth: 5 },
    gridSize: { width: 3, height: 3 },
    environmentalImpact: {
      airQuality: 5,
      waterQuality: 50,
      noiseLevel: 30,
      co2Emissions: 15,
      energyProduction: 0,
      energyConsumption: 80,
      wasteProduction: 10,
      wasteProcessing: 0,
      biodiversity: 8,
      greenSpaceContribution: 5
    },
    stats: {
      cost: 500000,
      maintenanceCost: 1200,
      population: 30,
      happiness: 40,
      constructionTime: 120,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "Water treatment prevents 2.2 million deaths annually worldwide",
      environmentalTip: "Clean water systems protect both human health and ecosystems",
      sustainabilityRating: 4
    },
    visualProperties: {
      color: '#4682B4',
      emissions: 'steam'
    },
    requirements: {
      nearWater: true
    }
  },

  waste_facility: {
    id: 'waste_facility',
    name: 'Waste Management Facility',
    description: 'Modern waste processing with energy recovery from waste.',
    category: 'industrial',
    size: { width: 4, height: 4, depth: 4 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: -5,
      waterQuality: 5,
      noiseLevel: 50,
      co2Emissions: 10,
      energyProduction: 25,
      energyConsumption: 40,
      wasteProduction: 0,
      wasteProcessing: 200,
      biodiversity: 0,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 450000,
      maintenanceCost: 1000,
      population: 20,
      happiness: 35,
      constructionTime: 90,
      unlockLevel: 4
    },
    educationalInfo: {
      realWorldExample: "Waste-to-energy plants can power 2.3 million homes annually",
      environmentalTip: "Modern waste facilities recover energy and materials from trash",
      sustainabilityRating: 3
    },
    visualProperties: {
      color: '#8B4513',
      emissions: 'steam'
    },
    requirements: {
      minimumDistance: [{ building: 'house', distance: 4 }]
    }
  },

  // ENERGY BUILDINGS
  solar_panel: {
    id: 'solar_panel',
    name: 'Solar Panel Array',
    description: 'Clean renewable energy from sunlight with zero emissions.',
    category: 'energy',
    size: { width: 3, height: 0.2, depth: 3 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 15,
      waterQuality: 5,
      noiseLevel: 0,
      co2Emissions: -25,
      energyProduction: 100,
      energyConsumption: 0,
      wasteProduction: 0,
      wasteProcessing: 0,
      biodiversity: 3,
      greenSpaceContribution: 5
    },
    stats: {
      cost: 180000,
      maintenanceCost: 200,
      population: 2,
      happiness: 75,
      constructionTime: 30,
      unlockLevel: 2
    },
    educationalInfo: {
      realWorldExample: "Solar panels can power homes for 25+ years with minimal maintenance",
      environmentalTip: "Solar energy reduces dependence on fossil fuels",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#191970',
      emissions: 'none'
    }
  },

  wind_turbine: {
    id: 'wind_turbine',
    name: 'Wind Turbine',
    description: 'Harnesses wind energy to generate clean electricity.',
    category: 'energy',
    size: { width: 1, height: 12, depth: 1 },
    gridSize: { width: 1, height: 1 },
    environmentalImpact: {
      airQuality: 20,
      waterQuality: 0,
      noiseLevel: 25,
      co2Emissions: -30,
      energyProduction: 150,
      energyConsumption: 0,
      wasteProduction: 0,
      wasteProcessing: 0,
      biodiversity: -2,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 220000,
      maintenanceCost: 400,
      population: 3,
      happiness: 70,
      constructionTime: 45,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "One wind turbine can power 600-1,500 homes",
      environmentalTip: "Wind energy is one of the fastest-growing renewable sources",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#F5F5F5',
      emissions: 'none'
    },
    requirements: {
      minimumDistance: [{ building: 'house', distance: 2 }]
    }
  },

  hydroelectric: {
    id: 'hydroelectric',
    name: 'Hydroelectric Plant',
    description: 'Generates clean energy from flowing water.',
    category: 'energy',
    size: { width: 6, height: 4, depth: 4 },
    gridSize: { width: 3, height: 2 },
    environmentalImpact: {
      airQuality: 25,
      waterQuality: 10,
      noiseLevel: 20,
      co2Emissions: -40,
      energyProduction: 300,
      energyConsumption: 0,
      wasteProduction: 0,
      wasteProcessing: 0,
      biodiversity: 5,
      greenSpaceContribution: 15
    },
    stats: {
      cost: 800000,
      maintenanceCost: 1000,
      population: 15,
      happiness: 80,
      constructionTime: 180,
      unlockLevel: 4
    },
    educationalInfo: {
      realWorldExample: "Hydroelectric power provides 16% of global electricity",
      environmentalTip: "Water power is reliable and produces no direct emissions",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#4682B4',
      emissions: 'steam'
    },
    requirements: {
      nearWater: true,
      maximumPerCity: 2
    }
  },

  coal_plant: {
    id: 'coal_plant',
    name: 'Coal Power Plant',
    description: 'Traditional coal-burning power plant with high emissions.',
    category: 'energy',
    size: { width: 6, height: 8, depth: 6 },
    gridSize: { width: 3, height: 3 },
    environmentalImpact: {
      airQuality: -50,
      waterQuality: -30,
      noiseLevel: 60,
      co2Emissions: 200,
      energyProduction: 400,
      energyConsumption: 0,
      wasteProduction: 50,
      wasteProcessing: 0,
      biodiversity: -20,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 600000,
      maintenanceCost: 2000,
      population: 50,
      happiness: 20,
      constructionTime: 150,
      unlockLevel: 2
    },
    educationalInfo: {
      realWorldExample: "Coal plants are the largest source of CO2 emissions globally",
      environmentalTip: "Coal power causes air pollution and contributes to climate change",
      sustainabilityRating: 1
    },
    visualProperties: {
      color: '#2F4F4F',
      emissions: 'smoke'
    },
    requirements: {
      minimumDistance: [{ building: 'house', distance: 5 }, { building: 'school', distance: 8 }]
    }
  },

  nuclear_plant: {
    id: 'nuclear_plant',
    name: 'Nuclear Power Plant',
    description: 'Clean nuclear energy with no carbon emissions but requires careful management.',
    category: 'energy',
    size: { width: 8, height: 6, depth: 8 },
    gridSize: { width: 4, height: 4 },
    environmentalImpact: {
      airQuality: 10,
      waterQuality: -5,
      noiseLevel: 15,
      co2Emissions: -10,
      energyProduction: 800,
      energyConsumption: 0,
      wasteProduction: 5,
      wasteProcessing: 0,
      biodiversity: -5,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 2000000,
      maintenanceCost: 5000,
      population: 100,
      happiness: 45,
      constructionTime: 365,
      unlockLevel: 5
    },
    educationalInfo: {
      realWorldExample: "Nuclear power provides 20% of electricity in the US",
      environmentalTip: "Nuclear energy is carbon-free but produces radioactive waste",
      sustainabilityRating: 3
    },
    visualProperties: {
      color: '#FFD700',
      emissions: 'steam'
    },
    requirements: {
      nearWater: true,
      maximumPerCity: 1,
      minimumDistance: [{ building: 'house', distance: 8 }, { building: 'school', distance: 10 }]
    }
  },

  // INFRASTRUCTURE
  road: {
    id: 'road',
    name: 'Road',
    description: 'Connects buildings and allows transportation.',
    category: 'infrastructure',
    size: { width: 1, height: 0.1, depth: 1 },
    gridSize: { width: 1, height: 1 },
    environmentalImpact: {
      airQuality: -2,
      waterQuality: -1,
      noiseLevel: 30,
      co2Emissions: 5,
      energyProduction: 0,
      energyConsumption: 2,
      wasteProduction: 1,
      wasteProcessing: 0,
      biodiversity: -5,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 5000,
      maintenanceCost: 50,
      population: 0,
      happiness: 30,
      constructionTime: 3,
      unlockLevel: 1
    },
    educationalInfo: {
      realWorldExample: "Roads enable urban development but can fragment ecosystems",
      environmentalTip: "Green corridors along roads can reduce environmental impact",
      sustainabilityRating: 2
    },
    visualProperties: {
      color: '#2F4F4F',
      emissions: 'none'
    }
  },

  bus_stop: {
    id: 'bus_stop',
    name: 'Bus Stop',
    description: 'Public transportation stop that reduces car usage.',
    category: 'infrastructure',
    size: { width: 1, height: 2, depth: 0.5 },
    gridSize: { width: 1, height: 1 },
    environmentalImpact: {
      airQuality: 8,
      waterQuality: 0,
      noiseLevel: 20,
      co2Emissions: -15,
      energyProduction: 0,
      energyConsumption: 5,
      wasteProduction: 2,
      wasteProcessing: 0,
      biodiversity: 0,
      greenSpaceContribution: 2
    },
    stats: {
      cost: 15000,
      maintenanceCost: 100,
      population: 0,
      happiness: 45,
      constructionTime: 7,
      unlockLevel: 2
    },
    educationalInfo: {
      realWorldExample: "Public transit reduces per-capita emissions by 45%",
      environmentalTip: "Buses can replace 30-40 individual car trips",
      sustainabilityRating: 4
    },
    visualProperties: {
      color: '#4169E1',
      emissions: 'none'
    },
    requirements: {
      nearRoad: true
    }
  },

  metro_station: {
    id: 'metro_station',
    name: 'Metro Station',
    description: 'Underground rail system for efficient mass transit.',
    category: 'infrastructure',
    size: { width: 3, height: 1, depth: 3 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 20,
      waterQuality: 0,
      noiseLevel: 15,
      co2Emissions: -50,
      energyProduction: 0,
      energyConsumption: 30,
      wasteProduction: 5,
      wasteProcessing: 0,
      biodiversity: 0,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 500000,
      maintenanceCost: 2000,
      population: 0,
      happiness: 70,
      constructionTime: 120,
      unlockLevel: 4
    },
    educationalInfo: {
      realWorldExample: "Metro systems reduce urban traffic by 40%",
      environmentalTip: "Rail transit is 5x more energy efficient than cars",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#4682B4',
      emissions: 'none'
    }
  },

  bike_lane: {
    id: 'bike_lane',
    name: 'Bike Lane',
    description: 'Dedicated cycling infrastructure promoting clean transportation.',
    category: 'infrastructure',
    size: { width: 0.5, height: 0.1, depth: 1 },
    gridSize: { width: 1, height: 1 },
    environmentalImpact: {
      airQuality: 5,
      waterQuality: 1,
      noiseLevel: -10,
      co2Emissions: -8,
      energyProduction: 0,
      energyConsumption: 0,
      wasteProduction: 0,
      wasteProcessing: 0,
      biodiversity: 2,
      greenSpaceContribution: 3
    },
    stats: {
      cost: 3000,
      maintenanceCost: 20,
      population: 0,
      happiness: 60,
      constructionTime: 2,
      unlockLevel: 2
    },
    educationalInfo: {
      realWorldExample: "Cycling infrastructure increases bike usage by 200%",
      environmentalTip: "Bikes produce zero emissions and improve public health",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#32CD32',
      emissions: 'none'
    }
  },

  park: {
    id: 'park',
    name: 'City Park',
    description: 'Green space that improves air quality and citizen happiness.',
    category: 'infrastructure',
    size: { width: 4, height: 0.5, depth: 4 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 25,
      waterQuality: 15,
      noiseLevel: -20,
      co2Emissions: -30,
      energyProduction: 0,
      energyConsumption: 5,
      wasteProduction: 3,
      wasteProcessing: 0,
      biodiversity: 40,
      greenSpaceContribution: 100
    },
    stats: {
      cost: 80000,
      maintenanceCost: 400,
      population: 0,
      happiness: 80,
      constructionTime: 30,
      unlockLevel: 1
    },
    educationalInfo: {
      realWorldExample: "Urban parks reduce local temperatures by 2-9°F",
      environmentalTip: "Parks provide habitat for 60% of urban wildlife",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#228B22',
      emissions: 'none'
    }
  },

  hospital: {
    id: 'hospital',
    name: 'Hospital',
    description: 'Healthcare facility essential for citizen wellbeing.',
    category: 'infrastructure',
    size: { width: 5, height: 4, depth: 5 },
    gridSize: { width: 3, height: 3 },
    environmentalImpact: {
      airQuality: -5,
      waterQuality: -8,
      noiseLevel: 25,
      co2Emissions: 30,
      energyProduction: 0,
      energyConsumption: 150,
      wasteProduction: 40,
      wasteProcessing: 0,
      biodiversity: 0,
      greenSpaceContribution: 5
    },
    stats: {
      cost: 800000,
      maintenanceCost: 3000,
      population: 100,
      happiness: 85,
      constructionTime: 180,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "Green hospitals use 25% less energy through efficient design",
      environmentalTip: "Hospitals can implement renewable energy and waste reduction",
      sustainabilityRating: 3
    },
    visualProperties: {
      color: '#DC143C',
      emissions: 'none'
    },
    requirements: {
      nearRoad: true
    }
  },

  school: {
    id: 'school',
    name: 'School',
    description: 'Educational facility where children learn about sustainability.',
    category: 'infrastructure',
    size: { width: 4, height: 3, depth: 4 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 5,
      waterQuality: 2,
      noiseLevel: 35,
      co2Emissions: 10,
      energyProduction: 2,
      energyConsumption: 80,
      wasteProduction: 15,
      wasteProcessing: 5,
      biodiversity: 8,
      greenSpaceContribution: 25
    },
    stats: {
      cost: 400000,
      maintenanceCost: 1500,
      population: 50,
      happiness: 90,
      constructionTime: 120,
      unlockLevel: 2
    },
    educationalInfo: {
      realWorldExample: "Green schools improve student performance by 25%",
      environmentalTip: "Schools can teach sustainability through example",
      sustainabilityRating: 4
    },
    visualProperties: {
      color: '#FFD700',
      emissions: 'none'
    },
    requirements: {
      nearRoad: true,
      minimumDistance: [{ building: 'factory', distance: 5 }, { building: 'coal_plant', distance: 8 }]
    }
  },

  // ENVIRONMENT
  forest: {
    id: 'forest',
    name: 'Urban Forest',
    description: 'Dense tree coverage that significantly improves air quality.',
    category: 'environment',
    size: { width: 6, height: 8, depth: 6 },
    gridSize: { width: 3, height: 3 },
    environmentalImpact: {
      airQuality: 50,
      waterQuality: 25,
      noiseLevel: -30,
      co2Emissions: -80,
      energyProduction: 0,
      energyConsumption: 0,
      wasteProduction: 0,
      wasteProcessing: 0,
      biodiversity: 80,
      greenSpaceContribution: 200
    },
    stats: {
      cost: 150000,
      maintenanceCost: 600,
      population: 0,
      happiness: 95,
      constructionTime: 90,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "Urban forests absorb 48 pounds of CO2 per tree annually",
      environmentalTip: "Trees provide oxygen, habitat, and temperature control",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#006400',
      emissions: 'none'
    }
  },

  lake: {
    id: 'lake',
    name: 'Artificial Lake',
    description: 'Water feature that supports biodiversity and temperature regulation.',
    category: 'environment',
    size: { width: 8, height: 0.5, depth: 8 },
    gridSize: { width: 4, height: 4 },
    environmentalImpact: {
      airQuality: 20,
      waterQuality: 40,
      noiseLevel: -15,
      co2Emissions: -10,
      energyProduction: 0,
      energyConsumption: 10,
      wasteProduction: 0,
      wasteProcessing: 0,
      biodiversity: 60,
      greenSpaceContribution: 120
    },
    stats: {
      cost: 300000,
      maintenanceCost: 800,
      population: 0,
      happiness: 85,
      constructionTime: 120,
      unlockLevel: 4
    },
    educationalInfo: {
      realWorldExample: "Urban water bodies reduce local temperatures by 5-10°F",
      environmentalTip: "Wetlands filter pollutants and support wildlife",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#00CED1',
      emissions: 'none'
    }
  },

  green_roof: {
    id: 'green_roof',
    name: 'Green Roof Garden',
    description: 'Rooftop vegetation that insulates buildings and supports wildlife.',
    category: 'environment',
    size: { width: 3, height: 0.3, depth: 3 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 15,
      waterQuality: 10,
      noiseLevel: -5,
      co2Emissions: -20,
      energyProduction: 0,
      energyConsumption: -15,
      wasteProduction: 2,
      wasteProcessing: 0,
      biodiversity: 25,
      greenSpaceContribution: 60
    },
    stats: {
      cost: 100000,
      maintenanceCost: 300,
      population: 0,
      happiness: 70,
      constructionTime: 30,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "Green roofs reduce building energy use by 30%",
      environmentalTip: "Living roofs absorb rainwater and provide insulation",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#9ACD32',
      emissions: 'none'
    }
  },

  urban_farm: {
    id: 'urban_farm',
    name: 'Urban Farm',
    description: 'Local food production that reduces transportation emissions.',
    category: 'environment',
    size: { width: 4, height: 1, depth: 4 },
    gridSize: { width: 2, height: 2 },
    environmentalImpact: {
      airQuality: 12,
      waterQuality: 8,
      noiseLevel: -10,
      co2Emissions: -25,
      energyProduction: 0,
      energyConsumption: 15,
      wasteProduction: 5,
      wasteProcessing: 10,
      biodiversity: 30,
      greenSpaceContribution: 80
    },
    stats: {
      cost: 120000,
      maintenanceCost: 500,
      population: 8,
      happiness: 75,
      constructionTime: 45,
      unlockLevel: 3
    },
    educationalInfo: {
      realWorldExample: "Urban farms reduce food transportation by 90%",
      environmentalTip: "Local food systems strengthen community resilience",
      sustainabilityRating: 5
    },
    visualProperties: {
      color: '#ADFF2F',
      emissions: 'none'
    }
  },

  air_purifier: {
    id: 'air_purifier',
    name: 'Air Purification Tower',
    description: 'Technology that actively cleans polluted air.',
    category: 'environment',
    size: { width: 2, height: 8, depth: 2 },
    gridSize: { width: 1, height: 1 },
    environmentalImpact: {
      airQuality: 35,
      waterQuality: 0,
      noiseLevel: 20,
      co2Emissions: -15,
      energyProduction: 0,
      energyConsumption: 50,
      wasteProduction: 5,
      wasteProcessing: 0,
      biodiversity: 5,
      greenSpaceContribution: 0
    },
    stats: {
      cost: 250000,
      maintenanceCost: 1000,
      population: 3,
      happiness: 65,
      constructionTime: 60,
      unlockLevel: 4
    },
    educationalInfo: {
      realWorldExample: "Air purification towers can clean 3.5 million cubic meters daily",
      environmentalTip: "Technology can help remediate environmental damage",
      sustainabilityRating: 4
    },
    visualProperties: {
      color: '#87CEEB',
      emissions: 'none'
    }
  }
};

// Predefined city scenarios for educational gameplay
export const cityScenarios: CityScenario[] = [
  {
    id: 'green_beginner',
    name: 'Green Village',
    description: 'Start with a small eco-friendly community and learn the basics of sustainable city planning.',
    difficulty: 'beginner',
    initialResources: {
      economy: { funds: 500000, income: 0, expenses: 0, taxRate: 15 },
      population: { total: 0, capacity: 0, happiness: 50, growth: 0 },
      energy: { production: 0, consumption: 0, storage: 0, renewablePercentage: 0 },
      environment: { airQuality: 85, waterQuality: 90, noiseLevel: 10, co2Level: 400, greenSpacePercentage: 60, biodiversityIndex: 80 },
      waste: { production: 0, recycling: 0, landfill: 0, recyclingRate: 0 }
    },
    objectives: [
      {
        id: 'build_houses',
        title: 'Build Your First Homes',
        description: 'Place 5 eco-friendly homes to start your sustainable community',
        type: 'build',
        target: 5,
        current: 0,
        reward: { points: 100, funds: 50000 },
        difficulty: 'easy'
      },
      {
        id: 'solar_power',
        title: 'Harness Solar Energy',
        description: 'Install 2 solar panel arrays to power your community',
        type: 'build',
        target: 2,
        current: 0,
        reward: { points: 150, unlocks: ['wind_turbine'] },
        difficulty: 'easy'
      },
      {
        id: 'green_spaces',
        title: 'Create Green Spaces',
        description: 'Build 1 park to improve air quality and citizen happiness',
        type: 'build',
        target: 1,
        current: 0,
        reward: { points: 100 },
        difficulty: 'easy'
      }
    ],
    environmentalChallenges: ['Learn about renewable energy', 'Understand air quality impacts'],
    learningGoals: ['Basic sustainable planning', 'Renewable energy benefits', 'Green space importance'],
    estimatedPlayTime: 15
  },

  {
    id: 'pollution_crisis',
    name: 'Pollution Crisis',
    description: 'Inherit a polluted industrial city and transform it into a sustainable metropolis.',
    difficulty: 'intermediate',
    initialResources: {
      economy: { funds: 800000, income: 0, expenses: 0, taxRate: 20 },
      population: { total: 150, capacity: 200, happiness: 30, growth: 0 },
      energy: { production: 400, consumption: 350, storage: 0, renewablePercentage: 10 },
      environment: { airQuality: 25, waterQuality: 40, noiseLevel: 80, co2Level: 450, greenSpacePercentage: 5, biodiversityIndex: 20 },
      waste: { production: 80, recycling: 10, landfill: 70, recyclingRate: 12 }
    },
    preplacedBuildings: [
      // Pre-place some polluting buildings
    ],
    objectives: [
      {
        id: 'improve_air',
        title: 'Clean the Air',
        description: 'Improve air quality to at least 60 points',
        type: 'achieve',
        target: 60,
        current: 25,
        reward: { points: 300, funds: 100000 },
        timeLimit: 60,
        difficulty: 'medium'
      },
      {
        id: 'renewable_transition',
        title: 'Renewable Energy Transition',
        description: 'Achieve 70% renewable energy production',
        type: 'achieve',
        target: 70,
        current: 10,
        reward: { points: 400, unlocks: ['nuclear_plant'] },
        difficulty: 'medium'
      }
    ],
    environmentalChallenges: ['Air pollution crisis', 'Industrial waste management', 'Energy transition'],
    learningGoals: ['Pollution remediation', 'Industrial transformation', 'Energy system planning'],
    estimatedPlayTime: 45
  },

  {
    id: 'megacity_challenge',
    name: 'Sustainable Megacity',
    description: 'Design a large, sustainable city that balances growth with environmental protection.',
    difficulty: 'advanced',
    initialResources: {
      economy: { funds: 2000000, income: 0, expenses: 0, taxRate: 25 },
      population: { total: 500, capacity: 600, happiness: 60, growth: 0 },
      energy: { production: 800, consumption: 750, storage: 200, renewablePercentage: 45 },
      environment: { airQuality: 60, waterQuality: 65, noiseLevel: 50, co2Level: 420, greenSpacePercentage: 25, biodiversityIndex: 40 },
      waste: { production: 200, recycling: 80, landfill: 120, recyclingRate: 40 }
    },
    objectives: [
      {
        id: 'carbon_neutral',
        title: 'Achieve Carbon Neutrality',
        description: 'Reduce city CO2 levels to 350 ppm through green planning',
        type: 'achieve',
        target: 350,
        current: 420,
        reward: { points: 800 },
        timeLimit: 120,
        difficulty: 'hard'
      },
      {
        id: 'population_growth',
        title: 'Sustainable Growth',
        description: 'Reach 1000 population while maintaining 80+ happiness',
        type: 'achieve',
        target: 1000,
        current: 500,
        reward: { points: 600 },
        difficulty: 'hard'
      },
      {
        id: 'circular_economy',
        title: 'Circular Economy',
        description: 'Achieve 90% waste recycling rate',
        type: 'achieve',
        target: 90,
        current: 40,
        reward: { points: 500 },
        difficulty: 'hard'
      }
    ],
    environmentalChallenges: ['Climate change mitigation', 'Sustainable urban growth', 'Circular economy implementation'],
    learningGoals: ['Advanced sustainability concepts', 'System thinking', 'Climate action planning'],
    estimatedPlayTime: 90
  }
];

export const educationalContent: Record<string, EducationalContent> = {
  renewable_energy: {
    facts: [
      "Renewable energy could provide 90% of global power by 2050",
      "Solar panels have become 70% cheaper in the last decade",
      "Wind power is now the cheapest source of electricity in many regions"
    ],
    tips: [
      "Combine different renewable sources for reliable power",
      "Energy storage systems help balance supply and demand",
      "Smart grids optimize renewable energy distribution"
    ],
    realWorldExamples: [
      "Denmark generates 100% of electricity from renewables on windy days",
      "Costa Rica runs on 99% renewable electricity",
      "Germany's renewable energy transition (Energiewende)"
    ],
    environmentalImpactExplanation: "Renewable energy reduces greenhouse gas emissions, air pollution, and dependence on finite fossil fuel resources.",
    sustainabilityBenefits: [
      "Zero operational emissions",
      "Infinite energy source",
      "Job creation in green industries",
      "Energy independence"
    ],
    interactiveChallenges: [
      "Calculate how many wind turbines power your city",
      "Design an optimal solar panel layout",
      "Balance energy production with consumption"
    ]
  },

  waste_management: {
    facts: [
      "The average person produces 4.5 pounds of waste daily",
      "Recycling 1 ton of plastic saves 1,000-2,000 gallons of gasoline",
      "Composting reduces methane emissions from landfills"
    ],
    tips: [
      "Reduce, reuse, recycle - in that order of priority",
      "Separate organic waste for composting",
      "Support products with minimal packaging"
    ],
    realWorldExamples: [
      "San Francisco diverts 80% of waste from landfills",
      "Sweden imports waste to fuel their waste-to-energy plants",
      "Zero Waste communities in various global cities"
    ],
    environmentalImpactExplanation: "Proper waste management prevents pollution, conserves resources, and reduces greenhouse gas emissions from landfills.",
    sustainabilityBenefits: [
      "Resource conservation",
      "Pollution prevention",
      "Energy recovery",
      "Circular economy creation"
    ],
    interactiveChallenges: [
      "Design a waste sorting system",
      "Calculate recycling impact on your city",
      "Plan a zero-waste district"
    ]
  },

  urban_planning: {
    facts: [
      "Cities use 78% of global energy despite housing 55% of population",
      "Green buildings use 25-30% less energy than conventional buildings",
      "Urban trees can reduce city temperatures by 2-9°F"
    ],
    tips: [
      "Mixed-use development reduces transportation needs",
      "Green corridors connect natural habitats",
      "Compact city design preserves surrounding nature"
    ],
    realWorldExamples: [
      "Singapore's 'City in a Garden' urban planning",
      "Copenhagen's carbon-neutral city plan",
      "Curitiba's innovative public transportation system"
    ],
    environmentalImpactExplanation: "Sustainable urban planning reduces environmental impact while improving quality of life through efficient resource use and green infrastructure.",
    sustainabilityBenefits: [
      "Reduced urban sprawl",
      "Lower per-capita emissions",
      "Improved air and water quality",
      "Enhanced biodiversity"
    ],
    interactiveChallenges: [
      "Design a 15-minute neighborhood",
      "Plan green transportation networks",
      "Create urban biodiversity corridors"
    ]
  }
};

// Helper functions for building data
export const getBuildingsByCategory = (category: string) => {
  return Object.values(buildingDefinitions).filter(building => building.category === category);
};

export const getBuildingDefinition = (buildingType: BuildingType): BuildingDefinition => {
  return buildingDefinitions[buildingType];
};

export const calculateEnvironmentalScore = (buildings: any[]) => {
  let totalScore = 0;
  buildings.forEach(building => {
    const def = getBuildingDefinition(building.type);
    totalScore += def.environmentalImpact.airQuality;
    totalScore += def.environmentalImpact.waterQuality;
    totalScore -= def.environmentalImpact.co2Emissions / 10; // Scale CO2 impact
    totalScore += def.environmentalImpact.biodiversity;
  });
  return Math.max(0, Math.min(100, totalScore + 50)); // Normalize to 0-100
};