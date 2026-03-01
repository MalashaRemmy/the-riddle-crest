// ============================================
// SUPABASE CONFIGURATION & INITIALIZATION
// ============================================
// This module initializes the Supabase JS client (Auth + Database).
//
// SETUP INSTRUCTIONS:
// 1. Copy this file to `supabase-config.js`
// 2. Replace the placeholder values below with your Supabase credentials
// 3. See SUPABASE_SETUP.md for full setup guide
// ============================================

// ⚠️ REPLACE with your Supabase project credentials from:
// Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'YOUR_SUPABASE_URL';           // e.g. https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // e.g. eyJhbGciOiJIUz...

// Initialize Supabase client (singleton)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('[Supabase] Client initialized.');
