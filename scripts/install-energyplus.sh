#!/bin/bash
# Script para instalar EnergyPlus em ambiente de produção

echo "🔧 Instalando EnergyPlus..."

# Criar diretório para EnergyPlus
mkdir -p /tmp/energyplus

# Baixar EnergyPlus (versão Linux)
cd /tmp/energyplus
wget https://github.com/NREL/EnergyPlus/releases/download/v8.9.0/EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh

# Tornar executável
chmod +x EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh

# Instalar silenciosamente
./EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh --mode unattended --prefix /opt/energyplus

# Criar link simbólico
ln -sf /opt/energyplus/energyplus-8.9.0 /usr/local/EnergyPlus-8-9-0

echo "✅ EnergyPlus instalado!"
