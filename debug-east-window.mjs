// Teste do IDF sem a janela East problemática
import { generateIdf } from './src/services/idfGenerator.js';

const testDimensions = {
  width: 5.0,
  length: 4.0,
  height: 2.5
};

const testMaterials = {
  wall: 'brick',
  window: 'single_clear', 
  surface: 'tile'
};

console.log('🧪 Gerando IDF de teste...');

try {
  const idf = generateIdf(testDimensions, 0, testMaterials);
  
  // Extrair apenas a seção da janela East para análise
  const eastWindowMatch = idf.match(/FenestrationSurface:Detailed,\s*Window East,[\s\S]*?;/);
  
  if (eastWindowMatch) {
    console.log('\n🪟 === JANELA EAST COMPLETA ===');
    console.log(eastWindowMatch[0]);
    
    // Verificar se há algum caractere especial ou problema de encoding
    const lines = eastWindowMatch[0].split('\n');
    console.log('\n🔍 === ANÁLISE DETALHADA ===');
    
    lines.forEach((line, i) => {
      if (line.trim()) {
        // Mostrar códigos ASCII dos caracteres especiais
        const hasSpecialChars = /[^\x20-\x7E]/.test(line);
        const charCodes = hasSpecialChars ? ` [SPECIAL: ${line.match(/[^\x20-\x7E]/g)}]` : '';
        console.log(`${(i+1).toString().padStart(2, '0')}: "${line}"${charCodes}`);
      }
    });
    
    // Verificar se está tudo em ordem sequencial
    const verticesLineIndex = lines.findIndex(line => line.includes('Number of Vertices'));
    const firstVertexLineIndex = lines.findIndex(line => line.includes('Vertex 1'));
    
    console.log(`\n📊 Índices: Vertices=${verticesLineIndex}, Primeiro Vértice=${firstVertexLineIndex}`);
    console.log(`Diferença: ${firstVertexLineIndex - verticesLineIndex} (deveria ser 1)`);
    
  } else {
    console.log('❌ Janela East não encontrada no IDF!');
  }
  
} catch (error) {
  console.error('❌ Erro:', error);
}
