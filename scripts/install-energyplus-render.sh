#!/bin/bash
# Script de instalação do EnergyPlus para Render.com

# Baixar e instalar EnergyPlus
cd /tmp
wget https://github.com/NREL/EnergyPlus/releases/download/v22.2.0/EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64.sh
chmod +x EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64.sh
sudo ./EnergyPlus-22.2.0-c249759bad-Linux-Ubuntu20.04-x86_64.sh --skip-license --prefix=/usr/local

# Criar links simbólicos
sudo ln -sf /usr/local/EnergyPlus-22-2-0/energyplus /usr/local/bin/energyplus
sudo ln -sf /usr/local/EnergyPlus-22-2-0/ExpandObjects /usr/local/bin/ExpandObjects

echo "EnergyPlus instalado com sucesso!"
echo "Versão instalada:"
energyplus --version
