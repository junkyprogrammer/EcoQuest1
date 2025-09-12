import { useState } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { levels, ecosystemFacts } from "../lib/gameData";

export default function PauseMenu() {
  const {
    score,
    currentLevel,
    currentEcosystem,
    currentLevelData,
    availableEcosystems,
    ecosystemProgress,
    inventory,
    resumeGame,
    togglePauseMenu,
    saveGame,
    loadGame,
    hasSavedGame,
    restart,
    selectEcosystem,
    showEcosystemSelection
  } = useGameState();
  
  const { isMuted, toggleMute } = useAudio();
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);

  const buttonStyle = {
    pointerEvents: 'auto' as const,
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '8px',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
    transition: 'all 0.3s ease',
    width: '250px',
    textAlign: 'center' as const
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #2196F3, #1976D2)',
    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #f44336, #d32f2f)',
    boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
  };

  const ecosystemColors = {
    forest: '#4CAF50',
    ocean: '#2196F3',
    city: '#FF9800'
  };

  const ecosystemIcons = {
    forest: '🌲',
    ocean: '🌊',
    city: '🏙️'
  };

  const handleSaveGame = () => {
    saveGame();
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  const handleLoadGame = () => {
    const success = loadGame();
    if (success) {
      setShowLoadConfirm(true);
      setTimeout(() => {
        setShowLoadConfirm(false);
        togglePauseMenu();
      }, 1500);
    }
  };

  const handleEcosystemSelect = (ecosystem: 'forest' | 'ocean' | 'city') => {
    selectEcosystem(ecosystem);
    setShowLevelSelect(false);
    togglePauseMenu();
  };

  const handleExitToMenu = () => {
    restart();
    togglePauseMenu();
  };

  if (showLevelSelect) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        pointerEvents: 'auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(33, 37, 41, 0.95))',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <h2 style={{ 
            fontSize: '2.2rem', 
            marginBottom: '10px', 
            color: '#8BC34A',
            fontWeight: '700'
          }}>
            Select Ecosystem
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            marginBottom: '30px',
            color: '#e0e0e0',
            lineHeight: '1.5'
          }}>
            Choose an ecosystem to explore and learn about environmental conservation!
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            {(['forest', 'ocean', 'city'] as const).map((ecosystem) => {
              const isAvailable = availableEcosystems.includes(ecosystem);
              const isCompleted = ecosystemProgress[ecosystem]?.completed;
              const levelData = levels.find(l => l.ecosystem === ecosystem);
              
              return (
                <div
                  key={ecosystem}
                  style={{
                    background: isAvailable 
                      ? `linear-gradient(135deg, ${ecosystemColors[ecosystem]}22, ${ecosystemColors[ecosystem]}44)`
                      : 'linear-gradient(135deg, #444444, #666666)',
                    border: currentEcosystem === ecosystem 
                      ? `3px solid ${ecosystemColors[ecosystem]}` 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    opacity: isAvailable ? 1 : 0.5,
                    transform: currentEcosystem === ecosystem ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onClick={isAvailable ? () => handleEcosystemSelect(ecosystem) : undefined}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                    {ecosystemIcons[ecosystem]}
                  </div>
                  <h3 style={{ 
                    color: isAvailable ? ecosystemColors[ecosystem] : '#888',
                    fontSize: '1.4rem',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    {levelData?.name || ecosystem.charAt(0).toUpperCase() + ecosystem.slice(1)}
                  </h3>
                  <p style={{ 
                    color: '#ccc',
                    fontSize: '0.9rem',
                    marginBottom: '10px',
                    lineHeight: '1.4'
                  }}>
                    {levelData?.description}
                  </p>
                  
                  {isCompleted && (
                    <div style={{
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'inline-block',
                      marginBottom: '5px'
                    }}>
                      ✅ Completed
                    </div>
                  )}
                  
                  {!isAvailable && (
                    <div style={{
                      background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>
                      🔒 Score {levelData?.unlockScore} required
                    </div>
                  )}
                  
                  {currentEcosystem === ecosystem && (
                    <div style={{
                      background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'inline-block',
                      marginTop: '5px'
                    }}>
                      🎮 Currently Playing
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            style={secondaryButtonStyle}
            onClick={() => setShowLevelSelect(false)}
          >
            ← Back to Pause Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(33, 37, 41, 0.95))',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minWidth: '400px'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px', 
          color: '#8BC34A',
          fontWeight: '700'
        }}>
          ⏸️ Game Paused
        </h2>
        
        {/* Current Progress Display */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px',
          border: '1px solid rgba(139, 195, 74, 0.3)'
        }}>
          <div style={{ color: '#FFD700', fontSize: '1.3rem', fontWeight: '600', marginBottom: '8px' }}>
            Score: {score} 🏆
          </div>
          <div style={{ color: '#8BC34A', fontSize: '1.1rem', marginBottom: '8px' }}>
            {ecosystemIcons[currentEcosystem]} {currentLevelData.name}
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
            Level {currentLevel} - {currentEcosystem.charAt(0).toUpperCase() + currentEcosystem.slice(1)} Ecosystem
          </div>
        </div>

        {/* Confirmation Messages */}
        {showSaveConfirm && (
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            ✅ Game Saved Successfully!
          </div>
        )}

        {showLoadConfirm && (
          <div style={{
            background: 'linear-gradient(135deg, #2196F3, #1976D2)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            📁 Game Loaded Successfully!
          </div>
        )}

        {/* Menu Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            style={buttonStyle}
            onClick={resumeGame}
          >
            ▶️ Resume Game
          </button>

          <button
            style={secondaryButtonStyle}
            onClick={handleSaveGame}
          >
            💾 Save Progress
          </button>

          {hasSavedGame() && (
            <button
              style={secondaryButtonStyle}
              onClick={handleLoadGame}
            >
              📁 Load Saved Game
            </button>
          )}

          <button
            style={secondaryButtonStyle}
            onClick={() => setShowLevelSelect(true)}
          >
            🌍 Select Ecosystem
          </button>

          <button
            style={{
              ...buttonStyle,
              background: isMuted ? 'linear-gradient(135deg, #f44336, #d32f2f)' : 'linear-gradient(135deg, #2196F3, #1976D2)',
              boxShadow: isMuted ? '0 4px 15px rgba(244, 67, 54, 0.3)' : '0 4px 15px rgba(33, 150, 243, 0.3)'
            }}
            onClick={toggleMute}
          >
            {isMuted ? '🔇 Unmute Audio' : '🔊 Mute Audio'}
          </button>

          <button
            style={dangerButtonStyle}
            onClick={handleExitToMenu}
          >
            🚪 Exit to Main Menu
          </button>
        </div>

        {/* Tips */}
        <div style={{
          marginTop: '25px',
          padding: '15px',
          background: 'rgba(139, 195, 74, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(139, 195, 74, 0.3)'
        }}>
          <div style={{ color: '#8BC34A', fontSize: '0.9rem', fontWeight: '600', marginBottom: '5px' }}>
            💡 Tip: Press ESC to toggle pause menu
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '0.8rem', fontStyle: 'italic' }}>
            {ecosystemFacts[currentEcosystem]?.[Math.floor(Math.random() * ecosystemFacts[currentEcosystem].length)]}
          </div>
        </div>
      </div>
    </div>
  );
}