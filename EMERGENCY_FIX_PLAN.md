# 🚑 EMERGENCY DIAGNOSTICS & HOTFIX PLAN
## Production Issue Resolution - Dec 18, 2025

**Branch:** `emergency-diagnostics`  
**Status:** IN PROGRESS  
**Priority:** CRITICAL  
**Target:** Fix broken production deployment  

---

## 🔥 Critical Issues Identified

### 1. **Deployment State Mismatch**
- **Problem:** Code on GitHub main shows fixes merged, but production still broken
- **Root Cause:** Vercel/Netlify didn't rebuild, or build cache is stale
- **Evidence:** Issue #12 closed (login fixed), but user reports login still broken

### 2. **Database Schema Drift**
- **Problem:** `users` table may not exist in production database
- **Root Cause:** Database migrations not run on production
- **Evidence:** PR #8 mentions "users table missing" causing login failures

### 3. **Missing Environment Variables**
- **Problem:** VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing/wrong in prod
- **Root Cause:** Environment variables not synced from local to production
- **Evidence:** Guest mode works (localStorage) but auth doesn't (Supabase)

### 4. **UI Interaction Failures**
- **Problem:** Buttons don't respond, video won't play, infinite scroll broken
- **Root Cause:** JavaScript chunks not loading, or event handlers not attached
- **Evidence:** User reports "all buttons don't work"

---

## ✅ Fix Strategy (3-Phase Approach)

### **Phase 1: Diagnostic Tools** (Files 1-3)

#### File 1: `/client/src/pages/Debug.tsx`
**Purpose:** Live diagnostic dashboard accessible at `/debug`

**Features:**
- ✅ Environment variable validation
- ✅ Supabase connection test
- ✅ Database schema verification (users, posts tables)
- ✅ API endpoint health checks
- ✅ LocalStorage functionality test
- ✅ Button wiring sample check
- ✅ Video element detection
- ✅ Build information display

**UI:** Quebec-themed with beaver emoji, gold/leather styling

#### File 2: Update `/client/src/App.tsx`
**Purpose:** Add route for diagnostic page

**Changes:**
```typescript
import Debug from './pages/Debug';

// Add route:
<Route path="/debug" element={<Debug />} />
```

#### File 3: `/DIAGNOSTIC_RUNBOOK.md`
**Purpose:** Step-by-step troubleshooting guide

**Sections:**
- How to access /debug page
- Interpreting diagnostic results
- Common fix procedures
- Deployment checklist

---

### **Phase 2: Hotfixes** (Files 4-8)

#### File 4: Fix Login Error Display
**File:** `/client/src/pages/Login.tsx`

**Changes:**
- Add visible error messages (not just console.log)
- Add loading states to buttons
- Add fallback for Supabase connection failure
- Improve guest mode messaging

#### File 5: Add Error Boundaries
**File:** `/client/src/components/ErrorBoundary.tsx`

**Purpose:** Catch React errors and display user-friendly messages

**Features:**
- Catch component crashes
- Display error message + stack trace (dev mode)
- Provide "Retry" button
- Log errors to console

#### File 6: Fix Video Player
**File:** `/client/src/components/features/VideoCard.tsx`

**Changes:**
- Add fallback thumbnail if video fails to load
- Add loading spinner
- Add error message if video can't play
- Lazy load video player chunk with error handling

#### File 7: Fix Infinite Scroll
**File:** `/client/src/pages/Feed.tsx`

**Changes:**
- Add visible loading indicator
- Add "no more posts" message
- Fix intersection observer setup
- Add error handling for API failures

#### File 8: Add API Error Logger
**File:** `/client/src/lib/api-logger.ts`

**Purpose:** Log all API failures to console and toast

**Features:**
- Intercept fetch calls
- Log request/response
- Display toast for 4XX/5XX errors
- Track error frequency

---

### **Phase 3: Deployment Fixes** (Files 9-11)

#### File 9: Database Migration Script
**File:** `/scripts/migrate-production.sh`

**Purpose:** Run database migrations on production

**Steps:**
```bash
#!/bin/bash
# 1. Connect to production database
# 2. Check if users table exists
# 3. Run drizzle-kit push if needed
# 4. Verify schema
# 5. Seed test data (optional)
```

#### File 10: Environment Variable Checklist
**File:** `/ENV_CHECKLIST.md`

**Purpose:** Verify all required environment variables

**Sections:**
- Required variables (with examples)
- How to set in Vercel
- How to test locally
- Common mistakes

#### File 11: Deployment Checklist
**File:** `/DEPLOYMENT_CHECKLIST.md`

**Purpose:** Step-by-step deployment verification

**Steps:**
1. Clear Vercel build cache
2. Verify environment variables
3. Run database migrations
4. Force fresh deployment
5. Test /debug page
6. Test login flow
7. Test video playback
8. Test infinite scroll
9. Smoke test all critical paths

---

## 🛠️ Implementation Order

