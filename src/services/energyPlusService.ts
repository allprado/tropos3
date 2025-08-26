/**
 * Serviço para comunicação com o servidor EnergyPlus
 */

const API_BASE_URL = '/api';

export interface SimulationResult {
  id: string;
  status: 'running' | 'completed' | 'error' | 'queued';
  startTime: string;
  endTime?: string;
  idfContent?: string;
  epwFile?: string;
  outputs?: {
    err?: string;
    eso?: string;
    csv?: string;
    html?: string;
    svg?: string;
  };
  errors?: string[];
  warnings?: string[];
  logs?: string[];
}

export interface SimulationRequest {
  idfContent: string;
  epwFile?: File;
}

export interface HealthStatus {
  status: string;
  energyplus: boolean;
  timestamp: string;
}

class EnergyPlusService {
  
  /**
   * Verifica o status do servidor EnergyPlus
   */
  async checkHealth(): Promise<HealthStatus> {
    try {
      console.log('🔍 Iniciando verificação de health...');
      console.log('📡 URL:', `${API_BASE_URL}/health`);
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📊 Status da resposta:', response.status);
      console.log('✅ Resposta OK:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📋 Dados recebidos:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro detalhado:', error);
      throw new Error('Servidor EnergyPlus não está disponível');
    }
  }

  /**
   * Inicia uma nova simulação
   */
  async startSimulation(request: SimulationRequest): Promise<{ simulationId: string; status: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('idfContent', request.idfContent);
      
      if (request.epwFile) {
        formData.append('epwFile', request.epwFile);
      }

      const response = await fetch(`${API_BASE_URL}/simulate`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao iniciar simulação:', error);
      throw error;
    }
  }

  /**
   * Consulta o status de uma simulação específica
   */
  async getSimulationStatus(simulationId: string): Promise<SimulationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulation/${simulationId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Simulação não encontrada');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar status da simulação:', error);
      throw error;
    }
  }

  /**
   * Lista todas as simulações
   */
  async listSimulations(): Promise<SimulationResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulations`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar simulações:', error);
      throw error;
    }
  }

  /**
   * Baixa um arquivo de saída da simulação
   */
  async downloadFile(simulationId: string, fileName: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulation/${simulationId}/download/${fileName}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      throw error;
    }
  }

  /**
   * Monitora uma simulação com polling
   */
  async monitorSimulation(
    simulationId: string, 
    onUpdate: (result: SimulationResult) => void,
    interval: number = 2000
  ): Promise<SimulationResult> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const result = await this.getSimulationStatus(simulationId);
          onUpdate(result);

          if (result.status === 'completed' || result.status === 'error') {
            resolve(result);
          } else {
            setTimeout(poll, interval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Extrai dados de temperatura do CSV
   */
  parseCsvResults(csvContent: string): Array<{ time: string; temperature: number; humidity?: number }> {
    try {
      const lines = csvContent.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const tempIndex = headers.findIndex(h => 
        h.toLowerCase().includes('temperature') || 
        h.toLowerCase().includes('zona mean air temperature')
      );
      
      const humidityIndex = headers.findIndex(h => 
        h.toLowerCase().includes('humidity') || 
        h.toLowerCase().includes('relative humidity')
      );

      const timeIndex = headers.findIndex(h => 
        h.toLowerCase().includes('date') || 
        h.toLowerCase().includes('time')
      );

      const results: Array<{ time: string; temperature: number; humidity?: number }> = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length > tempIndex && tempIndex >= 0) {
          const result: any = {
            time: timeIndex >= 0 ? values[timeIndex] : `Hora ${i}`,
            temperature: parseFloat(values[tempIndex]) || 0
          };

          if (humidityIndex >= 0) {
            result.humidity = parseFloat(values[humidityIndex]) || 0;
          }

          results.push(result);
        }
      }

      return results.slice(0, 100); // Limitar a 100 pontos para performance
    } catch (error) {
      console.error('Erro ao parsear CSV:', error);
      return [];
    }
  }
}

export const energyPlusService = new EnergyPlusService();
export default energyPlusService;
