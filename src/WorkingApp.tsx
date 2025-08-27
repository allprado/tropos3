import styled from 'styled-components';
import SimpleToolbar from './components/ui/SimpleToolbar';
import BasicCanvas3D from './components/3d/BasicCanvas3D';
import TabbedRightPanel from './components/ui/TabbedRightPanel';
import BasicElementTree from './components/ui/BasicElementTree';

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

const LeftPanelContainer = styled.div`
  width: 250px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const RightPanelContainer = styled.div`
  width: 300px;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const WorkingApp = () => {
  return (
    <AppContainer>
      <SimpleToolbar />
      <MainContent>
        <LeftPanelContainer>
          <BasicElementTree />
        </LeftPanelContainer>
        <CanvasContainer>
          <BasicCanvas3D />
        </CanvasContainer>
        <RightPanelContainer>
          <TabbedRightPanel />
        </RightPanelContainer>
      </MainContent>
    </AppContainer>
  );
};

export default WorkingApp;
