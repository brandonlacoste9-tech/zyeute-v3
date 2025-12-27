import React, { createContext, useContext, useEffect, useState } from 'react';
import { RegionManifest } from './V2_ARCH_SPECS';

// 1. THE CONTEXT
interface KernelContextType {
  manifest: RegionManifest | null;
  hydrated: boolean;
  sovereignty: {
    jurisdiction: string;
    endpoint: string;
  };
}

const KernelContext = createContext<KernelContextType | undefined>(undefined);

// 2. THE LOADER (Mock Fetch)
const loadManifest = async (): Promise<RegionManifest> => {
  // In V2, this fetches `https://cdn.babel.io/manifests/current-region.json`
  // Mocking Japan for now
  return {
    regionId: "jp-tk",
    configVersion: 1,
    sovereignty: {
      jurisdiction: "APPI",
      writeEndpoint: "https://aws-tokyo.babel.io",
      readEndpoint: "https://aws-tokyo.babel.io",
      auth: { supabaseUrl: "", supabaseAnonKey: "" }
    },
    presentation: {
       themeId: "neon-shibuya",
       locale: "ja-JP",
       assets: { logoUri: "sakura_blade.png", splashBackground: "#000", appIcon: "jp" },
       stringsBundleUrl: ""
    },
    features: { monetization: true, stealthMode: true, localContentBoost: 1.0, authMethods: [] }
  };
};

// 3. THE PROVIDER (Heart of the Monolith)
export const BabelKernelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manifest, setManifest] = useState<RegionManifest | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log("⚡ BABEL KERNEL: Initiating Hydration Sequence...");
    const ignite = async () => {
      try {
        const dna = await loadManifest();
        setManifest(dna);
        
        // --- SOVEREIGNTY LOCK ---
        if (dna.sovereignty.jurisdiction === 'APPI') {
           console.log("🔒 JURISDICTION DETECTED: [APPI]. Locking data planes.");
           // window.axios.defaults.baseURL = dna.sovereignty.writeEndpoint; // (Conceptual)
        }

        // --- THEME INJECTION ---
        console.log(`🎨 THEME SWAP: [${dna.presentation.themeId}] applied.`);
        document.body.className = dna.presentation.themeId; // Simple CSS swap

        setHydrated(true);
        console.log("🚀 KERNEL STABILIZED.");
      } catch (e) {
        console.error("💥 CORE FAILURE: DNA Hydration Aborted.");
      }
    };
    ignite();
  }, []);

  if (!hydrated) {
      return (
          <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h1>⚡ HYDRATING BABEL KERNEL...</h1>
          </div>
      );
  }

  return (
    <KernelContext.Provider value={{ 
        manifest, 
        hydrated, 
        sovereignty: { 
            jurisdiction: manifest!.sovereignty.jurisdiction, 
            endpoint: manifest!.sovereignty.writeEndpoint 
        } 
    }}>
      {children}
    </KernelContext.Provider>
  );
};

export const useKernel = () => {
    const context = useContext(KernelContext);
    if (!context) throw new Error("useKernel must be used within BabelKernelProvider");
    return context;
};
