import React from 'react';
import styled from 'styled-components';
import { useStore } from '../../store-simple';

const ResultsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ResultsTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.5rem;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #666;
  font-style: italic;
  line-height: 1.5;
`;

const StatusCard = styled.div<{ status: string }>`
  padding: 1rem;
  background-color: ${props => {
    switch (props.status) {
      case 'running': return '#e3f2fd';
      case 'completed': return '#e8f5e8';
      case 'error': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid ${props => {
    switch (props.status) {
      case 'running': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'error': return '#f44336';
      default: return '#ddd';
    }
  }};
`;

const StatusTitle = styled.div<{ status: string }>`
  font-weight: bold;
  color: ${props => {
    switch (props.status) {
      case 'running': return '#1976d2';
      case 'completed': return '#2e7d32';
      case 'error': return '#c62828';
      default: return '#333';
    }
  }};
  margin-bottom: 0.5rem;
`;

const StatusSubtitle = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const SimulationResults: React.FC = () => {
  const { 
    currentSimulation, 
    simulationHistory, 
    isSimulating 
  } = useStore();

  const formatDuration = (start: string, end?: string) => {
    if (!end) return 'Em andamento...';
    
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'error': return '❌';
      case 'running': return '🔄';
      case 'queued': return '⏳';
      default: return '❓';
    }
  };

  if (!currentSimulation && simulationHistory.length === 0 && !isSimulating) {
    return (
      <EmptyState>
        Nenhuma simulação executada ainda.
        <br />
        Clique em "Simular" para executar uma simulação EnergyPlus.
      </EmptyState>
    );
  }

  return (
    <ResultsContainer>
      <ResultsTitle>
        📊 Resultados da Simulação
      </ResultsTitle>

      {isSimulating && (
        <StatusCard status="running">
          <StatusTitle status="running">
            🔄 Simulação em andamento...
          </StatusTitle>
          <StatusSubtitle>
            Aguarde a conclusão do processamento EnergyPlus
          </StatusSubtitle>
        </StatusCard>
      )}

      {currentSimulation && (
        <StatusCard status={currentSimulation.status || 'completed'}>
          <StatusTitle status={currentSimulation.status || 'completed'}>
            {getStatusIcon(currentSimulation.status || 'completed')} Simulação Atual
          </StatusTitle>
          <StatusSubtitle>
            ID: {currentSimulation.id.substring(0, 8)}...
          </StatusSubtitle>
          {currentSimulation.startTime && (
            <StatusSubtitle>
              Iniciada em: {new Date(currentSimulation.startTime).toLocaleString()}
            </StatusSubtitle>
          )}
        </StatusCard>
      )}

      {simulationHistory.length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
            📈 Histórico de Simulações
          </h4>
          {simulationHistory.slice(0, 5).map((sim) => (
            <StatusCard key={sim.id} status={sim.status}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                {getStatusIcon(sim.status)}
                <span style={{ fontWeight: 'bold' }}>
                  {sim.id.substring(0, 8)}...
                </span>
                <span style={{ color: '#666' }}>
                  {formatDuration(sim.startTime, sim.endTime)}
                </span>
              </div>
              <StatusSubtitle>
                {new Date(sim.startTime).toLocaleString()}
              </StatusSubtitle>
            </StatusCard>
          ))}
        </div>
      )}
    </ResultsContainer>
  );
};

export default SimulationResults;
