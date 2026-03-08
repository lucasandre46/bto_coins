import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from './fetch';
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
                navigate('/profile'); // Redirecionar para o perfil ou home
            } else {
                // Modo Cadastro
                if (!formData.nome || !formData.telefone) {
                    setErrorMsg('Por favor, preencha todos os campos do cadastro.');
                    setLoading(false);
                    return;
                }

                // Remover formatação (deixar apenas números) para o DTO (max 11 chars)
                const telefoneLimpo = formData.telefone.replace(/\D/g, "");

                const result = await registerUser(formData.nome, formData.email, formData.senha, telefoneLimpo);
                console.log("Cadastro:", result);
                if (result.token) {
                    localStorage.setItem('@btocoins:token', result.token);
                }
                alert('Conta criada com sucesso!');
                navigate('/profile'); // Auto-login after register
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

                    <button type="button" className="btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '0' }}>
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
