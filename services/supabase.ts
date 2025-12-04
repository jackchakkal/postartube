
import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
const env = (import.meta as any).env || {};

// Use environment variables if available, otherwise use the provided credentials
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://yiaotyyjimxthhzfeelw.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYW90eXlqaW14dGhoemZlZWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODM0NjksImV4cCI6MjA2NDc1OTQ2OX0.gohKsFBKL2vBcTNGt3RbD1v_3WyUbyg36zqUj1zd8q8';

// Debug info
console.log("Initializing Supabase Client...");

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Supabase credentials missing.");
}

// Initialize the real client with the provided credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
    return !!supabaseUrl && !!supabaseAnonKey;
}
