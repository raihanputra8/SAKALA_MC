'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Bike } from '@/types/database';
import EditableWrapper from '@/components/cms/EditableWrapper';
import { useInlineCMS } from '@/context/InlineCMSContext';

interface BikesArchiveClientProps {
  initialBikes: Bike[];
}

export default function BikesArchiveClient({ initialBikes }: BikesArchiveClientProps) {
  const { isEditMode } = useInlineCMS();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredBikes = selectedStatus === 'all'
    ? initialBikes
    : initialBikes.filter((b) => b.status.toLowerCase() === selectedStatus.toLowerCase());

  return (
    <div className="flex-1 py-12 max-w-7xl mx-auto px-6 lg:px-12 w-full">
      {/* Archive Header */}
      <div className="mb-10 pb-8 border-b border-[#E5E2D9]">
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase mb-2 block">
          GARASI MOTOR
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif-editorial text-4xl sm:text-6xl font-black text-[#070F18] tracking-tight leading-tight mb-3">
              GARASI MOTOR SAKALA
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
              Koleksi motor garasi Sakala Motorcycle Club Bandung. Dicatat untuk merekam perjalanan, spesifikasi, dan kegiatan berkendara.
            </p>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'SEMUA MOTOR' },
              { id: 'archival', label: 'ARCHIVAL' },
              { id: 'commissioned', label: 'COMMISSIONED' },
              { id: 'private_collection', label: 'PRIVATE COLLECTION' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-xs transition-all cursor-pointer ${
                  selectedStatus === tab.id
                    ? 'bg-[#070F18] text-white shadow-xs'
                    : 'bg-white border border-[#E5E2D9] text-[#64748B] hover:text-[#070F18] hover:border-[#070F18]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Builds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredBikes.map((bike) => (
          <EditableWrapper
            key={bike.id}
            item={{ type: 'bike', id: bike.id, data: bike as unknown as Record<string, unknown> }}
          >
            <div className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs hover:border-[#070F18] hover:shadow-md transition-all duration-300 flex flex-col group h-full">
              {/* Bike Image with Link */}
              <Link href={`/bikes/${bike.id}`} className="relative h-64 w-full bg-[#EFECE6] overflow-hidden block border-b border-[#E5E2D9]">
                <Image
                  src={bike.image_url}
                  alt={`${bike.year} ${bike.make} ${bike.model} - ${bike.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </Link>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase block mb-1">
                    {bike.year} {bike.make} {bike.model}
                  </span>
                  
                  <Link href={`/bikes/${bike.id}`}>
                    <h2 className="font-serif-editorial text-2xl font-black text-[#070F18] mb-2 tracking-tight group-hover:text-[#0047AB] transition-colors">
                      {bike.title}
                    </h2>
                  </Link>

                  {/* Garis Besar Description */}
                  {bike.description && (
                    <p className="text-xs text-[#64748B] mb-4 line-clamp-2 leading-relaxed">
                      {bike.description}
                    </p>
                  )}

                  {/* Specs List */}
                  <div className="divide-y divide-[#E5E2D9]/80 text-[11px] mb-6">
                    {Object.entries(bike.specs || {}).slice(0, 3).map(([key, val]) => (
                      <div key={key} className="py-1.5 flex items-center justify-between">
                        <span className="font-semibold text-[#64748B] uppercase tracking-wider text-[10px]">
                          {key}
                        </span>
                        <span className="font-medium text-[#070F18] text-right truncate max-w-[170px]">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explore Button */}
                <Link
                  href={`/bikes/${bike.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#070F18] group-hover:bg-[#0047AB] text-white py-3 text-[10px] font-bold tracking-[0.2em] uppercase rounded-xs transition-colors btn-tactile"
                >
                  <span>LIHAT DETAIL MOTOR</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </EditableWrapper>
        ))}
      </div>
    </div>
  );
}
