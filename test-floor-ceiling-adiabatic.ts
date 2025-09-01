import { generateIdf } from './src/services/idfGenerator';

// Teste para verificar piso e teto adiabáticos
const testDimensions = {
  width: 4.0,
  length: 3.0,
  height: 2.8
};

const testMaterials = {
  wall: 'concrete' as const,
  window: 'double_clear' as const,
  surface: 'tile' as const
};

const testWindowDimensions = {
  'window-1': { width: 1.5, height: 1.2, sillHeight: 0.9, enabled: false },
  'window-2': { width: 1.5, height: 1.2, sillHeight: 0.9, enabled: false },
  'window-3': { width: 1.5, height: 1.2, sillHeight: 0.9, enabled: false },
  'window-4': { width: 1.5, height: 1.2, sillHeight: 0.9, enabled: false },
};

const testOverhangProperties = {
  'window-1': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
  'window-2': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
  'window-3': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
  'window-4': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
};

console.log('🧪 === TESTE: PISO E TETO ADIABÁTICOS ===');

// TESTE 1: Piso e teto normais (não adiabáticos)
console.log('\n📍 TESTE 1: Superfícies Normais');
const normalSurfaceProperties = {
  'floor': { isAdiabatic: false, windExposure: 'NoWind' as const, sunExposure: 'NoSun' as const },
  'ceiling': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-1': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-2': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-3': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-4': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
};

try {
  const normalIdf = generateIdf(
    testDimensions, 
    0, 
    testMaterials, 
    testWindowDimensions, 
    undefined, 
    testOverhangProperties, 
    normalSurfaceProperties
  );
  
  console.log('✅ IDF normal gerado com sucesso!');
  
  // Verificar piso normal
  const floorNormalMatch = normalIdf.match(/GroundFloor,[\s\S]*?Ground/);
  console.log(`  Piso normal (Ground): ${floorNormalMatch ? '✅' : '❌'}`);
  
  // Verificar teto normal
  const ceilingNormalMatch = normalIdf.match(/Roof,[\s\S]*?Outdoors/);
  console.log(`  Teto normal (Outdoors): ${ceilingNormalMatch ? '✅' : '❌'}`);
  
} catch (error) {
  console.error('❌ Erro ao gerar IDF normal:', error);
}

// TESTE 2: Piso e teto adiabáticos
console.log('\n📍 TESTE 2: Superfícies Adiabáticas');
const adiabaticSurfaceProperties = {
  'floor': { isAdiabatic: true, windExposure: 'NoWind' as const, sunExposure: 'NoSun' as const },
  'ceiling': { isAdiabatic: true, windExposure: 'NoWind' as const, sunExposure: 'NoSun' as const },
  'wall-1': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-2': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-3': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-4': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
};

try {
  const adiabaticIdf = generateIdf(
    testDimensions, 
    0, 
    testMaterials, 
    testWindowDimensions, 
    undefined, 
    testOverhangProperties, 
    adiabaticSurfaceProperties
  );
  
  console.log('✅ IDF adiabático gerado com sucesso!');
  
  // Verificar piso adiabático
  const floorAdiabaticMatch = adiabaticIdf.match(/GroundFloor,[\s\S]*?Adiabatic/);
  console.log(`  Piso adiabático (Adiabatic): ${floorAdiabaticMatch ? '✅' : '❌'}`);
  
  // Verificar teto adiabático
  const ceilingAdiabaticMatch = adiabaticIdf.match(/Roof,[\s\S]*?Adiabatic/);
  console.log(`  Teto adiabático (Adiabatic): ${ceilingAdiabaticMatch ? '✅' : '❌'}`);
  
  // Verificar exposições do piso adiabático
  const floorNoSunMatch = adiabaticIdf.match(/GroundFloor,[\s\S]*?NoSun/);
  const floorNoWindMatch = adiabaticIdf.match(/GroundFloor,[\s\S]*?NoWind/);
  console.log(`  Piso sem exposição solar: ${floorNoSunMatch ? '✅' : '❌'}`);
  console.log(`  Piso sem exposição ao vento: ${floorNoWindMatch ? '✅' : '❌'}`);
  
  // Verificar exposições do teto adiabático
  const ceilingNoSunMatch = adiabaticIdf.match(/Roof,[\s\S]*?NoSun/);
  const ceilingNoWindMatch = adiabaticIdf.match(/Roof,[\s\S]*?NoWind/);
  console.log(`  Teto sem exposição solar: ${ceilingNoSunMatch ? '✅' : '❌'}`);
  console.log(`  Teto sem exposição ao vento: ${ceilingNoWindMatch ? '✅' : '❌'}`);
  
} catch (error) {
  console.error('❌ Erro ao gerar IDF adiabático:', error);
}

// TESTE 3: Apenas piso adiabático
console.log('\n📍 TESTE 3: Apenas Piso Adiabático');
const mixedSurfaceProperties = {
  'floor': { isAdiabatic: true, windExposure: 'NoWind' as const, sunExposure: 'NoSun' as const },      // Adiabático
  'ceiling': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const }, // Normal
  'wall-1': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-2': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-3': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-4': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
};

try {
  const mixedIdf = generateIdf(
    testDimensions, 
    0, 
    testMaterials, 
    testWindowDimensions, 
    undefined, 
    testOverhangProperties, 
    mixedSurfaceProperties
  );
  
  console.log('✅ IDF misto gerado com sucesso!');
  
  const floorAdiabaticMixedMatch = mixedIdf.match(/GroundFloor,[\s\S]*?Adiabatic/);
  const ceilingNormalMixedMatch = mixedIdf.match(/Roof,[\s\S]*?Outdoors/);
  console.log(`  Piso adiabático: ${floorAdiabaticMixedMatch ? '✅' : '❌'}`);
  console.log(`  Teto normal: ${ceilingNormalMixedMatch ? '✅' : '❌'}`);
  
} catch (error) {
  console.error('❌ Erro ao gerar IDF misto:', error);
}

console.log('\n🎯 Teste concluído!');
