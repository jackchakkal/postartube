
import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Debug info
console.log("Initializing Supabase Client...");

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase environment variables are missing. Please check your Vercel settings.");
}

// Initialize the real client.
// We use fallback placeholders to prevent 'createClient' from throwing a synchronous error 
// which causes a white screen crash. Network requests will simply fail if these are used.
const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);

export const isSupabaseConfigured = () => {
    return !!supabaseUrl && !!supabaseAnonKey;
}
