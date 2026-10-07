'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'member' | 'artisan' | 'founder' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isMockUser: boolean;
  signInAsGuest: () => void;
  isAdmin: boolean;
  userRole: UserRole;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isMockUser: false,
  signInAsGuest: () => {},
  isAdmin: false,
  userRole: 'member',
});

function syncAuthCookie(token?: string | null) {
  if (typeof document === 'undefined') return;
  if (token) {
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    document.cookie = `sb-access-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; ${isHttps ? 'Secure;' : ''}`;
  } else {
    document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockUser, setIsMockUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('member');

  // Fetch profile strictly from trusted database source (public.profiles)
  async function syncAndFetchProfile(authUser: User) {
    if (!supabase) {
      setUserRole('member');
      setIsAdmin(false);
      return;
    }

    try {
      // 1. Fetch authorized role from public.profiles
      const { data: existingProfile, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (existingProfile && !fetchErr) {
        const role = (existingProfile.role as UserRole) || 'member';
        setUserRole(role);
        setIsAdmin(role === 'admin' || role === 'artisan' || role === 'founder');
        return;
      }

      // 2. If profile is missing, initialize as standard 'member' (never admin)
      const initialRole: UserRole = 'member';
      const fullName = 
        authUser.user_metadata?.full_name || 
        authUser.user_metadata?.name || 
        authUser.email?.split('@')[0] || 
        'Member';
      const avatarUrl = 
        authUser.user_metadata?.avatar_url || 
        authUser.user_metadata?.picture || 
        '/assets/avatar_user.png';

      const { data: inserted, error: insertErr } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          full_name: fullName,
          email: authUser.email,
          avatar_url: avatarUrl,
          role: initialRole,
        }, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (inserted && !insertErr) {
        const role = (inserted.role as UserRole) || initialRole;
        setUserRole(role);
        setIsAdmin(role === 'admin' || role === 'artisan' || role === 'founder');
      } else {
        setUserRole(initialRole);
        setIsAdmin(false);
      }
    } catch (err) {
      console.warn('Profile sync fallback:', err);
      setUserRole('member');
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    // 1. Check active Supabase session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        syncAuthCookie(session?.access_token ?? null);
        if (session?.user) {
          syncAndFetchProfile(session.user);
        }
        setLoading(false);
      });

      // 2. Listen for auth state changes (sign in, sign out, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          syncAuthCookie(session?.access_token ?? null);
          setIsMockUser(false);
          if (session?.user) {
            syncAndFetchProfile(session.user);
          } else {
            setIsAdmin(false);
            setUserRole('member');
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // Google OAuth via Supabase
  const signInWithGoogle = async () => {
    if (!supabase) {
      console.warn('Supabase is not configured');
      return;
    }

    const customSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
    const origin = customSiteUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    const redirectUrl = `${origin}/auth/callback`;

    console.log('[Auth] Initiating Google OAuth with redirectTo:', redirectUrl);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setUser(null);
    setSession(null);
    syncAuthCookie(null);
    setIsMockUser(false);
    setIsAdmin(false);
    setUserRole('member');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // Guest / Demo login for previewing member account (strictly member role, no admin privilege)
  const signInAsGuest = () => {
    const mockGuestUser = {
      id: 'usr-guest-01',
      app_metadata: {},
      user_metadata: {
        full_name: 'Tamu Sakala',
        avatar_url: '',
        email: 'tamu@sakala.cc',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'tamu@sakala.cc',
    } as unknown as User;

    setUser(mockGuestUser);
    setIsMockUser(true);
    setUserRole('member');
    setIsAdmin(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signOut,
        isMockUser,
        signInAsGuest,
        isAdmin,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
