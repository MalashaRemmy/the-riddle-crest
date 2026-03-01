// ============================================
// SUPABASE CONFIGURATION & INITIALIZATION
// ============================================
// This module initializes the Supabase JS client (Auth + Database).
//
// SETUP INSTRUCTIONS:
// 1. Create a Supabase project at https://supabase.com/dashboard
// 2. Go to Project Settings → API to find your URL and anon key
// 3. Replace the placeholder values below
// 4. Run the SQL migration in SUPABASE_SETUP.md to create the tables
// 5. Row Level Security (RLS) is enforced — see SUPABASE_SETUP.md
// ============================================

// ⚠️ REPLACE with your Supabase project credentials from:
// Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://jznmipyhbzzhvlfiqetl.supabase.co'; // e.g. https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bm1pcHloYnp6aHZsZmlxZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDI5OTcsImV4cCI6MjA4Nzc3ODk5N30.gSJrjKeMncTeWYeRxHD2QutZifWvGcOrgBEQTSrXo8c'; // e.g. eyJhbGciOiJIUz...

// Initialize Supabase client (singleton)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('[Supabase] Client initialized.');
