'use client';

import React from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function ManifestoSection() {
  return (
    <section id="manifesto" className="bg-[#F5F4EF] py-16 lg:py-24 border-b border-[#E5E2D9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: The Identity & Manifesto */}
          <ScrollReveal direction="up" delay={50} className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase mb-3 block">
                TENTANG SAKALA
              </span>

              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#070F18] leading-[1.12] mb-6">
                PERSAUDARAAN &amp; PERJALANAN NYATA.
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
                <p>
                  Didirikan di Bandung, Sakala Motorcycle Club adalah wadah persaudaraan roda dua yang mencatat perjalanan, motor, dan kegiatan bersama.
                </p>
                <p>
                  Terbuka untuk berbagai jenis motor dengan mengutamakan rasa saling menghargai, kebersamaan di jalan, dan komitmen antaranggota.
                </p>
              </div>
            </div>

            {/* Emblem Badge */}
            <div className="mt-8 pt-6 border-t border-[#E5E2D9] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xs bg-[#070F18] flex items-center justify-center p-2 flex-shrink-0 transition-transform hover:scale-105 duration-300">
                <Image
                  src="/assets/sakala_emblem.png"
                  alt="Lambang Sakala MC"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xs font-bold tracking-[0.16em] text-[#070F18] uppercase block">
                  SAKALA EMBLEM
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#64748B] uppercase block">
                  BANDUNG, JAWA BARAT
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Canonical Credo & 3 Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <ScrollReveal direction="up" delay={120}>
              <div className="bg-[#FAF9F5] p-6 sm:p-8 border border-[#E5E2D9] rounded-xs mb-8 shadow-xs card-interactive">
                <span className="text-[10px] font-bold tracking-[0.22em] text-[#C5AA00] uppercase mb-2 block">
                  PRINSIP KITA
                </span>
                <blockquote className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#070F18] leading-snug mb-3">
                  “SAKALA BUKAN HANYA TENTANG MOTOR, TETAPI TENTANG ORANG-ORANGNYA, JALANAN, DAN CERITA YANG KITA BANGUN BERSAMA.”
                </blockquote>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Setiap perjalanan mempererat kebersamaan dan rasa saling menjaga di antara sesama anggota.
                </p>
              </div>
            </ScrollReveal>

            {/* 3 Pillars Cards with Staggered ScrollReveal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Pillar 01 */}
              <ScrollReveal direction="up" delay={180}>
                <div className="bg-white p-5 border border-[#E5E2D9] rounded-xs shadow-xs card-interactive h-full flex flex-col justify-between hover:border-[#070F18]">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase mb-2">
                      <span>PILAR</span>
                      <span className="w-1.5 h-1.5 bg-[#070F18]" />
                    </div>
                    <h3 className="font-serif-editorial text-base font-bold text-[#070F18] mb-1.5 tracking-wide">
                      PERSAUDARAAN
                    </h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Kebersamaan dan saling menjaga, baik saat berkendara di jalan maupun di luar kegiatan bermotor.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Pillar 02 */}
              <ScrollReveal direction="up" delay={240}>
                <div className="bg-white p-5 border border-[#E5E2D9] rounded-xs shadow-xs card-interactive h-full flex flex-col justify-between hover:border-[#0047AB]">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase mb-2">
                      <span>PILAR</span>
                      <span className="w-1.5 h-1.5 bg-[#0047AB]" />
                    </div>
                    <h3 className="font-serif-editorial text-base font-bold text-[#070F18] mb-1.5 tracking-wide">
                      LOYALITAS
                    </h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Saling menghormati, menjaga komitmen bersama, dan saling mendukung antaranggota.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Pillar 03 */}
              <ScrollReveal direction="up" delay={300}>
                <div className="bg-white p-5 border border-[#E5E2D9] rounded-xs shadow-xs card-interactive h-full flex flex-col justify-between hover:border-[#C5AA00]">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase mb-2">
                      <span>PILAR</span>
                      <span className="w-1.5 h-1.5 bg-[#C5AA00]" />
                    </div>
                    <h3 className="font-serif-editorial text-base font-bold text-[#070F18] mb-1.5 tracking-wide">
                      KEBERSAMAAN
                    </h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Komunitas pengendara motor yang berakar dan berbasis di Bandung, Jawa Barat.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
