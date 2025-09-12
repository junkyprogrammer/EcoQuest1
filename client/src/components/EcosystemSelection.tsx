import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { ecosystems } from "./EcosystemManager";
import { ecosystemFacts } from "../lib/gameData";

export default function EcosystemSelection() {
  const { 
    score, 
    availableEcosystems, 
    currentEcosystem, 
    ecosystemProgress,
    selectEcosystem,
    restart 
  } = useGameState();
  const { playSuccess } = useAudio();

  const handleEcosystemSelect = (ecosystem: 'forest' | 'ocean' | 'city') => {
    playSuccess();
    selectEcosystem(ecosystem);
    console.log(`Selected ecosystem: ${ecosystem}`);
  };

  const ecosystemCards = [
    {
      id: 'forest',
      name: '🌲 Enchanted Forest',
      description: 'Restore the magical forest by protecting wildlife, planting trees, and cleaning up pollution.',
      difficulty: 'Beginner',
      unlockScore: 0,
      backgroundColor: 'linear-gradient(135deg, #228B22, #32CD32)',
      facts: ecosystemFacts.forest.slice(0, 3),
      objectives: [
        'Plant 10 native tree seeds',
        'Clean up 3 pollution sources', 
        'Discover 15 plant species'
      ]
    },
    {
      id: 'ocean',
      name: '🌊 Deep Blue Ocean',
      description: 'Dive deep to save marine life, restore coral reefs, and clean up ocean plastic.',
      difficulty: 'Intermediate',
      unlockScore: 500,
      backgroundColor: 'linear-gradient(135deg, #006994, #4682B4)',
      facts: ecosystemFacts.ocean.slice(0, 3),
      objectives: [
        'Remove 20 pieces of ocean plastic',
        'Restore 5 coral reef sections',
        'Catalog 12 marine species'
      ]
    },
    {
      id: 'city',
      name: '🏙️ Green Metropolis',
      description: 'Transform the urban landscape with renewable energy, green spaces, and smart planning.',
      difficulty: 'Advanced',
      unlockScore: 1250,
      backgroundColor: 'linear-gradient(135deg, #2F4F4F, #708090)',
      facts: ecosystemFacts.city.slice(0, 3),
      objectives: [
        'Install 15 renewable energy sources',
        'Create 5 urban green spaces',
        'Reduce air pollution by 50%'
      ]
    }
  ];

  const getEcosystemStatus = (ecosystemId: string) => {
    if (!availableEcosystems.includes(ecosystemId)) {
      return 'locked';
    }
    return ecosystemProgress[ecosystemId as keyof typeof ecosystemProgress]?.completed ? 'completed' : 'available';
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      padding: '20px',
      zIndex: 100,
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '700'
        }}>
          🌍 Choose Your Ecosystem
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          opacity: 0.9,
          marginBottom: '10px'
        }}>
          Select an ecosystem to restore and protect
        </p>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '10px 20px',
          borderRadius: '25px',
          display: 'inline-block',
          backdropFilter: 'blur(10px)'
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            🏆 Conservation Score: {score} points
          </span>
        </div>
      </div>

      {/* Ecosystem Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        width: '100%',
        marginBottom: '30px'
      }}>
        {ecosystemCards.map((ecosystem) => {
          const status = getEcosystemStatus(ecosystem.id);
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';
          const isSelected = currentEcosystem === ecosystem.id;

          return (
            <div
              key={ecosystem.id}
              onClick={() => !isLocked && handleEcosystemSelect(ecosystem.id as 'forest' | 'ocean' | 'city')}
              style={{
                background: isLocked ? 'rgba(0, 0, 0, 0.3)' : ecosystem.backgroundColor,
                borderRadius: '20px',
                padding: '25px',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected 
                  ? '0 10px 30px rgba(76, 175, 80, 0.4)' 
                  : isLocked 
                    ? '0 5px 15px rgba(0, 0, 0, 0.3)'
                    : '0 10px 20px rgba(0, 0, 0, 0.3)',
                border: isSelected ? '3px solid #4CAF50' : isCompleted ? '2px solid #FFD700' : 'none',
                opacity: isLocked ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = isSelected ? 'scale(1.05)' : 'scale(1)';
                  e.currentTarget.style.boxShadow = isSelected 
                    ? '0 10px 30px rgba(76, 175, 80, 0.4)' 
                    : '0 10px 20px rgba(0, 0, 0, 0.3)';
                }
              }}
            >
              {/* Status indicators */}
              {isLocked && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(255, 0, 0, 0.8)',
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  🔒 Needs {ecosystem.unlockScore} points
                </div>
              )}

              {isCompleted && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(255, 215, 0, 0.9)',
                  color: '#000',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  ✅ Completed
                </div>
              )}

              {/* Ecosystem header */}
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ 
                  fontSize: '1.8rem', 
                  marginBottom: '8px',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  {ecosystem.name}
                </h2>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {ecosystem.difficulty}
                  </span>
                  {!isLocked && (
                    <span style={{
                      fontSize: '0.9rem',
                      opacity: 0.8
                    }}>
                      Click to explore →
                    </span>
                  )}
                </div>
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: '1.5',
                  opacity: 0.9,
                  marginBottom: '15px'
                }}>
                  {ecosystem.description}
                </p>
              </div>

              {/* Objectives */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '10px',
                  fontWeight: '600',
                  color: '#FFD700'
                }}>
                  🎯 Mission Objectives
                </h3>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0 
                }}>
                  {ecosystem.objectives.map((objective, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      fontSize: '1rem',
                      opacity: 0.9
                    }}>
                      <span style={{ 
                        marginRight: '8px',
                        fontSize: '1.1rem'
                      }}>
                        •
                      </span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Educational facts */}
              <div>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '10px',
                  fontWeight: '600',
                  color: '#87CEEB'
                }}>
                  🧠 Did You Know?
                </h3>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px'
                }}>
                  {ecosystem.facts.map((fact, index) => (
                    <p key={index} style={{
                      fontSize: '0.95rem',
                      margin: '6px 0',
                      opacity: 0.8,
                      lineHeight: '1.4'
                    }}>
                      • {fact}
                    </p>
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              {!isLocked && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderBottomLeftRadius: '20px',
                  borderBottomRightRadius: '20px'
                }}>
                  <div style={{
                    height: '100%',
                    background: isCompleted 
                      ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' 
                      : `linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.8))`,
                    width: isCompleted ? '100%' : '0%',
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Back to Menu Button */}
      <button
        onClick={() => {
          playSuccess();
          restart();
        }}
        style={{
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          borderRadius: '25px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        ← Back to Main Menu
      </button>

      {/* Progress Summary */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '15px 20px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '1.1rem',
          color: '#4CAF50'
        }}>
          🌍 Earth Restoration Progress
        </h4>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Forest: {ecosystemProgress.forest.completed ? '✅' : '🌱'} • 
          Ocean: {ecosystemProgress.ocean.completed ? '✅' : availableEcosystems.includes('ocean') ? '🌊' : '🔒'} • 
          City: {ecosystemProgress.city.completed ? '✅' : availableEcosystems.includes('city') ? '🏙️' : '🔒'}
        </div>
      </div>
    </div>
  );
}