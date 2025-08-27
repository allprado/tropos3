import styled from 'styled-components';
import Canvas3D from './components/3d/Canvas3D';
import LeftPanel from './components/ui/LeftPanel';
import RightPanel from './components/ui/RightPanel';
import Toolbar from './components/ui/Toolbar';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;
  color: #333;
  width: 100vw;
  overflow-x: auto;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  min-width: 880px;
  overflow-x: auto;
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  height: 100%;
`;

function App() {
  return (
    <AppContainer>
      <Toolbar />
      <MainContent>
        <LeftPanel />
        <CanvasContainer>
          <Canvas3D />
        </CanvasContainer>
        <RightPanel />
      </MainContent>
    </AppContainer>
  )
}

export default App
