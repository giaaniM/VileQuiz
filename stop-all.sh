#!/bin/bash

echo "🛑 Fermando VileQuiz..."

# Killa nodemon (server)
pkill -f "nodemon.*server"
pkill -f "node.*src/server.js"

# Killa vite (client)
pkill -f "vite"

# Killa forzatamente qualsiasi cosa sulla porta 3001
lsof -t -i:3001 | xargs kill -9 2>/dev/null

echo "✅ Tutti i processi terminati."
