// Teste simples para depurar o problema de formatação do IDF
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

const testNorthAngle = 0;

console.log('🔍 TESTE DE DEBUG DO IDF - JANELA EAST');

try {
  const idfContent = generateIdf(testDimensions, testNorthAngle, testMaterials);
  
  // Extrair apenas a seção da Janela East
  const windowEastMatch = idfContent.match(/FenestrationSurface:Detailed,\s*Window East,[\s\S]*?;/);
  
  if (windowEastMatch) {
    console.log('🪟 DEFINIÇÃO DA JANELA EAST:');
    console.log('='.repeat(80));
    console.log(windowEastMatch[0]);
    console.log('='.repeat(80));
    
    // Analisar linha por linha
    const lines = windowEastMatch[0].split('\n');
    lines.forEach((line, i) => {
      if (line.trim()) {
        console.log(`${(i+1).toString().padStart(2, '0')}: "${line}"`);
      }
    });
  } else {
    console.log('❌ Janela East não encontrada!');
  }
  
  // Calcular o valor problemático
  const width = testDimensions.width;
  const calculatedValue = width/2 - 0.01;
  console.log(`\n📊 VALORES CALCULADOS:`);
  console.log(`width/2 - 0.01 = ${width}/2 - 0.01 = ${calculatedValue}`);
  console.log(`formatNum(${calculatedValue}) = ${calculatedValue.toFixed(3)}`);
  
} catch (error) {
  console.error('❌ Erro:', error);
}
