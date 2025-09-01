import { create } from 'zustand';
import type { Element, Dimensions, Materials, Model } from './types';
import { generateIdf } from './services/idfGenerator';
import { runJessWebSimulation } from './services/jessWebService';

interface Store {
  // Estado
  selectedElement: Element | null;
  dimensions: Dimensions;
  northAngle: number;
  materials: Materials;
  
  // Ações
  setSelectedElement: (element: Element | null) => void;
  setDimensions: (dimensions: Dimensions) => void;
  setNorthAngle: (angle: number) => void;
  setMaterials: (materials: Materials) => void;
  
  // Funções de utilidade
  resetModel: () => void;
  exportToJson: () => void;
  importFromJson: (data: Model) => void;
  exportToIdf: () => void;
  runSimulation: () => void;
}

// Estado inicial
const initialDimensions = {
  width: 5,
  length: 4,
  height: 2.5
};

const initialMaterials = {
  wall: 'brick',
  window: 'single_clear',
  surface: 'tile'
};

export const useStore = create<Store>((set, get) => ({
  selectedElement: null,
  dimensions: initialDimensions,
  northAngle: 0, // Radianos
  materials: initialMaterials,
  
  // Ações
  setSelectedElement: (element) => set({ selectedElement: element }),
  setDimensions: (dimensions) => set({ dimensions }),
  setNorthAngle: (angle) => set({ northAngle: angle }),
  setMaterials: (materials) => set({ materials }),
  
  // Funções de utilidade
  resetModel: () => set({ 
    dimensions: initialDimensions,
    northAngle: 0,
    materials: initialMaterials
  }),
  
  exportToJson: () => {
    const { dimensions, northAngle, materials } = get();
    
    // Cria o modelo para exportação
    const model: Model = {
      zones: [
        {
          id: 'default-zone',
          name: 'Zona Padrão',
          dimensions,
          surfaces: [
            {
              id: 'floor',
              name: 'Piso',
              type: 'floor',
              vertices: [
                [-dimensions.width/2, 0, -dimensions.length/2],
                [dimensions.width/2, 0, -dimensions.length/2],
                [dimensions.width/2, 0, dimensions.length/2],
                [-dimensions.width/2, 0, dimensions.length/2]
              ],
              material: materials.surface
            },
            {
              id: 'ceiling',
              name: 'Teto',
              type: 'ceiling',
              vertices: [
                [-dimensions.width/2, dimensions.height, -dimensions.length/2],
                [dimensions.width/2, dimensions.height, -dimensions.length/2],
                [dimensions.width/2, dimensions.height, dimensions.length/2],
                [-dimensions.width/2, dimensions.height, dimensions.length/2]
              ],
              material: materials.surface
            }
          ],
          walls: [
            // Paredes da zona
          ]
        }
      ],
      northAngle
    };
    
    // Converte para JSON e faz download
    const dataStr = JSON.stringify(model, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'model.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  
  importFromJson: (data) => {
    try {
      if (!data.zones || !data.zones[0] || !data.zones[0].dimensions) {
        throw new Error('Formato de modelo inválido');
      }
      
      const { dimensions } = data.zones[0];
      const northAngle = data.northAngle || 0;
      
      // Extrair materiais se disponíveis
      const materials = { ...initialMaterials };
      
      // Atualizar o estado
      set({ 
        dimensions,
        northAngle,
        materials,
        selectedElement: null
      });
      
    } catch (error) {
      console.error('Erro ao importar modelo:', error);
      alert('Erro ao importar modelo: Formato inválido');
    }
  },
  
  exportToIdf: () => {
    const { dimensions, northAngle, materials } = get();
    
    // Gerar o IDF usando o serviço (usando valores padrão para windowDimensions)
    const defaultWindowDimensions = {
      'window-1': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
      'window-2': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
      'window-3': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
      'window-4': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
    };
    const idfContent = generateIdf(dimensions, northAngle, materials, defaultWindowDimensions, undefined, {}, {});
    
    // Download do arquivo IDF
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(idfContent);
    
    const exportFileDefaultName = 'model.idf';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  
  runSimulation: async () => {
    try {
      const { dimensions, northAngle, materials } = get();
      
      // Gerar o IDF (usando valores padrão para windowDimensions)
      const defaultWindowDimensions = {
        'window-1': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
        'window-2': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
        'window-3': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
        'window-4': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
      };
      const idfContent = generateIdf(dimensions, northAngle, materials, defaultWindowDimensions, undefined, {}, {});
      
      // Executar a simulação via API JessWeb
      const results = await runJessWebSimulation(idfContent);
      
      // Exibir resultados (poderia ser em um modal ou nova aba)
      console.log('Resultados da simulação:', results);
      alert('Simulação concluída com sucesso! Veja os resultados no console.');
      
    } catch (error) {
      console.error('Erro na simulação:', error);
      alert('Erro ao executar a simulação. Veja o console para mais detalhes.');
    }
  }
}));
