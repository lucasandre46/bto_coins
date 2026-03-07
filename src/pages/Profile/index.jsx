import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from './fetch';
import { formatDate, handleLogout } from './functions';
import '../../index.css';
import './profile.css';

export default function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserProfile().then(data => setUser(data));
    }, []);

    if (!user) return <div className="page-container"><p>Carregando perfil...</p></div>;

    return (
        <div className="page-container profile-screen">
            <header className="page-header">
                <h1>Meu Perfil</h1>
                <a href="/" className="btn-secondary">Voltar ao Início</a>
            </header>

            <main className="profile-content glass-panel">
                <div className="profile-info">
                    <div className="avatar-placeholder">
                        {user.name.charAt(0)}
                    </div>
                    <div className="details">
                        <h2>{user.name}</h2>
                        <p className="email">{user.email}</p>
                        <p className="member-since">Membro desde: {formatDate(user.memberSince)}</p>
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
            </main>
        </div>
    );
}
