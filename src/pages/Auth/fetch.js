import { supabase } from '../../lib/supabase';

export async function loginUser(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
    });

    if (error) {
        throw new Error(error.message);
    }

    return {
        token: data.session?.access_token,
        user: data.user
    };
}

export async function registerUser(nome, email, senha, telefone) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
            data: {
                full_name: nome, // Padronizado para o Supabase dashboard
                phone: telefone, // Padronizado para o Supabase dashboard
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }

    return {
        token: data.session?.access_token,
        user: data.user
    };
}

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/profile'
        }
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
