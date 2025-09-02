import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import { Suspense } from 'react';
import BasicZone from './BasicZone';
import BasicNorthIndicator from './BasicNorthIndicator';
import CameraController from './CameraController';

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
          <CameraController />
          <OrbitControls 
            ref={(controls) => {
              if (controls) {
                (window as any).orbitControls = controls;
              }
            }}
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
          
          {/* Sistema de coordenadas CAD customizado */}
          <group position={[-8, 0, 8]}>
            {/* Eixo X - Leste (Vermelho) */}
            <group>
              <mesh position={[0.75, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                <meshBasicMaterial color="#ff0000" />
              </mesh>
              <mesh position={[1.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <coneGeometry args={[0.08, 0.2]} />
                <meshBasicMaterial color="#ff0000" />
              </mesh>
            </group>
            
            {/* Eixo Y - Norte (Verde) - Z negativo no Three.js */}
            <group>
              <mesh position={[0, 0, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                <meshBasicMaterial color="#00ff00" />
              </mesh>
              <mesh position={[0, 0, -1.6]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.08, 0.2]} />
                <meshBasicMaterial color="#00ff00" />
              </mesh>
            </group>
            
            {/* Eixo Z - Cima (Azul) - Y positivo no Three.js */}
            <group>
              <mesh position={[0, 0.75, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                <meshBasicMaterial color="#0000ff" />
              </mesh>
              <mesh position={[0, 1.6, 0]}>
                <coneGeometry args={[0.08, 0.2]} />
                <meshBasicMaterial color="#0000ff" />
              </mesh>
            </group>
            
            {/* Labels dos eixos */}
            <Html position={[2, 0, 0]} center>
              <div style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '0.8rem' }}>X</div>
            </Html>
            <Html position={[0, 0, -2]} center>
              <div style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '0.8rem' }}>Y</div>
            </Html>
            <Html position={[0, 2, 0]} center>
              <div style={{ color: '#0000ff', fontWeight: 'bold', fontSize: '0.8rem' }}>Z</div>
            </Html>
          </group>
          
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
