/**
 * OAuth Callback Handler
 * Handles the OAuth redirect from providers like Google
 * 
 * Simplified to rely on global AuthContext state to prevent race conditions.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '../lib/logger';

const authCallbackLogger = logger.withContext('AuthCallback');

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, isLoading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Handle explicit errors in URL
        const urlError = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        if (urlError) {
            authCallbackLogger.error('OAuth Error:', urlError, errorDescription);
            setError(errorDescription || urlError);
            // Delay redirect so user sees error? Or immediate?
            // Usually immediate redirect to login with error is better.
            navigate(`/login?error=${encodeURIComponent(urlError)}`, { replace: true });
            return;
        }

        // 2. Handle Code Exchange (for server-side flow, though typically PKCE is handled by client lib)
        const code = searchParams.get('code');
        if (code) {
            const exchangeCode = async () => {
                try {
                    authCallbackLogger.debug('Exchanging code for session...');
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                    // Success! AuthContext listener will pick this up and set isAuthenticated = true.
                } catch (err: any) {
                    authCallbackLogger.error('Code exchange failed:', err);
                    navigate(`/login?error=${encodeURIComponent(err.message)}`, { replace: true });
                }
            };
            exchangeCode();
        }
        
        // 3. Hash fragment is handled automatically by supabase-js client on initialization.
    }, [searchParams, navigate]);

    useEffect(() => {
        // 4. Watch for successful authentication
        if (!isLoading && isAuthenticated) {
           authCallbackLogger.debug('✅ Valid session detected, redirecting to home.');
           navigate('/', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (error) {
        return <LoadingScreen message={`Erreur: ${error}`} />;
    }

    return <LoadingScreen message="Connexion en cours..." />;
};

export default AuthCallback;
