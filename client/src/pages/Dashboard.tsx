import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useTranslation } from '@/locales/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { swarmPresence } from '@/services/swarmPresence';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [presenceEnabled, setPresenceEnabled] = React.useState(swarmPresence.isOptedIn());

  const togglePresence = async () => {
    const newState = !presenceEnabled;
    setPresenceEnabled(newState);
    swarmPresence.setPresence(newState);
    
    // Call backend to sync (as per directive)
    try {
      await fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState })
      });
    } catch (e) {
      console.error("Presence sync failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-gold-500 mb-4">{t.common?.loading || 'Dashboard'}</h1>
      
      <div className="leather-card p-6 rounded-xl border border-gold-500/30">
        <h2 className="text-xl mb-2">Identity</h2>
        <p>User ID: {user?.id}</p>
        <p>Email: {user?.email}</p>
      </div>

      <div className="leather-card p-6 rounded-xl border border-gold-500/30 mt-4">
        <h2 className="text-xl mb-2">Swarm Presence</h2>
        <div className="flex items-center gap-4">
          <span>Status: {presenceEnabled ? 'Active' : 'Hidden'}</span>
          <button 
            onClick={togglePresence}
            className={`px-4 py-2 rounded ${presenceEnabled ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {presenceEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
