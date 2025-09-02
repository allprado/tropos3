import { create } from 'zustand';
import { generateIdf } from './services/idfGenerator';
import { energyPlusService, type SimulationResult } from './services/energyPlusService';
import type { LocationData, OverhangProperties } from './types';

interface Element {
  type: 'building' | 'zone' | 'wall' | 'window' | 'surface';
  id: string;
  name: string;
}

interface Dimensions {
  width: number;
  length: number;
  height: number;
}

interface WindowDimensions {
  width: number;
  height: number;
  sillHeight: number;
  enabled: boolean; // Para habilitar/desabilitar janela
}

interface SurfaceProperties {
  isAdiabatic: boolean;
  windExposure: 'WindExposed' | 'NoWind'; // Apenas se não for adiabática
  sunExposure: 'SunExposed' | 'NoSun'; // Apenas se não for adiabática
}

interface Materials {
  wall: string;
  window: string;
  surface: string;
}

interface Building {
  name: string;
  epwFile: File | null;
  locationData: LocationData | null;
}

interface Zone {
  name: string;
  conditioned: boolean; // true = condicionada, false = ventilação natural
}

interface Store {
  // Estado
  selectedElement: Element | null;
  dimensions: Dimensions;
  windowDimensions: Record<string, WindowDimensions>;
  overhangProperties: Record<string, OverhangProperties>;
  surfaceProperties: Record<string, SurfaceProperties>;
  northAngle: number;
  materials: Materials;
  building: Building;
  zone: Zone;
  
  // Estado da simulação
  currentSimulation: SimulationResult | null;
  simulationHistory: SimulationResult[];
  isSimulating: boolean;
  
  // Estado da UI
  activeRightPanelTab: 'properties' | 'results';
  cameraTarget: { position: [number, number, number]; target: [number, number, number] } | null;
  
  // Ações
  setSelectedElement: (element: Element | null) => void;
  setDimensions: (dimensions: Dimensions) => void;
  setWindowDimensions: (windowId: string, dimensions: WindowDimensions) => void;
  setOverhangProperties: (windowId: string, properties: OverhangProperties) => void;
  setSurfaceProperties: (surfaceId: string, properties: SurfaceProperties) => void;
  setNorthAngle: (angle: number) => void;
  setMaterials: (materials: Materials) => void;
  setBuildingName: (name: string) => void;
  setBuildingEpwFile: (file: File | null) => void;
  setBuildingLocationData: (locationData: LocationData | null) => void;
  setZoneName: (name: string) => void;
  setZoneConditioned: (conditioned: boolean) => void;
  
  // Ações de simulação
  setCurrentSimulation: (simulation: SimulationResult | null) => void;
  addToSimulationHistory: (simulation: SimulationResult) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  
  // Ações da UI
  setActiveRightPanelTab: (tab: 'properties' | 'results') => void;
  setCameraTarget: (target: { position: [number, number, number]; target: [number, number, number] } | null) => void;
  
