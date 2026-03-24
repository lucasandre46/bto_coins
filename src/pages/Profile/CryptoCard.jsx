import React from 'react';
import './CryptoCard.css';

function formatPrice(value) {
    const num = Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

function formatChange(value) {
    const num = Number(value) || 0;
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
}

function formatMarketCap(value) {
    if (!value) return '—';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
}

export default function CryptoCard({ coin, isFavorited = false, onFavoriteClick, onClick, compact = false }) {
    const isPositive = (coin.change24h ?? coin.change ?? 0) >= 0;
    const changeValue = coin.change24h ?? coin.change ?? 0;

    return (
        <div
            className={`crypto-card glass-panel ${compact ? 'is-compact' : ''}`}
            onClick={() => onClick && onClick(coin.symbol)}
        >
            <div className="card-content-wrapper">
                {/* Header row: logo + name + favorite */}
                <div className="crypto-card__header">
                    <div className="crypto-card__identity">
                        {coin.image || coin.logo ? (
                            <img
                                src={coin.image ?? coin.logo}
                                alt={coin.symbol}
                                className="crypto-card__logo"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className="crypto-card__logo-placeholder">
                                {(coin.symbol || '?').charAt(0)}
                            </div>
                        )}
                        <div className="symbol-name-group">
                            <span className="crypto-card__symbol">{coin.symbol}</span>
                            {!compact && <span className="crypto-card__name">{coin.name}</span>}
                        </div>
                    </div>

                    {!compact && onFavoriteClick && (
                        <button
                            className={`crypto-card__fav-btn ${isFavorited ? 'favorited' : ''}`}
                            onClick={(e) => { e.stopPropagation(); onFavoriteClick(coin.symbol); }}
                            title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            <svg viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Price row */}
                <div className="crypto-card__price-row">
                    <div className="price-group">
                        <span className="crypto-card__price">{formatPrice(coin.price)}</span>
                        {!compact && (
                            <span className={`crypto-card__change ${isPositive ? 'positive' : 'negative'}`}>
                                {isPositive ? '▲' : '▼'} {formatChange(changeValue)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer: rank + market cap */}
                {!compact && (
                    <div className="crypto-card__footer">
                        {coin.rank && <span className="crypto-card__rank">#{coin.rank}</span>}
                        {coin.marketCap && (
                            <span className="crypto-card__mcap">Mkt Cap: {formatMarketCap(coin.marketCap)}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
