/**
 * Swarm Presence Service (Safe Mode)
 * 
 * Implements the "Swarm Presence Protocol" defined in CODEX_THE_SWARM_PATH.md.
 * 
 * CORE PRINCIPLES:
 * 1. Opt-in Only: No presence is broadcast unless explicitly enabled.
 * 2. Neutrality: Notifications are system-generated pulses, not user messages.
 * 3. Safety: No explicit content, no harassment, no unsolicited contact.
 */

export interface PresenceState {
  isOptedIn: boolean;
  lastPulse: number; // Timestamp
  regionId?: string; // "fr-CA", "es-MX", etc.
}

export type PulseType = 'HIVE_MEMBER_NEARBY' | 'FRIEND_NEARBY' | 'CREATOR_NEARBY' | 'HIGH_ACTIVITY_AREA';

export interface SwarmPulse {
  id: string;
  type: PulseType;
  timestamp: number;
  message: string; // Pre-defined system message (localized key)
}

const STORAGE_KEY_PRESENCE = 'swarm_presence_opt_in';

class SwarmPresenceService {
  private _optedIn: boolean = false;
  private _listeners: ((pulse: SwarmPulse) => void)[] = [];

  constructor() {
    // Load persisted preference
    const saved = localStorage.getItem(STORAGE_KEY_PRESENCE);
    this._optedIn = saved === 'true';
  }

  /**
   * Toggle presence opt-in state.
   * "The device determines the hive presence."
   */
  public setPresence(enabled: boolean): void {
    this._optedIn = enabled;
    localStorage.setItem(STORAGE_KEY_PRESENCE, String(enabled));
    
    if (enabled) {
      this.broadcastHello();
    } else {
      this.disconnect();
    }
  }

  public isOptedIn(): boolean {
    return this._optedIn;
  }

  /**
   * Subscribe to incoming safe pulses from the swarm.
   */
  public subscribe(callback: (pulse: SwarmPulse) => void): () => void {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Simulate a pulse for dev/demo purposes.
   * In production, this would come via WebSocket.
   */
  public simulatePulse(type: PulseType): void {
    if (!this._optedIn) return;

    const pulse: SwarmPulse = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      timestamp: Date.now(),
      message: this.getSystemMessage(type)
    };

    this.notifyListeners(pulse);
  }

  private broadcastHello(): void {
    console.log('[SwarmPresence] Connecting to Hive... (Simulation)');
    // TODO: Connect to WebSocket cluster
  }

  private disconnect(): void {
    console.log('[SwarmPresence] Disconnecting from Hive...');
    // TODO: Disconnect WebSocket
  }

  private notifyListeners(pulse: SwarmPulse): void {
    this._listeners.forEach(cb => cb(pulse));
  }

  private getSystemMessage(type: PulseType): string {
    switch (type) {
      case 'HIVE_MEMBER_NEARBY': return 'presence.hive_member_nearby';
      case 'FRIEND_NEARBY': return 'presence.friend_nearby';
      case 'CREATOR_NEARBY': return 'presence.creator_nearby';
      case 'HIGH_ACTIVITY_AREA': return 'presence.high_activity';
      default: return 'presence.pulse';
    }
  }
}

export const swarmPresence = new SwarmPresenceService();
