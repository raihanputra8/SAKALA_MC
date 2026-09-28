'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState('Memverifikasi akun Google...');

  useEffect(() => {
    async function handleAuth() {
      if (!supabase) {
        router.push('/login');
        return;
      }

      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleSessionSync = async (sessionUser: any) => {
          if (!sessionUser || !supabase) return;
          try {
            const fullName = 
              sessionUser.user_metadata?.full_name || 
              sessionUser.user_metadata?.name || 
              sessionUser.email?.split('@')[0] || 
              'Member';
            const avatarUrl = 
              sessionUser.user_metadata?.avatar_url || 
              sessionUser.user_metadata?.picture || 
              '/assets/avatar_user.png';

            await supabase.from('profiles').upsert({
              id: sessionUser.id,
              full_name: fullName,
              email: sessionUser.email,
              avatar_url: avatarUrl,
              role: 'member',
            }, { onConflict: 'id' });
          } catch (syncErr) {
            console.warn('Profile sync in callback notice:', syncErr);
          }
        };

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Code exchange error:', error.message);
            setStatusMessage(`Authentication error: ${error.message}`);
            setTimeout(() => router.push('/login?error=code_exchange_failed'), 2000);
            return;
          }
          if (data.session) {
            await handleSessionSync(data.session.user);
            setStatusMessage('Autentikasi berhasil. Mengalihkan ke akun...');
            setTimeout(() => router.push('/account'), 600);
            return;
          }
        }

        // Fallback: check session directly
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth verification error:', error.message);
          setStatusMessage(`Authentication error: ${error.message}`);
          setTimeout(() => router.push('/login?error=auth_failed'), 2000);
          return;
        }

        if (session) {
          await handleSessionSync(session.user);
          setStatusMessage('Identity verified. Entering the Circle...');
          setTimeout(() => router.push('/account'), 600);
        } else {
          router.push('/account');
        }
      } catch (err) {
        console.error('Unexpected auth callback error:', err);
        router.push('/account');
      }
    }

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#070F18] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-16 h-16 rounded-full border border-[#C5AA00]/40 flex items-center justify-center mb-6 bg-[#0D1926] shadow-xl">
        <Loader2 className="w-8 h-8 text-[#C5AA00] animate-spin" />
      </div>

      <span className="text-[10px] font-bold tracking-[0.28em] text-[#C5AA00] uppercase mb-2 block">
        AUTENTIKASI SAKALA MOTORCYCLE CLUB
      </span>

      <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold tracking-wide text-white mb-4">
        MEMVERIFIKASI AKSES ANGGOTA
      </h1>

      <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md font-light leading-relaxed">
        {statusMessage}
      </p>
    </div>
  );
}
