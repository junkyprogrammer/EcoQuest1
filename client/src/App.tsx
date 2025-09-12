import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/inter";
import Game from "./components/Game";
import GameUI from "./components/GameUI";
import SoundManager from "./components/SoundManager";
import Fallback2DGame from "./components/Fallback2DGame";
import { useGameState } from "./lib/stores/useGameState";

// Define control keys for the game
export enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  interact = 'interact',
  jump = 'jump',
  sprint = 'sprint'
}

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.interact, keys: ["KeyE"] },
  { name: Controls.jump, keys: ["KeyJ", "Space"] },
  { name: Controls.sprint, keys: ["ShiftLeft", "ShiftRight"] },
];

const queryClient = new QueryClient();


// Main App component
function App() {
  const { gamePhase } = useGameState();
  const [showCanvas, setShowCanvas] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setShowCanvas(true);
    
    // Preflight WebGL detection
    const testWebGL = () => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
                   testCanvas.getContext('webgl', { failIfMajorPerformanceCaveat: false });
        
        if (gl) {
          // Test basic WebGL functionality
          const ext = gl.getExtension('WEBGL_lose_context');
          ext?.loseContext();
          setSupportsWebGL(true);
          console.log("WebGL preflight check: supported");
        } else {
          setSupportsWebGL(false);
          console.log("WebGL preflight check: not supported");
        }
      } catch (error) {
        setSupportsWebGL(false);
        console.log("WebGL preflight check: error", error);
      }
    };
    
    testWebGL();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        {showCanvas && (
          <KeyboardControls map={controls}>
            {supportsWebGL === false ? (
              // 2D Fallback Mode
              <>
                <Fallback2DGame />
                <GameUI />
                <SoundManager />
              </>
            ) : (
              // 3D WebGL Mode
              <>
                <Canvas
                  dpr={[1, 1]}
                  shadows={false}
                  camera={{
                    position: [0, 8, 12],
                    fov: 45,
                    near: 0.1,
                    far: 1000
                  }}
                  gl={{ 
                    antialias: false, 
                    powerPreference: 'low-power',
                    alpha: false,
                    failIfMajorPerformanceCaveat: false 
                  }}
                  onCreated={(state) => {
                    console.log('WebGL renderer created successfully - 3D mode active');
                    state.gl.setPixelRatio(1);
                    
                    // Add context cleanup on unmount
                    const cleanup = () => {
                      try {
                        const ext = state.gl.getContext().getExtension('WEBGL_lose_context');
                        if (ext) ext.loseContext();
                        state.gl.dispose();
                      } catch (e) {
                        console.warn("WebGL cleanup warning:", e);
                      }
                    };
                    
                    // Handle WebGL context lost
                    state.gl.domElement.addEventListener('webglcontextlost', (event) => {
                      event.preventDefault();
                      console.log("WebGL context lost - switching to 2D fallback");
                      setSupportsWebGL(false);
                    });
                    
                    // Store cleanup for later use
                    (state.gl as any).__cleanup = cleanup;
                    
                    // Add context lost handler with fallback to 2D
                    const canvas = state.gl.domElement;
                    canvas.addEventListener('webglcontextlost', (e) => {
                      e.preventDefault();
                      console.warn('WebGL context lost - switching to 2D fallback');
                      setSupportsWebGL(false);
                    }, { once: true });
                  }}
                  onError={(error) => {
                    console.warn('Canvas error - switching to 2D fallback:', error);
                    setSupportsWebGL(false);
                  }}
                >
                  <color attach="background" args={["#87CEEB"]} />
                  
                  <Suspense fallback={null}>
                    <Game />
                  </Suspense>
                </Canvas>
                
                <GameUI />
                <SoundManager />
              </>
            )}
          </KeyboardControls>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
