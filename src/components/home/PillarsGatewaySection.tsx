'use client';

import React from 'react';
import Image from 'next/image';
import bannerImg from '../../../public/assets/sakala_pillars_banner_hd.png';

export default function PillarsGatewaySection() {
  return (
    <section 
      aria-label="SAKALA Four Pillars Gateway"
      className="w-full relative bg-[#002243] overflow-hidden p-0 m-0 border-b border-[#C5AA00]/30"
    >
      {/* Responsive full-width banner displaying the complete four pillars archival gateway in True Ultra HD */}
      <div className="w-full relative aspect-[16/9] overflow-hidden select-none">
        <Image
          src={bannerImg}
          alt="SAKALA Motorcycle Club — Four Pillars Archival Gateway"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover w-full h-full select-none"
        />
      </div>

      {/* Subtle bottom decorative line highlight */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5AA00]/40 to-transparent pointer-events-none" />
    </section>
  );
}
