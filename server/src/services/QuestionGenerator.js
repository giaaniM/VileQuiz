const GroqService = require('./GroqService');
const fs = require('fs');
const path = require('path');

// Available categories for mixed mode
// Available categories for mixed mode (macro categories only)
const MIXED_CATEGORIES = [
    'Geografia', 'Storia', 'Scienza', 'Pop Culture', 'Cinema',
    'Musica', 'Sport', 'Tecnologia', 'Arte', 'Natura'
];

class QuestionGenerator {
    constructor() {
        this.fallbackQuestions = this.loadFallbackQuestions();
    }

    loadFallbackQuestions() {
        return [
            {
                text: "Qual è la capitale dell'Italia?",
                options: ["Milano", "Roma", "Napoli", "Torino"],
                correctAnswer: 1,
                category: "Geografia"
            },
            {
                text: "Chi ha dipinto la Gioconda?",
                options: ["Michelangelo", "Raffaello", "Leonardo da Vinci", "Donatello"],
                correctAnswer: 2,
                category: "Arte"
            },
            {
                text: "Quanto fa 5 x 5?",
                options: ["20", "25", "30", "35"],
                correctAnswer: 1,
                category: "Matematica"
            },
            {
                text: "Qual è il pianeta più vicino al Sole?",
                options: ["Venere", "Mercurio", "Terra", "Marte"],
                correctAnswer: 1,
                category: "Astronomia"
            },
            {
                text: "In quale anno è caduto il muro di Berlino?",
                options: ["1987", "1988", "1989", "1990"],
                correctAnswer: 2,
                category: "Storia"
            }
        ];
    }

    async getQuestions(category, count = 10) {
        console.log(`🤖 Generazione domande per categoria: ${category}...`);

        const apiKey = process.env.GROQ_API_KEY;
        console.log(`🔑 GROQ_API_KEY check: ${apiKey ? 'PRESENT (' + apiKey.substring(0, 4) + '...)' : 'MISSING'}`);

        try {
            const aiQuestions = await GroqService.generateQuestions(category, count);

            if (aiQuestions && Array.isArray(aiQuestions) && aiQuestions.length > 0) {
                let finalQuestions = aiQuestions;
                if (finalQuestions.length < count) {
                    console.warn(`⚠️ Solo ${finalQuestions.length}/${count} domande generate. Riempio con fallback...`);
                    const fallbackNeeded = count - finalQuestions.length;
                    const fallback = this.fallbackQuestions.slice(0, fallbackNeeded);
                    // Add isFallback flag to track them
                    const fallbackWithFlag = fallback.map(q => ({ ...q, isFallback: true }));
                    finalQuestions = [...finalQuestions, ...fallbackWithFlag];
                }

                console.log(`✅ ${finalQuestions.length} domande generate (incl. fallback)`);
                return this.formatQuestions(finalQuestions, category);
            }
        } catch (error) {
            console.error('❌ Errore QuestionGenerator:', error.message);
        }

        console.warn('⚠️ Uso domande di fallback.');
        return this.formatQuestions(this.fallbackQuestions);
    }

    /**
     * Mixed mode: generate 10 questions, each from a different random category
     */
    async getMixedQuestions(count = 10) {
        console.log(`🎲 Generazione domande MISTE (${count} categorie random)...`);

        // Pick N unique random categories
        const shuffled = [...MIXED_CATEGORIES].sort(() => Math.random() - 0.5);
        const selectedCategories = shuffled.slice(0, count);

        console.log(`🎯 Categorie selezionate: ${selectedCategories.join(', ')}`);

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.warn('⚠️ GROQ_API_KEY non trovata. Uso domande di fallback per mixed mode.');
            return this.formatQuestions(this.fallbackQuestions);
        }

        try {
            // Generate all questions in a single AI call for efficiency
            const aiQuestions = await GroqService.generateMixedQuestions(selectedCategories);

            if (aiQuestions && Array.isArray(aiQuestions) && aiQuestions.length > 0) {
                let finalQuestions = aiQuestions;
                if (finalQuestions.length < count) {
                    console.warn(`⚠️ Solo ${finalQuestions.length}/${count} domande miste generate. Riempio con fallback...`);
                    const fallbackNeeded = count - finalQuestions.length;
                    const fallback = this.fallbackQuestions.slice(0, fallbackNeeded);
                    // Add isFallback flag and generic category
                    const fallbackWithFlag = fallback.map(q => ({ ...q, category: 'Mista (Fallback)', isFallback: true }));
                    finalQuestions = [...finalQuestions, ...fallbackWithFlag];
                }

                console.log(`✅ ${finalQuestions.length} domande miste (incl. fallback) generate!`);
                return this.formatQuestions(finalQuestions);
            }
        } catch (error) {
            console.error('❌ Errore getMixedQuestions:', error.message);
        }

        // Fallback: try generating one question per category individually
        console.warn('⚠️ Tentativo di fallback: generazione singola per categoria...');
        const questions = [];
        for (const cat of selectedCategories) {
            try {
                const catQuestions = await GroqService.generateQuestions(cat, 1);
                if (catQuestions && catQuestions.length > 0) {
                    questions.push({ ...catQuestions[0], category: cat });
                }
            } catch (e) {
                console.error(`❌ Fallback fallito per ${cat}:`, e.message);
            }
        }

        if (questions.length < selectedCategories.length) {
            console.warn(`⚠️ Solo ${questions.length}/${selectedCategories.length} categorie coperte. Riempio con fallback...`);
            const fallbackNeeded = selectedCategories.length - questions.length;
            const fallback = this.fallbackQuestions.slice(0, fallbackNeeded);
            for (const fb of fallback) {
                questions.push({ ...fb, category: 'Mista (Fallback)', isFallback: true });
            }
        }

        if (questions.length > 0) {
            return this.formatQuestions(questions);
        }

        // Ultimate fallback
        console.warn('⚠️ Uso domande di fallback generiche.');
        return this.formatQuestions(this.fallbackQuestions);
    }

    formatQuestions(questions, defaultCategory = null) {
        return questions.map((q, index) => ({
            id: index,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            category: q.category || defaultCategory || null,
            timeLimit: 15
        }));
    }
}

module.exports = new QuestionGenerator();
