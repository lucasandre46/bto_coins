import React, { useEffect, useState } from 'react';
import { fetchMarketData, AVAILABLE_SYMBOLS } from './fetch';
import { useNavigate } from 'react-router-dom';
import MarketCard from './MarketCard';
import '../../index.css';
import './market.css';

export default function Market() {
    const [currentItem, setCurrentItem] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('@btocoins:token');

    useEffect(() => {
        let isMounted = true;

        const loadCard = async () => {
            setLoading(true);
            const symbol = AVAILABLE_SYMBOLS[currentIndex];

            // Busca os dados (que agora incluem o 'history' do seu novo Service)
            const items = await fetchMarketData([symbol]);

            if (isMounted) {
                if (items && items.length > 0) {
                    setCurrentItem(items[0]);
                } else {
                    // Fallback de segurança
                    setCurrentItem({
                        symbol: symbol,
                        price: 0,
                        change: 0,
                        logo: '',
                        history: []
                    });
                }
                setLoading(false);
            }
        };

        loadCard();

        return () => {
            isMounted = false;
        };
    }, [currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % AVAILABLE_SYMBOLS.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + AVAILABLE_SYMBOLS.length) % AVAILABLE_SYMBOLS.length);
    };

    const handleFavorite = (e, symbol) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            alert("Você precisa estar logado para favoritar!");
            return;
        }
        alert(`Ativo ${symbol} favoritado!`);
    };

    const handleCardClick = (symbol) => {
        if (!isAuthenticated) {
            alert("Você precisa estar logado para abrir o perfil!");
            return;
        }
        navigate(`/profile/${symbol}`);
    };

    return (
        <div className="market-screen">
            {/* Título "Mercado" removido daqui */}

            <main className="market-single-area">
                <button className="nav-arrow left-arrow" onClick={handlePrev} disabled={loading}>
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <div className="card-container">
                    {loading ? (
                        <div className="loading-indicator large">Buscando dados em tempo real...</div>
                    ) : (
                        currentItem && (
                            <MarketCard
                                symbol={currentItem.symbol}
                                price={currentItem.price}
                                change={currentItem.change}
                                logo={currentItem.logo}
                                history={currentItem.history}
                                onCardClick={handleCardClick}
                                onFavoriteClick={handleFavorite}
                            />
                        )
                    )}
                </div>

                <button className="nav-arrow right-arrow" onClick={handleNext} disabled={loading}>
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </main>
        </div>
    );
}