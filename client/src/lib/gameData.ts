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
