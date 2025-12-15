/**
 * Landing Page - Public-facing home page
 * Displays Hero section with optimized CTAs for unauthenticated visitors
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/Hero';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  // Check if already logged in, redirect to feed
  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            navigate('/', { replace: true });
          }
        }
      } catch (err) {
        // Not logged in, stay on landing page
      }
    };
    checkUser();
  }, [navigate]);

  return <Hero />;
};

export default Landing;
