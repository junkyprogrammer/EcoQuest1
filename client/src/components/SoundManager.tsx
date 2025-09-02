import { useEffect } from "react";
import { useAudio } from "../lib/stores/useAudio";
import { useGameState } from "../lib/stores/useGameState";

export default function SoundManager() {
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    backgroundMusic,
    isMuted
  } = useAudio();
  const { gamePhase } = useGameState();

  useEffect(() => {
    // Load audio files
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hit = new Audio('/sounds/hit.mp3');
    hit.volume = 0.5;
    setHitSound(hit);

    const success = new Audio('/sounds/success.mp3');
    success.volume = 0.6;
    setSuccessSound(success);

    return () => {
      bgMusic.pause();
      hit.pause();
      success.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  useEffect(() => {
    if (backgroundMusic) {
      if (gamePhase === 'playing' && !isMuted) {
        backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      } else {
        backgroundMusic.pause();
      }
    }
  }, [backgroundMusic, gamePhase, isMuted]);

  return null;
}
