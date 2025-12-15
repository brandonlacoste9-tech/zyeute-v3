/**
 * Hero Component - Conversion-Optimized CTA Section
 * Single primary action with clear value proposition
 * De-emphasized secondary login link
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1510 50%, #0d0b09 100%)',
      }}
    >
      {/* Leather Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gold Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,191,0,0.15) 0%, rgba(255,191,0,0.05) 40%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Glowing Fleur-de-lys Logo */}
        <div className="mb-8 overflow-visible">
          <div className="relative inline-block overflow-visible">
            <div 
              className="absolute inset-0 blur-xl opacity-60"
              style={{
                background: 'radial-gradient(circle, rgba(255,191,0,0.6) 0%, transparent 70%)',
                transform: 'scale(1.5)',
              }}
            />
            
            <div 
              className="relative w-28 h-28 mx-auto rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                boxShadow: `0 0 40px rgba(255,191,0,0.3), 0 0 80px rgba(255,191,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
            >
              <div 
                className="absolute inset-0 rounded-2xl"
                style={{
                  border: '2px solid rgba(255,191,0,0.6)',
                  boxShadow: '0 0 20px rgba(255,191,0,0.4), inset 0 0 20px rgba(255,191,0,0.1)',
                }}
              />
              
              <svg 
                viewBox="0 0 100 100" 
                className="w-16 h-16 relative z-10"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255,191,0,0.8)) drop-shadow(0 0 20px rgba(255,191,0,0.4))',
                }}
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#FFC125" />
                    <stop offset="100%" stopColor="#DAA520" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 5 C50 5 45 15 45 22 C45 27 47 30 50 32 C53 30 55 27 55 22 C55 15 50 5 50 5 Z M50 32 L50 45 M35 35 C25 30 20 35 20 42 C20 48 25 52 32 50 C38 48 42 44 45 40 M65 35 C75 30 80 35 80 42 C80 48 75 52 68 50 C62 48 58 44 55 40 M50 45 L50 75 M50 55 L35 70 C30 75 25 78 25 85 C25 90 30 92 35 90 M50 55 L65 70 C70 75 75 78 75 85 C75 90 70 92 65 90 M40 75 L60 75 L55 85 L45 85 Z"
                  fill="none"
                  stroke="url(#goldGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1 
            className="text-6xl font-black mt-6 tracking-wide"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              background: 'linear-gradient(180deg, #FFF8DC 0%, #FFE55C 15%, #FFD700 30%, #DAA520 60%, #B8860B 85%, #8B6914 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6)) drop-shadow(0 3px 6px rgba(0,0,0,0.9))',
              lineHeight: '1.2',
              paddingTop: '0.25rem',
              letterSpacing: '0.03em',
            }}
          >
            Zyeuté
          </h1>
          <p className="text-sm font-bold tracking-[0.3em] mt-2" style={{ color: '#DAA520' }}>
            L'APP SOCIALE DU QUÉBEC
          </p>
        </div>

        {/* Hero Headline */}
        <h2 
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          style={{ 
            color: '#E8DCC4',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          Rejoins la Communauté<br />
          Québécoise #1
        </h2>

        {/* Hero Subheadline */}
        <p 
          className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
          style={{ 
            color: '#B8A88A',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}
        >
          Partage, découvre et connecte avec ta communauté francophone
        </p>

        {/* CTA Section - Improved with single primary action */}
        <div className="relative flex flex-col gap-3 items-center pt-6" style={{ zIndex: 2 }}>
          {/* Primary CTA - Clear value proposition */}
          <Link
            to="/signup"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-12 text-lg font-bold text-white transition-all hover:from-red-700 hover:to-red-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-600/50 shadow-lg shadow-red-600/30"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFC125 50%, #DAA520 100%)',
              color: '#1a1a1a',
              boxShadow: '0 8px 30px rgba(255,191,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            Commencer Gratuitement → Aucune Carte Requise
          </Link>
          
          {/* Secondary link - De-emphasized */}
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-gray-600 hover:decoration-white"
          >
            Déjà un compte? Connexion
          </Link>
        </div>

        {/* Trust Indicators / Social Proof */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm" style={{ color: '#8B7355' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇨🇦</span>
            <span>100% Québécois</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚜️</span>
            <span>Communauté Francophone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span>Sécurisé & Privé</span>
          </div>
        </div>
      </div>
    </div>
  );
};
