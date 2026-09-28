'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type UserRole = 'member' | 'artisan' | 'founder' | 'admin';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockUser, setIsMockUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('member');

  // Auto-sync & fetch profile from Supabase
  async function syncAndFetchProfile(authUser: User) {
    if (!supabase) return;
    try {
      // 1. Check if profile already exists in public.profiles
      const { data: existingProfile, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (existingProfile && !fetchErr) {
        const role = (existingProfile.role as UserRole) || 'member';
        setUserRole(role);
        setIsAdmin(role === 'admin');
        return;
      }

      // 2. If profile is missing in public.profiles, auto-insert/upsert it!
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
          role: 'member',
        }, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (inserted && !insertErr) {
        const role = (inserted.role as UserRole) || 'member';
        setUserRole(role);
        setIsAdmin(role === 'admin');
      } else {
        setUserRole('member');
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

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
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
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsMockUser(false);
    setIsAdmin(false);
    setUserRole('member');
  };

  // Guest / Demo login for seamless development
  const signInAsGuest = () => {
    const mockGuestUser = {
      id: 'usr-artisan-01',
      app_metadata: {},
      user_metadata: {
        full_name: 'Raihan Putra',
        avatar_url: '/assets/avatar_user.png',
        email: 'raihan@sakala.cc',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'raihan@sakala.cc',
    } as unknown as User;

    setUser(mockGuestUser);
    setIsMockUser(true);
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
