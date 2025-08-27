import styled from 'styled-components';
import { useStore } from '../../store';
import { 
  BiCube, 
  BiLayer, 
  BiWindow, 
  BiRuler, 
  BiEdit 
} from 'react-icons/bi';

const PanelContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  box-sizing: border-box;
`;

const PanelTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.5rem;
`;

const PropertyGroup = styled.div`
  margin-bottom: 1rem;
`;

const GroupTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PropertyRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const PropertyLabel = styled.label`
  width: 40%;
  font-size: 0.9rem;
  color: #666;
`;

const PropertyInput = styled.input`
  width: 60%;
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
  word-break: break-word;
  
  &:focus {
    outline: none;
    border-color: #4a87b9;
    box-shadow: 0 0 0 2px rgba(74, 135, 185, 0.2);
  }
`;

const PropertySelect = styled.select`
  width: 60%;
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
  word-break: break-word;
  
  &:focus {
    outline: none;
    border-color: #4a87b9;
    box-shadow: 0 0 0 2px rgba(74, 135, 185, 0.2);
  }
`;

const NoSelectionMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  font-size: 0.95rem;
  text-align: center;
  padding: 2rem;
`;

const PropertiesPanel = () => {
  const { selectedElement, dimensions, setDimensions, northAngle, setNorthAngle, materials, setMaterials } = useStore();
  
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, dimension: string) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setDimensions({
        ...dimensions,
        [dimension]: value
      });
    }
  };

  const handleNorthAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setNorthAngle(value * (Math.PI / 180)); // Converter para radianos
    }
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>, elementType: string) => {
    const value = e.target.value;
    setMaterials({
      ...materials,
      [elementType]: value
    });
  };
  
  if (!selectedElement) {
    return (
      <PanelContainer>
        <NoSelectionMessage>
          <BiEdit size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Selecione um elemento no modelo para editar suas propriedades</p>
        </NoSelectionMessage>
      </PanelContainer>
    );
  }
  
  let icon;
  switch (selectedElement.type) {
    case 'zone':
      icon = <BiCube size={18} />;
      break;
    case 'wall':
      icon = <BiLayer size={18} />;
      break;
    case 'window':
      icon = <BiWindow size={18} />;
      break;
    default:
      icon = <BiEdit size={18} />;
  }
  
  return (
    <PanelContainer className="properties-container">
      <PanelTitle>Propriedades</PanelTitle>
      
      <PropertyGroup>
        <GroupTitle>
          {icon} {selectedElement.name}
        </GroupTitle>
        
        {selectedElement.type === 'zone' && (
          <>
            <PropertyRow>
              <PropertyLabel>Largura (m):</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={dimensions.width} 
                onChange={(e) => handleDimensionChange(e, 'width')}
                step="0.1"
                min="0.1"
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Comprimento (m):</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={dimensions.length} 
                onChange={(e) => handleDimensionChange(e, 'length')}
                step="0.1"
                min="0.1"
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Altura (m):</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={dimensions.height} 
                onChange={(e) => handleDimensionChange(e, 'height')}
                step="0.1"
                min="0.1"
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Norte (graus):</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={Math.round(northAngle * (180 / Math.PI))} 
                onChange={handleNorthAngleChange}
                step="5"
              />
            </PropertyRow>
          </>
        )}
        
        {(selectedElement.type === 'wall' || selectedElement.type === 'surface') && (
          <>
            <PropertyRow>
              <PropertyLabel>Material:</PropertyLabel>
              <PropertySelect 
                value={materials[selectedElement.type]} 
                onChange={(e) => handleMaterialChange(e, selectedElement.type)}
              >
                {selectedElement.type === 'wall' ? (
                  <>
                    <option value="brick">Tijolo</option>
                    <option value="concrete">Concreto</option>
                    <option value="wood">Madeira</option>
                    <option value="drywall">Drywall</option>
                  </>
                ) : (
                  <>
                    <option value="tile">Cerâmica</option>
                    <option value="wood">Madeira</option>
                    <option value="carpet">Carpete</option>
                    <option value="concrete">Concreto</option>
                  </>
                )}
              </PropertySelect>
            </PropertyRow>
          </>
        )}
        
        {selectedElement.type === 'window' && (
          <>
            <PropertyRow>
              <PropertyLabel>Material:</PropertyLabel>
              <PropertySelect 
                value={materials.window} 
                onChange={(e) => handleMaterialChange(e, 'window')}
              >
                <option value="single_clear">Vidro Simples</option>
                <option value="double_clear">Vidro Duplo</option>
                <option value="low_e">Vidro Low-E</option>
              </PropertySelect>
            </PropertyRow>
          </>
        )}
      </PropertyGroup>
      
      {/* Seção de Propriedades Térmicas */}
      <PropertyGroup>
        <GroupTitle>
          <BiRuler size={18} /> Propriedades Térmicas
        </GroupTitle>
        
        <PropertyRow>
          <PropertyLabel>Valor-U (W/m²K):</PropertyLabel>
          <PropertyInput 
            type="number" 
            value={selectedElement.type === 'window' ? 2.8 : 0.5} 
            step="0.1"
            min="0.1"
            disabled
          />
        </PropertyRow>
      </PropertyGroup>
    </PanelContainer>
  );
};

export default PropertiesPanel;
