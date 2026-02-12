# Quiz Game Web App - Executive Summary

## 🎯 Descrizione

Quiz Game è una web app multiplayer in tempo reale ispirata a Kahoot, con generazione dinamica delle domande tramite LLM (Llama). Il gioco prevede un host su desktop/laptop che controlla la partita e partecipanti che rispondono tramite smartphone.

## ✨ Caratteristiche Principali

- 🤖 **Generazione domande AI-powered** con LLM (Llama o alternativa free)
- 🌐 **Multiplayer real-time** via WebSocket (Socket.IO)
- 📱 **QR Code** per join rapido da mobile
- 🎮 **Mobile come controller** (A/B/C/D buttons)
- ✨ **Animazioni fluide** e musiche coinvolgenti
- 📊 **Classifica dinamica** con sorpassi animati
- ⚖️ **NO vantaggi per velocità** di risposta - solo correttezza
- ⏱️ **Timer 15 secondi** per domanda

## 🎯 Target e Use Cases

- **Educazione**: quiz didattici in classe
- **Team building**: eventi aziendali
- **Social gaming**: serate con amici
- **Training**: formazione interattiva

## 🏗️ Architettura a 3 Livelli

### PRESENTATION LAYER (Client)
- **Host App (Desktop)**: selezione categorie, controllo game, visualizzazione domande e classifiche
- **Player App (Mobile)**: lobby join, nickname, controller A/B/C/D, feedback istantaneo

### APPLICATION LAYER (Server)
- **Game Manager**: orchestrazione partite, timer, scoring
- **Socket Handler**: gestione connessioni WebSocket
- **LLM Service**: generazione domande AI
- **Category Service**: gestione categorie e immagini stock

### DATA LAYER
- **MongoDB**: categorie, domande generate, statistiche
- **Redis**: game state in-memory, sessioni attive
