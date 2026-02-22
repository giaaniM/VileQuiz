import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AudioManager from './services/AudioManager';
import './index.css';
import CategorySelection from './pages/CategorySelection';
import Lobby from './pages/Lobby';
import Join from './pages/Join';
import GameRoom from './pages/GameRoom';
import PlayerController from './pages/PlayerController';
import ScaledContainer from './components/ScaledContainer';

function Home() {
  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-primary-light border-b border-white/5">
        <span className="text-duo-green font-nunito font-black text-2xl tracking-tight">VileQuiz</span>
        <Link
          to="/join"
          className="btn-duo btn-duo-white px-5 py-2 text-sm font-bold"
        >
          Ho un codice
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 pb-12">
        <div className="text-center max-w-md">
          {/* Logo / Mascot */}
          <div className="text-8xl mb-6 filter drop-shadow-lg">
            🧠
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-3 font-nunito">
            VileQuiz
          </h1>
          <p className="text-lg text-white/60 mb-10 font-nunito">
            Il quiz multiplayer più divertente!
          </p>

          {/* CTA Buttons - Duolingo 3D style */}
          <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
            <Link
              to="/host"
              className="btn-duo btn-duo-green text-center py-4 text-lg font-extrabold tracking-wide"
            >
              🎯 Crea Partita
            </Link>
            <Link
              to="/join"
              className="btn-duo btn-duo-blue text-center py-4 text-lg font-extrabold tracking-wide"
            >
              🎮 Unisciti
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-white/20 text-xs font-nunito">
        VileQuiz © 2026
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Check if the clicked element or any of its parents is interactive
      const isClickable = e.target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer'
      );

      // Also check computed style for cursor: pointer as a fallback
      const hasPointerCursor = window.getComputedStyle(e.target).cursor === 'pointer';

      if (isClickable || hasPointerCursor) {
        AudioManager.playSFX('general_click');
      }
    };

    // Add listener to the window/document
    window.addEventListener('click', handleGlobalClick);

    // Cleanup
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScaledContainer referenceHeight={768}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<CategorySelection />} />
          <Route path="/host/lobby" element={<Lobby />} />
          <Route path="/host/game/:pin" element={<GameRoom />} />
          <Route path="/play" element={<Join />} />
          <Route path="/join" element={<Join />} />
          <Route path="/play/game/:pin" element={<PlayerController />} />
        </Routes>
      </ScaledContainer>
    </BrowserRouter>
  );
}

export default App;
