import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import AudioManager from '../services/AudioManager';

// URL del backend
const SOCKET_URL = '/'; // Relative path

function PlayerController() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const avatar = state?.avatar || sessionStorage.getItem('vq_avatar') || '👤';

    // Recover from state OR session storage (fix reload issue)
    const nickname = state?.nickname || sessionStorage.getItem('vq_nickname');
    const paramPin = useParams().pin;
    const pin = paramPin || sessionStorage.getItem('vq_pin');

    // Stati
    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('waiting'); // waiting, countdown, answering, answered, results, leaderboard, finished
    const [countdown, setCountdown] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [displayScore, setDisplayScore] = useState(0); // Animated display score
    const [lastResult, setLastResult] = useState(null); // { isCorrect, score } — set ONLY on player-result
    const [showScorePop, setShowScorePop] = useState(false); // Score pop animation trigger
    const [error, setError] = useState(null);

    // Animated score counter
    useEffect(() => {
        if (displayScore === score) return;
        const diff = score - displayScore;
        const step = Math.max(1, Math.ceil(diff / 20));
        const timer = setTimeout(() => {
            setDisplayScore(prev => Math.min(prev + step, score));
        }, 30);
        return () => clearTimeout(timer);
    }, [displayScore, score]);

    useEffect(() => {
        if (!nickname) {
            setError("Nickname mancante. Torna alla home.");
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('🔌 Player connected. Rejoining as:', nickname);
            if (nickname) {
                newSocket.emit('player-rejoin', { pin, nickname });
            }
        });

        newSocket.on('error', (err) => {
            console.error('Socket error:', err);
            setError(err.message || "Errore di connessione");
        });

        newSocket.on('force-disconnect', () => {
            // Host ended the game
            navigate('/');
        });

        // Game Events
        newSocket.on('game-countdown', (data) => {
            setStatus('countdown');
            setCountdown(data.value);
        });

        // Category reveal for mixed mode
        newSocket.on('category-reveal', (data) => {
            setStatus('category-reveal');
            setCurrentQuestion(prev => ({
                ...prev,
                revealCategory: data.category,
                revealImage: data.categoryImage
            }));
        });

        newSocket.on('new-question', (data) => {
            setStatus('answering');
            setCurrentQuestion(data);
            setSelectedAnswer(null);
            setLastResult(null);
            setShowScorePop(false);
        });

        // Answer confirmed — NO score/isCorrect revealed yet
        newSocket.on('answer-accepted', () => {
            setStatus('answered');
        });

        // Results screen shown on TV
        newSocket.on('question-results', () => {
            setStatus('results');
        });

        // Individual result for this player — NOW we reveal score
        newSocket.on('player-result', (data) => {
            setLastResult({ isCorrect: data.isCorrect, score: data.score });
            setScore(data.totalScore);
            setShowScorePop(true);
            // Hide pop after 3s
            setTimeout(() => setShowScorePop(false), 3000);
        });

        newSocket.on('game-leaderboard', () => {
            setStatus('leaderboard');
        });

        newSocket.on('game-over', () => {
            setStatus('finished');
        });

        return () => newSocket.close();
    }, [pin, nickname, navigate]);

    const handleAnswer = (index) => {
        if (status !== 'answering') return;

        AudioManager.playSFX('tick');
        setSelectedAnswer(index);
        socket.emit('submit-answer', { pin, answerIndex: index });
        setStatus('answered');
    };

    // Colori pulsanti
    const optionsConfig = [
        { color: 'bg-red-500', symbol: 'A' },
        { color: 'bg-blue-500', symbol: 'B' },
        { color: 'bg-yellow-500', symbol: 'C' },
        { color: 'bg-green-500', symbol: 'D' }
    ];

    if (error) {
        return (
            <div className="min-h-full bg-primary flex items-center justify-center text-white p-4 text-center">
                <div>
                    <h1 className="text-3xl font-bold mb-4">⚠️ Errore</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[100dvh] bg-primary flex flex-col overflow-hidden relative">

            {/* MAIN CONTENT AREA */}
            <div className="flex-grow flex flex-col p-4 pb-28 relative z-10 justify-center">
                <AnimatePresence mode="wait">

                    {/* WAITING SCREEN */}
                    {status === 'waiting' && (
                        <motion.div
                            key="waiting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-grow flex flex-col items-center justify-center text-center text-white"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 bg-primary-card rounded-full flex items-center justify-center mb-6 animate-pulse border border-white/10">
                                    <span className="text-6xl">👀</span>
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-widest text-duo-blue font-nunito">Guarda la TV</h2>
                            </div>
                        </motion.div>
                    )}

                    {/* CATEGORY REVEAL (Mixed Mode) */}
                    {status === 'category-reveal' && (
                        <motion.div
                            key="category-reveal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="flex-grow flex flex-col items-center justify-center text-center text-white"
                        >
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-6"
                            >
                                {currentQuestion?.revealImage ? (
                                    <div className="w-40 h-40 mx-auto rounded-duo-lg overflow-hidden border-4 border-white/10 shadow-lg relative">
                                        <img
                                            src={currentQuestion.revealImage}
                                            alt="Category"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="text-6xl">🎲</div>
                                )}
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-3xl font-black text-duo-purple font-nunito"
                            >
                                {currentQuestion?.revealCategory || 'Prossima categoria'}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-white/40 text-sm mt-3 font-nunito"
                            >
                                Preparati!
                            </motion.p>
                        </motion.div>
                    )}

                    {/* RESULTS - Now with delayed score reveal */}
                    {status === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-grow flex flex-col items-center justify-center text-center text-white"
                        >
                            {lastResult ? (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                                    className={`
                                        w-full py-8 px-4 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-2
                                        ${lastResult.isCorrect ? 'bg-gradient-to-b from-green-500 to-green-600' : 'bg-gradient-to-b from-red-500 to-red-600'}
                                    `}
                                >
                                    <motion.div
                                        initial={{ rotate: -20, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                        className="text-7xl mb-2 filter drop-shadow-md"
                                    >
                                        {lastResult.isCorrect ? '🤩' : '😭'}
                                    </motion.div>
                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-3xl font-black uppercase tracking-wide"
                                    >
                                        {lastResult.isCorrect ? 'Grande!' : 'Sbagliato!'}
                                    </motion.h2>
                                    {lastResult.isCorrect && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0, 1.3, 1] }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            className="bg-black/20 px-6 py-2 rounded-full text-2xl font-bold mt-2"
                                        >
                                            +{lastResult.score} pts
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                // Waiting for individual result...
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 bg-primary-card rounded-full flex items-center justify-center mb-6 animate-pulse border border-white/10">
                                        <span className="text-5xl">⏳</span>
                                    </div>
                                    <h2 className="text-lg font-bold uppercase tracking-widest text-white/40 font-nunito">Risultati in arrivo...</h2>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* LEADERBOARD MESSAGE */}
                    {status === 'leaderboard' && (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex-grow flex flex-col items-center justify-center text-center text-white p-6"
                        >
                            <div className="text-7xl mb-8 animate-bounce">
                                🏆
                            </div>
                            <h2 className="text-3xl font-black text-duo-yellow uppercase mb-4 font-nunito">Classifica</h2>
                            <div className="card-duo px-8 py-6 w-full max-w-sm">
                                <p className="text-xs text-white/40 uppercase mb-2 tracking-widest font-nunito">Il tuo Punteggio</p>
                                <p className="text-5xl font-black text-white font-nunito">{displayScore}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* COUNTDOWN */}
                    {status === 'countdown' && (
                        <motion.div
                            key="countdown"
                            className="flex-grow flex flex-col items-center justify-center text-white"
                        >
                            <motion.div
                                key={countdown}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1 }}
                                exit={{ scale: 2, opacity: 0 }}
                                className="text-[10rem] font-black text-duo-yellow font-nunito"
                            >
                                {countdown}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* ANSWERING BUTTONS - FILL SCREEN */}
                    {status === 'answering' && (
                        <motion.div
                            key="answering"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="flex-grow grid grid-cols-2 grid-rows-2 gap-3 w-full max-h-[65vh]"
                        >
                            {optionsConfig.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`
                                        ${opt.color} 
                                        rounded-2xl flex items-center justify-center shadow-lg 
                                        w-full min-h-0
                                        active:scale-95 active:brightness-90 transition-all
                                        border-b-[6px] border-black/30 active:border-b-0 active:translate-y-[6px]
                                    `}
                                >
                                    <span className="text-6xl text-white font-black drop-shadow-md">
                                        {opt.symbol}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* ANSWER SENT — No result revealed yet */}
                    {status === 'answered' && (
                        <motion.div
                            key="answered"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex-grow flex flex-col items-center justify-center text-white text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6"
                            >
                                <span className="text-4xl">🚀</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-2 font-nunito">Risposta inviata!</h2>
                            <p className="text-white/40 text-sm font-nunito">In attesa dei risultati...</p>
                        </motion.div>
                    )}

                    {/* GAME OVER */}
                    {status === 'finished' && (
                        <motion.div
                            key="finished"
                            className="flex-grow flex flex-col items-center justify-center text-white text-center"
                        >
                            <h1 className="text-4xl font-black mb-8 font-nunito">Game Over</h1>
                            <div className="card-duo p-8 w-full max-w-xs">
                                <p className="text-xs text-white/40 uppercase mb-2 tracking-widest font-nunito">Totale</p>
                                <p className="text-6xl font-black text-duo-yellow font-nunito">{displayScore}</p>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-duo btn-duo-white mt-12 px-8 py-3 text-sm"
                            >
                                Torna alla Home
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* BOTTOM BAR - PLAYER INFO */}
            <div className="fixed bottom-0 left-0 right-0 bg-primary-light border-t border-white/10 px-5 py-3 z-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-card rounded-full flex items-center justify-center text-xl border border-white/10">
                        {avatar}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-sm leading-tight font-nunito">{nickname}</span>
                        <span className="text-white/30 text-[10px] uppercase tracking-wider font-nunito">Player</span>
                    </div>
                </div>

                <div className="relative">
                    <div className="bg-primary-card px-4 py-2 rounded-duo flex flex-col items-end border border-white/10">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-nunito">Score</span>
                        <span className="text-duo-yellow font-black text-xl leading-none font-nunito">{displayScore}</span>
                    </div>

                    {/* Score Pop Animation */}
                    <AnimatePresence>
                        {showScorePop && lastResult && lastResult.score > 0 && (
                            <motion.div
                                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                animate={{ y: -50, opacity: 0, scale: 1.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                className="absolute -top-2 right-0 text-green-400 font-black text-lg pointer-events-none"
                            >
                                +{lastResult.score}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}

export default PlayerController;
