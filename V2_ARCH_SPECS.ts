/**
 * V2 ARCHITECTURE SPECIFICATION: THE HYDRATION ENGINE
 * 
 * This file defines the rigid contract that every Region MUST implement.
 * The Core App knows NOTHING about Quebec or Mexico. It only knows this interface.
 */

// ------------------------------------------------------------------
// 1. THE PARENT MANIFEST (Injected at Runtime)
// ------------------------------------------------------------------
export interface RegionManifest {
  /** The unique identifier for the region (e.g., 'ca-qc', 'mx-mx', 'br-br') */
  regionId: string;
  
  /** Technical version of this config file to prevent drift */
  configVersion: number;

  /** The Identity & Sovereignty layer */
  sovereignty: SovereigntyConfig;

  /** The Visual Personality layer */
  presentation: PresentationConfig;

  /** The Feature Flags layer (What exists in this country?) */
  features: RegionalFeatures;
}

// ------------------------------------------------------------------
// 2. DATA SOVEREIGNTY (The "Law 25" Layer)
// ------------------------------------------------------------------
export interface SovereigntyConfig {
  /** 
   * The Primary Data Center for this user's HOME region.
   * All writes MUST go here.
   * @example "https://ovh-bhs.zyeute.com" 
   */
  writeEndpoint: string;

  /**
   * The Read Replica for the user's CURRENT location (Latency optimization).
   * Can be same as writeEndpoint if strict strict sovereignty is required.
   */
  readEndpoint: string;

  /** 
   * The legal jurisdiction governing this user's data.
   * Used to attach correct legal footers and consent flows.
   * @example "GDPR", "QUEBEC_LAW_25", "LGPD" 
   */
  jurisdiction: 'GDPR' | 'LAW_25' | 'LGPD' | 'CCPA' | 'NONE';

  /**
   * Hardcoded Supabase Anon Keys. 
   * These are effectively public, but distinct per region.
   */
  auth: {
    supabaseUrl: string;
    supabaseAnonKey: string;
  };
}

// ------------------------------------------------------------------
// 3. PRESENTATION (The "Gold vs Neon" Layer)
// ------------------------------------------------------------------
export interface PresentationConfig {
  /** 
   * The name of the Design Token Set to load.
   * @example "theme-gold-leather" (Quebec)
   * @example "theme-neon-concrete" (Clic)
   * @example "theme-sun-stone" (Mexico)
   */
  themeId: string;

  /** 
   * Specific asset overrides for the shell.
   * This allows the binary to look different before full hydation.
   */
  assets: {
    logoUri: string;      // e.g. "asset://logos/zyeute_qc.png"
    splashBackground: string;
    appIcon: string;      // Used for dynamic icon switching (if supported)
  };

  /**
   * The locale identifier for Int'l formatting
   * @example "fr-CA", "es-MX"
   */
  locale: string;

  /**
   * Remote URL to the heavy string bundle.
   * Loaded lazily to keep binary small.
   */
  stringsBundleUrl: string;
}

// ------------------------------------------------------------------
// 4. FEATURE FLAGS (The Franchise Control Layer)
// ------------------------------------------------------------------
export interface RegionalFeatures {
  /** Is the 'Creator Fund' active in this economy? */
  monetization: boolean;
  
  /** Is the 'Nuke' feature enabled? (Clic only) */
  stealthMode: boolean;

  /** 
   * 0.0 to 1.0 multiplier for 'Local Content' algorithm boost.
   * @example 3.0 (Aggressive local bias for Quebec)
   * @example 1.0 (Neutral)
   */
  localContentBoost: number;

  /** Supported login methods (Culturally dependent) */
  authMethods: Array<'email' | 'phone' | 'google' | 'apple' | 'wechat'>;
}
