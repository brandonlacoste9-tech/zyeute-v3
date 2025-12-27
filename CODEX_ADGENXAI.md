# CODEX: AdgenXai & The Zero-Knowledge Pipeline

> **Classification:** SECRET / SOVEREIGN  
> **Status:** ARCHITECTURAL DRAFT  
> **Authored By:** Gemini (Babel Thought Partner)  
> **Target System:** Zyeuté V2 (Sovereign Monolith)

---

## 🏛️ The Philosophy: Zero-Knowledge Ad Injection

AdgenXai is not an ad server. It is a **Local Context Engine**.

Traditional Ad Tech (Google Ads, Facebook) works by extracting your data, sending it to a central server, and bidding on it. This violates the **Iron Layer** and risks specific sovereignty laws like **Law 25 (Quebec)** and **PIPA (Korea)**.

**AdgenXai** inverts this model.
The Ad Logic lives **inside the user's device**, hydrated by the `RegionManifest`.

### 1. The Core Principle

- **The User's Data:** Stays on the device (Local Storage / IndexedDB).
- **The Ad Inventory:** Arrives as a "Blank Template" via the `RegionManifest`.
- **The Mixing:** Happens purely client-side. The app looks at the user's local "Vibe Tags" (computed locally by `TiGuySwarmAdapter`) and fills the ad slot.

---

## 🛠️ The Architecture

### A. The Vibe Vector (Local)

Every user has a locally stored `VibeVector` managed by the `ColonyClient`. This vector is never uploaded.

```typescript
interface LocalVibeVector {
  affinity_nightlife: number; // 0.0 - 1.0
  affinity_tech: number;
  affinity_fashion_shibuya: number;
  last_interaction_mood: "hype" | "chill";
}
```

### B. The Sovereign Inventory (Regional)

The `RegionManifest` (e.g., `mitemite.manifest.json`) includes a list of Sovereign Deals available in that region.

```json
"ad_inventory": [
    {
        "id": "deal_shibuya_109",
        "jurisdiction": "JP",
        "trigger_vibe": "affinity_fashion_shibuya > 0.8",
        "content_template": "Get {discount}% off at 109 when you flash your Zyeuté ID."
    }
]
```

### C. The Injection (Client-Side)

The `AdgenXai` component (part of the `BabelKernel`) runs silently in the background.

1.  It listens to `AgnosticFeed` scroll events.
2.  It checks the `LocalVibeVector` against the `RegionManifest` inventory.
3.  If a match is found, it **injects** the ad into the feed stream locally.
4.  **No request** is sent to an ad server to "fetch" the ad. It was already pre-loaded in the manifest.

---

## 🛡️ Compliance & The Iron Layer

This architecture bypasses the need for "Consent Popups" (GDPR) for 3rd party sharing, **because no 3rd party sharing occurs.**

- **Quebec (Law 25):** Data never leaves the device. The ad is just a "local notification" triggered by local logic.
- **Korea (PIPA):** No behavioral data is transmitted.
- **Japan (APPI):** The "Deal" is technically content, tailored by the user's own device agent.

---

## 🔌 Integration with Cyberhound

The **Cyberhound** (Arbitrage Agent) does not track users. It tracks **Inventory**.

- The Hound scans the local region (e.g., Mexico City) for deals.
- It updates the `mexico.manifest.json` with new deals.
- Users' devices download the new manifest.
- Users' devices decided _if_ they want to show the deal.

This is the **Ultimate Sovereign Loop.**

---

**Gemini Architect Note:** This is the only way to scale to 20+ regions without a legal army. The logic must be local. The inventory is global (per region). The privacy is absolute.
