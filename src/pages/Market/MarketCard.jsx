import React from 'react';
import { formatCurrency, formatPercentage } from './functions';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import './MarketCard.css';

export default function MarketCard({
    symbol,
    price,
    change,
    logo,
    history = [],
    onCardClick
}) {
    const isPositive = change >= 0;

    let reversedHistory = history ? [...history].reverse() : [];

    // Removendo a simulação para utilizar EXATAMENTE os dados enviados pela API.
    // Se a API mandar apenas 2 pontos, o gráfico mostrará a real ligação entre eles.

    const chartData = reversedHistory.length > 0
        ? reversedHistory.map((p, index) => {
            const now = new Date();
            // Data retroativa baseada no índice (ex: 15 mins ou 1 dia de distância por ponto real).
            const pointDate = new Date(now.getTime() - (reversedHistory.length - 1 - index) * 3600000);
            const currentPrice = Number(p);
            const prevPrice = index > 0 ? Number(reversedHistory[index - 1]) : currentPrice;
            const diff = index > 0 ? currentPrice - prevPrice : 0;
            const timeString = pointDate.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '');
            
            return { 
                price: currentPrice, 
                index: index,
                time: timeString,
                diff: diff,
                isUp: currentPrice >= prevPrice
            };
        })
        : [];

    const renderCustomDot = (props) => {
        const { cx, cy, payload } = props;
        const dotColor = payload.isUp ? "#4ade80" : "#f87171";
        return (
            <circle cx={cx} cy={cy} r={5} stroke={dotColor} strokeWidth={2.5} fill="#1c1f26" key={`dot-${payload.index}`} />
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const diffColor = data.diff >= 0 ? '#4ade80' : '#f87171';
            return (
                <div style={{ backgroundColor: '#1c1f26', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 5px 0', fontSize: '0.85rem' }}>{label}</p>
                    <p style={{ color: '#fff', margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(data.price)}</p>
                    {data.index > 0 && data.diff !== 0 && (
                        <p style={{ color: diffColor, margin: '5px 0 0 0', fontSize: '0.9rem', fontWeight: '600' }}>
                            {data.diff > 0 ? '▲ Subiu' : '▼ Caiu'} {formatCurrency(Math.abs(data.diff))}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="market-card-dashboard" onClick={() => onCardClick?.(symbol)}>
            {/* Cabeçalho: Info Empresa + Preço */}
            <div className="card-header-layout">
                <div className="company-info">
                    {logo ? (
                        <img src={logo} alt={symbol} className="company-logo-circle" />
                    ) : (
                        <div className="logo-placeholder">{symbol.charAt(0)}</div>
                    )}
                    <div className="name-variation-group">
                        <h2 className="company-name">{symbol}</h2>
                        <span className={`variation-text ${isPositive ? 'positive' : 'negative'}`}>
                            {isPositive ? '▲' : '▼'} {formatPercentage(change)}
                        </span>
                    </div>
                </div>

                <div className="current-price-box">
                    <span className="main-price-display">{formatCurrency(price)}</span>
                </div>
            </div>

            {/* Gráfico: Alinhado à direita e ocupando a metade inferior */}
            <div className="graph-container-split">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 30, right: 10, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isPositive ? "#4ade80" : "#f87171"} stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor={isPositive ? "#4ade80" : "#f87171"} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="rgba(255,255,255,0.15)" />
                            <XAxis 
                                dataKey="time" 
                                stroke="rgba(255,255,255,0.5)" 
                                fontSize={11} 
                                tickMargin={12} 
                                minTickGap={10}
                                tickLine={true}
                                axisLine={true}
                            />
                            <YAxis 
                                domain={['dataMin', 'dataMax']} 
                                stroke="rgba(255,255,255,0.4)" 
                                fontSize={11}
                                tickFormatter={(val) => `R$ ${val.toFixed(2)}`}
                                width={60}
                                orientation="left"
                                tickLine={false}
                                axisLine={false}
                                tick={{ dx: -5 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {chartData.length > 0 && (
                                <ReferenceLine 
                                    y={chartData[chartData.length - 1].price} 
                                    stroke={isPositive ? "#4ade80" : "#f87171"} 
                                    strokeDasharray="3 3" 
                                    strokeOpacity={0.6} 
                                />
                            )}

                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={isPositive ? "#4ade80" : "#f87171"}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                dot={renderCustomDot}
                                activeDot={{ r: 6, fill: isPositive ? "#4ade80" : "#f87171", stroke: '#1c1f26', strokeWidth: 2 }}
                                isAnimationActive={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-msg">Dados indisponíveis</div>
                )}
            </div>
        </div>
    );
}