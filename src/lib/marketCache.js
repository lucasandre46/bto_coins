/**
 * marketCache.js
 * Simple in-memory cache for market data (stocks + crypto).
 * Shared across the whole React session — survives re-renders but resets on page reload.
 */

const cache = {
    stocks: null,       // array of stock objects from fetchMarketData
    crypto: null,       // array of crypto objects from fetchTopCryptoData
    loadedAt: null,     // timestamp of last full load
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getCache() {
    return cache;
}

export function setCacheStocks(data) {
    cache.stocks = data;
    cache.loadedAt = Date.now();
}

export function setCacheCrypto(data) {
    cache.crypto = data;
    cache.loadedAt = Date.now();
}

export function isCacheStale() {
    if (!cache.loadedAt) return true;
    return Date.now() - cache.loadedAt > CACHE_TTL_MS;
}

export function clearCache() {
    cache.stocks = null;
    cache.crypto = null;
    cache.loadedAt = null;
}
