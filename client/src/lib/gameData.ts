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
