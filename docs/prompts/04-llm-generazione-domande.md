# PROMPT 4: Integrazione LLM + Generazione Domande

## 🎯 Obiettivo
Implementare generazione AI delle domande con Groq API.

## ⚙️ Setup Groq API

### File .env
```bash
GROQ_API_KEY=YOUR_API_KEY_HERE
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_URL=https://api.groq.com/openai/v1/chat/completions
```

## 🔧 Backend - LLMService

File: `server/src/services/LLMService.js`

### Metodi
1. **generateQuestions(category, count)**
   - Chiama Groq API
   - Retry logic: 3 tentativi con exponential backoff
   - Timeout: 30s per request
   - Fallback a domande pre-generate se API offline

2. **buildPrompt(category, count)**
   - Template prompt dalla documentazione
   - Personalizzato per categoria

3. **parseQuestions(content)**
   - Parser JSON response robusto
   - Schema validation
   - Quality checks: lunghezza, unicità risposte

4. **getFallbackQuestions(category, count)**
   - Ritorna domande pre-generate da JSON

### Groq API Call Example
```javascript
const response = await fetch(process.env.GROQ_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000
  })
});
```

## 📊 Rate Limiting

- Free tier: 30 req/min, 6,000/day
- Implementa queue system per batch requests
- Cache domande generate in Redis (TTL 24h)

## 🎨 Frontend

1. **Loading screen** "Generando domande..."
2. **Progress bar** animata
3. **Timeout UI** dopo 40s con retry
4. **Error state**: fallback a domande default

## 📦 Deliverable

- LLMService funzionante con Groq
- Generazione 10 domande < 3 secondi
- Cache Redis attivo
- Fallback questions JSON pronto
- Loading UI smooth
