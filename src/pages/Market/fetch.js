export function fetchMarketData() {
    console.log("Fetching market data (mock)...");
    return Promise.resolve([
        { id: 1, symbol: 'BTC', name: 'Bitcoin', price: 65000, type: 'crypto', change: 1.5 },
        { id: 2, symbol: 'ETH', name: 'Ethereum', price: 3400, type: 'crypto', change: -0.2 },
        { id: 3, symbol: 'PETR4', name: 'Petrobras', price: 38.5, type: 'stock', change: 2.1 },
        { id: 4, symbol: 'VALE3', name: 'Vale', price: 62.1, type: 'stock', change: -1.1 },
        { id: 5, symbol: 'SOL', name: 'Solana', price: 145, type: 'crypto', change: 5.4 },
        { id: 6, symbol: 'ITUB4', name: 'Itaú', price: 33.2, type: 'stock', change: 0.5 }
    ]);
}
