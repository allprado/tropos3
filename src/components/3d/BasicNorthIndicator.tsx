import { Html } from '@react-three/drei';
import { useStore } from '../../store-simple';
import { BufferGeometry, Vector3 } from 'three';
import { useMemo } from 'react';

const BasicNorthIndicator = () => {
  const { northAngle } = useStore();
  
  // Criar a geometria da linha
  const lineGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const points = [
      new Vector3(0, 0, 0),      // Origem
      new Vector3(0, 0, -10)     // Direção norte (10 metros)
    ];
    geometry.setFromPoints(points);
    return geometry;
  }, []);
  
  return (
    <group position={[0, 0, 0]} rotation={[0, northAngle, 0]}>
      {/* Linha magenta indicando o norte */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#ff00ff" linewidth={3} />
      </line>
      
      {/* Label do Norte */}
      <Html position={[0, 0.5, -10]} center>
        <div style={{ 
          color: '#ff00ff', 
          fontWeight: 'bold', 
          fontSize: '0.9rem',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          background: 'rgba(255,255,255,0.9)',
          padding: '0.2rem 0.4rem',
          borderRadius: '3px',
          border: '1px solid #ff00ff'
        }}>
          N
        </div>
      </Html>
    </group>
  );
};

export default BasicNorthIndicator;
