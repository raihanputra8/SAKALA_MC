'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  Shield
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070F18] text-white border-t border-[#1E293B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main Grid: 4 Balanced Strategic Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Column 1: Brand & About / Informasi Perusahaan (Col 4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/assets/sakala_emblem.png"
                  alt="SAKALA Emblem"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif-editorial text-xl font-bold tracking-[0.16em] text-white block leading-none mb-1">
                  SAKALA
                </span>
                <span className="text-[9px] tracking-[0.22em] text-[#C5AA00] uppercase font-bold block">
                  MOTORCYCLE CLUB • BANDUNG
                </span>
              </div>
            </div>

            {/* About / Informasi Perusahaan */}
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm font-normal">
              Klub motor dari Bandung, Jawa Barat. Berjalan bersama atas dasar persaudaraan, motor kustom, dan catatan di setiap perjalanan.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5AA00] uppercase block mb-3">
                SOSIAL MEDIA
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/sakala_ina?stkn=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#C5AA00] hover:border-[#C5AA00] transition-colors"
                  aria-label="Instagram @sakala_ina"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@sakala.id25?si=4ScKIl-5ZM3UJ0tS"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#C5AA00] hover:border-[#C5AA00] transition-colors"
                  aria-label="YouTube @sakala.id25"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@sakala_ina?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#C5AA00] hover:border-[#C5AA00] transition-colors"
                  aria-label="TikTok @sakala_ina"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a
                  href="mailto:contact@sakala-mc.id"
                  className="w-9 h-9 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#C5AA00] hover:border-[#C5AA00] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigasi Utama (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#C5AA00] uppercase block">
              NAVIGASI
            </span>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link href="/shop" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span>Supply &amp; Shop</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/bikes" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span>Garasi Motor</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span>Jurnal Perjalanan</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span>Tentang Sakala</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span>Lacak Pesanan</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span>Akun Anggota</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Kontak (Col 2) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#C5AA00] uppercase block">
              KONTAK
            </span>
            <ul className="space-y-3 text-xs text-[#94A3B8]">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C5AA00] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-[#64748B] uppercase font-bold">Email</span>
                  <a href="mailto:contact@sakala-mc.id" className="hover:text-white transition-colors">
                    contact@sakala-mc.id
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Lokasi (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#C5AA00] uppercase block">
              LOKASI
            </span>
            <div className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
              <MapPin className="w-4 h-4 text-[#C5AA00] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-white block font-medium">SAKALA MOTORCYCLE CLUB</strong>
                <span>Bandung, Jawa Barat</span>
                <span className="block text-[#64748B]">Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64748B]">
          <div>
            © SAKALA MOTORCYCLE CLUB. All rights reserved.
          </div>

          <div className="flex items-center gap-5 tracking-wider uppercase text-[10px]">
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
