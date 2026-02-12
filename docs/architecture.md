# Architettura Tecnica

## 📦 Stack Tecnologico

### FRONTEND

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| React | 18.x | UI components e state management |
| React Router | 6.x | Routing SPA |
| Socket.IO Client | 4.x | WebSocket real-time |
| Framer Motion | 10.x | Animazioni fluide |
| QRCode.react | 3.x | Generazione QR codes |
| Tailwind CSS | 3.x | Styling responsive |
| Howler.js | 2.x | Audio/musiche |

### BACKEND

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| Node.js | 20.x LTS | Runtime server |
| Express | 4.x | Web server e API |
| Socket.IO | 4.x | WebSocket server |
| LlamaIndex / Ollama | Latest | LLM integration |
| MongoDB | 6.x | Database (categorie/stats) |
| Redis | 7.x | Cache sessioni/game state |

## 🏛️ Architettura a 3 Tier

### PRESENTATION LAYER (Client)
- **Host App (Desktop)**: selezione categorie, controllo game, visualizzazione domande e classifiche
- **Player App (Mobile)**: lobby join, nickname, controller A/B/C/D, feedback istantaneo

### APPLICATION LAYER (Server)
- **Game Manager**: orchestrazione partite, timer, scoring
- **Socket Handler**: gestione connessioni WebSocket
- **LLM Service**: generazione domande AI
- **Category Service**: gestione categorie e immagini stock

### DATA LAYER
- **MongoDB**: categorie, domande generate, statistiche
- **Redis**: game state in-memory, sessioni attive

## 📊 Performance Targets

- ⚡ Latency Socket.IO < 100ms
- 🎬 Animations 60fps stabili
- 🚀 First Contentful Paint < 1.5s
- ⏱️ Time to Interactive < 3s
- 📈 Lighthouse score > 90
- 👥 Supporto 50+ concurrent players

## 🌐 Browser Support

- ✅ Chrome/Edge 120+
- ✅ Firefox 120+
- ✅ Safari 17+ (iOS/macOS)
- ✅ Mobile Chrome Android 120+
- ✅ Mobile Safari iOS 17+
