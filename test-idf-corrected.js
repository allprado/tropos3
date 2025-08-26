// Teste simples para verificar o IDF corrigido
const { generateIdf } = require('./src/services/idfGenerator.ts');

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

try {
  console.log('🧪 Testando IDF corrigido...');
  const idf = generateIdf(testDimensions, 0, testMaterials);
  
  // Buscar a seção da Janela East
  const windowEastMatch = idf.match(/FenestrationSurface:Detailed,[\s\S]*?Window East,[\s\S]*?;/);
  
  if (windowEastMatch) {
    console.log('✅ Janela East encontrada:');
    console.log(windowEastMatch[0]);
    
    // Verificar se não tem o valor problemático 2.490
    if (!windowEastMatch[0].includes('2.490')) {
      console.log('✅ Valor 2.490 não encontrado - correção aplicada!');
    } else {
      console.log('❌ Ainda contém valor 2.490');
    }
  } else {
    console.log('❌ Janela East não encontrada');
  }
  
} catch (error) {
  console.error('❌ Erro:', error.message);
}
