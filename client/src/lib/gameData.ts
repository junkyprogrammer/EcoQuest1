export const miniGames = [
  {
    id: 'recycling_drag_drop',
    type: 'drag_drop_recycling',
    title: 'Advanced Recycling Sorting Challenge',
    description: 'Drag waste items into the correct recycling bins!',
    points: 200,
    explanation: 'Learn proper recycling practices through interactive drag-and-drop gameplay.'
  },
  {
    id: 'recycling_sort',
    type: 'sorting',
    title: 'Quick Recycling Sort',
    description: 'Help sort waste into the correct bins!',
    item: 'Plastic Bottle',
    options: ['Paper Bin', 'Plastic Bin', 'Organic Bin', 'General Waste'],
    correctAnswer: 'Plastic Bin',
    points: 100,
    explanation: 'Plastic bottles should be recycled in the plastic recycling bin.'
  },
  {
    id: 'energy_conservation',
    type: 'energy',
    title: 'Energy Conservation',
    description: 'Choose the most energy-efficient option!',
    question: 'Which light source uses the least energy?',
    options: ['Incandescent Bulb', 'CFL Bulb', 'LED Bulb', 'Halogen Bulb'],
    correctAnswer: 'LED Bulb',
    points: 150,
    explanation: 'LED bulbs use up to 80% less energy than incandescent bulbs and last much longer.'
  },
  {
    id: 'water_conservation',
    type: 'sorting',
    title: 'Water Conservation',
    description: 'Help conserve water by making smart choices!',
    item: 'Long Shower (20 minutes)',
    options: ['Good Practice', 'Bad Practice', 'Neutral', 'Recommended'],
    correctAnswer: 'Bad Practice',
    points: 120,
    explanation: 'Long showers waste a lot of water. Shorter showers help conserve this precious resource.'
  }
];

