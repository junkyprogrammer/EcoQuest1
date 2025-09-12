import { useState, useEffect } from 'react';
import { useGameState } from '../lib/stores/useGameState';
import { useAudio } from '../lib/stores/useAudio';

// Define waste items with detailed properties
const WASTE_ITEMS = [
  {
    id: 'plastic_bottle',
    name: '🍼 Plastic Bottle',
    category: 'plastic',
    points: 10,
    tip: 'Plastic bottles should be rinsed and go in the plastic recycling bin. Remove caps if possible!'
  },
  {
    id: 'newspaper',
    name: '📰 Newspaper',
    category: 'paper',
    points: 8,
    tip: 'Clean paper products like newspapers are perfect for paper recycling!'
  },
  {
    id: 'glass_jar',
    name: '🫙 Glass Jar',
    category: 'glass',
    points: 12,
    tip: 'Glass jars are 100% recyclable! Remove lids and rinse before recycling.'
  },
  {
    id: 'apple_core',
    name: '🍎 Apple Core',
    category: 'organic',
    points: 15,
    tip: 'Food scraps like apple cores make excellent compost for growing new plants!'
  },
  {
    id: 'aluminum_can',
    name: '🥤 Aluminum Can',
    category: 'metal',
    points: 20,
    tip: 'Aluminum cans are infinitely recyclable and save 95% of the energy needed to make new ones!'
  },
  {
    id: 'pizza_box',
    name: '📦 Pizza Box',
    category: 'paper',
    points: 5,
    tip: 'Clean pizza boxes go in paper recycling. If greasy, tear off clean parts!'
  },
  {
    id: 'wine_bottle',
    name: '🍷 Wine Bottle',
    category: 'glass',
    points: 12,
    tip: 'Glass bottles can be recycled endlessly without losing quality!'
  },
  {
    id: 'yogurt_container',
    name: '🥛 Yogurt Container',
    category: 'plastic',
    points: 8,
    tip: 'Clean plastic containers with recycling symbols can be recycled!'
  },
  {
    id: 'banana_peel',
    name: '🍌 Banana Peel',
    category: 'organic',
    points: 15,
    tip: 'Banana peels are rich in potassium and make great compost material!'
  },
  {
    id: 'food_can',
    name: '🥫 Food Can',
    category: 'metal',
    points: 18,
    tip: 'Rinse food cans before recycling. The metal can be recycled indefinitely!'
  },
  {
    id: 'cardboard_box',
    name: '📦 Cardboard Box',
    category: 'paper',
    points: 10,
    tip: 'Flatten cardboard boxes and remove tape before recycling!'
  },
  {
    id: 'old_phone',
    name: '📱 Old Phone',
    category: 'electronic',
    points: 25,
    tip: 'Electronics contain valuable materials and should go to e-waste recycling!'
  }
];

// Define recycling bins with colors and categories
const RECYCLING_BINS = [
  {
    id: 'paper_bin',
    name: 'Paper & Cardboard',
    category: 'paper',
    color: '#4A90E2',
    emoji: '📄',
    description: 'Clean paper, cardboard, newspapers'
  },
  {
    id: 'plastic_bin',
    name: 'Plastic',
    category: 'plastic',
    color: '#F39C12',
    emoji: '♻️',
    description: 'Bottles, containers with recycling symbols'
  },
  {
    id: 'glass_bin',
    name: 'Glass',
    category: 'glass',
    color: '#27AE60',
    emoji: '🫙',
    description: 'Bottles, jars (remove lids)'
  },
  {
    id: 'metal_bin',
    name: 'Metal',
    category: 'metal',
    color: '#95A5A6',
    emoji: '🥫',
    description: 'Cans, metal containers'
  },
  {
    id: 'organic_bin',
    name: 'Organic/Compost',
    category: 'organic',
    color: '#8B4513',
    emoji: '🌱',
    description: 'Food scraps, garden waste'
  },
  {
    id: 'electronic_bin',
    name: 'E-Waste',
    category: 'electronic',
    color: '#9B59B6',
    emoji: '⚡',
    description: 'Electronics, batteries'
  }
];

interface RecyclingSortingGameProps {
  onClose: () => void;
  onScore: (points: number) => void;
}

