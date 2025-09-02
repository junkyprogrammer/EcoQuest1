import { useState } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { miniGames } from "../lib/gameData";

export default function MiniGames() {
  const { closeMiniGame, addScore, currentLevel } = useGameState();
  const { playSuccess, playHit } = useAudio();
  const [currentGame, setCurrentGame] = useState(0);
  const [gameState, setGameState] = useState<any>({});

  const game = miniGames[currentGame];

  const handleAnswer = (answer: string) => {
    if (answer === game.correctAnswer) {
      playSuccess();
      addScore(game.points);
      setTimeout(() => {
        closeMiniGame();
      }, 1000);
    } else {
      playHit();
    }
  };

  const overlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    pointerEvents: 'auto' as const
  };

  const gameBoxStyle = {
    backgroundColor: '#2d3748',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    textAlign: 'center' as const,
    color: 'white'
  };

  const buttonStyle = {
    padding: '12px 24px',
    margin: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  if (game.type === 'sorting') {
    return (
      <div style={overlayStyle}>
        <div style={gameBoxStyle}>
          <h2 style={{ marginBottom: '20px' }}>♻️ {game.title}</h2>
          <p style={{ marginBottom: '20px' }}>{game.description}</p>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Sort this item: {game.item}</h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {game.options.map((option: string, index: number) => (
              <button
                key={index}
                style={buttonStyle}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            style={{...buttonStyle, backgroundColor: '#666', marginTop: '20px'}}
            onClick={closeMiniGame}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (game.type === 'energy') {
    return (
      <div style={overlayStyle}>
        <div style={gameBoxStyle}>
          <h2 style={{ marginBottom: '20px' }}>⚡ {game.title}</h2>
          <p style={{ marginBottom: '20px' }}>{game.description}</p>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>{game.question}</h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {game.options.map((option: string, index: number) => (
              <button
                key={index}
                style={buttonStyle}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            style={{...buttonStyle, backgroundColor: '#666', marginTop: '20px'}}
            onClick={closeMiniGame}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
}