### Immediate (Next 30 min)
```
✅ 1. Create emergency-diagnostics branch
⌛ 2. Add Debug.tsx (diagnostic dashboard)
⌛ 3. Update App.tsx (add /debug route)
⌛ 4. Add DIAGNOSTIC_RUNBOOK.md
```

### Next 30 min
```
⌛ 5. Fix Login.tsx (error display)
⌛ 6. Add ErrorBoundary.tsx
⌛ 7. Fix VideoCard.tsx (fallbacks)
⌛ 8. Fix Feed.tsx (infinite scroll)
⌛ 9. Add api-logger.ts
```

### Final 30 min
```
⌛ 10. Add migrate-production.sh
⌛ 11. Add ENV_CHECKLIST.md
⌛ 12. Add DEPLOYMENT_CHECKLIST.md
⌛ 13. Create Pull Request
⌛ 14. Document testing steps
```

---

## 🧪 Testing Plan

### Local Testing (Before Merge)
```bash
# 1. Checkout branch
git checkout emergency-diagnostics

# 2. Install dependencies
npm install

# 3. Run in dev mode
npm run dev

# 4. Test diagnostic page
# Open http://localhost:5173/debug
# Verify all checks pass

# 5. Test login
# Try email/password login
# Try guest mode
# Verify error messages display

# 6. Test video
# Navigate to feed
# Verify videos load
# Test play/pause

# 7. Test infinite scroll
# Scroll to bottom of feed
# Verify more posts load
# Verify loading indicator shows
```

### Production Testing (After Deploy)
```bash
# 1. Open production URL
# https://www.zyeute.com (or staging URL)

# 2. Open /debug page
# https://www.zyeute.com/debug
# Screenshot all diagnostic results
# Share with team

# 3. Test critical paths
# - Login with real credentials
# - Guest mode
# - Video playback
# - Infinite scroll
# - All main buttons

# 4. Monitor for errors
# - Open browser DevTools
# - Check Console for errors
# - Check Network tab for failed requests
# - Check Vercel logs for backend errors
```

---

## 📊 Success Metrics

### Must Pass (Blocking)
- [ ] /debug page loads without errors
- [ ] All environment variables show as "Set"
- [ ] Supabase connection test passes
- [ ] Users table exists in database
- [ ] Posts table exists in database
- [ ] Login form displays error messages (if login fails)
- [ ] Guest mode still works
- [ ] At least 1 video loads and plays
- [ ] Infinite scroll loads more posts
- [ ] No JavaScript errors in console (on happy path)

### Should Pass (Nice to Have)
- [ ] All API endpoints respond 200
- [ ] All buttons have visible loading states
- [ ] Video player shows loading spinner
- [ ] Error boundaries catch component crashes
- [ ] API errors show toast notifications

---

## 🚨 Rollback Plan

If this PR breaks production further:

```bash
# 1. Revert deployment
vercel rollback

# 2. Or, revert Git commit
git revert HEAD
git push origin main

# 3. Or, force deploy previous commit
vercel deploy --prod --force
```

**Safe rollback because:**
- All changes are additive (no files deleted)
- Diagnostic page is optional (doesn't affect existing flows)
- Error boundaries fail gracefully
- API logger only adds logging (doesn't change behavior)

---
## 📝 Notes for Reviewer

### Why This Approach?

1. **Diagnostic First:** Can't fix what you can't see. Dashboard gives visibility.
2. **Non-Breaking:** All changes are additive or improve error handling.
3. **Reversible:** Every change can be reverted without breaking existing features.
4. **Production-Safe:** No risky refactors, only safety improvements.

### Key Files to Review

**High Priority:**
- `Debug.tsx` - Main diagnostic dashboard
- `ErrorBoundary.tsx` - Catch React crashes
- `DEPLOYMENT_CHECKLIST.md` - Ensure proper deployment

**Medium Priority:**
- `Login.tsx` changes - Better error display
- `VideoCard.tsx` changes - Better fallbacks
- `Feed.tsx` changes - Better loading states

**Low Priority:**
- Documentation files (runbooks, checklists)
- Migration script (manual execution anyway)

---

## ✅ Checklist Before Merge

- [ ] All files committed to `emergency-diagnostics` branch
- [ ] No merge conflicts with main
- [ ] All TypeScript errors resolved
- [ ] Build passes locally (`npm run build`)
- [ ] Diagnostic page tested locally
- [ ] PR created with detailed description
- [ ] Reviewer assigned
- [ ] Deployment plan documented
- [ ] Rollback plan documented
- [ ] Team notified of incoming hotfix

---

**Document Status:** IMPLEMENTATION PLAN  
**Created:** December 18, 2025, 2:19 PM EST  
**Branch:** emergency-diagnostics  
**Estimated Completion:** 2:19 PM + 90 minutes = 3:49 PM EST  
**Next Review:** After Phase 1 complete (diagnostic dashboard)  

🎭⚜️ **Made for Zyeuté - L'app sociale du Québec**