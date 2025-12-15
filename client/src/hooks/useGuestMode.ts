/**
 * useGuestMode Hook
 * Manages 24-hour guest session & view counting
 */
import { useState, useEffect, useCallback } from 'react';
import { logger } from '../lib/logger';
import { GUEST_SESSION_DURATION, GUEST_MODE_KEY, GUEST_TIMESTAMP_KEY, GUEST_VIEWS_KEY } from '../lib/constants';

interface GuestModeState {
  isGuest: boolean;
  isExpired: boolean;
  remainingTime: number;
  viewsCount: number;
}

export function useGuestMode() {
  const [state, setState] = useState<GuestModeState>({
    isGuest: false,
    isExpired: false,
    remainingTime: 0,
    viewsCount: 0,
  });

  useEffect(() => {
    const checkSession = () => {
      const guestMode = localStorage.getItem(GUEST_MODE_KEY);
      const timestamp = localStorage.getItem(GUEST_TIMESTAMP_KEY);
      
      if (guestMode === 'true' && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age >= GUEST_SESSION_DURATION) {
          // Session expired - clear localStorage
          localStorage.removeItem(GUEST_MODE_KEY);
          localStorage.removeItem(GUEST_TIMESTAMP_KEY);
          localStorage.removeItem(GUEST_VIEWS_KEY);
          setState({ isGuest: false, isExpired: true, remainingTime: 0, viewsCount: 0 });
          logger.info('🎭 Guest session expired');
        } else {
          const remaining = GUEST_SESSION_DURATION - age;
          const views = parseInt(localStorage.getItem(GUEST_VIEWS_KEY) || '0', 10);
          setState({ isGuest: true, isExpired: false, remainingTime: remaining, viewsCount: views });
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const incrementViews = useCallback(() => {
    const views = parseInt(localStorage.getItem(GUEST_VIEWS_KEY) || '0', 10);
    const newViews = views + 1;
    localStorage.setItem(GUEST_VIEWS_KEY, newViews.toString());
    setState(prev => ({ ...prev, viewsCount: newViews }));
    logger.info(`🎭 Guest views: ${newViews}`);
  }, []);

  return { ...state, incrementViews };
}
