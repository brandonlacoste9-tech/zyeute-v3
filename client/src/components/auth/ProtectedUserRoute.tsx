import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

export const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Chargement de Zyeuté..." />;
  }

  // Strictly check for a real user object AND that they are not a guest
  // Note: Depending on AuthContext implementation, 'user' might be null for guests,
  // or it might be a guest user object. Checking !isGuest covers both cases safely.
  const isRealUser = !!user && !isGuest;

  return isRealUser ? <>{children}</> : <Navigate to="/login" replace />;
};
