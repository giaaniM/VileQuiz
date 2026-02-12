const Redis = require('ioredis');
const MockRedisClient = require('./mockRedis');

const connectRedis = () => {
    // Try to connect to real Redis
    const redisClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        retryStrategy: (times) => {
            // After 3 failed attempts, stop retrying
            if (times > 3) {
                console.log('⚠️  Redis unavailable, using in-memory mock');
                return null;
            }
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false
    });

    let useMock = false;

    redisClient.on('connect', () => {
        console.log('✅ Redis Connected');
    });

    redisClient.on('error', (err) => {
        if (!useMock) {
            console.error('❌ Redis Error:', err.message);
            console.log('⚠️  Switching to in-memory mock Redis...');
            useMock = true;
        }
    });

    // Se Redis fallisce immediatamente, usa il mock
    redisClient.on('close', () => {
        if (useMock) {
            console.log('🔄 Using mock Redis for development');
        }
    });

    // Wrapper che usa il mock se Redis fallisce
    const wrappedClient = new Proxy(redisClient, {
        get(target, prop) {
            // Se è una proprietà come 'status', ritornala direttamente
            if (prop === 'status') {
                return useMock ? 'ready' : target.status;
            }

            // Per i metodi, intercepta e usa il mock se necessario
            if (typeof target[prop] === 'function') {
                return async function (...args) {
                    try {
                        if (useMock || target.status !== 'ready') {
                            // Lazy init del mock
                            if (!this._mockClient) {
                                this._mockClient = new MockRedisClient();
                            }
                            return await this._mockClient[prop](...args);
                        }
                        return await target[prop](...args);
                    } catch (err) {
                        console.log('⚠️  Redis operation failed, using mock:', prop);
                        useMock = true;
                        if (!this._mockClient) {
                            this._mockClient = new MockRedisClient();
                        }
                        return await this._mockClient[prop](...args);
                    }
                };
            }

            return target[prop];
        }
    });

    return wrappedClient;
};

module.exports = connectRedis;

