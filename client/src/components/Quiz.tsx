import { useState } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { quizQuestions } from "../lib/gameData";

export default function Quiz() {
  const { closeQuiz, addScore, currentLevel } = useGameState();
  const { playSuccess, playHit } = useAudio();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = quizQuestions[currentQuestion];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === question.correctAnswer) {
      playSuccess();
      addScore(question.points);
    } else {
      playHit();
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        closeQuiz();
      }
    }, 2000);
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

  const quizBoxStyle = {
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
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    textAlign: 'left' as const
  };

  return (
    <div style={overlayStyle}>
      <div style={quizBoxStyle}>
        <h2 style={{ marginBottom: '20px' }}>🧠 Environmental Quiz</h2>
        <div style={{ marginBottom: '10px' }}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </div>
        
        <h3 style={{ marginBottom: '20px' }}>{question.question}</h3>

        {!showResult ? (
          <div style={{ textAlign: 'left' }}>
            {question.options.map((option, index) => (
              <button
                key={index}
                style={buttonStyle}
                onClick={() => handleAnswer(option)}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: selectedAnswer === question.correctAnswer ? '#4CAF50' : '#f44336',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect!'}
            </div>
            <p style={{ fontSize: '14px' }}>{question.explanation}</p>
          </div>
        )}

        <button
          style={{...buttonStyle, backgroundColor: '#666', marginTop: '20px'}}
          onClick={closeQuiz}
        >
          Close Quiz
        </button>
      </div>
    </div>
  );
}
