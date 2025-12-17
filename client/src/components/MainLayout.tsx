/**
 * MainLayout Component - Phone-Screen Centering with Dynamic Border Lighting
 * Provides a centered mobile app aesthetic on desktop with customizable border glow
 */

import React, { ReactNode } from 'react';
import { useBorderColor } from '@/contexts/BorderColorContext';
import { GuestBanner } from '@/components/GuestBanner';

interface MainLayoutProps {
  children: ReactNode;
}

import { BottomNav } from '@/components/BottomNav';

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { borderColor } = useBorderColor();

  const goldEdgeGlow: React.CSSProperties = {
    boxShadow: `
      0 0 20px rgba(255, 191, 0, 0.5),
      0 0 40px rgba(255, 191, 0, 0.3),
      inset 0 0 30px rgba(255, 191, 0, 0.15)
    `,
    border: '2px solid rgba(255, 191, 0, 0.6)',
    transition: 'box-shadow 0.5s ease-in-out, border-color 0.5s ease-in-out',
  };

  return (
    <div
      className="min-h-screen flex justify-center items-start pt-0 pb-0 leather-dark"
    >
      <div
        className="w-full max-w-md mx-auto min-h-screen text-white overflow-hidden relative shadow-2xl"
        style={{
          ...goldEdgeGlow,
        }}
      >
        {/* Brown leather background inside the app */}
        <div
          className="absolute inset-0 leather-brown"
          style={{
            opacity: 0.95,
          }}
        />
        {/* Gold ambient glow at top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 215, 0, 0.1) 0%, transparent 40%)',
          }}
        />
        {/* Content */}
        <div className="relative z-10 min-h-full pb-20">
          {children}
        </div>

        {/* Navigation */}
        <BottomNav />

        {/* Guest Banner - Shows after 3 views */}
        <GuestBanner />
      </div>
    </div>
  );
};

