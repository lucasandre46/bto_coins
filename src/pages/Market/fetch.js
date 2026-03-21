import { supabase } from '../../lib/supabase';

const API_BASE_URL = 'https://bto-api-isoj.vercel.app/market';

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