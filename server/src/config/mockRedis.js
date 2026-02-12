/**
 * Mock Redis Client - In-Memory Storage
 * Usato per testing quando Redis reale non è disponibile
 */

class MockRedisClient {
    constructor() {
        this.storage = new Map();
        this.status = 'ready';
    }

    async get(key) {
        return this.storage.get(key) || null;
    }

    async set(key, value) {
        this.storage.set(key, value);
        return 'OK';
    }

    async setex(key, ttl, value) {
        this.storage.set(key, value);
        // In produzione, implementeremmo il TTL, ma per il mock lo ignoriamo
        return 'OK';
    }

    async exists(key) {
        return this.storage.has(key) ? 1 : 0;
    }

    async del(key) {
        return this.storage.delete(key) ? 1 : 0;
    }

    async keys(pattern) {
        // Semplice implementazione che ritorna tutte le chiavi
        return Array.from(this.storage.keys());
    }

    // Metodi per compatibilità con Redis client
    on(event, handler) {
        // Mock event emitter
    }

    quit() {
        this.storage.clear();
    }
}

module.exports = MockRedisClient;
