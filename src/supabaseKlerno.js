import { createClient } from '@supabase/supabase-js';

// =========================================================================
//  SUPABASE CONFIGURATION SETUP
// =========================================================================
//  Replace the placeholder values below with your actual Supabase URL and 
//  Anon/Public API key. You can find these in your Supabase Dashboard under:
//  Project Settings -> API
// =========================================================================

// --- [PASTE YOUR SUPABASE URL HERE] ---
const SUPABASE_URL = "https://auokctzchcdjzbrumjfz.supabase.co";

// --- [PASTE YOUR PUBLIC ANON KEY HERE] ---
const SUPABASE_PUBLIC_KEY = "sb_publishable_SB9edvSRQORqyVpClD3JLw_ooePt7f-";

// Initialize and export the Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
