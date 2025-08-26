import { create } from 'zustand';
import { generateIdf, parseEpwLocation } from './services/idfGenerator';
import type { LocationData } from './types';

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

interface OverhangProperties {
  enabled: boolean;
  depth: number; // Profundidade do overhang (para fora da parede)
  extensionLeft: number; // Extensão lateral esquerda
  extensionRight: number; // Extensão lateral direita
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
  epwFile: string | null;
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
  
  // Ações
  setSelectedElement: (element: Element | null) => void;
  setDimensions: (dimensions: Dimensions) => void;
  setWindowDimensions: (windowId: string, dimensions: WindowDimensions) => void;
  setOverhangProperties: (windowId: string, properties: OverhangProperties) => void;
  setSurfaceProperties: (surfaceId: string, properties: SurfaceProperties) => void;
  setNorthAngle: (angle: number) => void;
  setMaterials: (materials: Materials) => void;
  setBuildingName: (name: string) => void;
  setBuildingEpwFile: (file: string | null) => void;
  setBuildingLocationData: (locationData: LocationData | null) => void;
  setZoneName: (name: string) => void;
  setZoneConditioned: (conditioned: boolean) => void;
  
  // Funções de utilidade
  resetModel: () => void;
  exportToJson: () => void;
  importFromJson: (data: any) => void;
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
  
  // Funções de utilidade
  resetModel: () => set({ 
    dimensions: initialDimensions,
    northAngle: 0,
    materials: initialMaterials
  }),
  
  exportToJson: () => {
    const { dimensions, northAngle, materials } = get();
    
    const model = {
      dimensions,
      northAngle,
      materials
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
          selectedElement: null
        });
      }
    } catch (error) {
      console.error('Erro ao importar modelo:', error);
      alert('Erro ao importar modelo: Formato inválido');
    }
  },
  
  exportToIdf: () => {
    const { dimensions, northAngle, materials, building, windowDimensions } = get();
    
    // Usar o gerador IDF corrigido com dados de localização se disponíveis
    const idfContent = generateIdf(dimensions, northAngle, materials, windowDimensions, building.locationData || undefined);
    
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(idfContent);
    
    const exportFileDefaultName = `Tropos3D_Model.idf`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  
  runSimulation: async () => {
    alert('Simulação iniciada! (Funcionalidade em desenvolvimento)');
  }
}));

export default useStore; 
