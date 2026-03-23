import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Market from './pages/Market';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import './index.css';

function Navigation() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('@btocoins:token');

  const handleLogout = () => {
    localStorage.removeItem('@btocoins:token');
    window.location.href = '/auth'; // force reload to update state
  };

  return (
    <nav style={{ padding: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Link to="/market" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Mercado</Link>

      {isAuthenticated && (
        <Link to="/profile" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Perfil</Link>
      )}

      {isAuthenticated ? (
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', margin: '0 15px', color: '#f87171', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Sair</button>
      ) : (
        <Link to="/auth" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #00d2ff', padding: '5px 10px', borderRadius: '5px' }}>Entrar</Link>
      )}
    </nav>
  );
}

function App() {
  return (
    <Router>
      {/* Navegação global removida a pedido */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
