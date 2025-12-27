# CODEX: THE SOVEREIGN MONOLITH (ZYEUTÉ V2)

**"One Codebase, Many Souls."**

This document outlines the architectural pivot from the **V1 Franchise Model** (Separate Repos) to the **V2 Sovereign Monolith** (Single Binary + Config Injection).

This architecture is designed to solve two existential threats:

1.  **Maintenance Suicide:** Preventing the operational collapse of maintaining 20+ separate codebases.
2.  **App Store Death:** Bypassing Apple/Google "Spam" policies (4.3) by shipping a dynamic, hydrated application.

---

## 🏗️ 1. The Architecture: Core + Config

Instead of cloning the entire application for each region, we build a single engine that loads its personality at runtime.

### **The Folder Structure**

```
/zyeute-monorepo
  /packages
    /core           # THE ENGINE (95% of code)
      /auth         # Supabase Auth logic
      /feed         # The scroll, video player, interaction logic
      /ui           # Gold & Leather Design System
      /data         # API clients (agnostic to endpoints)

    /regions        # THE DNA (Config Only - No App Logic)
      /quebec
        config.json # { "locale": "fr-CA", "theme": "joual-gold", "api_endpoint": "https://ovh-ca.zyeute.com" }
        strings.json
        assets/     # Logos, Icons
      /mexico
        config.json # { "locale": "es-MX", "theme": "chilango-red", "api_endpoint": "https://aws-mx.zyeute.com" }
        strings.json
        assets/
      /brazil
        ...
```

### **The Build Strategy**

We do **NOT** maintain 20 branches. We maintain **Main**.

- **Development:** `npm run dev --region=quebec` (Injects Quebec config).
- **Deployment:** The CI pipeline iterates through the `/regions` folder and deploys instances based on the config.

---

## 🌍 2. The Distribution Strategy: "Hydration"

This is the most critical component for survival on the App Store.

**The Problem:** Apple Policy 4.3 rejects "spam" apps that are too similar.
**The Solution:** Ship ONE binary that transforms itself.

### **The "Universal Shell" Workflow**

1.  **Download:** User downloads "Zyeuté" (The Core App) from the App Store.
2.  **Launch:** The app boots in a "Neutral State".
3.  **Detection:**
    - **GPS Check:** "User is in Mexico City."
    - **Device Language:** "User phone is set to Spanish (Mexico)."
4.  **Hydration:**
    - The App requests the `mexico` config from the Global Edge.
    - The UI "swaps" instantly to the Mexico Theme.
    - The API client repoints to the Mexico Data Center.
5.  **Persistence:**
    - The user is registered as a "Mexico User".
    - Even if they travel to Quebec, they keep their Mexican interface (Data Sovereignty).
    - _Option:_ They can toggle "Guest Mode" to see local content, but their identity remains sovereign.

---

## ⚔️ 3. The Maintenance Advantage

| Feature            | V1 Franchise (Clones)                                 | V2 Monolith (Config)                      |
| :----------------- | :---------------------------------------------------- | :---------------------------------------- |
| **Security Patch** | Merge manually to 20 repos. High risk of human error. | **Fix once in Core. Deploy all.**         |
| **New Feature**    | Copy-paste code 20 times. Drift is guaranteed.        | **Build once. Flag on/off per region.**   |
| **Bug Fixing**     | "It works in Quebec but breaks in Mexico."            | **Standardized codebase. Reproductive.**  |
| **DevOps**         | 20 separate CI pipelines.                             | **Single pipeline with matrix strategy.** |

---

## 🛡️ 4. Data Sovereignty Implementation

"Monolith" does not mean "Centralized Data."

- **Code:** Centralized (Github)
- **Data:** Distributed (Supabase Instances)

The `config.json` for each region hardcodes the Supabase URL.

- **Quebec:** `vuanulvyqkfefmjcikfk.supabase.co` (Hosted in CA-East)
- **Mexico:** `mx-project-id.supabase.co` (Hosted in AWS-LATAM)

This satisfies GDPR and local data laws because the **User Data never leaves the regional database**, even though the **Client Code** is identical globally.

---

## 🚀 5. Implementation Roadmap

1.  **Extract Core:** Move `client/src` to `/packages/core`.
2.  **Extract Config:** Creating `/packages/regions/quebec` and moving all hardcoded strings and API URLs there.
3.  **Refactor Main:** Update `main.tsx` to load config before rendering.
4.  **Hydration Logic:** Implement the `RegionDetector` service.
5.  **CI/CD Update:** Update Vercel/Apple pipelines to support the matrix build.

**Status:** Ready for execution upon command.
