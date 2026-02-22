// Mock categories data
// Used by both the API endpoint and the Game Socket for category reveals

const categories = [
    {
        _id: '16',
        name: 'Sanremo',
        description: 'Storia, canzoni e conduttori del Festival della Canzone Italiana.',
        icon_url: '/images/sanremo.png',
        difficulty_range: ['easy', 'medium'],
        isSpecial: true
    },
    {
        _id: '17',
        name: 'Bridgerton',
        description: 'Intrighi, amori e scandali dell\'alta società londinese firmata Netflix.',
        icon_url: '/images/bridgerton.png',
        difficulty_range: ['easy', 'medium'],
        isSpecial: true
    },
    {
        _id: '1',
        name: 'Geografia',
        description: 'Esplora il mondo con quiz su capitali, monumenti e curiosità geografiche',
        icon_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        _id: '2',
        name: 'Storia',
        description: 'Viaggia nel tempo attraverso eventi storici e personaggi leggendari',
        icon_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        _id: '3',
        name: 'Scienza',
        description: 'Scopri i misteri della fisica, chimica, biologia e astronomia',
        icon_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        _id: '4',
        name: 'Pop Culture',
        description: 'Metti alla prova la tua conoscenza su meme, trend e cultura pop',
        icon_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        _id: '5',
        name: 'Cinema',
        description: 'Da Hollywood a Cinecittà: quiz su film, registi e attori iconici',
        icon_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        _id: '6',
        name: 'Musica',
        description: 'Dalle note classiche al pop moderno: testa il tuo orecchio musicale',
        icon_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        _id: '7',
        name: 'Sport',
        description: 'Calcio, basket, olimpiadi e record mondiali: sei un vero sportivo?',
        icon_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        _id: '8',
        name: 'Tecnologia',
        description: 'Dalla programmazione all\'AI: quiz per veri nerd del tech',
        icon_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        _id: '9',
        name: 'Arte',
        description: 'Capolavori rinascimentali e arte contemporanea: conosci i grandi maestri?',
        icon_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        _id: '10',
        name: 'Natura',
        description: 'Animali, piante ed ecosistemi: scopri le meraviglie del nostro pianeta',
        icon_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        _id: '11',
        name: 'Cucina',
        description: 'Piatti tipici, ingredienti e chef famosi: buon appetito!',
        icon_url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        _id: '12',
        name: 'Letteratura',
        description: 'Grandi classici, autori e poesie: un viaggio nelle parole.',
        icon_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        _id: '13',
        name: 'Animali',
        description: 'Regno animale, specie e habitat: conosci i nostri amici a 4 zampe?',
        icon_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80',
        difficulty_range: ['easy', 'medium']
    },
    {
        _id: '14',
        name: 'Matematica',
        description: 'Numeri, formule e logica: che la forza sia con te!',
        icon_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    },
    {
        _id: '15',
        name: 'Astronomia',
        description: 'Stelle, pianeti e galassie: verso l\'infinito e oltre!',
        icon_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        difficulty_range: ['medium', 'hard']
    }
];

module.exports = categories;
