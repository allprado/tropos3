import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useStore } from '../../store-simple';

interface BasicZoneProps {
  position?: [number, number, number];
}

const BasicZone = ({ position = [0, 0, 0] }: BasicZoneProps) => {
  const { dimensions, selectedElement, setSelectedElement, windowDimensions } = useStore();
  const { width, length, height } = dimensions;
  
  const floorRef = useRef<Mesh>(null);
  const ceilingRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [lastClick, setLastClick] = useState<{ time: number; target: string } | null>(null);
  
  const handleZoneClick = (e: any) => {
    e.stopPropagation();
    // Clique na zona (fundo) - seleciona a zona
    setSelectedElement({ 
      type: 'zone', 
      id: 'default-zone', 
      name: 'Zona Padrão' 
    });
  };
  
  const handleElementClick = (elementType: string, elementId: string, elementName: string, e: any) => {
    e.stopPropagation();
    
    const now = Date.now();
    const isDoubleClick = lastClick && 
                         lastClick.target === elementId && 
                         (now - lastClick.time) < 300;
    
    if (isDoubleClick) {
      // Duplo clique - seleciona o elemento específico
      setSelectedElement({ 
        type: elementType as 'zone' | 'wall' | 'window' | 'surface', 
        id: elementId, 
        name: elementName 
      });
      setLastClick(null);
    } else {
      // Clique único - agenda possível seleção da zona
      setLastClick({ time: now, target: elementId });
      setTimeout(() => {
        // Se não houve duplo clique, seleciona a zona
        if (lastClick && lastClick.target === elementId && lastClick.time === now) {
          setSelectedElement({ 
            type: 'zone', 
            id: 'default-zone', 
            name: 'Zona Padrão' 
          });
          setLastClick(null);
        }
      }, 300);
    }
  };
  
  const isSelected = (id: string) => selectedElement?.id === id;
  const getSelectionColor = (id: string, hoverColor: string, defaultColor: string) => {
    if (isSelected(id)) return "#ff8c00"; // Cor laranja para seleção
    if (hovered === id) return hoverColor;
    return defaultColor;
  };
  
  return (
    <group position={position} onClick={handleZoneClick}>
      {/* Piso */}
      <mesh 
        ref={floorRef}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => handleElementClick('surface', 'floor', 'Piso', e)}
        onPointerOver={() => setHovered('floor')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial 
          color={getSelectionColor('floor', "#b8d9ee", "#d4d4d4")}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Teto */}
      <mesh 
        ref={ceilingRef}
        position={[0, height, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => handleElementClick('surface', 'ceiling', 'Teto', e)}
        onPointerOver={() => setHovered('ceiling')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial 
          color={getSelectionColor('ceiling', "#b8d9ee", "#e5e5e5")}
          transparent
          opacity={0.8}
          side={2} // DoubleSide
        />
      </mesh>
      
            {/* Parede 1 (Norte - Y positivo) - face plana */}
      <mesh
        position={[0, height / 2, length / 2]}
        castShadow
        onClick={(e) => handleElementClick('wall', 'wall-1', 'Parede Norte', e)}
        onPointerOver={() => setHovered('wall-1')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={getSelectionColor('wall-1', "#b8d9ee", "#e0e0e0")}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Parede 2 (Sul - Y negativo) - face plana */}
      <mesh
        position={[0, height / 2, -length / 2]}
        rotation={[0, Math.PI, 0]}
        castShadow
        onClick={(e) => handleElementClick('wall', 'wall-2', 'Parede Sul', e)}
        onPointerOver={() => setHovered('wall-2')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={getSelectionColor('wall-2', "#b8d9ee", "#e0e0e0")}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Parede 3 (Leste - X positivo) - face plana */}
      <mesh
        position={[width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        onClick={(e) => handleElementClick('wall', 'wall-3', 'Parede Leste', e)}
        onPointerOver={() => setHovered('wall-3')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial 
          color={getSelectionColor('wall-3', "#b8d9ee", "#e0e0e0")}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Parede 4 (Oeste - X negativo) - face plana */}
      <mesh
        position={[-width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        onClick={(e) => handleElementClick('wall', 'wall-4', 'Parede Oeste', e)}
        onPointerOver={() => setHovered('wall-4')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial 
          color={getSelectionColor('wall-4', "#b8d9ee", "#e0e0e0")}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Parede 2 (Sul/trás) - face plana */}
      <mesh
        position={[0, height / 2, length / 2]}
        rotation={[0, Math.PI, 0]}
        castShadow
        onClick={(e) => handleElementClick('wall', 'wall-2', 'Parede 2', e)}
        onPointerOver={() => setHovered('wall-2')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={getSelectionColor('wall-2', "#b8d9ee", "#e0e0e0")}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Parede 3 (Leste/direita) - face plana */}
      <mesh
        position={[width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        onClick={(e) => handleElementClick('wall', 'wall-3', 'Parede 3', e)}
        onPointerOver={() => setHovered('wall-3')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial 
          color={getSelectionColor('wall-3', "#b8d9ee", "#e0e0e0")}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Parede 4 (Oeste/esquerda) - face plana */}
      <mesh
        position={[-width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        onClick={(e) => handleElementClick('wall', 'wall-4', 'Parede 4', e)}
        onPointerOver={() => setHovered('wall-4')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial 
          color={getSelectionColor('wall-4', "#b8d9ee", "#e0e0e0")}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Janelas numeradas - faces planas */}
      {/* Janela 1 (Parede Norte) */}
      <mesh
        position={[0, (windowDimensions['window-1']?.sillHeight || 1.0) + (windowDimensions['window-1']?.height || 1.1) / 2, length / 2 + 0.01]}
        onClick={(e) => handleElementClick('window', 'window-1', 'Janela Norte', e)}
        onPointerOver={() => setHovered('window-1')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[windowDimensions['window-1']?.width || 1.5, windowDimensions['window-1']?.height || 1.1]} />
        <meshPhysicalMaterial 
          color={getSelectionColor('window-1', "#87ceeb", "#4682b4")}
          transparent 
          opacity={0.6}
          roughness={0}
          metalness={0.3}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Janela 2 (Parede Sul) */}
      <mesh
        position={[0, (windowDimensions['window-2']?.sillHeight || 1.0) + (windowDimensions['window-2']?.height || 1.1) / 2, -length / 2 - 0.01]}
        onClick={(e) => handleElementClick('window', 'window-2', 'Janela Sul', e)}
        onPointerOver={() => setHovered('window-2')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[windowDimensions['window-2']?.width || 1.5, windowDimensions['window-2']?.height || 1.1]} />
        <meshPhysicalMaterial 
          color={getSelectionColor('window-2', "#87ceeb", "#4682b4")}
          transparent 
          opacity={0.6}
          roughness={0}
          metalness={0.3}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Janela 3 (Parede Leste) */}
      <mesh
        position={[width / 2 + 0.01, (windowDimensions['window-3']?.sillHeight || 1.0) + (windowDimensions['window-3']?.height || 1.1) / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => handleElementClick('window', 'window-3', 'Janela Leste', e)}
        onPointerOver={() => setHovered('window-3')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[windowDimensions['window-3']?.width || 1.5, windowDimensions['window-3']?.height || 1.1]} />
        <meshPhysicalMaterial 
          color={getSelectionColor('window-3', "#87ceeb", "#4682b4")}
          transparent 
          opacity={0.6}
          roughness={0}
          metalness={0.3}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Janela 4 (Parede Oeste) */}
      <mesh
        position={[-width / 2 - 0.01, (windowDimensions['window-4']?.sillHeight || 1.0) + (windowDimensions['window-4']?.height || 1.1) / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => handleElementClick('window', 'window-4', 'Janela Oeste', e)}
        onPointerOver={() => setHovered('window-4')}
        onPointerOut={() => setHovered(null)}
      >
        <planeGeometry args={[windowDimensions['window-4']?.width || 1.5, windowDimensions['window-4']?.height || 1.1]} />
        <meshPhysicalMaterial 
          color={getSelectionColor('window-4', "#87ceeb", "#4682b4")}
          transparent 
          opacity={0.6}
          roughness={0}
          metalness={0.3}
          side={2} // DoubleSide
        />
      </mesh>
    </group>
  );
};

export default BasicZone;
