# Tropos3D - Modelagem Arquitetônica para EnergyPlus

Tropos3D é uma aplicação web para modelagem 3D de edifícios arquitetônicos com o objetivo de gerar arquivos IDF para simulações no EnergyPlus.

![Tropos3D Screenshot](screenshot.png)

## 🚀 Funcionalidades Implementadas

### Canvas 3D Interativo
- **Controles de câmera**: Orbit, zoom e pan com mouse
- **Zona retangular padrão**: 5m × 4m × 2,5m (editável)
- **Seleção visual**: Clique nos elementos para selecioná-los
- **Indicador do norte**: Seta vermelha mostrando orientação
- **Eixos coordenados**: Sistema XYZ similar a programas CAD

### Interface de Usuário
- **Toolbar moderna**: Controles de norte, exportação e simulação
- **Painel de propriedades**: Edição de dimensões e materiais
- **Árvore de elementos**: Hierarquia navegável do modelo
- **Feedback visual**: Elementos selecionados ficam destacados

### Funcionalidades de Exportação
- **JSON**: Salvar/carregar modelos completos
- **IDF**: Exportação compatível com EnergyPlus
- **Simulação**: Integração preparada para API JessWeb

## 🎯 Como Usar

### Navegação 3D
- **Rotacionar**: Clique e arraste com o botão esquerdo
- **Zoom**: Use a roda do mouse
- **Pan**: Shift + clique e arraste

### Seleção de Elementos
- **Zona**: Clique na estrutura geral da edificação
- **Paredes**: Clique nas superfícies verticais
- **Janelas**: Clique nas superfícies transparentes
- **Piso/Teto**: Clique nas superfícies horizontais

### Edição de Propriedades
1. Selecione um elemento no canvas 3D
2. Use o painel de propriedades à direita para editar:
   - Dimensões da zona (largura, comprimento, altura)
   - Orientação do norte
   - Materiais dos elementos

### Exportação
- **JSON**: Para salvar o projeto e continuar depois
- **IDF**: Para simulação no EnergyPlus
- **Simulação**: Execução direta via API (em desenvolvimento)

## 🛠️ Tecnologias

- **React**: Interface de usuário
- **TypeScript**: Tipagem e robustez
- **Three.js**: Renderização 3D
- **@react-three/fiber**: Integração React + Three.js
- **@react-three/drei**: Componentes 3D prontos
- **Zustand**: Gerenciamento de estado
- **Styled Components**: Estilização

## 📦 Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

A aplicação estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── 3d/                 # Componentes Three.js
│   │   ├── BasicCanvas3D.tsx
│   │   ├── BasicZone.tsx
│   │   └── BasicNorthIndicator.tsx
│   └── ui/                 # Interface do usuário
│       ├── SimpleToolbar.tsx
│       ├── BasicPropertiesPanel.tsx
│       └── BasicElementTree.tsx
├── store-simple.ts         # Gerenciamento de estado
├── WorkingApp.tsx          # Componente principal
└── main.tsx                # Ponto de entrada
```

## 🔄 Status Atual

### ✅ Implementado
- Canvas 3D com controles de navegação
- Modelo básico com zona retangular
- Sistema de seleção interativo
- Painéis de propriedades e árvore de elementos
- Exportação para JSON e IDF
- Interface responsiva e moderna

### 🔧 Em Desenvolvimento
- Múltiplas zonas
- Mais tipos de elementos construtivos
- Biblioteca de materiais expandida
- Integração real com API JessWeb
- Edição direta no canvas 3D
- Visualização de resultados de simulação

### 🎯 Próximas Funcionalidades
- Importação de arquivos DWG/IFC
- Biblioteca de objetos arquitetônicos
- Análise de desempenho energético
- Relatórios automatizados
- Colaboração em tempo real

## 🤝 Contribuição

Este projeto está em desenvolvimento ativo. Contribuições são bem-vindas!

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

**Tropos3D** - Democratizando a simulação energética de edificações 🏢⚡

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
