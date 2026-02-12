# PROMPT 5: Game Loop - Countdown e Domande

## 🎯 Obiettivo
Implementare il loop di gioco principale con timer e risposte.

## 🔧 Backend - Socket Events

1. **question-ready**
   - Emit domanda corrente a tutti i client
   - Include: testo, risposte, numero round, tempo

2. **answer-submitted**
   - Riceve risposta da player
   - Valida timing (entro 15s)
   - Salva risposta in game state

3. **time-up**
   - Chiude raccolta risposte
   - Calcola scores
   - Trigger reveal

4. **reveal-answer**
   - Emit risposta corretta
   - Emit feedback personalizzato per ogni player
   - Aggiorna scores

### Timer Server-Side
- Countdown 15s strict
- Broadcast ogni secondo per sync client
- Ultimi 5s: flag urgency

### Scoring
- +100 punti per risposta corretta
- NO bonus velocità
- Tracking streak (risposte consecutive corrette)

## 🎨 Frontend Host

### QuestionDisplay Component
- Header con numero round
- Testo domanda (28px, centrato)
- Timer circolare animato
  - Verde (15-10s)
  - Giallo (10-5s)
  - Rosso (5-0s)
- Audio tick-tock sincronizzato

### Timer Animation
- Cerchio SVG che si svuota
- Smooth transition colori
- Pulse animation ultimi 5s

### Reveal Animation
- Highlight risposta corretta in VERDE
- Expand + glow effect
- Mostra stats: "X/Y hanno risposto corretto"

## 📱 Frontend Player

### Controller A/B/C/D
- Layout 2x2 full-screen
- Colori Kahoot:
  - A: Rosso `#E21B3C`
  - B: Blu `#1368CE`
  - C: Giallo `#D89E00`
  - D: Verde `#26890C`
- Icone geometriche: △ ◇ ○ ▢

### Tap Interaction
- Select: scale 0.95 + glow border
- Vibration feedback (50ms)
- Cambio risposta permesso fino a scadenza

### Feedback Screen
- ✅ Risposta corretta: verde + "+100" animato + vittoria sound
- ❌ Risposta sbagliata: rosso + mostra corretta + fail sound
- ⏱️ Nessuna risposta: giallo + "Tempo scaduto!" + buzzer sound

## 📦 Deliverable

- Game loop completo per 1 domanda
- Timer sincronizzato host/player
- Controller mobile responsive
- Feedback istantaneo funzionante
- Audio sync con animazioni
