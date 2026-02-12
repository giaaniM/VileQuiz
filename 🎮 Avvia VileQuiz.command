#!/bin/bash

# Script per avviare VileQuiz con doppio click
# Questo file si può cliccare direttamente dal Finder

# Ottieni la directory del progetto (dove si trova questo script)
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎮 VILEQUIZ - Avvio Automatico"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Killa processi esistenti
echo "🧹 Pulizia processi esistenti..."
pkill -9 -f "nodemon.*server" 2>/dev/null && echo "   ✓ Server fermato"
pkill -9 -f "vite" 2>/dev/null && echo "   ✓ Client fermato"
# Killa forzatamente porta 3001
lsof -t -i:3001 | xargs kill -9 2>/dev/null && echo "   ✓ Porta 3001 liberata"
sleep 2
echo ""

# Avvia il server
echo "🚀 Avvio SERVER (porta 3001)..."
cd "$PROJECT_DIR/server"
npm run dev > "$PROJECT_DIR/server.log" 2>&1 &
SERVER_PID=$!
echo "   ✓ Server PID: $SERVER_PID"
sleep 3
echo ""

# Avvia il client
echo "🎨 Avvio CLIENT (porta 5173)..."
cd "$PROJECT_DIR/client"
npm run dev > "$PROJECT_DIR/client.log" 2>&1 &
CLIENT_PID=$!
echo "   ✓ Client PID: $CLIENT_PID"
sleep 3
echo ""

# Verifica che tutto funzioni
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ VileQuiz è ATTIVO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Ottieni IP locale (Wi-Fi solitamente è en0, o en1)
LOCAL_IP=$(ipconfig getifaddr en0)
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ipconfig getifaddr en1)
fi
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi

# Apri il browser automaticamente
echo "🌐 Apro il browser su: http://$LOCAL_IP:5173"
open "http://$LOCAL_IP:5173"

echo ""
echo "📍 Indirizzi:"
echo "   • Frontend:  http://$LOCAL_IP:5173"
echo "   • Backend:   http://localhost:3001"
echo ""
echo "📝 Log salvati in:"
echo "   • Server: $PROJECT_DIR/server.log"
echo "   • Client: $PROJECT_DIR/client.log"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Apri il browser e vai su: http://localhost:5173"
echo ""
echo "🛑 Per FERMARE tutto:"
echo "   Chiudi questa finestra oppure premi Cmd+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Log in tempo reale (premi Ctrl+C per uscire):"
echo ""

# Mostra i log in tempo reale
tail -f "$PROJECT_DIR/server.log" "$PROJECT_DIR/client.log"

# Se l'utente preme Ctrl+C, killa tutto
trap 'echo ""; echo "🛑 Stopping..."; pkill -9 -f "nodemon.*server"; pkill -9 -f "vite"; echo "✅ Tutto fermato!"; exit' INT
