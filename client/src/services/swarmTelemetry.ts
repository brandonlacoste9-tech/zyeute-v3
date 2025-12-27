import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

const telemetryLogger = logger.withContext('SwarmTelemetry');

export interface SwarmEvent {
  agent: string;
  action: string;
  metadata: Record<string, any>;
  latencyMs?: number;
}

/**
 * Logs a sovereign swarm event to the media_telemetry table.
 * This adheres to the Phase 8 Telemetry Protocol.
 */
export async function logSwarmEvent({
  agent,
  action,
  metadata,
  latencyMs
}: SwarmEvent) {
  try {
    const { error } = await supabase
      .from('media_telemetry')
      .insert({
        agent,
        action,
        metadata,
        latency_ms: latencyMs,
        timestamp: new Date().toISOString()
      });

    if (error) {
      telemetryLogger.error('Failed to log swarm event', error);
      // We do not throw here to prevent blocking the main thread
    }
  } catch (err) {
    telemetryLogger.error('Unexpected error logging swarm event', err);
  }
}

export async function getRecentSwarmEvents(limit = 50) {
    const { data, error } = await supabase
        .from('media_telemetry')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
    
    if (error) {
        telemetryLogger.error('Failed to fetch swarm events', error);
        return [];
    }
    return data;
}

export async function getAgentStats() {
    // Basic aggregation (Note: complex agg might require RPC or View in Supabase)
    // For now, we fetch recent history and aggregate client-side for the dashboard prototype
    const { data } = await supabase
        .from('media_telemetry')
        .select('agent, action, latency_ms')
        .order('timestamp', { ascending: false })
        .limit(1000); // Sample last 1000

     if (!data) return {};

     interface TelemetryRow {
         agent: string;
         action: string;
         latency_ms: number | null;
     }

     const stats: Record<string, { count: number; avgLatency: number; totalLatency: number }> = {};
     const rows = data as unknown as TelemetryRow[];

     rows.forEach(row => {
         const key = `${row.agent}:${row.action}`;
         if (!stats[key]) stats[key] = { count: 0, avgLatency: 0, totalLatency: 0 };
         
         stats[key].count++;
         if (row.latency_ms) {
             stats[key].totalLatency += row.latency_ms;
         }
     });

     // Calculate avgs
     Object.keys(stats).forEach(k => {
         stats[k].avgLatency = Math.round(stats[k].totalLatency / stats[k].count);
     });

     return stats;
}
