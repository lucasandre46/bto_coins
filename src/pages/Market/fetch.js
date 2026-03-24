import { supabase } from '../../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bto-api-isoj.vercel.app/market';
const CRYPTO_API_URL = import.meta.env.VITE_API_CRYPTO_URL || API_BASE_URL.replace('/market', '/crypto');

export const AVAILABLE_SYMBOLS = [
    'PETR4', 'VALE3', 'ITUB4', 'MGLU3'
];

export async function fetchMarketData(symbols) {
    if (!symbols || symbols.length === 0) return [];

    try {
        const query = symbols.join(',');
        const response = await fetch(`${API_BASE_URL}/card?symbols=${query}`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados do mercado: status ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos da API:", data);
        return data;
    } catch (error) {
        console.error("Erro na API de mercado:", error);
        return [];
    }
}

export async function fetchTopCryptoData() {
    try {
        const response = await fetch(`${CRYPTO_API_URL}/top-coins`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados de cripto: status ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados de cripto recebidos:", data);

        // A API de crypto retorna um formato diferente (do getTopCoins do NestJS)
        // Precisamos garantir que o formato seja compatível com o MarketCard
        return data.map(coin => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            price: coin.price,
            change: coin.change24h,      // alias used by MiniMarketCard / stock code
            change24h: coin.change24h,   // original field used by CryptoCard
            logo: coin.image,            // alias
            image: coin.image,           // original field
            marketCap: coin.marketCap,
            rank: coin.rank,
            history: [],
        }));
    } catch (error) {
        console.error("Erro na API de cripto:", error);
        return [];
    }
}

export async function toggleFavorite(symbol) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    console.log(`Tentando favoritar ${symbol} para user_id: ${user.id}`);

    // CORRIGIDO: user_favorites (Inglês)
    const { data: existing, error: fetchError } = await supabase
        .from('user_favorites')
        .select()
        .eq('user_id', user.id)
        .eq('symbol', symbol)
        .maybeSingle();

    if (fetchError) {
        console.error("Erro ao verificar favorito:", fetchError.message);
        throw new Error("Erro ao verificar favorito");
    }

    if (existing) {
        // Unfavorite
        const { error: deleteError } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('symbol', symbol);

        if (deleteError) {
            console.error("Erro ao remover favorito:", deleteError.message);
            throw new Error("Erro ao remover favorito");
        }
        return { message: 'Removido', symbol };
    } else {
        // Favorite
        const { error: insertError } = await supabase
            .from('user_favorites')
            .insert({ user_id: user.id, symbol: symbol });

        if (insertError) {
            console.error("Erro ao adicionar favorito:", insertError.message);
            throw new Error("Erro ao adicionar favorito");
        }
        return { message: 'Adicionado', symbol };
    }
}