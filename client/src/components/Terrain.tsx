import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");
  
  // Set texture repeat for better visual
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);

  return (
    <group>
      {/* Main ground plane with vibrant stylized grass */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial 
          map={grassTexture} 
          color="#32CD32"  // Vibrant lime green tint
        />
      </mesh>
      
      {/* Add subtle grass pattern overlay for Free Fire style */}
      <mesh position={[0, 0.005, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[98, 98]} />
        <meshBasicMaterial 
          color="#7CFC00" 
          transparent 
          opacity={0.15}
        />
      </mesh>
      
      {/* Path using asphalt texture */}
      <Path />
    </group>
  );
}

function Path() {
  const asphaltTexture = useTexture("/textures/asphalt.png");
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(10, 2);

  return (
    <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 4]} />
      <meshLambertMaterial map={asphaltTexture} />
    </mesh>
  );
}
