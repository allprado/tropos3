#!/bin/bash

# Script para diagnosticar problemas de conectividade do Vite no GitHub Codespaces

echo "🔍 Diagnosticando Tropos3D..."
echo ""

# Verificar se o processo Vite está rodando
echo "📡 Verificando processo Vite:"
ps aux | grep vite | grep -v grep

echo ""
echo "🌐 Verificando conectividade de rede:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173

echo ""
echo "📋 Portas em uso:"
netstat -tlnp | grep 5173

echo ""
echo "🚀 URL do Codespace:"
echo "https://$CODESPACE_NAME-5173.app.github.dev/"

echo ""
echo "✅ Diagnóstico concluído!"
