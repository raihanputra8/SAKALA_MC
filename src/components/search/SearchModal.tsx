'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Package, BookOpen, Wrench, ArrowRight } from 'lucide-react';
import { mockProducts, mockBikes, mockJournalPosts } from '@/data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Global hotkey: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingProducts = q
    ? mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : [];

  const matchingBikes = q
    ? mockBikes.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.make.toLowerCase().includes(q) ||
          b.model.toLowerCase().includes(q)
      )
    : [];

  const matchingJournal = q
    ? mockJournalPosts.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.excerpt.toLowerCase().includes(q) ||
          j.author.toLowerCase().includes(q)
      )
    : [];

  const totalResults = matchingProducts.length + matchingBikes.length + matchingJournal.length;

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/75 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl bg-white border border-[#E5E2D9] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[#E5E2D9] bg-[#FAF9F5] gap-3">
          <Search className="w-5 h-5 text-[#64748B] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, motorcycles, dispatches, or ethos..."
            className="flex-1 bg-transparent text-sm text-[#070F18] placeholder-[#94A3B8] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#64748B] hover:text-[#070F18] font-bold"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#070F18] transition-colors rounded-xs ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {!q ? (
            <div className="py-6 text-center text-xs text-[#64748B] space-y-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#0047AB] uppercase block">
                SUGGESTED DISCOVERY
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setQuery('Tee')}
                  className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E5E2D9] text-[#070F18] hover:border-[#070F18] rounded-xs text-[11px] font-bold"
                >
                  Heavyweight Tees
                </button>
                <button
                  onClick={() => setQuery('Tangkuban')}
                  className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E5E2D9] text-[#070F18] hover:border-[#070F18] rounded-xs text-[11px] font-bold"
                >
                  Tangkuban Perahu
                </button>
                <button
                  onClick={() => setQuery('CB550')}
                  className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E5E2D9] text-[#070F18] hover:border-[#070F18] rounded-xs text-[11px] font-bold"
                >
                  1978 CB550 Kujang
                </button>
                <button
                  onClick={() => setQuery('Memanusiakan')}
                  className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E5E2D9] text-[#070F18] hover:border-[#070F18] rounded-xs text-[11px] font-bold"
                >
                  Memanusiakan Manusia
                </button>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xs text-[#64748B] mb-2">No archive results found for "{query}".</p>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#0047AB]">
                TRY SEARCHING FOR TEE, JACKET, CB550, OR TANGKUBAN
              </span>
            </div>
          ) : (
            <>
              {/* Matching Products */}
              {matchingProducts.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#0047AB] uppercase block mb-3">
                    SUPPLY PRODUCTS ({matchingProducts.length})
                  </span>
                  <div className="space-y-2">
                    {matchingProducts.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigateTo(`/shop/${p.id}`)}
                        className="flex items-center gap-3 p-2.5 rounded-xs hover:bg-[#FAF9F5] border border-transparent hover:border-[#E5E2D9] cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#FAF9F5] rounded-xs border border-[#E5E2D9] relative overflow-hidden flex-shrink-0">
                          <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif-editorial text-xs font-bold text-[#070F18] truncate">
                            {p.name}
                          </h4>
                          <span className="text-[10px] text-[#64748B]">
                            {p.sku} • IDR {p.price_idr.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Journal Dispatches */}
              {matchingJournal.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5AA00] uppercase block mb-3">
                    JOURNAL DISPATCHES ({matchingJournal.length})
                  </span>
                  <div className="space-y-2">
                    {matchingJournal.slice(0, 3).map((j) => (
                      <div
                        key={j.id}
                        onClick={() => navigateTo(`/journal/${j.slug}`)}
                        className="p-3 rounded-xs hover:bg-[#FAF9F5] border border-transparent hover:border-[#E5E2D9] cursor-pointer transition-colors"
                      >
                        <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-[#64748B] block mb-1">
                          {j.category} • {j.read_time}
                        </span>
                        <h4 className="font-serif-editorial text-xs sm:text-sm font-bold text-[#070F18] mb-1">
                          {j.title}
                        </h4>
                        <p className="text-[11px] text-[#64748B] line-clamp-1">
                          {j.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Bikes */}
              {matchingBikes.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#070F18] uppercase block mb-3">
                    GARAGE MACHINES ({matchingBikes.length})
                  </span>
                  <div className="space-y-2">
                    {matchingBikes.slice(0, 2).map((b) => (
                      <div
                        key={b.id}
                        onClick={() => navigateTo(`/bikes/${b.id}`)}
                        className="flex items-center gap-3 p-2.5 rounded-xs hover:bg-[#FAF9F5] border border-transparent hover:border-[#E5E2D9] cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#070F18] rounded-xs relative overflow-hidden flex-shrink-0">
                          <Image src={b.image_url} alt={b.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif-editorial text-xs font-bold text-[#070F18] truncate">
                            {b.title}
                          </h4>
                          <span className="text-[10px] text-[#64748B]">
                            {b.year} {b.make} {b.model}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#E5E2D9] flex justify-between items-center text-[10px] text-[#64748B]">
          <span>Press ESC to close</span>
          <span className="font-bold text-[#070F18]">SAKALA ARCHIVE SEARCH ENGINE</span>
        </div>
      </div>
    </div>
  );
}
