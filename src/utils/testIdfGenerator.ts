import { generateIdf } from '../services/idfGenerator';

export const testIdfGenerator = () => {
  const testDimensions = {
    width: 6.0,
    length: 4.0,
    height: 3.0
  };

  const testMaterials = {
    wall: 'brick' as const,
    window: 'double_clear' as const,
    surface: 'concrete' as const
  };

  const testNorthAngle = 0;

  console.log('🧪 === TESTE DO GERADOR IDF PARA ENERGYPLUS 8.9 ===');
  console.log('📐 Dimensões:', testDimensions);
  console.log('🧱 Materiais:', testMaterials);
  console.log('🧭 Ângulo Norte:', testNorthAngle, 'radianos');

  try {
    const idfContent = generateIdf(testDimensions, testNorthAngle, testMaterials);
    
    console.log('✅ IDF gerado com sucesso!');
    
    // Verificações específicas dos problemas reportados
    const versionCheck = idfContent.match(/Version,\s*([^;]+);/);
    const windowNorthCheck = idfContent.includes('Window North,');
    const numbersInWindowNorth = idfContent.match(/Window North[\s\S]*?4,\s*!- Number of Vertices([\s\S]*?);/);
    
    console.log('\n🔍 ANÁLISE DETALHADA:');
    console.log('📋 Versão encontrada:', versionCheck ? versionCheck[1].trim() : 'NÃO ENCONTRADA');
    console.log('🪟 Janela Norte definida:', windowNorthCheck);
    
    if (numbersInWindowNorth) {
      console.log('📊 Coordenadas da Janela Norte:');
      const coords = numbersInWindowNorth[1];
      console.log(coords);
    }

    // Procurar por problemas conhecidos
    const problems = [];
    if (idfContent.includes('9.5')) problems.push('❌ Versão 9.5 encontrada');
    if (idfContent.includes('-0.750000')) problems.push('❌ Coordenada -0.750000 problemática encontrada');
    if (idfContent.includes('Ideal Loads')) problems.push('❌ Referência a Ideal Loads encontrada');
    
    if (problems.length > 0) {
      console.log('\n� PROBLEMAS DETECTADOS:');
      problems.forEach(p => console.log(p));
    } else {
      console.log('\n✅ Nenhum problema conhecido detectado!');
    }

    // Mostrar primeiras 100 linhas para debug
    console.log('\n📄 PRIMEIRAS LINHAS DO IDF:');
    console.log('='.repeat(80));
    const lines = idfContent.split('\n').slice(0, 50);
    lines.forEach((line, i) => console.log(`${(i+1).toString().padStart(2, '0')}: ${line}`));
    console.log('='.repeat(80));
    
    return idfContent;
    
  } catch (error) {
    console.error('❌ Erro ao gerar IDF:', error);
    return null;
  }
};
