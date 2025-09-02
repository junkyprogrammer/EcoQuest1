export const miniGames = [
  {
    id: 'recycling_sort',
    type: 'sorting',
    title: 'Recycling Sorting Challenge',
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
  type: 'collect' | 'recycle' | 'quiz' | 'score';
  target: string | number;
  current?: number;
  description: string;
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
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Green Beginner",
    description: "Learn the basics of environmental conservation!",
    objectives: [
      {
        type: 'collect',
        target: 'Plants',
        current: 0,
        description: 'Collect 5 plant items'
      },
      {
        type: 'score',
        target: 500,
        current: 0,
        description: 'Reach 500 points'
      }
    ],
    unlockScore: 0,
    rewardPoints: 100,
    theme: 'beginner'
  },
  {
    id: 2,
    name: "Recycling Hero",
    description: "Master the art of recycling and waste sorting!",
    objectives: [
      {
        type: 'recycle',
        target: 'Recyclables',
        current: 0,
        description: 'Complete 3 recycling challenges'
      },
      {
        type: 'collect',
        target: 'Clean Energy',
        current: 0,
        description: 'Collect 3 energy orbs'
      },
      {
        type: 'score',
        target: 1000,
        current: 0,
        description: 'Reach 1000 points'
      }
    ],
    unlockScore: 500,
    rewardPoints: 200,
    theme: 'recycling'
  },
  {
    id: 3,
    name: "Climate Champion",
    description: "Tackle climate change and renewable energy challenges!",
    objectives: [
      {
        type: 'quiz',
        target: 'climate',
        current: 0,
        description: 'Complete 2 climate quizzes'
      },
      {
        type: 'collect',
        target: 'Clean Energy',
        current: 0,
        description: 'Collect 5 energy orbs'
      },
      {
        type: 'score',
        target: 1800,
        current: 0,
        description: 'Reach 1800 points'
      }
    ],
    unlockScore: 1000,
    maxTime: 300, // 5 minutes
    rewardPoints: 300,
    theme: 'climate'
  },
  {
    id: 4,
    name: "Eco Master",
    description: "Prove yourself as the ultimate environmental guardian!",
    objectives: [
      {
        type: 'collect',
        target: 'Plants',
        current: 0,
        description: 'Collect 10 plant items'
      },
      {
        type: 'recycle',
        target: 'Recyclables',
        current: 0,
        description: 'Complete 5 recycling challenges'
      },
      {
        type: 'quiz',
        target: 'all',
        current: 0,
        description: 'Complete 3 environmental quizzes'
      },
      {
        type: 'score',
        target: 3000,
        current: 0,
        description: 'Reach 3000 points'
      }
    ],
    unlockScore: 1800,
    maxTime: 420, // 7 minutes
    rewardPoints: 500,
    theme: 'master'
  }
];

export const getLevelByScore = (score: number): Level => {
  // Find the highest level that can be unlocked with the current score
  const availableLevels = levels.filter(level => score >= level.unlockScore);
  return availableLevels[availableLevels.length - 1] || levels[0];
};

export const getNextLevel = (currentLevelId: number): Level | null => {
  const nextLevel = levels.find(level => level.id === currentLevelId + 1);
  return nextLevel || null;
};
