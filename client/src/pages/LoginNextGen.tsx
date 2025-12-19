import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

type AuthMethod = 'biometric' | 'magic-link' | 'password' | null;

export default function LoginNextGen() {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleBiometric = async () => {
    setLoading(true);
    setError('');
    try {
      const optionsRes = await fetch('/api/auth/webauthn/authenticate/options');
      const { options } = await optionsRes.json();
      const credential = await navigator.credentials.get({ publicKey: options } as any);
      if (!credential) throw new Error('Biometric authentication cancelled');
      
      const verifyRes = await fetch('/api/auth/webauthn/authenticate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const result = await verifyRes.json();
      
      if (result.success) {
        localStorage.setItem('auth_token', result.sessionToken);
        localStorage.setItem('user_id', result.userId);
        localStorage.setItem('auth_method', 'biometric');
        navigate('/feed');
      } else throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/magic-link/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(`Magic link sent to ${email}!`);
        setAuthMethod(null);
        setEmail('');
      } else throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('auth_token', result.sessionToken);
        localStorage.setItem('user_id', result.userId);
        localStorage.setItem('auth_method', 'password');
        navigate('/feed');
      } else throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    const guestId = `guest_${Date.now()}`;
    localStorage.setItem('guest_mode', 'true');
    localStorage.setItem('user_id', guestId);
    localStorage.setItem('auth_method', 'guest');
    navigate('/feed');
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8 border-2" style={{
          borderColor: '#d4af37',
          background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.3), 0 0 60px rgba(212,175,55,0.15)'
        }}>
          
          <div className="text-center mb-8">
            <div className="text-6xl mb-3" style={{ textShadow: '0 0 20px rgba(212,175,55,0.5)' }}>⚜️</div>
            <h1 className="text-4xl font-bold tracking-wider" style={{ color: '#d4af37', textShadow: '0 0 10px rgba(212,175,55,0.5)' }}>
              ZYEUTE
            </h1>
            <p className="text-xs mt-2 tracking-widest" style={{ color: '#b8860b' }}>
              L'APP SOCIALE DU QUEBEC
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.1)', borderLeft: '4px solid #dc2626' }}>
              <p className="text-red-400 text-sm">⚠️ {error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(34,197,94,0.1)', borderLeft: '4px solid #22c55e' }}>
              <p className="text-green-400 text-sm">✅ {success}</p>
            </div>
          )}

          {!authMethod ? (
            <div className="space-y-4">
              <h2 className="text-center text-xl font-bold mb-6" style={{ color: '#d4af37' }}>
                Connecte-toi
              </h2>

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-stone-900 border-2 border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <button
                onClick={() => setAuthMethod('magic-link')}
                className="w-full text-left flex items-center gap-2 px-2 py-2 rounded hover:bg-opacity-10 transition"
                style={{ color: '#d4af37' }}
              >
                👁️ Mot de passe oublie?
              </button>

              <button
                onClick={() => setAuthMethod('password')}
                className="w-full mt-4 py-4 px-4 rounded-lg font-bold text-lg tracking-wider uppercase transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
                  color: '#1a1a1a',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.4), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(212,175,55,0.3)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 25px rgba(212,175,55,0.6), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 30px rgba(212,175,55,0.5)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 15px rgba(212,175,55,0.4), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(212,175,55,0.3)')}
                disabled={loading || !email}
              >
                {loading ? '⏳ Loading...' : '✨ Enter ✨'}
              </button>

              <div className="relative my-4" style={{ borderTop: '1px solid #404040' }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-stone-900 text-xs" style={{ color: '#808080' }}>ou</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGuest}
                  disabled={loading}
                  className="py-3 px-3 rounded-lg font-bold text-sm border-2 transition-all"
                  style={{
                    color: '#1a1a1a',
                    borderColor: '#d4af37',
                    background: '#d4af37'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f4d03f')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#d4af37')}
                >
                  👤 Continuer en\ntant qu'Invite
                </button>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="py-3 px-3 rounded-lg font-bold text-sm border-2 transition-all"
                  style={{
                    color: '#1a1a1a',
                    borderColor: '#d4af37',
                    background: '#d4af37'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f4d03f')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#d4af37')}
                >
                  Continuer avec\nGoogle
                </button>
              </div>

              <div className="text-center mt-6 text-sm" style={{ color: '#d4af37' }}>
                <p>Pas encore icitte? <Link to="/signup" className="font-bold hover:underline">Embarque!</Link></p>
              </div>
            </div>
          ) : null}

          {authMethod === 'password' && (
            <form onSubmit={handlePassword} className="space-y-4">
              <h2 className="text-center text-lg font-bold mb-4" style={{ color: '#d4af37' }}>Se connecter</h2>
              <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-stone-900 border-2 border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-yellow-600" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Mot de passe" className="w-full px-4 py-3 rounded-lg bg-stone-900 border-2 border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-yellow-600 pr-12" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">{showPassword ? '😨' : '👁️'}</button>
              </div>
              <button type="submit" className="w-full mt-4 py-4 px-4 rounded-lg font-bold text-lg tracking-wider uppercase" style={{background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)', color: '#1a1a1a', boxShadow: '0 4px 15px rgba(212,175,55,0.4)'}} disabled={loading || !email || !password}>{loading ? '⏳ Connexion...' : '✨ Enter ✨'}</button>
              <button type="button" onClick={() => setAuthMethod(null)} className="w-full py-2 text-center" style={{ color: '#808080' }}>Retour</button>
            </form>
          )}

          {authMethod === 'magic-link' && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <h2 className="text-center text-lg font-bold mb-2" style={{ color: '#d4af37' }}>📧 Lien magique</h2>
              <p className="text-center text-sm mb-4" style={{ color: '#b8860b' }}>Entrez votre email pour recevoir un lien de connexion</p>
              <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-stone-900 border-2 border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-yellow-600" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
              <button type="submit" className="w-full mt-4 py-4 px-4 rounded-lg font-bold text-lg tracking-wider uppercase" style={{background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)', color: '#1a1a1a', boxShadow: '0 4px 15px rgba(212,175,55,0.4)'}} disabled={loading || !email}>{loading ? '⏳ Envoi...' : '✨ Envoyer ✨'}</button>
              <button type="button" onClick={() => setAuthMethod(null)} className="w-full py-2 text-center" style={{ color: '#808080' }}>Retour</button>
            </form>
          )}
        </div>

        <div className="text-center mt-6 text-xs" style={{ color: '#808080' }}>
          <p>🍂 Bienvenue a Zyeute</p>
        </div>
      </div>
    </div>
  );
}
