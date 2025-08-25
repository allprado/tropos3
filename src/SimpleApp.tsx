import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢 Tropos3D</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Modelagem 3D para EnergyPlus
        </p>
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <p>Aplicação carregada com sucesso! 🎉</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
            Próximo passo: Corrigir importações e carregar canvas 3D
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;
