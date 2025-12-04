import { supabase } from './supabase';
import { DbProfile, DbSlot, DbUserConfig, Platform, VideoStatus } from '../types';

// ==================== TIPOS ====================
export interface DatabaseResult<T> {
    data: T | null;
    error: string | null;
}

// ==================== PROFILES ====================

export const profilesService = {
    async getAll(): Promise<DatabaseResult<DbProfile[]>> {
        console.log('[DB] Loading profiles...');
        try {
            const { data, error } = await supabase
                .from('p12_profiles')
                .select('*')
                .order('name');

            if (error) {
                console.error('[DB] Error loading profiles:', error);
                return { data: null, error: error.message };
            }

            console.log('[DB] Profiles loaded:', data?.length || 0);
            return { data: data || [], error: null };
        } catch (e: any) {
            console.error('[DB] Exception loading profiles:', e);
            return { data: null, error: e.message };
        }
    },

    async create(userId: string, name: string, platform: Platform): Promise<DatabaseResult<DbProfile>> {
        console.log('[DB] Creating profile:', { userId, name, platform });

        try {
            const { data, error } = await supabase
                .from('p12_profiles')
                .insert({
                    user_id: userId,
                    name: name,
                    platform: platform,
                    default_videos_per_day: 3,
                    default_start_time: '09:00',
                    default_end_time: '18:00'
                })
                .select()
                .single();

            if (error) {
                console.error('[DB] Error creating profile:', error);
                return { data: null, error: error.message };
            }

            console.log('[DB] Profile created:', data);
            return { data, error: null };
        } catch (e: any) {
            console.error('[DB] Exception creating profile:', e);
            return { data: null, error: e.message };
        }
    },

    async update(id: string, updates: Partial<DbProfile>): Promise<DatabaseResult<boolean>> {
        console.log('[DB] Updating profile:', { id, updates });

        try {
            const { error } = await supabase
                .from('p12_profiles')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.error('[DB] Error updating profile:', error);
                return { data: false, error: error.message };
            }

            console.log('[DB] Profile updated');
            return { data: true, error: null };
        } catch (e: any) {
            console.error('[DB] Exception updating profile:', e);
            return { data: false, error: e.message };
        }
    },

    async delete(id: string): Promise<DatabaseResult<boolean>> {
        console.log('[DB] Deleting profile:', id);

        try {
            const { error } = await supabase
                .from('p12_profiles')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('[DB] Error deleting profile:', error);
                return { data: false, error: error.message };
            }

            console.log('[DB] Profile deleted');
            return { data: true, error: null };
        } catch (e: any) {
            console.error('[DB] Exception deleting profile:', e);
            return { data: false, error: e.message };
        }
    }
};

// ==================== SLOTS ====================

export const slotsService = {
    async getByProfileAndDate(profileId: string, date: string): Promise<DatabaseResult<DbSlot[]>> {
        console.log('[DB] Loading slots:', { profileId, date });

        try {
            const { data, error } = await supabase
                .from('p12_slots')
                .select('*')
                .eq('profile_id', profileId)
                .eq('date', date)
                .order('time');

            if (error) {
                console.error('[DB] Error loading slots:', error);
                return { data: null, error: error.message };
            }

            console.log('[DB] Slots loaded:', data?.length || 0);
            return { data: data || [], error: null };
        } catch (e: any) {
            console.error('[DB] Exception loading slots:', e);
            return { data: null, error: e.message };
        }
    },

    async createMany(slots: Omit<DbSlot, 'id'>[]): Promise<DatabaseResult<boolean>> {
        console.log('[DB] Creating slots:', slots.length);

        try {
            const { error } = await supabase
                .from('p12_slots')
                .insert(slots);

            if (error) {
                console.error('[DB] Error creating slots:', error);
                return { data: false, error: error.message };
            }

            console.log('[DB] Slots created');
            return { data: true, error: null };
        } catch (e: any) {
            console.error('[DB] Exception creating slots:', e);
            return { data: false, error: e.message };
        }
    },

    async update(id: string, updates: Partial<DbSlot>): Promise<DatabaseResult<boolean>> {
        try {
            const { error } = await supabase
                .from('p12_slots')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.error('[DB] Error updating slot:', error);
                return { data: false, error: error.message };
            }

            return { data: true, error: null };
        } catch (e: any) {
            console.error('[DB] Exception updating slot:', e);
            return { data: false, error: e.message };
        }
    },

    async delete(id: string): Promise<DatabaseResult<boolean>> {
        try {
            const { error } = await supabase
                .from('p12_slots')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('[DB] Error deleting slot:', error);
                return { data: false, error: error.message };
            }

            return { data: true, error: null };
        } catch (e: any) {
            console.error('[DB] Exception deleting slot:', e);
            return { data: false, error: e.message };
        }
    },

    async deleteByProfileAndDate(profileId: string, date: string): Promise<DatabaseResult<boolean>> {
        console.log('[DB] Deleting slots for:', { profileId, date });

        try {
            const { error } = await supabase
                .from('p12_slots')
                .delete()
                .eq('profile_id', profileId)
                .eq('date', date);

            if (error) {
                console.error('[DB] Error deleting slots:', error);
                return { data: false, error: error.message };
            }

            console.log('[DB] Slots deleted');
            return { data: true, error: null };
        } catch (e: any) {
            console.error('[DB] Exception deleting slots:', e);
            return { data: false, error: e.message };
        }
    }
};

