import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Market from './pages/Market';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <Router>
      <nav style={{ padding: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <a href="/" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Início</a>
        <a href="/market" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Mercado</a>
        <a href="/profile" style={{ margin: '0 15px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Perfil</a>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
