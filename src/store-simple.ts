import { create } from 'zustand';

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
  surfaceProperties: Record<string, SurfaceProperties>;
  northAngle: number;
  materials: Materials;
  building: Building;
  zone: Zone;
  
  // Ações
  setSelectedElement: (element: Element | null) => void;
  setDimensions: (dimensions: Dimensions) => void;
  setWindowDimensions: (windowId: string, dimensions: WindowDimensions) => void;
  setSurfaceProperties: (surfaceId: string, properties: SurfaceProperties) => void;
  setNorthAngle: (angle: number) => void;
  setMaterials: (materials: Materials) => void;
  setBuildingName: (name: string) => void;
  setBuildingEpwFile: (file: string | null) => void;
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
  epwFile: null
};

const initialZone = {
  name: 'Zona Padrão',
  conditioned: true
};

const initialWindowDimensions = {
  'window-1': { width: 1.5, height: 1.1, sillHeight: 1.0 },
  'window-2': { width: 1.5, height: 1.1, sillHeight: 1.0 },
  'window-3': { width: 1.5, height: 1.1, sillHeight: 1.0 },
  'window-4': { width: 1.5, height: 1.1, sillHeight: 1.0 },
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
  setSurfaceProperties: (surfaceId, properties) => set({
    surfaceProperties: { ...get().surfaceProperties, [surfaceId]: properties }
  }),
  setNorthAngle: (angle) => set({ northAngle: angle }),
  setMaterials: (materials) => set({ materials }),
  setBuildingName: (name) => set({ building: { ...get().building, name } }),
  setBuildingEpwFile: (file) => set({ building: { ...get().building, epwFile: file } }),
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
    const { dimensions, northAngle, materials, building, zone, windowDimensions } = get();
    
    // Gerar o IDF básico
    const idfContent = generateBasicIdf(dimensions, northAngle, materials, building, zone, windowDimensions);
    
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(idfContent);
    
    const exportFileDefaultName = `${building.name.replace(/\s+/g, '_')}.idf`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },
  
  runSimulation: async () => {
    alert('Simulação iniciada! (Funcionalidade em desenvolvimento)');
  }
}));

