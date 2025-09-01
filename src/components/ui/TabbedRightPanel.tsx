import React from 'react';
import styled from 'styled-components';
import BasicPropertiesPanel from './BasicPropertiesPanel';
import SimulationResults from './SimulationResults';
import { BiCog, BiLineChart } from 'react-icons/bi';
import { useStore } from '../../store-simple';

const PanelContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const TabHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background-color: ${props => props.$isActive ? '#fff' : 'transparent'};
  color: ${props => props.$isActive ? '#333' : '#666'};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${props => props.$isActive ? 600 : 400};
  border-bottom: ${props => props.$isActive ? '2px solid #007acc' : '2px solid transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isActive ? '#fff' : '#f0f0f0'};
    color: #333;
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const PropertiesWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const TabbedRightPanel: React.FC = () => {
  const { activeRightPanelTab, setActiveRightPanelTab } = useStore();

  return (
    <PanelContainer>
      <TabHeader>
        <TabButton 
          $isActive={activeRightPanelTab === 'properties'}
          onClick={() => setActiveRightPanelTab('properties')}
        >
          <BiCog />
          Propriedades
        </TabButton>
        <TabButton 
          $isActive={activeRightPanelTab === 'results'}
          onClick={() => setActiveRightPanelTab('results')}
        >
          <BiLineChart />
          Resultados
        </TabButton>
      </TabHeader>
      
      <TabContent>
        {activeRightPanelTab === 'properties' && (
          <PropertiesWrapper>
            <BasicPropertiesPanel />
          </PropertiesWrapper>
        )}
        {activeRightPanelTab === 'results' && (
          <SimulationResults />
        )}
      </TabContent>
    </PanelContainer>
  );
};

export default TabbedRightPanel;
