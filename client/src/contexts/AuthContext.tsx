import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin';
import {
    GUEST_MODE_KEY,
    GUEST_TIMESTAMP_KEY,
    GUEST_SESSION_DURATION,
    GUEST_VIEWS_KEY
} from '@/lib/constants';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isGuest: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    enterGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check guest mode validity
    const checkGuestMode = (): boolean => {
        const guestMode = localStorage.getItem(GUEST_MODE_KEY);
        const guestTimestamp = localStorage.getItem(GUEST_TIMESTAMP_KEY);

        if (guestMode === 'true' && guestTimestamp) {
            const age = Date.now() - parseInt(guestTimestamp, 10);
            if (age < GUEST_SESSION_DURATION) {
                return true;
            } else {
                // Expired
                localStorage.removeItem(GUEST_MODE_KEY);
                localStorage.removeItem(GUEST_TIMESTAMP_KEY);
                localStorage.removeItem(GUEST_VIEWS_KEY);
                return false;
            }
        }
        return false;
    };

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                // 1. Get initial session
                const { data: { session: initialSession } } = await supabase.auth.getSession();

                if (mounted) {
                    if (initialSession?.user) {
                        setSession(initialSession);
                        setUser(initialSession.user);
                        const adminStatus = await checkIsAdmin(initialSession.user);
                        if (mounted) setIsAdmin(adminStatus);
                    } else {
                         // Fallback to Guest Mode check
                        const validGuest = checkGuestMode();
                        if (mounted) setIsGuest(validGuest);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };


        initializeAuth();

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
            if (!mounted) return;
            console.log('🔐 Auth State Changed:', event);

            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (newSession?.user) {
                setIsGuest(false);
                const adminStatus = await checkIsAdmin(newSession.user);
                if (mounted) setIsAdmin(adminStatus);
            } else {
                setIsAdmin(false);
                 if (event === 'SIGNED_OUT') {
                    const validGuest = checkGuestMode();
                    if(mounted) setIsGuest(validGuest);
                 }
            }

            // Ensure loading is false only after all state updates are complete
            if (mounted) setIsLoading(false); 
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        setIsLoading(true);
        try {
            await supabase.auth.signOut();
            setIsGuest(false);
            setIsAdmin(false);
            setUser(null);
            setSession(null);
            // Close guest mode
            localStorage.removeItem(GUEST_MODE_KEY);
            localStorage.removeItem(GUEST_TIMESTAMP_KEY);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const enterGuestMode = () => {
        localStorage.setItem(GUEST_MODE_KEY, 'true');
        localStorage.setItem(GUEST_TIMESTAMP_KEY, Date.now().toString());
        setIsGuest(true);
    };

    const value = {
        user,
        session,
        isAuthenticated: !!user || isGuest,
        isAdmin,
        isGuest,
        isLoading,
        logout,
        enterGuestMode
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
