import { Box, Edges } from '@react-three/drei';
import type { ReactNode } from 'react';
import { useStore } from '../../store';

interface WallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: {
    width: number;
    height: number;
  };
  children?: ReactNode;
  id: string;
  name: string;
}

const Wall = ({ position, rotation, dimensions, children, id, name }: WallProps) => {
  const { selectedElement, setSelectedElement } = useStore();
  
  // Verificar se esta parede está selecionada
  const isSelected = selectedElement?.type === 'wall' && selectedElement.id === id;
  
  // Material com cor diferente para estado selecionado
  const wallColor = isSelected ? "#9ecae8" : "#e0e0e0";
  
  return (
    <group position={position} rotation={rotation}>
      <Box 
        args={[dimensions.width, dimensions.height, 0.1]} 
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement({ type: 'wall', id, name });
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setSelectedElement({ type: 'wall', id, name });
        }}
      >
        <meshStandardMaterial color={wallColor} />
        <Edges color={isSelected ? "#4a87b9" : "#999"} threshold={15} />
      </Box>
      {children}
    </group>
  );
};

export default Wall;
