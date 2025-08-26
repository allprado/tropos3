import { generateIdf } from './src/services/idfGenerator.js';

const testDimensions = {
  width: 5.0,
  length: 4.0,
  height: 3.0
};

const testMaterials = {
  wall: 'brick',
  window: 'double_clear',
  surface: 'concrete'
};

console.log('🔍 VERIFICANDO CORREÇÕES DO IDF');

try {
  const idf = generateIdf(testDimensions, 0, testMaterials);
  
  // Buscar todas as janelas
  const windows = ['North', 'South', 'East', 'West'];
  
  windows.forEach(direction => {
    const windowMatch = idf.match(new RegExp(`FenestrationSurface:Detailed,[\\s\\S]*?Window ${direction},[\\s\\S]*?;`));
    
    if (windowMatch) {
      console.log(`\n🪟 JANELA ${direction.toUpperCase()}:`);
      console.log('='.repeat(60));
      
      // Extrair apenas as linhas das coordenadas
      const lines = windowMatch[0].split('\n');
      const coordLines = lines.filter(line => line.includes('Vertex') && line.includes('!-'));
      
      coordLines.forEach((line, i) => {
        console.log(`V${i+1}: ${line.trim()}`);
      });
      
      // Verificar se tem valores problemáticos
      const problematicValues = ['2.490', '2.510', '-1.990', '-2.010'];
      const hasProblems = problematicValues.some(val => windowMatch[0].includes(val));
      
      if (hasProblems) {
        console.log(`❌ Valores problemáticos encontrados em ${direction}`);
      } else {
        console.log(`✅ ${direction} parece OK`);
      }
    } else {
      console.log(`❌ Janela ${direction} não encontrada`);
    }
  });
  
} catch (error) {
  console.error('❌ Erro:', error);
}
