/**
 * Home Page - Smart routing based on authentication
 * Shows Landing page for unauthenticated users
 * Shows Feed for authenticated users
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { Landing } from '@/pages/Landing';
import { LoadingScreen } from '@/components/LoadingScreen';
import { GUEST_MODE_KEY, GUEST_TIMESTAMP_KEY, GUEST_SESSION_DURATION } from '@/lib/constants';

export const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for authenticated user
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthenticated(true);
            return;
          }
        }
        
        // Check for guest mode
        const guestMode = localStorage.getItem(GUEST_MODE_KEY);
        const guestTimestamp = localStorage.getItem(GUEST_TIMESTAMP_KEY);
        
        if (guestMode === 'true' && guestTimestamp) {
          const age = Date.now() - parseInt(guestTimestamp, 10);
          
          if (age < GUEST_SESSION_DURATION) {
            // Valid guest session - redirect to feed
            setIsAuthenticated(true);
            return;
          }
        }
        
        // No valid auth or guest session - show landing
        setIsAuthenticated(false);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingScreen message="Chargement de Zyeuté..." />;
  }

  // Authenticated users go to feed
  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  // Unauthenticated users see landing page
  return <Landing />;
};

export default Home;