export default function RecyclingSortingGame({ onClose, onScore }: RecyclingSortingGameProps) {
  const { playSuccess, playHit } = useAudio();
  const [gameItems, setGameItems] = useState<typeof WASTE_ITEMS>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showTip, setShowTip] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [gameOver, setGameOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState<typeof WASTE_ITEMS[0] | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Initialize game with random selection of items
  useEffect(() => {
    const shuffled = [...WASTE_ITEMS].sort(() => Math.random() - 0.5);
    setGameItems(shuffled.slice(0, 8)); // Show 8 random items
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameOver]);

  const endGame = () => {
    setGameOver(true);
    onScore(currentScore);
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    setFeedback(`Game Over! Final Score: ${currentScore}. Accuracy: ${accuracy}%`);
  };

  const handleDragStart = (e: React.DragEvent, item: typeof WASTE_ITEMS[0]) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, bin: typeof RECYCLING_BINS[0]) => {
    e.preventDefault();
    
    if (!draggedItem || gameOver) return;

    setTotalAttempts(prev => prev + 1);

    const isCorrect = draggedItem.category === bin.category;
    
    if (isCorrect) {
      const points = draggedItem.points;
      setCurrentScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setFeedback(`✅ Correct! +${points} points`);
      setShowTip(draggedItem.tip);
      playSuccess();
      
      // Remove the correctly sorted item
      setGameItems(prev => prev.filter(item => item.id !== draggedItem.id));
      
      // Check if all items are sorted
      if (gameItems.length <= 1) {
        setTimeout(() => {
          setFeedback(`🎉 Perfect! All items sorted correctly!`);
          endGame();
        }, 1000);
      }
    } else {
      setFeedback(`❌ Incorrect! ${draggedItem.name} doesn't go in ${bin.name}`);
      setShowTip(`${draggedItem.name} should go in the ${RECYCLING_BINS.find(b => b.category === draggedItem.category)?.name} bin. ${draggedItem.tip}`);
      playHit();
    }

    setDraggedItem(null);
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback(null);
      setShowTip(null);
    }, 3000);
  };

  const handleTouchStart = (item: typeof WASTE_ITEMS[0]) => {
    setDraggedItem(item);
  };

  const handleBinClick = (bin: typeof RECYCLING_BINS[0]) => {
    if (!draggedItem || gameOver) return;
    
    // Simulate drop for touch devices
    const fakeEvent = {
      preventDefault: () => {},
    } as React.DragEvent;
    
    handleDrop(fakeEvent, bin);
  };

  const overlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
    pointerEvents: 'auto' as const,
    color: 'white',
    fontFamily: 'Inter, sans-serif'
  };

  const gameContainerStyle = {
    background: 'linear-gradient(135deg, #2C3E50, #34495E)',
    padding: '30px',
    borderRadius: '20px',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(255, 255, 255, 0.1)'
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '20px'
  };

  const statsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '15px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '10px'
  };

  const itemsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    border: '2px dashed rgba(255, 255, 255, 0.3)'
  };

  const itemStyle = (item: typeof WASTE_ITEMS[0]) => ({
    padding: '15px',
    background: draggedItem?.id === item.id ? 
      'linear-gradient(135deg, #E74C3C, #C0392B)' : 
      'linear-gradient(135deg, #3498DB, #2980B9)',
    borderRadius: '12px',
    textAlign: 'center' as const,
    cursor: 'grab',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    transform: draggedItem?.id === item.id ? 'scale(1.05)' : 'scale(1)',
  });

  const binsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  };

  const binStyle = (bin: typeof RECYCLING_BINS[0]) => ({
    padding: '20px',
    background: `linear-gradient(135deg, ${bin.color}, ${bin.color}dd)`,
    borderRadius: '15px',
    textAlign: 'center' as const,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: draggedItem ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    border: '3px solid transparent',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
    opacity: draggedItem ? 1 : 0.8,
    transform: draggedItem ? 'scale(1.02)' : 'scale(1)'
  });

  const buttonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
  };

  if (gameOver) {
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    return (
      <div style={overlayStyle}>
        <div style={gameContainerStyle}>
          <div style={headerStyle}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#F39C12' }}>
              🎯 Game Complete!
            </h2>
            <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
              Final Score: {currentScore} points
            </div>
            <div style={{ fontSize: '1.2rem', color: '#BDC3C7' }}>
              Accuracy: {accuracy}% ({correctCount}/{totalAttempts} correct)
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              padding: '20px', 
              background: 'rgba(46, 204, 113, 0.2)', 
              borderRadius: '15px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#2ECC71' }}>🌱 Environmental Impact</h3>
              <p>Great job learning about recycling! Every item sorted correctly helps protect our planet.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              style={{...buttonStyle, background: 'linear-gradient(135deg, #27AE60, #229954)'}}
              onClick={() => window.location.reload()}
            >
              Play Again
            </button>
            <button 
              style={buttonStyle}
              onClick={onClose}
            >
              Continue Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={gameContainerStyle}>
        <div style={headerStyle}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#2ECC71' }}>
            ♻️ Recycling Sorting Challenge
          </h2>
          <p style={{ color: '#BDC3C7', fontSize: '1.1rem' }}>
            Drag waste items to the correct recycling bins!
          </p>
        </div>

        <div style={statsStyle}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F39C12' }}>
              Score: {currentScore}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E74C3C' }}>
              Time: {timeLeft}s
            </span>
          </div>
          <div>
            <span style={{ fontSize: '1rem', color: '#BDC3C7' }}>
              Items left: {gameItems.length}
            </span>
          </div>
        </div>

        {feedback && (
          <div style={{
            padding: '15px',
            background: feedback.includes('✅') ? 
              'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
            borderRadius: '10px',
            marginBottom: '15px',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {feedback}
          </div>
        )}

        {showTip && (
          <div style={{
            padding: '15px',
            background: 'rgba(52, 152, 219, 0.2)',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#85C1E9',
            border: '1px solid rgba(52, 152, 219, 0.3)'
          }}>
            💡 <strong>Tip:</strong> {showTip}
          </div>
        )}

        <div>
          <h3 style={{ marginBottom: '15px', color: '#F39C12' }}>Waste Items to Sort:</h3>
          <div style={itemsContainerStyle}>
            {gameItems.map((item) => (
              <div
                key={item.id}
                style={itemStyle(item)}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onTouchStart={() => handleTouchStart(item)}
                onClick={() => handleTouchStart(item)}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {item.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '12px' }}>
                  {item.name.substring(item.name.indexOf(' ') + 1)}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginTop: '5px' 
                }}>
                  {item.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px', color: '#F39C12' }}>Recycling Bins:</h3>
          <div style={binsContainerStyle}>
            {RECYCLING_BINS.map((bin) => (
              <div
                key={bin.id}
                style={binStyle(bin)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, bin)}
                onClick={() => handleBinClick(bin)}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                  {bin.emoji}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '5px' }}>
                  {bin.name}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                  {bin.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <button 
            style={buttonStyle}
            onClick={onClose}
          >
            Close Game
          </button>
        </div>

        {draggedItem && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            background: 'rgba(52, 152, 219, 0.9)',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 400
          }}>
            Selected: {draggedItem.name} - Tap a bin to drop!
          </div>
        )}
      </div>
    </div>
  );
}