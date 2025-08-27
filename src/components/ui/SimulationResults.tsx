import React from 'react';
import styled from 'styled-components';
import { useStore } from '../../store-simple';
import { energyPlusService } from '../../services/energyPlusService';

const ResultsContainer = styled.div`
  flex: 1;
  min-width: 0;
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
  min-width: 0;
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
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
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

  // Detectar se estamos em produção (Netlify) onde não há backend
  const isProduction = import.meta.env.PROD && window.location.hostname !== 'localhost';

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

  const handleDownloadFile = async (simulationId: string, fileName: string) => {
    try {
      await energyPlusService.downloadFile(simulationId, fileName);
    } catch (error) {
      alert(`Erro ao baixar arquivo: ${error}`);
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
    <ResultsContainer className="results-container">
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

          {/* Mostrar arquivos para download quando finalizada */}
          {currentSimulation.status === 'completed' && currentSimulation.outputs && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>
                📁 Arquivos Disponíveis:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentSimulation.outputs.err && (
                  <button
                    onClick={() => handleDownloadFile(currentSimulation.id, 'eplusoutout.err')}
                    style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Log (.err)
                  </button>
                )}

                {currentSimulation.outputs.csv && (
                  <button
                    onClick={() => handleDownloadFile(currentSimulation.id, 'eplusoutout.csv')}
                    style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Dados (.csv)
                  </button>
                )}

                {currentSimulation.outputs.html && (
                  <>
                    <button
                      onClick={() => handleDownloadFile(currentSimulation.id, 'eplustblout.htm')}
                      style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                      Relatório (tbl.htm)
                    </button>
                    <button
                      onClick={() => handleDownloadFile(currentSimulation.id, 'eplusoutout.htm')}
                      style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', background: '#0056b3', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                      Relatório (out.htm)
                    </button>
                  </>
                )}
              </div>

              {/* Resumo rápido dos dados de temperatura se CSV presente */}
              {currentSimulation.outputs.csv && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🌡️ Dados de Temperatura:</div>
                  {(() => {
                    const tempData = parseTemperatureData(currentSimulation.outputs.csv as string);
                    if (tempData.length > 0) {
                      const avgTemp = tempData.reduce((sum, d) => sum + d.temperature, 0) / tempData.length;
                      const minTemp = Math.min(...tempData.map(d => d.temperature));
                      const maxTemp = Math.max(...tempData.map(d => d.temperature));

                      return (
                        <div style={{ color: '#666' }}>
                          <div>Média: {avgTemp.toFixed(1)}°C</div>
                          <div>Mín: {minTemp.toFixed(1)}°C | Máx: {maxTemp.toFixed(1)}°C</div>
                          <div>Pontos: {tempData.length}</div>
                        </div>
                      );
                    }
                    return <div style={{ color: '#999' }}>Nenhum dado de temperatura encontrado</div>;
                  })()}
                </div>
              )}
            </div>
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
