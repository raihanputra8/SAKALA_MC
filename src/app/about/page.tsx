'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EditableWrapper from '@/components/cms/EditableWrapper';
import { useInlineCMS } from '@/context/InlineCMSContext';

export default function AboutPage() {
  const { getContent } = useInlineCMS();

  // Dynamic Content with live CMS updates
  const heroContent = getContent('about_hero', {
    label: 'BANDUNG, JAWA BARAT',
    title: 'TENTANG SAKALA',
    description: 'Sakala adalah persaudaraan pengendara motor dari Bandung yang memegang prinsip kekeluargaan dan saling menghargai. Kami terbuka untuk beragam jenis dan cerita di balik setiap motor, dengan mengutamakan karakter dan kebersamaan.',
    cta_text: 'PELAJARI FILOSOFI',
  });

  const heroImgContent = getContent('about_hero_image', {
    image_url: '/assets/sakala_emblem.png',
    label: 'Logo Sakala',
    title: 'Sakala Motorcycle Club',
  });

  const originImgContent = getContent('about_origin_image', {
    image_url: '/assets/sakala_emblem.png',
    label: 'Cakra Rahayu Kencana',
    title: 'Simbol Sakala',
  });

  const sanskritContent = getContent('about_sanskrit', {
    label: '01. ASAL KATA',
    title: 'Sa + Kala',
    description: 'Berasal dari konsep perwujudan nyata dalam tindakan, mewakili komitmen yang diekspresikan melalui perbuatan.',
  });

  const kawiContent = getContent('about_kawi', {
    label: '02. TINDAKAN NYATA',
    title: 'Laku & Bukti',
    description: 'Prinsip bahwa nilai seseorang tercermin dari apa yang dilakukannya di jalan dan di tengah masyarakat.',
  });

  const sundaContent = getContent('about_sunda', {
    label: '03. FILOSOFI SUNDA',
    title: 'Cageur, Bageur, Bener, Pinter, Singer',
    description: 'Berakar pada nilai luhur Sunda yang mengutamakan kebaikan budi pekerti, kejujuran, dan keutuhan karakter.',
  });

  const pillar1 = getContent('about_pillar_1', {
    label: 'PRINSIP 01',
    title: 'Loyalitas',
    description: 'Komitmen terhadap persaudaraan, hadir saat dibutuhkan, dan saling menjaga kejujuran di antara sesama anggota.',
  });

  const pillar2 = getContent('about_pillar_2', {
    label: 'PRINSIP 02',
    title: 'Memanusiakan Manusia',
    description: 'Menghargai martabat sesama anggota, mitra, maupun pengendara lain di jalan raya tanpa terkecuali.',
  });

  const pillar3 = getContent('about_pillar_3', {
    label: 'PRINSIP 03',
    title: 'Kesejahteraan Bersama',
    description: 'Saling mendukung dalam karya dan kehidupan sehari-hari, tumbuh bersama sebagai satu lingkaran keluarga.',
  });

  const pillar4 = getContent('about_pillar_4', {
    label: 'PRINSIP 04',
    title: 'Integritas & Sikap',
    description: 'Menjaga kehormatan nama baik, menghargai komitmen, dan bertanggung jawab dalam setiap kegiatan.',
  });

  const div1 = getContent('about_div_1', {
    label: 'KEGIATAN 01',
    title: 'Divisi Motor',
    description: 'Touring akhir pekan, perjalanan jarak jauh, bakti sosial, dan silaturahmi. Terbuka untuk semua merek motor dengan mengutamakan cerita di balik motor dan karakter pengendara.',
  });

  const div2 = getContent('about_div_2', {
    label: 'KEGIATAN 02',
    title: 'Tactical Airsoft',
    description: 'Latihan taktis, simulasi, dan kegiatan olahraga airsoft yang terafiliasi dengan INASSOC Jabar & KORMI.',
  });

  const quoteContent = getContent('about_quote', {
    label: 'SAKALA MOTORCYCLE CLUB',
    title: '“Dibangun di Bandung untuk mencatat perjalanan, motor, dan kegiatan persaudaraan Sakala.”',
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18] selection:bg-[#F0D000] selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* SECTION 1: HERO */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Headline */}
            <div className="lg:col-span-7">
              <EditableWrapper
                item={{
                  type: 'content',
                  id: 'about_hero',
                  data: heroContent,
                }}
              >
                <div className="space-y-8">
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block">
                    {heroContent.label}
                  </span>

                  <h1 className="font-serif-editorial text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#070F18] leading-[1.05]">
                    {heroContent.title}
                  </h1>

                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl font-normal whitespace-pre-line">
                    {heroContent.description}
                  </p>

                  <div>
                    <a 
                      href="#origin"
                      className="inline-block bg-[#070F18] text-white text-[11px] font-bold tracking-[0.25em] px-8 py-4 hover:bg-[#0050A0] transition-colors uppercase shadow-sm"
                    >
                      {heroContent.cta_text || 'PELAJARI FILOSOFI'}
                    </a>
                  </div>
                </div>
              </EditableWrapper>
            </div>

            {/* Right Column: Full Graphic / Picture Display Card (No text underneath) */}
            <div className="lg:col-span-5">
              <EditableWrapper
                item={{
                  type: 'content',
                  id: 'about_hero_image',
                  data: heroImgContent,
                }}
              >
                <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] bg-[#070F18] border border-[#1E293B] shadow-2xl rounded-sm overflow-hidden flex items-center justify-center p-6 sm:p-10 group">
                  <div className="relative w-full h-full">
                    <Image
                      src={heroImgContent.image_url || '/assets/sakala_emblem.png'}
                      alt={heroImgContent.title || 'SAKALA Image'}
                      fill
                      className="object-contain drop-shadow-[0_20px_50px_rgba(240,208,0,0.28)] transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                </div>
              </EditableWrapper>
            </div>
          </div>
        </section>

        {/* SECTION 2: FILOSOFI SAKALA */}
        <section id="origin" className="border-t border-[#E5E2D9] pt-20 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
            <div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold tracking-wider text-[#070F18] uppercase">
                FILOSOFI SAKALA
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Emblem */}
              <div className="lg:col-span-5">
                <EditableWrapper
                  item={{
                    type: 'content',
                    id: 'about_origin_image',
                    data: originImgContent,
                  }}
                >
                  <div className="relative w-full h-[420px] sm:h-[480px] bg-[#070F18] border border-[#1E293B] shadow-xl rounded-sm overflow-hidden flex items-center justify-center p-6 sm:p-10 group">
                    <div className="relative w-full h-full">
                      <Image
                        src={originImgContent.image_url || '/assets/sakala_emblem.png'}
                        alt={originImgContent.title || 'Simbol Sakala'}
                        fill
                        className="object-contain drop-shadow-[0_20px_45px_rgba(240,208,0,0.25)] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </EditableWrapper>
              </div>

              {/* Right Column: 3 Traditions */}
              <div className="lg:col-span-7 space-y-8">
                {/* 01 Asal Kata */}
                <EditableWrapper
                  item={{
                    type: 'content',
                    id: 'about_sanskrit',
                    data: sanskritContent,
                  }}
                >
                  <div className="pb-8 border-b border-[#E5E2D9]">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                      {sanskritContent.label}
                    </span>
                    <h3 className="font-serif-editorial text-2xl font-bold text-[#070F18] mb-2">
                      {sanskritContent.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {sanskritContent.description}
                    </p>
                  </div>
                </EditableWrapper>

                {/* 02 Tindakan Nyata */}
                <EditableWrapper
                  item={{
                    type: 'content',
                    id: 'about_kawi',
                    data: kawiContent,
                  }}
                >
                  <div className="pb-8 border-b border-[#E5E2D9]">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                      {kawiContent.label}
                    </span>
                    <h3 className="font-serif-editorial text-2xl font-bold text-[#070F18] mb-2">
                      {kawiContent.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {kawiContent.description}
                    </p>
                  </div>
                </EditableWrapper>

                {/* 03 Filosofi Sunda */}
                <EditableWrapper
                  item={{
                    type: 'content',
                    id: 'about_sunda',
                    data: sundaContent,
                  }}
                >
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                      {sundaContent.label}
                    </span>
                    <h3 className="font-serif-editorial text-2xl font-bold text-[#070F18] mb-2">
                      {sundaContent.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {sundaContent.description}
                    </p>
                  </div>
                </EditableWrapper>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: PRINSIP & KEGIATAN */}
        <section id="values" className="border-t border-[#E5E2D9] pt-20 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
            <div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold tracking-wider text-[#070F18] uppercase">
                PRINSIP &amp; KEGIATAN
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
              {/* Pillar 01 */}
              <EditableWrapper item={{ type: 'content', id: 'about_pillar_1', data: pillar1 }}>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                    {pillar1.label}
                  </span>
                  <h3 className="font-serif-editorial text-xl font-bold text-[#070F18] mb-2">
                    {pillar1.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {pillar1.description}
                  </p>
                </div>
              </EditableWrapper>

              {/* Pillar 02 */}
              <EditableWrapper item={{ type: 'content', id: 'about_pillar_2', data: pillar2 }}>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                    {pillar2.label}
                  </span>
                  <h3 className="font-serif-editorial text-xl font-bold text-[#070F18] mb-2">
                    {pillar2.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {pillar2.description}
                  </p>
                </div>
              </EditableWrapper>

              {/* Pillar 03 */}
              <EditableWrapper item={{ type: 'content', id: 'about_pillar_3', data: pillar3 }}>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                    {pillar3.label}
                  </span>
                  <h3 className="font-serif-editorial text-xl font-bold text-[#070F18] mb-2">
                    {pillar3.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {pillar3.description}
                  </p>
                </div>
              </EditableWrapper>

              {/* Pillar 04 */}
              <EditableWrapper item={{ type: 'content', id: 'about_pillar_4', data: pillar4 }}>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                    {pillar4.label}
                  </span>
                  <h3 className="font-serif-editorial text-xl font-bold text-[#070F18] mb-2">
                    {pillar4.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {pillar4.description}
                  </p>
                </div>
              </EditableWrapper>

              {/* Division 01 */}
              <EditableWrapper item={{ type: 'content', id: 'about_div_1', data: div1 }}>
                <div id="divisions">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                    {div1.label}
                  </span>
                  <h3 className="font-serif-editorial text-xl font-bold text-[#070F18] mb-2">
                    {div1.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {div1.description}
                  </p>
                </div>
              </EditableWrapper>

              {/* Division 02 */}
              <EditableWrapper item={{ type: 'content', id: 'about_div_2', data: div2 }}>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#0050A0] uppercase block mb-1">
                    {div2.label}
                  </span>
                  <h3 className="font-serif-editorial text-xl font-bold text-[#070F18] mb-2">
                    {div2.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {div2.description}
                  </p>
                </div>
              </EditableWrapper>
            </div>
          </div>
        </section>

        {/* SECTION 4: QUOTE SECTION */}
        <section className="bg-[#070F18] text-white py-24 lg:py-32 border-t border-[#1E293B] text-center px-6">
          <EditableWrapper
            item={{
              type: 'content',
              id: 'about_quote',
              data: quoteContent,
            }}
          >
            <div className="max-w-4xl mx-auto space-y-10">
              <h2 className="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-light italic leading-tight text-white/95">
                {quoteContent.title}
              </h2>

              <div className="text-[11px] font-bold tracking-[0.3em] text-[#F0D000] uppercase">
                {quoteContent.label}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/bikes"
                  className="w-full sm:w-auto px-8 py-4 border border-white/40 text-white text-xs font-bold tracking-[0.2em] uppercase hover:border-[#F0D000] hover:text-[#F0D000] transition-colors"
                >
                  LIHAT MOTOR
                </Link>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-[#F0D000] text-[#070F18] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#C5AA00] transition-colors"
                >
                  MERCHANDISE
                </Link>
              </div>
            </div>
          </EditableWrapper>
        </section>
      </main>

      <Footer />
    </div>
  );
}
