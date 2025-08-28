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

# Copiar os arquivos para o diretório de instalação
echo "📋 Copiando arquivos..."
cp -r EnergyPlus-8.9.0-40101eaafd-Linux-x86_64/* "$ENERGYPLUS_DIR"/

# Renomear o executável para o formato esperado pelo código
mv "$ENERGYPLUS_DIR/energyplus" "$ENERGYPLUS_DIR/energyplus-8.9.0" 2>/dev/null || true

# Tornar os executáveis permissivos
chmod +x "$ENERGYPLUS_DIR"/energyplus-8.9.0
chmod +x "$ENERGYPLUS_DIR"/ExpandObjects

# Criar links simbólicos
echo "🔗 Criando links simbólicos..."
ln -sf "$ENERGYPLUS_DIR"/energyplus-8.9.0 /usr/local/bin/energyplus
ln -sf "$ENERGYPLUS_DIR"/ExpandObjects /usr/local/bin/ExpandObjects

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
