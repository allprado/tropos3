import { useRef, useState } from 'react';
import { Box } from '@react-three/drei';
import { useStore } from '../../store';
import { Mesh } from 'three';
import Wall from './Wall';
import Window from './Window';

const Zone = () => {
  const {
    selectedElement,
    setSelectedElement,
    dimensions,
  } = useStore();
  
  const zoneRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const { width, length, height } = dimensions;
  
  // Verificar se a zona está selecionada
  const isSelected = selectedElement?.type === 'zone' && selectedElement.id === 'default-zone';
  
  // Materiais com cores diferentes para estado hover/selecionado
  const floorColor = isSelected ? "#9ecae8" : (hovered ? "#b8d9ee" : "#c9c9c9");
  const ceilingColor = isSelected ? "#9ecae8" : (hovered ? "#b8d9ee" : "#e5e5e5");
  
  return (
    <group position={[0, height / 2, 0]}>
      {/* Piso */}
      <Box 
        args={[width, 0.1, length]} 
        position={[0, -height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement({ type: 'surface', id: 'floor', name: 'Piso' });
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={floorColor} />
      </Box>
      
      {/* Teto */}
      <Box 
        args={[width, 0.1, length]} 
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement({ type: 'surface', id: 'ceiling', name: 'Teto' });
        }}
      >
        <meshStandardMaterial color={ceilingColor} />
      </Box>
      
      {/* Paredes */}
      {/* Parede Norte */}
      <Wall 
        position={[0, 0, -length / 2]} 
        rotation={[0, 0, 0]}
        dimensions={{ width, height }}
        id="north-wall"
        name="Parede Norte"
      >
        <Window 
          position={[0, -height/2 + 1 + 1.1/2, 0.12]} 
          dimensions={{ width: 1.5, height: 1.1 }}
          id="north-window"
          name="Janela Norte"
        />
      </Wall>
      
      {/* Parede Sul */}
      <Wall 
        position={[0, 0, length / 2]} 
        rotation={[0, Math.PI, 0]}
        dimensions={{ width, height }}
        id="south-wall"
        name="Parede Sul"
      >
        <Window 
          position={[0, -height/2 + 1 + 1.1/2, 0.12]} 
          dimensions={{ width: 1.5, height: 1.1 }}
          id="south-window"
          name="Janela Sul"
        />
      </Wall>
      
      {/* Parede Leste */}
      <Wall 
        position={[width / 2, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        dimensions={{ width: length, height }}
        id="east-wall"
        name="Parede Leste"
      >
        <Window 
          position={[0, -height/2 + 1 + 1.1/2, 0.12]} 
          dimensions={{ width: 1.5, height: 1.1 }}
          id="east-window"
          name="Janela Leste"
        />
      </Wall>
      
      {/* Parede Oeste */}
      <Wall 
        position={[-width / 2, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
        dimensions={{ width: length, height }}
        id="west-wall"
        name="Parede Oeste"
      >
        <Window 
          position={[0, -height/2 + 1 + 1.1/2, 0.12]} 
          dimensions={{ width: 1.5, height: 1.1 }}
          id="west-window"
          name="Janela Oeste"
        />
      </Wall>
      
      {/* Zona invisível para seleção */}
      <Box 
        ref={zoneRef}
        args={[width, height, length]} 
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement({ type: 'zone', id: 'default-zone', name: 'Zona Padrão' });
        }}
      >
        <meshStandardMaterial visible={false} />
      </Box>
    </group>
  );
};

export default Zone;
