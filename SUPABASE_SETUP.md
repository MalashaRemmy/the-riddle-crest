# Supabase Setup Guide — Riddle Crest Pro

## 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **New Project** and follow the wizard
3. Note your **Project URL** and **anon (public) key** from **Settings → API**

## 2. Update `supabase-config.js`

Open `supabase-config.js` and replace the placeholder values:

```js
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUz...your-anon-key';
```

## 3. Enable Authentication

In the Supabase Dashboard:

1. Go to **Authentication → Providers**
2. Ensure **Email** is enabled (it is by default)
3. Optionally toggle **Confirm email** on/off under **Authentication → Settings**
   - If ON: users must click a confirmation link before they can log in
   - If OFF: users can log in immediately after signup

## 4. Create Database Tables

Go to **SQL Editor** in the Supabase Dashboard and run the following migration:

```sql
-- =============================================
-- USERS TABLE (optional profile data)
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- GAME PROGRESS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.game_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on both tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;

-- Users table: users can only read/write their own row
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Game progress table: users can only read/write their own row
CREATE POLICY "Users can view own progress"
    ON public.game_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON public.game_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.game_progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
    ON public.game_progress FOR DELETE
    USING (auth.uid() = user_id);
```

## 5. Data Structure

### `users` table
| Column     | Type        | Description                    |
|------------|-------------|--------------------------------|
| id         | UUID (PK)   | Matches `auth.users.id`        |
| email      | TEXT        | User's email address           |
| phone      | TEXT        | Optional phone number          |
| is_guest   | BOOLEAN     | Always `false` for real users  |
| created_at | TIMESTAMPTZ | Account creation timestamp     |

### `game_progress` table
| Column     | Type        | Description                         |
|------------|-------------|-------------------------------------|
| id         | UUID (PK)   | Auto-generated row ID               |
| user_id    | UUID (UQ)   | References `auth.users.id`          |
| data       | JSONB       | Game state (rounds, scores, etc.)   |
| updated_at | TIMESTAMPTZ | Last save timestamp                 |

### `data` JSONB structure
```json
{
    "currentRound": 1,
    "roundReplays": { "1": 0, "2": 0 },
    "overallProgress": {
        "totalRoundsCompleted": 0,
        "totalCorrect": 0,
        "totalQuestions": 0,
        "totalHintsUsed": 0,
        "roundScores": {},
        "bestScore": 0,
        "totalPlayTime": 0,
        "lastPlayed": null
    },
    "session": {
        "isGuest": false,
        "email": "user@example.com",
        "isLoggedIn": true
    }
}
```

## 6. How It Works

| Action | What Happens |
|--------|-------------|
| **Sign Up** | Creates Supabase Auth account + `users` profile row. Sends confirmation email if enabled. |
| **Log In** | Authenticates via Supabase Auth. Loads progress from `game_progress` table. |
| **Guest Play** | Local-only session (no server account). Progress saved in `localStorage` only. |
| **Guest → Account** | Creates a real Supabase account. Migrates `localStorage` data to `game_progress` table. |
| **Logout** | Signs out of Supabase Auth. `onAuthStateChange` navigates to login screen. |
| **Save Progress** | Upserts to `game_progress` table + `localStorage` mirror (fire-and-forget). |
| **Load Progress** | Reads from Supabase first, falls back to `localStorage` if offline. |

## 7. Offline Support

- Every save mirrors data to `localStorage` for instant offline reads
- If Supabase is unreachable, the app falls back to `localStorage` seamlessly
- Guest players use `localStorage` exclusively until they convert to an account

## 8. Files Overview

| File | Purpose |
|------|---------|
| `supabase-config.js` | Supabase client initialization |
| `auth.js` | All authentication operations (`RCAuth` global) |
| `db.js` | Database read/write for game progress (`RCDatabase` global) |
| `script.js` | Main app — integrates auth/db via `onAuthStateChange` |

## 9. Key Differences from Firebase

