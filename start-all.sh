#!/bin/bash

# Script per avviare Backend e Frontend
echo "🚀 Avvio VileQuiz..."

# 1. Ferma eventuali processi vecchi
./stop-all.sh

# 2. Avvia Server
echo "Si parte con il SERVER..."
cd server
npm run dev > ../server.log 2>&1 &
SERVER_PID=$!
echo "✅ Server avviato (PID: $SERVER_PID)"

# 3. Avvia Client
echo "Si parte con il CLIENT..."
cd ../client
npm run dev > ../client.log 2>&1 &
CLIENT_PID=$!
echo "✅ Client avviato (PID: $CLIENT_PID)"

# Ottieni IP locale
LOCAL_IP=$(ipconfig getifaddr en0)
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ipconfig getifaddr en1)
fi
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi

# Apri il browser
sleep 2
open "http://$LOCAL_IP:5173"

echo "
🎉 Tutto pronto!
- Frontend: http://$LOCAL_IP:5173
- Backend: http://localhost:3001
- Log Server: tail -f server.log
- Log Client: tail -f client.log
"
