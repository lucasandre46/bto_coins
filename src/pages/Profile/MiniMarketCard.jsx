import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatPercentage } from '../Market/functions';
import '../Market/MarketCard.css'; // Uses same basic styling
import './MiniMarketCard.css';

export default function MiniMarketCard({ symbol, price, change, logo, onFavoriteClick }) {
    const isPositive = change >= 0;
    const navigate = useNavigate();

    return (
        <div
            className="market-card-dashboard glass-panel mini-card"
            onClick={() => navigate(`/profile/${symbol}`)}
        >
            <div className="card-top-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <div className="asset-info">
                    {logo ? (
                        <img
                            src={logo}
                            alt={symbol}
                            className="dashboard-logo"
                            onError={(e) => {
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
                        className="favorite-btn-dashboard favorited"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavoriteClick(symbol);
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
