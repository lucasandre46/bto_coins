import React, { useEffect, useState } from 'react';
import { fetchMarketData } from './fetch';
import { formatCurrency, formatPercentage } from './functions';
import '../../index.css';
import './market.css';

export default function Market() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchMarketData().then(data => setItems(data));
    }, []);

    return (
        <div className="page-container market-screen">
            <header className="page-header">
                <h1>Mercado</h1>
                <a href="/" className="btn-secondary">Voltar</a>
            </header>

            <main className="market-scrollable-area">
                {items.map(item => (
                    <div key={item.id} className="market-card glass-panel">
                        <div className="card-header">
                            <span className="symbol">{item.symbol}</span>
                            <span className={`type-badge ${item.type}`}>{item.type === 'crypto' ? 'Cripto' : 'Ação'}</span>
                        </div>
                        <div className="card-body">
                            <h3 className="name">{item.name}</h3>
                            <p className="price">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="card-footer">
                            <span className={`change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                                {formatPercentage(item.change)}
                            </span>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
