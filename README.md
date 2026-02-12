# 🎮 VileQuiz - AI-Powered Multiplayer Quiz Platform

Web app multiplayer in tempo reale con generazione dinamica delle domande tramite AI (Groq/Llama) e sistema avanzato anti-allucinazione.

## 🚀 Quick Start

### 1. Installare le dipendenze

```bash
npm run install:all
```

### 2. Avviare l'applicazione

```bash
npm run dev
```

Questo avvierà:
- **Client**: http://localhost:5173
- **Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

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
