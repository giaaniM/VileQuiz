# Flusso di Gioco Dettagliato

## 📝 Fase 1: Setup (Host Desktop)

1. Host apre l'app su browser desktop
2. Visualizza griglia categorie con immagini stock e descrizione breve
3. Seleziona una categoria (es: Geografia, Storia, Scienza, Pop Culture)
4. Sistema genera PIN game univoco (6 cifre)
5. Viene mostrato QR code + PIN per join

## 🚪 Fase 2: Lobby (Players Mobile)

1. Player scansiona QR o inserisce PIN manualmente
2. Accede alla lobby, vede avatar casuale assegnato
3. Inserisce nickname (max 12 caratteri)
4. Vede nickname + avatar + punteggio 0
5. Desktop mostra lista players connessi in real-time
6. Host clicca 'Avvia Partita'

## 🤖 Fase 3: Generazione Domande

1. Backend chiama LLM con prompt specifico per categoria
2. LLM genera N domande (configurabile, default 10)
3. Ogni domanda: testo, 4 risposte (A/B/C/D), risposta corretta, difficoltà
4. Domande salvate in cache Redis per la partita

## 🎮 Fase 4: Round Loop (per ogni domanda)

### A. Schermata Preparatoria (3s)
- Desktop + Mobile: "Preparati!" con animazione pulsante
- Sfondo colorato dinamico
- Audio: suono carica energia

### B. Countdown (3s)
- Desktop + Mobile: "3... 2... 1... GO!"
- Animazione numeri con scale + fade
- Audio: tick-tock sincronizzato

### C. Visualizzazione Domanda (15s)
- **Desktop**: mostra domanda + numero round + timer circolare
- **Mobile**: bottoni A/B/C/D colorati (Rosso/Blu/Giallo/Verde)
- Timer visivo: barra progressiva che si svuota
- Ultimi 5s: timer lampeggia + audio urgenza

### D. Raccolta Risposte
- Player tocca A/B/C/D: bottone si illumina + feedback tattile (vibrazione)
- Risposta inviata via Socket.IO al server
- Desktop mostra contatore "X/Y hanno risposto"
- Player può cambiare risposta fino a scadenza timer

### E. Reveal Risposta Corretta
- **Desktop**: evidenzia risposta corretta in VERDE con animazione expand
- **Mobile**: mostra feedback personalizzato:
  - ✅ Risposta corretta: ✓ verde + punti guadagnati + suono vittoria
  - ❌ Risposta sbagliata: ✗ rosso + mostra corretta + suono errore
  - ⏱️ Nessuna risposta: "Tempo scaduto!" giallo + suono buzzer
- Durata reveal: 3 secondi

### F. Classifica Intermedia (5s)
- **Desktop**: podio animato TOP 5 giocatori
- Animazione sorpassi: se player sale posizioni → slide up con scia
- Colori podio: 1° oro, 2° argento, 3° bronzo, altri bianco
- **Mobile**: mostra posizione personale + punti totali
- Audio: fanfara crescente se leader cambia

## 🏆 Fase 5: Podio Finale

### Desktop
- Animazione esplosione confetti
- Mostra TOP 3 su podio 3D con avatar giganti
- Nome vincitore con effetto glow pulsante
- Statistiche partita: % risposte corrette, tempo medio
- Bottone "Gioca Ancora" / "Cambia Categoria"

### Mobile
- Celebrazione personalizzata basata su posizione finale
- Audio: inno vittoria per vincitore, applausi per altri
