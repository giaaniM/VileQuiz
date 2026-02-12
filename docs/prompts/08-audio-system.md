# PROMPT 8: Audio System + Musiche

## 🎯 Obiettivo
Implementare sistema audio completo con Howler.js.

## 🎵 Audio Assets (Royalty-Free)

### Download da Pixabay/FreePD/Freesound

1. **Background Music**
   - `lobby_bgm.mp3` - Loop leggero 110 BPM (lobby)
   - `game_bgm.mp3` - Energetic loop (durante game)

2. **Sound Effects**
   - `countdown.mp3` - Tick-tock mechanic (3s)
   - `timer_urgent.mp3` - Heartbeat accelerato (ultimi 5s)
   - `correct_answer.mp3` - Ding victorioso
   - `wrong_answer.mp3` - Buzzer fail
   - `time_up.mp3` - Buzzer timeout
   - `overtake.mp3` - Whoosh
   - `new_leader.mp3` - Fanfara crescente
   - `victory.mp3` - Inno orchestrale vittoria
   - `applause.mp3` - Applausi loop

## 🔧 Implementation

### Audio Manager
File: `client/src/utils/AudioManager.js`

```javascript
import { Howl } from 'howler';

class AudioManager {
  constructor() {
    this.sounds = {};
    this.volume = {
      master: 1.0,
      music: 0.6,
      sfx: 0.8
    };
    this.muted = false;
  }

  preload() {
    // Preload all sounds
    this.sounds.correct = new Howl({
      src: ['/audio/correct_answer.mp3'],
      volume: this.volume.sfx
    });
    // ... altri suoni
  }

  play(soundName, options = {}) {
    if (this.muted) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.play();
    }
  }

  setVolume(type, value) {
    this.volume[type] = value;
    // Update all sounds
  }

  toggleMute() {
    this.muted = !this.muted;
  }
}

export default new AudioManager();
```

### React Hook
File: `client/src/hooks/useSound.js`

```javascript
import { useEffect } from 'react';
import AudioManager from '../utils/AudioManager';

export const useSound = () => {
  useEffect(() => {
    AudioManager.preload();
  }, []);

  return {
    play: AudioManager.play.bind(AudioManager),
    setVolume: AudioManager.setVolume.bind(AudioManager),
    toggleMute: AudioManager.toggleMute.bind(AudioManager)
  };
};
```

## 📱 Vibration API (Mobile)

```javascript
// Feedback tattile per bottoni
const vibrate = (pattern = 50) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Patterns
const patterns = {
  select: 50,
  correct: [100, 50, 100],
  wrong: [200],
  urgent: [50, 50, 50, 50]
};
```

## ⚙️ Settings UI

### Audio Controls Component
- Toggle audio on/off (master)
- Volume slider (0-100%)
- Separate music vs SFX toggles
- Persist in localStorage

```javascript
localStorage.setItem('audioSettings', JSON.stringify({
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 1.0,
  muted: false
}));
```

## 🎬 Audio Triggers

| Event | Sound | Vibration |
|-------|-------|-----------|
| Lobby join | gentle_pop.mp3 | 50ms |
| Countdown tick | tick.mp3 | - |
| Timer < 5s | heartbeat.mp3 | 50ms loop |
| Tap answer | tap.mp3 | 50ms |
| Correct | correct_answer.mp3 | [100, 50, 100] |
| Wrong | wrong_answer.mp3 | 200ms |
| Overtake | whoosh.mp3 | - |
| New leader | fanfara.mp3 | - |
| Victory | victory.mp3 | [200, 100, 200] |

## 📦 Deliverable

- Tutti gli audio assets scaricati e posizionati in `/client/public/audio`
- AudioManager funzionante con preload
- useSound hook usabile nei component
- Settings UI con volume controls
- Vibration API integrato mobile
- Audio sync con tutte le animazioni