export const quizQuestions = [
  {
    id: 'greenhouse_effect',
    question: 'What is the main cause of the greenhouse effect?',
    options: [
      'Increased carbon dioxide in the atmosphere',
      'Deforestation only',
      'Ocean pollution',
      'Nuclear energy'
    ],
    correctAnswer: 'Increased carbon dioxide in the atmosphere',
    points: 200,
    explanation: 'The greenhouse effect is primarily caused by increased levels of greenhouse gases like CO2 trapping heat in Earth\'s atmosphere.'
  },
  {
    id: 'renewable_energy',
    question: 'Which of these is NOT a renewable energy source?',
    options: [
      'Solar power',
      'Wind power',
      'Coal',
      'Hydroelectric power'
    ],
    correctAnswer: 'Coal',
    points: 150,
    explanation: 'Coal is a fossil fuel and non-renewable. Solar, wind, and hydroelectric power are all renewable energy sources.'
  },
  {
    id: 'biodiversity',
    question: 'What does biodiversity refer to?',
    options: [
      'The variety of life in ecosystems',
      'Only animal species',
      'Only plant species',
      'Weather patterns'
    ],
    correctAnswer: 'The variety of life in ecosystems',
    points: 180,
    explanation: 'Biodiversity encompasses the variety of all living organisms, including plants, animals, fungi, and microorganisms in ecosystems.'
  },
  {
    id: 'plastic_pollution',
    question: 'How long does it take for a plastic bottle to decompose?',
    options: [
      '1-5 years',
      '50-100 years',
      '450-500 years',
      '1000+ years'
    ],
    correctAnswer: '450-500 years',
    points: 160,
    explanation: 'Plastic bottles can take 450-500 years to decompose, which is why recycling and reducing plastic use is so important.'
  },
  {
    id: 'carbon_footprint',
    question: 'What is a carbon footprint?',
    options: [
      'The size of your foot',
      'Total greenhouse gases produced by human activities',
      'Amount of coal you burn',
      'How much you walk per day'
    ],
    correctAnswer: 'Total greenhouse gases produced by human activities',
    points: 170,
    explanation: 'A carbon footprint measures the total greenhouse gas emissions caused directly and indirectly by a person, organization, event, or product.'
  },
  {
    id: 'ozone_layer',
    question: 'What protects Earth from harmful ultraviolet radiation?',
    options: [
      'Clouds',
      'The ozone layer',
      'Ocean water',
      'Mountain ranges'
    ],
    correctAnswer: 'The ozone layer',
    points: 160,
    explanation: 'The ozone layer in the stratosphere protects life on Earth by absorbing most of the Sun\'s harmful ultraviolet radiation.'
  },
  {
    id: 'water_conservation',
    question: 'Which activity uses the most water in a typical household?',
    options: [
      'Brushing teeth',
      'Taking showers',
      'Washing dishes',
      'Drinking water'
    ],
    correctAnswer: 'Taking showers',
    points: 140,
    explanation: 'Showers typically account for about 17% of indoor water use, making them one of the largest water consumption activities in homes.'
  },
  {
    id: 'deforestation',
    question: 'What is the main cause of deforestation globally?',
    options: [
      'Natural disasters',
      'Agriculture and livestock farming',
      'Urban development',
      'Paper production'
    ],
    correctAnswer: 'Agriculture and livestock farming',
    points: 180,
    explanation: 'Agriculture and livestock farming account for about 80% of global deforestation as forests are cleared for crops and grazing land.'
  },
  {
    id: 'acid_rain',
    question: 'What causes acid rain?',
    options: [
      'Too much oxygen in the air',
      'Sulfur dioxide and nitrogen oxides pollution',
      'Ocean evaporation',
      'Volcanic ash'
    ],
    correctAnswer: 'Sulfur dioxide and nitrogen oxides pollution',
    points: 190,
    explanation: 'Acid rain forms when sulfur dioxide and nitrogen oxides from pollution react with water, oxygen and other chemicals in the air to form acidic compounds.'
  },
  {
    id: 'endangered_species',
    question: 'How many species are estimated to become extinct each day?',
    options: [
      '1-10 species',
      '50-100 species',
      '150-200 species',
      '500+ species'
    ],
    correctAnswer: '150-200 species',
    points: 200,
    explanation: 'Scientists estimate that 150-200 species become extinct every day, primarily due to habitat loss, pollution, and climate change.'
  },
  {
    id: 'recycling_benefits',
    question: 'Recycling one ton of paper saves approximately how many trees?',
    options: [
      '5 trees',
      '10 trees',
      '17 trees',
      '25 trees'
    ],
    correctAnswer: '17 trees',
    points: 150,
    explanation: 'Recycling one ton of paper saves about 17 trees, along with significant amounts of water and energy in the manufacturing process.'
  },
  {
    id: 'ocean_plastic',
    question: 'What percentage of plastic waste ends up in the oceans?',
    options: [
      '2-5%',
      '8-10%',
      '15-20%',
      '30-40%'
    ],
    correctAnswer: '8-10%',
    points: 170,
    explanation: 'Approximately 8-10% of plastic waste ends up in oceans, creating massive pollution problems and harming marine life.'
  },
  {
    id: 'renewable_capacity',
    question: 'Which country leads the world in renewable energy capacity?',
    options: [
      'United States',
      'Germany',
      'China',
      'India'
    ],
    correctAnswer: 'China',
    points: 160,
    explanation: 'China leads globally in renewable energy capacity, particularly in solar and wind power installations and manufacturing.'
  },
  {
    id: 'food_waste',
    question: 'What percentage of food produced globally is wasted?',
    options: [
      '10%',
      '20%',
      '30%',
      '40%'
    ],
    correctAnswer: '30%',
    points: 180,
    explanation: 'About one-third (30%) of all food produced globally is wasted, contributing significantly to greenhouse gas emissions and resource depletion.'
  },
  {
    id: 'sustainable_development',
    question: 'What does sustainable development mean?',
    options: [
      'Fast economic growth',
      'Meeting present needs without compromising future generations',
      'Using only renewable resources',
      'Building more cities'
    ],
    correctAnswer: 'Meeting present needs without compromising future generations',
    points: 190,
    explanation: 'Sustainable development meets the needs of the present without compromising the ability of future generations to meet their own needs.'
  },
  {
    id: 'composting',
    question: 'What percentage of household waste can be composted?',
    options: [
      '10-15%',
      '20-25%',
      '30-35%',
      '40-50%'
    ],
    correctAnswer: '30-35%',
    points: 140,
    explanation: 'About 30-35% of household waste consists of organic materials that can be composted, reducing landfill waste and creating valuable soil amendment.'
  },
  {
    id: 'energy_efficiency',
    question: 'Which home appliance typically uses the most electricity?',
    options: [
      'Refrigerator',
      'Air conditioning/heating',
      'Television',
      'Washing machine'
    ],
    correctAnswer: 'Air conditioning/heating',
    points: 150,
    explanation: 'Heating and cooling systems typically account for 40-50% of a home\'s energy usage, making them the largest energy consumers.'
  },
  {
    id: 'coral_reefs',
    question: 'What percentage of coral reefs have been damaged by climate change?',
    options: [
      '25%',
      '40%',
      '60%',
      '75%'
    ],
    correctAnswer: '75%',
    points: 200,
    explanation: 'Climate change has damaged about 75% of the world\'s coral reefs through ocean warming, acidification, and bleaching events.'
  },
  {
    id: 'carbon_dioxide_levels',
    question: 'What is considered a dangerous level of atmospheric CO2?',
    options: [
      '350 ppm',
      '400 ppm',
      '450 ppm',
      '500 ppm'
    ],
    correctAnswer: '450 ppm',
    points: 190,
    explanation: 'Scientists consider 450 ppm of atmospheric CO2 as a dangerous level that could trigger irreversible climate change impacts.'
  },
  {
    id: 'electric_vehicles',
    question: 'Electric vehicles produce what percentage fewer emissions than gasoline cars?',
    options: [
      '30-40%',
      '50-60%',
      '70-80%',
      '90-100%'
    ],
    correctAnswer: '70-80%',
    points: 170,
    explanation: 'Electric vehicles produce 70-80% fewer emissions than gasoline cars over their lifetime, even accounting for electricity generation and battery production.'
  }
];

