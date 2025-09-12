import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/inter";
import Game from "./components/Game";
import GameUI from "./components/GameUI";
import SoundManager from "./components/SoundManager";
import { useGameState } from "./lib/stores/useGameState";

// Define control keys for the game
export enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  interact = 'interact',
  jump = 'jump'
}

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.interact, keys: ["KeyE", "Space"] },
  { name: Controls.jump, keys: ["KeyJ"] },
];

const queryClient = new QueryClient();

// Main App component
function App() {
  const { gamePhase } = useGameState();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        {showCanvas && (
          <KeyboardControls map={controls}>
            <Canvas
              shadows
              camera={{
                position: [0, 8, 12],
                fov: 45,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: true,
                powerPreference: "high-performance"
              }}
            >
              <color attach="background" args={["#87CEEB"]} />
              
              <Suspense fallback={null}>
                <Game />
              </Suspense>
            </Canvas>
            
            <GameUI />
            <SoundManager />
          </KeyboardControls>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
