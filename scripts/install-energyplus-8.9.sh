#!/bin/bash
# Script de instalação do EnergyPlus 8.9 para Railway/Render

set -e

echo "🔧 Iniciando instalação do EnergyPlus 8.9..."

# Diretório de instalação
ENERGYPLUS_DIR="/usr/local/EnergyPlus-8-9-0"
mkdir -p "$ENERGYPLUS_DIR"

cd /tmp

# Baixar EnergyPlus 8.9.0 (versão tar.gz)
echo "📥 Baixando EnergyPlus 8.9.0..."
wget -q https://github.com/NREL/EnergyPlus/releases/download/v8.9.0/EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.tar.gz

# Extrair o arquivo
echo "📦 Extraindo EnergyPlus 8.9.0..."
tar -xzf EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.tar.gz

# Verificar conteúdo extraído
echo "🔍 Verificando arquivos extraídos..."
ls -la EnergyPlus-8.9.0-40101eaafd-Linux-x86_64/

# Copiar os arquivos para o diretório de instalação
echo "📋 Copiando arquivos..."
cp -r EnergyPlus-8.9.0-40101eaafd-Linux-x86_64/* "$ENERGYPLUS_DIR"/

# Verificar arquivos copiados
echo "🔍 Verificando arquivos no diretório de instalação..."
ls -la "$ENERGYPLUS_DIR"/

# Procurar pelo executável principal
EXEC_NAME=""
if [ -f "$ENERGYPLUS_DIR/energyplus" ]; then
    EXEC_NAME="energyplus"
    echo "✅ Encontrado: energyplus"
elif [ -f "$ENERGYPLUS_DIR/EnergyPlus" ]; then
    EXEC_NAME="EnergyPlus"
    echo "✅ Encontrado: EnergyPlus"
elif [ -f "$ENERGYPLUS_DIR/energyplus-8.9.0" ]; then
    EXEC_NAME="energyplus-8.9.0"
    echo "✅ Encontrado: energyplus-8.9.0"
else
    echo "❌ Executável do EnergyPlus não encontrado!"
    echo "Arquivos disponíveis:"
    find "$ENERGYPLUS_DIR" -name "*energy*" -type f
    exit 1
fi

# Renomear/criar o executável com o nome esperado
if [ "$EXEC_NAME" != "energyplus-8.9.0" ]; then
    echo "🔄 Renomeando $EXEC_NAME para energyplus-8.9.0..."
    mv "$ENERGYPLUS_DIR/$EXEC_NAME" "$ENERGYPLUS_DIR/energyplus-8.9.0"
fi

# Tornar os executáveis permissivos
chmod +x "$ENERGYPLUS_DIR"/energyplus-8.9.0
if [ -f "$ENERGYPLUS_DIR/ExpandObjects" ]; then
    chmod +x "$ENERGYPLUS_DIR"/ExpandObjects
fi

# Criar links simbólicos
echo "🔗 Criando links simbólicos..."
ln -sf "$ENERGYPLUS_DIR"/energyplus-8.9.0 /usr/local/bin/energyplus
if [ -f "$ENERGYPLUS_DIR/ExpandObjects" ]; then
    ln -sf "$ENERGYPLUS_DIR"/ExpandObjects /usr/local/bin/ExpandObjects
fi

# Verificar instalação
echo "✅ Verificando instalação..."
if [ -f "$ENERGYPLUS_DIR/energyplus-8.9.0" ]; then
    echo "🎉 EnergyPlus 8.9.0 instalado com sucesso!"
    echo "📍 Localização: $ENERGYPLUS_DIR"
    
    # Testar o executável
    if "$ENERGYPLUS_DIR/energyplus-8.9.0" --version; then
        echo "✅ EnergyPlus executável e funcionando!"
    else
        echo "⚠️ EnergyPlus instalado mas pode ter problemas de dependências"
        # Verificar dependências
        echo "🔍 Verificando dependências..."
        ldd "$ENERGYPLUS_DIR/energyplus-8.9.0" || true
    fi
else
    echo "❌ Falha na instalação do EnergyPlus"
    exit 1
fi