export const environmentalFacts = [
  "A single tree can absorb 48 pounds of CO2 per year!",
  "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
  "The average person uses 80-100 gallons of water per day.",
  "Solar panels can last 25-30 years and keep generating clean energy!",
  "Composting can reduce household waste by up to 30%."
];

export interface LevelObjective {
  type: 'collect' | 'recycle' | 'quiz' | 'score' | 'cleanup' | 'renewable' | 'greenspace';
  target: string | number;
  current?: number;
  description: string;
  ecosystem?: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  objectives: LevelObjective[];
  unlockScore: number;
  maxTime?: number; // optional time limit in seconds
  rewardPoints: number;
  theme: string;
  ecosystem?: 'forest' | 'ocean' | 'city';
  backgroundColor?: string;
  educationalFacts?: string[];
}

export interface EcosystemProgress {
  forest: { completed: boolean; score: number; objectivesComplete: number };
  ocean: { completed: boolean; score: number; objectivesComplete: number };
  city: { completed: boolean; score: number; objectivesComplete: number };
}

// Ecosystem-based levels with educational objectives
export const levels: Level[] = [
  // Forest Ecosystem Levels
  {
    id: 1,
    name: "Forest Guardian",
    description: "Restore the enchanted forest by protecting wildlife and cleaning up pollution!",
    ecosystem: 'forest',
    backgroundColor: '#87CEEB',
    objectives: [
      {
        type: 'collect',
        target: 'Seeds',
        current: 0,
        description: 'Plant 10 native tree seeds',
        ecosystem: 'forest'
      },
      {
        type: 'cleanup',
        target: 3,
        current: 0,
        description: 'Clean up 3 pollution sources',
        ecosystem: 'forest'
      },
      {
        type: 'collect',
        target: 'Flowers',
        current: 0,
        description: 'Discover 15 plant species',
        ecosystem: 'forest'
      },
      {
        type: 'score',
        target: 500,
        current: 0,
        description: 'Reach 500 conservation points'
      }
    ],
    unlockScore: 0,
    rewardPoints: 500,
    theme: 'forest',
    educationalFacts: [
      "Forests absorb 2.6 billion tons of CO2 annually!",
      "A single tree can produce enough oxygen for 2 people per day.",
      "Forests are home to 80% of terrestrial biodiversity."
    ]
  },
  
  // Ocean Ecosystem Levels
  {
    id: 2,
    name: "Ocean Protector",
    description: "Dive deep to save marine life and restore coral reefs!",
    ecosystem: 'ocean',
    backgroundColor: '#006994',
    objectives: [
      {
        type: 'cleanup',
        target: 20,
        current: 0,
        description: 'Remove 20 pieces of ocean plastic',
        ecosystem: 'ocean'
      },
      {
        type: 'collect',
        target: 'Pearls',
        current: 0,
        description: 'Restore 5 coral reef sections',
        ecosystem: 'ocean'
      },
      {
        type: 'collect',
        target: 'Shells',
        current: 0,
        description: 'Catalog 12 marine species',
        ecosystem: 'ocean'
      },
      {
        type: 'score',
        target: 1000,
        current: 0,
        description: 'Reach 1000 ocean conservation points'
      }
    ],
    unlockScore: 500,
    maxTime: 600, // 10 minutes
    rewardPoints: 750,
    theme: 'ocean',
    educationalFacts: [
      "Oceans produce 50% of the oxygen we breathe!",
      "Plastic takes 450-500 years to decompose in ocean water.",
      "Coral reefs support 25% of all marine life species."
    ]
  },
  
  // City Ecosystem Levels
  {
    id: 3,
    name: "Green City Planner",
    description: "Transform the urban landscape with renewable energy and green spaces!",
    ecosystem: 'city',
    backgroundColor: '#2F4F4F',
    objectives: [
      {
        type: 'renewable',
        target: 15,
        current: 0,
        description: 'Install 15 renewable energy sources',
        ecosystem: 'city'
      },
      {
        type: 'cleanup',
        target: 10,
        current: 0,
        description: 'Reduce air pollution by 50%',
        ecosystem: 'city'
      },
      {
        type: 'greenspace',
        target: 5,
        current: 0,
        description: 'Create 5 urban green spaces',
        ecosystem: 'city'
      },
      {
        type: 'score',
        target: 1800,
        current: 0,
        description: 'Reach 1800 urban planning points'
      }
    ],
    unlockScore: 1250,
    maxTime: 900, // 15 minutes
    rewardPoints: 1000,
    theme: 'city',
    educationalFacts: [
      "Cities consume 78% of global energy and emit 70% of CO2!",
      "Urban trees can reduce city temperatures by 2-9°F.",
      "Green roofs can reduce building energy use by 30%."
    ]
  },
  
  // Master Challenge
  {
    id: 4,
    name: "Eco Master - Earth's Guardian",
    description: "Master all ecosystems and become Earth's ultimate environmental hero!",
    objectives: [
      {
        type: 'collect',
        target: 'All Ecosystems',
        current: 0,
        description: 'Complete all ecosystem challenges'
      },
      {
        type: 'quiz',
        target: 'all',
        current: 0,
        description: 'Pass 5 comprehensive eco-quizzes'
      },
      {
        type: 'score',
        target: 4000,
        current: 0,
        description: 'Reach 4000 total conservation points'
      }
    ],
    unlockScore: 3250,
    maxTime: 1200, // 20 minutes
    rewardPoints: 1500,
    theme: 'master',
    educationalFacts: [
      "You are now an Environmental Hero! 🌍",
      "Small actions create big environmental changes.",
      "Conservation is everyone's responsibility."
    ]
  }
];

