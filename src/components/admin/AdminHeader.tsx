'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Shield } from 'lucide-react';
import Image from 'next/image';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const { user, signOut, userRole } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E5E2D9] px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Page Title */}
        <div>
          <h1 className="font-serif-editorial text-xl font-bold text-[#070F18] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-[#64748B] mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-4">
          {actions}

          {/* Admin badge + profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-[#E5E2D9]">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#070F18]">
                {user?.user_metadata?.full_name || 'Admin'}
              </p>
              <p className="text-[9px] text-[#C5AA00] font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                <Shield className="w-3 h-3" />
                {userRole.toUpperCase()}
              </p>
            </div>

            {user?.user_metadata?.avatar_url && (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5AA00]/50 flex-shrink-0">
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Admin"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="text-[#94A3B8] hover:text-red-500 transition-colors p-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
