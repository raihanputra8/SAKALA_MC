'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { updateSiteContent } from '@/lib/supabase/admin';

export type EditingItem = {
  type: 'bike' | 'product' | 'journal' | 'content';
  id: string;
  data: Record<string, unknown>;
} | null;

interface InlineCMSContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  editingItem: EditingItem;
  setEditingItem: (item: EditingItem) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  siteContent: Record<string, Record<string, any>>;
  getContent: (key: string, fallback: Record<string, any>) => Record<string, any>;
  saveContent: (key: string, data: Record<string, any>) => Promise<void>;
}

const InlineCMSContext = createContext<InlineCMSContextType>({
  isEditMode: false,
  toggleEditMode: () => {},
  editingItem: null,
  setEditingItem: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
  showToast: () => {},
  toast: null,
  siteContent: {},
  getContent: (_key, fallback) => fallback,
  saveContent: async () => {},
});

export function InlineCMSProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [siteContent, setSiteContent] = useState<Record<string, Record<string, any>>>({});

  // Load saved content overrides from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sakala_site_content');
      if (stored) {
        setSiteContent(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error reading stored site content:', e);
    }
  }, []);

  const getContent = useCallback((key: string, fallback: Record<string, any>) => {
    return siteContent[key] ? { ...fallback, ...siteContent[key] } : fallback;
  }, [siteContent]);

  const saveContent = useCallback(async (key: string, data: Record<string, any>) => {
    setSiteContent((prev) => {
      const updated = { ...prev, [key]: { ...(prev[key] || {}), ...data } };
      try {
        localStorage.setItem('sakala_site_content', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      return updated;
    });

    // Also attempt remote Supabase update
    try {
      const serialized = JSON.stringify(data);
      await updateSiteContent(key, serialized);
    } catch {
      // Ignored if table doesn't have the key or client is offline
    }
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
    setEditingItem(null);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <InlineCMSContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        editingItem,
        setEditingItem,
        refreshKey,
        triggerRefresh,
        showToast,
        toast,
        siteContent,
        getContent,
        saveContent,
      }}
    >
      {children}
    </InlineCMSContext.Provider>
  );
}

export const useInlineCMS = () => useContext(InlineCMSContext);
