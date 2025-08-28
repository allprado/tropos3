#!/bin/bash
# Script de instalação do EnergyPlus para Railway/Render

set -e

echo "🔧 Iniciando instalação do EnergyPlus..."

# Diretório temporário
cd /tmp

# Baixar EnergyPlus 22.2.0 (versão compatível com Ubuntu)
echo "📥 Baixando EnergyPlus 22.2.0..."
wget -q https://github.com/NREL/EnergyPlus/releases/download/v22.2.0/EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64.sh

# Tornar o instalador executável
chmod +x EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64.sh

# Instalar EnergyPlus sem interação
echo "🚀 Instalando EnergyPlus..."
./EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64.sh --skip-license --prefix=/usr/local

# Criar links simbólicos
echo "🔗 Criando links simbólicos..."
ln -sf /usr/local/EnergyPlus-22-2-0/energyplus /usr/local/bin/energyplus
ln -sf /usr/local/EnergyPlus-22-2-0/ExpandObjects /usr/local/bin/ExpandObjects

# Verificar instalação
echo "✅ Verificando instalação..."
if [ -f "/usr/local/EnergyPlus-22-2-0/energyplus" ]; then
    echo "🎉 EnergyPlus instalado com sucesso!"
    echo "📍 Localização: /usr/local/EnergyPlus-22-2-0/"
    /usr/local/EnergyPlus-22-2-0/energyplus --version
else
    echo "❌ Falha na instalação do EnergyPlus"
    exit 1
fi
