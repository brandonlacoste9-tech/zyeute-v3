
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PartyPopper, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti when modal opens
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF0000'] // Gold and Red
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF0000']
        });
      }, 250);

      const scalar = 2;
      const unicorn = confetti.shapeFromText({ text: '⚜️', scalar });
      
      confetti({
        shapes: [unicorn],
        particleCount: 15,
        scalar,
        startVelocity: 45,
        spread: 360,
        origin: { x: 0.5, y: 0.4 },
        zIndex: 10000
      });

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur and darken */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content - Golden Ticket Vibe */}
      <div className="relative bg-gradient-to-br from-neutral-900 to-black border-2 border-gold-500 rounded-xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(255,215,0,0.3)] animate-in zoom-in-50 duration-300 overflow-hidden transform hover:scale-105 transition-transform">
        
        {/* Animated sheen effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center border border-gold-500 mb-2 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
            <PartyPopper className="w-10 h-10 text-gold-400 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 animate-pulse">
              YESSIR! <br/> T'ES DEDANS! 🎉
            </h2>
            <p className="text-gold-100 font-medium text-lg">
              Statut Fondateur Confirmé
            </p>
            <div className="flex items-center justify-center gap-2 text-stone-400 text-sm mt-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>3 mois VIP activés</span>
            </div>
          </div>

          {/* Ticket ID or similar */}
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">ID MEMBRE</p>
            <p className="font-mono text-gold-400 tracking-wider">QC-{Math.floor(1000 + Math.random() * 9000)}-VIP</p>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-black text-lg py-6"
            onClick={onClose}
          >
            C'EST PARTI! 🚀
          </Button>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
