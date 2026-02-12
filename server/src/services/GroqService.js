const axios = require('axios');

// Sub-temi mainstream e Italia-centrici per varietà senza essere troppo nicchia
const SUB_TOPICS = {
    'Geografia': [
        'regioni e città italiane', 'capitali europee famose', 'mari e oceani', 'monumenti famosi nel mondo',
        'fiumi italiani e europei', 'nazioni e bandiere', 'isole famose', 'montagne e catene montuose',
        'piatti tipici e regioni italiane', 'laghi italiani', 'confini dell\'Italia', 'città d\'arte italiane',
        'capitali del mondo', 'paesi dell\'Unione Europea', 'vulcani famosi',
    ],
    'Storia': [
        'antica Roma', 'Risorgimento italiano', 'Unità d\'Italia', 'personaggi storici italiani',
        'seconda guerra mondiale in Italia', 'l\'Italia del dopoguerra', 'Rinascimento italiano',
        'Repubblica Italiana', 'presidenti della Repubblica', 'storia della Costituzione italiana',
        'esploratori italiani', 'medioevo in Italia', 'rivoluzioni famose', 'eventi storici del 900',
    ],
    'Scienza': [
        'il corpo umano', 'il sistema solare', 'animali e curiosità', 'invenzioni famose',
        'scienziati celebri', 'la Terra e i suoi elementi', 'alimentazione e salute',
        'fenomeni naturali', 'scoperte che hanno cambiato il mondo', 'spazio e astronauti',
        'energy e ambiente', 'il clima e le stagioni', 'medicina e scoperte',
    ],
    'Pop Culture': [
        'programmi TV italiani famosi', 'reality show italiani', 'personaggi TV italiani',
        'serie TV popolari su Netflix', 'videogiochi famosi', 'social media e tendenze',
        'meme famosi', 'youtuber e influencer italiani', 'festival di Sanremo',
        'pubblicità famose italiane', 'tormentoni estivi', 'trasmissioni Rai e Mediaset',
        'cartoni animati cresciuti in Italia', 'fenomeni virali',
    ],
    'Cinema': [
        'commedie italiane famose', 'attori italiani celebri', 'film che tutti conoscono',
        'film Disney e Pixar', 'film premi Oscar famosi', 'registi italiani',
        'saghe cinematografiche', 'film degli anni 80 e 90', 'colonne sonore indimenticabili',
        'film di Natale italiani', 'Cinepanettoni', 'film di Bud Spencer e Terence Hill',
        'citazioni cinematografiche famose', 'blockbuster hollywoodiani',
    ],
    'Musica': [
        'cantautori italiani famosi', 'Festival di Sanremo', 'canzoni italiane famose',
        'musica pop italiana', 'hit internazionali famose', 'gruppi musicali italiani',
        'tormentoni estivi', 'colonne sonore di film famosi', 'cantanti pop internazionali',
        'musica anni 80 e 90', 'rapper italiani', 'Lucio Dalla, De André, Battisti e simili',
        'Eurovision', 'canzoni di Natale', 'strumenti musicali comuni',
    ],
    'Sport': [
        'calcio italiano e Serie A', 'Mondiali di calcio', 'campioni olimpici italiani',
        'Formula 1 e piloti famosi', 'tennis e campioni italiani', 'ciclismo e Giro d\'Italia',
        'calciatori italiani leggendari', 'stadi italiani', 'sport alle Olimpiadi',
        'Europei di calcio', 'nuoto e tuffi', 'pallavolo italiana', 'record sportivi famosi',
    ],
    'Tecnologia': [
        'smartphone e app famose', 'storia di Internet', 'social network',
        'intelligenza artificiale e robot', 'inventori e invenzioni', 'Apple e Google',
        'videogiochi storici', 'lo spazio e le missioni spaziali', 'auto elettriche e futuro',
        'gadget e tecnologia quotidiana', 'computer e loro evoluzione', 'sicurezza online',
    ],
    'Arte': [
        'artisti italiani del Rinascimento', 'musei italiani famosi', 'opere d\'arte famose',
        'Leonardo da Vinci', 'Michelangelo e la Cappella Sistina', 'architettura italiana',
        'monumenti e chiese famose', 'correnti artistiche note', 'Palazzo degli Uffizi e altri musei',
        'sculture famose', 'mosaici e affreschi italiani', 'arte contemporanea accessibile',
    ],
    'Natura': [
        'animali comuni e curiosi', 'parchi nazionali italiani', 'animali domestici',
        'fiori e piante comuni', 'ecosistemi marini', 'animali della fattoria',
        'record del mondo animale', 'stagioni e clima', 'alberi e foreste',
        'vulcani e terremoti in Italia', 'animali in via di estinzione famosi', 'oceani e mari',
    ],
};

