# Integrazione LLM - Groq API

## ⭐ Configurazione Groq (RACCOMANDATO)

### Credenziali

```bash
API_KEY=YOUR_API_KEY_HERE
ENDPOINT=https://api.groq.com/openai/v1/chat/completions
MODEL=llama-3.3-70b-versatile
```

### File .env

```bash
GROQ_API_KEY=YOUR_API_KEY_HERE
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MAX_TOKENS=2000
GROQ_TEMPERATURE=0.7
```

## 🚀 Perché Groq è IDEALE

- ✅ **Velocità**: ~900 tokens/sec (IL PIÙ VELOCE disponibile)
- ✅ **Latency**: ~15ms time-to-first-token
- ✅ **Context**: 128k tokens
- ✅ **Free tier**: 30 req/min, 6,000 req/day
- ✅ **Costo**: $0 (free tier) o $0.59/$0.79 per 1M tokens (paid)
- ✅ **Generazione domande**: < 2 secondi (critico per UX)
- ✅ **NO cold starts**: sempre hot

## 📊 Performance Attese

- Time to first token: ~15ms
- Tokens per secondo: ~900
- Generazione 10 domande: 1.5-2.5 secondi
- Rate limits free tier: 30 req/min, 6,000/day

## 🎯 Template Prompt Base

```
Sei un generatore di quiz educativi per un gioco multiplayer.
Genera esattamente {N} domande sulla categoria: {CATEGORIA}

REQUISITI:
- Difficoltà: medio-semplice (adatto a studenti 14-18 anni o adulti casual)
- Ogni domanda deve avere esattamente 4 risposte (A, B, C, D)
- Solo 1 risposta corretta per domanda
- Le risposte sbagliate devono essere plausibili ma chiaramente distinguibili
- Domande chiare, concise, senza ambiguità
- Evita domande che richiedono conoscenze ultra-specifiche
- Varia la tipologia: fatti, definizioni, confronti, cause-effetti

FORMATO OUTPUT (JSON):
{
  "questions": [
    {
      "id": 1,
      "text": "Dove si trova il Taj Mahal?",
      "answers": {
        "A": "Malaysia",
        "B": "Sri Lanka",
        "C": "India",
        "D": "Yemen"
      },
      "correct": "C",
      "difficulty": "easy",
      "category": "Geografia"
    }
  ]
}

Genera ora {N} domande seguendo rigorosamente questo formato.
```

## 📚 Esempi Prompt per Categoria

### GEOGRAFIA
- Focus: capitali, monumenti famosi, mari/fiumi, curiosità geografiche
- Esempio: "Qual è il fiume più lungo del mondo?"

### STORIA
- Focus: eventi chiave, personaggi storici, date importanti, invenzioni
- Esempio: "In che anno è caduto il Muro di Berlino?"

### SCIENZA
- Focus: fisica base, chimica, biologia, corpo umano, astronomia
- Esempio: "Quanti pianeti ci sono nel sistema solare?"

### POP CULTURE
- Focus: film, musica, sport, videogiochi, meme, trend
- Esempio: "Chi ha diretto il film Inception?"

## 🔄 Alternative Groq Models

1. **llama-3.1-70b-versatile** - Simile a 3.3, leggermente più lento
2. **llama-3.1-8b-instant** - Ultra rapido (1000+ tokens/sec) ma meno accurato
3. **mixtral-8x7b-32768** - Buon bilanciamento velocità/qualità

## 🔄 Alternative se Groq rate limit

- Ollama + Llama 3.1 (8B) self-hosted - Richiede GPU server
- Together AI - Llama 3.1 405B - free tier limitato
- OpenRouter - Vari modelli free rotation
