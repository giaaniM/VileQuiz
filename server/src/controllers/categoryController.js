const Category = require('../models/Category');

/**
 * GET /api/categories
 * Ritorna tutte le categorie ordinate per nome
 */
const getAllCategories = async (req, res) => {
    try {
        let categories = [];
        // Try fetching from MongoDB if connected
        if (require('mongoose').connection.readyState === 1) {
            categories = await Category.find().sort({ name: 1 });
        }

        // Fallback to mock data if DB is empty or not connected
        if (!categories || categories.length === 0) {
            console.log('⚠️ Using mock categories (DB empty or disconnected)');
            categories = require('../utils/categories');
        }

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback on error too
        res.json(require('../utils/categories'));
    }
};

/**
 * POST /api/categories
 * Crea una nuova categoria (admin only)
 */
const createCategory = async (req, res) => {
    try {
        const { name, description, icon_url, difficulty_range } = req.body;

        // Validazione base
        if (!name || !description || !icon_url) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const category = new Category({
            name,
            description,
            icon_url,
            difficulty_range: difficulty_range || ['easy', 'medium']
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);

        // Gestione errore duplicato
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Category already exists' });
        }

        res.status(500).json({ error: 'Failed to create category' });
    }
};

module.exports = {
    getAllCategories,
    createCategory
};
