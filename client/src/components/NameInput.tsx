import { useState } from 'react';
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function NameInput() {
  const { setPlayerName } = useGameState();
  const { playSuccess } = useAudio();
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);

  const handleNameSubmit = () => {
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      setShowError(true);
      return;
    }
    
    setShowError(false);
    playSuccess();
    setPlayerName(trimmedName);
    console.log(`Player name set: ${trimmedName}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  const inputStyle = {
    pointerEvents: 'auto' as const,
    padding: '15px 20px',
    fontSize: '1.2rem',
    borderRadius: '12px',
    border: showError ? '2px solid #ff4757' : '2px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    outline: 'none',
    width: '300px',
    maxWidth: '100%',
    textAlign: 'center' as const,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    fontFamily: 'Inter, sans-serif'
  };

  const buttonStyle = {
    pointerEvents: 'auto' as const,
    padding: '15px 30px',
    background: name.trim().length >= 2 
      ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
      : 'linear-gradient(135deg, #888, #666)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: name.trim().length >= 2 ? 'pointer' : 'not-allowed',
    margin: '10px',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
    transition: 'all 0.3s ease',
    transform: 'translateY(0)',
    opacity: name.trim().length >= 2 ? 1 : 0.7
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      zIndex: 100,
      background: 'linear-gradient(135deg, rgba(13, 13, 13, 0.95), rgba(25, 25, 40, 0.95))',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        pointerEvents: 'auto',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(33, 37, 41, 0.8))',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '500px',
        width: '90%'
      }}>
        
        {/* Header */}
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '15px', 
          background: 'linear-gradient(135deg, #4CAF50, #8BC34A, #CDDC39)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '700',
          textShadow: '0 4px 8px rgba(76, 175, 80, 0.3)'
        }}>
          🌱 Welcome, Young Explorer!
        </h1>
        
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '30px',
          color: '#e0e0e0',
          lineHeight: '1.5'
        }}>
          What's your name? We'd love to know who will be saving our planet today!
        </p>

        {/* Name Input */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowError(false);
            }}
            onKeyPress={handleKeyPress}
            style={inputStyle}
            maxLength={20}
            autoFocus
          />
        </div>

        {/* Error Message */}
        {showError && (
          <p style={{
            color: '#ff4757',
            fontSize: '1rem',
            marginBottom: '20px',
            fontWeight: '500'
          }}>
            Please enter a name with at least 2 characters 😊
          </p>
        )}

        {/* Continue Button */}
        <button 
          style={buttonStyle}
          onClick={handleNameSubmit}
          disabled={name.trim().length < 2}
          onMouseOver={(e) => {
            if (name.trim().length >= 2) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          }}
        >
          Continue Adventure 🚀
        </button>

        {/* Footer Hint */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            margin: '0',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            💡 Tip: Press Enter to continue quickly!
          </p>
        </div>
      </div>
    </div>
  );
}