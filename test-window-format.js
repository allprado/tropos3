// Teste direto da formatação da janela East
const formatNum = (num) => num.toFixed(3);

const width = 5.0;

const windowEastTest = `
FenestrationSurface:Detailed,
  Window East,                            !- Name
  Window,                                 !- Surface Type
  SINGLE-CLEAR,                  !- Construction Name
  Wall East,                              !- Building Surface Name
  ,                                       !- Outside Boundary Condition Object
  0.0,                                    !- View Factor to Ground
  ,                                       !- Frame and Divider Name
  1.0,                                    !- Multiplier
  4,                                      !- Number of Vertices
  ${formatNum(width/2 + 0.01)}, ${formatNum(-0.75)}, ${formatNum(1.0)},  !- X,Y,Z Vertex 1 {m}
  ${formatNum(width/2 + 0.01)}, ${formatNum(0.75)}, ${formatNum(1.0)},   !- X,Y,Z Vertex 2 {m}
  ${formatNum(width/2 + 0.01)}, ${formatNum(0.75)}, ${formatNum(2.1)},   !- X,Y,Z Vertex 3 {m}
  ${formatNum(width/2 + 0.01)}, ${formatNum(-0.75)}, ${formatNum(2.1)};  !- X,Y,Z Vertex 4 {m}
`;

console.log('=== TESTE FORMATAÇÃO JANELA EAST ===');
console.log(windowEastTest);
console.log('=== ANÁLISE LINHA POR LINHA ===');

const lines = windowEastTest.split('\n');
lines.forEach((line, i) => {
  if (line.trim()) {
    console.log(`${i.toString().padStart(2, '0')}: "${line}"`);
  }
});

// Verificar se o valor 2.510 aparece onde deveria
const problematicLine = lines.find(line => line.includes('2.510'));
if (problematicLine) {
  console.log('\n🔍 LINHA COM 2.510:');
  console.log(`"${problematicLine}"`);
}

// Verificar se "4," (number of vertices) está na linha correta
const verticesLine = lines.find(line => line.includes('4,') && line.includes('Number of Vertices'));
if (verticesLine) {
  console.log('\n✅ LINHA "Number of Vertices":');
  console.log(`"${verticesLine}"`);
}
