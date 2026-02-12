# VileQuiz - Guida Avvio Rapido 🚀

## Scripts Disponibili

### 1. Avvia tutto (CONSIGLIATO)
```bash
./start-all.sh
```
Avvia sia il server (porta 3001) che il client (porta 5173) in background.

### 2. Avvia solo il server
```bash
./start-server.sh
```
Avvia solo il backend sulla porta 3001.

### 3. Avvia solo il client
```bash
./start-client.sh
```
Avvia solo il frontend sulla porta 5173.

### 4. Ferma tutto
```bash
./stop-all.sh
```
Ferma tutti i processi server e client.

## Workflow Tipico

1. **Prima volta:**
   ```bash
   cd /Users/valeriopadovano/applicazioni/VileQuiz
   ./start-all.sh
   ```

2. **Apri il browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api/health

3. **Dopo cambio WiFi:**
   ```bash
   ./stop-all.sh
   ./start-all.sh
   ```

4. **Per vedere i log:**
   ```bash
   tail -f server.log   # Log del server
   tail -f client.log   # Log del client
   ```

## Porte Utilizzate

- **3001**: Server Express + Socket.IO (backend)
- **5173**: Vite Dev Server (frontend)

## Note

- Gli script killano automaticamente i processi esistenti prima di riavviare
- I log vengono salvati in `server.log` e `client.log`
- Se cambi WiFi, basta fare `./stop-all.sh` e poi `./start-all.sh`
