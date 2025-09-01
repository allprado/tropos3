import { generateIdf } from './src/services/idfGenerator';

// Teste detalhado para verificar a geometria dos overhangs
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
  'window-1': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
  'window-2': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
  'window-3': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
  'window-4': { width: 1.5, height: 1.1, sillHeight: 1.0, enabled: true },
};

const testOverhangProperties = {
  'window-1': { enabled: true, depth: 0.8, extensionLeft: 0.3, extensionRight: 0.3 },
  'window-2': { enabled: false, depth: 0.6, extensionLeft: 0.2, extensionRight: 0.4 },
  'window-3': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
  'window-4': { enabled: false, depth: 1.0, extensionLeft: 0.5, extensionRight: 0.5 },
};

console.log('🧪 === TESTE DETALHADO DE OVERHANGS ===');

try {
  const idfContent = generateIdf(testDimensions, 0, testMaterials, testWindowDimensions, undefined, testOverhangProperties);
  
  // Extrair um overhang específico (South)
  const overhangSouthMatch = idfContent.match(/Shading:Zone:Detailed,[\s\S]*?Overhang South,[\s\S]*?;/);
  
  if (overhangSouthMatch) {
    console.log('\n🏢 === OVERHANG SOUTH COMPLETO ===');
    console.log(overhangSouthMatch[0]);
    console.log('='.repeat(80));
    
    // Análise da geometria
    const vertexMatches = overhangSouthMatch[0].match(/-?\d+\.\d+/g);
    if (vertexMatches && vertexMatches.length >= 12) {
      console.log('\n📊 ANÁLISE GEOMÉTRICA:');
      console.log('Vértices extraídos (X, Y, Z):');
      for (let i = 0; i < 12; i += 3) {
        const vertexNum = (i / 3) + 1;
        console.log(`  Vértice ${vertexNum}: (${vertexMatches[i]}, ${vertexMatches[i+1]}, ${vertexMatches[i+2]})`);
      }
      
      // Verificar se a profundidade está correta
      const expectedDepth = testOverhangProperties['window-1'].depth;
      const yCoords = [parseFloat(vertexMatches[1]), parseFloat(vertexMatches[4]), parseFloat(vertexMatches[7]), parseFloat(vertexMatches[10])];
      console.log(`\n🔍 Coordenadas Y: ${yCoords.join(', ')}`);
      console.log(`📏 Profundidade esperada: ${expectedDepth}m`);
      
      // Calcular largura do overhang
      const windowWidth = testWindowDimensions['window-1'].width;
      const extensionLeft = testOverhangProperties['window-1'].extensionLeft;
      const extensionRight = testOverhangProperties['window-1'].extensionRight;
      const expectedWidth = windowWidth + extensionLeft + extensionRight;
      
      const xCoords = [parseFloat(vertexMatches[0]), parseFloat(vertexMatches[3]), parseFloat(vertexMatches[6]), parseFloat(vertexMatches[9])];
      const actualWidth = Math.max(...xCoords) - Math.min(...xCoords);
      
      console.log(`📏 Largura esperada: ${expectedWidth}m`);
      console.log(`📏 Largura calculada: ${actualWidth.toFixed(6)}m`);
    }
  } else {
    console.log('❌ Overhang South não encontrado!');
  }
  
} catch (error) {
  console.error('❌ Erro ao gerar IDF:', error);
}
