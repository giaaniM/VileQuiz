#!/usr/bin/env node

/**
 * 🧪 VileQuiz - Test Domande
 * 
 * Genera e testa domande direttamente da terminale senza avviare il gioco.
 * 
 * USO:
 *   node scripts/test-questions.js                     # Mostra help
 *   node scripts/test-questions.js musica              # 10 domande su Musica
 *   node scripts/test-questions.js cinema 5            # 5 domande su Cinema
 *   node scripts/test-questions.js mixed               # 10 domande miste (1 per categoria)
 *   node scripts/test-questions.js musica --runs=3     # 3 generazioni consecutive (test duplicati)
 *   node scripts/test-questions.js --all               # 1 generazione per ogni categoria
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const groqService = require('../src/services/GroqService');

const CATEGORIES = [
    'Geografia', 'Storia', 'Scienza', 'Pop Culture', 'Cinema',
    'Musica', 'Sport', 'Tecnologia', 'Arte', 'Natura'
];

const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgGreen: '\x1b[42m',
    bgRed: '\x1b[41m',
    bgYellow: '\x1b[43m',
};

function printHelp() {
    console.log(`
${COLORS.bright}${COLORS.cyan}🧪 VileQuiz - Test Domande${COLORS.reset}
${COLORS.dim}Genera e testa domande direttamente da terminale.${COLORS.reset}

${COLORS.yellow}USO:${COLORS.reset}
  ${COLORS.bright}node scripts/test-questions.js <categoria> [n_domande] [--runs=N]${COLORS.reset}
  ${COLORS.bright}node scripts/test-questions.js mixed${COLORS.reset}
  ${COLORS.bright}node scripts/test-questions.js --all${COLORS.reset}

${COLORS.yellow}CATEGORIE:${COLORS.reset}
  ${CATEGORIES.map(c => `  ${COLORS.cyan}${c.toLowerCase().padEnd(14)}${COLORS.reset} → ${c}`).join('\n')}

${COLORS.yellow}OPZIONI:${COLORS.reset}
  ${COLORS.green}--runs=N${COLORS.reset}     Genera N volte consecutive (test duplicati)
  ${COLORS.green}--all${COLORS.reset}        Genera per tutte le categorie
  ${COLORS.green}mixed${COLORS.reset}        Genera domande miste (1 per categoria)

${COLORS.yellow}ESEMPI:${COLORS.reset}
  node scripts/test-questions.js musica
  node scripts/test-questions.js cinema 5
  node scripts/test-questions.js musica --runs=3
  node scripts/test-questions.js mixed
  node scripts/test-questions.js --all
`);
}

function printQuestion(q, idx, showCategory = false) {
    const optionLetters = ['A', 'B', 'C', 'D'];
    const categoryTag = showCategory ? ` ${COLORS.magenta}[${q.category}]${COLORS.reset}` : '';

    console.log(`\n${COLORS.bright}${COLORS.yellow}  Q${idx + 1}.${COLORS.reset}${categoryTag} ${q.text}`);

    if (q.options) {
        q.options.forEach((opt, i) => {
            const marker = i === q.correctAnswer
                ? `${COLORS.bgGreen}${COLORS.bright} ${optionLetters[i]} ${COLORS.reset}`
                : `${COLORS.dim} ${optionLetters[i]} ${COLORS.reset}`;
            const optColor = i === q.correctAnswer ? COLORS.green : COLORS.dim;
            console.log(`     ${marker} ${optColor}${opt}${COLORS.reset}`);
        });
    }
}

function checkDuplicates(allQuestions) {
    const textMap = {};
    let dupeCount = 0;

    for (const q of allQuestions) {
        const normalized = q.text.toLowerCase().trim();
        if (textMap[normalized]) {
            textMap[normalized]++;
            dupeCount++;
        } else {
            textMap[normalized] = 1;
        }
    }

    if (dupeCount > 0) {
        console.log(`\n${COLORS.bgRed}${COLORS.bright} ⚠️  DUPLICATI TROVATI: ${dupeCount} ${COLORS.reset}`);
        for (const [text, count] of Object.entries(textMap)) {
            if (count > 1) {
                console.log(`  ${COLORS.red}×${count}${COLORS.reset} ${text}`);
            }
        }
    } else {
        console.log(`\n${COLORS.bgGreen}${COLORS.bright} ✅ NESSUN DUPLICATO! ${COLORS.reset} (${allQuestions.length} domande uniche)`);
    }

    return dupeCount;
}

async function generateForCategory(category, count, runNumber = null) {
    const runLabel = runNumber !== null ? ` (Run ${runNumber})` : '';
    console.log(`\n${COLORS.bright}${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
    console.log(`${COLORS.bright}  📚 ${category} — ${count} domande${runLabel}${COLORS.reset}`);
    console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);

    const start = Date.now();
    const questions = await groqService.generateQuestions(category, count);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (!questions) {
        console.log(`  ${COLORS.red}❌ Errore nella generazione!${COLORS.reset}`);
        return [];
    }

    questions.forEach((q, i) => printQuestion(q, i));
    console.log(`\n  ${COLORS.dim}⏱️  Generato in ${elapsed}s (${questions.length} domande)${COLORS.reset}`);

    return questions;
}

async function generateMixed() {
    console.log(`\n${COLORS.bright}${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
    console.log(`${COLORS.bright}  🎲 Domande Miste (1 per categoria)${COLORS.reset}`);
    console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);

    const start = Date.now();
    const questions = await groqService.generateMixedQuestions(CATEGORIES);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    if (!questions) {
        console.log(`  ${COLORS.red}❌ Errore nella generazione!${COLORS.reset}`);
        return [];
    }

    questions.forEach((q, i) => printQuestion(q, i, true));
    console.log(`\n  ${COLORS.dim}⏱️  Generato in ${elapsed}s (${questions.length} domande)${COLORS.reset}`);

    return questions;
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        printHelp();
        return;
    }

    // Parse --runs=N
    const runsArg = args.find(a => a.startsWith('--runs='));
    const runs = runsArg ? parseInt(runsArg.split('=')[1]) || 1 : 1;
    const filteredArgs = args.filter(a => !a.startsWith('--'));

    // --all flag
    if (args.includes('--all')) {
        console.log(`${COLORS.bright}${COLORS.cyan}🌍 Generazione per TUTTE le categorie...${COLORS.reset}`);
        const allQuestions = [];
        for (const cat of CATEGORIES) {
            const qs = await generateForCategory(cat, 5);
            allQuestions.push(...qs);
        }
        checkDuplicates(allQuestions);
        return;
    }

    // mixed mode
    if (filteredArgs[0]?.toLowerCase() === 'mixed') {
        const allQuestions = [];
        for (let r = 0; r < runs; r++) {
            const qs = await generateMixed();
            allQuestions.push(...qs);
        }
        if (runs > 1) checkDuplicates(allQuestions);
        return;
    }

    // Single category
    const inputCategory = filteredArgs[0];
    const count = parseInt(filteredArgs[1]) || 10;

    // Find matching category (case-insensitive)
    const category = CATEGORIES.find(c => c.toLowerCase() === inputCategory?.toLowerCase());
    if (!category) {
        console.log(`${COLORS.red}❌ Categoria "${inputCategory}" non trovata.${COLORS.reset}`);
        console.log(`${COLORS.yellow}Categorie disponibili:${COLORS.reset} ${CATEGORIES.join(', ')}`);
        return;
    }

    const allQuestions = [];
    for (let r = 0; r < runs; r++) {
        const qs = await generateForCategory(category, count, runs > 1 ? r + 1 : null);
        allQuestions.push(...qs);
    }

    if (runs > 1) {
        checkDuplicates(allQuestions);
    }
}

main().catch(err => {
    console.error(`${COLORS.red}Errore fatale:${COLORS.reset}`, err);
    process.exit(1);
});
