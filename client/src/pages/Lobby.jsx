import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import PlayerCard from '../components/PlayerCard';
import AudioManager from '../services/AudioManager';

function Lobby() {
    const location = useLocation();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [pin, setPin] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const category = location.state?.category;
    const mode = location.state?.mode || 'single';
    const [joinUrl, setJoinUrl] = useState('');

    useEffect(() => {
        // In production (Render), we use the current domain without port 5173
        const baseUrl = window.location.port === '5173'
            ? `${window.location.protocol}//${window.location.hostname}:5173`
            : window.location.origin;

        setJoinUrl(`${baseUrl}/play?pin=${pin}`);
    }, [pin]);

    useEffect(() => {
        const socketUrl = '/'; // Relative path for socket.io
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        // Lobby should be silent to build anticipation (or wait for game start)
        // AudioManager.playBGM('bgm_lobby'); 

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !category) return;

        socket.emit('create-game', {
            category: category.name || category,
            mode: mode
        });

        socket.on('game-created', (data) => {
            setPin(data.pin);
            setLoading(false);
        });

        socket.on('game-started', (data) => {
            navigate(`/host/game/${data.pin || pin}`);
        });

        socket.on('player-joined', (data) => {
            setPlayers(prev => [...prev, data.player]);
            AudioManager.playSFX('player_joined');
        });

        socket.on('player-updated', (data) => {
            setPlayers(data.players);
        });

        socket.on('error', (data) => {
            setError(data.message);
        });

        return () => {
            socket.off('game-created');
            socket.off('player-joined');
            socket.off('player-updated');
            socket.off('error');
        };
    }, [socket, category]);

    const [isStarting, setIsStarting] = useState(false);

    const handleStartGame = () => {
        if (players.length < 1) {
            alert('Serve almeno 1 giocatore per iniziare!');
            return;
        }
        setIsStarting(true);
        socket.emit('start-game', { pin });
    };

    if (!category) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-white text-xl font-nunito">Categoria non selezionata</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-white text-2xl font-nunito font-bold">Creando lobby...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4 font-nunito">⚠️ Errore</h2>
                    <p className="text-white/80">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary flex flex-col items-center justify-center p-4 md:p-8 relative" style={{ minHeight: 'var(--screen-h)' }}>

            <div className="max-w-[1600px] w-full mx-auto relative z-10 grid grid-cols-12 gap-8 h-auto">

                {/* LEFT COL: HERO & INFO */}
                <div className="col-span-12 md:col-span-7 flex flex-col justify-start md:justify-center gap-4">

                    {/* Category Hero with Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-duo-lg overflow-hidden shrink-0"
                    >
                        {/* Background Image */}
                        {category?.icon_url ? (
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${category.icon_url})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-duo-purple/30 via-primary-card to-primary" />
                        )}

                        {/* Content overlay */}
                        <div className="relative z-10 p-6 pt-20 md:p-8 md:pt-24">
                            <div
                                className={`inline-block px-3 py-1 md:px-4 md:py-2 rounded-full font-bold tracking-widest uppercase text-xs mb-2 border ${mode === 'mixed'
                                    ? 'bg-duo-purple/20 text-duo-purple border-duo-purple/30'
                                    : 'bg-duo-green/15 text-duo-green border-duo-green/30'
                                    }`}
                            >
                                {mode === 'mixed' ? '🎲 Modalità Mista' : 'Categoria Scelta'}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight font-nunito drop-shadow-lg break-words">
                                {category?.name || category || 'VileQuiz'}
                            </h1>
                            {category?.description && (
                                <p className="text-white/60 text-xs md:text-base font-nunito max-w-lg leading-snug">{category.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-white/50 text-xs md:text-sm font-nunito mt-2">
                                <span className="flex items-center gap-2">📚 10 Domande</span>
                                <span className="flex items-center gap-2">⏱️ 15s / domanda</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* QR & PIN Block */}
                    <div className="card-duo p-4 md:p-6 flex items-center gap-4 shrink-0">
                        {joinUrl && (
                            <div className="bg-white p-2 rounded-xl hidden sm:block shrink-0">
                                <QRCodeSVG value={joinUrl} size={80} className="md:w-[100px] md:h-[100px]" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="text-white/40 mb-1 uppercase tracking-widest text-[10px] md:text-xs font-nunito">Codice Partita</div>
                            <div className="text-5xl md:text-6xl font-black text-duo-green tracking-widest font-nunito truncate">
                                {pin}
                            </div>
                            <div className="mt-1 text-white/30 font-nunito text-[10px] md:text-xs truncate">
                                Scansiona o vai su <span className="text-white/60 font-bold">{joinUrl?.replace('http://', '').replace('https://', '')}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COL: PLAYER LIST */}
                <div className="col-span-12 md:col-span-5 flex flex-col h-full">
                    <div className="card-duo p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-end mb-6 pb-4 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-bold text-white font-nunito">Lobby</h2>
                                <p className="text-white/40 text-sm font-nunito">In attesa di sfidanti...</p>
                            </div>
                            <div className="text-4xl font-black text-duo-blue font-nunito">
                                {players.length}<span className="text-lg text-white/30 font-normal">/50</span>
                            </div>
                        </div>

                        {/* Player List */}
                        <div className="flex-grow overflow-y-auto pr-2">
                            {players.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/20">
                                    <div className="text-6xl mb-4">👻</div>
                                    <p className="font-nunito">La stanza è vuota...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    <AnimatePresence>
                                        {players.map((player) => (
                                            <motion.div
                                                key={player.socketId}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="bg-white/5 p-3 rounded-duo flex items-center gap-4 border border-white/5"
                                            >
                                                <div className="text-3xl">{player.avatar}</div>
                                                <div className="font-bold text-white text-lg truncate font-nunito">{player.nickname}</div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Start Button */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <button
                                onClick={handleStartGame}
                                disabled={players.length < 1 || isStarting}
                                className={`w-full py-5 text-xl font-extrabold rounded-duo transition-all font-nunito uppercase tracking-wide flex justify-center items-center gap-3 ${players.length >= 1 && !isStarting
                                    ? 'btn-duo btn-duo-green'
                                    : 'bg-white/10 text-white/20 cursor-not-allowed'
                                    }`}
                            >
                                {isStarting ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generando Domande...
                                    </>
                                ) : (
                                    players.length < 1 ? 'In attesa di giocatori...' : '🚀 Avvia Partita'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Lobby;
