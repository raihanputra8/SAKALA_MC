'use client';

import React, { useEffect, useState } from 'react';
import { Save, Check, Type } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { getAllSiteContent, updateSiteContent } from '@/lib/supabase/admin';
import { SiteContent } from '@/types/database';

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  async function loadContent() {
    try {
      const data = await getAllSiteContent();
      setContent(data);
      const values: Record<string, string> = {};
      data.forEach((item) => { values[item.key] = item.value; });
      setEditValues(values);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadContent(); }, []);

  async function handleSave(key: string) {
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await updateSiteContent(key, editValues[key]);
      setSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to save content');
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  }

  // Group content by section
  const sections = content.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  const sectionLabels: Record<string, string> = {
    hero: 'Hero Section',
    manifesto: 'Manifesto Section',
    culture: 'Culture & Instagram Section',
    about: 'About Page',
    newsletter: 'Newsletter Section',
    footer: 'Footer',
  };

  return (
    <>
      <AdminHeader
        title="Site Content"
        subtitle="Edit text and copy across all pages"
      />

      <div className="flex-1 p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#C5AA00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : Object.keys(sections).length === 0 ? (
          <div className="bg-white border border-[#E5E2D9] rounded-md p-12 text-center">
            <Type className="w-10 h-10 text-[#94A3B8] mx-auto mb-3 opacity-50" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#070F18] mb-1">No Content Found</h3>
            <p className="text-xs text-[#64748B]">
              Run the schema seed SQL in Supabase to populate initial site content entries.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(sections).map(([section, items]) => (
              <div key={section} className="bg-white border border-[#E5E2D9] rounded-md overflow-hidden">
                {/* Section Header */}
                <div className="px-6 py-4 bg-[#FAF9F5] border-b border-[#E5E2D9]">
                  <h2 className="font-serif-editorial text-sm font-bold text-[#070F18] uppercase tracking-wider">
                    {sectionLabels[section] || section}
                  </h2>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">
                    {items.length} editable field{items.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Content Fields */}
                <div className="divide-y divide-[#E5E2D9]">
                  {items.map((item) => {
                    const isDirty = editValues[item.key] !== item.value;
                    const isSaving = saving[item.key];
                    const isSaved = saved[item.key];

                    return (
                      <div key={item.key} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                              {item.label || item.key}
                            </label>

                            {item.field_type === 'textarea' || item.field_type === 'richtext' ? (
                              <textarea
                                value={editValues[item.key] || ''}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [item.key]: e.target.value,
                                  }))
                                }
                                rows={item.field_type === 'richtext' ? 6 : 3}
                                className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 text-xs rounded-md outline-none focus:border-[#070F18] resize-none transition-colors"
                              />
                            ) : (
                              <input
                                type={item.field_type === 'number' ? 'number' : 'text'}
                                value={editValues[item.key] || ''}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [item.key]: e.target.value,
                                  }))
                                }
                                className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 text-xs rounded-md outline-none focus:border-[#070F18] transition-colors"
                              />
                            )}

                            {item.updated_at && (
                              <p className="text-[9px] text-[#94A3B8] mt-1">
                                Last updated: {new Date(item.updated_at).toLocaleString('id-ID')}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleSave(item.key)}
                            disabled={!isDirty || isSaving}
                            className={`mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-md transition-all ${
                              isSaved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isDirty
                                ? 'bg-[#070F18] text-white hover:bg-[#0047AB]'
                                : 'bg-[#FAF9F5] text-[#94A3B8] border border-[#E5E2D9] cursor-not-allowed'
                            }`}
                          >
                            {isSaved ? (
                              <><Check className="w-3 h-3" /> Saved</>
                            ) : isSaving ? (
                              'Saving...'
                            ) : (
                              <><Save className="w-3 h-3" /> Save</>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
