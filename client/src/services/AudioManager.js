class AudioManager {
    constructor() {
        this.bgm = null;
        this.sfx = {};
        this.muted = false;
        this.volume = 0.5;

        // Sound manifest
        this.sounds = {
            bgm_lobby: '/sounds/bgm_lobby.mp3', // Placeholder path
            bgm_game: '/sounds/bgm_game.mp3',
            countdown: '/sounds/countdown.mp3',
            correct: '/sounds/correct.mp3',
            wrong: '/sounds/wrong.mp3',
            tick: '/sounds/tick.mp3',
            gameover: '/sounds/gameover.mp3',
            join: '/sounds/join.mp3'
        };

        // Preload SFX (not BGM to save bandwidth initially)
        this.preloadSFX();
    }

    preloadSFX() {
        ['countdown', 'correct', 'wrong', 'tick', 'gameover', 'join'].forEach(key => {
            this.sfx[key] = new Audio(this.sounds[key]);
            this.sfx[key].volume = this.volume;
        });
    }

    playBGM(trackKey) {
        if (this.muted) return;
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }

        if (this.sounds[trackKey]) {
            this.bgm = new Audio(this.sounds[trackKey]);
            this.bgm.loop = true;
            this.bgm.volume = this.volume * 0.6; // Lower BGM volume relative to SFX
            this.bgm.play().catch(e => console.log('Autoplay prevented:', e));
        }
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.bgm = null;
        }
    }

    playSFX(key) {
        if (this.muted) return;
        const sound = this.sfx[key];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('SFX play error:', e));
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.bgm) {
            this.bgm.muted = this.muted;
        }
        return this.muted;
    }
}

export default new AudioManager();