// Função para gerar IDF básico
const generateBasicIdf = (
  dimensions: Dimensions, 
  northAngle: number, 
  materials: Materials, 
  building: Building, 
  zone: Zone, 
  windowDimensions: Record<string, WindowDimensions>
): string => {
  const { width, length, height } = dimensions;
  const northDeg = (northAngle * 180 / Math.PI) % 360;
  
  // Utilitário para formatar números
  const formatNum = (num: number): string => num.toFixed(3);
  
  return `
!---------------------------------------------------------
! Tropos3D - Arquivo IDF para EnergyPlus
! Gerado automaticamente
!---------------------------------------------------------

Version,
  9.5;                                    !- Version Identifier

Building,
  ${building.name},                       !- Name
  ${formatNum(northDeg)},                 !- North Axis {deg}
  City,                                   !- Terrain
  0.04,                                   !- Loads Convergence Tolerance Value {W}
  0.4,                                    !- Temperature Convergence Tolerance Value {deltaC}
  FullInteriorAndExterior,                !- Solar Distribution
  25,                                     !- Maximum Number of Warmup Days
  6;                                      !- Minimum Number of Warmup Days

GlobalGeometryRules,
  UpperLeftCorner,                        !- Starting Vertex Position
  CounterClockWise,                       !- Vertex Entry Direction
  Relative,                               !- Coordinate System
  Relative,                               !- Daylighting Reference Point Coordinate System
  Relative;                               !- Rectangular Surface Coordinate System

Zone,
  ${zone.name},                           !- Name
  0,                                      !- Direction of Relative North {deg}
  0,                                      !- X Origin {m}
  0,                                      !- Y Origin {m}
  0,                                      !- Z Origin {m}
  1,                                      !- Type
  1,                                      !- Multiplier
  ${formatNum(height)},                   !- Ceiling Height {m}
  ${formatNum(width * length * height)}; !- Volume {m3}

${zone.conditioned ? `
! SISTEMA HVAC PARA ZONA CONDICIONADA
ZoneHVAC:EquipmentConnections,
  ${zone.name},                           !- Zone Name
  ${zone.name} Equipment,                 !- Zone Conditioning Equipment List Name
  ${zone.name} Inlet Node,               !- Zone Air Inlet Node or NodeList Name
  ,                                       !- Zone Air Exhaust Node or NodeList Name
  ${zone.name} Zone Air Node,            !- Zone Air Node Name
  ${zone.name} Return Outlet;            !- Zone Return Air Node Name

ZoneHVAC:EquipmentList,
  ${zone.name} Equipment,                 !- Name
  ZoneHVAC:IdealLoadsAirSystem,          !- Zone Equipment 1 Object Type
  ${zone.name} Ideal Loads,              !- Zone Equipment 1 Name
  1,                                      !- Zone Equipment 1 Cooling Sequence
  1;                                      !- Zone Equipment 1 Heating Sequence

ZoneHVAC:IdealLoadsAirSystem,
  ${zone.name} Ideal Loads,              !- Name
  ,                                       !- Availability Schedule Name
  ${zone.name} Inlet Node,               !- Zone Supply Air Node Name
  ,                                       !- Zone Exhaust Air Node Name
  50,                                     !- Maximum Heating Supply Air Temperature {C}
  13,                                     !- Minimum Cooling Supply Air Temperature {C}
  0.015,                                  !- Maximum Heating Supply Air Humidity Ratio {kgWater/kgDryAir}
  0.009,                                  !- Minimum Cooling Supply Air Humidity Ratio {kgWater/kgDryAir}
  NoLimit,                                !- Heating Limit
  autosize,                               !- Maximum Heating Air Flow Rate {m3/s}
  ,                                       !- Maximum Sensible Heating Capacity {W}
  NoLimit,                                !- Cooling Limit
  autosize,                               !- Maximum Cooling Air Flow Rate {m3/s}
  ,                                       !- Maximum Total Cooling Capacity {W}
  ,                                       !- Heating Availability Schedule Name
  ,                                       !- Cooling Availability Schedule Name
  ConstantSupplyHumidityRatio,           !- Dehumidification Control Type
  ,                                       !- Cooling Sensible Heat Ratio {dimensionless}
  ConstantSupplyHumidityRatio,           !- Humidification Control Type
  ,                                       !- Design Specification Outdoor Air Object Name
  ,                                       !- Outdoor Air Inlet Node Name
  ,                                       !- Demand Controlled Ventilation Type
  ,                                       !- Outdoor Air Economizer Type
  ,                                       !- Heat Recovery Type
  ,                                       !- Sensible Heat Recovery Effectiveness {dimensionless}
  ;                                       !- Latent Heat Recovery Effectiveness {dimensionless}
` : `
! VENTILAÇÃO NATURAL PARA ZONA NÃO CONDICIONADA
ZoneVentilation:DesignFlowRate,
  ${zone.name} Ventilation,              !- Name
  ${zone.name},                          !- Zone or ZoneList Name
  ,                                       !- Schedule Name
  DesignFlowRate,                         !- Design Flow Rate Calculation Method
  ${formatNum(width * length * height * 2)}, !- Design Flow Rate {m3/s}
  ,                                       !- Flow Rate per Zone Floor Area {m3/s-m2}
  ,                                       !- Flow Rate per Person {m3/s-person}
  ,                                       !- Air Changes per Hour {1/hr}
  Intake,                                 !- Ventilation Type
  ,                                       !- Fan Pressure Rise {Pa}
  ,                                       !- Fan Total Efficiency {dimensionless}
  ,                                       !- Constant Term Coefficient
  ,                                       !- Temperature Term Coefficient
  ,                                       !- Velocity Term Coefficient
  ,                                       !- Velocity Squared Term Coefficient
  20,                                     !- Minimum Indoor Temperature {C}
  ,                                       !- Minimum Indoor Temperature Schedule Name
  30,                                     !- Maximum Indoor Temperature {C}
  ,                                       !- Maximum Indoor Temperature Schedule Name
  -100,                                   !- Delta Temperature {deltaC}
  ,                                       !- Delta Temperature Schedule Name
  -100,                                   !- Minimum Outdoor Temperature {C}
  ,                                       !- Minimum Outdoor Temperature Schedule Name
  50,                                     !- Maximum Outdoor Temperature {C}
  ,                                       !- Maximum Outdoor Temperature Schedule Name
  40;                                     !- Maximum Wind Speed {m/s}
`}

! SUPERFÍCIES

BuildingSurface:Detailed,
  Floor,                                  !- Name
  Floor,                                  !- Surface Type
  FLOOR-CONSTRUCTION,                     !- Construction Name
  Zone Default,                           !- Zone Name
  Ground,                                 !- Outside Boundary Condition
  ,                                       !- Outside Boundary Condition Object
  NoSun,                                  !- Sun Exposure
  NoWind,                                 !- Wind Exposure
  0.0,                                    !- View Factor to Ground
  4,                                      !- Number of Vertices
  ${formatNum(-width/2)}, ${formatNum(0)}, ${formatNum(-length/2)},  !- X,Y,Z Vertex 1 {m}
  ${formatNum(-width/2)}, ${formatNum(0)}, ${formatNum(length/2)},   !- X,Y,Z Vertex 2 {m}
  ${formatNum(width/2)}, ${formatNum(0)}, ${formatNum(length/2)},    !- X,Y,Z Vertex 3 {m}
  ${formatNum(width/2)}, ${formatNum(0)}, ${formatNum(-length/2)};   !- X,Y,Z Vertex 4 {m}

BuildingSurface:Detailed,
  Ceiling,                                !- Name
  Ceiling,                                !- Surface Type
  CEILING-CONSTRUCTION,                   !- Construction Name
  Zone Default,                           !- Zone Name
  Outdoors,                               !- Outside Boundary Condition
  ,                                       !- Outside Boundary Condition Object
  SunExposed,                             !- Sun Exposure
  WindExposed,                            !- Wind Exposure
  0.0,                                    !- View Factor to Ground
  4,                                      !- Number of Vertices
  ${formatNum(width/2)}, ${formatNum(height)}, ${formatNum(-length/2)},  !- X,Y,Z Vertex 1 {m}
  ${formatNum(width/2)}, ${formatNum(height)}, ${formatNum(length/2)},   !- X,Y,Z Vertex 2 {m}
  ${formatNum(-width/2)}, ${formatNum(height)}, ${formatNum(length/2)},  !- X,Y,Z Vertex 3 {m}
  ${formatNum(-width/2)}, ${formatNum(height)}, ${formatNum(-length/2)}; !- X,Y,Z Vertex 4 {m}

BuildingSurface:Detailed,
  Wall North,                             !- Name
  Wall,                                   !- Surface Type
  WALL-CONSTRUCTION,                      !- Construction Name
  Zone Default,                           !- Zone Name
  Outdoors,                               !- Outside Boundary Condition
  ,                                       !- Outside Boundary Condition Object
  SunExposed,                             !- Sun Exposure
  WindExposed,                            !- Wind Exposure
  0.0,                                    !- View Factor to Ground
  4,                                      !- Number of Vertices
  ${formatNum(-width/2)}, ${formatNum(height)}, ${formatNum(-length/2)},  !- X,Y,Z Vertex 1 {m}
  ${formatNum(-width/2)}, ${formatNum(0)}, ${formatNum(-length/2)},       !- X,Y,Z Vertex 2 {m}
  ${formatNum(width/2)}, ${formatNum(0)}, ${formatNum(-length/2)},        !- X,Y,Z Vertex 3 {m}
  ${formatNum(width/2)}, ${formatNum(height)}, ${formatNum(-length/2)};   !- X,Y,Z Vertex 4 {m}

FenestrationSurface:Detailed,
  Window North,                           !- Name
  Window,                                 !- Surface Type
  WINDOW-CONSTRUCTION,                    !- Construction Name
  Wall North,                             !- Building Surface Name
  ,                                       !- Outside Boundary Condition Object
  0.0,                                    !- View Factor to Ground
  ,                                       !- Frame and Divider Name
  1.0,                                    !- Multiplier
  4,                                      !- Number of Vertices
  ${formatNum(-0.75)}, ${formatNum(2.1)}, ${formatNum(-length/2 + 0.01)},  !- X,Y,Z Vertex 1 {m}
  ${formatNum(-0.75)}, ${formatNum(1.0)}, ${formatNum(-length/2 + 0.01)},  !- X,Y,Z Vertex 2 {m}
  ${formatNum(0.75)}, ${formatNum(1.0)}, ${formatNum(-length/2 + 0.01)},   !- X,Y,Z Vertex 3 {m}
  ${formatNum(0.75)}, ${formatNum(2.1)}, ${formatNum(-length/2 + 0.01)};   !- X,Y,Z Vertex 4 {m}

! CONSTRUÇÕES E MATERIAIS

Material,
  Concrete,                               !- Name
  MediumRough,                            !- Roughness
  0.10,                                   !- Thickness {m}
  1.7,                                    !- Conductivity {W/m-K}
  2300,                                   !- Density {kg/m3}
  920;                                    !- Specific Heat {J/kg-K}

Construction,
  WALL-CONSTRUCTION,                      !- Name
  Concrete;                               !- Outside Layer

Construction,
  FLOOR-CONSTRUCTION,                     !- Name
  Concrete;                               !- Outside Layer

Construction,
  CEILING-CONSTRUCTION,                   !- Name
  Concrete;                               !- Outside Layer

WindowMaterial:Glazing,
  Clear 3mm,                              !- Name
  SpectralAverage,                        !- Optical Data Type
  ,                                       !- Window Glass Spectral Data Set Name
  0.003,                                  !- Thickness {m}
  0.837,                                  !- Solar Transmittance at Normal Incidence
  0.075,                                  !- Front Side Solar Reflectance at Normal Incidence
  0.075,                                  !- Back Side Solar Reflectance at Normal Incidence
  0.898,                                  !- Visible Transmittance at Normal Incidence
  0.081,                                  !- Front Side Visible Reflectance at Normal Incidence
  0.081,                                  !- Back Side Visible Reflectance at Normal Incidence
  0,                                      !- Infrared Transmittance at Normal Incidence
  0.84,                                   !- Front Side Infrared Hemispherical Emissivity
  0.84,                                   !- Back Side Infrared Hemispherical Emissivity
  0.9;                                    !- Conductivity {W/m-K}

Construction,
  WINDOW-CONSTRUCTION,                    !- Name
  Clear 3mm;                              !- Outside Layer

! Arquivo gerado pelo Tropos3D - Materiais: ${JSON.stringify(materials)}
`;
};
