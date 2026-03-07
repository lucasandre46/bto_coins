export function fetchUserProfile() {
    console.log("Fetching user profile (mock)...");
    return Promise.resolve({
        id: 101,
        name: "João Silva",
        email: "joao.silva@exemplo.com",
        memberSince: "2023-05-12"
    });
}
