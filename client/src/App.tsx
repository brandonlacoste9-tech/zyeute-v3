/**
 * Main App Component with Routing
 * Global Styles Applied via leather-overlay
 * Performance: Lazy loading for rarely-accessed routes
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MainLayout } from '@/components/MainLayout';
import { PageTransition } from '@/components/AnimatedRoutes';
import { TiGuy } from '@/components/features/TiGuy';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MapleSpinner } from '@/components/ui/MapleSpinner';
import { AchievementListener } from '@/components/gamification/AchievementModal';
import { ProtectedAdminRoute } from '@/components/auth';
import { ProtectedUserRoute } from '@/components/auth';
import { RedirectIfAuthenticated } from '@/components/auth';

// Core Pages - Eagerly loaded (frequently accessed)
// Home (deprecated) -> Redirects to Feed
import Feed from '@/pages/Feed';
import Profile from '@/pages/Profile';
import Explore from '@/pages/Explore';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AuthCallback from '@/pages/AuthCallback';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import VerifyEmail from '@/pages/VerifyEmail';

// Lazy-loaded Pages - Split into separate bundles (rarely accessed)
const Upload = lazy(() => import('@/pages/Upload'));
const PostDetail = lazy(() => import('@/pages/PostDetail'));
const Player = lazy(() => import('@/pages/Player'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Settings = lazy(() => import('@/pages/Settings'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const StoryCreator = lazy(() => import('@/components/features/StoryCreator'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const CreatorRevenue = lazy(() => import('@/pages/CreatorRevenue'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

// Admin Pages - Lazy loaded (admin only)
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const EmailCampaigns = lazy(() => import('@/pages/admin/EmailCampaigns'));
const HiveCommand = lazy(() => import('@/pages/admin/HiveCommand'));

// Phase 2 Pages - Lazy loaded (optional features)
const Artiste = lazy(() => import('@/pages/Artiste'));
const Studio = lazy(() => import('@/pages/Studio'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const Premium = lazy(() => import('@/pages/Premium'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const VoiceSettingsPage = lazy(() => import('@/pages/VoiceSettingsPage'));
const GoLive = lazy(() => import('@/pages/GoLive'));
const WatchLive = lazy(() => import('@/pages/WatchLive'));
const LiveDiscover = lazy(() => import('@/pages/LiveDiscover'));
const AIStudio = lazy(() => import('@/pages/AIStudio'));
const LaZyeute = lazy(() => import('@/pages/LaZyeute'));

// Settings Pages - Lazy loaded (rarely accessed)
const TagsSettings = lazy(() => import('@/pages/settings/TagsSettings'));
const CommentsSettings = lazy(() => import('@/pages/settings/CommentsSettings'));
const SharingSettings = lazy(() => import('@/pages/settings/SharingSettings'));
const RestrictedAccountsSettings = lazy(() => import('@/pages/settings/RestrictedAccountsSettings'));
const FavoritesSettings = lazy(() => import('@/pages/settings/FavoritesSettings'));
const MutedAccountsSettings = lazy(() => import('@/pages/settings/MutedAccountsSettings'));
const ContentPreferencesSettings = lazy(() => import('@/pages/settings/ContentPreferencesSettings'));
const MediaSettings = lazy(() => import('@/pages/settings/MediaSettings'));
const AudioSettings = lazy(() => import('@/pages/settings/AudioSettings'));
const StorageSettings = lazy(() => import('@/pages/settings/StorageSettings'));
const AppSettings = lazy(() => import('@/pages/settings/AppSettings'));
const RegionSettings = lazy(() => import('@/pages/settings/RegionSettings'));
const LanguageSettings = lazy(() => import('@/pages/settings/LanguageSettings'));
const ProfileEditSettings = lazy(() => import('@/pages/settings/ProfileEditSettings'));
const PrivacySettings = lazy(() => import('@/pages/settings/PrivacySettings'));
const NotificationSettings = lazy(() => import('@/pages/settings/NotificationSettings'));

// Moderation - Lazy loaded (admin only)
const Moderation = lazy(() => import('@/pages/moderation/Moderation'));

// Legal Pages - Lazy loaded (rarely accessed)
const CommunityGuidelines = lazy(() => import('@/pages/legal/CommunityGuidelines'));
const TermsOfService = lazy(() => import('@/pages/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));

// Loading fallback component with Quebec styling
const LazyLoadFallback: React.FC = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center flex flex-col items-center">
      <MapleSpinner size="lg" className="mb-4" />
      <p className="text-stone-400 font-medium">Chargement...</p>
    </div>
  </div>
);

// Protected Route Imports (Moved to top of file in V3 cleanup, but keeping here for minimal diff risk)
import { useAuth } from '@/contexts/AuthContext';

// Protected Route Component - Uses centralized AuthContext
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen message="Chargement de Zyeuté..." />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Achievement Listener (Global) */}
      <AchievementListener />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Full-screen routes (outside MainLayout) */}
          <Route
            path="/video/:videoId"
            element={
              <ProtectedRoute>
                <Player />
              </ProtectedRoute>
            }
          />
          <Route
            path="/zyeute"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LazyLoadFallback />}>
                  <LaZyeute />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Main App Content (inside MainLayout) */}
          <Route
            path="*"
            element={
              <MainLayout>
                <PageTransition>
                  <Routes>
                    {/* Public Routes - Wrapped to auto-redirect logged-in users */}
                    <Route path="/login" element={
                      <RedirectIfAuthenticated>
                        <Login />
                      </RedirectIfAuthenticated>
                    } />
                    <Route path="/signup" element={
                      <RedirectIfAuthenticated>
                        <Signup />
                      </RedirectIfAuthenticated>
                    } />
                    <Route path="/forgot-password" element={
                      <RedirectIfAuthenticated>
                        <ForgotPassword />
                      </RedirectIfAuthenticated>
                    } />
                    <Route path="/reset-password" element={
                      <RedirectIfAuthenticated>
                        <ResetPassword />
                      </RedirectIfAuthenticated>
                    } />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected Routes - with granular error boundaries */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Navigate to="/feed" replace />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/feed"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Feed />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <Dashboard />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/explore"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Explore />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/upload"
                      element={
                        <ProtectedUserRoute>
                          <ErrorBoundary>
                            <Suspense fallback={<LazyLoadFallback />}>
                              <Upload />
                            </Suspense>
                          </ErrorBoundary>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/story/create"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <StoryCreator />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <Notifications />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/profile/:slug"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Profile />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/p/:id"
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Suspense fallback={<LazyLoadFallback />}>
                              <PostDetail />
                            </Suspense>
                          </ErrorBoundary>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedUserRoute>
                          <ErrorBoundary>
                            <Suspense fallback={<LazyLoadFallback />}>
                              <Settings />
                            </Suspense>
                          </ErrorBoundary>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <Analytics />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />

                    {/* Phase 2 Feature Routes - Lazy loaded */}
                    <Route
                      path="/artiste"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <Artiste />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/studio"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <Studio />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/marketplace"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <Marketplace />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/premium"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <Premium />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/challenges"
                      element={
                        <ProtectedUserRoute>
                          <Suspense fallback={<LazyLoadFallback />}>
                            <Challenges />
                          </Suspense>
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/voice"
                      element={
                        <ProtectedUserRoute>
                          <VoiceSettingsPage />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/tags"
                      element={
                        <ProtectedUserRoute>
                          <TagsSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/comments"
                      element={
                        <ProtectedUserRoute>
                          <CommentsSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/sharing"
                      element={
                        <ProtectedUserRoute>
                          <SharingSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/restricted"
                      element={
                        <ProtectedUserRoute>
                          <RestrictedAccountsSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/favorites"
                      element={
                        <ProtectedUserRoute>
                          <FavoritesSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/muted"
                      element={
                        <ProtectedUserRoute>
                          <MutedAccountsSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/content"
                      element={
                        <ProtectedUserRoute>
                          <ContentPreferencesSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/media"
                      element={
                        <ProtectedUserRoute>
                          <MediaSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/audio"
                      element={
                        <ProtectedUserRoute>
                          <AudioSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/storage"
                      element={
                        <ProtectedUserRoute>
                          <StorageSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/app"
                      element={
                        <ProtectedUserRoute>
                          <AppSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/region"
                      element={
                        <ProtectedUserRoute>
                          <RegionSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/language"
                      element={
                        <ProtectedUserRoute>
                          <LanguageSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/profile"
                      element={
                        <ProtectedUserRoute>
                          <ProfileEditSettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/privacy"
                      element={
                        <ProtectedUserRoute>
                          <PrivacySettings />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/settings/notifications"
                      element={
                        <ProtectedUserRoute>
                          <NotificationSettings />
                        </ProtectedUserRoute>
                      }
                    />

                    {/* AI Studio Route */}
                    <Route
                      path="/ai-studio"
                      element={
                        <ProtectedUserRoute>
                          <AIStudio />
                        </ProtectedUserRoute>
                      }
                    />

                    {/* Live Streaming Routes */}
                    <Route
                      path="/live"
                      element={
                        <ProtectedRoute>
                          <LiveDiscover />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/live/go"
                      element={
                        <ProtectedUserRoute>
                          <GoLive />
                        </ProtectedUserRoute>
                      }
                    />
                    <Route
                      path="/live/watch/:id"
                      element={
                        <ProtectedRoute>
                          <WatchLive />
                        </ProtectedRoute>
                      }
                    />

                    {/* Moderation Routes (Admin Only) */}
                    <Route
                      path="/moderation"
                      element={
                        <ProtectedAdminRoute>
                          <Moderation />
                        </ProtectedAdminRoute>
                      }
                    />

                    {/* Legal Pages (Public) */}
                    <Route path="/legal/community-guidelines" element={<CommunityGuidelines />} />
                    <Route path="/legal/terms" element={<TermsOfService />} />
                    <Route path="/legal/privacy" element={<PrivacyPolicy />} />

                    {/* Gamification */}
                    <Route
                      path="/achievements"
                      element={
                        <ProtectedUserRoute>
                          <Achievements />
                        </ProtectedUserRoute>
                      }
                    />

                    {/* Creator Monetization */}
                    <Route
                      path="/revenue"
                      element={
                        <ProtectedUserRoute>
                          <CreatorRevenue />
                        </ProtectedUserRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedAdminRoute>
                          <AdminDashboard />
                        </ProtectedAdminRoute>
                      }
                    />
                    <Route
                      path="/admin/emails"
                      element={
                        <ProtectedAdminRoute>
                          <EmailCampaigns />
                        </ProtectedAdminRoute>
                      }
                    />
                    <Route
                      path="/admin/hive"
                      element={
                        <ProtectedAdminRoute>
                          <HiveCommand />
                        </ProtectedAdminRoute>
                      }
                    />

                    {/* Catch all - redirect to feed */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </PageTransition>

                {/* Colony OS Debug Button (Phase 2 - Testing) */}
                {/* <SwarmDebug /> */}

                {/* Ti-Guy mascot assistant (always available) */}
                <TiGuy />
              </MainLayout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
