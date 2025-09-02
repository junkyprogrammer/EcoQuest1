import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import MiniGames from "./MiniGames";
import Quiz from "./Quiz";

export default function GameUI() {
  const { 
    gamePhase, 
    score, 
    currentLevel, 
    inventory, 
    showMiniGame, 
    showQuiz,
    start,
    restart 
  } = useGameState();
  const { isMuted, toggleMute } = useAudio();

  const uiStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none' as const,
    color: 'white',
    fontFamily: 'Inter, sans-serif',
    zIndex: 100
  };

  const buttonStyle = {
    pointerEvents: 'auto' as const,
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    margin: '5px'
  };

  if (gamePhase === 'menu') {
    return (
      <div style={uiStyle}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '40px',
          borderRadius: '12px',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#4CAF50' }}>
            🌱 EcoLearn Adventure
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Learn about environmental conservation through interactive gameplay!
          </p>
          <button 
            style={buttonStyle}
            onClick={start}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gamePhase === 'ended') {
    return (
      <div style={uiStyle}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '40px',
          borderRadius: '12px',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#4CAF50' }}>
            🎉 Great Job!
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            Final Score: {score}
          </p>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            You've learned valuable lessons about environmental conservation!
          </p>
          <button 
            style={buttonStyle}
            onClick={restart}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // Game HUD
  return (
    <div style={uiStyle}>
      {/* Top HUD */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '8px',
        pointerEvents: 'auto'
      }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Score: {score}</div>
          <div style={{ fontSize: '14px' }}>Level: {currentLevel}</div>
        </div>
        
        <div>
          <div style={{ fontSize: '14px', marginBottom: '5px' }}>Inventory:</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {Object.entries(inventory).map(([item, count]) => (
              <span key={item} style={{ 
                backgroundColor: '#4CAF50', 
                padding: '2px 8px', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {item}: {count}
              </span>
            ))}
          </div>
        </div>

        <button 
          style={{...buttonStyle, fontSize: '14px', padding: '8px 16px'}}
          onClick={toggleMute}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Controls help */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <div>WASD / Arrow Keys: Move</div>
        <div>E / Space: Interact</div>
        <div>J: Jump</div>
      </div>

      {/* Mini-games and quiz overlays */}
      {showMiniGame && <MiniGames />}
      {showQuiz && <Quiz />}
    </div>
  );
}
