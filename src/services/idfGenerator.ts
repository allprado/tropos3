/**
 * Serviço para geração de arquivos IDF para o EnergyPlus
 */
import type { Dimensions, Materials } from '../types';

/**
 * Gera um arquivo IDF completo para o EnergyPlus com base nas dimensões do modelo,
 * ângulo do norte e materiais especificados.
 * 
 * @param dimensions - Dimensões da zona
 * @param northAngle - Ângulo do norte em radianos
 * @param materials - Materiais utilizados
 * @returns Conteúdo do arquivo IDF como string
 */
export const generateIdf = (
  dimensions: Dimensions, 
  northAngle: number, 
  materials: Materials
): string => {
  const { width, length, height } = dimensions;
  const northDeg = (northAngle * 180 / Math.PI) % 360;
  
  // Utilitário para formatar números
  const formatNum = (num: number): string => num.toFixed(3);
  
  // Vértices da zona
  const vertices = [
    // Piso
    [-width/2, 0, -length/2],
    [width/2, 0, -length/2],
    [width/2, 0, length/2],
    [-width/2, 0, length/2],
    // Teto
    [-width/2, height, -length/2],
    [width/2, height, -length/2],
    [width/2, height, length/2],
    [-width/2, height, length/2],
  ];
  
  // Converter vértices para string no formato IDF
  const vertexStrings = vertices.map((v, i) => `
  BuildingSurface:Vertex_${i+1},    !- Vertex ${i+1} Name
    ${formatNum(v[0])},             !- Vertex X-coordinate {m}
    ${formatNum(v[1])},             !- Vertex Y-coordinate {m}
    ${formatNum(v[2])};             !- Vertex Z-coordinate {m}`
  ).join('');
  
  // Mapear materiais para construções no EnergyPlus
  const wallConstruction = materials.wall === 'brick' ? 'EXTERIOR-WALL' : 
                           materials.wall === 'concrete' ? 'CONCRETE-WALL' :
                           materials.wall === 'wood' ? 'WOOD-WALL' : 'PARTITION';
                           
  const windowConstruction = materials.window === 'single_clear' ? 'SINGLE-CLEAR' : 
                             materials.window === 'double_clear' ? 'DOUBLE-CLEAR' : 'LOW-E-WINDOW';
                             
  const floorConstruction = materials.surface === 'tile' ? 'FLOOR-TILE' : 
                           materials.surface === 'carpet' ? 'FLOOR-CARPET' : 'SLAB-ON-GRADE';
  
  // Construir o arquivo IDF
  const idf = `
!---------------------------------------------------------
! Tropos3D - Arquivo IDF para EnergyPlus
! Gerado automaticamente
!---------------------------------------------------------

Version,
  9.5;                                    !- Version Identifier

Building,
  Tropos3D Building,                      !- Name
  0.0,                                    !- North Axis {deg}
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

Site:Location,
  Sao Paulo,                              !- Name
  -23.55,                                 !- Latitude {deg}
  -46.64,                                 !- Longitude {deg}
  -3.0,                                   !- Time Zone {hr}
  720;                                    !- Elevation {m}

SizingPeriod:DesignDay,
  Sao Paulo Summer Design Day,            !- Name
  2,                                      !- Month
  21,                                     !- Day of Month
  SummerDesignDay,                        !- Day Type
  32.0,                                   !- Maximum Dry-Bulb Temperature {C}
  8.0,                                    !- Daily Dry-Bulb Temperature Range {deltaC}
  DefaultMultipliers,                     !- Dry-Bulb Temperature Range Modifier Type
  ,                                       !- Dry-Bulb Temperature Range Modifier Day Schedule Name
  Wetbulb,                                !- Humidity Condition Type
  25.0,                                   !- Wetbulb or DewPoint at Maximum Dry-Bulb {C}
  ,                                       !- Humidity Condition Day Schedule Name
  ,                                       !- Humidity Ratio at Maximum Dry-Bulb {kgWater/kgDryAir}
  ,                                       !- Enthalpy at Maximum Dry-Bulb {J/kg}
  ,                                       !- Daily Wet-Bulb Temperature Range {deltaC}
  101217.,                                !- Barometric Pressure {Pa}
  3.0,                                    !- Wind Speed {m/s}
  180,                                    !- Wind Direction {deg}
  No,                                     !- Rain Indicator
  No,                                     !- Snow Indicator
  Yes,                                    !- Daylight Saving Time Indicator
  ASHRAEClearSky,                         !- Solar Model Indicator
  ,                                       !- Beam Solar Day Schedule Name
  ,                                       !- Diffuse Solar Day Schedule Name
  ,                                       !- ASHRAE Clear Sky Optical Depth for Beam Irradiance (taub) {dimensionless}
  ,                                       !- ASHRAE Clear Sky Optical Depth for Diffuse Irradiance (taud) {dimensionless}
  1.0;                                    !- Sky Clearness

SizingPeriod:DesignDay,
  Sao Paulo Winter Design Day,            !- Name
  7,                                      !- Month
  21,                                     !- Day of Month
  WinterDesignDay,                        !- Day Type
  18.0,                                   !- Maximum Dry-Bulb Temperature {C}
  8.0,                                    !- Daily Dry-Bulb Temperature Range {deltaC}
  DefaultMultipliers,                     !- Dry-Bulb Temperature Range Modifier Type
  ,                                       !- Dry-Bulb Temperature Range Modifier Day Schedule Name
  Wetbulb,                                !- Humidity Condition Type
  16.0,                                   !- Wetbulb or DewPoint at Maximum Dry-Bulb {C}
  ,                                       !- Humidity Condition Day Schedule Name
  ,                                       !- Humidity Ratio at Maximum Dry-Bulb {kgWater/kgDryAir}
  ,                                       !- Enthalpy at Maximum Dry-Bulb {J/kg}
  ,                                       !- Daily Wet-Bulb Temperature Range {deltaC}
  101217.,                                !- Barometric Pressure {Pa}
  2.0,                                    !- Wind Speed {m/s}
  0,                                      !- Wind Direction {deg}
  No,                                     !- Rain Indicator
  No,                                     !- Snow Indicator
  No,                                     !- Daylight Saving Time Indicator
  ASHRAEClearSky,                         !- Solar Model Indicator
  ,                                       !- Beam Solar Day Schedule Name
  ,                                       !- Diffuse Solar Day Schedule Name
  ,                                       !- ASHRAE Clear Sky Optical Depth for Beam Irradiance (taub) {dimensionless}
  ,                                       !- ASHRAE Clear Sky Optical Depth for Diffuse Irradiance (taud) {dimensionless}
  0.0;                                    !- Sky Clearness

Zone,
  Zone Default,                           !- Name
  0,                                      !- Direction of Relative North {deg}
  0,                                      !- X Origin {m}
  0,                                      !- Y Origin {m}
  0,                                      !- Z Origin {m}
  1,                                      !- Type
  1,                                      !- Multiplier
  ${formatNum(height)},                   !- Ceiling Height {m}
  ${formatNum(width * length)};           !- Volume {m3}

! SUPERFÍCIES

BuildingSurface:Detailed,
  Floor,                                  !- Name
  Floor,                                  !- Surface Type
  ${floorConstruction},                   !- Construction Name
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
  ${floorConstruction},                   !- Construction Name
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
  ${wallConstruction},                    !- Construction Name
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
  ${windowConstruction},                  !- Construction Name
  Wall North,                             !- Building Surface Name
  ,                                       !- Outside Boundary Condition Object
  0.0,                                    !- View Factor to Ground
  ,                                       !- Frame and Divider Name
  1.0,                                    !- Multiplier
  4,                                      !- Number of Vertices
  ${formatNum(-0.75)}, ${formatNum(1 + 1.1)}, ${formatNum(-length/2 + 0.01)},  !- X,Y,Z Vertex 1 {m}
  ${formatNum(-0.75)}, ${formatNum(1)}, ${formatNum(-length/2 + 0.01)},        !- X,Y,Z Vertex 2 {m}
  ${formatNum(0.75)}, ${formatNum(1)}, ${formatNum(-length/2 + 0.01)},         !- X,Y,Z Vertex 3 {m}
  ${formatNum(0.75)}, ${formatNum(1 + 1.1)}, ${formatNum(-length/2 + 0.01)};   !- X,Y,Z Vertex 4 {m}

BuildingSurface:Detailed,
  Wall South,                             !- Name
  Wall,                                   !- Surface Type
  ${wallConstruction},                    !- Construction Name
  Zone Default,                           !- Zone Name
  Outdoors,                               !- Outside Boundary Condition
  ,                                       !- Outside Boundary Condition Object
  SunExposed,                             !- Sun Exposure
  WindExposed,                            !- Wind Exposure
  0.0,                                    !- View Factor to Ground
  4,                                      !- Number of Vertices
  ${formatNum(width/2)}, ${formatNum(height)}, ${formatNum(length/2)},    !- X,Y,Z Vertex 1 {m}
  ${formatNum(width/2)}, ${formatNum(0)}, ${formatNum(length/2)},         !- X,Y,Z Vertex 2 {m}
  ${formatNum(-width/2)}, ${formatNum(0)}, ${formatNum(length/2)},        !- X,Y,Z Vertex 3 {m}
  ${formatNum(-width/2)}, ${formatNum(height)}, ${formatNum(length/2)};   !- X,Y,Z Vertex 4 {m}

FenestrationSurface:Detailed,
  Window South,                           !- Name
  Window,                                 !- Surface Type
  ${windowConstruction},                  !- Construction Name
  Wall South,                             !- Building Surface Name
  ,                                       !- Outside Boundary Condition Object
  0.0,                                    !- View Factor to Ground
  ,                                       !- Frame and Divider Name
  1.0,                                    !- Multiplier
  4,                                      !- Number of Vertices
  ${formatNum(0.75)}, ${formatNum(1 + 1.1)}, ${formatNum(length/2 - 0.01)},   !- X,Y,Z Vertex 1 {m}
  ${formatNum(0.75)}, ${formatNum(1)}, ${formatNum(length/2 - 0.01)},         !- X,Y,Z Vertex 2 {m}
  ${formatNum(-0.75)}, ${formatNum(1)}, ${formatNum(length/2 - 0.01)},        !- X,Y,Z Vertex 3 {m}
  ${formatNum(-0.75)}, ${formatNum(1 + 1.1)}, ${formatNum(length/2 - 0.01)};  !- X,Y,Z Vertex 4 {m}

BuildingSurface:Detailed,
  Wall East,                              !- Name
  Wall,                                   !- Surface Type
  ${wallConstruction},                    !- Construction Name
  Zone Default,                           !- Zone Name
  Outdoors,                               !- Outside Boundary Condition
  ,                                       !- Outside Boundary Condition Object
  SunExposed,                             !- Sun Exposure
  WindExposed,                            !- Wind Exposure
  0.0,                                    !- View Factor to Ground
  4,                                      !- Number of Vertices
  ${formatNum(width/2)}, ${formatNum(height)}, ${formatNum(-length/2)},   !- X,Y,Z Vertex 1 {m}
  ${formatNum(width/2)}, ${formatNum(0)}, ${formatNum(-length/2)},        !- X,Y,Z Vertex 2 {m}
  ${formatNum(width/2)}, ${formatNum(0)}, ${formatNum(length/2)},         !- X,Y,Z Vertex 3 {m}
  ${formatNum(width/2)}, ${formatNum(height)}, ${formatNum(length/2)};    !- X,Y,Z Vertex 4 {m}

FenestrationSurface:Detailed,
  Window East,                            !- Name
  Window,                                 !- Surface Type
  ${windowConstruction},                  !- Construction Name
  Wall East,                              !- Building Surface Name
  ,                                       !- Outside Boundary Condition Object
  0.0,                                    !- View Factor to Ground
  ,                                       !- Frame and Divider Name
  1.0,                                    !- Multiplier
  4,                                      !- Number of Vertices
  ${formatNum(width/2 - 0.01)}, ${formatNum(1 + 1.1)}, ${formatNum(0.75)},   !- X,Y,Z Vertex 1 {m}
  ${formatNum(width/2 - 0.01)}, ${formatNum(1)}, ${formatNum(0.75)},         !- X,Y,Z Vertex 2 {m}
  ${formatNum(width/2 - 0.01)}, ${formatNum(1)}, ${formatNum(-0.75)},        !- X,Y,Z Vertex 3 {m}
  ${formatNum(width/2 - 0.01)}, ${formatNum(1 + 1.1)}, ${formatNum(-0.75)};  !- X,Y,Z Vertex 4 {m}

BuildingSurface:Detailed,
  Wall West,                              !- Name
  Wall,                                   !- Surface Type
  ${wallConstruction},                    !- Construction Name
  Zone Default,                           !- Zone Name
  Outdoors,                               !- Outside Boundary Condition
  ,                                       !- Outside Boundary Condition Object
  SunExposed,                             !- Sun Exposure
  WindExposed,                            !- Wind Exposure
  0.0,                                    !- View Factor to Ground
  4,                                      !- Number of Vertices
  ${formatNum(-width/2)}, ${formatNum(height)}, ${formatNum(length/2)},   !- X,Y,Z Vertex 1 {m}
  ${formatNum(-width/2)}, ${formatNum(0)}, ${formatNum(length/2)},        !- X,Y,Z Vertex 2 {m}
  ${formatNum(-width/2)}, ${formatNum(0)}, ${formatNum(-length/2)},       !- X,Y,Z Vertex 3 {m}
  ${formatNum(-width/2)}, ${formatNum(height)}, ${formatNum(-length/2)};  !- X,Y,Z Vertex 4 {m}

FenestrationSurface:Detailed,
  Window West,                            !- Name
  Window,                                 !- Surface Type
  ${windowConstruction},                  !- Construction Name
  Wall West,                              !- Building Surface Name
  ,                                       !- Outside Boundary Condition Object
  0.0,                                    !- View Factor to Ground
  ,                                       !- Frame and Divider Name
  1.0,                                    !- Multiplier
  4,                                      !- Number of Vertices
  ${formatNum(-width/2 + 0.01)}, ${formatNum(1 + 1.1)}, ${formatNum(-0.75)},  !- X,Y,Z Vertex 1 {m}
  ${formatNum(-width/2 + 0.01)}, ${formatNum(1)}, ${formatNum(-0.75)},        !- X,Y,Z Vertex 2 {m}
  ${formatNum(-width/2 + 0.01)}, ${formatNum(1)}, ${formatNum(0.75)},         !- X,Y,Z Vertex 3 {m}
  ${formatNum(-width/2 + 0.01)}, ${formatNum(1 + 1.1)}, ${formatNum(0.75)};   !- X,Y,Z Vertex 4 {m}

! CONSTRUÇÕES E MATERIAIS

Material,
  Concrete,                               !- Name
  MediumRough,                            !- Roughness
  0.10,                                   !- Thickness {m}
  1.7,                                    !- Conductivity {W/m-K}
  2300,                                   !- Density {kg/m3}
  920;                                    !- Specific Heat {J/kg-K}

Construction,
  EXTERIOR-WALL,                          !- Name
  Concrete;                               !- Outside Layer

Construction,
  CONCRETE-WALL,                          !- Name
  Concrete;                               !- Outside Layer

Material,
  WoodLayer,                              !- Name
  MediumSmooth,                           !- Roughness
  0.05,                                   !- Thickness {m}
  0.12,                                   !- Conductivity {W/m-K}
  600,                                    !- Density {kg/m3}
  1630;                                   !- Specific Heat {J/kg-K}

Construction,
  WOOD-WALL,                              !- Name
  WoodLayer;                              !- Outside Layer

Construction,
  PARTITION,                              !- Name
  Concrete;                               !- Outside Layer

Construction,
  SINGLE-CLEAR,                           !- Name
  Clear 3mm;                              !- Outside Layer

Construction,
  DOUBLE-CLEAR,                           !- Name
  Clear 3mm,                              !- Outside Layer
  Air 6mm,                                !- Layer 2
  Clear 3mm;                              !- Layer 3

Construction,
  LOW-E-WINDOW,                           !- Name
  Low-e 6mm;                              !- Outside Layer

Material,
  FloorTile,                              !- Name
  Smooth,                                 !- Roughness
  0.02,                                   !- Thickness {m}
  0.8,                                    !- Conductivity {W/m-K}
  1900,                                   !- Density {kg/m3}
  800;                                    !- Specific Heat {J/kg-K}

Material,
  FloorCarpet,                            !- Name
  Rough,                                  !- Roughness
  0.02,                                   !- Thickness {m}
  0.06,                                   !- Conductivity {W/m-K}
  200,                                    !- Density {kg/m3}
  1300;                                   !- Specific Heat {J/kg-K}

Construction,
  FLOOR-TILE,                             !- Name
  FloorTile;                              !- Outside Layer

Construction,
  FLOOR-CARPET,                           !- Name
  FloorCarpet;                            !- Outside Layer

Construction,
  SLAB-ON-GRADE,                          !- Name
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

WindowMaterial:Glazing,
  Low-e 6mm,                              !- Name
  SpectralAverage,                        !- Optical Data Type
  ,                                       !- Window Glass Spectral Data Set Name
  0.006,                                  !- Thickness {m}
  0.6,                                    !- Solar Transmittance at Normal Incidence
  0.17,                                   !- Front Side Solar Reflectance at Normal Incidence
  0.22,                                   !- Back Side Solar Reflectance at Normal Incidence
  0.84,                                   !- Visible Transmittance at Normal Incidence
  0.055,                                  !- Front Side Visible Reflectance at Normal Incidence
  0.078,                                  !- Back Side Visible Reflectance at Normal Incidence
  0,                                      !- Infrared Transmittance at Normal Incidence
  0.1,                                    !- Front Side Infrared Hemispherical Emissivity
  0.84,                                   !- Back Side Infrared Hemispherical Emissivity
  0.9;                                    !- Conductivity {W/m-K}

WindowMaterial:Gas,
  Air 6mm,                                !- Name
  Air,                                    !- Gas Type
  0.006;                                  !- Thickness {m}

! PROGRAMAÇÕES (SCHEDULES) BÁSICAS

ScheduleTypeLimits,
  Fraction,                               !- Name
  0.0,                                    !- Lower Limit Value
  1.0,                                    !- Upper Limit Value
  Continuous;                             !- Numeric Type

Schedule:Compact,
  Always On,                              !- Name
  Fraction,                               !- Schedule Type Limits Name
  Through: 12/31,                         !- Field 1
  For: AllDays,                           !- Field 2
  Until: 24:00,                           !- Field 3
  1;                                      !- Field 4

Schedule:Compact,
  Always Off,                             !- Name
  Fraction,                               !- Schedule Type Limits Name
  Through: 12/31,                         !- Field 1
  For: AllDays,                           !- Field 2
  Until: 24:00,                           !- Field 3
  0;                                      !- Field 4

! OUTRAS DEFINIÇÕES DE SIMULAÇÃO

RunPeriod,
  Annual Run,                             !- Name
  1,                                      !- Begin Month
  1,                                      !- Begin Day of Month
  12,                                     !- End Month
  31,                                     !- End Day of Month
  UseWeatherFile,                         !- Day of Week for Start Day
  Yes,                                    !- Use Weather File Holidays and Special Days
  Yes,                                    !- Use Weather File Daylight Saving Period
  No,                                     !- Apply Weekend Holiday Rule
  Yes,                                    !- Use Weather File Rain Indicators
  Yes;                                    !- Use Weather File Snow Indicators

OutputControl:Table:Style,
  HTML;                                   !- Column Separator

Output:Variable,
  *,                                      !- Key Value
  Zone Mean Air Temperature,              !- Variable Name
  Hourly;                                 !- Reporting Frequency

Output:Variable,
  *,                                      !- Key Value
  Zone Total Internal Latent Gain Energy, !- Variable Name
  Hourly;                                 !- Reporting Frequency

Output:Variable,
  *,                                      !- Key Value
  Zone Mean Radiant Temperature,          !- Variable Name
  Hourly;                                 !- Reporting Frequency

Output:Variable,
  *,                                      !- Key Value
  Zone Air Relative Humidity,             !- Variable Name
  Hourly;                                 !- Reporting Frequency

Output:Variable,
  *,                                      !- Key Value
  Zone Windows Total Transmitted Solar Radiation Energy, !- Variable Name
  Hourly;                                 !- Reporting Frequency

Output:Table:SummaryReports,
  AllSummary;                             !- Report 1 Name
`;

  return idf;
};
