import styled from 'styled-components';
import { useStore } from '../../store-simple';
import { 
  BiCube, 
  BiLayer, 
  BiWindow, 
  BiRectangle, 
  BiEdit,
  BiRuler,
  BiBuilding
} from 'react-icons/bi';

const PanelContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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
  
  &:focus {
    outline: none;
    border-color: #4a87b9;
    box-shadow: 0 0 0 2px rgba(74, 135, 185, 0.2);
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
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

const BasicPropertiesPanel = () => {
  const { 
    selectedElement, 
    dimensions, 
    setDimensions, 
    windowDimensions,
    setWindowDimensions,
    surfaceProperties,
    setSurfaceProperties,
    northAngle, 
    setNorthAngle, 
    materials, 
    setMaterials,
    building,
    setBuildingName,
    setBuildingEpwFile,
    zone,
    setZoneName,
    setZoneConditioned
  } = useStore();
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.epw')) {
      setBuildingEpwFile(file.name);
    } else {
      alert('Por favor, selecione um arquivo .epw válido');
    }
  };

  const handleSurfacePropertyChange = (
    surfaceId: string,
    property: 'isAdiabatic' | 'windExposure' | 'sunExposure',
    value: boolean | string
  ) => {
    const currentProps = surfaceProperties[surfaceId];
    if (!currentProps) return;

    setSurfaceProperties(surfaceId, {
      ...currentProps,
      [property]: value
    });
  };
  
  if (!selectedElement) {
    return (
      <PanelContainer>
        <NoSelectionMessage>
          <BiEdit size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Clique em um elemento no modelo 3D para editar suas propriedades</p>
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#6c757d'
          }}>
            💡 <strong>Dica:</strong> Use os controles do mouse para navegar:
            <br />• Arrastar: Girar câmera
            <br />• Scroll: Zoom
            <br />• Shift + Arrastar: Mover
          </div>
        </NoSelectionMessage>
      </PanelContainer>
    );
  }
  
  let icon;
  switch (selectedElement.type) {
    case 'building':
      icon = <BiBuilding size={18} />;
      break;
    case 'zone':
      icon = <BiCube size={18} />;
      break;
    case 'wall':
      icon = <BiLayer size={18} />;
      break;
    case 'window':
      icon = <BiWindow size={18} />;
      break;
    case 'surface':
      icon = <BiRectangle size={18} />;
      break;
    default:
      icon = <BiEdit size={18} />;
  }
  
  return (
    <PanelContainer>
      <PanelTitle>Propriedades</PanelTitle>
      
      <PropertyGroup>
        <GroupTitle>
          {icon} {selectedElement.name}
        </GroupTitle>
        
        {/* Nome editável para todos os elementos */}
        <PropertyRow>
          <PropertyLabel>Nome:</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={
              selectedElement.type === 'building' ? building.name : 
              selectedElement.type === 'zone' ? zone.name :
              selectedElement.name
            }
            onChange={(e) => {
              if (selectedElement.type === 'building') {
                setBuildingName(e.target.value);
              } else if (selectedElement.type === 'zone') {
                setZoneName(e.target.value);
              }
              // Para outros elementos, implementar depois se necessário
            }}
          />
        </PropertyRow>

        {selectedElement.type === 'building' && (
          <>
            <PropertyRow>
              <PropertyLabel>Arquivo EPW:</PropertyLabel>
              <div style={{ width: '60%' }}>
                <FileInput 
                  type="file" 
                  accept=".epw"
                  onChange={handleFileChange}
                />
                {building.epwFile && (
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#28a745', 
                    marginTop: '0.3rem' 
                  }}>
                    📁 {building.epwFile}
                  </div>
                )}
              </div>
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

        {selectedElement.type === 'zone' && (
          <>
            <PropertyRow>
              <PropertyLabel>Tipo:</PropertyLabel>
              <PropertySelect 
                value={zone.conditioned ? 'conditioned' : 'natural'}
                onChange={(e) => setZoneConditioned(e.target.value === 'conditioned')}
              >
                <option value="conditioned">Zona Condicionada</option>
                <option value="natural">Ventilação Natural</option>
              </PropertySelect>
            </PropertyRow>
            
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
          </>
        )}
        
        {(selectedElement.type === 'wall' || selectedElement.type === 'surface') && (
          <>
            <PropertyRow>
              <PropertyLabel>Material:</PropertyLabel>
              <PropertySelect 
                value={materials[selectedElement.type === 'wall' ? 'wall' : 'surface']} 
                onChange={(e) => handleMaterialChange(e, selectedElement.type === 'wall' ? 'wall' : 'surface')}
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
            
            <PropertyRow>
              <PropertyLabel>Largura (m):</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={windowDimensions[selectedElement.id]?.width || 1.5} 
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value > 0 && value <= Math.min(dimensions.width, dimensions.length)) {
                    setWindowDimensions(selectedElement.id, {
                      ...windowDimensions[selectedElement.id],
                      width: value
                    });
                  }
                }}
                step="0.1"
                min="0.1"
                max={Math.min(dimensions.width, dimensions.length)}
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Altura (m):</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={windowDimensions[selectedElement.id]?.height || 1.1} 
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const sillHeight = windowDimensions[selectedElement.id]?.sillHeight || 1.0;
                  if (!isNaN(value) && value > 0 && (value + sillHeight) <= dimensions.height) {
                    setWindowDimensions(selectedElement.id, {
                      ...windowDimensions[selectedElement.id],
                      height: value
                    });
                  }
                }}
                step="0.1"
                min="0.1"
                max={dimensions.height - (windowDimensions[selectedElement.id]?.sillHeight || 1.0)}
              />
            </PropertyRow>
            
            <PropertyRow>
              <PropertyLabel>Altura do Peitoril (m):</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={windowDimensions[selectedElement.id]?.sillHeight || 1.0} 
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const windowHeight = windowDimensions[selectedElement.id]?.height || 1.1;
                  if (!isNaN(value) && value >= 0 && (value + windowHeight) <= dimensions.height) {
                    setWindowDimensions(selectedElement.id, {
                      ...windowDimensions[selectedElement.id],
                      sillHeight: value
                    });
                  }
                }}
                step="0.1"
                min="0"
                max={dimensions.height - (windowDimensions[selectedElement.id]?.height || 1.1)}
              />
            </PropertyRow>
          </>
        )}
      </PropertyGroup>
      
      {/* Seção de Propriedades Térmicas - apenas para superfícies e janelas */}
      {(selectedElement.type === 'wall' || selectedElement.type === 'window' || selectedElement.type === 'surface') && (
        <PropertyGroup>
          <GroupTitle>
            <BiRuler size={18} /> Propriedades Térmicas
          </GroupTitle>
          
          <PropertyRow>
            <PropertyLabel>Valor-U (W/m²K):</PropertyLabel>
            <PropertyInput 
              type="number" 
              value={
                selectedElement.type === 'window' 
                  ? (materials.window === 'single_clear' ? 5.8 : 
                     materials.window === 'double_clear' ? 2.8 : 1.6)
                  : selectedElement.type === 'wall'
                  ? (materials.wall === 'brick' ? 2.1 : 
                     materials.wall === 'concrete' ? 3.2 : 
                     materials.wall === 'wood' ? 0.6 : 1.5)
                  : (materials.surface === 'tile' ? 2.5 : 
                     materials.surface === 'wood' ? 0.5 : 
                     materials.surface === 'carpet' ? 0.4 : 2.8)
              }
              step="0.1"
              min="0.1"
              disabled
              style={{ opacity: 0.6 }}
            />
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Condutividade (W/mK):</PropertyLabel>
            <PropertyInput 
              type="number" 
              value={
                selectedElement.type === 'window' ? 0.9 
                  : selectedElement.type === 'wall'
                  ? (materials.wall === 'brick' ? 0.8 : 
                     materials.wall === 'concrete' ? 1.7 : 
                     materials.wall === 'wood' ? 0.12 : 0.25)
                  : (materials.surface === 'tile' ? 1.3 : 
                     materials.surface === 'wood' ? 0.15 : 
                     materials.surface === 'carpet' ? 0.06 : 1.7)
              }
              step="0.01"
              min="0.01"
              disabled
              style={{ opacity: 0.6 }}
            />
          </PropertyRow>
          
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#666', 
            marginTop: '0.5rem',
            fontStyle: 'italic'
          }}>
            * Valores calculados automaticamente baseados no material selecionado
          </div>
        </PropertyGroup>
      )}

      {/* Propriedades de Condições de Contorno */}
      {(selectedElement.type === 'wall' || selectedElement.type === 'surface') && (
        <PropertyGroup>
          <GroupTitle>
            <BiLayer />
            Condições de Contorno
          </GroupTitle>
          
          {surfaceProperties[selectedElement.id] && (
            <>
              <PropertyRow>
                <PropertyLabel>
                  <input
                    type="checkbox"
                    checked={surfaceProperties[selectedElement.id]?.isAdiabatic || false}
                    onChange={(e) => handleSurfacePropertyChange(
                      selectedElement.id, 
                      'isAdiabatic', 
                      e.target.checked
                    )}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Adiabática
                </PropertyLabel>
              </PropertyRow>
              
              {!surfaceProperties[selectedElement.id]?.isAdiabatic && (
                <>
                  <PropertyRow>
                    <PropertyLabel>Exposição ao Vento:</PropertyLabel>
                    <PropertySelect
                      value={surfaceProperties[selectedElement.id]?.windExposure || 'WindExposed'}
                      onChange={(e) => handleSurfacePropertyChange(
                        selectedElement.id,
                        'windExposure',
                        e.target.value
                      )}
                    >
                      <option value="WindExposed">Exposta ao Vento</option>
                      <option value="NoWind">Sem Vento</option>
                    </PropertySelect>
                  </PropertyRow>
                  
                  <PropertyRow>
                    <PropertyLabel>Exposição ao Sol:</PropertyLabel>
                    <PropertySelect
                      value={surfaceProperties[selectedElement.id]?.sunExposure || 'SunExposed'}
                      onChange={(e) => handleSurfacePropertyChange(
                        selectedElement.id,
                        'sunExposure',
                        e.target.value
                      )}
                    >
                      <option value="SunExposed">Exposta ao Sol</option>
                      <option value="NoSun">Sem Sol</option>
                    </PropertySelect>
                  </PropertyRow>
                </>
              )}
            </>
          )}
        </PropertyGroup>
      )}
    </PanelContainer>
  );
};

export default BasicPropertiesPanel;
