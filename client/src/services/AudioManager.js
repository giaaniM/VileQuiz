import { Howl, Howler } from 'howler';

class AudioManager {
    constructor() {
        this.bgm = null;
        this.sfx = {};
        this.muted = false;
        this.volume = 0.5;

        // Sound manifest - using verified public URLs
        this.sounds = {
            // Background Music
            bgm_lobby: '/sounds/lobby-music.mp3', // Waiting for players
            bgm_game: '/sounds/game-loop.mp3', // 90 BPM local loop
            bgm_game_2: '/sounds/game-loop-2.mp3', // Alternate loop

            // SFX
            correct: 'https://raw.githubusercontent.com/techieshruti/Quiz-App-with-Timer/main/sounds/correct.mp3',
            wrong: 'https://raw.githubusercontent.com/techieshruti/Quiz-App-with-Timer/main/sounds/wrong.mp3',
            tick: '/sounds/tick.mp3', // Local tick sound
            timer_end: '/sounds/gong.mp3', // Local Gong
            leaderboard: 'https://raw.githubusercontent.com/techieshruti/Quiz-App-with-Timer/main/sounds/clapping.mp3',
            join: 'https://raw.githubusercontent.com/techieshruti/Quiz-App-with-Timer/main/sounds/click.mp3',
            gameover: 'https://raw.githubusercontent.com/techieshruti/Quiz-App-with-Timer/main/sounds/clapping.mp3',
            category_intro: '/sounds/category-intro.mp3', // Category reveal sound
            mobile_click: '/sounds/mobile-click.mp3', // Mobile answer click
            player_joined: '/sounds/player-joined.mp3', // Lobby join sound
            final_leaderboard: '/sounds/final-leaderboard.mp3', // Final results sound
            click: '/sounds/click.mp3', // Countdown click
            general_click: '/sounds/mech-click.mp3' // Global UI click
        };

        // Cache for loaded SFX
        this.sfxCache = {};
    }

    playGameLoop(questionIndex) {
        if (this.muted) return;
        this.stopBGM();

        // Alternate logic:
        // Even index (0, 2, 4...) -> bgm_game (Standard)
        // Odd index (1, 3, 5...) -> bgm_game_2 (Random start)
        const trackKey = (questionIndex % 2 === 0) ? 'bgm_game' : 'bgm_game_2';

        if (this.sounds[trackKey]) {
            this.bgm = new Howl({
                src: [this.sounds[trackKey]],
                html5: true,
                loop: true,
                volume: this.volume * 0.4
            });

            // Random seek for the second track
            if (trackKey === 'bgm_game_2') {
                this.bgm.once('load', () => {
                    const duration = this.bgm.duration(); // Duration in seconds
                    // Play random section, but ensure we have at least 20s remaining if possible
                    // If track is short, just play from start.
                    if (duration > 30) {
                        // Pick random start between 0 and duration - 20s
                        const randomStart = Math.random() * (duration - 20);
                        this.bgm.seek(randomStart);
                    }
                    this.bgm.play();
                });
            } else {
                this.bgm.play();
            }
        }
    }

    playBGM(trackKey) {
        if (this.muted) return;

        // Stop current BGM if different
        if (this.bgm) {
            if (this.bgm._src === this.sounds[trackKey]) return; // Already playing
            this.bgm.stop();
        }

        if (this.sounds[trackKey]) {
            this.bgm = new Howl({
                src: [this.sounds[trackKey]],
                html5: true, // Use HTML5 Audio for large files
                loop: true,
                volume: this.volume * 0.4
            });
            this.bgm.play();
        }
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.stop();
            this.bgm = null;
        }
    }

    playSFX(key) {
        if (this.muted) return;

        if (!this.sfxCache[key] && this.sounds[key]) {
            this.sfxCache[key] = new Howl({
                src: [this.sounds[key]],
                volume: this.volume
            });
        }

        if (this.sfxCache[key]) {
            const id = this.sfxCache[key].play();

            // Special handling: Increase Mobile Click volume by 20%
            if (key === 'mobile_click') {
                this.sfxCache[key].volume(Math.min(1.0, this.volume * 1.2), id);
            }

            // Special handling for Gong (timer_end)
            if (key === 'timer_end') {
                this.sfxCache[key].volume(this.volume * 0.8, id); // Lower volume by 20%
                // Fade out after 1.5 seconds over 2 seconds
                setTimeout(() => {
                    if (this.sfxCache[key].playing(id)) {
                        this.sfxCache[key].fade(this.volume * 0.8, 0, 2000, id);
                    }
                }, 1500);
            }
        }
    }

    setVolume(value) {
        this.volume = value;
        Howler.volume(value);
        if (this.bgm) {
            this.bgm.volume(value * 0.4);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        Howler.mute(this.muted);
        return this.muted;
    }
}

const instance = new AudioManager();
export default instance;

