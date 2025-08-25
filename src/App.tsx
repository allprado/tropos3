import styled from 'styled-components';
import Canvas3D from './components/3d/Canvas3D';
import PropertiesPanel from './components/ui/PropertiesPanel';
import ElementTree from './components/ui/ElementTree';
import Toolbar from './components/ui/Toolbar';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f9f9f9;
  color: #333;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
`;

const SidePanelContainer = styled.div`
  width: 300px;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

function App() {
  return (
    <AppContainer>
      <Toolbar />
      <MainContent>
        <CanvasContainer>
          <Canvas3D />
        </CanvasContainer>
        <SidePanelContainer>
          <ElementTree />
          <PropertiesPanel />
        </SidePanelContainer>
      </MainContent>
    </AppContainer>
  )
}

export default App
