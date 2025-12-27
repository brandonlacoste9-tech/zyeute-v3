import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { getRecentSwarmEvents, getAgentStats, SwarmEvent } from '../../services/swarmTelemetry';
import { logger } from '../../lib/logger';
import { cn } from '../../lib/utils';
import { usePresence } from '@/hooks/usePresence';

const DASHBOARD_REFRESH_MS = 5000;

export const SwarmTelemetryDashboard: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [recentEvents, agentStats] = await Promise.all([
                getRecentSwarmEvents(20),
                getAgentStats()
            ]);
            setEvents(recentEvents || []);
            setStats(agentStats || {});
        } catch (error) {
            logger.error('Failed to load swarm telemetry', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, DASHBOARD_REFRESH_MS);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-stone-300 pb-20">
            <Header title="Swarm Telemetry" showBack />
            
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Media Agent Stat */}
                    <div className="leather-card p-4 rounded-xl border border-gold-500/20">
                        <h3 className="text-gold-400 font-bold uppercase text-xs tracking-wider mb-1">Cinematic Generations</h3>
                        <p className="text-2xl font-mono text-white">
                            {stats['mediaAgent:generateCinematicMedia']?.count || 0}
                        </p>
                        <p className="text-xs text-stone-500 mt-2">swarmed by MediaAgent</p>
                    </div>

                    {/* Latency Stat */}
                    <div className="leather-card p-4 rounded-xl border border-gold-500/20">
                         <h3 className="text-gold-400 font-bold uppercase text-xs tracking-wider mb-1">Avg Latency</h3>
                         <p className="text-2xl font-mono text-white">
                             {stats['mediaAgent:generateCinematicMedia']?.avgLatency 
                                ? `${(stats['mediaAgent:generateCinematicMedia'].avgLatency / 1000).toFixed(2)}s` 
                                : '-'}
                         </p>
                         <p className="text-xs text-stone-500 mt-2">time to render</p>
                    </div>

                     {/* Active Agents (Mock for now, or derived) */}
                     <div className="leather-card p-4 rounded-xl border border-gold-500/20">
                         <h3 className="text-gold-400 font-bold uppercase text-xs tracking-wider mb-1">Active Hive Nodes</h3>
                         <p className="text-2xl font-mono text-white animate-pulse">
                             1
                         </p>
                         <p className="text-xs text-stone-500 mt-2">NectarStream v0.2</p>
                    </div>
                </div>

                {/* Event Feed */}
                <div className="leather-card rounded-xl overflow-hidden stitched">
                    <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
                        <h2 className="text-gold-400 font-bold text-sm uppercase tracking-wider">Live Neural Feed</h2>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                             <span className="text-xs text-stone-500">Monitoring</span>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-neutral-800">
                        {loading && events.length === 0 ? (
                            <div className="p-8 text-center text-stone-600">Initializing Uplink...</div>
                        ) : events.length === 0 ? (
                             <div className="p-8 text-center text-stone-600">No telemetry data recorded yet.</div>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className="p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gold-500/10 text-gold-400 border border-gold-500/20">
                                                {event.agent}
                                            </span>
                                            <span className="text-stone-400 text-sm font-medium">{event.action}</span>
                                        </div>
                                        <span className="text-[10px] text-stone-600 font-mono">
                                            {new Date(event.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    
                                    {event.metadata && (
                                        <div className="bg-black/40 rounded p-2 font-mono text-[10px] text-stone-400 overflow-x-auto">
                                            {event.metadata.prompt && (
                                                <div className="text-stone-300 truncate mb-1">
                                                    <span className="text-purple-400">prompt:</span> {event.metadata.prompt}
                                                </div>
                                            )}
                                             <div className="flex gap-4">
                                                {event.metadata.style && <span><span className="text-blue-400">style:</span> {event.metadata.style}</span>}
                                                {event.metadata.model && <span><span className="text-green-400">model:</span> {event.metadata.model}</span>}
                                                {event.latency_ms && <span><span className="text-yellow-400">latency:</span> {event.latency_ms}ms</span>}
                                             </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
