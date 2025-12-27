import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/locales/I18nContext';
import { useGuestMode } from '@/hooks/useGuestMode';

// This would strictly come from the Region Manifest in a full implementation
// For now, we simulate the "Babel Kernel" logic
interface SovereignDeal {
  id: string;
  title: string;
  description: string;
  jurisdiction: string;
  background_gradient: string;
}

export const SovereignAdInjector: React.FC = () => {
  const { locale } = useTranslation();
  const { viewsCount } = useGuestMode();
  const [activeDeal, setActiveDeal] = useState<SovereignDeal | null>(null);

  useEffect(() => {
    // 1. Check Jurisdiction (Iron Layer check)
    // 2. Check "Vibe" (Simulated by ViewCount for now)
    
    // Only inject ads after 3 views to be polite (and simulate "learning")
    if (viewsCount < 3) return;

    let deal: SovereignDeal | null = null;

    if (locale === 'es-MX') {
      deal = {
        id: 'deal_sol_tacos',
        title: '🌮 Tacos de Media Noche',
        description: '2x1 en Zona Rosa al mostrar tu ID Zyeuté.',
        jurisdiction: 'MX',
        background_gradient: 'from-orange-500 to-red-600'
      };
    } else if (locale === 'es-SUR') { // Argentina/Chile
       deal = {
        id: 'deal_mate_club',
        title: '🧉 Mate & Code',
        description: 'Espacio de coworking gratis por 2 horas.',
        jurisdiction: 'SUR',
        background_gradient: 'from-blue-400 to-indigo-500'
       };
    } else if (locale === 'fr-CA' || locale === 'en-CA') {
       deal = {
         id: 'deal_poutine_verglas',
         title: '❄️ Poutine du Verglas',
         description: 'Livraison gratuite quand il fait -20°C.',
         jurisdiction: 'QC',
         background_gradient: 'from-cyan-500 to-blue-600'
       };
    }

    // "Pre-load" simulation
    if (deal) {
        // Random chance to inject (simulating the Vibe Match)
        if (Math.random() > 0.3) { 
            setActiveDeal(deal);
        }
    }

  }, [locale, viewsCount]);

  if (!activeDeal) return null;

  return (
    <div className="w-full relative z-20 px-4 py-2 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className={`w-full rounded-xl p-4 bg-gradient-to-r ${activeDeal.background_gradient} shadow-lg shadow-black/40 border border-white/10 relative overflow-hidden group hover:scale-[1.01] transition-transform`}>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shine" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded text-white border border-white/20">
                    Sovereign Deal • {activeDeal.jurisdiction}
                </span>
            </div>
            <h3 className="text-white font-black text-lg italic tracking-tight">{activeDeal.title}</h3>
            <p className="text-white/90 text-sm font-medium leading-tight">{activeDeal.description}</p>
          </div>
          <div className="ml-4">
             <button className="bg-white text-black font-bold text-xs px-3 py-2 rounded-lg shadow-md hover:bg-neutral-100 transition-colors">
                Claim
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
