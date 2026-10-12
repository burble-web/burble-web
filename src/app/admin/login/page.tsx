'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Flower, Lock, Mail, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err: any) {
      setErrorMsg('Failed to log in. Please check your network connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#260B2A] flex items-center justify-center p-4 font-sans selection:bg-plum-800 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-plum-800/40">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-plum-50 text-plum-900 border border-plum-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Flower className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-plum-950">Burble Admin</h1>
          <p className="text-xs text-ink-500 mt-1">Authorized store operations & management portal</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-plum-950 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@burbleflowers.com"
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-plum-950 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-cream-50/50 border border-ink-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-plum-800/20 focus:border-plum-800 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-plum-900 hover:bg-plum-800 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Admin Portal</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-ink-500 mt-6 leading-relaxed">
          Admin accounts are created manually in Supabase Auth. Public registration is disabled.
        </p>

      </div>
    </div>
  );
}
