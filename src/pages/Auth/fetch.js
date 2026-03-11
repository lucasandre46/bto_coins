const API_BASE_URL = 'https://bto-api-isoj.vercel.app/'; // Ajuste conforme a porta da sua API

export async function loginUser(email, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login.');
        }
        return data; // Pode conter token, user info etc.
    } catch (error) {
        throw error;
    }
}

export async function registerUser(nome, email, senha, telefone) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, telefone })
        });

        const data = await response.json();
        if (!response.ok) {
            // Se for um array de mensagens de erro (comum no class-validator do Nest)
            const errorMsg = Array.isArray(data.message) ? data.message[0] : (data.message || 'Erro ao cadastrar.');
            throw new Error(errorMsg);
        }
        return data;
    } catch (error) {
        throw error;
    }
}
