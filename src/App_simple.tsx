import Canvas3D from './components/3d/Canvas3D';
import LeftPanel from './components/ui/LeftPanel';
import RightPanel from './components/ui/RightPanel';
import Toolbar from './components/ui/Toolbar';

function App() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f9f9f9',
      color: '#333',
      overflow: 'hidden'
    }}>
      <div style={{ height: '60px' }}>
        <Toolbar />
      </div>
      
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 60px)',
        width: '100%',
        minWidth: '880px',
        overflowX: 'auto'
      }}>
        {/* Painel Esquerdo - LARGURA FIXA */}
        <div style={{
          width: '280px',
          minWidth: '280px',
          maxWidth: '280px',
          height: '100%',
          flexShrink: 0,
          flexGrow: 0
        }}>
          <LeftPanel />
        </div>
        
        {/* Canvas Central - FLEXÍVEL */}
        <div style={{
          flex: 1,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Canvas3D />
        </div>
        
        {/* Painel Direito - LARGURA FIXA */}
        <div style={{
          width: '300px',
          minWidth: '300px',
          maxWidth: '300px',
          height: '100%',
          flexShrink: 0,
          flexGrow: 0
        }}>
          <RightPanel />
        </div>
      </div>
    </div>
  )
}

export default App
