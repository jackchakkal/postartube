
import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mockSupabase';

const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Check not just for existence but also for length to avoid empty strings
const hasConfig = supabaseUrl && supabaseUrl.length > 5 && supabaseAnonKey && supabaseAnonKey.length > 5;

// Se tiver config real, usa o cliente real. Se não, usa o Mock (Offline Mode)
export const supabase = hasConfig 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : (mockSupabase as any);

export const isSupabaseConfigured = () => {
    // Retornamos true sempre agora, pois temos o Mock como fallback
    // Isso permite que a UI funcione imediatamente no Preview
    return true; 
}
