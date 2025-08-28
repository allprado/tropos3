#!/bin/bash
# Script alternativo de instalação do EnergyPlus para Railway/Render
# Baixa apenas os binários essenciais

set -e

echo "🔧 Iniciando instalação do EnergyPlus (método alternativo)..."

# Criar diretório do EnergyPlus
ENERGYPLUS_DIR="/usr/local/EnergyPlus-22-2-0"
mkdir -p "$ENERGYPLUS_DIR"

cd /tmp

# Baixar apenas o arquivo tar.gz que não precisa de instalação interativa
echo "📥 Baixando EnergyPlus 22.2.0 (arquivo tar)..."
wget -q https://github.com/NREL/EnergyPlus/releases/download/v22.2.0/EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64.tar.gz

# Extrair o arquivo
echo "📦 Extraindo EnergyPlus..."
tar -xzf EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64.tar.gz

# Copiar os arquivos para o diretório de instalação
echo "📋 Copiando arquivos..."
cp -r EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64/* "$ENERGYPLUS_DIR"/

# Tornar os executáveis permissivos
chmod +x "$ENERGYPLUS_DIR"/energyplus
chmod +x "$ENERGYPLUS_DIR"/ExpandObjects

# Criar links simbólicos
echo "🔗 Criando links simbólicos..."
ln -sf "$ENERGYPLUS_DIR"/energyplus /usr/local/bin/energyplus
ln -sf "$ENERGYPLUS_DIR"/ExpandObjects /usr/local/bin/ExpandObjects

# Verificar instalação
echo "✅ Verificando instalação..."
if [ -f "$ENERGYPLUS_DIR/energyplus" ]; then
    echo "🎉 EnergyPlus instalado com sucesso!"
    echo "📍 Localização: $ENERGYPLUS_DIR"
    "$ENERGYPLUS_DIR/energyplus" --version
else
    echo "❌ Falha na instalação do EnergyPlus"
    exit 1
fi
