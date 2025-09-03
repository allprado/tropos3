const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configuração CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Configuração do multer para upload de arquivos (usando /tmp na Vercel)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = '/tmp/uploads';
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Diretórios de trabalho (usando /tmp na Vercel)
const TEMP_DIR = '/tmp';
const SIMULATIONS_DIR = path.join(TEMP_DIR, 'simulations');

// Store das simulações em memória
const simulations = new Map();

// Garantir que os diretórios existam
fs.ensureDirSync(TEMP_DIR);
fs.ensureDirSync(SIMULATIONS_DIR);

// Interface para resultado da simulação
class SimulationResult {
  constructor() {
    this.id = '';
    this.status = 'queued'; // 'running' | 'completed' | 'error' | 'queued'
    this.startTime = new Date();
    this.endTime = null;
    this.idfContent = '';
    this.epwFile = '';
    this.outputs = {};
    this.errors = [];
    this.warnings = [];
    this.logs = [];
  }
}

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: 'vercel'
  });
});

// Endpoint para executar simulação
app.post('/simulate', upload.single('epwFile'), async (req, res) => {
  try {
    const { idfContent } = req.body;
    const epwFile = req.file;

    if (!idfContent) {
      return res.status(400).json({ error: 'Conteúdo IDF é obrigatório' });
    }

    // Gerar ID único para a simulação
    const simulationId = uuidv4();
    const simulationDir = path.join(SIMULATIONS_DIR, simulationId);
    
    // Criar diretório da simulação
    await fs.ensureDir(simulationDir);

    // Salvar arquivo IDF
    const idfPath = path.join(simulationDir, 'input.idf');
    await fs.writeFile(idfPath, idfContent);

    // Copiar arquivo EPW se fornecido
    let epwPath = '';
    if (epwFile) {
      epwPath = path.join(simulationDir, 'weather.epw');
      await fs.copy(epwFile.path, epwPath);
      // Limpar arquivo temporário
      await fs.remove(epwFile.path);
    }

    // Criar entrada na store de simulações
    const simulation = new SimulationResult();
    simulation.id = simulationId;
    simulation.idfContent = idfContent;
    simulation.epwFile = epwFile?.originalname || '';

    simulations.set(simulationId, simulation);

    res.json({
      simulationId,
      status: 'queued',
      message: 'Simulação recebida (EnergyPlus não disponível na Vercel)'
    });

  } catch (error) {
    console.error('Erro ao iniciar simulação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para verificar status da simulação
app.get('/simulation/:id', (req, res) => {
  const { id } = req.params;
  const simulation = simulations.get(id);

  if (!simulation) {
    return res.status(404).json({ error: 'Simulação não encontrada' });
  }

  res.json(simulation);
});

// Endpoint para listar simulações
app.get('/simulations', (req, res) => {
  const simulationList = Array.from(simulations.values())
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  
  res.json(simulationList);
});

// Todas as rotas da API
app.use('/api', app);

module.exports = app;
