/**
 * Verify Email Page
 * Handles email verification links from Supabase
 * Matches luxury Quebec heritage design
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LoadingScreen } from '@/components/LoadingScreen';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { token: routeToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      // 1. Get token from route param OR query param (hash or code)
      // Supabase often sends `token_hash` and `type=email` in query params
      const tokenHash = routeToken || searchParams.get('token_hash');
      const type = searchParams.get('type') as 'signup' | 'recovery' | 'magiclink' | 'email_change' | null;
      const code = searchParams.get('code'); // PKCE flow

      // If we have a code (PKCE), we exchange it for a session
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setStatus('success');
          return;
        } catch (err: any) {
          console.error('Email verification error (code exchange):', err);
          setStatus('error');
          setErrorMessage(err.message || 'Le lien de vérification est invalide ou expiré.');
          return;
        }
      }

      // If we have a token_hash, we verify it
      if (tokenHash && type) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          if (error) throw error;
          setStatus('success');
        } catch (err: any) {
          console.error('Email verification error (token hash):', err);
          setStatus('error');
          setErrorMessage(err.message || 'Le lien de vérification est invalide ou expiré.');
        }
        return;
      }

      // If simple token route without type, assume generic verification (might fail if specific type needed)
      // This is a fallback for the specific /verify-email/:token usage if manual handling was intended
      if (routeToken) {
         // Attempt verify with signup type default? Or warn?
         // Without 'type', verifyOtp might not work for token_hash. 
         // But let's try assuming it's a signup verification if explicit token passed.
         try {
             const { error } = await supabase.auth.verifyOtp({
                 token_hash: routeToken,
                 type: 'signup' 
             });
             if (error) throw error;
             setStatus('success');
         } catch (err: any) {
             // Fallback to recovery?
              try {
                 const { error } = await supabase.auth.verifyOtp({
                     token_hash: routeToken,
                     type: 'recovery' 
                 });
                 if (error) throw error;
                 setStatus('success');
             } catch (finalErr: any) {
                 setStatus('error');
                 setErrorMessage('Lien invalide.');
             }
         }
         return;
      }

      // No token found
      setStatus('error');
      setErrorMessage("Lien de vérification manquant.");
    };

    verifyToken();
  }, [routeToken, searchParams]);

  const handleContinue = () => {
      navigate('/feed');
  };

  const handleBackToLogin = () => {
      navigate('/login');
  };

  if (status === 'verifying') {
      return <LoadingScreen message="Vérification de l'adresse courriel..." />;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1510 50%, #0d0b09 100%)',
      }}
    >
      {/* Leather Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 
            className="text-5xl font-black tracking-wide"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              background: 'linear-gradient(180deg, #FFF8DC 0%, #FFE55C 15%, #FFD700 30%, #DAA520 60%, #B8860B 85%, #8B6914 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6)) drop-shadow(0 3px 6px rgba(0,0,0,0.9))',
            }}
          >
            Zyeuté
          </h1>
        </div>

        <div 
          className="rounded-3xl p-8"
          style={{
            background: `linear-gradient(145deg, #3a2a22 0%, #251a15 50%, #1a1210 100%)`,
            border: '1px solid rgba(139, 90, 43, 0.4)',
            boxShadow: `0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255,191,0,0.1)`,
            textAlign: 'center'
          }}
        >
          {status === 'success' ? (
            <>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#10b981' }}>
                Courriel vérifié
              </h2>
              <p className="mb-8" style={{ color: '#E8DCC4' }}>
                Merci! Ton adresse courriel a été confirmée avec succès. Tu as maintenant accès à toutes les fonctionnalités.
              </p>
              <button
                onClick={handleContinue}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
                }}
              >
                Continuer vers l'application
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>❌</div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#ef4444' }}>
                Échec de la vérification
              </h2>
              <p className="mb-8" style={{ color: '#E8DCC4' }}>
                {errorMessage}
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#B8A88A',
                  border: '1px solid rgba(184,168,138,0.2)'
                }}
              >
                Retour à la connexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
