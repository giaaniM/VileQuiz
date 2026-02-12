# 🎮 VileQuiz - AI-Powered Multiplayer Quiz Platform

Web app multiplayer in tempo reale con generazione dinamica delle domande tramite AI (Groq/Llama) e sistema avanzato anti-allucinazione.

## 🚀 Live Demo
👉 **Gioca Ora:** [https://vilequiz.onrender.com](https://vilequiz.onrender.com)

---

## 💻 Local Development

### 1. Installare le dipendenze
Assicurati di avere Node.js installato.

```bash
npm run install:all
```

### 2. Avviare l'applicazione
In modalità sviluppo (con hot-reload):

```bash
npm run dev
```

Questo avvierà:
- **Client**: http://localhost:5173 (Proxy su API)
- **Server**: http://localhost:3001
- **API**: http://localhost:3001/api/health

> **Nota:** Il progetto è configurato per funzionare "Zero-Config" in locale. La chiave API di test è inclusa (offuscata) per facilitare lo sviluppo.

## 📁 Struttura Progetto

```
VileQuiz/
├── client/                 # React frontend (Vite)
├── server/                 # Node.js backend
├── docs/                   # Documentazione estesa
├── docker-compose.yml      # MongoDB + Redis
└── package.json            # Root package
```

## 🎯 Features Principali

- 🧠 **AI Anti-Hallucination System**: Sistema a 4 livelli (Retry loop, Fact-checker deterministico, Anti-fact-stacking) per garantire domande reali e verificabili.
- ✨ **Generazione Dinamica**: Domande sempre nuove tramite Groq/Llama.
- 🌐 **Multiplayer Real-time**: Basato su Socket.IO.
- 📱 **QR Code Join**: Entra in partita in un secondo scansionando il codice.
- 🎮 **Mobile Controller**: Usa il tuo smartphone per rispondere selezionando A, B, C o D.
- 📊 **Classifica Animata**: Visualizza i sorpassi in tempo reale sul grande schermo.
- 🏆 **Duolingo-style UI**: Design premium, scuro e moderno.

## 📝 Setup API

Assicurati di creare un file `.env` in `server/` con la tua API Key di Groq:
```bash
GROQ_API_KEY=tua_chiave_qui
```

## 🛠️ Tech Stack

**Frontend**: React 18, Vite, TailwindCSS, Framer Motion, Socket.IO Client.  
**Backend**: Node.js 20, Express, Socket.IO, MongoDB, Redis, Groq API.
