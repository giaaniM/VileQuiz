# PROMPT 10: Testing + Deployment su Render

## 🎯 Obiettivo
Setup testing completo e deployment production-ready su Render.com.

## 🧪 Testing

### 1. Unit Tests (Vitest)

File: `server/src/services/LLMService.test.js`
```javascript
import { describe, it, expect, vi } from 'vitest';
import LLMService from './LLMService';

describe('LLMService', () => {
  it('should generate 10 questions', async () => {
    const questions = await LLMService.generateQuestions('Geografia', 10);
    expect(questions).toHaveLength(10);
    expect(questions[0]).toHaveProperty('text');
    expect(questions[0]).toHaveProperty('answers');
  });
});
```

Tests da creare:
- `LLMService.test.js`
- `GameService.test.js`
- `socketHandlers.test.js`

### 2. Integration Tests

File: `server/tests/integration/game-flow.test.js`
- Test completo: create game → join → generate questions → play → finish
- Mock Groq API
- Use real Redis/MongoDB (test containers)

### 3. E2E Tests (Playwright)

File: `tests/e2e/complete-game.spec.js`
```javascript
test('complete 3-question game flow', async ({ page, context }) => {
  // Host creates game
  await page.goto('/host');
  await page.click('text=Geografia');
  const pin = await page.textContent('[data-testid="game-pin"]');
  
  // Player joins
  const playerPage = await context.newPage();
  await playerPage.goto(`/play?pin=${pin}`);
  await playerPage.fill('input[name="nickname"]', 'TestPlayer');
  
  // Host starts
  await page.click('text=Avvia Partita');
  
  // Play 3 questions
  for (let i = 0; i < 3; i++) {
    await playerPage.click('[data-answer="A"]');
    await page.waitForTimeout(16000); // Wait for timer
  }
  
  // Verify final podium
  await expect(page.locator('text=CAMPIONE!')).toBeVisible();
});
```

### 4. Load Testing (Artillery)

File: `tests/load/game-load.yml`
```yaml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 50
      name: 'Sustained load - 50 concurrent players'
scenarios:
  - engine: socketio
    flow:
      - emit:
          channel: 'create-game'
          data: { category: 'Geografia' }
```

Run: `npx artillery run tests/load/game-load.yml`

## 🚀 Deployment su Render.com

### Step 1: Preparazione

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo>
   git push -u origin main
   ```

2. **Crea account Render**: render.com/signup

### Step 2: Deploy Backend

1. **New Web Service**
   - Dashboard → "New +" → "Web Service"
   - Connect GitHub repository
   - Name: `quiz-game-backend`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node src/server.js`
   - Plan: **Free** (per ora)

2. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   GROQ_API_KEY=YOUR_API_KEY_HERE
   GROQ_MODEL=llama-3.3-70b-versatile
   MONGODB_URI=<from MongoDB Atlas>
   REDIS_URL=<from Render Redis>
   ```

3. **Health Check**
   - Path: `/api/health`
   - Expected: 200 OK

### Step 3: Provision Redis

1. Dashboard → "New +" → "Redis"
2. Name: `quiz-game-redis`
3. Plan: **Free** (25MB, 10 connections)
4. Click "Create Redis"
5. Copy `REDIS_URL` → Add to backend env vars

### Step 4: Setup MongoDB Atlas

1. Vai su mongodb.com/atlas
2. Create cluster (FREE M0)
3. Database Access: crea user
4. Network Access: aggiungi `0.0.0.0/0`
5. Copy connection string → Add to `MONGODB_URI`

### Step 5: Deploy Frontend (Vercel)

1. **Vercel CLI**
   ```bash
   npm i -g vercel
   cd client
   vercel
   ```

2. **Environment Variable**
   ```
   VITE_API_URL=https://quiz-game-backend.onrender.com
   ```

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 6: Custom Domain (Opzionale)

- Render: Settings → Custom Domain
- Vercel: Settings → Domains

## 🔄 CI/CD Pipeline

File: `.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

## 📊 Monitoring

### Render Dashboard
- CPU usage
- Memory usage
- Request rate
- Response time
- Logs real-time

### Sentry (Error Tracking)
```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: 'production'
});
```

## 📦 Deliverable

- ✅ Unit tests > 80% coverage
- ✅ Integration tests funzionanti
- ✅ E2E test completo game flow
- ✅ Load test 50 concurrent players
- ✅ Backend deployed su Render
- ✅ Frontend deployed su Vercel
- ✅ Redis e MongoDB configurati
- ✅ CI/CD pipeline attivo
- ✅ Monitoring configurato
- ✅ README con istruzioni deploy

## 🎉 Production Checklist

- [ ] Environment variables configurate
- [ ] Health checks funzionanti
- [ ] CORS configurato correttamente
- [ ] Rate limiting attivo
- [ ] Logs strutturati
- [ ] Error handling robusto
- [ ] Database indexes ottimizzati
- [ ] Redis TTL configurati
- [ ] Backup strategy (MongoDB)
- [ ] SSL/HTTPS attivo
