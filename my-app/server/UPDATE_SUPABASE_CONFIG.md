# How to Update Supabase Configuration

## Current Issue
Your Supabase project URL `https://ypgnvwemsibsmydcqkon.supabase.co` does not exist or was deleted.

## Solution: Create a New Supabase Project

### Step 1: Create New Project
1. Go to https://supabase.com/dashboard
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - Project Name: VitalX (or any name)
   - Database Password: (create a strong password)
   - Region: Choose closest to you
5. Wait for project to be created (takes 1-2 minutes)

### Step 2: Get Your Credentials
1. In your project dashboard, go to "Settings" → "API"
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (different long string)

### Step 3: Create Users Table
1. Go to "SQL Editor" in your Supabase dashboard
2. Run this SQL:

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service_role to do everything
CREATE POLICY "Service role can do everything" ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### Step 4: Update Your Code

**File 1: `my-app/src/supabaseClient.js`**
```javascript
const supabaseUrl = 'YOUR_NEW_PROJECT_URL';
const supabaseKey = 'YOUR_NEW_ANON_KEY';
```

**File 2: `my-app/server/server.js`**
Find this line and update:
```javascript
const supabase = createClient(
  "YOUR_NEW_PROJECT_URL",
  "YOUR_NEW_SERVICE_ROLE_KEY",
  // ... rest of config
);
```

### Step 5: Restart Server
```cmd
cd my-app\server
npm start
```

## Current Workaround
Your server is currently using **local file storage** (`users.json`) as a fallback.
This means your app works right now without Supabase!

Users are stored in: `my-app/server/users.json`

Once you update the Supabase credentials, the server will automatically switch back to using Supabase.
