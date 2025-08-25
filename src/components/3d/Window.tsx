import { Box, Edges } from '@react-three/drei';
import { useStore } from '../../store';

interface WindowProps {
  position: [number, number, number];
  dimensions: {
    width: number;
    height: number;
  };
  id: string;
  name: string;
}

const Window = ({ position, dimensions, id, name }: WindowProps) => {
  const { selectedElement, setSelectedElement } = useStore();
  
  // Verificar se esta janela está selecionada
  const isSelected = selectedElement?.type === 'window' && selectedElement.id === id;
  
  // Material com cor diferente para estado selecionado
  const windowColor = isSelected ? "#aed9ff" : "#d4f1ff";
  const frameColor = isSelected ? "#4a87b9" : "#7a7a7a";
  
  return (
    <group position={position}>
      {/* Moldura da janela */}
      <Box 
        args={[dimensions.width + 0.1, dimensions.height + 0.1, 0.05]} 
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement({ type: 'window', id, name });
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setSelectedElement({ type: 'window', id, name });
        }}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>
      
      {/* Vidro da janela */}
      <Box 
        args={[dimensions.width - 0.05, dimensions.height - 0.05, 0.02]} 
        position={[0, 0, 0.02]} 
      >
        <meshPhysicalMaterial 
          color={windowColor} 
          transparent={true} 
          opacity={0.6}
          roughness={0}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
        <Edges color={isSelected ? "#4a87b9" : "#9dc3e6"} threshold={15} />
      </Box>
    </group>
  );
};

export default Window;
