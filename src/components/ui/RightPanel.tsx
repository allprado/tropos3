import React, { useState } from 'react';
import PropertiesPanel from './PropertiesPanel';
import SimulationResults from './SimulationResults';
import { BiCog, BiLineChart } from 'react-icons/bi';
import './side-panels.css';

type TabType = 'properties' | 'results';

const RightPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('properties');

  return (
    <div className="side-panel right"
      style={{
        height: '100%',
        backgroundColor: '#fff',
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
      >
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <button 
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: 'none',
            backgroundColor: activeTab === 'properties' ? '#fff' : 'transparent',
            color: activeTab === 'properties' ? '#333' : '#666',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: activeTab === 'properties' ? 600 : 400,
            borderBottom: activeTab === 'properties' ? '2px solid #007acc' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('properties')}
        >
          <BiCog />
          Propriedades
        </button>
        <button 
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: 'none',
            backgroundColor: activeTab === 'results' ? '#fff' : 'transparent',
            color: activeTab === 'results' ? '#333' : '#666',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: activeTab === 'results' ? 600 : 400,
            borderBottom: activeTab === 'results' ? '2px solid #007acc' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('results')}
        >
          <BiLineChart />
          Resultados
        </button>
      </div>
      
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', minWidth: 0, overflow: 'hidden' }}>
          {activeTab === 'properties' && <PropertiesPanel />}
          {activeTab === 'results' && <SimulationResults />}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
