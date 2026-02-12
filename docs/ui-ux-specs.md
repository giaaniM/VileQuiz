# Specifiche UI/UX

## 🎨 Design System - Palette Colori

| Elemento | Colore | Uso |
|----------|--------|-----|
| Primary | `#2E3192` (blu Kahoot) | Background principale, CTA |
| Risposta A | `#E21B3C` (rosso) | Bottone A, triangolo |
| Risposta B | `#1368CE` (blu) | Bottone B, rombo |
| Risposta C | `#D89E00` (giallo) | Bottone C, cerchio |
| Risposta D | `#26890C` (verde) | Bottone D, quadrato |
| Correct | `#4CAF50` (verde) | Feedback risposta corretta |
| Wrong | `#F44336` (rosso) | Feedback risposta errata |
| Timeout | `#FFA726` (arancione) | Feedback tempo scaduto |

## 📝 Typography

- **Font principale**: Montserrat Bold per titoli
- **Font body**: Open Sans Regular
- **Domande**: 28px, line-height 1.4
- **Risposte mobile**: 20px, bold
- **Timer**: 48px, monospace

## ✨ Animazioni (Framer Motion)

| Elemento | Animazione | Durata |
|----------|-----------|--------|
| Lobby player join | Slide in from right + bounce | 0.3s |
| Countdown numeri | Scale 0→1.5→1 + fade | 0.8s |
| Bottoni risposta | Press: scale 0.95 + glow | 0.1s |
| Timer urgenza | Pulse scale 1→1.1 | 0.5s loop |
| Reveal corretta | Expand + glow pulsante | 0.6s |
| Classifica sorpassi | Slide up + trail effect | 0.8s |
| Confetti finale | Particle explosion | 2s |

## 🔊 Audio Design

- **Lobby BGM**: loop music leggero 110 BPM
- **Countdown**: tick-tock mechanic
- **Timer urgenza**: heartbeat accelerato
- **Risposta corretta**: ding victorioso
- **Risposta sbagliata**: buzzer fail
- **Sorpasso classifica**: whoosh + sparkle
- **Vittoria finale**: fanfara orchestrale

## 📱 Responsive Breakpoints

### Desktop (Host)
- Base: 1920x1080
- Tablet: 1366x768 (scale 0.85)
- Full-screen mode supportato
- Keyboard shortcuts (spazio, esc)

### Mobile (Player)
- Base: 390x844 (iPhone 14)
- Android: 360x800
- Landscape disabled (force portrait)
- Touch targets min 48x48px
- 60fps animations garantiti

## ♿ Accessibility

- Color contrast AA compliance
- Focus states per keyboard navigation
- Loading skeletons
- Error boundaries React
