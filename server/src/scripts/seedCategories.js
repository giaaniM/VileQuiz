const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Category = require('../models/Category');

// Immagini stock da Unsplash (URL pubblici, no API key necessaria)
const categories = [
    {
        name: 'Geografia',
        description: 'Esplora il mondo con quiz su capitali, monumenti e curiosità geografiche',
        icon_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        name: 'Storia',
        description: 'Viaggia nel tempo attraverso eventi storici e personaggi leggendari',
        icon_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        name: 'Scienza',
        description: 'Scopri i misteri della fisica, chimica, biologia e astronomia',
        icon_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        name: 'Pop Culture',
        description: 'Metti alla prova la tua conoscenza su meme, trend e cultura pop',
        icon_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        name: 'Cinema',
        description: 'Da Hollywood a Cinecittà: quiz su film, registi e attori iconici',
        icon_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        name: 'Musica',
        description: 'Dalle note classiche al pop moderno: testa il tuo orecchio musicale',
        icon_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        name: 'Sport',
        description: 'Calcio, basket, olimpiadi e record mondiali: sei un vero sportivo?',
        icon_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        name: 'Tecnologia',
        description: 'Dalla programmazione all\'AI: quiz per veri nerd del tech',
        icon_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        name: 'Arte',
        description: 'Capolavori rinascimentali e arte contemporanea: conosci i grandi maestri?',
        icon_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        name: 'Natura',
        description: 'Animali, piante ed ecosistemi: scopri le meraviglie del nostro pianeta',
        icon_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    }
];

async function seedCategories() {
    try {
        // Connetti al database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-game');
        console.log('✅ Connected to MongoDB');

        // Pulisci le categorie esistenti
        await Category.deleteMany({});
        console.log('🗑️  Cleared existing categories');

        // Inserisci le nuove categorie
        const result = await Category.insertMany(categories);
        console.log(`✅ Successfully seeded ${result.length} categories`);

        // Mostra le categorie inserite
        console.log('\n📋 Categories created:');
        result.forEach((cat, index) => {
            console.log(`   ${index + 1}. ${cat.name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
}

// Esegui il seed
seedCategories();
