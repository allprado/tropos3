const { generateIdf } = require('./src/services/idfGenerator.ts');

// Dados de teste com overhang
const testData = {
  dimensions: { width: 10, depth: 8, height: 3 },
  materials: { wall: 'brick', surface: 'tile', roof: 'tile' },
  windowDimensions: {
    south: { width: 2, height: 1.5, sillHeight: 0.8 }
  },
  overhangProperties: {
    south: {
      enabled: true,
      depth: 0.8,
      extensionLeft: 0.2,
      extensionRight: 0.2
    }
  }
};

console.log('=== Teste do Overhang Corrigido ===');
try {
  const idf = generateIdf(testData);
  
  // Verificar se contém o novo objeto Shading:Overhang:Projection
  if (idf.includes('Shading:Overhang:Projection')) {
    console.log('✅ SUCESSO: Overhang usando Shading:Overhang:Projection');
    
    // Extrair a seção do overhang
    const overhangMatch = idf.match(/! Overhang for Window South[\s\S]*?;/);
    if (overhangMatch) {
      console.log('\n📋 Definição do Overhang:');
      console.log(overhangMatch[0]);
    }
  } else {
    console.log('❌ ERRO: Overhang não encontrado no IDF');
  }
  
  // Verificar se ainda contém o objeto problemático anterior
  if (idf.includes('Shading:Zone:Detailed')) {
    console.log('⚠️  ATENÇÃO: Ainda contém Shading:Zone:Detailed (pode ser problemático)');
  } else {
    console.log('✅ SUCESSO: Não contém mais Shading:Zone:Detailed');
  }
  
} catch (error) {
  console.log('❌ ERRO ao gerar IDF:', error.message);
}
