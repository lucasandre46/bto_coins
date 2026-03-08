import React from 'react';
import { formatCurrency, formatPercentage } from './functions';
import './MarketCard.css';

export default function MarketCard({
    symbol,
    price,
    change,
    logo,
    onCardClick,
    onFavoriteClick
}) {
    const isPositive = change >= 0;

    return (
        <div
            className="market-card glass-panel"
            onClick={() => onCardClick(symbol)}
        >
            <div className="card-header">
                {logo ? (
                    <img src={logo} alt={`${symbol} logo`} className="card-logo" />
                ) : (
                    <div className="card-logo-placeholder" />
                )}
                <span className="symbol">{symbol}</span>
            </div>

            <div className="card-body">
                <p className="price">{formatCurrency(price)}</p>
            </div>

            <div className="card-footer">
                <div className="footer-actions">
                    <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? '▲ ' : '▼ '}
                        {formatPercentage(change)}
                    </span>
                    <button
                        className="favorite-btn"
                        onClick={(e) => onFavoriteClick(e, symbol)}
                        title="Favoritar"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
