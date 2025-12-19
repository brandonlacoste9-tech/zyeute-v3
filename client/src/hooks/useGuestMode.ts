import { useContext } from 'react';
import { GuestModeContext } from '../contexts/GuestModeContext';

/**
 * useGuestMode - Hook to access guest session state and controls
 * If used outside of GuestModeProvider, returns safe defaults
 */
export function useGuestMode() {
  const context = useContext(GuestModeContext);
  
  if (context === undefined) {
    // Return safe defaults matching GuestModeContextType to prevent crashes
    return {
      isGuest: false,
      setIsGuest: () => { },
      enterGuestMode: () => { },
      exitGuestMode: () => { },
      startGuestSession: () => { },
      endGuestSession: () => { },
      incrementViews: () => { },
      viewsCount: 0,
      isExpired: false,
      remainingTime: 0
    };
  }
  
  return context;
}
