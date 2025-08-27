import React from 'react';
import ElementTree from './ElementTree';
import './side-panels.css';

const LeftPanel: React.FC = () => {
  return (
    <div className="side-panel left"
      style={{
        height: '100%',
        backgroundColor: '#fff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <ElementTree />
    </div>
  );
};

export default LeftPanel;
