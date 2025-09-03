#!/bin/bash
# Script alternativo de instalação do EnergyPlus para Railway/Render
# Baixa EnergyPlus 8.9.0

set -e

echo "🔧 Iniciando instalação do EnergyPlus 8.9.0 (método alternativo)..."

# Criar diretório do EnergyPlus
ENERGYPLUS_DIR="/usr/local/EnergyPlus-8-9-0"
mkdir -p "$ENERGYPLUS_DIR"

cd /tmp

# Baixar EnergyPlus 8.9.0
echo "📥 Baixando EnergyPlus 8.9.0..."
wget -q https://github.com/NREL/EnergyPlus/releases/download/v8.9.0/EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh

# Tornar o instalador executável
chmod +x EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh

# Instalar EnergyPlus aceitando a licença automaticamente
echo "� Instalando EnergyPlus..."
echo "y" | ./EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh --prefix=/usr/local

# Criar links simbólicos
echo "🔗 Criando links simbólicos..."
ln -sf "$ENERGYPLUS_DIR"/energyplus-8.9.0 /usr/local/bin/energyplus
ln -sf "$ENERGYPLUS_DIR"/ExpandObjects /usr/local/bin/ExpandObjects

# Verificar instalação
echo "✅ Verificando instalação..."
if [ -f "$ENERGYPLUS_DIR/energyplus-8.9.0" ]; then
    echo "🎉 EnergyPlus 8.9.0 instalado com sucesso!"
    echo "📍 Localização: $ENERGYPLUS_DIR"
    "$ENERGYPLUS_DIR/energyplus-8.9.0" --version
else
    echo "❌ Falha na instalação do EnergyPlus"
    exit 1
fi