// Categorie che devono avere un focus italiano nelle domande
const ITALY_FOCUSED_CATEGORIES = new Set([
    'Geografia', 'Storia', 'Pop Culture', 'Cinema', 'Musica', 'Sport', 'Arte'
]);

class GroqService {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY;
        this.apiUrl = process.env.GROQ_URL || 'https://api.groq.com/openai/v1/chat/completions';
        this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
        // Storico domande per evitare ripetizioni (ultime N domande)
        this.questionHistory = [];
        this.MAX_HISTORY = 200;
    }

    /**
     * Seleziona N sub-temi casuali da una categoria
     */
    _getRandomSubTopics(category, n = 3) {
        const topics = SUB_TOPICS[category];
        if (!topics || topics.length === 0) return [];
        const shuffled = [...topics].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n);
    }

    /**
     * Restituisce le ultime domande già fatte per una categoria
     */
    _getRecentQuestionsFor(category) {
        return this.questionHistory
            .filter(q => q.category === category)
            .slice(-15)
            .map(q => q.text);
    }

    /**
     * Salva le domande nello storico
     */
    _saveToHistory(questions, category) {
        for (const q of questions) {
            this.questionHistory.push({
                text: q.text,
                category: category || q.category || 'unknown',
                timestamp: Date.now(),
            });
        }
        // Tronca se troppo lungo
        if (this.questionHistory.length > this.MAX_HISTORY) {
            this.questionHistory = this.questionHistory.slice(-this.MAX_HISTORY);
        }
    }

    /**
     * Verifica le domande generate per eliminare allucinazioni.
     * Il fact-checker è MOLTO più aggressivo: nel dubbio, scarta.
     */
    async _verifyQuestions(questions, apiKey) {
        if (!questions || questions.length === 0) return questions;

        const questionsForVerification = questions.map((q, i) => ({
            id: i,
            text: q.text,
            answer: q.options[q.correctAnswer],
            allOptions: q.options
        }));

        const verifyPrompt = `
      Sei un fact-checker ESTREMAMENTE rigoroso per un quiz televisivo. Il tuo lavoro è evitare figuracce in diretta TV.
      
      Verifica OGNI domanda qui sotto. Per ciascuna, controlla:
      1. La domanda è basata su fatti REALI e verificabili?
      2. La risposta indicata come corretta È EFFETTIVAMENTE CORRETTA?
      3. Le date menzionate sono giuste?
      4. I nomi di persone, film, canzoni, eventi ESISTONO REALMENTE?
      5. Le attribuzioni sono corrette? (es. regista giusto per quel film, autore giusto per quella canzone)
      
      Domande da verificare:
      ${JSON.stringify(questionsForVerification, null, 2)}
      
      SEGNALA COME INVALIDA ("valid": false) qualsiasi domanda che:
      - Menziona persone, canzoni, film, libri, eventi che NON ESISTONO
      - Ha la risposta corretta SBAGLIATA (es. attribuisce un'opera all'autore sbagliato)
      - Contiene date ERRATE (es. anno di uscita sbagliato di un film/canzone)
      - Combina fatti reali in modo sbagliato (es. film giusto ma regista sbagliato)
      - Ti sembra anche solo DUBBIA o non sei sicuro al 100% — nel dubbio, invalida
      
      Restituisci SOLO un array JSON: [{"id": 0, "valid": true}, {"id": 1, "valid": false}]
    `;

        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'Sei il fact-checker più rigoroso del mondo. Il tuo motto è: NEL DUBBIO, INVALIDA. È meglio scartare una domanda corretta che lasciarne passare una sbagliata. Rispondi SOLO con JSON array valido.'
                        },
                        {
                            role: 'user',
                            content: verifyPrompt
                        }
                    ],
                    temperature: 0.0, // Zero creatività, massima precisione
                    max_tokens: 1000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0].message.content;
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const verifications = JSON.parse(cleanContent);

            if (!Array.isArray(verifications)) return questions;

            const invalidIds = new Set(
                verifications.filter(v => !v.valid).map(v => v.id)
            );

            if (invalidIds.size > 0) {
                const invalidTexts = questions
                    .filter((_, i) => invalidIds.has(i))
                    .map(q => `  ❌ "${q.text}"`);
                console.log(`⚠️ Fact-check: ${invalidIds.size} domande rimosse:\n${invalidTexts.join('\n')}`);
            }

            return questions.filter((_, i) => !invalidIds.has(i));

        } catch (error) {
            console.warn('⚠️ Verifica domande fallita, uso domande non verificate:', error.message);
            return questions;
        }
    }

    /**
     * Genera un singolo batch di domande RAW (senza retry).
     * Metodo interno usato dal loop di retry.
     */
    async _generateRawBatch(category, count, apiKey, extraAvoidTexts = []) {
        const subTopics = this._getRandomSubTopics(category, 2);
        const subTopicHint = subTopics.length > 0
            ? `\n      ISPIRAZIONE: Prendi spunto da questi argomenti: ${subTopics.join(', ')}.`
            : '';

        const italyHint = ITALY_FOCUSED_CATEGORIES.has(category)
            ? `\n      FOCUS ITALIANO: Almeno il 50% delle domande devono riguardare l'Italia o avere un collegamento con la cultura italiana.`
            : '';

        const recentQuestions = this._getRecentQuestionsFor(category);
        const allAvoid = [...recentQuestions, ...extraAvoidTexts];
        const avoidHint = allAvoid.length > 0
            ? `\n      DOMANDE GIÀ FATTE (NON ripeterle e non fare domande simili):\n      ${allAvoid.map(q => `- "${q}"`).join('\n      ')}`
            : '';

        const prompt = `
      Genera ${count} domande di quiz sulla categoria "${category}".
      Questo è un QUIZ DA TV per famiglie, tipo "L'Eredità" o "Chi vuol essere milionario".
      ${subTopicHint}
      ${italyHint}
      ${avoidHint}
      
      Restituisci SOLO un array JSON valido senza markdown o altro testo.
      Ogni oggetto nell'array deve avere questo formato esatto:
      {
        "text": "Domanda qui?",
        "options": ["Opzione A", "Opzione B", "Opzione C", "Opzione D"],
        "correctAnswer": 0
      }
      
      Regole:
      - "options" deve contenere esattamente 4 stringhe.
      - "correctAnswer" deve essere l'indice (0-3) della risposta corretta nell'array "options".
      - Le domande devono essere di CULTURA POPOLARE, cose che la gente normale conosce.
      - NON fare domande troppo specifiche, tecniche o accademiche.
      - ⚠️ REGOLA CRITICA ANTI-ERRORI:
        * NON combinare più di 2 dettagli specifici in una domanda (es. NO anno + regista + attori + titolo).
        * NON mettere date specifiche (anni) nelle domande a meno che tu sia ASSOLUTAMENTE CERTO.
        * Preferisci domande semplici tipo "Quale di questi è...?" o "Chi ha cantato...?" con UN SOLO fatto da verificare.
        * Se non sei SICURO AL 100% che un fatto sia corretto, NON includerlo nella domanda.
        * NON INVENTARE NULLA. Zero tolleranza per fatti inventati.
      - Lingua: Italiano.
      - ID Sessione: ${Date.now()}-${Math.random().toString(36).slice(2)}
    `;

        const response = await axios.post(
            this.apiUrl,
            {
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Sei un autore di quiz televisivi per famiglie. Crei domande divertenti e accessibili, come quelle de "L\'Eredità" o "Chi vuol essere milionario". Le domande devono essere di cultura popolare, cose che la gente normale conosce. NON fare domande troppo specifiche o accademiche. Rispondi sempre e solo con JSON array valido.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 3500
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const content = response.data.choices[0].message.content;
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const questions = JSON.parse(cleanContent);

        if (!Array.isArray(questions)) {
            throw new Error('La risposta non è un array');
        }

        return questions.slice(0, count);
    }

    /**
     * Genera domande per una specifica categoria con RETRY ROBUSTO.
     * Continua a generare batch finché non ha abbastanza domande verificate.
     * Max 3 tentativi per evitare loop infiniti.
     */
    async generateQuestions(category, count = 10) {
        const rawKey = process.env.GROQ_API_KEY || this.apiKey;
        const apiKey = rawKey ? rawKey.trim() : null;

        if (!apiKey) {
            console.warn('⚠️ GROQ_API_KEY non trovata. Uso domande di fallback.');
            return null;
        }

        const MAX_ATTEMPTS = 3;
        const verifiedPool = [];
        const allGeneratedTexts = []; // Per evitare duplicati tra batch

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            const needed = count - verifiedPool.length;
            if (needed <= 0) break;

            // Pausa tra tentativi per evitare rate limit
            if (attempt > 1) await new Promise(r => setTimeout(r, 3000));

            // Chiedi qualcuna in più per compensare eventuali scarti
            const batchSize = Math.min(needed + 3, 14);

            console.log(`🔄 Tentativo ${attempt}/${MAX_ATTEMPTS}: genero ${batchSize} domande per "${category}" (ne servono ${needed})...`);

            try {
                const rawBatch = await this._generateRawBatch(category, batchSize, apiKey, allGeneratedTexts);
                const verified = await this._verifyQuestions(rawBatch, apiKey);

                // Aggiungi al pool, evitando duplicati
                for (const q of verified) {
                    if (!allGeneratedTexts.includes(q.text)) {
                        verifiedPool.push(q);
                        allGeneratedTexts.push(q.text);
                    }
                }

                console.log(`✅ Pool: ${verifiedPool.length}/${count} domande verificate`);

                if (verifiedPool.length >= count) break;

            } catch (error) {
                console.error(`❌ Tentativo ${attempt} fallito:`, error.response?.data || error.message);
            }
        }

        if (verifiedPool.length === 0) {
            console.error('❌ Nessuna domanda verificata dopo tutti i tentativi.');
            return null;
        }

        // Prendi le prime 'count' domande dal pool
        const final = verifiedPool.slice(0, count);

        if (final.length < count) {
            console.warn(`⚠️ Solo ${final.length}/${count} domande disponibili dopo ${MAX_ATTEMPTS} tentativi.`);
        }

        this._saveToHistory(final, category);
        console.log(`🎯 ${final.length} domande consegnate per "${category}"`);
        return final;
    }

    /**
     * Genera domande miste con RETRY ROBUSTO.
     * Per ogni categoria mancante, ritenta la generazione.
     * Max 3 tentativi per evitare loop infiniti.
     */
    async generateMixedQuestions(categories) {
        const rawKey = process.env.GROQ_API_KEY || this.apiKey;
        const apiKey = rawKey ? rawKey.trim() : null;

        if (!apiKey) {
            console.warn('⚠️ GROQ_API_KEY non trovata.');
            return null;
        }

        const MAX_ATTEMPTS = 3;
        const verifiedByCategory = {}; // { categoryName: question }

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            // Trova le categorie per cui non abbiamo ancora una domanda
            const missingCategories = categories.filter(c => !verifiedByCategory[c]);
            if (missingCategories.length === 0) break;

            // Pausa tra tentativi per evitare rate limit
            if (attempt > 1) await new Promise(r => setTimeout(r, 3000));

            console.log(`🔄 Mixed tentativo ${attempt}/${MAX_ATTEMPTS}: ${missingCategories.length} categorie mancanti...`);

            // Per ogni categoria mancante, seleziona un sotto-tema casuale
            const categoriesWithHints = missingCategories.map(c => {
                const subs = this._getRandomSubTopics(c, 1);
                return subs.length > 0 ? `${c} (spunto: ${subs[0]})` : c;
            });
            const categoriesList = categoriesWithHints.map((c, i) => `${i + 1}. ${c}`).join('\n');

            const italyCategories = missingCategories.filter(c => ITALY_FOCUSED_CATEGORIES.has(c));
            const italyHint = italyCategories.length > 0
                ? `\n      FOCUS ITALIANO: Per le categorie ${italyCategories.join(', ')}, dai preferenza a domande legate all'Italia.`
                : '';

            const allRecent = this.questionHistory.slice(-30).map(q => q.text);
            const avoidHint = allRecent.length > 0
                ? `\n      DOMANDE GIÀ FATTE (NON ripeterle):\n      ${allRecent.map(q => `- "${q}"`).join('\n      ')}`
                : '';

            const prompt = `
      Genera esattamente ${missingCategories.length} domande di quiz, UNA per ciascuna delle seguenti categorie:
      ${categoriesList}
      Questo è un QUIZ DA TV per famiglie, tipo "L'Eredità" o "Chi vuol essere milionario".
      ${italyHint}
      ${avoidHint}
      
      Restituisci SOLO un array JSON valido senza markdown o altro testo.
      Ogni oggetto nell'array deve avere questo formato esatto:
      {
        "text": "Domanda qui?",
        "options": ["Opzione A", "Opzione B", "Opzione C", "Opzione D"],
        "correctAnswer": 0,
        "category": "Nome Categoria"
      }
      
      Regole:
      - L'ordine delle domande DEVE corrispondere all'ordine delle categorie fornite.
      - "options" deve contenere esattamente 4 stringhe.
      - "correctAnswer" deve essere l'indice (0-3) della risposta corretta.
      - "category" deve essere il nome della categoria SENZA lo spunto tra parentesi.
      - DIFFICOLTÀ PROGRESSIVA: la prima domanda deve essere accessibile (ma mai banale o ovvia), l'ultima la più difficile.
        NON fare domande troppo facili tipo "qual è la capitale dell'Italia" — anche le domande facili devono far pensare un attimo.
      - Le domande devono essere di CULTURA POPOLARE, cose che la gente normale conosce.
      - NON fare domande troppo specifiche, tecniche o accademiche.
      - ⚠️ REGOLA CRITICA ANTI-ERRORI:
        * NON combinare più di 2 dettagli specifici in una domanda.
        * NON mettere date specifiche a meno che tu sia ASSOLUTAMENTE CERTO.
        * Preferisci strutture semplici: "Quale di questi è...?", "Chi ha cantato...?".
        * NON INVENTARE NULLA. Se non sei sicuro, non includerlo.
      - Lingua: Italiano.
      - ID Sessione: ${Date.now()}-${Math.random().toString(36).slice(2)}
    `;

            try {
                const response = await axios.post(
                    this.apiUrl,
                    {
                        model: this.model,
                        messages: [
                            {
                                role: 'system',
                                content: 'Sei un autore di quiz televisivi per famiglie. Crei domande divertenti e accessibili. Le domande devono essere di cultura popolare. NON fare domande troppo specifiche o accademiche. Rispondi sempre e solo con JSON array valido.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.5,
                        max_tokens: 3000
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const content = response.data.choices[0].message.content;
                const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
                const questions = JSON.parse(cleanContent);

                if (!Array.isArray(questions)) {
                    throw new Error('La risposta non è un array');
                }

                // Assegna la categoria corretta a ogni domanda
                const mapped = questions.slice(0, missingCategories.length).map((q, i) => ({
                    ...q,
                    category: missingCategories[i]
                }));

                // Verifica anti-allucinazione
                const verified = await this._verifyQuestions(mapped, apiKey);

                // Salva le verificate nel dizionario per categoria
                for (const q of verified) {
                    if (!verifiedByCategory[q.category]) {
                        verifiedByCategory[q.category] = q;
                    }
                }

                const filledCount = Object.keys(verifiedByCategory).length;
                console.log(`✅ Mixed pool: ${filledCount}/${categories.length} categorie coperte`);

            } catch (error) {
                console.error(`❌ Mixed tentativo ${attempt} fallito:`, error.response?.data || error.message);
            }
        }

        // Ricomponi le domande nell'ordine originale delle categorie
        const result = [];
        for (const cat of categories) {
            if (verifiedByCategory[cat]) {
                result.push(verifiedByCategory[cat]);
            }
        }

        if (result.length === 0) {
            console.error('❌ Nessuna domanda mista verificata dopo tutti i tentativi.');
            return null;
        }

        if (result.length < categories.length) {
            console.warn(`⚠️ Solo ${result.length}/${categories.length} categorie coperte.`);
        }

        this._saveToHistory(result);
        console.log(`🎯 ${result.length} domande miste consegnate`);
        return result;
    }
}

module.exports = new GroqService();
