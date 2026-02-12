/**
 * Simple In-Memory Game Storage
 * Niente Redis, solo un oggetto JavaScript
 */

const games = new Map(); // PIN -> gameState
const QuestionGenerator = require('./QuestionGenerator'); // Import service

// Pool di 20 avatar emoji diversi
const AVATAR_POOL = [
    '🦁', '🐯', '🐻', '🐼', '🐨',
    '🐸', '🐵', '🦊', '🐷', '🐮',
    '🐺', '🦝', '🐭', '🐹', '🐰',
    '🦌', '🐔', '🐧', '🦆', '🦉'
];

const MAX_PLAYERS = 50;
const PIN_LENGTH = 6;

class GameManager {
    /**
     * Genera un PIN univoco di 6 cifre
     */
    generateUniquePIN() {
        let pin;
        let exists = true;
        let attempts = 0;
        const maxAttempts = 10;

        while (exists && attempts < maxAttempts) {
            pin = Math.floor(100000 + Math.random() * 900000).toString();
            exists = games.has(pin);
            attempts++;
        }

        if (exists) {
            throw new Error('Failed to generate unique PIN');
        }

        return pin;
    }

    /**
     * Assegna un avatar casuale non ancora usato nel game
     */
    getAvailableAvatar(existingPlayers) {
        const usedAvatars = existingPlayers.map(p => p.avatar);
        const availableAvatars = AVATAR_POOL.filter(a => !usedAvatars.includes(a));

        if (availableAvatars.length === 0) {
            return AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)];
        }

        return availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
    }

    /**
     * Crea un nuovo game
     */
    createGame(category, hostSocketId, mode = 'single') {
        const pin = this.generateUniquePIN();

        const gameState = {
            pin,
            category,
            mode, // 'single' or 'mixed'
            hostSocketId,
            status: 'lobby',
            players: [],
            createdAt: Date.now(),
            questions: []
        };

        games.set(pin, gameState);

        return { pin, gameState };
    }

    /**
     * Recupera lo stato del game
     */
    getGameState(pin) {
        return games.get(pin) || null;
    }

    /**
     * Aggiunge un player al game
     */
    joinGame(pin, socketId) {
        const gameState = this.getGameState(pin);

        if (!gameState) {
            throw new Error('Game not found');
        }

        if (gameState.status !== 'lobby') {
            throw new Error('Game already started');
        }

        if (gameState.players.length >= MAX_PLAYERS) {
            throw new Error('Game is full');
        }

        const existingPlayer = gameState.players.find(p => p.socketId === socketId);
        if (existingPlayer) {
            return { gameState, player: existingPlayer };
        }

        const avatar = this.getAvailableAvatar(gameState.players);

        const newPlayer = {
            socketId,
            nickname: `Player${gameState.players.length + 1}`,
            avatar,
            score: 0,
            connected: true
        };

        gameState.players.push(newPlayer);

        return { gameState, player: newPlayer };
    }

    /**
     * Aggiorna il nickname di un player
     */
    updatePlayerNickname(pin, socketId, nickname) {
        const gameState = this.getGameState(pin);

        if (!gameState) {
            throw new Error('Game not found');
        }

        const sanitizedNickname = nickname.trim().substring(0, 12);

        const player = gameState.players.find(p => p.socketId === socketId);
        if (!player) {
            throw new Error('Player not found');
        }

        player.nickname = sanitizedNickname;

        return { gameState, player };
    }

    /**
     * Riconnette un player aggiornando il socketId
     */
    reconnectPlayer(pin, nickname, newSocketId) {
        const gameState = this.getGameState(pin);
        if (!gameState) {
            throw new Error('Game not found');
        }

        const player = gameState.players.find(p => p.nickname === nickname);
        if (!player) {
            throw new Error('Player not found');
        }

        // Aggiorna socketId
        player.socketId = newSocketId;
        player.connected = true;

        return { gameState, player };
    }

    /**
     * Rimuove un player dal game
     */
    removePlayer(pin, socketId) {
        const gameState = this.getGameState(pin);

        if (!gameState) {
            return null;
        }

        gameState.players = gameState.players.filter(p => p.socketId !== socketId);

        return gameState;
    }

    /**
     * Avvia il game
     */
    /**
     * Avvia il game
     */
    async startGame(pin, hostSocketId) {
        const gameState = this.getGameState(pin);

        if (!gameState) {
            throw new Error('Game not found');
        }

        if (gameState.hostSocketId !== hostSocketId) {
            throw new Error('Only host can start the game');
        }

        if (gameState.players.length < 1) { // MODIFIED: 1 player for testing
            throw new Error('Need at least 1 players to start');
        }

        // Genera tutte le domande subito (10)
        try {
            console.log(`🚀 Game ${pin}: Fetching all 10 questions (mode: ${gameState.mode})...`);

            if (gameState.mode === 'mixed') {
                // Mixed mode: 10 questions from random categories
                const questions = await QuestionGenerator.getMixedQuestions(10);
                gameState.questions = questions;
            } else {
                const questions = await QuestionGenerator.getQuestions(gameState.category, 10);
                gameState.questions = questions;
            }
        } catch (error) {
            console.error('Error getting questions:', error);
            throw new Error('Failed to generate questions');
        }

        gameState.status = 'starting'; // Wait for countdown before 'active'
        gameState.currentQuestionIndex = 0;
        gameState.currentQuestionStartTime = Date.now();
        gameState.answers = {}; // { questionIndex: { socketId: { answer, score, time } } }

        return gameState;
    }

    /**
     * Passa alla prossima domanda
     */
    nextQuestion(pin) {
        const gameState = this.getGameState(pin);
        if (!gameState) return null;

        gameState.currentQuestionIndex++;
        gameState.currentQuestionStartTime = Date.now();

        // Se abbiamo finito le domande
        if (gameState.currentQuestionIndex >= gameState.questions.length) {
            gameState.status = 'finished';
        }

        return gameState;
    }

    /**
     * Gestisce la risposta di un player
     */
    submitAnswer(pin, socketId, answerIndex) {
        const gameState = this.getGameState(pin);
        if (!gameState || gameState.status !== 'active') return null;

        const currentQ = gameState.questions[gameState.currentQuestionIndex];
        if (!currentQ) return null;

        // Inizializza oggetto risposte per questa domanda se non esiste
        if (!gameState.answers[gameState.currentQuestionIndex]) {
            gameState.answers[gameState.currentQuestionIndex] = {};
        }

        // Se player ha già risposto, ignora
        if (gameState.answers[gameState.currentQuestionIndex][socketId]) {
            return { alreadyAnswered: true };
        }

        const isCorrect = answerIndex === currentQ.correctAnswer;
        let score = 0;

        if (isCorrect) {
            // Calcolo punteggio: Base (1000) + Bonus Tempo (0-1000)
            const timeTaken = (Date.now() - gameState.currentQuestionStartTime) / 1000;
            const timeLimit = currentQ.timeLimit || 15;
            const timeBonus = Math.max(0, Math.floor((1 - timeTaken / timeLimit) * 1000));
            score = 1000 + timeBonus;
        }

        // Registra risposta
        gameState.answers[gameState.currentQuestionIndex][socketId] = {
            answer: answerIndex,
            isCorrect,
            score,
            time: Date.now()
        };

        // Aggiorna score totale del player
        const player = gameState.players.find(p => p.socketId === socketId);
        if (player) {
            player.score += score;
        }

        return {
            isCorrect,
            score,
            totalScore: player ? player.score : 0
        };
    }

    /**
     * Ottieni risultati della domanda corrente
     */
    getQuestionResults(pin) {
        const gameState = this.getGameState(pin);
        if (!gameState) return null;

        const currentQIndex = gameState.currentQuestionIndex;
        const answers = gameState.answers[currentQIndex] || {};

        // Calcola statistiche risposta (quanti A, B, C, D)
        const stats = [0, 0, 0, 0];
        Object.values(answers).forEach(a => {
            if (a.answer >= 0 && a.answer < 4) {
                stats[a.answer]++;
            }
        });

        return {
            correctAnswer: gameState.questions[currentQIndex].correctAnswer,
            stats,
            leaderboard: this.getLeaderboard(pin).slice(0, 5) // Top 5
        };
    }

    /**
     * Ottieni classifica
     */
    getLeaderboard(pin) {
        const gameState = this.getGameState(pin);
        if (!gameState) return [];

        return [...gameState.players].sort((a, b) => b.score - a.score);
    }

    /**
     * Imposta lo status del gioco (es. da 'starting' a 'active')
     */
    setGameStatus(pin, status) {
        const gameState = this.getGameState(pin);
        if (gameState) {
            gameState.status = status;
        }
    }

    /**
     * Termina forzatamente un game
     */
    terminateGame(pin) {
        if (games.has(pin)) {
            const gameState = games.get(pin);
            gameState.status = 'finished';
            return true;
        }
        return false;
    }
}

module.exports = new GameManager();
