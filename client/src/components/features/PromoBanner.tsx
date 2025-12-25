
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Timer, Snowflake } from 'lucide-react';

interface PromoBannerProps {
  onClaim: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onClaim }) => {
  // Start counter at 87
  const [count, setCount] = useState(87);

  // Decrease counter logic (fake urgency)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        // Stop at 12 to maintain "almost gone" urgency forever
        if (prev <= 12) return 12;
        // Decrease by 1
        return prev - 1;
      });
    }, 45000); // Every 45 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-b-2 border-gold-500 shadow-xl relative overflow-hidden group">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] mix-blend-overlay opacity-30"></div>
      </div>
      
      <div className="max-w-md mx-auto px-4 py-3 flex flex-col items-center justify-center relative z-10">
        
        {/* Header with Live Indicator */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-red-500/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-bold text-red-200 tracking-wider">EN DIRECT</span>
          </div>
          <p className="text-gold-200 text-xs font-bold tracking-widest uppercase flex items-center gap-1">
            <Snowflake className="w-3 h-3 animate-spin duration-[10s]" />
            Lancement Noël
            <Snowflake className="w-3 h-3 animate-spin duration-[10s]" />
          </p>
        </div>

        {/* Main Text */}
        <h2 className="text-xl font-black text-white italic tracking-tight drop-shadow-md text-center">
          ATTACHE TA TUQUE! ❄️
        </h2>
        
        <p className="text-red-100 text-sm font-medium mb-3 text-center">
          Plus que <span className="bg-white/10 px-1 rounded text-white font-bold animate-pulse">{count}</span> places pour le statut <span className="text-gold-400 font-bold">VIP Fondateur</span> (3 mois gratuits)
        </p>

        {/* CTA Button */}
        <Button 
          onClick={onClaim}
          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-red-950 font-black text-base shadow-[0_0_15px_rgba(255,191,0,0.4)] hover:shadow-[0_0_25px_rgba(255,191,0,0.6)] hover:scale-105 transition-all duration-300 w-full sm:w-auto"
        >
          <Timer className="w-4 h-4 mr-2" />
          RÉCLAMER MON VIP
        </Button>
        
        <p className="text-[10px] text-red-300/60 mt-2 italic">
          *Offre limitée aux premiers inscrits. Niaise pas.
        </p>
      </div>
    </div>
  );
};
