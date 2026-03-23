import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from './fetch';
import { handleLogout } from './functions';
import { useNavigate } from 'react-router-dom';
import { fetchMarketData } from '../Market/fetch';
import MiniMarketCard from './MiniMarketCard';
import '../../index.css';
import './profile.css';
import './MiniMarketCard.css';
import MarketCard from '../Market/MarketCard';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [favoritesData, setFavoritesData] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [error, setError] = useState(null);
    
    // Split View States
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedAssetData, setSelectedAssetData] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile()
            .then(data => {
                setUser(data);
                if (data.favoritos && data.favoritos.length > 0) {
                    loadFavoritesData(data.favoritos);
                }
            })
            .catch(() => {
                setError("Erro ao carregar perfil. Faça login novamente.");
                localStorage.removeItem('@btocoins:token');
                setTimeout(() => navigate('/auth'), 2000);
            });
    }, [navigate]);

    const loadFavoritesData = async (symbols) => {
        setLoadingFavorites(true);
        try {
            const data = await fetchMarketData(symbols);
            setFavoritesData(data);
        } catch (error) {
            console.error("Erro ao carregar dados dos favoritos:", error);
        } finally {
            setLoadingFavorites(false);
        }
    };

    const handleFavoriteClick = async (symbol) => {
        try {
            // Reutiliza a função do market para desfavoritar
            const { toggleFavorite } = await import('../Market/fetch');
            await toggleFavorite(symbol);

            // Atualiza o estado local para remover o card na hora
            setFavoritesData(prev => prev.filter(item => item.symbol !== symbol));
            setUser(prev => ({
                ...prev,
                favoritos: prev.favoritos.filter(s => s !== symbol)
            }));
        } catch (error) {
            alert("Erro ao remover favorito: " + error.message);
        }
    };

    const handleAssetSelect = (symbol) => {
        const asset = favoritesData.find(f => f.symbol === symbol);
        setSelectedAsset(symbol);
        setSelectedAssetData(asset);
    };

    const handleCloseSplit = () => {
        setSelectedAsset(null);
        setSelectedAssetData(null);
    };

    if (error) return <div className="page-container"><p style={{ color: 'red' }}>{error}</p></div>;
    if (!user) return <div className="page-container"><p>Carregando perfil...</p></div>;

    return (
        <div className="page-container profile-screen-wrapper">
            <header className="page-header">
                <h1>Meu Perfil</h1>
                <a href="/" className="btn-secondary">Voltar ao Início</a>
            </header>

            <div className={`profile-split-container ${selectedAsset ? 'split-active' : ''}`}>
                <div className="profile-left-panel">
                    <main className="profile-content glass-panel" style={{ margin: 0 }}>
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

                        <div className="profile-actions">
                            <button className="btn-primary" onClick={() => alert("Editar não implementado na base")}>
                                Editar Perfil
                            </button>
                            <button className="btn-danger" onClick={handleLogout}>
                                Sair da Conta
                            </button>
                        </div>

                        {user.favoritos && user.favoritos.length > 0 && (
                            <div className="favorites-section">
                                <h3>Meus Ativos Favoritos</h3>
                                {loadingFavorites ? (
                                    <p>Carregando cotações...</p>
                                ) : (
                                    <div className="favorites-list">
                                        {favoritesData.map((favItem) => (
                                            <MiniMarketCard
                                                key={favItem.symbol}
                                                symbol={favItem.symbol}
                                                price={favItem.price}
                                                change={favItem.change}
                                                logo={favItem.logo}
                                                onFavoriteClick={handleFavoriteClick}
                                                onClick={handleAssetSelect}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>

                <div className="profile-right-panel chart-drawer">
                    {selectedAsset && selectedAssetData && (
                        <div className="chart-drawer-content" style={{ height: '100%' }}>
                            <MarketCard
                                symbol={selectedAssetData.symbol}
                                price={selectedAssetData.price}
                                change={selectedAssetData.change}
                                logo={selectedAssetData.logo}
                                history={selectedAssetData.history}
                                isFavorited={true}
                                onCardClick={() => {}} 
                                onFavoriteClick={handleFavoriteClick}
                                onClose={handleCloseSplit}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
