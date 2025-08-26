import styled from 'styled-components';
import { 
  BiDownload, 
  BiExport, 
  BiRun, 
  BiCompass, 
  BiReset
} from 'react-icons/bi';
import { useStore } from '../../store-simple';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
`;

const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #4a87b9;
  margin-right: auto;
  display: flex;
  align-items: center;
  
  span {
    color: #333;
    font-weight: 400;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.2rem;
`;

interface ToolButtonProps {
  $primary?: boolean;
}

const ToolButton = styled.button<ToolButtonProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.$primary ? '#4a87b9' : '#f0f0f0'};
  color: ${props => props.$primary ? '#fff' : '#333'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$primary ? '#3a77a9' : '#e0e0e0'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 135, 185, 0.3);
  }
`;

const NorthAngleControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
`;

const AngleInput = styled.input`
  width: 60px;
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

const SimpleToolbar = () => {
  const { northAngle, setNorthAngle, resetModel, exportToJson, exportToIdf, runSimulation } = useStore();
  
  const handleNorthAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setNorthAngle(value * (Math.PI / 180)); // Converter para radianos
    }
  };
  
  return (
    <ToolbarContainer>
      <Logo>
        Tropos<span>3D</span>
      </Logo>
      
      <NorthAngleControl>
        <BiCompass size={18} />
        <AngleInput 
          type="number" 
          value={Math.round(northAngle * (180 / Math.PI))} 
          onChange={handleNorthAngleChange}
          step="5"
          title="Ângulo do Norte (graus)"
        />
      </NorthAngleControl>
      
      <ButtonGroup>
        <ToolButton onClick={resetModel} title="Reiniciar Modelo">
          <BiReset />
        </ToolButton>
        
        <ToolButton onClick={exportToJson} title="Exportar para JSON">
          <BiDownload />
          JSON
        </ToolButton>
        
        <ToolButton onClick={exportToIdf} title="Exportar para IDF (EnergyPlus)">
          <BiExport />
          IDF
        </ToolButton>
        
        <ToolButton $primary onClick={runSimulation} title="Executar Simulação">
          <BiRun />
          Simular
        </ToolButton>
      </ButtonGroup>
    </ToolbarContainer>
  );
};

export default SimpleToolbar;
