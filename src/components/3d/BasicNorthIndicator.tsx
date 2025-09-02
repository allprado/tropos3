import { Html } from '@react-three/drei';
import { useStore } from '../../store-simple';

const BasicNorthIndicator = () => {
  const { northAngle } = useStore();
  
  return (
    <group position={[0, 0, 0]} rotation={[0, -northAngle, 0]}>
      {/* Seta horizontal apontando para o norte (Z negativo) */}
      <group>
        {/* Haste da seta */}
        <mesh position={[0, 0, -4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 6]} />
          <meshBasicMaterial color="#ff00ff" />
        </mesh>
        
        {/* Ponta da seta - corrigida para apontar na direção certa */}
        <mesh position={[0, 0, -7]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.2, 0.8]} />
          <meshBasicMaterial color="#ff00ff" />
        </mesh>
      </group>
      
      {/* Label do Norte */}
      <Html position={[0, 0.5, -8]} center>
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
