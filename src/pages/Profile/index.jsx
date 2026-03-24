import React, { useEffect, useState, useCallback } from 'react';
import { fetchUserProfile } from './fetch';
import { handleLogout } from './functions';
import { useNavigate } from 'react-router-dom';
import { fetchMarketData, fetchTopCryptoData, AVAILABLE_SYMBOLS, toggleFavorite } from '../Market/fetch';
import { getCache, setCacheStocks, setCacheCrypto, isCacheStale } from '../../lib/marketCache';
import MiniMarketCard from './MiniMarketCard';
import CryptoCard from './CryptoCard';
import MarketCard from '../Market/MarketCard';
import '../../index.css';
import './profile.css';
import './MiniMarketCard.css';
import './CryptoCard.css';

const FILTERS = ['Todos', 'Ações', 'Cripto', 'Favoritos'];

export default function Profile() {
    const [user, setUser]                     = useState(null);
    const [stocks, setStocks]                 = useState([]);
    const [cryptos, setCryptos]               = useState([]);
    const [loadingMarket, setLoadingMarket]   = useState(false);
    const [error, setError]                   = useState(null);

    // Split-view
    const [selectedAsset, setSelectedAsset]         = useState(null);
    const [selectedAssetData, setSelectedAssetData] = useState(null);
    const [selectedAssetType, setSelectedAssetType] = useState(null); // 'stock' | 'crypto'

    // Filters
    const [activeFilter, setActiveFilter] = useState('Todos');

    const navigate = useNavigate();

    // ─── Load all market data (with cache) ──────────────────────────
    const loadMarketData = useCallback(async () => {
        const cache = getCache();

        if (!isCacheStale() && cache.stocks && cache.crypto) {
            setStocks(cache.stocks);
            setCryptos(cache.crypto);
            return;
        }

        setLoadingMarket(true);
        try {
            const [stockData, cryptoData] = await Promise.all([
                fetchMarketData(AVAILABLE_SYMBOLS),
                fetchTopCryptoData(),
            ]);

            setCacheStocks(stockData);
            setCacheCrypto(cryptoData);

            setStocks(stockData);
            setCryptos(cryptoData);
        } catch (err) {
            console.error('Erro ao carregar dados de mercado:', err);
        } finally {
            setLoadingMarket(false);
        }
    }, []);

    // ─── Load user profile + market data on mount ───────────────────
    useEffect(() => {
        fetchUserProfile()
            .then(data => {
                setUser(data);
                loadMarketData();
            })
            .catch(() => {
                setError('Erro ao carregar perfil. Faça login novamente.');
                localStorage.removeItem('@btocoins:token');
                setTimeout(() => navigate('/auth'), 2000);
            });
    }, [navigate, loadMarketData]);

    // ─── Derive visible list based on active filter ──────────────────
    const visibleItems = (() => {
        const favoriteSymbols = new Set(user?.favoritos ?? []);

        switch (activeFilter) {
            case 'Ações':
                return { stocks, cryptos: [] };

            case 'Cripto':
                return { stocks: [], cryptos };

            case 'Favoritos': {
                const favStocks  = stocks.filter(s => favoriteSymbols.has(s.symbol));
                const favCryptos = cryptos.filter(c => favoriteSymbols.has(c.symbol));
                return { stocks: favStocks, cryptos: favCryptos };
            }

            case 'Todos':
            default:
                return { stocks, cryptos };
        }
    })();

    // ─── Favorite toggle ─────────────────────────────────────────────
    const handleFavoriteClick = async (symbol) => {
        try {
            await toggleFavorite(symbol);
            setUser(prev => {
                const favs = prev.favoritos ?? [];
                const alreadyFav = favs.includes(symbol);
                return {
                    ...prev,
                    favoritos: alreadyFav
                        ? favs.filter(s => s !== symbol)
                        : [...favs, symbol],
                };
            });
        } catch (err) {
            alert('Erro ao favoritar: ' + err.message);
        }
    };

    // ─── Split-view handlers ─────────────────────────────────────────
    const handleStockSelect = (symbol) => {
        const asset = stocks.find(s => s.symbol === symbol);
        setSelectedAsset(symbol);
        setSelectedAssetData(asset);
        setSelectedAssetType('stock');
    };

    const handleCryptoSelect = (symbol) => {
        const asset = cryptos.find(c => c.symbol === symbol);
        setSelectedAsset(symbol);
        setSelectedAssetData(asset);
        setSelectedAssetType('crypto');
    };

    const handleCloseSplit = () => {
        setSelectedAsset(null);
        setSelectedAssetData(null);
        setSelectedAssetType(null);
    };

    // ─── Render guards ───────────────────────────────────────────────
    if (error)  return <div className="page-container"><p style={{ color: 'red' }}>{error}</p></div>;
    if (!user)  return <div className="page-container"><p>Carregando perfil...</p></div>;

    const favoriteSymbols = new Set(user?.favoritos ?? []);
    const hasItems = visibleItems.stocks.length > 0 || visibleItems.cryptos.length > 0;

    return (
        <div className="page-container profile-screen-wrapper">
            <header className="page-header">
                <h1>Meu Perfil</h1>
                <a href="/" className="btn-secondary">Voltar ao Início</a>
            </header>

            <div className={`profile-split-container ${selectedAsset ? 'split-active' : ''}`}>
                {/* ── Left panel ── */}
                <div className="profile-left-panel">
                    <main className="profile-content glass-panel" style={{ margin: 0 }}>

                        {/* User info */}
                        <div className="profile-header-card">
                            <div className="profile-info">
                                <div className="avatar-placeholder">
                                    {user.nome ? user.nome.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="details">
                                    <h2>{user.nome}</h2>
                                    <p className="email">{user.email}</p>
                                    <p className="member-since">Telefone: {user.telefone}</p>
                                </div>
                            </div>

                            <div className="profile-top-actions">
                                <button className="icon-btn"
                                    onClick={() => alert('Editar não implementado')}
                                    title="Editar Perfil">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="icon-btn logout" onClick={handleLogout} title="Sair da Conta">
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </button>
                            </div>
                        </div>

                        {/* Filter buttons */}
                        <div className="filter-container">
                            {FILTERS.map(filter => (
                                <button
                                    key={filter}
                                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Asset list */}
                        {loadingMarket ? (
                            <p style={{ textAlign: 'center', paddingTop: '20px', color: 'var(--text-secondary)' }}>
                                Carregando cotações...
                            </p>
                        ) : !hasItems ? (
                            <p style={{ textAlign: 'center', paddingTop: '20px', color: 'var(--text-secondary)' }}>
                                {activeFilter === 'Favoritos'
                                    ? 'Você ainda não tem favoritos.'
                                    : 'Nenhum ativo encontrado.'}
                            </p>
                        ) : (
                            <div className="favorites-section">
                                {/* Stocks */}
                                {visibleItems.stocks.length > 0 && (
                                    <>
                                        {activeFilter === 'Todos' && (
                                            <h3 className="asset-section-title">Ações</h3>
                                        )}
                                        <div className={`asset-grid ${selectedAsset ? 'is-compact' : ''}`}>
                                            {visibleItems.stocks.map(item => (
                                                <MiniMarketCard
                                                    key={item.symbol}
                                                    symbol={item.symbol}
                                                    price={item.price}
                                                    change={item.change}
                                                    logo={item.logo}
                                                    onFavoriteClick={handleFavoriteClick}
                                                    onClick={handleStockSelect}
                                                    compact={!!selectedAsset}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Cryptos */}
                                {visibleItems.cryptos.length > 0 && (
                                    <>
                                        {activeFilter === 'Todos' && (
                                            <h3 className="asset-section-title">Criptomoedas</h3>
                                        )}
                                        <div className={`asset-grid ${selectedAsset ? 'is-compact' : ''}`}>
                                            {visibleItems.cryptos.map(coin => (
                                                <CryptoCard
                                                    key={coin.symbol}
                                                    coin={coin}
                                                    isFavorited={favoriteSymbols.has(coin.symbol)}
                                                    onFavoriteClick={handleFavoriteClick}
                                                    onClick={handleCryptoSelect}
                                                    compact={!!selectedAsset}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </main>
                </div>

                {/* ── Right panel (split detail view) ── */}
                <div className="profile-right-panel chart-drawer">
                    {selectedAsset && selectedAssetData && (
                        <div className="chart-drawer-content" style={{ height: '100%' }}>
                            {selectedAssetType === 'stock' ? (
                                <MarketCard
                                    symbol={selectedAssetData.symbol}
                                    price={selectedAssetData.price}
                                    change={selectedAssetData.change}
                                    logo={selectedAssetData.logo}
                                    history={selectedAssetData.history ?? []}
                                    isFavorited={favoriteSymbols.has(selectedAssetData.symbol)}
                                    onCardClick={() => {}}
                                    onFavoriteClick={(e, sym) => handleFavoriteClick(sym)}
                                    onClose={handleCloseSplit}
                                    fullPanel={true}
                                />
                            ) : (
                                <div className="crypto-detail-panel glass-panel" style={{ height: '100%', padding: '24px', position: 'relative' }}>
                                    <button
                                        onClick={handleCloseSplit}
                                        style={{ position: 'absolute', top: 15, right: 15, padding: '5px 12px', fontSize: '1.2rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', zIndex: 10 }}
                                    >✕</button>
                                    <CryptoCard
                                        coin={selectedAssetData}
                                        isFavorited={favoriteSymbols.has(selectedAssetData.symbol)}
                                        onFavoriteClick={handleFavoriteClick}
                                        compact={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
