
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Mail, Lock, LogIn, UserPlus, AlertTriangle } from 'lucide-react';

export const Auth: React.FC<{ t: any }> = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!isSupabaseConfigured()) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-yellow-200">
                <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Supabase Missing</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
                    Please create a <code>.env</code> file or configure Vercel Environment Variables:
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-left text-xs font-mono text-slate-600 dark:text-slate-300 mb-4 overflow-x-auto">
                    VITE_SUPABASE_URL=...<br/>
                    VITE_SUPABASE_ANON_KEY=...
                </div>
            </div>
        </div>
    )
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      if (mode === 'SIGNUP') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            // Se o usuário já existe no banco compartilhado, sugerimos o login
            if (error.message.includes("already registered")) {
                setError("Este email já possui conta. Tente fazer Login.");
                setMode('LOGIN');
            } else {
                throw error;
            }
        } else {
            setInfo('Conta criada! Verifique seu email ou faça login se a confirmação não for necessária.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">PostarTube</h1>
            <p className="text-slate-500 dark:text-slate-400">
                {mode === 'LOGIN' ? 'Login' : 'Criar Nova Conta'}
            </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                        placeholder="you@example.com"
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
            {info && <div className="text-emerald-600 text-sm text-center bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">{info}</div>}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
                {loading ? 'Processando...' : mode === 'LOGIN' ? <><LogIn size={18}/> Entrar</> : <><UserPlus size={18}/> Cadastrar</>}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => { setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); setError(''); setInfo(''); }}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
                {mode === 'LOGIN' ? "Não tem conta? Cadastrar" : "Já tem conta? Entrar"}
            </button>
        </div>
      </div>
    </div>
  );
};
