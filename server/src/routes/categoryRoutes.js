const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory } = require('../controllers/categoryController');

// GET /api/categories - Ritorna tutte le categorie
router.get('/categories', getAllCategories);

// GET /api/categories-mock - Ritorna categorie mock per testing
router.get('/categories-mock', (req, res) => {
    const mockCategories = require('../utils/categories');
    res.json(mockCategories);
});

// POST /api/categories - Crea nuova categoria (admin)
router.post('/categories', createCategory);

module.exports = router;
