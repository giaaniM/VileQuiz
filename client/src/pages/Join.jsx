import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import PlayerCard from '../components/PlayerCard';

function Join() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [socket, setSocket] = useState(null);
    const [step, setStep] = useState('pin'); // pin, nickname, waiting
    const [pin, setPin] = useState(searchParams.get('pin') || '');
    const [nickname, setNickname] = useState('');
    const [myAvatar, setMyAvatar] = useState(null);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3001`;
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on('join-success', (data) => {
            setMyAvatar(data.avatar);
            sessionStorage.setItem('vq_avatar', data.avatar);
            setPlayers(data.players);
            setCategory(data.category);
            setStep('nickname');
            setError(null);
        });

        newSocket.on('join-error', (data) => {
            setError(data.message);
        });

        newSocket.on('player-joined', (data) => {
            setPlayers(prev => [...prev, data.player]);
        });

        newSocket.on('player-updated', (data) => {
            setPlayers(data.players);
        });

        newSocket.on('game-started', (data) => {
            const savedAvatar = sessionStorage.getItem('vq_avatar');
            navigate(`/play/game/${data.pin || pin}`, {
                state: { nickname, avatar: savedAvatar || myAvatar }
            });
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleJoinGame = (e) => {
        e.preventDefault();
        if (pin.length !== 6) {
            setError('Il PIN deve essere di 6 cifre');
            return;
        }
        socket.emit('join-game', { pin });
    };

    const handleSetNickname = (e) => {
        e.preventDefault();
        if (!nickname.trim()) {
            setError('Inserisci un nickname');
            return;
        }
        sessionStorage.setItem('vq_nickname', nickname.trim());
        sessionStorage.setItem('vq_pin', pin);
        socket.emit('update-nickname', { pin, nickname: nickname.trim() });
        setStep('waiting');
    };

    // STEP 1: PIN Input
    if (step === 'pin') {
        return (
            <div className="min-h-screen bg-primary flex flex-col">
                <div className="bg-primary-light border-b border-white/5 px-6 py-4">
                    <span className="text-duo-green font-nunito font-black text-xl">VileQuiz</span>
                </div>
                <div className="flex-grow flex items-center justify-center p-6">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🎮</div>
                            <h1 className="text-4xl font-black text-white mb-2 font-nunito">
                                Unisciti!
                            </h1>
                            <p className="text-white/50 font-nunito">
                                Inserisci il PIN di 6 cifre
                            </p>
                        </div>

                        <form onSubmit={handleJoinGame} className="space-y-5">
                            <input
                                type="text"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
                                placeholder="000000"
                                className="w-full text-center text-5xl font-black py-5 px-4 rounded-duo bg-primary-card text-white tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-duo-green border-2 border-white/10 font-nunito"
                                maxLength={6}
                                autoFocus
                            />

                            {error && (
                                <div className="bg-duo-red/20 border border-duo-red/50 text-white px-4 py-3 rounded-duo text-center text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={pin.length !== 6}
                                className={`w-full py-4 text-xl font-extrabold rounded-duo transition-all font-nunito uppercase tracking-wide ${pin.length === 6
                                    ? 'btn-duo btn-duo-green'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                                    }`}
                            >
                                Unisciti
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // STEP 2: Nickname Form
    if (step === 'nickname') {
        return (
            <div className="min-h-screen bg-primary flex flex-col">
                <div className="bg-primary-light border-b border-white/5 px-6 py-4">
                    <span className="text-duo-green font-nunito font-black text-xl">VileQuiz</span>
                </div>
                <div className="flex-grow flex items-center justify-center p-6">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <div className="text-8xl mb-4">{myAvatar}</div>
                            <h1 className="text-3xl font-black text-white mb-2 font-nunito">
                                Il tuo avatar!
                            </h1>
                            <p className="text-white/50 font-nunito">
                                Scegli il tuo nickname
                            </p>
                        </div>

                        <form onSubmit={handleSetNickname} className="space-y-5">
                            <div>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value.substring(0, 12))}
                                    placeholder="Il tuo nome"
                                    className="w-full text-center text-2xl font-bold py-4 px-6 rounded-duo bg-primary-card text-white focus:outline-none focus:ring-2 focus:ring-duo-green border-2 border-white/10 font-nunito"
                                    maxLength={12}
                                    autoFocus
                                />
                                <p className="text-white/30 text-xs text-center mt-2 font-nunito">
                                    {nickname.length}/12 caratteri
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!nickname.trim()}
                                className={`w-full py-4 text-xl font-extrabold rounded-duo transition-all font-nunito uppercase tracking-wide ${nickname.trim()
                                    ? 'btn-duo btn-duo-green'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                                    }`}
                            >
                                Conferma
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // STEP 3: Waiting Lobby
    return (
        <div className="min-h-screen bg-primary">
            <div className="bg-primary-light border-b border-white/5 px-6 py-4">
                <span className="text-duo-green font-nunito font-black text-xl">VileQuiz</span>
            </div>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="text-7xl mb-4">{myAvatar}</div>
                    <h1 className="text-3xl font-black text-white mb-2 font-nunito">{nickname}</h1>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="w-2.5 h-2.5 bg-duo-green rounded-full animate-pulse" />
                        <span className="text-white/50 text-sm font-nunito">In attesa dell'host...</span>
                    </div>
                </div>

                {category && (
                    <div className="card-duo p-4 mb-8 text-center">
                        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Categoria</p>
                        <p className="text-white text-xl font-bold font-nunito">{category}</p>
                    </div>
                )}

                <div className="card-duo p-6">
                    <h2 className="text-xl font-bold text-white mb-5 text-center font-nunito">
                        Giocatori ({players.length})
                    </h2>
                    {players.length <= 1 ? (
                        <div className="text-center text-white/30 py-6">
                            <p className="font-nunito">In attesa di altri giocatori...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {players
                                .filter(p => p.socketId !== socket?.id)
                                .map(player => (
                                    <PlayerCard key={player.socketId} player={player} />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Join;
