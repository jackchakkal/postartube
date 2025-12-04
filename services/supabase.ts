
import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

// Debug info (safe to leave in console to verify connection attempt)
console.log("Initializing Supabase Client...");

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase environment variables are missing.");
}

// Initialize the real client unconditionally. 
// If vars are missing, Supabase will throw a clear error, which is better for debugging production.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
    return !!supabaseUrl && !!supabaseAnonKey;
}
