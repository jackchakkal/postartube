import { createClient } from '@supabase/supabase-js';

// Tenta pegar das variáveis de ambiente ou usa strings vazias para evitar erro de inicialização
// (O usuário será avisado na tela de login se faltar configuração)
const env = (import.meta as any).env || {};

// CRITICAL FIX: createClient throws an error if URL is empty string. 
// We provide a placeholder URL so the app can initialize, and then we check 
// isSupabaseConfigured() to block the UI if keys are missing.
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
    // Only return true if we have the REAL env vars, not the placeholders
    const url = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY;
    return url && url.length > 0 && key && key.length > 0;
}