import React, { FC, ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { BorderColorProvider } from '@/contexts/BorderColorContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { GuestModeProvider } from '@/contexts/GuestModeContext';
import { ColonyProvider } from '@/components/providers/colony-provider';
import { I18nProvider } from '@/locales/I18nContext';
import { LoadingScreen } from '@/components/LoadingScreen';

/**
 * ZYEUTE GLOBAL PROVIDER STACK
 * 
 * Order of Operations (Hydration Priority):
 * 1. ErrorBoundary (Catches everything)
 * 2. Theme (Visuals first)
 * 3. Notifications (Alerts)
 * 4. Auth (Identity) -> Triggers GlobalAuthLoader
 * 5. GuestMode (Fallback Identity)
 * 6. I18n (Language - Dependent on Identity)
 * 7. Colony (Network Layer)
 * 8. BorderColor (Visual Polish)
 */

// Internal Loader that waits for Auth to stabilize
const GlobalAuthLoader: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth();
  if (isLoading) {
    return <LoadingScreen message="Hyrdrating Zyeuté Identity..." />;
  }
  return <>{children}</>;
};

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <GuestModeProvider>
                {/* I18n moved INSIDE Auth/Guest to access user preferences */}
                <I18nProvider>
                  <ColonyProvider>
                    <GlobalAuthLoader>
                      <BorderColorProvider>
                        {children}
                      </BorderColorProvider>
                    </GlobalAuthLoader>
                  </ColonyProvider>
                </I18nProvider>
            </GuestModeProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
