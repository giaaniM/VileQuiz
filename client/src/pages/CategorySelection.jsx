import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';

function CategorySelection() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories-mock');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (category) => {
        console.log('Selected category:', category);
        navigate('/host/lobby', { state: { category, mode: 'single' } });
    };

    const handleMixedMode = () => {
        navigate('/host/lobby', {
            state: {
                category: {
                    name: 'Mista',
                    _id: 'mixed',
                    icon_url: '/mixed-mode.png',
                    description: 'Un mix esplosivo di tutte le categorie! Preparati a saltare dalla geografia alla scienza in un attimo.'
                },
                mode: 'mixed'
            }
        });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">⚠️ Errore</h2>
                    <p className="text-white/80">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            {/* Top Bar */}
            <div className="bg-primary-light border-b border-white/5 px-6 py-4">
                <span className="text-duo-green font-nunito font-black text-xl">VileQuiz</span>
            </div>

            <div className="p-6 md:p-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3 font-nunito">
                        Scegli una Categoria
                    </h1>
                    <p className="text-lg text-white/50 font-nunito">
                        Seleziona il tema del tuo quiz
                    </p>
                </div>

                {/* Mixed Mode — Special Card */}
                <div className="mb-8">
                    <button
                        onClick={handleMixedMode}
                        className="w-full relative overflow-hidden rounded-duo-lg group h-40 transition-all hover:-translate-y-1 shadow-md hover:shadow-xl"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(/mixed-mode.png)` }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-duo-purple/90 via-duo-purple/70 to-transparent" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center px-8 justify-between">
                            <div className="text-left max-w-xl">
                                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 backdrop-blur-sm">
                                    <span>🎲</span>
                                    <span>Speciale</span>
                                </div>
                                <h3 className="text-3xl font-black text-white font-nunito mb-1 drop-shadow-md">Modalità Mista</h3>
                                <p className="text-white/90 font-medium text-sm max-w-md">
                                    10 domande da tutte le categorie — preparati a testare la tua conoscenza a 360°!
                                </p>
                            </div>

                            <div className="w-16 h-16 bg-white text-duo-purple rounded-full flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                                ▶
                            </div>
                        </div>
                    </button>
                </div>

                {/* Divider */}

                {/* Standard Categories Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-video bg-primary-card rounded-duo animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Special Categories Divider */}
                        {categories.some(c => c.isSpecial) && (
                            <>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex-grow h-px bg-white/10"></div>
                                    <span className="text-duo-purple font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                        <span>✨</span> Categorie Speciali <span>✨</span>
                                    </span>
                                    <div className="flex-grow h-px bg-white/10"></div>
                                </div>

                                {/* Special Categories Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                                    {categories.filter(c => c.isSpecial).map((category) => (
                                        <CategoryCard
                                            key={category._id}
                                            category={category}
                                            onSelect={handleCategorySelect}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Standard Categories Divider */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-grow h-px bg-white/10"></div>
                            <span className="text-white/30 text-sm font-bold uppercase tracking-widest">oppure scegli un tema classico</span>
                            <div className="flex-grow h-px bg-white/10"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                            {categories.filter(c => !c.isSpecial).map((category) => (
                                <CategoryCard
                                    key={category._id}
                                    category={category}
                                    onSelect={handleCategorySelect}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CategorySelection;
