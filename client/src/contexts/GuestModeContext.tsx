import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GUEST_MODE_KEY, GUEST_TIMESTAMP_KEY, GUEST_VIEWS_KEY } from '../lib/constants';

interface GuestModeContextType {
    isGuest: boolean;
    setIsGuest: (value: boolean) => void;
    enterGuestMode: () => void;
    exitGuestMode: () => void;
    startGuestSession: () => void;
    endGuestSession: () => void;
    incrementViews: () => void;
    viewsCount: number;
    isExpired: boolean;
    remainingTime: number;
}

export const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

export function GuestModeProvider({ children }: { children: ReactNode }) {
    const [isGuest, setIsGuest] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(GUEST_MODE_KEY) === 'true';
        }
        return false;
    });

    const [viewsCount, setViewsCount] = useState(() => {
        if (typeof window !== 'undefined') {
            const count = localStorage.getItem(GUEST_VIEWS_KEY);
            return count ? parseInt(count, 10) : 0;
        }
        return 0;
    });

    const [remainingTime, setRemainingTime] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

    // Update remaining time and expiry status
    useEffect(() => {
        const checkExpiry = () => {
            const timestamp = localStorage.getItem(GUEST_TIMESTAMP_KEY);
            if (timestamp && isGuest) {
                const startTime = parseInt(timestamp, 10);
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 24 * 60 * 60 * 1000 - elapsed);
                setRemainingTime(remaining);
                
                if (remaining <= 0) {
                    setIsExpired(true);
                    // Session expired, but we don't automatically clear to let UI handle it
                } else {
                    setIsExpired(false);
                }
            } else {
                setRemainingTime(0);
                setIsExpired(false);
            }
        };

        checkExpiry();
        const interval = setInterval(checkExpiry, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [isGuest]);

    // Sync localStorage changes to state
    useEffect(() => {
        const handleStorageChange = () => {
            const guestMode = localStorage.getItem(GUEST_MODE_KEY) === 'true';
            setIsGuest(guestMode);
            const count = localStorage.getItem(GUEST_VIEWS_KEY);
            setViewsCount(count ? parseInt(count, 10) : 0);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const enterGuestMode = () => setIsGuest(true);
    const exitGuestMode = () => setIsGuest(false);

    const startGuestSession = () => {
        console.log('🎭 [GuestModeContext] Starting guest session...');
        try {
            localStorage.setItem(GUEST_MODE_KEY, 'true');
            localStorage.setItem(GUEST_TIMESTAMP_KEY, Date.now().toString());
            localStorage.setItem(GUEST_VIEWS_KEY, '0');
            setViewsCount(0);
            setIsGuest(true);
            setIsExpired(false);
            console.log('✅ [GuestModeContext] Guest session started');
        } catch (e) {
            console.warn('⚠️ [GuestModeContext] Storage failed:', e);
            setIsGuest(true);
        }
    };

    const endGuestSession = () => {
        console.log('🎭 [GuestModeContext] Ending guest session...');
        try {
            localStorage.removeItem(GUEST_MODE_KEY);
            localStorage.removeItem(GUEST_TIMESTAMP_KEY);
            localStorage.removeItem(GUEST_VIEWS_KEY);
        } catch (e) {
            console.warn('⚠️ [GuestModeContext] Storage cleanup failed:', e);
        }
        setIsGuest(false);
        setViewsCount(0);
        setIsExpired(false);
    };

    const incrementViews = () => {
        const newCount = viewsCount + 1;
        setViewsCount(newCount);
        try {
            localStorage.setItem(GUEST_VIEWS_KEY, newCount.toString());
        } catch (e) {
            console.warn('⚠️ [GuestModeContext] Failed to save guest views:', e);
        }
    };

    return (
        <GuestModeContext.Provider value={{
            isGuest,
            setIsGuest,
            enterGuestMode,
            exitGuestMode,
            startGuestSession,
            endGuestSession,
            incrementViews,
            viewsCount,
            isExpired,
            remainingTime
        }}>
            {children}
        </GuestModeContext.Provider>
    );
}

export function useGuestMode() {
    const context = useContext(GuestModeContext);
    if (context === undefined) {
        // Return a safe default instead of throwing to prevent app-wide crashes
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

export default GuestModeContext;
