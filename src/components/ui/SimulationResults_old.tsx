import React from 'react';
import styled from 'styled-components';
import { useStore } from '../../store-simple';
import { energyPlusService } from '../../services/energyPlusService';

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

  const handleDownloadFile = async (simulationId: string, fileName: string) => {
    try {
      await energyPlusService.downloadFile(simulationId, fileName);
    } catch (error) {
      alert(`Erro ao baixar arquivo: ${error}`);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'error': return '#dc3545';
      case 'running': return '#007bff';
      case 'queued': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const parseTemperatureData = (csvContent: string) => {
    try {
      return energyPlusService.parseCsvResults(csvContent);
    } catch (error) {
      console.error('Erro ao parsear dados de temperatura:', error);
      return [];
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
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {getStatusIcon(currentSimulation.status)}
            Simulação Atual - {currentSimulation.status.toUpperCase()}
          </h4>

          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '12px', 
            borderRadius: '6px',
            border: `2px solid ${getStatusColor(currentSimulation.status)}`
          }}>
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>
              <strong>ID:</strong> {currentSimulation.id.substring(0, 8)}...
              <br />
              <strong>Duração:</strong> {formatDuration(currentSimulation.startTime, currentSimulation.endTime)}
              <br />
              <strong>Iniciado:</strong> {new Date(currentSimulation.startTime).toLocaleString()}
            </div>

            {currentSimulation.status === 'completed' && currentSimulation.outputs && (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>
                  📁 Arquivos Disponíveis:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {currentSimulation.outputs.err && (
                    <button 
                      onClick={() => handleDownloadFile(currentSimulation.id, 'eplusoutout.err')}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '11px', 
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Log (.err)
                    </button>
                  )}
                  {currentSimulation.outputs.csv && (
                    <button 
                      onClick={() => handleDownloadFile(currentSimulation.id, 'eplusoutout.csv')}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '11px', 
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Dados (.csv)
                    </button>
                  )}
                  {currentSimulation.outputs.html && (
                    <button 
                      onClick={() => handleDownloadFile(currentSimulation.id, 'eplusoutout.htm')}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '11px', 
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Relatório (.html)
                    </button>
                  )}
                </div>

                {/* Mostrar resumo dos dados de temperatura */}
                {currentSimulation.outputs.csv && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                      🌡️ Dados de Temperatura:
                    </div>
                    {(() => {
                      const tempData = parseTemperatureData(currentSimulation.outputs.csv);
                      if (tempData.length > 0) {
                        const avgTemp = tempData.reduce((sum, d) => sum + d.temperature, 0) / tempData.length;
                        const minTemp = Math.min(...tempData.map(d => d.temperature));
                        const maxTemp = Math.max(...tempData.map(d => d.temperature));
                        
                        return (
                          <div style={{ fontSize: '11px', color: '#666' }}>
                            <div>Média: {avgTemp.toFixed(1)}°C</div>
                            <div>Mín: {minTemp.toFixed(1)}°C | Máx: {maxTemp.toFixed(1)}°C</div>
                            <div>Pontos de dados: {tempData.length}</div>
                          </div>
                        );
                      }
                      return <div style={{ fontSize: '11px', color: '#999' }}>Nenhum dado de temperatura encontrado</div>;
                    })()}
                  </div>
                )}
              </div>
            )}

            {currentSimulation.errors && currentSimulation.errors.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#dc3545', fontSize: '12px' }}>
                  ⚠️ Erros:
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#dc3545', 
                  backgroundColor: '#f8d7da', 
                  padding: '6px', 
                  borderRadius: '4px',
                  maxHeight: '80px',
                  overflowY: 'auto'
                }}>
                  {currentSimulation.errors.map((error, index) => (
                    <div key={index} style={{ marginBottom: '2px' }}>
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentSimulation.warnings && currentSimulation.warnings.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#856404', fontSize: '12px' }}>
                  ⚠️ Avisos ({currentSimulation.warnings.length}):
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#856404', 
                  backgroundColor: '#fff3cd', 
                  padding: '6px', 
                  borderRadius: '4px',
                  maxHeight: '60px',
                  overflowY: 'auto'
                }}>
                  {currentSimulation.warnings.slice(0, 3).map((warning, index) => (
                    <div key={index} style={{ marginBottom: '2px' }}>
                      {warning}
                    </div>
                  ))}
                  {currentSimulation.warnings.length > 3 && (
                    <div style={{ fontStyle: 'italic' }}>
                      ...e mais {currentSimulation.warnings.length - 3} avisos
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {simulationHistory.length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            📈 Histórico de Simulações
          </h4>
          {simulationHistory.slice(0, 5).map((sim) => (
            <div 
              key={sim.id} 
              style={{ 
                padding: '8px', 
                marginBottom: '8px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '4px',
                border: `1px solid ${getStatusColor(sim.status)}`,
                fontSize: '11px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {getStatusIcon(sim.status)}
                <span style={{ fontWeight: 'bold' }}>
                  {sim.id.substring(0, 8)}...
                </span>
                <span style={{ color: '#666' }}>
                  {formatDuration(sim.startTime, sim.endTime)}
                </span>
              </div>
              <div style={{ color: '#666', marginTop: '2px' }}>
                {new Date(sim.startTime).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </ResultsContainer>
  );
};

export default SimulationResults;
