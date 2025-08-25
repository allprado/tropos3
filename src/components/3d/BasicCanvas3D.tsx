import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Suspense } from 'react';
import BasicZone from './BasicZone';
import BasicNorthIndicator from './BasicNorthIndicator';

const LoadingFallback = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '1.2rem',
    textAlign: 'center'
  }}>
    <div>🔄 Carregando Canvas 3D...</div>
  </div>
);

const BasicCanvas3D = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          camera={{ position: [10, 10, 10], fov: 50 }}
          style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)' }}
        >
          {/* Luzes */}
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[15, 8, 5]}
            intensity={0.8}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          
          {/* Controles de câmera */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            dampingFactor={0.1}
            enableDamping
          />
          
          {/* Grid do chão - sem plano sólido, linhas suaves */}
          <Grid 
            renderOrder={-1}
            position={[0, 0, 0]} 
            args={[50, 50]} 
            cellSize={1} 
            cellThickness={0.8}
            cellColor="#888888"
            sectionSize={1}
            sectionThickness={0.8}
            sectionColor="#888888"
            fadeDistance={25}
            fadeStrength={0.5}
          />
          
          {/* Eixos coordenados */}
          <axesHelper args={[5]} />
          
          {/* Indicador do Norte */}
          <BasicNorthIndicator />
          
          {/* Zona básica */}
          <BasicZone position={[0, 0, 0]} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default BasicCanvas3D;
