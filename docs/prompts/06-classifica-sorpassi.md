# PROMPT 6: Classifica Animata + Sorpassi

## 🎯 Obiettivo
Implementare sistema classifica con animazioni sorpassi.

## 🔧 Backend

### Calcolo Ranking
- Ordina players per score DESC
- Tracking posizioni precedenti
- Detect sorpassi (posizione attuale vs precedente)
- Emit `leaderboard-update` dopo ogni domanda

### Event Data
```javascript
{
  leaderboard: [
    {
      socket_id: "xyz",
      nickname: "Player1",
      avatar: "viking",
      score: 800,
      position: 1,
      previous_position: 2,  // Per animazione sorpasso
      is_new_leader: true
    }
  ],
  overtakes: [
    { player: "Player1", old_pos: 2, new_pos: 1 }
  ]
}
```

## 🎨 Frontend Host

### LeaderboardScreen Component
- Display TOP 5 players
- Podio 3D per top 3
- Lista 4° e 5° sotto

### Podio Colors
- 1° posto: Gradient oro `#FFD700` → `#FFA500`
- 2° posto: Gradient argento `#C0C0C0` → `#A9A9A9`
- 3° posto: Gradient bronzo `#CD7F32` → `#8B4513`
- Altri: Bianco/grigio

### Animazioni Framer Motion

1. **Sort Animation**
```javascript
<AnimatePresence>
  {players.map((player, index) => (
    <motion.div
      key={player.id}
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  ))}
</AnimatePresence>
```

2. **Sorpasso Effect**
- Slide up con spring animation
- Trail particle effect dietro avatar
- Glow pulsante su nuovo leader

### Audio
- **Whoosh**: per ogni sorpasso
- **Fanfara**: per nuovo leader (#1)
- **Sparkle**: per top 3

## 📱 Frontend Player

### Personal Stats Card
- Mostra solo posizione personale
- Score totale
- Badge se top 3:
  - 🥇 1° posto
  - 🥈 2° posto
  - 🥉 3° posto

### Motivational Messages
- 1°: "Sei in testa! 🔥"
- 2-3°: "Sul podio! Continua così! 💪"
- 4-10°: "Puoi farcela! 🚀"
- 11+: "Non mollare! ⭐"

## 📦 Deliverable

- Classifica animata dopo ogni domanda
- Sort animation smooth
- Audio sync con sorpassi
- Mobile personal stats
- Confetti per nuovo leader
