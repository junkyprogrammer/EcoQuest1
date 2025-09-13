import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function AgeSelection() {
  const { selectAge } = useGameState();
  const { playSuccess } = useAudio();

  const handleAgeSelect = (ageGroup: string) => {
    playSuccess();
    selectAge(ageGroup);
    console.log(`Selected age group: ${ageGroup}`);
  };

  const ageGroups = [
    {
      id: 'kids',
      label: '👶 Kids (5-8 years)',
      description: 'Simple learning with fun characters and easy challenges',
      color: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
      icon: '🧸',
      difficulty: 'Very Easy'
    },
    {
      id: 'children',
      label: '🧒 Children (9-12 years)', 
      description: 'Interactive adventures with educational games and quizzes',
      color: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
      icon: '🌈',
      difficulty: 'Easy'
    },
    {
      id: 'teens',
      label: '👦 Teens (13-17 years)',
      description: 'Advanced environmental challenges and scientific concepts',
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      icon: '🎯',
      difficulty: 'Medium'
    },
    {
      id: 'adults',
      label: '👨 Adults (18+ years)',
      description: 'Comprehensive environmental education with real-world applications',
      color: 'linear-gradient(135deg, #f093fb, #f5576c)',
      icon: '🎓',
      difficulty: 'Advanced'
    }
  ];

  const buttonStyle = {
    pointerEvents: 'auto' as const,
    padding: '20px 30px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    transform: 'translateY(0)',
    minWidth: '300px',
    textAlign: 'left' as const,
    color: 'white',
    backdropFilter: 'blur(10px)'
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
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'auto',
        maxWidth: '800px',
        width: '90%'
      }}>
        
        {/* Header */}
        <div style={{
          marginBottom: '40px'
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '15px', 
            background: 'linear-gradient(135deg, #4CAF50, #8BC34A, #CDDC39)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            textShadow: '0 4px 8px rgba(76, 175, 80, 0.3)'
          }}>
            🌱 Choose Your Learning Path
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            color: '#e0e0e0',
            lineHeight: '1.5',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Select your age group to get the best educational experience tailored for your learning level!
          </p>
        </div>

        {/* Age Group Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}>
          {ageGroups.map((ageGroup) => (
            <button
              key={ageGroup.id}
              style={{
                ...buttonStyle,
                background: ageGroup.color
              }}
              onClick={() => handleAgeSelect(ageGroup.id)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '2rem', marginRight: '15px' }}>
                  {ageGroup.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '700',
                    marginBottom: '5px'
                  }}>
                    {ageGroup.label}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem',
                    opacity: 0.9,
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    display: 'inline-block'
                  }}>
                    Difficulty: {ageGroup.difficulty}
                  </div>
                </div>
              </div>
              <p style={{ 
                fontSize: '1rem',
                margin: '0',
                opacity: 0.9,
                lineHeight: '1.4'
              }}>
                {ageGroup.description}
              </p>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            margin: '0',
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            💡 Don't worry, you can always adjust the difficulty level later in the game settings!
          </p>
        </div>
      </div>
    </div>
  );
}