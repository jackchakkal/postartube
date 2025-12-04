
import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mockSupabase';

const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Strict check: must be a string and longer than a minimal placeholder
const hasConfig = 
    typeof supabaseUrl === 'string' && 
    supabaseUrl.length > 10 && 
    typeof supabaseAnonKey === 'string' && 
    supabaseAnonKey.length > 10;

console.log("Supabase Client Init:", hasConfig ? "REAL MODE" : "MOCK MODE");
if (!hasConfig) {
    console.warn("Supabase config missing or invalid. Falling back to offline mock.");
    console.debug("URL:", supabaseUrl, "KEY:", supabaseAnonKey ? "******" : "Missing");
}

// Se tiver config real, usa o cliente real. Se não, usa o Mock (Offline Mode)
export const supabase = hasConfig 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : (mockSupabase as any);

export const isSupabaseConfigured = () => {
    return true; 
}
