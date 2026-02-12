import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionDisplay from '../components/QuestionDisplay';
import AudioManager from '../services/AudioManager';

const SOCKET_URL = '/'; // Relative path

function GameRoom() {
    const { pin } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState('loading');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [results, setResults] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [countdown, setCountdown] = useState(null);
    const [categoryReveal, setCategoryReveal] = useState(null);

    const [error, setError] = useState(null);
    const [calculatingText, setCalculatingText] = useState("Calcolo Punteggi...");

    const socketRef = useRef(null);

    const handleExitGame = () => {
        if (window.confirm("Sei sicuro di voler terminare la partita? Tutti i giocatori verranno disconnessi.")) {
            if (socketRef.current) {
                socketRef.current.emit('host-end-game', { pin });
                navigate('/');
            }
        }
    };

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        socketRef.current = newSocket;

        newSocket.on('connect', () => {
            newSocket.emit('request-game-state', { pin });
        });

        newSocket.on('game-starting', () => {
            setStatus('starting');
        });

        newSocket.on('game-countdown', (data) => {
            setStatus('countdown');
            setCountdown(data.value);
        });

        // Category reveal for mixed mode
        newSocket.on('category-reveal', (data) => {
            setStatus('category-reveal');
            setCategoryReveal(data);
        });

        newSocket.on('new-question', (questionData) => {
            setStatus('question');
            setCurrentQuestion(questionData);
            setResults(null);
            setCategoryReveal(null);
        });

        newSocket.on('question-results', (resultData) => {
            setStatus('results');
            setResults(resultData);
            AudioManager.playSFX('tick');
        });

        newSocket.on('calculating-leaderboard', (data) => {
            setStatus('calculating');
            if (data?.final) {
                setCalculatingText("Calcolo Classifica Finale...");
            } else {
                setCalculatingText("Calcolo Punteggi...");
            }
        });

        newSocket.on('game-leaderboard', (data) => {
            setStatus('leaderboard');
            setLeaderboard(data.leaderboard);
            AudioManager.playSFX('tick');
        });

        newSocket.on('game-over', (data) => {
            setStatus('finished');
            setLeaderboard(data.leaderboard);
            AudioManager.playSFX('gameover');
            AudioManager.stopBGM();
        });

        newSocket.on('player-answered', (data) => {
            // Sound or visual feedback
        });

        return () => {
            newSocket.close();
            AudioManager.stopBGM();
        };
    }, [pin]);

    const medals = ['🥇', '🥈', '🥉'];
    const positionColors = [
        'bg-duo-yellow/20 border-duo-yellow/40',
        'bg-white/10 border-white/20',
        'bg-duo-orange/20 border-duo-orange/40',
        'bg-white/5 border-white/10',
        'bg-white/5 border-white/10'
    ];

    return (
        <div className="h-full bg-primary overflow-hidden relative">
            {/* EXIT BUTTON */}
            <button
                onClick={handleExitGame}
                className="absolute top-4 right-4 z-50 p-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-full border border-red-500/30 transition-colors shadow-lg backdrop-blur-sm"
                title="Termina Partita"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <AnimatePresence mode="wait">

                {/* LOADING / STARTING SCREEN */}
                {(status === 'loading' || status === 'starting') && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full text-white"
                    >
                        <div className="text-8xl mb-8 animate-bounce">🧠</div>
                        <h1 className="text-5xl font-black mb-6 font-nunito">
                            {status === 'loading' ? 'In attesa...' : 'Si Parte!'}
                        </h1>
                        <p className="text-xl text-white/50 font-nunito">
                            Preparatevi... l'IA sta generando le domande
                        </p>
                    </motion.div>
                )}

                {/* COUNTDOWN */}
                {status === 'countdown' && (
                    <motion.div
                        key="countdown"
                        className="flex items-center justify-center h-full text-white"
                    >
                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-9xl font-black text-duo-yellow font-nunito"
                        >
                            {countdown}
                        </motion.div>
                    </motion.div>
                )}

                {/* CATEGORY REVEAL (Mixed Mode) */}
                {status === 'category-reveal' && categoryReveal && (
                    <motion.div
                        key="category-reveal"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex items-center justify-center h-full p-8"
                    >
                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-primary-card/50 backdrop-blur-xl p-8 rounded-duo-xl border border-white/10 shadow-2xl relative overflow-hidden">
                            {/* Decorative Background Blob */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-duo-purple/20 rounded-full blur-3xl pointer-events-none" />

                            {/* Left: Image */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="relative aspect-video md:aspect-square rounded-duo-lg overflow-hidden shadow-lg border-2 border-white/10 group"
                            >
                                {categoryReveal.categoryImage ? (
                                    <img
                                        src={categoryReveal.categoryImage}
                                        alt={categoryReveal.category}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-duo-purple to-duo-blue flex items-center justify-center">
                                        <span className="text-6xl">🎲</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </motion.div>

                            {/* Right: Text */}
                            <div className="text-left z-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block px-4 py-1 bg-duo-purple/20 text-duo-purple rounded-full text-sm font-bold uppercase tracking-widest mb-4 border border-duo-purple/30"
                                >
                                    Prossima Categoria
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg font-nunito"
                                >
                                    {categoryReveal.category}
                                </motion.h2>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: 100 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="h-2 bg-gradient-to-r from-duo-purple to-duo-blue rounded-full mb-6"
                                />
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-white/60 text-lg font-nunito"
                                >
                                    Preparati, la domanda sta arrivando...
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                )}


                {/* QUESTION SCREEN */}
                {status === 'question' && currentQuestion && (
                    <motion.div key="question" className="h-full">
                        <QuestionDisplay
                            question={currentQuestion}
                            timeLimit={currentQuestion.timeLimit}
                            totalQuestions={currentQuestion.totalQuestions}
                            currentQuestionIndex={currentQuestion.questionIndex}
                        />
                    </motion.div>
                )}

                {/* RESULTS SCREEN */}
                {status === 'results' && results && currentQuestion && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full text-white px-8 py-6"
                    >
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-widest text-duo-blue font-nunito">Risultati</h2>

                        {/* Correct Answer */}
                        <motion.div
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mb-8"
                        >
                            <div className="text-sm uppercase tracking-widest text-white/50 mb-2 font-nunito">Risposta Corretta</div>
                            <div className="bg-duo-green text-white text-3xl font-black py-3 px-8 rounded-duo shadow-duo-green inline-block font-nunito">
                                {currentQuestion.options[results.correctAnswer]}
                            </div>
                        </motion.div>

                        {/* Bars */}
                        <div className="w-full max-w-5xl flex-grow flex justify-around items-end gap-6 px-4 max-h-[50vh]">
                            {results.stats.map((count, idx) => {
                                const maxVal = Math.max(1, Math.max(...results.stats));
                                const percentage = (count / maxVal) * 100;
                                const isCorrect = idx === results.correctAnswer;
                                const colors = ['bg-answerA', 'bg-answerB', 'bg-answerC', 'bg-answerD'];

                                return (
                                    <div key={idx} className="flex flex-col items-center justify-end w-full h-full">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1 + (idx * 0.1) }}
                                            className="text-4xl font-black mb-3 text-white font-nunito"
                                        >
                                            {count}
                                        </motion.div>

                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(5, percentage)}%` }}
                                            transition={{ duration: 1.5, ease: "anticipate", delay: 0.2 + (idx * 0.1) }}
                                            className={`
                                                w-full rounded-t-duo relative
                                                ${colors[idx]}
                                                ${isCorrect ? 'shadow-[0_0_30px_rgba(88,204,2,0.4)]' : 'opacity-60 grayscale-[0.3]'}
                                            `}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-3 bg-white/20 rounded-t-duo"></div>
                                        </motion.div>

                                        <div className={`
                                            mt-4 w-14 h-14 flex items-center justify-center rounded-duo text-2xl font-black text-white font-nunito
                                            ${colors[idx]} shadow-duo
                                        `}>
                                            {['A', 'B', 'C', 'D'][idx]}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* CALCULATING SCREEN */}
                {status === 'calculating' && (
                    <motion.div
                        key="calculating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full text-white text-center"
                    >
                        <div className="text-8xl mb-8 animate-bounce">🧮</div>
                        <h2 className="text-5xl font-black text-white font-nunito animate-pulse">
                            {calculatingText}
                        </h2>
                    </motion.div>
                )}

                {/* LEADERBOARD */}
                {status === 'leaderboard' && (
                    <motion.div
                        key="leaderboard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex flex-col items-center justify-center h-full text-white px-6"
                    >
                        <h2 className="text-5xl font-black mb-12 text-duo-yellow font-nunito uppercase tracking-wider">
                            Classifica Provvisoria
                        </h2>
                        <div className="w-full max-w-2xl space-y-3">
                            {leaderboard.slice(0, 5).map((player, idx, arr) => {
                                const reverseIdx = arr.length - 1 - idx;
                                return (
                                    <motion.div
                                        key={player.socketId || idx}
                                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        transition={{ delay: reverseIdx * 1.5, type: "spring" }}
                                        className={`card-duo px-6 py-4 flex items-center justify-between border ${positionColors[idx]}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`
                                            w-14 h-14 flex items-center justify-center rounded-full text-2xl font-black font-nunito
                                            ${idx === 0 ? 'bg-duo-yellow text-primary' :
                                                    idx === 1 ? 'bg-gray-300 text-primary' :
                                                        idx === 2 ? 'bg-duo-orange text-white' :
                                                            'bg-white/10 text-white'}
                                        `}>
                                                {idx < 3 ? medals[idx] : idx + 1}
                                            </div>
                                            <span className="text-3xl">{player.avatar}</span>
                                            <span className="text-2xl font-bold truncate max-w-xs font-nunito">{player.nickname}</span>
                                        </div>
                                        <div className="text-3xl font-black text-duo-yellow font-nunito">
                                            {player.score} <span className="text-sm font-normal text-white/40">pts</span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}

                {/* GAME OVER */}
                {status === 'finished' && (
                    <motion.div
                        key="finished"
                        className="flex flex-col items-center justify-center h-full text-white px-6"
                    >
                        <h1 className="text-7xl font-black mb-10 text-duo-yellow font-nunito">
                            🏆 PODIO 🏆
                        </h1>
                        <div className="space-y-3 w-full max-w-2xl">
                            {leaderboard.slice(0, 5).map((player, idx, arr) => {
                                const reverseIdx = arr.length - 1 - idx;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: idx === 0 ? 1.25 : 1 }}
                                        transition={{ delay: reverseIdx * 1.5, type: "spring" }}
                                        className={`card-duo px-6 py-4 flex items-center justify-between border ${positionColors[idx]} ${idx === 0 ? 'shadow-[0_0_60px_rgba(255,215,0,0.8)] z-20 my-6' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl">{idx < 3 ? medals[idx] : `#${idx + 1}`}</span>
                                            <span className="text-3xl">{player.avatar}</span>
                                            <span className="text-2xl font-bold font-nunito">{player.nickname}</span>
                                        </div>
                                        <span className="text-2xl font-black text-duo-yellow font-nunito">{player.score} pts</span>
                                    </motion.div>
                                )
                            })}
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-duo btn-duo-white mt-12 px-10 py-4 text-xl font-extrabold"
                        >
                            Torna alla Home
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

export default GameRoom;
