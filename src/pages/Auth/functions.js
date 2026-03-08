export function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export function validatePassword(password) {
    return password.length >= 6; // Exemplo de regra simples: mínimo 6 caracteres
}

export function formatPhoneNumber(value) {
    // Remove tudo que não for dígito
    const digits = value.replace(/\D/g, "");

    // Formata como (XX) XXXXX-XXXX
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