// ==================== USER CONFIG ====================

export const userConfigService = {
    async get(userId: string): Promise<DatabaseResult<DbUserConfig | null>> {
        try {
            const { data, error } = await supabase
                .from('p12_user_config')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                console.error('[DB] Error loading user config:', error);
                return { data: null, error: error.message };
            }

            return { data: data || null, error: null };
        } catch (e: any) {
            console.error('[DB] Exception loading user config:', e);
            return { data: null, error: e.message };
        }
    },

    async upsert(userId: string, config: Partial<DbUserConfig>): Promise<DatabaseResult<boolean>> {
        try {
            const { error } = await supabase
                .from('p12_user_config')
                .upsert({
                    user_id: userId,
                    ...config
                });

            if (error) {
                console.error('[DB] Error upserting user config:', error);
                return { data: false, error: error.message };
            }

            return { data: true, error: null };
        } catch (e: any) {
            console.error('[DB] Exception upserting user config:', e);
            return { data: false, error: e.message };
        }
    }
};

// ==================== DIAGNÓSTICO ====================

export const diagnosticService = {
    async runFullDiagnostic(userId?: string): Promise<void> {
        console.group('🔍 DIAGNÓSTICO COMPLETO DO SUPABASE');

        // 1. Teste de conexão básica
        console.log('1️⃣ Testando conexão básica...');
        const startPing = performance.now();
        try {
            const { error } = await supabase.from('p12_profiles').select('id').limit(1);
            const pingTime = (performance.now() - startPing).toFixed(0);
            if (error) {
                console.error(`❌ Conexão falhou (${pingTime}ms):`, error.message);
            } else {
                console.log(`✅ Conexão OK (${pingTime}ms)`);
            }
        } catch (e: any) {
            console.error('❌ Erro de rede:', e.message);
        }

        // 2. Verificar autenticação
        console.log('2️⃣ Verificando autenticação...');
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
            console.log('✅ Usuário autenticado:', sessionData.session.user.email);
            console.log('   User ID:', sessionData.session.user.id);

            // Verificar expiração do token
            const expiresAt = new Date((sessionData.session.expires_at || 0) * 1000);
            const now = new Date();
            if (expiresAt > now) {
                console.log('✅ Token válido até:', expiresAt.toLocaleString());
            } else {
                console.error('❌ Token EXPIRADO!');
            }
        } else {
            console.warn('⚠️ Nenhum usuário autenticado');
        }

        // 3. Testar operações se houver userId
        if (userId) {
            console.log('3️⃣ Testando operações CRUD...');

            // SELECT
            const selectStart = performance.now();
            const { data: selectData, error: selectError } = await supabase
                .from('p12_profiles')
                .select('id, name')
                .eq('user_id', userId);
            const selectTime = (performance.now() - selectStart).toFixed(0);

            if (selectError) {
                console.error(`❌ SELECT falhou (${selectTime}ms):`, selectError.message);
            } else {
                console.log(`✅ SELECT OK (${selectTime}ms) - ${selectData?.length || 0} registros`);
            }

            // INSERT (teste rápido)
            console.log('4️⃣ Testando INSERT...');
            const insertStart = performance.now();
            const testName = `_test_${Date.now()}`;

            const { data: insertData, error: insertError } = await supabase
                .from('p12_profiles')
                .insert({
                    user_id: userId,
                    name: testName,
                    platform: 'YOUTUBE',
                    default_videos_per_day: 1,
                    default_start_time: '09:00',
                    default_end_time: '18:00'
                })
                .select()
                .single();

            const insertTime = (performance.now() - insertStart).toFixed(0);

            if (insertError) {
                console.error(`❌ INSERT falhou (${insertTime}ms):`, insertError.message);
                console.error('   Código:', insertError.code);
                console.error('   Detalhes:', insertError.details);
                console.log('');
                console.log('%c⚠️ PROBLEMA DE RLS DETECTADO!', 'color: red; font-weight: bold; font-size: 16px');
                console.log('Execute este SQL no Supabase:');
                console.log(`
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view own profiles" ON p12_profiles;
DROP POLICY IF EXISTS "Users can insert own profiles" ON p12_profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON p12_profiles;
DROP POLICY IF EXISTS "Users can delete own profiles" ON p12_profiles;

-- Criar novas políticas
CREATE POLICY "profiles_select" ON p12_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert" ON p12_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON p12_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_delete" ON p12_profiles FOR DELETE USING (auth.uid() = user_id);
                `);
            } else {
                console.log(`✅ INSERT OK (${insertTime}ms)`);

                // Limpar registro de teste
                if (insertData?.id) {
                    await supabase.from('p12_profiles').delete().eq('id', insertData.id);
                    console.log('✅ Registro de teste removido');
                }
            }
        }

        console.log('');
        console.log('📋 Diagnóstico concluído!');
        console.groupEnd();
    }
};
