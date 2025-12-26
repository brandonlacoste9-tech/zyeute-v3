# Auth Hardening "Done" Checklist

This checklist defines the criteria for considering the Authentication Edge Flow hardening complete.

## 1. Route Protection Verification

- [x] **Home Route (`/`)**: Redirects strictly to `/feed` if authenticated, or login if guest/unauthed (via `ProtectedRoute`).
- [x] **Authenticated User Redirects**:
  - [x] User visiting `/login` -> Redirects to `/feed` (or previous intent).
  - [x] User visiting `/signup` -> Redirects to `/feed` (or previous intent).
  - [x] User visiting `/forgot-password` -> Redirects to `/feed`.
  - [x] User visiting `/reset-password` -> Redirects to `/feed`.

## 2. Guest & Public Access

- [x] **Guest Mode**: Guest users can access public pages but are identified as guests.
- [x] **Strictly Public Routes** (Always accessible, no redirects):
  - [x] `/verify-email`
  - [x] `/legal/*` (Terms, Privacy, Guidelines)
  - [x] `/auth/callback`

## 3. Security & UX

- [x] **No Dead Ends**: Authenticated users never see a "Login" form just to be told they are already logged in.
- [x] **Return URL**: After login, user is returned to their original destination (handled by `RedirectIfAuthenticated` logic `location.state.from`).

## 4. Codebase & Tests

- [x] **Preflight Checks**: `npm run preflight` passes (Build, Lint, Test).
- [x] **Documentation**: This checklist is committed and verified.
