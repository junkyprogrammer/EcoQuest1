import { useMemo } from "react";
import * as THREE from "three";

export default function Environment() {
  // Pre-calculate positions to avoid Math.random in render
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      positions.push([
        (Math.random() - 0.5) * 80,
        0,
        (Math.random() - 0.5) * 80
      ]);
    }
    return positions;
  }, []);

  const buildingPositions = useMemo(() => {
    return [
      [-20, 0, -20] as [number, number, number],
      [20, 0, -20] as [number, number, number],
      [-20, 0, 20] as [number, number, number],
      [15, 0, 25] as [number, number, number]
    ];
  }, []);

  return (
    <group>
      {/* Trees */}
      {treePositions.map((pos, index) => (
        <group key={`tree-${index}`} position={pos}>
          {/* Tree trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
          {/* Tree foliage */}
          <mesh position={[0, 5, 0]} castShadow>
            <sphereGeometry args={[2, 8, 6]} />
            <meshLambertMaterial color="#228B22" />
          </mesh>
        </group>
      ))}

      {/* Buildings */}
      {buildingPositions.map((pos, index) => (
        <mesh key={`building-${index}`} position={[pos[0], 4, pos[2]]} castShadow receiveShadow>
          <boxGeometry args={[6, 8, 6]} />
          <meshLambertMaterial color={index % 2 === 0 ? "#696969" : "#A0A0A0"} />
        </mesh>
      ))}

      {/* Solar panels on buildings */}
      {buildingPositions.map((pos, index) => (
        <mesh key={`solar-${index}`} position={[pos[0], 8.1, pos[2]]} receiveShadow>
          <boxGeometry args={[5, 0.1, 5]} />
          <meshLambertMaterial color="#001F3F" />
        </mesh>
      ))}
    </group>
  );
}
