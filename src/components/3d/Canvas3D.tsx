import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useStore } from '../../store';
import Zone from './Zone';
import NorthIndicator from './NorthIndicator';

const Canvas3D = () => {
  const { northAngle } = useStore();
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ background: '#f0f0f0' }}
      >
        {/* Luzes */}
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 10, 10]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Controles e grid */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
        <Grid 
          renderOrder={-1}
          position={[0, 0, 0]} 
          args={[100, 100]} 
          cellSize={1} 
          cellThickness={0.5}
          cellColor="#a0a0a0"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#505050"
          fadeDistance={100}
          fadeStrength={1}
        />
        
        {/* Eixos coordenados */}
        <axesHelper args={[5]} />
        
        {/* Indicador do Norte */}
        <NorthIndicator rotation={[0, northAngle, 0]} />
        
        {/* Zona padrão */}
        <Zone />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
