import { generateIdf } from './src/services/idfGenerator';

// Teste para verificar se os overhangs estão sendo incluídos no IDF
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
  'window-2': { enabled: true, depth: 0.6, extensionLeft: 0.2, extensionRight: 0.4 },
  'window-3': { enabled: false, depth: 0.5, extensionLeft: 0.2, extensionRight: 0.2 },
  'window-4': { enabled: true, depth: 1.0, extensionLeft: 0.5, extensionRight: 0.5 },
};

console.log('🧪 === TESTE DE OVERHANGS NO IDF ===');
console.log('📐 Dimensões:', testDimensions);
console.log('🧱 Materiais:', testMaterials);
console.log('🪟 Janelas:', testWindowDimensions);
console.log('🏢 Overhangs:', testOverhangProperties);

try {
  const idfContent = generateIdf(testDimensions, 0, testMaterials, testWindowDimensions, undefined, testOverhangProperties);
  
  // Verificar se contém elementos de sombreamento
  const overhangMatches = idfContent.match(/Shading:Zone:Detailed,[\s\S]*?Overhang/g);
  
  console.log('\n✅ IDF gerado com sucesso!');
  console.log(`🔍 Overhangs encontrados: ${overhangMatches?.length || 0}`);
  
  if (overhangMatches) {
    overhangMatches.forEach((match, index) => {
      console.log(`\n🏢 Overhang ${index + 1}:`);
      console.log(match.substring(0, 100) + '...');
    });
  }
  
  // Verificar especificamente quais overhangs foram incluídos
  const orientations = ['South', 'North', 'East', 'West'];
  orientations.forEach((orientation, index) => {
    const windowId = `window-${index + 1}`;
    const overhangEnabled = testOverhangProperties[windowId]?.enabled;
    const overhangInIdf = idfContent.includes(`Overhang ${orientation}`);
    
    console.log(`📍 ${orientation}: ${overhangEnabled ? 'Habilitado' : 'Desabilitado'} → ${overhangInIdf ? 'Incluído no IDF' : 'Não incluído no IDF'}`);
  });
  
} catch (error) {
  console.error('❌ Erro ao gerar IDF:', error);
}
