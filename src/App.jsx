import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import "./index.css";

import { supabase } from "./lib/supabase";

function Navigation({ isAuthenticated, onLogout }) {
  const location = useLocation();

  return (
    <nav
      style={{
        padding: "20px",
        textAlign: "center",
        background: "rgba(0,0,0,0.2)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Link
        to="/market"
        style={{
          margin: "0 15px",
          color: "#fff",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Mercado
      </Link>

      {isAuthenticated && (
        <Link
          to="/profile"
          style={{
            margin: "0 15px",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Perfil
        </Link>
      )}

      {isAuthenticated ? (
        <button
          onClick={onLogout}
          style={{
            background: "transparent",
            border: "none",
            margin: "0 15px",
            color: "#f87171",
            textDecoration: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      ) : (
        <Link
          to="/auth"
          style={{
            margin: "0 15px",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            border: "1px solid #00d2ff",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          Entrar
        </Link>
      )}
    </nav>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("@btocoins:token"),
  );

  useEffect(() => {
    // Escuta mudanças na autenticação do Supabase (Login Google, etc)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event, !!session);

      if (session) {
        localStorage.setItem("@btocoins:token", session.access_token);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("@btocoins:token");
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("@btocoins:token");
    setIsAuthenticated(false);
    window.location.href = "/auth";
  };

  return (
    <Router>
      <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />
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
