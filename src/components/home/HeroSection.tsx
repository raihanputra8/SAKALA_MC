"use client";

import EditableWrapper from "@/components/cms/EditableWrapper";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-[#070F18] text-white overflow-hidden pt-8 pb-14 sm:pt-10 sm:pb-18 lg:pt-12 lg:pb-20">
      {/* Atmospheric Dimensional Radial Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-24 -left-20 w-[420px] h-[420px] bg-[#0047AB]/25 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 -right-16 w-[480px] h-[480px] bg-[#C5AA00]/12 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <EditableWrapper
          item={{
            type: "content",
            id: "home_hero",
            data: {
              key: "hero_title",
              label: "Judul Utama Hero",
              value: "SAKALA MOTORCYCLE CLUB",
              description:
                "Klub motor dan ruang karya dari Bandung. Berjalan bersama atas dasar persaudaraan, motor kustom, dan catatan perjalanan.",
              image_url: "/assets/SAKALA_MC.PNG",
            },
          }}
        >
          <div className="grid grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-center">
            {/* Left Column: Monograph Typography & CTAs (Col 7) */}
            <div className="col-span-7 flex flex-col justify-center animate-fade-in-up">
              {/* Main Brand Title */}
              <h1 className="font-western text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-normal text-white leading-none mb-1 sm:mb-2">
                SAKALA
              </h1>

              {/* Subtitle */}
              <p className="text-[8px] xs:text-[9.5px] sm:text-xs md:text-sm font-semibold tracking-[0.18em] sm:tracking-[0.25em] text-[#C5AA00] uppercase mb-2 sm:mb-3">
                MOTORCYCLE CLUB
              </p>

              {/* Concise On-Point Description */}
              <p className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm text-[#CBD5E1] max-w-lg leading-relaxed mb-3 sm:mb-5 font-normal">
                Klub motor dan ruang karya dari Bandung. Berjalan bersama atas
                dasar persaudaraan, motor kustom, dan catatan perjalanan.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3.5">
                <Link
                  href="#garage"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 bg-[#0047AB] hover:bg-[#00388A] text-white px-3 py-2 sm:px-5 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs font-bold tracking-[0.12em] uppercase rounded-xs transition-colors shadow-md text-center"
                >
                  <span>GARASI MOTOR</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </Link>

                <Link
                  href="#supply"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 bg-white hover:bg-[#F5F4EF] text-[#070F18] px-3 py-2 sm:px-5 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs font-bold tracking-[0.12em] uppercase rounded-xs transition-colors shadow-sm text-center"
                >
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#070F18]" />
                  <span>MERCHANDISE</span>
                </Link>
              </div>
            </div>

            {/* Right Column: SAKALA MC Official Colors Patch (Col 5) */}
            <div className="col-span-5 flex justify-center items-center relative">
              <div className="relative w-full aspect-[2075/2338] max-w-[130px] xs:max-w-[160px] sm:max-w-[220px] lg:max-w-[300px]">
                <Image
                  src="/assets/SAKALA_MC.PNG"
                  alt="SAKALA Motorcycle Club Indonesia Official Emblem"
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 300px"
                  className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                  priority
                />
              </div>
            </div>
          </div>
        </EditableWrapper>
      </div>

      {/* Smooth, elegant fade transition to archival cream with ZERO black lines and no muddy gray */}
      <div 
        className="absolute inset-x-0 bottom-0 h-14 sm:h-18 lg:h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(250, 249, 245, 0) 0%, rgba(250, 249, 245, 0.12) 25%, rgba(250, 249, 245, 0.45) 55%, rgba(250, 249, 245, 0.8) 80%, #FAF9F5 100%)'
        }}
      />
    </section>
  );
}
