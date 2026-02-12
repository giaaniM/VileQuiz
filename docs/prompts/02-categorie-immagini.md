# PROMPT 2: Sistema Categorie + Immagini Stock

## 🎯 Obiettivo
Implementare il sistema di gestione categorie di quiz con immagini stock.

## 🔧 Backend

1. **Modello MongoDB Category**
   - Schema con campi: name, description, icon_url, difficulty_range, stats
   
2. **API REST**
   - GET `/api/categories` → lista categorie con immagini
   - POST `/api/categories` → crea nuova categoria (admin)
   
3. **Seed database** con 10 categorie iniziali:
   - Geografia
   - Storia
   - Scienza
   - Pop Culture
   - Cinema
   - Musica
   - Sport
   - Tecnologia
   - Arte
   - Natura

4. **Integrazione Unsplash API** per immagini stock (o alternative gratuite)

## 🎨 Frontend (Host)

1. **Pagina CategorySelection** con grid responsive
2. **Card categoria** con:
   - Immagine background
   - Nome categoria
   - Descrizione breve
   - Hover effects
3. **Animazione hover**: scale + lift shadow
4. **Click categoria** → transizione a Lobby

## 📐 Design

- Grid: 2 col mobile, 3 col tablet, 4 col desktop
- Card aspect ratio 16:9
- Skeleton loader durante fetch

## 📦 Deliverable

- 10 categorie precaricate nel database
- Grid categorie funzionante su `/host`
- Immagini stock caricate da Unsplash/Pexels
- Animazioni hover smooth
