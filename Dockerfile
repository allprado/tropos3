# Dockerfile para Render com EnergyPlus
FROM node:18-bullseye

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    gzip \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências do Node.js
RUN npm install

# Instalar EnergyPlus 8.9
RUN cd /tmp && \
    wget -q https://github.com/NREL/EnergyPlus/releases/download/v8.9.0/EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh && \
    chmod +x EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh && \
    echo "y" | ./EnergyPlus-8.9.0-40101eaafd-Linux-x86_64.sh --prefix=/usr/local && \
    ln -sf /usr/local/EnergyPlus-8-9-0/energyplus-8.9.0 /usr/local/bin/energyplus && \
    ln -sf /usr/local/EnergyPlus-8-9-0/ExpandObjects /usr/local/bin/ExpandObjects && \
    rm -rf /tmp/*

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001
ENV ENERGYPLUS_PATH=/usr/local/EnergyPlus-8-9-0/energyplus-8.9.0

# Exposer porta
EXPOSE 3001

# Comando de inicialização
CMD ["npm", "run", "server"]
