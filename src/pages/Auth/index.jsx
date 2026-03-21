import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, signInWithGoogle } from './fetch';
import { validateEmail, validatePassword, formatPhoneNumber } from './functions';
import '../../index.css';
import './auth.css';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === 'telefone') {
            formattedValue = formatPhoneNumber(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrorMsg('');
        setFormData({ nome: '', email: '', senha: '', telefone: '' });
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            // O Supabase redirecionará para a URL configurada
        } catch (error) {
            setErrorMsg(error.message || 'Erro ao conectar com Google.');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!validateEmail(formData.email)) {
            setErrorMsg('E-mail inválido!');
            return;
        }

        if (!validatePassword(formData.senha)) {
            setErrorMsg('A senha deve conter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                // Modo Login
                const result = await loginUser(formData.email, formData.senha);
                console.log("Login:", result);
                if (result.token) {
                    localStorage.setItem('@btocoins:token', result.token);
                }
                alert('Bem-vindo de volta!');
                navigate('/profile'); 
            } else {
                // Modo Cadastro
                if (!formData.nome || !formData.telefone) {
                    setErrorMsg('Por favor, preencha todos os campos do cadastro.');
                    setLoading(false);
                    return;
                }

                const telefoneLimpo = formData.telefone.replace(/\D/g, "");

                const result = await registerUser(formData.nome, formData.email, formData.senha, telefoneLimpo);
                console.log("Cadastro:", result);
                if (result.token) {
                    localStorage.setItem('@btocoins:token', result.token);
                }
                alert('Conta criada com sucesso!');
                navigate('/profile'); 
            }
        } catch (error) {
            setErrorMsg(error.message || 'Ocorreu um erro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container auth-screen">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
                    <p>{isLogin ? 'Faça login para continuar' : 'Preencha os dados abaixo'}</p>
                </div>

                {errorMsg && <div className="error-message">{errorMsg}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input
                                type="text"
                                name="nome"
                                placeholder="Seu nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Número de Telefone</label>
                            <input
                                type="text"
                                name="telefone"
                                placeholder="(11) 99999-9999"
                                value={formData.telefone}
                                onChange={handleChange}
                                required={!isLogin}
                                maxLength={15}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            name="senha"
                            placeholder="******"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>

                    <div className="social-divider">
                        <span>ou</span>
                    </div>

                    <button 
                        type="button" 
                        className="btn-google" 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {isLogin ? 'Entrar com Google' : 'Cadastrar com Google'}
                    </button>

                    <button type="button" className="btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                        Voltar para Início
                    </button>
                </form>

                <div className="auth-footer">
                    {isLogin ? (
                        <p>Ainda não tem uma conta? <span onClick={toggleMode}>Cadastre-se</span></p>
                    ) : (
                        <p>Já possui uma conta? <span onClick={toggleMode}>Faça login</span></p>
                    )}
                </div>
            </div>
        </div>
    );
}
