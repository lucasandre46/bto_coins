const API_BASE_URL = 'http://localhost:3000/market'; // Já incluí o /market aqui

export const AVAILABLE_SYMBOLS = [
    'PETR4', 'VALE3', 'ITUB4', 'MGLU3'
];

export async function fetchMarketData(symbols) {
    if (!symbols || symbols.length === 0) return [];

    try {
        const query = symbols.join(',');
        // IMPORTANTE: Confira se no seu Controller está @Get('card') ou @Get('cards')
        const response = await fetch(`${API_BASE_URL}/card?symbols=${query}`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados do mercado: status ${response.status}`);
        }

        const data = await response.json();

        // Log para você conferir no console do navegador se o history está vindo
        console.log("Dados recebidos da API:", data);

        return data;
    } catch (error) {
        console.error("Erro na API de mercado:", error);
        return [];
    }
}

export async function toggleFavorite(symbol) {
    const token = localStorage.getItem('@btocoins:token');
    if (!token) throw new Error("Usuário não autenticado");

    const response = await fetch(`http://localhost:3000/profile/favorite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ symbol })
    });

    if (!response.ok) {
        throw new Error("Erro ao favoritar");
    }

    return await response.json();
}