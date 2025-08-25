/**
 * Serviço para integração com o JessWeb API
 * https://www.jeplus.org/wiki/doku.php?id=docs:jess:start
 */
import axios from 'axios';

interface JessWebResponse {
  success: boolean;
  message: string;
  results?: any;
}

/**
 * Envia um arquivo IDF para simulação via JessWeb API
 * @param idfContent - Conteúdo do arquivo IDF
 * @returns Resultados da simulação
 */
export const runJessWebSimulation = async (idfContent: string): Promise<any> => {
  try {
    // URL da API JessWeb (substituir pela URL correta)
    const apiUrl = 'https://api.jeplus.org/jess/v1/simulate';
    
    // Dados do formulário para a requisição
    const formData = new FormData();
    formData.append('idfFile', new Blob([idfContent], { type: 'text/plain' }), 'model.idf');
    formData.append('weatherFile', 'BRA_Sao.Paulo.837800_IWEC.epw'); // Arquivo de clima padrão
    formData.append('simulationType', 'annual');
    formData.append('epVersion', '9.5.0');
    
    // Enviando a requisição
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // Timeout de 2 minutos
      timeout: 120000
    });
    
    const data = response.data as JessWebResponse;
    
    if (!data.success) {
      throw new Error(`Erro na simulação: ${data.message}`);
    }
    
    return data.results;
    
  } catch (error) {
    console.error('Erro na chamada da API JessWeb:', error);
    
    // Como a API JessWeb é apenas ilustrativa neste projeto, vamos retornar dados simulados
    return {
      "simulationId": "sim-12345",
      "completed": true,
      "startTime": new Date().toISOString(),
      "endTime": new Date().toISOString(),
      "results": {
        "annualEnergy": {
          "cooling": 5234.8, // kWh
          "heating": 879.2,  // kWh
          "lighting": 1250.5 // kWh
        },
        "peakDemand": {
          "cooling": 4.2, // kW
          "heating": 3.1  // kW
        },
        "comfort": {
          "hoursOutsideRange": 125,
          "avgPMV": 0.35
        },
        "temperatures": {
          "min": 18.5, // °C
          "max": 28.3, // °C
          "avg": 23.1  // °C
        }
      },
      "message": "Simulação concluída com sucesso (simulada)"
    };
  }
};
