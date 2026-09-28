'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Maximize2,
  Camera,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Bike } from '@/types/database';
import EditableWrapper from '@/components/cms/EditableWrapper';
import { useInlineCMS } from '@/context/InlineCMSContext';

interface BikeDetailClientProps {
  bike: Bike;
  allBikes: Bike[];
}

export default function BikeDetailClient({ bike, allBikes }: BikeDetailClientProps) {
  const { isEditMode } = useInlineCMS();

  // Only display real bike images from bike.image_url and bike.gallery
  const realPlates = (bike.gallery && bike.gallery.length > 0)
    ? bike.gallery.map((img, idx) => ({
        title: idx === 0 ? 'Foto Utama' : `Dokumentasi 0${idx + 1}`,
        image: img,
        subtitle: `${bike.make} ${bike.model}`,
      }))
    : [
        {
          title: 'Foto Utama',
          image: bike.image_url,
          subtitle: `${bike.make} ${bike.model}`,
        },
      ];

  const [activePhoto, setActivePhoto] = useState(realPlates[0]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Find previous and next bike from database
  const currentIndex = allBikes.findIndex((b) => b.id === bike.id);
  const prevBike = currentIndex > 0 ? allBikes[currentIndex - 1] : allBikes[allBikes.length - 1];
  const nextBike = currentIndex < allBikes.length - 1 ? allBikes[currentIndex + 1] : allBikes[0];

  return (
    <div className="flex-1">
      {/* Top Header / Garis Besar Build */}
      <section className="pt-8 pb-8 border-b border-[#E5E2D9] bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/bikes"
              className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#64748B] hover:text-[#0047AB] uppercase transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>KEMBALI KE GARASI</span>
            </Link>

            <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase px-2.5 py-1 bg-white border border-[#E5E2D9] rounded-xs">
              ID MOTOR: {bike.id.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase">
                  {bike.year} {bike.make} {bike.model}
                </span>
                <span className="text-[#C5AA00]">•</span>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-[#070F18] text-[#C5AA00] rounded-xs">
                  {bike.status.replace('_', ' ')}
                </span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-6xl font-black text-[#070F18] tracking-tight leading-tight mb-3">
                {bike.title}
              </h1>

              {/* Garis Besar Motor */}
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl font-normal">
                {bike.description || `${bike.title} dibangun di Bandung berbasis ${bike.year} ${bike.make} ${bike.model}.`}
              </p>
            </div>

            {/* Quick Specs Highlight Chips */}
            <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end">
              {bike.specs?.displacement && (
                <div className="px-3 py-1.5 bg-white border border-[#E5E2D9] rounded-xs text-[10px] text-[#070F18]">
                  <span className="text-[#94A3B8] block text-[8px] uppercase tracking-wider font-bold">Kapasitas Mesin</span>
                  <strong>{bike.specs.displacement}</strong>
                </div>
              )}
              {bike.specs?.frame && (
                <div className="px-3 py-1.5 bg-white border border-[#E5E2D9] rounded-xs text-[10px] text-[#070F18]">
                  <span className="text-[#94A3B8] block text-[8px] uppercase tracking-wider font-bold">Rangka</span>
                  <strong>{bike.specs.frame}</strong>
                </div>
              )}
              {bike.specs?.workshop && (
                <div className="px-3 py-1.5 bg-white border border-[#E5E2D9] rounded-xs text-[10px] text-[#070F18]">
                  <span className="text-[#94A3B8] block text-[8px] uppercase tracking-wider font-bold">Workshop</span>
                  <strong>{bike.specs.workshop}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Big Stage Showcase */}
      <section className="bg-[#EFECE6] py-10 border-b border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Main Showcase Viewport */}
          <div className="relative h-[380px] sm:h-[540px] lg:h-[620px] w-full rounded-sm overflow-hidden bg-white border border-[#E5E2D9] shadow-sm mb-6 group">
            <Image
              src={activePhoto.image}
              alt={`${bike.title} — ${activePhoto.title}`}
              fill
              className="object-contain p-4 sm:p-8 transition-all duration-300"
              priority
            />

            {/* Corner Badge */}
            <div className="absolute top-4 left-4 bg-[#070F18]/90 backdrop-blur-xs text-white px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase rounded-xs flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[#C5AA00]" />
              <span>{activePhoto.title}</span>
            </div>

            {/* Zoom Lightbox Trigger */}
            <button
              onClick={() => setLightboxImage(activePhoto.image)}
              className="absolute top-4 right-4 bg-[#070F18]/80 hover:bg-[#0047AB] text-white p-2 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Perbesar Foto"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Clean Watermark */}
            <div className="absolute bottom-6 right-6 text-right opacity-25 select-none pointer-events-none">
              <span className="font-serif-editorial text-xl sm:text-3xl font-black tracking-widest text-[#070F18]">
                SAKALA • {bike.id.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Thumbnail Selector Strip (only if multiple photos exist) */}
          {realPlates.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {realPlates.map((plate, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(plate)}
                  className={`p-2 rounded-xs border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    activePhoto.image === plate.image && activePhoto.title === plate.title
                      ? 'bg-[#070F18] text-white border-[#070F18] shadow-sm'
                      : 'bg-white text-[#475569] border-[#E5E2D9] hover:border-[#C5AA00]'
                  }`}
                >
                  <div className="relative w-11 h-11 bg-gray-100 rounded-xs overflow-hidden flex-shrink-0">
                    <Image
                      src={plate.image}
                      alt={plate.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] tracking-[0.2em] font-bold block uppercase opacity-70">
                      FOTO 0{idx + 1}
                    </span>
                    <span className="text-[9.5px] font-bold tracking-wider truncate block uppercase">
                      {plate.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DOKUMENTASI FOTO */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-6 lg:px-12 border-b border-[#E5E2D9]">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase">
              DOKUMENTASI MOTOR
            </span>
            <span className="text-[#C5AA00]">•</span>
            <span className="text-[11px] text-[#64748B] uppercase tracking-wider">
              {realPlates.length} FOTO
            </span>
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-[#070F18] tracking-tight">
            GALERI FOTO
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mt-2 leading-relaxed">
            Dokumentasi motor {bike.title}. Foto detail suku cadang tambahan akan diperbarui saat tersedia.
          </p>
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {realPlates.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs hover:border-[#070F18] transition-all group flex flex-col cursor-pointer"
              onClick={() => {
                setActivePhoto(item);
                setLightboxImage(item.image);
              }}
            >
              <div className="relative h-64 w-full bg-[#EFECE6] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white p-1.5 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-editorial text-base font-bold text-[#070F18] group-hover:text-[#0047AB] transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Previous & Next Bike Navigation */}
      <section className="py-12 bg-white border-b border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E2D9]">
            {/* Previous Bike */}
            {prevBike && (
              <Link 
                href={`/bikes/${prevBike.id}`}
                className="flex items-center gap-4 group cursor-pointer pr-4 hover:opacity-90 transition-opacity"
              >
                <div className="relative w-16 h-16 bg-[#EFECE6] rounded-xs overflow-hidden flex-shrink-0 border border-[#E5E2D9]">
                  <Image
                    src={prevBike.image_url}
                    alt={prevBike.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#64748B] uppercase block">
                    ← MOTOR SEBELUMNYA
                  </span>
                  <h4 className="font-serif-editorial text-base font-bold text-[#070F18] group-hover:text-[#0047AB] transition-colors">
                    {prevBike.year} {prevBike.make} {prevBike.title}
                  </h4>
                  <p className="text-[10px] text-[#94A3B8]">
                    {prevBike.model} • {prevBike.status.replace('_', ' ')}
                  </p>
                </div>
              </Link>
            )}

            {/* Next Bike */}
            {nextBike && (
              <Link
                href={`/bikes/${nextBike.id}`}
                className="flex items-center justify-between gap-4 group cursor-pointer pt-6 sm:pt-0 sm:pl-8 hover:opacity-90 transition-opacity"
              >
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#0047AB] uppercase block">
                    MOTOR SELANJUTNYA →
                  </span>
                  <h4 className="font-serif-editorial text-base font-bold text-[#070F18] group-hover:text-[#0047AB] transition-colors">
                    {nextBike.year} {nextBike.make} {nextBike.title}
                  </h4>
                  <p className="text-[10px] text-[#94A3B8]">
                    {nextBike.model} • {nextBike.status.replace('_', ' ')}
                  </p>
                </div>
                <div className="relative w-16 h-16 bg-[#EFECE6] rounded-xs overflow-hidden flex-shrink-0 border border-[#E5E2D9]">
                  <Image
                    src={nextBike.image_url}
                    alt={nextBike.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for High-Res Detail Inspection */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={lightboxImage}
              alt="Detail Inspection"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-xs"
            >
              TUTUP (ESC)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
