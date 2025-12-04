import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = 'https://yiaotyyjimxthhzfeelw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYW90eXlqaW14dGhoemZlZWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODM0NjksImV4cCI6MjA2NDc1OTQ2OX0.gohKsFBKL2vBcTNGt3RbD1v_3WyUbyg36zqUj1zd8q8';

console.log('Initializing Supabase Client...');
console.log('Supabase URL configured:', !!SUPABASE_URL);
console.log('Supabase Key configured:', !!SUPABASE_ANON_KEY);

// Criar cliente com configuração explícita
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {
            'X-Client-Info': 'postartube-web'
        }
    }
});

// Verificar se está configurado
export const isSupabaseConfigured = (): boolean => {
    return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
};
