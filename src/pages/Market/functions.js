export function formatCurrency(value) {
    // Garante que se o valor for nulo ou inválido, o app não quebre
    const numberValue = value || 0;

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numberValue);
}

export function formatPercentage(value) {
    // Garante que 'value' seja um número antes de usar o .toFixed
    const numberValue = value || 0;
    const sign = numberValue >= 0 ? '+' : '';
    return `${sign}${numberValue.toFixed(2)}%`;
}