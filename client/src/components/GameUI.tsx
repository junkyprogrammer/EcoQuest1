import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../App";
import MiniGames from "./MiniGames";
import Quiz from "./Quiz";
import EcosystemSelection from "./EcosystemSelection";
import PauseMenu from "./PauseMenu";
import { useState, useEffect } from "react";

export default function GameUI() {
  const { 
    gamePhase, 
    score, 
    currentLevel, 
    currentLevelData,
    objectives,
    inventory, 
    showMiniGame, 
    showQuiz,
    showPauseMenu,
    isPaused,
    currentEcosystem,
    availableEcosystems,
    ecosystemProgress,
    start,
    restart,
    showEcosystemSelection,
    togglePauseMenu
  } = useGameState();
  const { isMuted, toggleMute } = useAudio();
  const [subscribe, get] = useKeyboardControls<Controls>();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(false);

  // Show tutorial on first level
  useEffect(() => {
    if (gamePhase === 'playing' && currentLevel === 1 && score === 0) {
      setShowTutorial(true);
      setTutorialStep(0);
    }
  }, [gamePhase, currentLevel, score]);

  // Handle pause key controls
  useEffect(() => {
    const unsubscribe = subscribe(
      (state) => state.pause,
      (pressed) => {
        if (pressed && gamePhase === 'playing' && !showMiniGame && !showQuiz && !showTutorial) {
          console.log('Pause key pressed - toggling pause menu');
          togglePauseMenu();
        }
      }
    );
    return unsubscribe;
  }, [subscribe, gamePhase, showMiniGame, showQuiz, showTutorial, togglePauseMenu]);

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
    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '5px',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
    transition: 'all 0.3s ease',
    transform: 'translateY(0)'
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
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(33, 37, 41, 0.95))',
          padding: '50px',
          borderRadius: '20px',
          pointerEvents: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '20px', 
            background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            textShadow: '0 4px 8px rgba(76, 175, 80, 0.3)'
          }}>
            🌱 EcoLearn Adventure
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '30px',
            color: '#e0e0e0',
            lineHeight: '1.5'
          }}>
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

  if (gamePhase === 'ecosystem_selection') {
    return <EcosystemSelection />;
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
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))',
          padding: '50px',
          borderRadius: '20px',
          pointerEvents: 'auto',
          boxShadow: '0 20px 60px rgba(76, 175, 80, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '20px', 
            color: 'white',
            fontWeight: '700',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            🎉 Congratulations!
          </h1>
          <p style={{ 
            fontSize: '2rem', 
            marginBottom: '20px',
            color: '#FFD700',
            fontWeight: '600'
          }}>
            Final Score: {score}
          </p>
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '30px',
            color: 'white',
            lineHeight: '1.5'
          }}>
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
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(33, 37, 41, 0.8))',
        padding: '20px',
        borderRadius: '15px',
        pointerEvents: 'auto',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
      }}>
        <div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '700',
            color: '#FFD700',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            Score: {score}
          </div>
          <div style={{ 
            fontSize: '16px',
            color: '#8BC34A',
            fontWeight: '600'
          }}>
            Level {currentLevel}: {currentLevelData?.name}
          </div>
        </div>
        
        <div style={{ maxWidth: '350px', minWidth: '200px' }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <div style={{ 
              fontSize: '16px', 
              color: '#e0e0e0',
              fontWeight: '600'
            }}>
              Inventory:
            </div>
            <button
              className="inventory-toggle-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '4px 10px',
                color: '#8BC34A',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'auto'
              }}
              onClick={() => setIsInventoryExpanded(!isInventoryExpanded)}
            >
              {isInventoryExpanded ? '▼ Less' : '▶ More'}
            </button>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            maxHeight: isInventoryExpanded ? '150px' : '32px',
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative'
          }}>
            {(() => {
              const inventoryItems = Object.entries(inventory);
              const itemsToShow = isInventoryExpanded ? inventoryItems : inventoryItems.slice(0, 3);
              
              return (
                <>
                  {itemsToShow.map(([item, count]) => (
                    <span key={item} style={{ 
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      padding: '4px 12px', 
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      whiteSpace: 'nowrap'
                    }}>
                      {item}: {count}
                    </span>
                  ))}
                  {!isInventoryExpanded && inventoryItems.length > 3 && (
                    <span style={{ 
                      color: '#8BC34A',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      +{inventoryItems.length - 3} more...
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            style={{
              ...buttonStyle, 
              fontSize: '18px', 
              padding: '10px 15px',
              background: 'linear-gradient(135deg, #FFA726, #FF6F00)',
              minWidth: '50px'
            }}
            onClick={() => {
              console.log('Pause button clicked - showing pause menu');
              togglePauseMenu();
            }}
            title="Pause Game (P or Esc)"
          >
            ⏸️
          </button>
          <button 
            style={{
              ...buttonStyle, 
              fontSize: '18px', 
              padding: '10px 15px',
              background: isMuted ? 'linear-gradient(135deg, #f44336, #d32f2f)' : 'linear-gradient(135deg, #2196F3, #1976D2)',
              minWidth: '50px'
            }}
            onClick={toggleMute}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Objectives Panel */}
      <div style={{
        position: 'absolute',
        top: '120px',
        right: '20px',
        width: '300px',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(33, 37, 41, 0.8))',
        padding: '15px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#8BC34A',
          marginBottom: '10px'
        }}>
          Level Objectives:
        </div>
        {objectives?.map((objective, index) => {
          const isScore = objective.type === 'score';
          const current = isScore ? score : (objective.current || 0);
          const target = objective.target as number;
          const progress = Math.min((current / target) * 100, 100);
          const isCompleted = current >= target;
          
          return (
            <div key={index} style={{ marginBottom: '8px' }}>
              <div style={{ 
                fontSize: '13px',
                color: isCompleted ? '#4CAF50' : '#e0e0e0',
                marginBottom: '4px'
              }}>
                {isCompleted ? '✅' : '⭕'} {objective.description}
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                height: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: isCompleted ? 
                    'linear-gradient(90deg, #4CAF50, #8BC34A)' : 
                    'linear-gradient(90deg, #2196F3, #64B5F6)',
                  height: '100%',
                  width: `${progress}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ 
                fontSize: '11px',
                color: '#bbb',
                textAlign: 'right',
                marginTop: '2px'
              }}>
                {current} / {target}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls help */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(33, 37, 41, 0.8))',
        padding: '15px',
        borderRadius: '12px',
        fontSize: '14px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ color: '#8BC34A', fontWeight: '600', marginBottom: '5px' }}>Controls:</div>
        <div style={{ color: '#e0e0e0' }}>WASD / Arrow Keys: Move</div>
        <div style={{ color: '#e0e0e0' }}>E / Space: Interact</div>
        <div style={{ color: '#e0e0e0' }}>J: Jump</div>
      </div>

      {/* Mini-games and quiz overlays */}
      {showMiniGame && <MiniGames />}
      {showQuiz && <Quiz />}
      
      {/* Pause Menu */}
      {showPauseMenu && <PauseMenu />}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay 
          step={tutorialStep}
          onNext={() => setTutorialStep(prev => prev + 1)}
          onSkip={() => setShowTutorial(false)}
          onComplete={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}

function TutorialOverlay({ 
  step, 
  onNext, 
  onSkip, 
  onComplete 
}: { 
  step: number, 
  onNext: () => void, 
  onSkip: () => void,
  onComplete: () => void
}) {
  const tutorialSteps = [
    {
      title: "Welcome to EcoLearn Adventure! 🌱",
      content: "Learn about environmental conservation through fun gameplay! Use WASD or arrow keys to move around the world.",
      position: "center"
    },
    {
      title: "Collect Items 🌿",
      content: "Walk near green plants and yellow energy orbs to collect them. They help you complete objectives!",
      position: "center"
    },
    {
      title: "Interact with Objects 🗂️",
      content: "Look for glowing yellow indicators above recycling bins and quiz stations. Press E or Space to interact when nearby!",
      position: "center"
    },
    {
      title: "Complete Objectives ✅",
      content: "Check the objectives panel on the right to see your progress. Complete all objectives to advance to the next level!",
      position: "center"
    }
  ];

  const currentStep = tutorialSteps[step];
  const isLastStep = step >= tutorialSteps.length - 1;

  if (!currentStep) {
    onComplete();
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))',
        padding: '40px',
        borderRadius: '20px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(76, 175, 80, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          marginBottom: '20px', 
          color: 'white',
          fontWeight: '700'
        }}>
          {currentStep.title}
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: '30px',
          color: 'white',
          lineHeight: '1.6'
        }}>
          {currentStep.content}
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={onSkip}
          >
            Skip Tutorial
          </button>
          
          <button
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#4CAF50',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={isLastStep ? onComplete : onNext}
          >
            {isLastStep ? 'Start Playing!' : 'Next'}
          </button>
        </div>
        
        <div style={{ 
          marginTop: '20px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          Step {step + 1} of {tutorialSteps.length}
        </div>
      </div>
    </div>
  );
}
