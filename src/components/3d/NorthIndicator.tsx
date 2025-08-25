import { Html } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';

interface NorthIndicatorProps {
  rotation: [number, number, number];
}

const NorthIndicator = ({ rotation }: NorthIndicatorProps) => {
  const northRef = useRef<Mesh>(null);
  
  return (
    <group position={[0, 0.1, 0]} rotation={rotation}>
      {/* Seta do Norte */}
      <mesh ref={northRef} position={[0, 0, -15]}>
        <coneGeometry args={[0.5, 1.5, 32]} />
        <meshStandardMaterial color="#e74c3c" />
        <Html position={[0, 2, 0]} center>
          <div style={{ 
            color: '#e74c3c', 
            fontWeight: 'bold', 
            fontSize: '0.9rem',
            textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
          }}>
            N
          </div>
        </Html>
      </mesh>
    </group>
  );
};

export default NorthIndicator;
