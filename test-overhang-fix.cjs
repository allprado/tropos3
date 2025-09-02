// Teste para verificar se a correção do overhang está funcionando
const fs = require('fs');
const path = require('path');

// Lendo o arquivo idfGenerator.ts para verificar a correção
const idfGeneratorPath = path.join(__dirname, 'src/services/idfGenerator.ts');
const content = fs.readFileSync(idfGeneratorPath, 'utf8');

console.log('=== Verificando correção do Overhang ===\n');

// Procurar pela definição Shading:Zone:Detailed
const shadingMatch = content.match(/Shading:Zone:Detailed,[\s\S]*?Name[\s\S]*?Base Surface[\s\S]*?Transmittance[\s\S]*?Number of Vertices/);

if (shadingMatch) {
  console.log('✓ Definição Shading:Zone:Detailed encontrada:');
  console.log(shadingMatch[0]);
  
  // Verificar se está usando Wall ${orientation} em vez de Zone Default
  if (content.includes('Wall ${wallInfo.orientation.charAt(0).toUpperCase() + wallInfo.orientation.slice(1)}, !- Base Surface')) {
    console.log('\n✓ CORREÇÃO APLICADA: Base Surface agora referencia a parede correta');
    console.log('  Formato: Wall ${orientation} em vez de Zone Default');
  } else if (content.includes('Zone Default,                                  !- Base Surface')) {
    console.log('\n✗ PROBLEMA AINDA EXISTE: Base Surface ainda referencia Zone Default');
  } else {
    console.log('\n? Base Surface não encontrado no formato esperado');
  }
} else {
  console.log('✗ Definição Shading:Zone:Detailed não encontrada');
}

// Verificar se a linha problemática foi removida
if (content.includes('Zone Default,                                  !- Base Surface')) {
  console.log('\n⚠️  ATENÇÃO: Ainda há referência a "Zone Default" como Base Surface');
} else {
  console.log('\n✓ Referência problemática "Zone Default" foi removida');
}

console.log('\n=== Resultado ===');
console.log('A correção deve fazer com que overhangs referenciem a parede específica');
console.log('(Wall South, Wall North, etc.) em vez de "Zone Default"');
