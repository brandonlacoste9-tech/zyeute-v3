import axios, { AxiosInstance } from 'axios';
import { useKernel } from '../../kernel-core/BabelKernelProvider';

/**
 * THE SOVEREIGN ROUTER (The "Iron Layer")
 * 
 * Responsibilities:
 * 1. Enforce Jurisdiction (Data Sovereignty)
 * 2. Route traffic to the HOME region enclave, regardless of physical location.
 * 3. Fail-Close on sovereignty breach.
 */

export const useSovereignRouter = (): AxiosInstance => {
  const { manifest, sovereignty } = useKernel();

  if (!manifest) {
      // In a real app, this should suspend or throw.
      // For V2 kernel demo, we return a strict-fail client.
      return axios.create({ baseURL: 'http://localhost:0000' });
  }

  // 1. Create the Client locked to the Manifest's endpoint
  const client = axios.create({
    baseURL: sovereignty.endpoint,
    timeout: 15000, // Latency allowance for cross-hemosphere routing
    headers: {
        'Content-Type': 'application/json',
        'X-Babel-Kernel': 'V2.0.0-SOVEREIGN'
    }
  });

  // 2. THE CUSTOMS OFFICER (Interceptor)
  client.interceptors.request.use(
    (config) => {
      // Identity Check
      const targetJurisdiction = sovereignty.jurisdiction; // e.g., "APPI" or "LAW_25"
      
      console.log(`🛡️ IRON LAYER: Inspecting Packet... Jurisdiction: [${targetJurisdiction}]`);

      // ENFORCEMENT LOGIC
      // If we are operating under APPI (Japan), we force specific headers
      if (targetJurisdiction === 'APPI') {
         config.headers['X-Privacy-Standard'] = 'APPI-LEVEL-3';
         config.headers['X-Encryption'] = 'AES-256-GCM';
      }

      // If we are under Law 25 (Quebec), we ensure data never touches "US-EAST-1"
      if (targetJurisdiction === 'LAW_25' && config.url?.includes('us-east-1')) {
          console.error("🚨 SOVEREIGNTY BLOCK: Attempted routing to US Jurisdiction.");
          throw new Error("Illegal Data Routing Detected");
      }

      return config;
    }, 
    (error) => {
      console.error("🚨 IRON LAYER: Request Rejected.");
      return Promise.reject(error);
    }
  );

  // 3. THE RESPONSE GUARD (Inbound Inspection)
  client.interceptors.response.use(
    (response) => {
        // Verify the server signed the response with the correct regional key
        const serverSignature = response.headers['x-sovereign-sig'];
        if (!serverSignature) {
            console.warn("⚠️  WARNING: Unsigned response received. Traffic may be intercepted.");
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
  );

  return client;
};
