/**
 * Serviço para geração de arquivos IDF para o EnergyPlus
 */
import type { Dimensions, Materials, LocationData, OverhangProperties, SurfaceProperties } from '../types';

// Interface para dimensões das janelas
interface WindowDimensions {
  width: number;
  height: number;
  sillHeight: number;
  enabled: boolean;
}

/**
 * Extrai dados de localização de um arquivo EPW
 * @param epwContent - Conteúdo do arquivo EPW como string
 * @returns Dados de localização extraídos
 */
export const parseEpwLocation = (epwContent: string): LocationData | null => {
  try {
    const lines = epwContent.split('\n');
    // A linha LOCATION é geralmente a primeira linha do EPW
    const locationLine = lines.find(line => line.startsWith('LOCATION'));
    
    if (!locationLine) {
      return null;
    }
    
    // Formato típico: LOCATION,Name,State,Country,Source,WMO#,Latitude,Longitude,TimeZone,Elevation
    const parts = locationLine.split(',');
    
    if (parts.length >= 10) {
      return {
        name: parts[1].trim(),
        latitude: parseFloat(parts[6]),
        longitude: parseFloat(parts[7]), 
        timezone: parseFloat(parts[8]),
        elevation: parseFloat(parts[9])
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao parsear dados de localização do EPW:', error);
    return null;
  }
};

/**
 * Gera um arquivo IDF completo para o EnergyPlus com base nas dimensões do modelo,
 * ângulo do norte e materiais especificados.
 * 
 * @param dimensions - Dimensões da zona
 * @param northAngle - Ângulo do norte em radianos
 * @param materials - Materiais utilizados
 * @param windowDimensions - Dimensões e configurações das janelas
 * @param locationData - Dados de localização do arquivo EPW (opcional)
 * @param overhangProperties - Propriedades dos overhangs (opcional)
 * @param surfaceProperties - Propriedades das superfícies (opcional)
 * @returns Conteúdo do arquivo IDF como string
 */
export const generateIdf = (
  dimensions: Dimensions, 
  northAngle: number, 
  materials: Materials,
  windowDimensions: Record<string, WindowDimensions>,
  locationData?: LocationData,
  overhangProperties?: Record<string, OverhangProperties>,
  surfaceProperties?: Record<string, SurfaceProperties>
): string => {
  const { width, length, height } = dimensions;
  const northDeg = (northAngle * 180 / Math.PI) % 360;
  
  // Utilitário para formatar números
  const formatNum = (num: number): string => num.toFixed(6);
  
  // Calcular coordenadas da zona (centrada na origem)
  const x1 = -width/2;
  const x2 = width/2;
  const y1 = -length/2;
  const y2 = length/2;
  const z1 = 0;
  const z2 = height;
  
  // Mapear materiais para construções no EnergyPlus
  const wallConstruction = materials.wall === 'brick' ? 'Project wall' : 
                           materials.wall === 'concrete' ? 'Concrete Wall' :
                           materials.wall === 'wood' ? 'Wood Wall' : 'Project wall';
                           
  const windowConstruction = materials.window === 'single_clear' ? '1001' : 
                             materials.window === 'double_clear' ? '1001' : '1001';

  // Mapeamento entre IDs das janelas e suas orientações/paredes
  const windowMapping = {
    'window-1': { wall: 'Wall South', orientation: 'south' },
    'window-2': { wall: 'Wall North', orientation: 'north' },
    'window-3': { wall: 'Wall East', orientation: 'east' },
    'window-4': { wall: 'Wall West', orientation: 'west' }
  };

  // Função para gerar um overhang se ele estiver habilitado
  const generateOverhang = (windowId: string): string => {
    const windowData = windowDimensions[windowId];
    const overhangData = overhangProperties?.[windowId];
    const wallInfo = windowMapping[windowId as keyof typeof windowMapping];
    
    if (!windowData || !windowData.enabled || !overhangData || !overhangData.enabled || !wallInfo) {
      return '';
    }

    const { width: windowWidth, height: windowHeight, sillHeight } = windowData;
    const { depth, extensionLeft, extensionRight } = overhangData;
    
    // Altura do topo da janela
    const windowTop = sillHeight + windowHeight;
    
    // Largura total do overhang (janela + extensões)
    const overhangWidth = windowWidth + extensionLeft + extensionRight;
    
    // Calcular vértices do overhang baseado na orientação da parede
    let vertices = '';
    
    switch (wallInfo.orientation) {
      case 'south':
        // Parede Sul (Y negativo)
        vertices = `
    ${formatNum(-overhangWidth/2)}, ${formatNum(y1)}, ${formatNum(windowTop)},        !- Vertex 1
    ${formatNum(overhangWidth/2)}, ${formatNum(y1)}, ${formatNum(windowTop)},         !- Vertex 2
    ${formatNum(overhangWidth/2)}, ${formatNum(y1 - depth)}, ${formatNum(windowTop)}, !- Vertex 3
    ${formatNum(-overhangWidth/2)}, ${formatNum(y1 - depth)}, ${formatNum(windowTop)};!- Vertex 4`;
        break;
      case 'north':
        // Parede Norte (Y positivo)
        vertices = `
    ${formatNum(overhangWidth/2)}, ${formatNum(y2)}, ${formatNum(windowTop)},         !- Vertex 1
    ${formatNum(-overhangWidth/2)}, ${formatNum(y2)}, ${formatNum(windowTop)},        !- Vertex 2
    ${formatNum(-overhangWidth/2)}, ${formatNum(y2 + depth)}, ${formatNum(windowTop)},!- Vertex 3
    ${formatNum(overhangWidth/2)}, ${formatNum(y2 + depth)}, ${formatNum(windowTop)}; !- Vertex 4`;
        break;
      case 'east':
        // Parede Leste (X positivo)
        vertices = `
    ${formatNum(x2)}, ${formatNum(-overhangWidth/2)}, ${formatNum(windowTop)},        !- Vertex 1
    ${formatNum(x2)}, ${formatNum(overhangWidth/2)}, ${formatNum(windowTop)},         !- Vertex 2
    ${formatNum(x2 + depth)}, ${formatNum(overhangWidth/2)}, ${formatNum(windowTop)}, !- Vertex 3
    ${formatNum(x2 + depth)}, ${formatNum(-overhangWidth/2)}, ${formatNum(windowTop)};!- Vertex 4`;
        break;
      case 'west':
        // Parede Oeste (X negativo)
        vertices = `
    ${formatNum(x1)}, ${formatNum(overhangWidth/2)}, ${formatNum(windowTop)},         !- Vertex 1
    ${formatNum(x1)}, ${formatNum(-overhangWidth/2)}, ${formatNum(windowTop)},        !- Vertex 2
    ${formatNum(x1 - depth)}, ${formatNum(-overhangWidth/2)}, ${formatNum(windowTop)},!- Vertex 3
    ${formatNum(x1 - depth)}, ${formatNum(overhangWidth/2)}, ${formatNum(windowTop)}; !- Vertex 4`;
        break;
    }

    return `
! Overhang for Window ${wallInfo.orientation.charAt(0).toUpperCase() + wallInfo.orientation.slice(1)}
Shading:Zone:Detailed,
   Overhang ${wallInfo.orientation.charAt(0).toUpperCase() + wallInfo.orientation.slice(1)}, !- Name
   Zone Default,                                  !- Base Surface
   ,                                              !- Transmittance Schedule Name  
   4,                                             !- Number of Vertices${vertices}
`;
  };

  // Função para obter propriedades da parede baseada no surfaceProperties
  const getWallProperties = (wallId: string) => {
    const props = surfaceProperties?.[wallId];
    if (!props) {
      return {
        outsideFace: 'Outdoors, ,',
        sunExposure: 'SunExposed',
        windExposure: 'WindExposed'
      };
    }

    if (props.isAdiabatic) {
      return {
        outsideFace: 'Adiabatic, ,',
        sunExposure: 'NoSun',
        windExposure: 'NoWind'
      };
    } else {
      return {
        outsideFace: 'Outdoors, ,',
        sunExposure: props.sunExposure || 'SunExposed',
        windExposure: props.windExposure || 'WindExposed'
      };
    }
  };

  // Função para obter propriedades do piso baseada no surfaceProperties
  const getFloorProperties = () => {
    const props = surfaceProperties?.['floor'];
    if (!props) {
      return {
        outsideFace: 'Ground, ,',
        sunExposure: 'NoSun',
        windExposure: 'NoWind'
      };
    }

    if (props.isAdiabatic) {
      return {
        outsideFace: 'Adiabatic, ,',
        sunExposure: 'NoSun',
        windExposure: 'NoWind'
      };
    } else {
      return {
        outsideFace: 'Ground, ,',
        sunExposure: props.sunExposure || 'NoSun',
        windExposure: props.windExposure || 'NoWind'
      };
    }
  };

  // Função para obter propriedades do teto baseada no surfaceProperties
  const getCeilingProperties = () => {
    const props = surfaceProperties?.['ceiling'];
    if (!props) {
      return {
        outsideFace: 'Outdoors, ,',
        sunExposure: 'SunExposed',
        windExposure: 'WindExposed'
      };
    }

    if (props.isAdiabatic) {
      return {
        outsideFace: 'Adiabatic, ,',
        sunExposure: 'NoSun',
        windExposure: 'NoWind'
      };
    } else {
      return {
        outsideFace: 'Outdoors, ,',
        sunExposure: props.sunExposure || 'SunExposed',
        windExposure: props.windExposure || 'WindExposed'
      };
    }
  };

  // Função para gerar uma janela se ela estiver habilitada
  const generateWindow = (windowId: string): string => {
    const windowData = windowDimensions[windowId];
    const wallInfo = windowMapping[windowId as keyof typeof windowMapping];
    
    if (!windowData || !windowData.enabled || !wallInfo) {
      return '';
    }

    const { width: winWidth, height: winHeight, sillHeight } = windowData;
    const halfWidth = winWidth / 2;
    const windowTop = sillHeight + winHeight;

    let vertices = '';
    switch (wallInfo.orientation) {
      case 'south':
        vertices = `
    ${formatNum(-halfWidth)}, ${formatNum(y2)}, ${formatNum(sillHeight)},   !- Vertex 1
    ${formatNum(halfWidth)}, ${formatNum(y2)}, ${formatNum(sillHeight)},    !- Vertex 2
    ${formatNum(halfWidth)}, ${formatNum(y2)}, ${formatNum(windowTop)},     !- Vertex 3
    ${formatNum(-halfWidth)}, ${formatNum(y2)}, ${formatNum(windowTop)};    !- Vertex 4`;
        break;
      case 'north':
        vertices = `
    ${formatNum(halfWidth)}, ${formatNum(y1)}, ${formatNum(sillHeight)},    !- Vertex 1
    ${formatNum(-halfWidth)}, ${formatNum(y1)}, ${formatNum(sillHeight)},   !- Vertex 2
    ${formatNum(-halfWidth)}, ${formatNum(y1)}, ${formatNum(windowTop)},    !- Vertex 3
    ${formatNum(halfWidth)}, ${formatNum(y1)}, ${formatNum(windowTop)};     !- Vertex 4`;
        break;
      case 'east':
        vertices = `
    ${formatNum(x2)}, ${formatNum(-halfWidth)}, ${formatNum(sillHeight)},   !- Vertex 1
    ${formatNum(x2)}, ${formatNum(halfWidth)}, ${formatNum(sillHeight)},    !- Vertex 2
    ${formatNum(x2)}, ${formatNum(halfWidth)}, ${formatNum(windowTop)},     !- Vertex 3
    ${formatNum(x2)}, ${formatNum(-halfWidth)}, ${formatNum(windowTop)};    !- Vertex 4`;
        break;
      case 'west':
        vertices = `
    ${formatNum(x1)}, ${formatNum(halfWidth)}, ${formatNum(sillHeight)},    !- Vertex 1
    ${formatNum(x1)}, ${formatNum(-halfWidth)}, ${formatNum(sillHeight)},   !- Vertex 2
    ${formatNum(x1)}, ${formatNum(-halfWidth)}, ${formatNum(windowTop)},    !- Vertex 3
    ${formatNum(x1)}, ${formatNum(halfWidth)}, ${formatNum(windowTop)};     !- Vertex 4`;
        break;
    }

    return `
! Window ${wallInfo.orientation.charAt(0).toUpperCase() + wallInfo.orientation.slice(1)}
FenestrationSurface:Detailed, Window ${wallInfo.orientation.charAt(0).toUpperCase() + wallInfo.orientation.slice(1)},      !- Window name
   Window,                                        !- Class
   ${windowConstruction},                         !- Construction Name
   ${wallInfo.wall},                              !- Base surface
   ,                                              !- corresponding other window subsurface
   AutoCalculate,                                 !- View Factor to Ground
   ,                                              !- Window shading control
   ,                                              !- Frame divider name
   1,                                             !- Multiplier
   4,                                             !- Number vertices${vertices}
`;
  };
                             
  const floorConstruction = materials.surface === 'tile' ? 'Project ground floor' : 
                           materials.surface === 'carpet' ? 'Floor Carpet' : 'Project ground floor';

  // Usar dados de localização do EPW se disponíveis, senão usar dados padrão
  const location = locationData || {
    name: 'Tropos3D Model',
    latitude: -23.55,
    longitude: -46.64,
    timezone: -3,
    elevation: 720
  };

  // Construir o arquivo IDF
  const idf = `! File generated by Tropos3D
! Generated automatically on ${new Date().toLocaleString()}

Version, 8.9.0.001;                               !- Version Identifier

RunPeriod,                                        !- Annual simulation
   Tropos3D Model,                                !- Location
   1,1,                                           !- Start Month , Day
   12,31,                                         !- End Month , Day
   UseWeatherFile,                                !- will use day as shown in weather file
   No,                                            !- Use weather file holidays/special day periods
   No,                                            !- Use WeatherFile DaylightSavingPeriod
   Yes,                                           !- Apply Weekend Holiday Rule
   Yes,                                           !- use weather file rain indicators
   Yes,                                           !- use weather file snow indicators
   1;                                             !- Number of years in simulation

Site:Location,${location.name},                      !- Location Name
   ${formatNum(location.latitude)},               !- Latitude
   ${formatNum(location.longitude)},              !- Longitude
   ${formatNum(location.timezone)},               !- Time Zone
   ${formatNum(location.elevation)};              !- Elevation {m}

Site:GroundTemperature:BuildingSurface,           !- Annual ground temperatures
   18,18,18,18,18,18,18,18,18,18,18,18;           !- Monthly ground temperatures

SimulationControl,
   No,                                            !- Do the zone sizing calculation
   No,                                            !- Do the system sizing calculation
   No,                                            !- Do the plant sizing calculation
   No,                                            !- Do the design day calculation
   Yes;                                           !- Do the weather file calculation

SizingPeriod:DesignDay, Summer Design Day,        !- Design Day Name
   2,                                             !- Month
   21,                                            !- Day of Month
   SummerDesignDay,                               !- Day Type
   32.0,                                          !- Maximum Dry-Bulb Temperature {C}
   8.0,                                           !- Daily Dry-Bulb Temperature Range {C}
   ,                                              !- Dry-Bulb Temperature Range Modifier Type
   ,                                              !- Dry-Bulb Temperature Range Modifier Schedule
   WetBulb,                                       !- Humidity Condition Type
   25.0,                                          !- Wetbulb at Maximum Dry-Bulb{C}
   ,                                              !- Humidity Condition Day Schedule Name
   ,                                              !- Humidity Ratio at Maximum Dry-Bulb
   ,                                              !- Enthalpy Ratio at Maximum Dry-Bulb
   ,                                              !- Daily Wet-Bulb Temperature Range
   101217.,                                       !- Barometric Pressure {Pa}
   3.0,                                           !- Wind Speed {m/s}
   180,                                           !- Wind Direction {deg}
   No,                                            !- Rain Indicator
   No,                                            !- Snow Indicator
   Yes,                                           !- Daylight Saving Time Indicator
   ASHRAEClearSky,                                !- Solar Model Indicator
   ,                                              !- Beam Solar Day Schedule Name
   ,                                              !- Diffuse Solar Day Schedule Name
   ,                                              !- ASHRAE Clear Sky Optical Depth for Beam Irradiance (taub)
   ,                                              !- ASHRAE Clear Sky Optical Depth for Diffuse Irradiance (taud)
   1.0;                                           !- Sky Clearness

SizingPeriod:DesignDay, Winter Design Day,        !- Design Day Name
   7,                                             !- Month
   21,                                            !- Day of Month
   WinterDesignDay,                               !- Day Type
   18.0,                                          !- Maximum Dry-Bulb Temperature {C}
   8.0,                                           !- Daily Dry-Bulb Temperature Range {C}
   ,                                              !- Dry-Bulb Temperature Range Modifier Type
   ,                                              !- Dry-Bulb Temperature Range Modifier Schedule
   WetBulb,                                       !- Humidity Condition Type
   16.0,                                          !- Wetbulb at Maximum Dry-Bulb{C}
   ,                                              !- Humidity Condition Day Schedule Name
   ,                                              !- Humidity Ratio at Maximum Dry-Bulb
   ,                                              !- Enthalpy Ratio at Maximum Dry-Bulb
   ,                                              !- Daily Wet-Bulb Temperature Range
   101217.,                                       !- Barometric Pressure {Pa}
   2.0,                                           !- Wind Speed {m/s}
   0,                                             !- Wind Direction {deg}
   No,                                            !- Rain Indicator
   No,                                            !- Snow Indicator
   No,                                            !- Daylight Saving Time Indicator
   ASHRAEClearSky,                                !- Solar Model Indicator
   ,                                              !- Beam Solar Day Schedule Name
   ,                                              !- Diffuse Solar Day Schedule Name
   ,                                              !- ASHRAE Clear Sky Optical Depth for Beam Irradiance (taub)
   ,                                              !- ASHRAE Clear Sky Optical Depth for Diffuse Irradiance (taud)
   0.0;                                           !- Sky Clearness

Timestep, 4;                                      !- Timesteps/hour

ScheduleTypeLimits, Any Number;                   !- Not limited
ScheduleTypeLimits, Fraction,     0.0, 1.0, CONTINUOUS;
ScheduleTypeLimits, Temperature,  -60, 200, CONTINUOUS;

Schedule:Compact, 
      On,                                         !- Name
      Any Number,                                 !- Type
      Through: 12/31,                             !- Type
      For: AllDays,                               !- All days in year
      Until: 24:00,                               !- All hours in day
       1;     

Schedule:Compact, 
      Off,                                        !- Name
      Any Number,                                 !- Type
      Through: 12/31,                             !- Type
      For: AllDays,                               !- All days in year
      Until: 24:00,                               !- All hours in day
       0;

! Materials
Material, Concrete,
   Rough,                                         !- Roughness
   .1,                                            !- Thickness {m}
   1.13,                                          !- Conductivity {w/m-K}
   2000,                                          !- Density {kg/m3}
   1000,                                          !- Specific Heat {J/kg-K}
   0.9,                                           !- Thermal Emittance
   0.6,                                           !- Solar Absorptance
   0.6;                                           !- Visible Absorptance

Material, Brick,
   Rough,                                         !- Roughness
   .1,                                            !- Thickness {m}
   0.84,                                          !- Conductivity {w/m-K}
   1700,                                          !- Density {kg/m3}
   800,                                           !- Specific Heat {J/kg-K}
   0.9,                                           !- Thermal Emittance
   0.7,                                           !- Solar Absorptance
   0.7;                                           !- Visible Absorptance

WindowMaterial:Glazing,Clear3mm,                  !- Generic CLEAR 3MM
   SpectralAverage,                               !- Optical data type
   ,                                              !- Name of spectral data set
   .003,                                          !- Thickness {m}
   .837,                                          !- Solar transmittance at normal incidence
   .075,                                          !- Solar reflectance at normal incidence: front side
   .075,                                          !- Solar reflectance at normal incidence: back side
   .898,                                          !- Visible transmittance at normal incidence
   .081,                                          !- Visible reflectance at normal incidence: front side
   .081,                                          !- Visible reflectance at normal incidence: back side
   .0,                                            !- IR transmittance at normal incidence
   .84,                                           !- IR emissivity: front side
   .84,                                           !- IR emissivity: back side
   .9,                                            !- Conductivity {W/m-K}
   1;                                             !- Dirt Correction Factor

WindowMaterial:Gas,Air13mm,                       !- AIR 13MM
   Air,                                           !- Gas type
    .013;                                         !- Thickness {m}

! Constructions
Construction, Project wall,
   Brick;                                         !- Outside Layer

Construction, Project ground floor,
   Concrete;                                      !- Outside Layer

Construction, 1001,                               !- Double glazing
   Clear3mm,                                      !- Outer glass
   Air13mm,                                       !- Air gap
   Clear3mm;                                      !- Inner glass

HeatBalanceAlgorithm, 
   ConductionTransferFunction,                    !- Heat Balance Algorithm
   2000,                                          !- Max Surface Temperature Limit
   0.00000001,                                    !- Minimum Surface Convection Heat Transfer Coefficient
   1000;                                          !- Maximum Surface Convection Heat Transfer Coefficient

ShadowCalculation, AverageOverDaysInFrequency, 20,  15000, SutherlandHodgman, SimpleSkyDiffuseModeling;

SurfaceConvectionAlgorithm:Inside,TARP;           !- Inside Convection Algorithm
SurfaceConvectionAlgorithm:Outside,DOE-2;         !- Outside Convection Algorithm

Building, Tropos3D Building,                     !- Building Name
   ${formatNum(northDeg)},                        !- North Axis
   Suburbs,                                       !- Terrain
    .04,                                          !- Loads Convergence Tolerance
    .4,                                           !- Temperature Convergence Tolerance
   FullExterior,                                  !- Solar Distribution
   25,                                            !- Maximum number of warmup days
   6;                                             !- Minimum number of warmup days

GlobalGeometryRules, LowerLeftCorner, CounterClockWise, Relative;

! Zone Definition
Zone, Zone Default,                               !- Zone Name
   0,                                             !- Relative North (to building)
   0,                                             !- X Origin (M)
   0,                                             !- Y Origin (M)
   0,                                             !- Z Origin (M)
   1 ,                                            !- Zone Type
   1,                                             !- Zone multiplier
   ,                                              !- Zone ceiling height
    ${formatNum(width * length * height)},        !- Zone volume
    ${formatNum(width * length)},                 !- Floor Area
   TARP,                                          !- Zone inside convection algorithm
   ,                                              !- Zone outside convection algorithm
   Yes;                                           !- Part Of Total Floor Area

! Ground floor
BuildingSurface:Detailed,                        !- Surface
   GroundFloor,                                   !- Surface name
   Floor, ${floorConstruction},                   !- Class and Construction Name
   Zone Default,                                  !- Zone Name
   ${getFloorProperties().outsideFace}            !- Outside Face Environment
   ${getFloorProperties().sunExposure},           !- Sun Exposure
   ${getFloorProperties().windExposure},          !- Wind Exposure
   AutoCalculate,                                 !- View Factor to Ground
   4,                                             !- Number vertices
    ${formatNum(x1)}, ${formatNum(y1)}, ${formatNum(z1)},  !- Vertex 1
    ${formatNum(x1)}, ${formatNum(y2)}, ${formatNum(z1)},  !- Vertex 2
    ${formatNum(x2)}, ${formatNum(y2)}, ${formatNum(z1)},  !- Vertex 3
    ${formatNum(x2)}, ${formatNum(y1)}, ${formatNum(z1)};  !- Vertex 4

! Roof
BuildingSurface:Detailed,                        !- Surface
   Roof,                                          !- Surface name
   Roof, ${floorConstruction},                    !- Class and Construction Name
   Zone Default,                                  !- Zone Name
   ${getCeilingProperties().outsideFace}          !- Outside Face Environment
   ${getCeilingProperties().sunExposure},         !- Sun Exposure
   ${getCeilingProperties().windExposure},        !- Wind Exposure
   AutoCalculate,                                 !- View Factor to Ground
   4,                                             !- Number vertices
    ${formatNum(x2)}, ${formatNum(y1)}, ${formatNum(z2)},  !- Vertex 1
    ${formatNum(x2)}, ${formatNum(y2)}, ${formatNum(z2)},  !- Vertex 2
    ${formatNum(x1)}, ${formatNum(y2)}, ${formatNum(z2)},  !- Vertex 3
    ${formatNum(x1)}, ${formatNum(y1)}, ${formatNum(z2)};  !- Vertex 4

! Wall South (Y positive)
BuildingSurface:Detailed,                        !- Surface
   Wall South,                                    !- Surface name
   Wall, ${wallConstruction},                     !- Class and Construction Name
   Zone Default,                                  !- Zone Name
   ${getWallProperties('wall-1').outsideFace}     !- Outside Face Environment
   ${getWallProperties('wall-1').sunExposure},    !- Sun Exposure
   ${getWallProperties('wall-1').windExposure},   !- Wind Exposure
   AutoCalculate,                                 !- View Factor to Ground
   4,                                             !- Number vertices
    ${formatNum(x1)}, ${formatNum(y2)}, ${formatNum(z1)},  !- Vertex 1
    ${formatNum(x2)}, ${formatNum(y2)}, ${formatNum(z1)},  !- Vertex 2
    ${formatNum(x2)}, ${formatNum(y2)}, ${formatNum(z2)},  !- Vertex 3
    ${formatNum(x1)}, ${formatNum(y2)}, ${formatNum(z2)};  !- Vertex 4
${generateWindow('window-1')}${generateOverhang('window-1')}
! Wall North (Y negative)
BuildingSurface:Detailed,                        !- Surface
   Wall North,                                    !- Surface name
   Wall, ${wallConstruction},                     !- Class and Construction Name
   Zone Default,                                  !- Zone Name
   ${getWallProperties('wall-2').outsideFace}     !- Outside Face Environment
   ${getWallProperties('wall-2').sunExposure},    !- Sun Exposure
   ${getWallProperties('wall-2').windExposure},   !- Wind Exposure
   AutoCalculate,                                 !- View Factor to Ground
   4,                                             !- Number vertices
    ${formatNum(x2)}, ${formatNum(y1)}, ${formatNum(z1)},  !- Vertex 1
    ${formatNum(x1)}, ${formatNum(y1)}, ${formatNum(z1)},  !- Vertex 2
    ${formatNum(x1)}, ${formatNum(y1)}, ${formatNum(z2)},  !- Vertex 3
    ${formatNum(x2)}, ${formatNum(y1)}, ${formatNum(z2)};  !- Vertex 4
${generateWindow('window-2')}${generateOverhang('window-2')}

! Wall East (X positive)
BuildingSurface:Detailed,                        !- Surface
   Wall East,                                     !- Surface name
   Wall, ${wallConstruction},                     !- Class and Construction Name
   Zone Default,                                  !- Zone Name
   ${getWallProperties('wall-3').outsideFace}     !- Outside Face Environment
   ${getWallProperties('wall-3').sunExposure},    !- Sun Exposure
   ${getWallProperties('wall-3').windExposure},   !- Wind Exposure
   AutoCalculate,                                 !- View Factor to Ground
   4,                                             !- Number vertices
    ${formatNum(x2)}, ${formatNum(y1)}, ${formatNum(z1)},  !- Vertex 1
    ${formatNum(x2)}, ${formatNum(y2)}, ${formatNum(z1)},  !- Vertex 2
    ${formatNum(x2)}, ${formatNum(y2)}, ${formatNum(z2)},  !- Vertex 3
    ${formatNum(x2)}, ${formatNum(y1)}, ${formatNum(z2)};  !- Vertex 4
${generateWindow('window-3')}${generateOverhang('window-3')}
! Wall West (X negative)
BuildingSurface:Detailed,                        !- Surface
   Wall West,                                     !- Surface name
   Wall, ${wallConstruction},                     !- Class and Construction Name
   Zone Default,                                  !- Zone Name
   ${getWallProperties('wall-4').outsideFace}     !- Outside Face Environment
   ${getWallProperties('wall-4').sunExposure},    !- Sun Exposure
   ${getWallProperties('wall-4').windExposure},   !- Wind Exposure
   AutoCalculate,                                 !- View Factor to Ground
   4,                                             !- Number vertices
    ${formatNum(x1)}, ${formatNum(y2)}, ${formatNum(z1)},  !- Vertex 1
    ${formatNum(x1)}, ${formatNum(y1)}, ${formatNum(z1)},  !- Vertex 2
    ${formatNum(x1)}, ${formatNum(y1)}, ${formatNum(z2)},  !- Vertex 3
    ${formatNum(x1)}, ${formatNum(y2)}, ${formatNum(z2)};  !- Vertex 4
${generateWindow('window-4')}${generateOverhang('window-4')}

! Outputs
Output:Variable, *, Zone Mean Air Temperature, hourly, ;
Output:Variable, *, Zone Mean Radiant Temperature, hourly, ;
Output:Variable, *, Zone Air Relative Humidity, hourly, ;
Output:Variable, *, Site Outdoor Air Drybulb Temperature, hourly;

! Configurações de tabelas e relatórios
Output:Table:SummaryReports,
  AllSummary;                                    !- Report Name 1

Output:Table:Monthly,
  Zone Temperatures,                             !- Name
  2,                                             !- Digits After Decimal
  Zone Mean Air Temperature,                     !- Variable or Meter Name 1
  SumOrAverage,                                  !- Aggregation Type for Variable or Meter 1
  Zone Mean Radiant Temperature,                 !- Variable or Meter Name 2
  SumOrAverage;                                  !- Aggregation Type for Variable or Meter 2

! Configurações de formatação de saída
OutputControl:Table:Style,
  HTML;                                          !- Column Separator

Output:Surfaces:Drawing, DXF, Triangulate3DFace;
OutputControl:ReportingTolerances,1.11,1.11;
`;

  return idf;
};
