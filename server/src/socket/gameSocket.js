/**
 * Socket.IO Game Event Handlers
 */
const gameManager = require('../services/GameManager');
const categories = require('../utils/categories');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);

        /**
         * CREATE-GAME: Host crea nuovo game
         */
        socket.on('create-game', async (data) => {
            try {
                const { category, mode } = data;
                const { pin, gameState } = await gameManager.createGame(category, socket.id, mode || 'single');

                // Join della room del game
                socket.join(`game-${pin}`);

                socket.emit('game-created', {
                    pin,
                    gameId: pin,
                    category: gameState.category
                });

                console.log(`✅ Game created: PIN ${pin}, Category: ${category}`);
            } catch (error) {
                console.error('Error creating game:', error);
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * JOIN-GAME: Player si unisce a un game
         */
        socket.on('join-game', async (data) => {
            try {
                const { pin } = data;
                const { gameState, player } = await gameManager.joinGame(pin, socket.id);

                // Join della room del game
                socket.join(`game-${pin}`);

                // Invia conferma join al player
                socket.emit('join-success', {
                    avatar: player.avatar,
                    players: gameState.players,
                    category: gameState.category
                });

                // Notifica tutti gli altri nella room
                socket.to(`game-${pin}`).emit('player-joined', {
                    player: player
                });

                console.log(`✅ Player ${socket.id} joined game ${pin} as ${player.avatar}`);
            } catch (error) {
                console.error('Error joining game:', error);
                socket.emit('join-error', { message: error.message });
            }
        });



        /**
         * PLAYER-REJOIN: Player si riconnette (es. dopo refresh o navigazione)
         */
        socket.on('player-rejoin', async (data) => {
            try {
                const { pin, nickname } = data;
                const { gameState, player } = await gameManager.reconnectPlayer(pin, nickname, socket.id);

                // Join della room del game
                socket.join(`game-${pin}`);

                // Invia stato corrente al player
                socket.emit('rejoin-success', {
                    player,
                    gameState: {
                        status: gameState.status,
                        currentQuestionIndex: gameState.currentQuestionIndex
                    }
                });

                // Se il gioco è attivo, invia la domanda corrente
                if (gameState.status === 'active') {
                    const currentQ = gameState.questions[gameState.currentQuestionIndex];
                    if (currentQ) {
                        socket.emit('new-question', {
                            questionIndex: gameState.currentQuestionIndex + 1,
                            totalQuestions: gameState.questions.length,
                            text: currentQ.text,
                            options: currentQ.options, // Aggiungere logica se serve oscurare risposte corrette
                            timeLimit: currentQ.timeLimit
                        });
                    }
                }

                console.log(`✅ Player ${nickname} reconnected to game ${pin}`);
            } catch (error) {
                console.error('Error rejoining game:', error);
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * UPDATE-NICKNAME: Player aggiorna il proprio nickname
         */
        socket.on('update-nickname', async (data) => {
            try {
                const { pin, nickname } = data;
                const { gameState, player } = await gameManager.updatePlayerNickname(pin, socket.id, nickname);

                // Conferma al player
                socket.emit('nickname-updated', { nickname: player.nickname });

                // Broadcast update a tutti
                io.to(`game-${pin}`).emit('player-updated', {
                    socketId: socket.id,
                    nickname: player.nickname,
                    players: gameState.players
                });

                console.log(`✅ Player ${socket.id} updated nickname to "${player.nickname}"`);
            } catch (error) {
                console.error('Error updating nickname:', error);
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * START-GAME: Host avvia il game
         */
        socket.on('start-game', async (data) => {
            try {
                const { pin } = data;
                // Avvia game e genera domande
                const gameState = await gameManager.startGame(pin, socket.id);

                // Notifica inizio (Loading screen)
                io.to(`game-${pin}`).emit('game-started', {
                    status: gameState.status,
                    players: gameState.players,
                    pin: pin // Send PIN to avoid client-side closure stale state issues
                });

                console.log(`🚀 Game ${pin} started! Generating questions...`);

                // Avvia il loop del gioco
                runGameLoop(io, pin);

            } catch (error) {
                console.error('Error starting game:', error);
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * SUBMIT-ANSWER: Player invia risposta
         */
        socket.on('submit-answer', (data) => {
            try {
                const { pin, answerIndex } = data;
                const result = gameManager.submitAnswer(pin, socket.id, answerIndex);

                if (result) {
                    if (result.alreadyAnswered) {
                        return; // Ignora se già risposto
                    }

                    // Conferma al player — NO score/isCorrect per non svelare risultato
                    socket.emit('answer-accepted', {
                        received: true
                    });

                    // Notifica host che qualcuno ha risposto (per suoni/animazioni)
                    // Non inviamo chi o cosa, solo che c'è una risposta
                    const gameState = gameManager.getGameState(pin);
                    const hostSocketId = gameState?.hostSocketId;
                    if (hostSocketId) {
                        io.to(hostSocketId).emit('player-answered', { socketId: socket.id });
                    }
                }
            } catch (error) {
                console.error('Error submitting answer:', error);
            }
        });

        /**
         * DISCONNECT: Player si disconnette
         */
        socket.on('disconnect', async () => {
            // console.log('❌ Client disconnected:', socket.id);
        });

        /**
         * REQUEST-GAME-STATE: Host chiede sync (es. dopo refresh)
         */
        socket.on('request-game-state', (data) => {
            const { pin } = data;
            const gameState = gameManager.getGameState(pin);

            if (gameState) {
                socket.join(`game-${pin}`); // Re-join room importantissimo!

                // Se il gioco è già attivo, invia la domanda corrente
                if (gameState.status === 'active') {
                    const currentQ = gameState.questions[gameState.currentQuestionIndex];
                    if (currentQ) {
                        socket.emit('new-question', {
                            questionIndex: gameState.currentQuestionIndex + 1,
                            totalQuestions: gameState.questions.length,
                            text: currentQ.text,
                            options: currentQ.options,
                            timeLimit: currentQ.timeLimit
                        });
                    }
                }
            }
        });

        /**
         * HOST-END-GAME: Host termina la partita anticipatamente
         */
        socket.on('host-end-game', ({ pin }) => {
            const gameState = gameManager.getGameState(pin);

            // Verifica che sia l'host a chiamare
            if (gameState && gameState.hostSocketId === socket.id) {
                console.log(`🛑 Game ${pin} terminated by host`);

                // Notifica tutti (player e host stesso se serve) di disconnettersi/tornare alla home
                io.to(`game-${pin}`).emit('force-disconnect');

                // Imposta status a finished per fermare il loop del server
                gameManager.terminateGame(pin);
            }
        });
    });
};

/**
 * Loop principale del gioco
 */
const runGameLoop = async (io, pin) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const room = `game-${pin}`;

    try {
        // Attesa iniziale (animazione start)
        // await delay(3000); -> Sostituito con Countdown

        // Countdown 3-2-1
        for (let i = 5; i > 0; i--) {
            io.to(room).emit('game-countdown', { value: i });
            await delay(1000);
        }
        io.to(room).emit('game-countdown', { value: 'VIA!' });
        await delay(1000);

        // Ora il gioco diventa attivo
        gameManager.setGameStatus(pin, 'active');

        let gameState = gameManager.getGameState(pin);
        let gameActive = true;

        while (gameActive && gameState.status === 'active') {
            const currentQ = gameState.questions[gameState.currentQuestionIndex];

            // Extract category image
            const categoryData = currentQ.category ? categories.find(c => c.name === currentQ.category) : null;
            const categoryImage = categoryData ? categoryData.icon_url : null;

            // Category reveal for ALL modes (3 second animation before question)
            // This displays the category splash screen with the intro sound
            if (currentQ.category) {
                io.to(room).emit('category-reveal', {
                    category: currentQ.category,
                    categoryImage, // Send image URL
                    questionNumber: gameState.currentQuestionIndex + 1,
                    totalQuestions: gameState.questions.length
                });
                await delay(3000);
            }

            // 1. Invia Domanda
            io.to(room).emit('new-question', {
                questionIndex: gameState.currentQuestionIndex + 1,
                totalQuestions: gameState.questions.length,
                text: currentQ.text,
                options: currentQ.options,
                timeLimit: currentQ.timeLimit || 15,
                category: currentQ.category || null,
                categoryImage, // Send image URL for background
            });

            console.log(`❓ Game ${pin}: Question ${gameState.currentQuestionIndex + 1} sent`);

            // 2. Attendi tempo domanda + piccolo buffer
            await delay((currentQ.timeLimit * 1000) + 1000);

            // 3. Invia Risultati Domanda (Grafico) — broadcast globale
            const results = gameManager.getQuestionResults(pin);
            io.to(room).emit('question-results', results);

            // 3b. Invia risultato individuale a ciascun player
            const currentGameState = gameManager.getGameState(pin);
            const currentQIndex = currentGameState.currentQuestionIndex;
            const playerAnswers = currentGameState.answers[currentQIndex] || {};

            currentGameState.players.forEach(player => {
                const answer = playerAnswers[player.socketId];
                if (answer) {
                    io.to(player.socketId).emit('player-result', {
                        isCorrect: answer.isCorrect,
                        score: answer.score,
                        totalScore: player.score
                    });
                } else {
                    // Player didn't answer
                    io.to(player.socketId).emit('player-result', {
                        isCorrect: false,
                        score: 0,
                        totalScore: player.score
                    });
                }
            });

            // 4. Attendi lettura risultati (grafico)
            await delay(8000);

            // 4b. Invia Classifica Intermedia SOLO dopo 5 turni (e non alla fine)
            // Se siamo al turno 5, 10, 15... ma NON è l'ultimo
            const currentTurn = gameState.currentQuestionIndex + 1;
            if (currentTurn % 5 === 0 && currentTurn < gameState.questions.length) {
                const leaderboard = gameManager.getLeaderboard(pin);
                io.to(room).emit('game-leaderboard', { leaderboard: leaderboard.slice(0, 5) });
                console.log(`🏆 Game ${pin}: Leaderboard sent (Turn ${currentTurn})`);

                // 4c. Attendi lettura classifica
                await delay(8000);
            }

            // 5. Passa a prossima domanda
            gameState = gameManager.nextQuestion(pin);

            if (gameState.status === 'finished') {
                gameActive = false;
            }
        }

        // Game Over - Classifica Finale
        const finalLeaderboard = gameManager.getLeaderboard(pin);
        io.to(room).emit('game-over', {
            leaderboard: finalLeaderboard
        });
        console.log(`🏁 Game ${pin} finished!`);

    } catch (error) {
        console.error(`Error in game loop for ${pin}:`, error);
        io.to(room).emit('error', { message: 'Game loop error' });
    }
};
