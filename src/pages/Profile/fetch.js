const API_BASE_URL = 'http://localhost:3000'; // Ajuste conforme a porta da conexão

export async function fetchUserProfile() {
    console.log("Fetching user profile from API...");
    const token = localStorage.getItem('@btocoins:token');

    if (!token) {
        throw new Error("Usuário não autenticado");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao obter perfil.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        throw error;
    }
}
