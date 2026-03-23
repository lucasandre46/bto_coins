import React from 'react';
import '../../index.css';
import './home.css';

export default function Home() {

    return (
        <div className="home-screen">
            <div className="floating-icons">
                <span className="finance-icon icon-1">💰</span>
                <span className="finance-icon icon-2">📈</span>
                <span className="finance-icon icon-3">₿</span>
                <span className="finance-icon icon-4">🏦</span>
                <span className="finance-icon icon-5">💵</span>
                <span className="finance-icon icon-6">📊</span>
            </div>
            
            <header className="home-header">
                <h1>Bem-vindo à B.T.O</h1>
                <p>Controle seu patrimônio com precisão cirúrgica. Dados em tempo real, segurança de ponta e a agilidade que o mercado exige</p>
            </header>
            
            <main className="home-content">
                <div className="home-actions">
                    <a href="/auth" className="btn-primary" style={{ padding: '15px 50px', fontSize: '1.2rem', marginBottom: '8px' }}>Entrar</a>
                    <div style={{ marginTop: '15px' }}>
                        <a href="/auth?register=true" className="auth-link">Cadastrar</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
