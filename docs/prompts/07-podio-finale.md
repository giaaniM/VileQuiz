# PROMPT 7: Podio Finale + Celebrazione

## 🎯 Obiettivo
Implementare schermata finale con celebrazione vincitore.

## 🎨 Frontend Host

### FinalPodium Component

1. **Confetti Explosion**
   - Usa `react-confetti` o custom canvas
   - Trigger al mount
   - Durata: 5 secondi
   - Colori: oro, argento, bronzo

2. **Podio 3D**
   - TOP 3 con avatar giganti
   - Altezze diverse:
     - 1° posto: 200px
     - 2° posto: 150px
     - 3° posto: 120px
   - Zoom in animation da sopaspetto

3. **Vincitore Highlight**
   - Nome con glow pulsante
   - Corona emoji 👑
   - Score finale grande
   - Phrase: "CAMPIONE!" animato

4. **Statistiche Globali**
   - Domande totali
   - Players totali
   - % risposte corrette media
   - Miglior streak
   - Tempo medio risposta

5. **Action Buttons**
   - "Gioca Ancora" → reset con stessa categoria
   - "Cambia Categoria" → torna a CategorySelection
   - "Condividi Risultati" → (opzionale, social share)

### Audio
- **Inno vittoria**: 10s orchestrale
- **Applausi**: loop background
- **Fanfara**: al reveal vincitore

## 📱 Frontend Player

### Personal Results Card

1. **Posizione Finale**
   - Grande badge con posizione
   - Emoji based on position:
     - 1°: 🏆
     - 2-3°: 🎉
     - 4-10°: 👏
     - 11+: 💪

2. **Stats Personali**
   - Risposte corrette / totali
   - % accuratezza
   - Miglior streak
   - Punti totali

3. **Celebration Animation**
   - 1° posto: gold particles explosion
   - 2-3° posto: silver/bronze sparkles
   - Altri: gentle fade in

4. **Rating Experience**
   - "Com'è stata la partita?"
   - 1-5 stelle (⭐)
   - Salva feedback in DB

## 🔧 Backend

### Save Statistics
```javascript
// POST /api/games/:gameId/finish
{
  game_id: ObjectId,
  total_players: 12,
  total_questions: 10,
  avg_correct_percentage: 67.5,
  avg_response_time: 8.3,
  winner: "Player1",
  winner_score: 900,
  leaderboard: [...],
  created_at: ISODate
}
```

### Cleanup
- Salva game in MongoDB (collection: games)
- Salva statistiche (collection: statistics)
- Rimuovi game da Redis
- Emit `game-finished` a tutti i client
- Disconnect sockets dopo 30s

## 📦 Deliverable

- Podio 3D animato
- Confetti explosion funzionante
- Stats salvate in MongoDB
- Player personal results
- Rating system
- Bottoni navigation funzionanti
