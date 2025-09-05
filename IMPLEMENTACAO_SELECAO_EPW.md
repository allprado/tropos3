# 🌍 Implementação do Campo de Seleção de EPW

## 📋 **Resumo**

Implementado um campo de seleção no painel de propriedades do edifício para escolher arquivos EPW das cidades brasileiras disponíveis na pasta `/public/epw`. O sistema implementa priorização entre arquivo customizado e seleção predefinida.

## 🎯 **Funcionalidades Implementadas**

### **1. Campo de Seleção de Cidade**
- ✅ Dropdown com 6 cidades brasileiras disponíveis
- ✅ Fortaleza - CE definida como padrão
- ✅ Labels amigáveis para identificação das cidades

### **2. Sistema de Priorização**
- ✅ **Arquivo customizado** tem prioridade sobre seleção
- ✅ **Seleção da lista** é usada quando não há arquivo customizado
- ✅ Indicação visual de qual EPW está sendo usado

### **3. Carregamento Automático de Dados**
- ✅ Extração automática de dados de localização do EPW selecionado
- ✅ Integração com função `parseEpwLocation` existente
- ✅ Fallback para arquivo padrão do servidor se nenhum estiver disponível

## 🔧 **Arquivos Modificados**

### **`src/store-simple.ts`**
- Adicionado campo `selectedEpw` à interface `Building`
- Criada ação `setBuildingSelectedEpw`
- Implementada lógica de priorização na função `runSimulation`
- Padrão definido para Fortaleza

### **`src/components/ui/BasicPropertiesPanel.tsx`**
- Adicionada constante `AVAILABLE_EPW_FILES` com lista de cidades
- Criado handler `handleEpwSelectionChange` com carregamento automático
- Implementados campos de seleção e indicações visuais
- Interface intuitiva com feedback visual

## 🏙️ **Cidades Disponíveis**

| Cidade | Estado | Arquivo EPW |
|--------|--------|-------------|
| **Fortaleza** ⭐ | CE | `BRA_CE_Fortaleza.817580_TMYx.2009-2023.epw` |
| Manaus | AM | `BRA_AM_Manaus-Gomes.Intl.AP.821110_TMYx.2009-2023.epw` |
| Brasília | DF | `BRA_DF_Brasilia.867150_TMYx.2009-2023.epw` |
| Rio de Janeiro | RJ | `BRA_RJ_Rio.de.Janeiro-Santos.Dumont.AP.837550_TMYx.2009-2023.epw` |
| Porto Alegre | RS | `BRA_RS_Porto.Alegre.869880_TMYx.2009-2023.epw` |
| São Paulo | SP | `BRA_SP_Sao.Paulo-Congonhas.AP.837800_TMYx.2009-2023.epw` |

⭐ = Padrão

## 🔄 **Fluxo de Funcionamento**

### **1. Seleção de Cidade**
1. Usuário seleciona cidade no dropdown
2. Sistema carrega automaticamente o EPW correspondente
3. Dados de localização são extraídos e armazenados
4. Arquivo customizado (se houver) é limpo

### **2. Upload de Arquivo Customizado**
1. Usuário faz upload de arquivo .epw
2. Sistema processa e extrai dados de localização
3. Arquivo customizado sobrescreve seleção da lista

### **3. Simulação**
1. Sistema verifica se há arquivo customizado
2. Se não houver, usa arquivo da seleção da lista
3. Se nenhum estiver disponível, usa padrão do servidor
4. Logs informativos indicam qual EPW está sendo usado

## 💡 **Interface de Usuário**

### **Indicações Visuais:**
- 🟦 **Azul**: EPW da seleção está sendo usado
- 🟢 **Verde**: Arquivo customizado está sendo usado
- ℹ️ **Info**: Qual cidade/arquivo está ativo
- 📁 **Ícone**: Arquivo customizado carregado

### **Feedback para o Usuário:**
- Mensagem clara sobre qual EPW está sendo usado
- Indicação quando arquivo customizado sobrescreve seleção
- Labels descritivas para as cidades

## ✅ **Status da Implementação**

- ✅ Campo de seleção funcionando
- ✅ Priorização implementada
- ✅ Carregamento automático de dados
- ✅ Interface intuitiva
- ✅ Integração com sistema de simulação
- ✅ Compatibilidade com funcionalidades existentes
- ✅ Fortaleza definida como padrão

**Status**: ✅ **Implementado e funcional!**
