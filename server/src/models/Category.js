const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    icon_url: {
        type: String,
        required: true
    },
    difficulty_range: {
        type: [String],
        enum: ['easy', 'medium', 'hard'],
        default: ['easy', 'medium']
    },
    total_questions_generated: {
        type: Number,
        default: 0
    },
    avg_rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Category', categorySchema);
