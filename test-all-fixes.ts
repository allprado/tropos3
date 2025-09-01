import { generateIdf } from './src/services/idfGenerator';

// Teste completo para verificar todas as correções
const testDimensions = {
  width: 5.0,
  length: 4.0,
  height: 3.0
};

const testMaterials = {
  wall: 'brick' as const,
  window: 'double_clear' as const,
  surface: 'concrete' as const
};

const testWindowDimensions = {
  'window-1': { width: 2.0, height: 1.5, sillHeight: 1.0, enabled: true },  // South
  'window-2': { width: 1.8, height: 1.5, sillHeight: 1.0, enabled: false }, // North - desabilitada  
  'window-3': { width: 1.5, height: 1.5, sillHeight: 1.0, enabled: true },  // East
  'window-4': { width: 1.0, height: 1.5, sillHeight: 1.0, enabled: false }, // West - desabilitada
};

const testOverhangProperties = {
  'window-1': { enabled: true, depth: 1.0, extensionLeft: 0.0, extensionRight: 2.0 }, // Extensão 0
  'window-2': { enabled: false, depth: 0.5, extensionLeft: 0.3, extensionRight: 0.3 },
  'window-3': { enabled: true, depth: 0.8, extensionLeft: 1.5, extensionRight: 0.0 }, // Extensão 0
  'window-4': { enabled: false, depth: 0.6, extensionLeft: 0.2, extensionRight: 0.2 },
};

const testSurfaceProperties = {
  'wall-1': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-2': { isAdiabatic: true, windExposure: 'NoWind' as const, sunExposure: 'NoSun' as const },      // Adiabática
  'wall-3': { isAdiabatic: false, windExposure: 'WindExposed' as const, sunExposure: 'SunExposed' as const },
  'wall-4': { isAdiabatic: true, windExposure: 'NoWind' as const, sunExposure: 'NoSun' as const },      // Adiabática
};

console.log('🧪 === TESTE COMPLETO DAS CORREÇÕES ===');
console.log('📐 Dimensões:', testDimensions);
console.log('🪟 Janelas:', testWindowDimensions);
console.log('🏢 Overhangs com extensões 0:', testOverhangProperties);
console.log('🧱 Paredes adiabáticas:', testSurfaceProperties);

try {
  const idfContent = generateIdf(
    testDimensions, 
    0, 
    testMaterials, 
    testWindowDimensions, 
    undefined, 
    testOverhangProperties, 
    testSurfaceProperties
  );
  
  console.log('\n✅ IDF gerado com sucesso!');
  
  // 1. Verificar extensões 0
  console.log('\n📍 TESTE 1: Extensões 0');
  const overhangSouthMatch = idfContent.match(/Overhang South[\s\S]*?4,\s*!- Number of Vertices([^;]*);/);
  if (overhangSouthMatch) {
    const coords = overhangSouthMatch[1].match(/-?\d+\.\d+/g);
    if (coords && coords.length >= 6) {
      const x1 = parseFloat(coords[0]);
      const x2 = parseFloat(coords[3]);
      const actualWidth = Math.abs(x2 - x1);
      const expectedWidth = 2.0 + 0.0 + 2.0; // janela + extensões
      console.log(`  South: largura esperada ${expectedWidth}m, IDF ${actualWidth.toFixed(2)}m`);
    }
  }
  
  // 2. Verificar paredes adiabáticas
  console.log('\n📍 TESTE 2: Paredes Adiabáticas');
  const wallNorthMatch = idfContent.match(/Wall North,[\s\S]*?Adiabatic/);
  const wallWestMatch = idfContent.match(/Wall West,[\s\S]*?Adiabatic/);
  console.log(`  Wall North adiabática: ${wallNorthMatch ? '✅' : '❌'}`);
  console.log(`  Wall West adiabática: ${wallWestMatch ? '✅' : '❌'}`);
  
  const wallSouthMatch = idfContent.match(/Wall South,[\s\S]*?Outdoors/);
  const wallEastMatch = idfContent.match(/Wall East,[\s\S]*?Outdoors/);
  console.log(`  Wall South externa: ${wallSouthMatch ? '✅' : '❌'}`);
  console.log(`  Wall East externa: ${wallEastMatch ? '✅' : '❌'}`);
  
  // 3. Verificar janelas desabilitadas
  console.log('\n📍 TESTE 3: Janelas Desabilitadas');
  const windowNorthExists = idfContent.includes('Window North');
  const windowWestExists = idfContent.includes('Window West');
  console.log(`  Window North desabilitada: ${!windowNorthExists ? '✅' : '❌'}`);
  console.log(`  Window West desabilitada: ${!windowWestExists ? '✅' : '❌'}`);
  
  // 4. Verificar overhangs apenas para janelas habilitadas
  console.log('\n📍 TESTE 4: Overhangs');
  const overhangSouthExists = idfContent.includes('Overhang South');
  const overhangNorthExists = idfContent.includes('Overhang North');
  const overhangEastExists = idfContent.includes('Overhang East');
  const overhangWestExists = idfContent.includes('Overhang West');
  
  console.log(`  Overhang South (janela habilitada): ${overhangSouthExists ? '✅' : '❌'}`);
  console.log(`  Overhang North (janela desabilitada): ${!overhangNorthExists ? '✅' : '❌'}`);
  console.log(`  Overhang East (janela habilitada): ${overhangEastExists ? '✅' : '❌'}`);
  console.log(`  Overhang West (janela desabilitada): ${!overhangWestExists ? '✅' : '❌'}`);
  
} catch (error) {
  console.error('❌ Erro ao gerar IDF:', error);
}
