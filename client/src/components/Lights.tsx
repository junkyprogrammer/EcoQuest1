import * as THREE from "three";

export default function Lights() {
  return (
    <group>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Main directional light (sun) */}
      <directionalLight
        position={[10, 20, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        color="#FFF8DC"
      />
      
      {/* Fill light to soften shadows */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.3}
        color="#87CEEB"
      />
    </group>
  );
}
