import React from 'react';
import { formatCurrency, formatPercentage } from './functions';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import './MarketCard.css';

export default function MarketCard({
    symbol,
    price,
    change,
    logo,
    history = [], // Recebe o array de preços do backend
    onCardClick,
    onFavoriteClick
}) {
    const isPositive = change >= 0;

    // Formata os dados para o Recharts, garantindo números
    const chartData = history && history.length > 0
        ? history.map((p, index) => ({ price: Number(p), index }))
        : [];

    return (
        <div className="market-card-dashboard glass-panel" onClick={() => onCardClick(symbol)}>
            {/* Topo: Identificação e Preço */}
            <div className="card-top-section">
                <div className="asset-info">
                    {logo ? (
                        <img
                            src={logo}
                            alt={symbol}
                            className="dashboard-logo"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop if fallback also fails
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = 'block';
                                }
                            }}
                        />
                    ) : null}
                    <div
                        className="dashboard-logo-placeholder"
                        style={{ display: logo ? 'none' : 'block' }}
                    />
                    <div>
                        <h2 className="dashboard-symbol">{symbol}</h2>
                        <span className={`dashboard-change ${isPositive ? 'positive' : 'negative'}`}>
                            {isPositive ? '▲ ' : '▼ '}{formatPercentage(change)}
                        </span>
                    </div>
                </div>

                <div className="price-info">
                    <span className="dashboard-price">{formatCurrency(price)}</span>
                    <button
                        className="favorite-btn-dashboard"
                        onClick={(e) => onFavoriteClick(e, symbol)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Centro: Área do Gráfico */}
            <div className="card-graph-area" style={{ border: 'none', outline: 'none' }}>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value) => [formatCurrency(value), 'Preço']}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke={isPositive ? "#4ade80" : "#f87171"}
                                strokeWidth={4}
                                dot={false}
                                isAnimationActive={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        Nenhum dado de gráfico disponível
                    </div>
                )}
            </div>

            <div className="card-footer-hint">
                Últimos 5 dias...
            </div>
        </div>
    );
}