// Ecosystem-specific educational content
export const ecosystemFacts = {
  forest: [
    "Forests cover 31% of the global land area.",
    "Trees communicate with each other through underground fungal networks.",
    "The Amazon rainforest produces 20% of the world's oxygen.",
    "Deforestation accounts for 11% of global CO2 emissions.",
    "One mature tree can absorb 48 pounds of CO2 per year."
  ],
  ocean: [
    "Oceans absorb about 25% of all CO2 emissions.",
    "The Great Pacific Garbage Patch is twice the size of Texas.",
    "Ocean temperatures have risen 0.33°C since 1969.",
    "Sea levels are rising 3.3mm per year due to climate change.",
    "Over 1 million marine animals die from plastic pollution annually."
  ],
  city: [
    "Cities house 50% of the world's population but use 80% of energy.",
    "Urban heat islands can be 1-7°F warmer than surrounding areas.",
    "Green buildings can reduce water usage by 20-30%.",
    "Electric vehicles produce 60% fewer emissions than gas cars.",
    "Vertical farms use 95% less water than traditional farming."
  ]
};

export const getLevelByScore = (score: number): Level => {
  // Find the highest level that can be unlocked with the current score
  const availableLevels = levels.filter(level => score >= level.unlockScore);
  return availableLevels[availableLevels.length - 1] || levels[0];
};

export const getNextLevel = (currentLevelId: number): Level | null => {
  const nextLevel = levels.find(level => level.id === currentLevelId + 1);
  return nextLevel || null;
};

export const getLevelsByEcosystem = (ecosystem: 'forest' | 'ocean' | 'city'): Level[] => {
  return levels.filter(level => level.ecosystem === ecosystem);
};

export const getAvailableEcosystems = (score: number): string[] => {
  const availableEcosystems: string[] = [];
  if (score >= 0) availableEcosystems.push('forest');
  if (score >= 500) availableEcosystems.push('ocean');
  if (score >= 1250) availableEcosystems.push('city');
  return availableEcosystems;
};

export const getEcosystemProgress = (score: number): EcosystemProgress => {
  return {
    forest: { completed: score >= 500, score: Math.min(score, 500), objectivesComplete: 0 },
    ocean: { completed: score >= 1250, score: Math.max(0, Math.min(score - 500, 750)), objectivesComplete: 0 },
    city: { completed: score >= 2250, score: Math.max(0, Math.min(score - 1250, 1000)), objectivesComplete: 0 }
  };
};
