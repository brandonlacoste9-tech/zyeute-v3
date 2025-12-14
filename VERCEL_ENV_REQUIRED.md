# Required Vercel Environment Variables

## Critical: Fix Login 500 Error

The **500 error on login** is caused by missing environment variables in Vercel. These MUST be set for the app to function.

---

## Step 1: Set These in Vercel Dashboard

Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

### Database (REQUIRED)

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important**: Use Supabase's **Transaction pooler** (port 6543) for serverless functions, NOT the direct connection (port 5432).
Find this in: **Supabase Dashboard** → **Project Settings** → **Database** → **Connection Pooling**

### Session Secret (REQUIRED)

```
SESSION_SECRET=your-random-secret-key-minimum-32-characters-long
```

Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Supabase Auth (REQUIRED for JWT Auth)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Find these in: **Supabase Dashboard** → **Project Settings** → **API**

⚠️ **Critical**: Use the **Service Role Key** for `SUPABASE_SERVICE_ROLE_KEY`, NOT the anon key!

### Stripe (REQUIRED for Payments)

```
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_live_... or pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Find these in: **Stripe Dashboard** → **Developers** → **API Keys**

### AI Services (REQUIRED for Ti-Guy AI)

```
DEEPSEEK_API_KEY=sk-...
FAL_API_KEY=...
```

- DeepSeek: https://platform.deepseek.com/api_keys
- FAL: https://fal.ai/dashboard/keys

### Optional - Email Automation

```
RESEND_API_KEY=re_...
```

Get from: https://resend.com/api-keys

---

## Step 2: Redeploy

After setting environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on latest deployment
3. Click **"Redeploy"**

OR push a new commit to trigger auto-deployment.

---

## Step 3: Verify Logs

After redeployment:

1. Go to **Deployments** → Latest Deployment → **Functions** tab
2. Try logging in at `https://www.zyeute.com/login`
3. Check runtime logs for errors

### Common Errors:

- **`ECONNREFUSED`** = `DATABASE_URL` is wrong or database is down
- **`Missing credentials`** = Environment variable not set
- **`Invalid API key`** = Stripe/FAL/DeepSeek key is wrong

---

## Architecture Notes

### Why Session Storage Was Failing

- **Before**: Used in-memory sessions (`MemoryStore`)
- **Problem**: Vercel serverless functions are stateless - each invocation gets a fresh instance
- **Result**: Sessions were lost immediately after login

### Current Solution

**Hybrid Auth System** (best of both worlds):

1. **Primary**: Supabase JWT tokens (frontend sends `Authorization: Bearer <token>`)
   - Stateless, serverless-friendly
   - Already working for OAuth (Google login)

2. **Fallback**: Session-based auth (legacy)
   - For backward compatibility
   - Will be deprecated once migration is complete

### Migration Path

**For Frontend Developers:**

Use Supabase Auth everywhere:

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// Attach token to API requests
const session = await supabase.auth.getSession();
const token = session.data.session?.access_token;

fetch('/api/posts', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**Backend automatically accepts both:**
- JWT tokens (via `Authorization: Bearer` header)
- Legacy session cookies (via `req.session.userId`)

---

## Testing Checklist

After setting environment variables:

- [ ] Login with email/password works (`/login`)
- [ ] Login with Google OAuth works
- [ ] Creating posts works (requires auth)
- [ ] Stripe payment intents create successfully
- [ ] AI image generation works
- [ ] Database queries succeed

---

## Need Help?

1. Check Vercel Function logs: **Deployments** → **Functions** → **Runtime Logs**
2. Check Supabase logs: **Supabase Dashboard** → **Logs** → **API Logs**
3. Verify connection string with: `psql $DATABASE_URL -c "SELECT 1"`
