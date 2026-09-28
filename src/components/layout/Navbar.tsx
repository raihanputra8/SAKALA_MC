'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag, Shield, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from '@/components/search/SearchModal';

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { user, isAdmin } = useAuth();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on ESC key or desktop resize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'bg-[#F5F4EF]/95 backdrop-blur-md border-[#D8D4C7] shadow-sm py-0'
          : 'glass-header border-[#E5E2D9]'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group z-50 py-1"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/cakra_rahayu_kencana.png"
                alt="Cakra Rahayu Kencana — SAKALA Sacred Emblem"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-col transition-transform duration-200 group-hover:translate-x-0.5">
              <span className="font-western text-base sm:text-lg tracking-[0.08em] text-[#070F18] leading-none group-hover:text-[#C5AA00] transition-colors">
                SAKALA
              </span>
              <span className="text-[9px] tracking-[0.25em] font-medium text-[#737373] uppercase mt-1">
                BANDUNG
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-10 text-xs font-semibold tracking-[0.18em] text-[#1E293B]">
            <Link href="/shop" className="nav-link-animated hover:text-[#C5AA00] transition-colors uppercase">
              SHOP
            </Link>
            <Link href="/bikes" className="nav-link-animated hover:text-[#C5AA00] transition-colors uppercase">
              BIKES
            </Link>
            <Link href="/journal" className="nav-link-animated hover:text-[#C5AA00] transition-colors uppercase">
              JOURNAL
            </Link>
            <Link href="/about" className="nav-link-animated hover:text-[#C5AA00] transition-colors uppercase">
              ABOUT
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-5 z-50">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="text-[#070F18] hover:text-[#C5AA00] transition-colors p-1.5 flex items-center gap-1.5 btn-tactile"
              aria-label="Open Search"
              title="Search archive"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center p-1.5 text-[#070F18] hover:text-[#C5AA00] transition-colors btn-tactile"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span className="absolute -top-1 -right-2 bg-[#C5AA00] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-transform hover:scale-110">
                {totalItems}
              </span>
            </button>

            {/* Admin CMS Link (Desktop only) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.14em] uppercase text-[#C5AA00] hover:text-[#070F18] hover:border-[#070F18] transition-all py-1 px-2 border border-[#C5AA00]/30 rounded-xs bg-[#C5AA00]/5 btn-tactile"
                title="Admin CMS Dashboard"
              >
                <Shield className="w-3 h-3" />
                <span>CMS</span>
              </Link>
            )}

            {/* Account Profile / Login (Desktop) */}
            <div className="hidden sm:block">
              {user ? (
                <Link 
                  href="/account"
                  className="w-7 h-7 rounded-full overflow-hidden border border-[#C5AA00]/70 flex-shrink-0 hover:border-[#070F18] hover:scale-105 transition-all btn-tactile block"
                  aria-label="Member Profile"
                  title={`Signed in as ${user.user_metadata?.full_name || user.email}`}
                >
                  <Image
                    src={user.user_metadata?.avatar_url || '/assets/avatar_user.png'}
                    alt="Member Avatar"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#070F18] hover:text-[#C5AA00] transition-colors py-1.5 px-3 border border-[#E5E2D9] rounded-xs bg-white shadow-xs btn-tactile"
                  aria-label="Sign In"
                >
                  <User className="w-3.5 h-3.5 stroke-[2]" />
                  <span className="text-[10px] tracking-[0.16em] uppercase">SIGN IN</span>
                </Link>
              )}
            </div>

            {/* Mobile Burger Button (Prominent & tactile on mobile) */}
            <div className="flex md:hidden items-center pl-1 border-l border-[#E5E2D9]">
              <button
                id="mobile-menu-burger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xs border transition-all duration-200 focus:outline-none ${
                  mobileMenuOpen
                    ? 'bg-[#070F18] border-[#C5AA00] text-[#C5AA00]'
                    : 'bg-white border-[#D8D4C7] text-[#070F18] hover:border-[#C5AA00] hover:text-[#C5AA00] shadow-2xs'
                }`}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {/* Classic 3-bar hamburger lines */}
                <div className="w-4.5 h-3.5 flex flex-col justify-between items-center pointer-events-none">
                  <span
                    className={`w-full h-0.5 rounded-full transition-all duration-300 transform origin-center ${
                      mobileMenuOpen
                        ? 'rotate-45 translate-y-[5px] bg-[#C5AA00]'
                        : 'bg-current'
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 rounded-full transition-all duration-200 ${
                      mobileMenuOpen ? 'opacity-0 scale-0' : 'bg-current opacity-100'
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 rounded-full transition-all duration-300 transform origin-center ${
                      mobileMenuOpen
                        ? '-rotate-45 -translate-y-[5px] bg-[#C5AA00]'
                        : 'bg-current'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-[#070F18]/98 backdrop-blur-xl border-t border-[#C5AA00]/20 z-50 flex flex-col justify-between overflow-y-auto animate-fade-in">
            <div className="p-6 space-y-2">
              <span className="text-[9px] font-bold tracking-[0.3em] text-[#C5AA00] uppercase block mb-3">
                MENU NAVIGASI
              </span>

              {/* Navigation Links */}
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div>
                  <span className="font-serif-editorial text-xl font-bold tracking-wider text-white group-hover:text-[#C5AA00] transition-colors block">
                    SHOP
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-[#94A3B8] uppercase">
                    Pakaian &amp; Perlengkapan
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C5AA00] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/bikes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div>
                  <span className="font-serif-editorial text-xl font-bold tracking-wider text-white group-hover:text-[#C5AA00] transition-colors block">
                    GARASI MOTOR
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-[#94A3B8] uppercase">
                    Katalog Motor Kustom
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C5AA00] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/journal"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div>
                  <span className="font-serif-editorial text-xl font-bold tracking-wider text-white group-hover:text-[#C5AA00] transition-colors block">
                    JURNAL
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-[#94A3B8] uppercase">
                    Catatan Perjalanan
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C5AA00] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div>
                  <span className="font-serif-editorial text-xl font-bold tracking-wider text-white group-hover:text-[#C5AA00] transition-colors block">
                    TENTANG SAKALA
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-[#94A3B8] uppercase">
                    Profil &amp; Nilai
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C5AA00] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div>
                  <span className="font-serif-editorial text-xl font-bold tracking-wider text-white group-hover:text-[#C5AA00] transition-colors block">
                    LACAK PESANAN
                  </span>
                  <span className="text-[10px] tracking-[0.18em] text-[#94A3B8] uppercase">
                    Status Pengiriman / Resi
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C5AA00] group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Admin CMS (if admin) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3.5 px-3 rounded-xs bg-[#C5AA00]/10 border border-[#C5AA00]/30 hover:bg-[#C5AA00]/20 transition-colors mt-2"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#C5AA00]" />
                    <span className="text-xs font-bold tracking-[0.16em] text-[#C5AA00] uppercase">
                      ADMIN CMS PORTAL
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C5AA00]" />
                </Link>
              )}
            </div>

            {/* Mobile Footer Area */}
            <div className="p-6 border-t border-white/10 bg-black/40">
              {user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xs bg-white/5 border border-white/10 hover:border-[#C5AA00] transition-colors mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5AA00]/70 flex-shrink-0">
                      <Image
                        src={user.user_metadata?.avatar_url || '/assets/avatar_user.png'}
                        alt="Member Avatar"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {user.user_metadata?.full_name || 'Anggota Sakala'}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] block truncate max-w-[180px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#C5AA00] tracking-wider uppercase">
                    PROFIL
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#C5AA00] hover:bg-[#B39900] text-black text-xs font-bold tracking-[0.2em] uppercase rounded-xs transition-colors flex items-center justify-center gap-2 mb-4 btn-tactile"
                >
                  <User className="w-4 h-4" />
                  <span>SIGN IN</span>
                </Link>
              )}

              <div className="text-center text-[9px] tracking-[0.25em] text-[#64748B] uppercase">
                BANDUNG, JAWA BARAT
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
