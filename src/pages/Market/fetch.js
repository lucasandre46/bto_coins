const API_BASE_URL = 'http://localhost:3000/market'; // Já incluí o /market aqui

export const AVAILABLE_SYMBOLS = [
    'BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'USDC', 'ADA', 'AVAX', 'DOGE',
    'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3', 'ABEV3', 'WEGE3', 'ELET3', 'RENT3', 'JBSS3',
    'B3SA3', 'RADL3', 'SUZB3', 'BPAC11', 'EQTL3', 'VIVT3', 'SBSP3', 'HAPV3', 'LREN3', 'RDOR3'
];

export async function fetchMarketData(symbols) {
    if (!symbols || symbols.length === 0) return [];

    try {
        const query = symbols.join(',');
        // A URL final será http://localhost:3000/market/cards?symbols=BTC,ETH...
        const response = await fetch(`${API_BASE_URL}/card?symbols=${query}`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados do mercado: status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro na API de mercado:", error);
        return [];
    }
}