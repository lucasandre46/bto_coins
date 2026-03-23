import { supabase } from '../../lib/supabase';

export async function fetchUserProfile() {
    console.log("Fetching user profile from Supabase Auth...");
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Usuário não autenticado");
    }

    // CORRIGIDO: user_favorites (Inglês)
    const { data: favs, error: favError } = await supabase
        .from('user_favorites')
        .select('symbol')
        .eq('user_id', user.id);

    if (favError) {
        console.error("Erro ao carregar favoritos do banco de dados:", favError.message);
    }

    return {
        nome: user.user_metadata.full_name || 'Usuário',
        email: user.email,
        telefone: user.user_metadata.phone || '',
        favoritos: favs ? favs.map(f => f.symbol) : []
    };
}
