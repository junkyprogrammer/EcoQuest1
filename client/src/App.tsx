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
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setShowCanvas(true);
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
                  gl={(canvas) => {
                    // Custom WebGL renderer factory with robust fallback detection
                    const attrs = {
                      alpha: false,
                      antialias: false,
                      powerPreference: 'low-power' as const,
                      depth: true,
                      stencil: false,
                      preserveDrawingBuffer: false,
                      desynchronized: true,
                      failIfMajorPerformanceCaveat: false
                    };
                    
                    try {
                      // Try WebGL2 first, then WebGL1
                      let context = canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs);
                      
                      if (!context) {
                        console.warn('WebGL context creation failed - falling back to 2D mode');
                        setSupportsWebGL(false);
                        throw new Error('WebGL not supported');
                      }
                      
                      console.log('WebGL context created successfully');
                      setSupportsWebGL(true);
                      
                      const renderer = new THREE.WebGLRenderer({ 
                        canvas, 
                        context: context as WebGLRenderingContext
                      });
                      
                      return renderer;
                    } catch (error) {
                      console.warn('WebGL renderer creation failed:', error);
                      setSupportsWebGL(false);
                      throw error;
                    }
                  }}
                  onCreated={(state) => {
                    console.log('WebGL renderer created successfully - 3D mode active');
                    state.gl.setPixelRatio(1);
                    
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
