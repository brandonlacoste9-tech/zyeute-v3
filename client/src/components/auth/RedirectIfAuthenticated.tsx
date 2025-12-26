import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

/**
 * RedirectIfAuthenticated
 * 
 * Prevents already authenticated "real" users (non-guests) from accessing 
 * authentication pages like Login or Signup.
 * 
 * Behavior:
 * - If User is Logged In AND Not Guest -> Redirect to /feed (or intended destination)
 * - If User is Guest -> Allow access (they need to upgrade/login)
 * - If No User -> Allow access
 */
export const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ children }) => {
  const { user, isGuest, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Vérification..." />;
  }

  // Strict check: Only redirect REAL users. Guests should still see login/signup.
  if (user && !isGuest) {
    // Check if there was a previous location they were trying to access
    const from = (location.state as any)?.from?.pathname || '/feed';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
