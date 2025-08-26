import { generateIdf } from '../src/services/idfGenerator';

// Teste do gerador IDF para EnergyPlus 8.9
const testDimensions = {
  width: 6.0,
  length: 4.0,
  height: 3.0
};

const testMaterials = {
  wall: 'brick',
  window: 'double_clear',
  surface: 'concrete'
};

const testNorthAngle = 0; // radianos

console.log('=== TESTE DO GERADOR IDF PARA ENERGYPLUS 8.9 ===');
console.log('Dimensões:', testDimensions);
console.log('Materiais:', testMaterials);
console.log('Ângulo Norte:', testNorthAngle, 'radianos');
console.log('');

try {
  const idfContent = generateIdf(testDimensions, testNorthAngle, testMaterials);
  
  console.log('✅ IDF gerado com sucesso!');
  console.log('📄 Conteúdo do arquivo:');
  console.log('='.repeat(80));
  console.log(idfContent);
  console.log('='.repeat(80));
  
  // Verificações específicas para EnergyPlus 8.9
  const checks = [
    ['Versão 8.9', idfContent.includes('8.9;')],
    ['Janela Norte válida', idfContent.includes('4,                                      !- Number of Vertices') && !idfContent.includes('-0.750000')],
    ['Coordenadas corretas', idfContent.includes('2.1') && idfContent.includes('1.0')],
    ['Sem problemas HVAC', !idfContent.includes('Ideal Loads')]
  ];
  
  console.log('\n📋 VERIFICAÇÕES:');
  checks.forEach(([check, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${check}`);
  });
  
} catch (error) {
  console.error('❌ Erro ao gerar IDF:', error);
}
