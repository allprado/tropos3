// Teste de exportação/importação JSON completa
import { useStore } from './src/store-simple';

const testJsonExportImport = () => {
  console.log('🧪 Testando exportação/importação JSON...');
  
  // Configurar um modelo de teste com todas as propriedades
  const testModel = {
    dimensions: { width: 8, length: 6, height: 3 },
    northAngle: 0.5236, // 30 graus em radianos
    materials: {
      wall: 'concrete_20cm',
      roof: 'ceramic_tile',
      window: 'double_clear'
    },
    building: {
      name: 'Edifício Teste',
      locationData: {
        city: 'São Paulo',
        latitude: -23.5,
        longitude: -46.6
      }
    },
    windowDimensions: {
      'window-1': { width: 2.0, height: 1.5, sillHeight: 1.0, enabled: true },
      'window-2': { width: 1.8, height: 1.2, sillHeight: 0.9, enabled: false },
      'window-3': { width: 1.6, height: 1.4, sillHeight: 1.1, enabled: true },
      'window-4': { width: 2.2, height: 1.3, sillHeight: 0.8, enabled: false },
    },
    overhangProperties: {
      'window-1': { enabled: true, depth: 0.8, extensionLeft: 0.3, extensionRight: 0.4 },
      'window-2': { enabled: false, depth: 0.6, extensionLeft: 0.2, extensionRight: 0.2 },
      'window-3': { enabled: true, depth: 1.0, extensionLeft: 0.5, extensionRight: 0.3 },
      'window-4': { enabled: false, depth: 0.7, extensionLeft: 0.1, extensionRight: 0.6 },
    },
    surfaceProperties: {
      'wall-1': { boundary: 'external' },
      'wall-2': { boundary: 'adiabatic' },
      'wall-3': { boundary: 'external' },
      'wall-4': { boundary: 'adiabatic' },
      floor: { boundary: 'external' },
      ceiling: { boundary: 'external' }
    }
  };
  
  console.log('📊 Modelo de teste criado:');
  console.log('- Dimensões:', testModel.dimensions);
  console.log('- Norte:', testModel.northAngle, 'rad');
  console.log('- Materiais:', testModel.materials);
  console.log('- Edifício:', testModel.building);
  console.log('- Janelas:', Object.keys(testModel.windowDimensions).length);
  console.log('- Overhangs:', Object.keys(testModel.overhangProperties).length);
  console.log('- Superfícies:', Object.keys(testModel.surfaceProperties).length);
  
  return testModel;
};

export { testJsonExportImport };
