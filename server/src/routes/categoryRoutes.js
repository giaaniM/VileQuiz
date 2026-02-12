const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory } = require('../controllers/categoryController');

// GET /api/categories - Ritorna tutte le categorie
router.get('/categories', getAllCategories);

// GET /api/categories-mock - Ritorna categorie mock per testing
router.get('/categories-mock', (req, res) => {
    const mockCategories = [
        { _id: '1', name: 'Geografia', description: 'Esplora il mondo con quiz su capitali, monumenti e curiosità geografiche', icon_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80', difficulty_range: ['easy', 'medium'] },
        { _id: '2', name: 'Storia', description: 'Viaggia nel tempo attraverso eventi storici e personaggi leggendari', icon_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80', difficulty_range: ['medium', 'hard'] },
        { _id: '3', name: 'Scienza', description: 'Scopri i segreti dell\'universo con domande su fisica, chimica e biologia', icon_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80', difficulty_range: ['medium', 'hard'] },
        { _id: '4', name: 'Sport', description: 'Metti alla prova la tua conoscenza sportiva su calcio, basket e olimpiadi', icon_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80', difficulty_range: ['easy', 'medium'] },
        { _id: '5', name: 'Cinema', description: 'Quiz su film cult, registi famosi e curiosità dal mondo del cinema', icon_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80', difficulty_range: ['easy', 'hard'] },
        { _id: '6', name: 'Musica', description: 'Da Mozart ai Beatles: sfida la tua cultura musicale', icon_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80', difficulty_range: ['medium'] },
        { _id: '7', name: 'Arte', description: 'Esplora i capolavori artistici dal Rinascimento all\'arte moderna', icon_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80', difficulty_range: ['medium', 'hard'] },
        { _id: '8', name: 'Tecnologia', description: 'Quiz su innovazioni tech, gadget e il futuro digitale', icon_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', difficulty_range: ['easy', 'medium'] },
        { _id: '9', name: 'Cucina', description: 'Ricette, ingredienti e tradizioni culinarie da tutto il mondo', icon_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', difficulty_range: ['easy'] },
        { _id: '10', name: 'Natura', description: 'Animali, piante e meraviglie del mondo naturale', icon_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', difficulty_range: ['easy', 'medium'] }
    ];
    res.json(mockCategories);
});

// POST /api/categories - Crea nuova categoria (admin)
router.post('/categories', createCategory);

module.exports = router;
