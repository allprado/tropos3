import { generateIdf } from './src/services/idfGenerator';

// Teste para verificar se as limitações foram removidas
const testDimensions = {
  width: 8.0,  // 8 metros
  length: 6.0, // 6 metros
  height: 3.0
};

const testMaterials = {
  wall: 'brick' as const,
  window: 'double_clear' as const,
  surface: 'concrete' as const
};

// Janelas com dimensões grandes para testar limites
const testWindowDimensions = {
  'window-1': { width: 7.0, height: 1.5, sillHeight: 1.0, enabled: true }, // South - pode usar width (8m)
  'window-2': { width: 6.5, height: 1.5, sillHeight: 1.0, enabled: true }, // North - pode usar width (8m)
  'window-3': { width: 5.5, height: 1.5, sillHeight: 1.0, enabled: true }, // East - pode usar length (6m)
  'window-4': { width: 4.0, height: 1.5, sillHeight: 1.0, enabled: true }, // West - pode usar length (6m)
};

// Overhangs com extensões grandes para testar limites
const testOverhangProperties = {
  'window-1': { enabled: true, depth: 1.5, extensionLeft: 2.0, extensionRight: 3.0 }, // > 1m
  'window-2': { enabled: true, depth: 0.8, extensionLeft: 1.5, extensionRight: 1.5 }, // > 1m
  'window-3': { enabled: true, depth: 1.2, extensionLeft: 0.5, extensionRight: 2.5 }, // > 1m
  'window-4': { enabled: true, depth: 0.9, extensionLeft: 3.0, extensionRight: 1.0 }, // > 1m
};

console.log('🧪 === TESTE DE REMOÇÃO DE LIMITAÇÕES ===');
console.log('📐 Dimensões da zona:', testDimensions);
console.log('🪟 Janelas com larguras grandes:', testWindowDimensions);
console.log('🏢 Overhangs com extensões > 1m:', testOverhangProperties);

try {
  const idfContent = generateIdf(testDimensions, 0, testMaterials, testWindowDimensions, undefined, testOverhangProperties);
  
  // Verificar se todas as janelas foram incluídas
  const windowMatches = idfContent.match(/FenestrationSurface:Detailed,[\s\S]*?Window/g);
  console.log(`\n✅ Janelas encontradas no IDF: ${windowMatches?.length || 0}`);
  
  // Verificar se todos os overhangs foram incluídos
  const overhangMatches = idfContent.match(/Shading:Zone:Detailed,[\s\S]*?Overhang/g);
  console.log(`✅ Overhangs encontrados no IDF: ${overhangMatches?.length || 0}`);
  
  // Verificar larguras das janelas
  const orientations = ['South', 'North', 'East', 'West'];
  orientations.forEach((orientation, index) => {
    const windowId = `window-${index + 1}`;
    const expectedWidth = testWindowDimensions[windowId].width;
    
    const windowPattern = new RegExp(`Window ${orientation}[\\s\\S]*?4,\\s*!- Number of vertices([\\s\\S]*?);`);
    const windowMatch = idfContent.match(windowPattern);
    
    if (windowMatch) {
      // Extrair coordenadas
      const coords = windowMatch[1].match(/-?\d+\.\d+/g);
      if (coords && coords.length >= 6) {
        const x1 = parseFloat(coords[0]);
        const x2 = parseFloat(coords[3]);
        const actualWidth = Math.abs(x2 - x1);
        
        console.log(`🪟 ${orientation}: Largura esperada ${expectedWidth}m, IDF ${actualWidth.toFixed(2)}m`);
      }
    }
  });
  
  // Verificar extensões dos overhangs
  orientations.forEach((orientation, index) => {
    const windowId = `window-${index + 1}`;
    const expectedLeft = testOverhangProperties[windowId].extensionLeft;
    const expectedRight = testOverhangProperties[windowId].extensionRight;
    const windowWidth = testWindowDimensions[windowId].width;
    const expectedTotalWidth = windowWidth + expectedLeft + expectedRight;
    
    const overhangPattern = new RegExp(`Overhang ${orientation}[\\s\\S]*?4,\\s*!- Number of Vertices([\\s\\S]*?);`);
    const overhangMatch = idfContent.match(overhangPattern);
    
    if (overhangMatch) {
      const coords = overhangMatch[1].match(/-?\d+\.\d+/g);
      if (coords && coords.length >= 12) {
        let actualWidth = 0;
        
        // Para South e North, a largura está nas coordenadas X
        if (orientation === 'South' || orientation === 'North') {
          const x1 = parseFloat(coords[0]);
          const x2 = parseFloat(coords[3]);
          actualWidth = Math.abs(x2 - x1);
        }
        // Para East e West, a largura está nas coordenadas Y
        else if (orientation === 'East' || orientation === 'West') {
          const y1 = parseFloat(coords[1]);
          const y2 = parseFloat(coords[4]);
          actualWidth = Math.abs(y2 - y1);
        }
        
        console.log(`🏢 Overhang ${orientation}: Largura esperada ${expectedTotalWidth.toFixed(1)}m, IDF ${actualWidth.toFixed(2)}m`);
      }
    }
  });
  
} catch (error) {
  console.error('❌ Erro ao gerar IDF:', error);
}
