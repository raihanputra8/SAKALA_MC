'use client';

import React from 'react';
import Image from 'next/image';
import desktopBannerImg from '../../../public/assets/sakala_pillars_banner_v2.png';
import mobileBannerImg from '../../../public/assets/sakala_pillars_banner_mobile.png';

export default function PillarsGatewaySection() {
  return (
    <section 
      aria-label="SAKALA Four Pillars Gateway"
      className="w-full relative bg-[#002243] overflow-hidden p-0 m-0 border-b border-[#C5AA00]/30"
    >
      {/* 
        Desktop / Tablet View (md and up):
        Full-bleed edge-to-edge layout where the 4 Corinthian pillars touch the left and right screen borders
      */}
      <div className="hidden md:block w-full relative aspect-[1024/575] overflow-hidden select-none">
        <Image
          src={desktopBannerImg}
          alt="SAKALA Motorcycle Club — Four Pillars Archival Gateway"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full h-full select-none"
        />
      </div>

      {/* 
        Mobile View (below md):
        Dedicated vertical archway composition tailored for smartphones with pillars flanking the screen edges
      */}
      <div className="block md:hidden w-full relative aspect-[5/4] sm:aspect-[4/3] overflow-hidden select-none">
        <Image
          src={mobileBannerImg}
          alt="SAKALA Motorcycle Club — Mobile Archival Gateway"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full h-full select-none"
        />
      </div>

      {/* Subtle bottom decorative line highlight */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5AA00]/40 to-transparent pointer-events-none" />
    </section>
  );
}
