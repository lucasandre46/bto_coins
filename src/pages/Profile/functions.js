export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

export function handleLogout() {
    console.log("Mock logout handler called");
    alert("Saindo do sistema...");
}
