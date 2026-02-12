# PROMPT 1: Setup Progetto Base

## 🎯 Obiettivo
Creare la struttura base del progetto Quiz Game Web App con React + Express + Socket.IO + Database.

## 📁 Struttura Cartelle

```
quiz-game/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Host e Player pages
│   │   ├── hooks/         # Custom hooks (useSocket, useGame)
│   │   ├── utils/         # Helpers
│   │   ├── assets/        # Audio, images
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/      # GameService, LLMService
│   │   ├── socket/        # Socket.IO handlers
│   │   ├── models/        # MongoDB schemas
│   │   └── server.js
│   └── package.json
└── README.md
```

## ✅ Requisiti

1. Inizializza React con Vite + TailwindCSS
2. Setup Express server con Socket.IO
3. Configura MongoDB connection (mongoose)
4. Configura Redis client
5. Setup environment variables (.env.example)
6. Crea docker-compose.yml per MongoDB + Redis locale
7. Package.json scripts per dev concorrente (client + server)

## 📦 Deliverable

- Progetto inizializzato e funzionante
- `npm run dev` avvia client (port 5173) e server (port 3001)
- Health check endpoint `/api/health`
- Socket.IO connection test funzionante

## 🔧 Tecnologie da Installare

### Client
- react, react-dom
- react-router-dom
- socket.io-client
- framer-motion
- qrcode.react
- tailwindcss, postcss, autoprefixer
- howler

### Server
- express
- socket.io
- mongoose
- redis (ioredis)
- dotenv
- cors
- axios (per Groq API)

## 🐳 Docker Compose

Crea `docker-compose.yml` per:
- MongoDB 6.x
- Redis 7.x

## 📝 File .env.example

```bash
# Server
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/quiz-game

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Groq API
GROQ_API_KEY=your_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MAX_TOKENS=2000
GROQ_TEMPERATURE=0.7
```
