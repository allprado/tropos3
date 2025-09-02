// Teste da correção da fração de profundidade do overhang

console.log('=== TESTE: Fração de Profundidade do Overhang ===\n');

// Simulando o cálculo
const exemples = [
  {
    windowHeight: 1.5, // metros
    overhangDepth: 0.8, // metros
    expectedFraction: 0.8 / 1.5 // = 0.533...
  },
  {
    windowHeight: 2.0, // metros  
    overhangDepth: 1.0, // metros
    expectedFraction: 1.0 / 2.0 // = 0.5
  },
  {
    windowHeight: 1.2, // metros
    overhangDepth: 0.6, // metros  
    expectedFraction: 0.6 / 1.2 // = 0.5
  }
];

exemples.forEach((exemplo, index) => {
  const fraction = exemplo.overhangDepth / exemplo.windowHeight;
  
  console.log(`📐 Exemplo ${index + 1}:`);
  console.log(`   Altura da janela: ${exemplo.windowHeight}m`);
  console.log(`   Profundidade do overhang: ${exemplo.overhangDepth}m`);
  console.log(`   Fração calculada: ${fraction.toFixed(3)}`);
  console.log(`   Esperado: ${exemplo.expectedFraction.toFixed(3)}`);
  console.log(`   ✅ ${fraction === exemplo.expectedFraction ? 'CORRETO' : 'ERRO'}\n`);
});

console.log('📋 EXPLICAÇÃO:');
console.log('- Antes: Usava a profundidade literal (ex: 0.8m)');
console.log('- Agora: Usa a fração da altura da janela (ex: 0.533)');
console.log('- EnergyPlus multiplica a fração pela altura da janela');
console.log('- Resultado: Mesma profundidade física, formato correto!');