| Feature | Firebase | Supabase |
|---------|----------|----------|
| Anonymous auth | Built-in `signInAnonymously()` | Not available — guest play is local-only |
| Data store | Firestore (NoSQL documents) | PostgreSQL (relational + JSONB) |
| Security rules | `firestore.rules` file | Row Level Security (SQL policies) |
| Offline persistence | Built-in Firestore offline | `localStorage` mirror managed by app |
| SDK | Firebase compat (3 scripts) | Single `@supabase/supabase-js` UMD bundle |
| Billing | Required for production | Free tier with generous limits |

## 10. Integration Examples

### How auth connects with the game flow (`script.js`)

```js
// 1. On app load, register the auth state listener (called once in initializeApp)
RCAuth.onAuthStateChanged(async (user) => {
    syncSessionFromUser(user);       // populate GameState.session
    await GameState.loadFromStorage(); // loads from Supabase (or localStorage for guests)

    if (user) {
        Renderer.showScreen('intro');
        Renderer.updateIntroScreen();
    } else {
        Renderer.showScreen('login');
    }
});

// 2. Signup button handler
const result = await RCAuth.signUp(email, password, phone);
if (result.success) {
    // onAuthStateChanged fires automatically → navigates to intro
}

// 3. Login button handler
const result = await RCAuth.logIn(email, password);
if (result.success) {
    // onAuthStateChanged fires automatically → loads progress → shows intro
}

// 4. Guest play button handler
const result = await RCAuth.guestLogin();
if (result.success) {
    // callback fires immediately → guest session active, localStorage only
}

// 5. Saving progress (called after each answer, round complete, etc.)
GameState.saveToStorage();
// Internally calls: RCDatabase.save(data)
//   → If guest: saves to localStorage only
//   → If logged in: upserts to Supabase game_progress table + localStorage mirror

// 6. Loading progress (called on auth state change)
const data = await RCDatabase.load();
//   → If guest: reads from localStorage
//   → If logged in: reads from Supabase, falls back to localStorage if offline

// 7. Logout
const result = await RCAuth.logOut();
// onAuthStateChanged fires → clears session → shows login screen

// 8. Guest → Account conversion
const result = await RCAuth.convertGuestToAccount(email, password, phone);
// Creates real Supabase account, migrates localStorage data to DB
```

### Multiple sessions per user

Supabase Auth uses JWT tokens stored in `localStorage`. When a user logs in on a new device/browser, they get a new session. The `game_progress` table is keyed by `user_id` (not session), so all sessions for the same user read/write the same row. The last write wins — progress is always the most recent save from any device.

## 11. Deploying the Frontend

This is a **static site** (HTML + CSS + JS with no build step). Supabase handles all backend/auth via its JS SDK. Deploy the frontend to any static hosting service:

---

### Option A: Netlify (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Connect your Git repo
4. Set these build settings:
   - **Build command:** *(leave blank — no build step)*
   - **Publish directory:** `.` *(root of the repo)*
5. Click **Deploy site**

Or use the CLI:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

---

### Option B: Vercel

1. Push your code to a Git repository
2. Go to [Vercel](https://vercel.com) → **New Project** → Import your repo
3. Set Framework Preset to **Other**
4. Set **Output Directory** to `.`
5. Click **Deploy**

Or use the CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

### Option C: Firebase Hosting (static only — no Firebase services used)

If you already have the Firebase CLI configured:
```bash
# Create a minimal firebase.json
echo '{"hosting":{"public":".","ignore":["node_modules","SUPABASE_SETUP.md","*.json","!manifest.json"]}}' > firebase.json

firebase deploy --only hosting
```

This only uses Firebase as a CDN — all auth and database calls go to Supabase.

---

### Option D: GitHub Pages

1. Push to GitHub
2. Go to **Settings → Pages**
3. Set **Source** to **Deploy from a branch** → select `main` → root `/`
4. Your site will be at `https://username.github.io/repo-name/`

---

### After Deploying

1. In **Supabase Dashboard → Authentication → URL Configuration**, add your deployed URL to:
   - **Site URL** (e.g. `https://riddle-crest.netlify.app`)
   - **Redirect URLs** (same URL — needed for email confirmation links)
2. Test signup, login, guest play, and progress persistence end-to-end