  // Funções de utilidade
  resetModel: () => void;
  exportToJson: () => void;
  importFromJson: (data: any) => void;
  exportToIdf: () => void;
  runSimulation: () => Promise<void>;
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

const initialBuilding = {
  name: 'Novo Edifício',
  epwFile: null,
  locationData: null
};

const initialZone = {
  name: 'Zona Padrão',
  conditioned: true
};

const initialWindowDimensions = {
  'window-1': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
  'window-2': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
  'window-3': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
  'window-4': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
};

const initialOverhangProperties = {
  'window-1': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
  'window-2': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
  'window-3': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
  'window-4': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
};

const initialSurfaceProperties = {
  'floor': { isAdiabatic: false, windExposure: 'NoWind' as const, sunExposure: 'NoSun' as const },
  'ceiling': { isAdiabatic: false, windExposure: 'NoWind' as const, sunExposure: 'SunExposed' as const },
  'wall-1': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-2': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-3': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-4': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
};

export const useStore = create<Store>((set, get) => ({
  selectedElement: null,
  dimensions: initialDimensions,
  windowDimensions: initialWindowDimensions,
  overhangProperties: initialOverhangProperties,
  surfaceProperties: initialSurfaceProperties,
  northAngle: 0, // Radianos
  materials: initialMaterials,
  building: initialBuilding,
  zone: initialZone,
  
  // Estado da simulação
  currentSimulation: null,
  simulationHistory: [],
  isSimulating: false,
  
  // Estado da UI
  activeRightPanelTab: 'properties',
  cameraTarget: null,
  
  // Ações
  setSelectedElement: (element) => set({ selectedElement: element }),
  setDimensions: (dimensions) => set({ dimensions }),
  setWindowDimensions: (windowId, dimensions) => set({ 
    windowDimensions: { ...get().windowDimensions, [windowId]: dimensions } 
  }),
  setOverhangProperties: (windowId, properties) => set({
    overhangProperties: { ...get().overhangProperties, [windowId]: properties }
  }),
  setSurfaceProperties: (surfaceId, properties) => set({
    surfaceProperties: { ...get().surfaceProperties, [surfaceId]: properties }
  }),
  setNorthAngle: (angle) => set({ northAngle: angle }),
  setMaterials: (materials) => set({ materials }),
  setBuildingName: (name) => set({ building: { ...get().building, name } }),
  setBuildingEpwFile: (file) => set({ building: { ...get().building, epwFile: file } }),
  setBuildingLocationData: (locationData) => set({ building: { ...get().building, locationData } }),
  setZoneName: (name) => set({ zone: { ...get().zone, name } }),
  setZoneConditioned: (conditioned) => set({ zone: { ...get().zone, conditioned } }),
  
  // Ações de simulação
  setCurrentSimulation: (simulation) => set({ currentSimulation: simulation }),
  addToSimulationHistory: (simulation) => set({ 
    simulationHistory: [simulation, ...get().simulationHistory.slice(0, 9)] // Manter apenas 10 últimas
  }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  
  // Ações da UI
  setActiveRightPanelTab: (tab) => set({ activeRightPanelTab: tab }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  
  // Funções de utilidade
  resetModel: () => set({ 
    dimensions: initialDimensions,
    northAngle: 0,
    materials: initialMaterials
  }),
  
  exportToJson: () => {
    const { dimensions, northAngle, materials, building, windowDimensions, overhangProperties, surfaceProperties } = get();
    
    const model = {
      dimensions,
      northAngle,
      materials,
      building,
      windowDimensions,
      overhangProperties,
      surfaceProperties
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
      if (data.dimensions) {
        set({ 
          dimensions: data.dimensions,
          northAngle: data.northAngle || 0,
          materials: data.materials || initialMaterials,
          building: data.building || initialBuilding,
          windowDimensions: data.windowDimensions || initialWindowDimensions,
          overhangProperties: data.overhangProperties || initialOverhangProperties,
          surfaceProperties: data.surfaceProperties || initialSurfaceProperties,
          selectedElement: null
        });
        console.log('✅ Modelo importado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao importar modelo:', error);
      alert('Erro ao importar modelo: Formato inválido');
    }
  },
  
  exportToIdf: () => {
    const { dimensions, northAngle, materials, building, windowDimensions, overhangProperties, surfaceProperties } = get();
    
    // Usar o gerador IDF corrigido com dados de localização se disponíveis
    const idfContent = generateIdf(dimensions, northAngle, materials, windowDimensions, building.locationData || undefined, overhangProperties, surfaceProperties);
    
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(idfContent);
    
    const exportFileDefaultName = `Tropos3D_Model.idf`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  
  runSimulation: async () => {
    const state = get();
    const { dimensions, northAngle, materials, building, windowDimensions, overhangProperties, surfaceProperties } = state;
    
    try {
      // Verificar se o servidor está disponível
      state.setIsSimulating(true);
      // Mudar para a aba de resultados quando iniciar simulação
      state.setActiveRightPanelTab('results');
      
      try {
        await energyPlusService.checkHealth();
      } catch (error) {
        state.setIsSimulating(false);
        alert('Servidor EnergyPlus não está disponível. Verifique se o servidor backend está rodando na porta 3001.');
        return;
      }

      // Gerar conteúdo IDF
      const idfContent = generateIdf(dimensions, northAngle, materials, windowDimensions, building.locationData || undefined, overhangProperties, surfaceProperties);
      
      // Preparar arquivo EPW se disponível
      let epwFile: File | undefined;
      if (building.epwFile) {
        // Usar o arquivo EPW carregado pelo usuário
        epwFile = building.epwFile;
        console.log('📁 Usando arquivo EPW do usuário:', epwFile.name);
      } else {
        console.warn('⚠️ Nenhum arquivo EPW fornecido pelo usuário');
      }

      // Iniciar simulação
      console.log('Iniciando simulação EnergyPlus...');
      const response = await energyPlusService.startSimulation({
        idfContent,
        epwFile
      });

      console.log('Simulação iniciada:', response);

      // Monitorar progresso da simulação
      const result = await energyPlusService.monitorSimulation(
        response.simulationId,
        (simulationUpdate) => {
          state.setCurrentSimulation(simulationUpdate);
          console.log('Status da simulação:', simulationUpdate.status);
        }
      );

      // Simulação finalizada
      state.setCurrentSimulation(result);
      state.addToSimulationHistory(result);

      if (result.status === 'completed') {
        alert('✅ Simulação concluída com sucesso! Verifique o painel de resultados.');
      } else if (result.status === 'error') {
        const errorMsg = result.errors?.join('\n') || 'Erro desconhecido';
        alert(`❌ Erro na simulação:\n${errorMsg}`);
      }

    } catch (error) {
      console.error('Erro ao executar simulação:', error);
      alert(`Erro ao executar simulação: ${error}`);
    } finally {
      state.setIsSimulating(false);
    }
  }
}));

export default useStore; 
