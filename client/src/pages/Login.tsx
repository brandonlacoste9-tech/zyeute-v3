/**
 * Zyeuté Login - Luxury Leather Design with Gold Accents
 * Quebec Fleur-de-lis heritage styling
 * Features: Heavy gold stitching, leather texture, watch strap middle band,
 * 12 animated gold sparkles, biometric auth, Google OAuth
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { logger } from '../lib/logger';
import { GUEST_MODE_KEY, GUEST_TIMESTAMP_KEY, GUEST_VIEWS_KEY } from '../lib/constants';
import '../styles/Login.css';

const loginLogger = logger.withContext('Login');

const FleurDeLis = () => (
  <svg viewBox="0 0 100 100" className="fleur-de-lis">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#b8860b" />
      </linearGradient>
    </defs>
    <path 
      d="M50 10 C30 30, 20 50, 20 70 L30 70 C30 60, 35 50, 50 50 C65 50, 70 60, 70 70 L80 70 C80 50, 70 30, 50 10 Z" 
      fill="url(#goldGradient)" 
    />
    <circle cx="50" cy="85" r="8" fill="url(#goldGradient)" />
  </svg>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    loginLogger.info('Login attempt', { email });

    try {
      await signIn(email, password);
      loginLogger.info('Login successful');
      navigate('/feed');
    } catch (err: any) {
      loginLogger.error('Login failed', err);
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    loginLogger.info('Google login attempt');

    try {
      await signInWithGoogle();
      loginLogger.info('Google login successful');
      navigate('/feed');
    } catch (err: any) {
      loginLogger.error('Google login failed', err);
      setError(err.message || 'Erreur de connexion Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginLogger.info('Guest mode activated');
    localStorage.setItem(GUEST_MODE_KEY, 'true');
    localStorage.setItem(GUEST_TIMESTAMP_KEY, Date.now().toString());
    localStorage.setItem(GUEST_VIEWS_KEY, '0');
    navigate('/feed');
  };

  const handleBiometric = () => {
    loginLogger.info('Biometric authentication triggered');
    alert('Authentification biométrique - À venir!');
  };

  return (
    <div className="login-container">
      {/* Gold sparkles */}
      <div className="sparkles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`sparkle sparkle-${i + 1}`} />
        ))}
      </div>

      <FleurDeLis />
      <h1 className="login-title">Zyeuté</h1>
      <p className="login-subtitle">L'APP SOCIALE DU QUÉBEC</p>

      <div className="login-card">
        <h2 className="card-title">Connecte-toi</h2>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          
          <div className="password-wrapper">
            <input
              type="password"
              placeholder="Mot de passe"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Link to="/forgot-password" className="forgot-password">
              Mot de passe oublié?
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Entrer'}
          </button>
        </form>

        <div className="or-divider">Ou</div>

        <div className="social-buttons">
          <button 
            type="button" 
            className="guest-button"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            Continuer en tant qu'invité
          </button>
          
          <button 
            type="button" 
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Continuer avec Google
          </button>
        </div>

        <p className="signup-text">
          Pas encore icitte?<br />
          <Link to="/register">
            <strong>Embarque!</strong>
          </Link>
        </p>
      </div>

      <button 
        type="button" 
        className="biometric-button"
        onClick={handleBiometric}
        disabled={isLoading}
      >
        <svg viewBox="0 0 24 24" className="fingerprint-icon">
          <path d="M12 2a10 10 0 00-10 10c0 2.5 1 4.7 2.6 6.3l1.4-1.4C4.8 15.8 4 13.9 4 12a8 8 0 1116 0c0 1.9-0.8 3.8-2 5l1.4 1.4C21 16.7 22 14.5 22 12a10 10 0 00-10-10z" />
          <path d="M12 6a6 6 0 00-6 6c0 1.4.5 2.7 1.3 3.7l1.4-1.4C8.3 13.6 8 12.8 8 12a4 4 0 118 0c0 .8-.3 1.6-.7 2.3l1.4 1.4C17.5 14.7 18 13.4 18 12a6 6 0 00-6-6z" />
          <path d="M12 10a2 2 0 00-2 2c0 .5.2.9.5 1.2l1.4-1.4c-.1-.1-.2-.3-.2-.5a1 1 0 112 0c0 .2-.1.4-.2.5l1.4 1.4c.3-.3.5-.7.5-1.2a2 2 0 00-2-2z" />
        </svg>
      </button>
    </div>
  );
};

export default Login;
