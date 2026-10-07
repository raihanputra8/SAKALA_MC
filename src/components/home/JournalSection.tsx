'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { JournalPost } from '@/types/database';
import ScrollReveal from '@/components/common/ScrollReveal';
import EditableWrapper from '@/components/cms/EditableWrapper';
import { useInlineCMS } from '@/context/InlineCMSContext';
import { supabase } from '@/lib/supabase/client';
import { resolveAssetUrl } from '@/lib/supabase/data';

export default function JournalSection({ posts: initialPosts }: { posts: JournalPost[] }) {
  const [posts, setPosts] = useState<JournalPost[]>(initialPosts);
  const { isEditMode, refreshKey } = useInlineCMS();

  const featured = posts.find((p) => p.featured) || posts[0];
  const sideArticles = posts.filter((p) => p.id !== featured?.id);

  // Re-fetch data when CMS triggers a refresh
  const refetchPosts = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('journal_posts').select('*').order('publish_date', { ascending: false });
      if (!error && data && data.length > 0) {
        setPosts((data as JournalPost[]).map(p => ({ ...p, cover_image_url: resolveAssetUrl(p.cover_image_url) })));
      }
    } catch {
      // keep existing data
    }
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      refetchPosts();
    }
  }, [refreshKey, refetchPosts]);



  return (
    <section id="journal" className="bg-gradient-to-b from-[#FAF9F5] via-[#FFFFFF] to-[#F5F4EF] py-14 sm:py-20 lg:py-28 border-b border-[#E5E2D9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase mb-2 block">
              JURNAL & ARSIP PERJALANAN
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#070F18] tracking-tight leading-tight">
              CATATAN PERJALANAN
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
              Dokumentasi rute turing, catatan garasi, dan cerita anggota di jalan.
            </p>
          </div>

          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#070F18] hover:text-[#0047AB] transition-colors uppercase flex-shrink-0 group"
          >
            <span>SEMUA CATATAN</span>
            <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </Link>
        </ScrollReveal>

        {/* Journal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Featured Large Article */}
          {featured && (
            <ScrollReveal direction="up" delay={100} className="lg:col-span-7 flex flex-col">
              <EditableWrapper
                item={{ type: 'journal', id: featured.id, data: featured as unknown as Record<string, unknown> }}
              >
                {isEditMode ? (
                  <div className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#070F18] card-interactive h-full transition-all duration-300">
                    <div className="relative h-72 sm:h-96 w-full bg-[#EFECE6] overflow-hidden">
                      <Image
                        src={featured.cover_image_url}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#070F18]/90 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-xs backdrop-blur-xs">
                          {featured.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase mb-2">
                          {featured.publish_date}
                        </div>

                        <h3 className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#070F18] leading-tight mb-3 group-hover:text-[#0047AB] transition-colors">
                          {featured.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4 line-clamp-3">
                          {featured.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E5E2D9]">
                        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#070F18] group-hover:text-[#0047AB] uppercase transition-colors">
                          <span>BACA CATATAN LENGKAP</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/journal/${featured.slug}`}
                    className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#070F18] card-interactive h-full transition-all duration-300"
                  >
                    <div className="relative h-72 sm:h-96 w-full bg-[#EFECE6] overflow-hidden">
                      <Image
                        src={featured.cover_image_url}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#070F18]/90 text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-xs backdrop-blur-xs">
                          {featured.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase mb-2">
                          {featured.publish_date}
                        </div>

                        <h3 className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#070F18] leading-tight mb-3 group-hover:text-[#0047AB] transition-colors">
                          {featured.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4 line-clamp-3">
                          {featured.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E5E2D9]">
                        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#070F18] group-hover:text-[#0047AB] uppercase transition-colors">
                          <span>BACA CATATAN LENGKAP</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </EditableWrapper>
            </ScrollReveal>
          )}

          {/* Right: Side Articles */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            {sideArticles.map((article, idx) => (
              <ScrollReveal key={article.id} direction="up" delay={160 + idx * 80} className="flex-1">
                <EditableWrapper
                  item={{ type: 'journal', id: article.id, data: article as unknown as Record<string, unknown> }}
                >
                  {isEditMode ? (
                    <div className="bg-white border border-[#E5E2D9] rounded-xs p-4 sm:p-5 shadow-xs hover:border-[#070F18] card-interactive flex gap-4 items-center group h-full transition-all duration-300">
                      {article.cover_image_url && (
                        <div className="relative w-24 sm:w-28 h-24 sm:h-28 shrink-0 bg-[#EFECE6] rounded-xs overflow-hidden">
                          <Image
                            src={article.cover_image_url}
                            alt={article.title}
                            fill
                            sizes="120px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[9px] font-bold tracking-[0.2em] text-[#0047AB] uppercase mb-1">
                            {article.category} • <span className="text-[#64748B]">{article.publish_date}</span>
                          </div>
                          <h4 className="font-serif-editorial text-sm sm:text-base font-bold text-[#070F18] leading-snug mb-1.5 group-hover:text-[#0047AB] transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="pt-2 mt-2 border-t border-[#F1EFEA]">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-[#070F18] group-hover:text-[#0047AB] uppercase transition-colors">
                            <span>BACA</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={`/journal/${article.slug}`}
                      className="bg-white border border-[#E5E2D9] rounded-xs p-4 sm:p-5 shadow-xs hover:border-[#070F18] card-interactive flex gap-4 items-center group h-full transition-all duration-300"
                    >
                      {article.cover_image_url && (
                        <div className="relative w-24 sm:w-28 h-24 sm:h-28 shrink-0 bg-[#EFECE6] rounded-xs overflow-hidden">
                          <Image
                            src={article.cover_image_url}
                            alt={article.title}
                            fill
                            sizes="120px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[9px] font-bold tracking-[0.2em] text-[#0047AB] uppercase mb-1">
                            {article.category} • <span className="text-[#64748B]">{article.publish_date}</span>
                          </div>
                          <h4 className="font-serif-editorial text-sm sm:text-base font-bold text-[#070F18] leading-snug mb-1.5 group-hover:text-[#0047AB] transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="pt-2 mt-2 border-t border-[#F1EFEA]">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-[#070F18] group-hover:text-[#0047AB] uppercase transition-colors">
                            <span>BACA</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </EditableWrapper>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
