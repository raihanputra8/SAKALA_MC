'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Search, 
  Clock, 
  Mountain, 
  Thermometer, 
  Compass, 
  BookOpen,
  Filter
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getJournalPosts } from '@/lib/supabase/data';
import { JournalPost } from '@/types/database';
import EditableWrapper from '@/components/cms/EditableWrapper';

export default function JournalIndexPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const fetched = await getJournalPosts();
        setPosts(fetched);
      } catch (err) {
        console.error('Failed to load journal posts:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = [
    { id: 'all', label: 'ALL MONOGRAPHS' },
    { id: 'EXPEDITION DISPATCH', label: 'EXPEDITION DISPATCHES' },
    { id: 'WORKSHOP MONOGRAPH', label: 'WORKSHOP BUILDS' },
    { id: 'BROTHERHOOD ARCHIVE', label: 'BROTHERHOOD ARCHIVE' },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'EXPEDITION DISPATCH' && post.category.toLowerCase().includes('ride'));
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = posts.find((p) => p.featured) || posts[0];
  const listPosts = filteredPosts.filter((p) => p.id !== featured?.id || searchQuery !== '' || selectedCategory !== 'all');

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
      <Navbar />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#64748B] mb-8 pb-4 border-b border-[#E5E2D9]">
          <Link href="/" className="hover:text-[#070F18] transition-colors">
            BERANDA
          </Link>
          <span>/</span>
          <span className="text-[#0047AB]">HISTORICAL MONOGRAPHS</span>
          <span>/</span>
          <span className="text-[#070F18]">DISPATCH ARCHIVE</span>
        </div>

        {/* Editorial Masthead */}
        <header className="mb-12">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase mb-3 block">
            05 — THE JOURNAL & MONOGRAPHS
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-6xl font-black text-[#070F18] tracking-tight leading-tight mb-4">
            DISPATCHES FROM THE ROAD
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
            Long-form journalism documenting Indonesian motorcycle subculture, mountain pass expeditions, engine mechanics, and brotherhood oral histories.
          </p>
        </header>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E5E2D9]">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-[10px] font-bold tracking-[0.16em] uppercase rounded-xs transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#070F18] text-[#C5AA00]'
                    : 'bg-white text-[#64748B] border border-[#E5E2D9] hover:border-[#070F18] hover:text-[#070F18]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search dispatches, routes, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E5E2D9] pl-9 pr-4 py-2 text-xs rounded-xs outline-none focus:border-[#070F18]"
            />
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-3" />
          </div>
        </div>

        {/* Featured Top Story (Only shown when not searching and category is all) */}
        {selectedCategory === 'all' && searchQuery === '' && featured && (
          <section className="mb-14">
            <EditableWrapper
              item={{ type: 'journal', id: featured.id, data: featured }}
            >
              <Link
                href={`/journal/${featured.slug}`}
                className="group block bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs hover:border-[#070F18] transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="relative h-72 sm:h-96 lg:h-auto lg:col-span-7 bg-[#070F18] overflow-hidden">
                    <Image
                      src={featured.cover_image_url}
                      alt={featured.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.2em] text-[#0047AB] uppercase mb-3 flex items-center gap-2">
                        <span>{featured.category}</span>
                        <span>•</span>
                        <span className="text-[#64748B]">{featured.publish_date}</span>
                      </div>

                      <h2 className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#070F18] group-hover:text-[#0047AB] transition-colors leading-tight mb-4">
                        {featured.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
                        {featured.excerpt}
                      </p>

                      <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF9F5] border border-[#E5E2D9] rounded-xs text-[11px] mb-6">
                        <div>
                          <span className="text-[9px] text-[#64748B] font-bold uppercase block">ELEVATION</span>
                          <span className="font-bold text-[#070F18]">2,084 MASL</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#64748B] font-bold uppercase block">READ TIME</span>
                          <span className="font-bold text-[#070F18]">{featured.read_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E5E2D9] flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#070F18] group-hover:text-[#C5AA00] transition-colors">
                        READ FULL DISPATCH
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </EditableWrapper>
          </section>
        )}

        {/* Grid of Other Dispatches */}
        <section>
          {listPosts.length === 0 ? (
            <div className="bg-white border border-[#E5E2D9] rounded-xs p-12 text-center">
              <BookOpen className="w-10 h-10 text-[#64748B] mx-auto mb-3 opacity-50" />
              <h3 className="font-serif-editorial text-lg font-bold text-[#070F18] mb-1">
                NO DISPATCHES FOUND
              </h3>
              <p className="text-xs text-[#64748B]">
                No monographs match your query "{searchQuery}". Try browsing other categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listPosts.map((post) => (
                <EditableWrapper
                  key={post.id}
                  item={{ type: 'journal', id: post.id, data: post }}
                  className="h-full"
                >
                  <Link
                    href={`/journal/${post.slug}`}
                    className="group bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs hover:border-[#070F18] transition-colors flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="relative h-56 w-full bg-[#070F18] overflow-hidden">
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-6">
                        <div className="text-[10px] font-bold tracking-[0.18em] text-[#64748B] uppercase mb-2 flex items-center gap-2">
                          <span>{post.publish_date}</span>
                          <span>•</span>
                          <span>{post.read_time}</span>
                        </div>

                        <h3 className="font-serif-editorial text-xl font-bold text-[#070F18] group-hover:text-[#0047AB] transition-colors leading-snug mb-3">
                          {post.title}
                        </h3>

                        <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="pt-4 border-t border-[#E5E2D9] flex items-center justify-between text-xs font-bold tracking-[0.16em] uppercase text-[#070F18] group-hover:text-[#C5AA00] transition-colors">
                        <span>READ MONOGRAPH</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </EditableWrapper>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
