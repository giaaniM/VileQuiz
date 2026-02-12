# PROMPT 3: Sistema Lobby + QR Code

## 🎯 Obiettivo
Implementare lobby multiplayer con join via QR code.

## 🔧 Backend

### Socket.IO Events

1. **create-game**
   - Genera PIN 6 cifre univoco
   - Crea game in Redis
   - Ritorna game_id e PIN
   
2. **join-game**
   - Valida PIN
   - Assegna avatar casuale
   - Aggiunge player al game
   - Broadcast update ai client
   
3. **update-nickname**
   - Valida nickname (max 12 char)
   - Aggiorna player
   - Broadcast update
   
4. **start-game**
   - Valida min 2 players
   - Cambia status a "active"
   - Trigger generazione domande

### Game Manager
- PIN univoci (check collision)
- Pool 20 avatar diversi
- Max 50 players per game

## 🎨 Frontend Host

1. **QR code grande** con react-qr-code
   - URL: `{app_url}/play?pin={pin}`
2. **PIN numerico** visibile (80px font)
3. **Lista players** real-time:
   - Avatar
   - Nickname
   - Status connesso
4. **Bottone "Avvia Partita"** (min 2 players)
5. **Animazione** player join: slide in

## 📱 Frontend Player

1. **Input PIN** manuale (fallback QR)
2. **Form nickname** (max 12 char)
3. **Avatar preview** (assegnato automaticamente)
4. **Stato** "Waiting for host..."
5. **Lista altri players** in lobby

## 📦 Deliverable

- QR code funzionante che apre `/play?pin={pin}`
- Join flow completo mobile
- Lista players aggiornata in real-time
- Bottone start game funzionante
