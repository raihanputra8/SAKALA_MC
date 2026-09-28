'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, X, Pencil } from 'lucide-react';
import { Bike } from '@/types/database';
import ScrollReveal from '@/components/common/ScrollReveal';
import EditableWrapper from '@/components/cms/EditableWrapper';
import { useInlineCMS } from '@/context/InlineCMSContext';
import { supabase } from '@/lib/supabase/client';
import { resolveAssetUrl } from '@/lib/supabase/data';

export default function GarageSection({ bikes: initialBikes }: { bikes: Bike[] }) {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [bikes, setBikes] = useState<Bike[]>(initialBikes);
  const { isEditMode, refreshKey } = useInlineCMS();

  // Re-fetch data when CMS triggers a refresh
  const refetchBikes = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('bikes').select('*').order('year', { ascending: true });
      if (!error && data && data.length > 0) {
        setBikes((data as Bike[]).map(b => ({ ...b, image_url: resolveAssetUrl(b.image_url) })));
      }
    } catch {
      // keep existing data
    }
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      refetchBikes();
    }
  }, [refreshKey, refetchBikes]);

  return (
    <section id="garage" className="bg-[#FAF9F5] py-12 sm:py-16 lg:py-24 border-b border-[#E5E2D9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase mb-2 block">
              GARASI MOTOR
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#070F18] tracking-tight leading-tight">
              GARASI SAKALA
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
              Motor kustom dan mesin yang dirawat serta dikendarai anggota Sakala.
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <span className="md:hidden text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
              ← Geser Motor →
            </span>
            <Link
              href="/bikes"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#070F18] hover:text-[#0047AB] transition-colors uppercase flex-shrink-0 group"
            >
              <span>SEMUA MOTOR</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
          </div>
        </ScrollReveal>

        {/* 3 Bikes: Horizontal Swipe on Mobile, 3-Col Grid on Desktop */}
        <div className="flex md:grid overflow-x-auto snap-x snap-mandatory no-scrollbar md:grid-cols-3 gap-5 md:gap-6 pb-4 -mx-6 px-6 md:mx-0 md:px-0">
          {bikes.map((bike, idx) => (
            <div key={bike.id} className="w-[82vw] sm:w-[330px] md:w-auto shrink-0 snap-center">
              <ScrollReveal direction="up" delay={100 + idx * 100}>
                <EditableWrapper
                  item={{ type: 'bike', id: bike.id, data: bike as unknown as Record<string, unknown> }}
                >
                <div className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs card-interactive flex flex-col group h-full hover:border-[#070F18]">
                  {/* Bike Image Container */}
                  <Link href={`/bikes/${bike.id}`} className="relative h-56 w-full bg-[#EFECE6] overflow-hidden border-b border-[#E5E2D9] block">
                    <Image
                      src={bike.image_url}
                      alt={`${bike.year} ${bike.make} ${bike.model}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase block mb-1">
                        {bike.year} {bike.make} {bike.model}
                      </span>
                      <Link href={`/bikes/${bike.id}`}>
                        <h3 className="font-serif-editorial text-xl font-black text-[#070F18] mb-4 tracking-tight group-hover:text-[#0047AB] transition-colors">
                          {bike.title}
                        </h3>
                      </Link>

                      {/* Technical Specs Summary */}
                      <div className="divide-y divide-[#E5E2D9]/80 text-[11px] mb-5">
                        {Object.entries(bike.specs).slice(0, 3).map(([key, val]) => (
                          <div key={key} className="py-1.5 flex items-center justify-between">
                            <span className="font-semibold text-[#64748B] uppercase tracking-wider text-[10px]">
                              {key}
                            </span>
                            <span className="font-medium text-[#070F18] text-right truncate max-w-[160px]">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Button */}
                    {!isEditMode && (
                      <div>
                        <button
                          onClick={() => setSelectedBike(bike)}
                          className="w-full flex items-center justify-center gap-1.5 bg-[#FAF9F5] border border-[#E5E2D9] hover:border-[#070F18] hover:bg-[#070F18] hover:text-white text-[#070F18] py-2.5 text-[10px] font-bold tracking-[0.16em] uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>SPECS</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </EditableWrapper>
            </ScrollReveal>
          </div>
        ))}
      </div>
      </div>

      {/* Build Specs Modal with Smooth Animation */}
      {selectedBike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#FAF9F5] border border-[#C5AA00]/40 max-w-2xl w-full rounded-sm overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 bg-[#070F18] text-white flex items-center justify-between border-b border-[#C5AA00]/30">
              <div>
                <span className="text-[10px] tracking-[0.22em] text-[#C5AA00] font-bold uppercase block">
                  SPESIFIKASI MOTOR
                </span>
                <h4 className="font-serif-editorial text-xl font-bold">
                  {selectedBike.year} {selectedBike.make} {selectedBike.model} {selectedBike.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedBike(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded transition-colors btn-tactile"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative h-64 w-full rounded overflow-hidden mb-6 border border-[#E5E2D9]">
                <Image
                  src={selectedBike.image_url}
                  alt={selectedBike.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {Object.entries(selectedBike.specs).map(([key, val]) => (
                  <div key={key} className="bg-white p-3 border border-[#E5E2D9] rounded shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                      {key}
                    </span>
                    <span className="font-semibold text-[#070F18]">{val}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-[#E5E2D9]">
                <button
                  onClick={() => setSelectedBike(null)}
                  className="px-5 py-2.5 border border-[#E5E2D9] text-[#64748B] hover:text-[#070F18] text-xs font-bold tracking-[0.16em] uppercase rounded-xs transition-colors cursor-pointer"
                >
                  TUTUP
                </button>
                <Link
                  href={`/bikes/${selectedBike.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#070F18] hover:bg-[#0047AB] text-white text-xs font-bold tracking-[0.16em] uppercase rounded-xs btn-tactile transition-colors"
                >
                  <span>DETAIL MOTOR LENGKAP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
