'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, Power, X, Check } from 'lucide-react';
import { useInlineCMS } from '@/context/InlineCMSContext';
import { useAuth } from '@/context/AuthContext';

export default function InlineCMSToolbar() {
  const { isAdmin } = useAuth();
  const { isEditMode, toggleEditMode, toast } = useInlineCMS();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (!isAdmin && !isDev) return null;

  return (
    <>
      {/* Floating CMS Toggle Button */}
      <button
        onClick={toggleEditMode}
        className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 btn-tactile group ${
          isEditMode
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-[#070F18] hover:bg-[#0047AB] text-white'
        }`}
        title={isEditMode ? 'Exit Edit Mode' : 'Enter CMS Edit Mode'}
      >
        {isEditMode ? (
          <>
            <X className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase hidden sm:inline">
              EXIT EDIT MODE
            </span>
          </>
        ) : (
          <>
            <Pencil className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase hidden sm:inline">
              EDIT PAGE
            </span>
          </>
        )}
      </button>

      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="fixed top-0 left-0 right-0 z-[55] bg-gradient-to-r from-[#C5AA00] via-[#D4B800] to-[#C5AA00] text-black py-1.5 px-4 flex items-center justify-center gap-3 animate-fade-in shadow-lg">
          <Power className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
            CMS EDIT MODE ACTIVE — KLIK PADA ITEM UNTUK MENGEDIT
          </span>
          <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-20 right-6 z-[70] flex items-center gap-2 px-5 py-3 rounded-md shadow-2xl animate-fade-in-up transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </>
  );
}
