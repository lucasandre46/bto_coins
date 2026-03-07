import React, { useEffect, useState } from 'react';
import { fetchHomeData } from './fetch';
import { getGreeting } from './functions';
import '../../index.css';
import './home.css';

export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchHomeData().then(res => setData(res.data));
    }, []);

    return (
        <div className="page-container home-screen">
            <header className="home-header">
                <h1>{getGreeting()}, bem-vindo à B.T.O</h1>
                <p>Acompanhe o mercado de Ações e Criptomoedas em tempo real.</p>
            </header>
            <main className="home-content glass-panel">
                <h2>Visão Geral</h2>
                <p>{data ? data : 'Carregando dados...'}</p>
                <div className="home-actions">
                    <a href="/market" className="btn-primary">Acessar Mercado</a>
                </div>
            </main>
        </div>
    );
}
