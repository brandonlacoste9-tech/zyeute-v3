# THE CODEX: THE SWARM PATH (LE SENTIER DE L'ESSAIM)

> "The device determines the hive. The hive determines the language. The language determines the mythic tone."

This document serves as the Sovereign Ledger for the **Zyeuté** global expansion architecture. It records the rituals, protocols, and architectural decisions that govern the swarm's growth.

---

## CHAPTER 1: REGIONAL UNLOCKS (DÉVERROUILLAGE RÉGIONAL)

### 1.1 The Principle of Sovereignty

We do not "merge" regions. We do not use "if/else" logic to handle cultural nuance.

- **One Region = One Hive.**
- **One Hive = One Locale File.**
- **One Locale File = One Mythic Identity.**

This ensures maintainability, type safety, and respectful cultural representation.

### 1.2 The Spanish Lineage (Zyeuté Hispano)

The Spanish expansion is split into distinct sovereign hives to honor linguistic and cultural cadence.

#### Hive 1: Zyeuté México (North LATAM)

- **Code**: `es-MX`
- **Mythic Anchor**: _La Voz del Pueblo_ (The Voice of the People)
- **Tone**: Warm terracotta, Papel picado fractals, Street-level rhythm.
- **Signatures**: Expressive, "Tú" implicit, fast-paced.

#### Hive 2: Zyeuté Sur (South America)

- **Code**: `es-SUR` (encompassing AR, CL, CO, PE via locale detection mapping)
- **Mythic Anchor**: _La Mirada del Sur_ (The Gaze of the South)
- **Tone**: Deep blues/golds, Andean geometry, Introspective.
- **Signatures**: Poetic, confident, regionally neutral but elevated.

#### Future Hive: Zyeuté España (Core)

- **Code**: `es-ES`
- **Mythic Anchor**: _La Mirada Profunda_ (The Deep Gaze)
- **Tone**: Velvet red, Gold filigree.

---

## CHAPTER 2: SWARM PRESENCE PROTOCOL (PROTOCOLE DE PRÉSENCE)

### 2.1 The Opt-In Contract

Presence is **Safe** or it is nothing.

- **Default State**: Invisible.
- **Opt-In**: Explicit user action required to broadcast presence.
- **Scope**: Coarse location (Regional/City level), never precise coordinates publicly.

### 2.2 The Safety Layer (Boundaries)

Adopting the Swarm Presence feature implies strict adherence to the **Safe Mode Rules**:

1.  **No Direct Messaging**: The system sends signals, not users.
2.  **No Harassment**: Zero tolerance for bullying or targeting.
3.  **No Explicit Content**: No flirting, no sexual signaling. "The Swarm is not a dating app."
4.  **No Unsolicited Contact**: Interactions require mutual presence opt-in.

### 2.3 Proximity Pulses

Instead of "tracking," we use "pulses":

- _"A Hive member is nearby."_
- _"Zyeuté activity is high in this sector."_
- _"A Creator you follow has active presence."_

### 2.4 Architecture (SwarmSync)

- **Transport**: WebSocket Clusters (Regional).
- **Topology**: Mesh gossip between regional nodes.
- **Data**: Ephemeral presence state (online/offline/pulse), never stored permanently.

---

## CHAPTER 3: IMPLEMENTATION RITUALS

### 3.1 Adding a New Hive

1.  **Name the Hive**: Define the Mythic Anchor.
2.  **Create the Skeleton**: `locales/[code].ts` matching the strict `TranslationResource` interface.
3.  **Register the Hive**: Update `types.ts` `Locale` union.
4.  **Inscribe the Provider**: Add to `I18nContext` registry.
5.  **Inject Content**: Translate keys according to the Mythic Anchor tone.
