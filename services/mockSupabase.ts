
// Simula o comportamento do Supabase usando LocalStorage
// Para permitir testes no Preview sem backend configurado

const STORAGE_KEYS = {
  PROFILES: 'p12_profiles',
  SLOTS: 'p12_slots',
  CONFIG: 'p12_user_config',
  SESSION: 'p12_session'
};

const getLocal = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

const mockUser = {
  id: 'mock-user-id',
  email: 'demo@postartube.com'
};

export const mockSupabase = {
  auth: {
    getSession: async () => {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      return { data: { session: session ? JSON.parse(session) : null }, error: null };
    },
    signUp: async ({ email, password }: any) => {
      const session = { user: mockUser, access_token: 'mock-token' };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      return { data: { user: mockUser, session }, error: null };
    },
    signInWithPassword: async ({ email, password }: any) => {
      const session = { user: mockUser, access_token: 'mock-token' };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      return { data: { user: mockUser, session }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      // Mock subscription
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: (table: string) => {
    return {
      select: (columns: string) => {
        const chain = {
          data: getLocal(table),
          filters: [] as any[],
          eq: function(col: string, val: any) {
            this.filters.push((item: any) => item[col] === val);
            return this;
          },
          order: function(col: string, { ascending }: any) {
             // Simple sort mock
             return this;
          },
          single: async function() {
            let res = this.data;
            for(const f of this.filters) res = res.filter(f);
            return { data: res[0] || null, error: null };
          },
          then: function(resolve: any) {
            let res = this.data;
            for(const f of this.filters) res = res.filter(f);
            resolve({ data: res, error: null });
          }
        };
        return chain;
      },
      insert: async (rowOrRows: any) => {
        const rows = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
        const current = getLocal(table);
        const newRows = rows.map((r: any) => ({ ...r, id: crypto.randomUUID() }));
        setLocal(table, [...current, ...newRows]);
        // Return data format mimicking supabase
        return { data: Array.isArray(rowOrRows) ? newRows : newRows[0], error: null };
      },
      update: (updates: any) => {
        return {
          eq: async (col: string, val: any) => {
            const current = getLocal(table);
            const updated = current.map((item: any) => item[col] === val ? { ...item, ...updates } : item);
            setLocal(table, updated);
            return { data: updated, error: null };
          }
        }
      },
      upsert: async (row: any) => {
         const current = getLocal(table);
         // Simple mock upsert based on user_id for config
         const existingIdx = current.findIndex((i: any) => i.user_id === row.user_id);
         if (existingIdx >= 0) {
            current[existingIdx] = { ...current[existingIdx], ...row };
         } else {
            current.push(row);
         }
         setLocal(table, current);
         return { data: row, error: null };
      },
      delete: () => {
        return {
          eq: (col1: string, val1: any) => {
             // Support chaining for double eq used in clearSchedule
             return {
                eq: async (col2: string, val2: any) => {
                    const current = getLocal(table);
                    const filtered = current.filter((item: any) => !(item[col1] === val1 && item[col2] === val2));
                    setLocal(table, filtered);
                    return { error: null };
                },
                then: async (resolve: any) => {
                    // Single eq execution
                    const current = getLocal(table);
                    const filtered = current.filter((item: any) => item[col1] !== val1);
                    setLocal(table, filtered);
                    resolve({ error: null });
                }
             }
          }
        }
      }
    };
  }
};
