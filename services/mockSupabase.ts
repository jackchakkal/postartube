
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

// Store listeners to notify App when auth state changes
const authListeners: Function[] = [];

const notifyListeners = (event: string, session: any) => {
    authListeners.forEach(callback => callback(event, session));
};

// Classe robusta para construir queries simuladas
class MockQueryBuilder {
  table: string;
  filters: { col: string; val: any }[] = [];
  op: 'select' | 'update' | 'delete' | 'insert' | 'upsert' | null = null;
  payload: any = null;
  orderConf: any = null;
  isSingle: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns = '*') {
    this.op = 'select';
    return this;
  }

  insert(data: any) {
    this.op = 'insert';
    this.payload = data;
    return this;
  }

  upsert(data: any) {
    this.op = 'upsert';
    this.payload = data;
    return this;
  }

  update(data: any) {
    this.op = 'update';
    this.payload = data;
    return this;
  }

  delete() {
    this.op = 'delete';
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push({ col, val });
    return this;
  }

  order(col: string, config: any) {
    this.orderConf = { col, ...config };
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  // Permite o uso de 'await' diretamente no builder
  then(resolve: any, reject: any) {
    const db = getLocal(this.table);
    let result: any = { data: null, error: null };

    try {
      // --- INSERT ---
      if (this.op === 'insert') {
        const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
        const newRows = rows.map((r: any) => ({ ...r, id: r.id || crypto.randomUUID() }));
        setLocal(this.table, [...db, ...newRows]);
        result.data = Array.isArray(this.payload) ? newRows : newRows[0];
      }
      // --- UPSERT ---
      else if (this.op === 'upsert') {
         let current = [...db];
         const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
         const resultRows = [];
         
         for (const row of rows) {
            // Tenta encontrar registro existente por ID ou USER_ID
            const matchIdx = current.findIndex((item: any) => 
                (row.id && item.id === row.id) || (row.user_id && item.user_id === row.user_id)
            );
            
            if (matchIdx >= 0) {
                current[matchIdx] = { ...current[matchIdx], ...row };
                resultRows.push(current[matchIdx]);
            } else {
                const newRow = { ...row, id: row.id || crypto.randomUUID() };
                current.push(newRow);
                resultRows.push(newRow);
            }
         }
         setLocal(this.table, current);
         result.data = Array.isArray(this.payload) ? resultRows : resultRows[0];
      }
      // --- SELECT / UPDATE / DELETE ---
      else {
        // 1. Identificar quais índices correspondem aos filtros
        let targetIndices: number[] = [];
        
        // Se não houver filtros, target são todos (CUIDADO, mas é o comportamento SQL)
        if (this.filters.length === 0 && (this.op === 'update' || this.op === 'delete')) {
            targetIndices = db.map((_: any, i: number) => i);
        } else {
            // Começa com todos
            let candidates = db.map((_: any, i: number) => i);
            
            // Aplica cada filtro progressivamente
            for (const f of this.filters) {
                candidates = candidates.filter((i: number) => {
                    const itemVal = db[i][f.col];
                    // Comparação "solta" (==) para evitar problemas entre string/number no JSON
                    // Ex: '5' == 5 é true.
                    return itemVal == f.val;
                });
            }
            targetIndices = candidates;
        }

        if (this.op === 'select') {
            let rows = targetIndices.map((i: number) => db[i]);
            
            // Ordenação básica
            if (this.orderConf) {
                rows.sort((a: any, b: any) => {
                    const valA = a[this.orderConf.col];
                    const valB = b[this.orderConf.col];
                    if (valA < valB) return -1;
                    if (valA > valB) return 1;
                    return 0;
                });
            }

            if (this.isSingle) {
                result.data = rows[0] || null;
            } else {
                result.data = rows;
            }
        }
        else if (this.op === 'update') {
            const newDb = [...db];
            targetIndices.forEach((i: number) => {
                newDb[i] = { ...newDb[i], ...this.payload };
            });
            setLocal(this.table, newDb);
            result.data = targetIndices.map((i: number) => newDb[i]);
        }
        else if (this.op === 'delete') {
            // Mantém apenas os índices que NÃO estão no targetIndices
            const newDb = db.filter((_: any, i: number) => !targetIndices.includes(i));
            setLocal(this.table, newDb);
            // Delete deve retornar null data geralmente, ou os deletados se select() for chamado (não impl aqui)
            result.data = null; 
        }
      }
    } catch (e: any) {
        console.error("Mock DB Error:", e);
        result.error = { message: e.message };
    }

    resolve(result);
  }
}

export const mockSupabase = {
  auth: {
    getSession: async () => {
      const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
      return { data: { session }, error: null };
    },
    signUp: async ({ email, password }: any) => {
      const session = { user: mockUser, access_token: 'mock-token' };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      notifyListeners('SIGNED_IN', session);
      return { data: { user: mockUser, session }, error: null };
    },
    signInWithPassword: async ({ email, password }: any) => {
      const session = { user: mockUser, access_token: 'mock-token' };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      notifyListeners('SIGNED_IN', session);
      return { data: { user: mockUser, session }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      notifyListeners('SIGNED_OUT', null);
      return { error: null };
    },
    onAuthStateChange: (callback: Function) => {
      authListeners.push(callback);
      return { data: { subscription: { unsubscribe: () => {
          const idx = authListeners.indexOf(callback);
          if (idx > -1) authListeners.splice(idx, 1);
      } } } };
    }
  },
  from: (table: string) => {
    return new MockQueryBuilder(table);
  }
};
