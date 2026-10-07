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
  const [mounted, setMounted] = useState(false);

  // Close mobile menu on ESC key or desktop resize
  useEffect(() => {
    setMounted(true);
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

  const showAdminLink = mounted && isAdmin;

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
          <div className="flex items-center gap-2 sm:gap-5 z-50">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="text-[#070F18] hover:text-[#C5AA00] transition-colors p-2 flex items-center justify-center min-w-[40px] min-h-[40px] rounded-xs btn-tactile touch-manipulation cursor-pointer"
              aria-label="Open Search"
              title="Search archive"
            >
              <Search className="w-4.5 h-4.5 stroke-[2]" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center justify-center p-2 text-[#070F18] hover:text-[#C5AA00] transition-colors min-w-[40px] min-h-[40px] rounded-xs btn-tactile touch-manipulation cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#C5AA00] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none transition-transform hover:scale-110">
                {totalItems}
              </span>
            </button>

            {/* Admin CMS Link (Desktop only) */}
            {showAdminLink && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-[#C5AA00] hover:text-black hover:bg-[#C5AA00] transition-all py-1.5 px-2.5 border border-[#C5AA00] rounded-xs bg-[#C5AA00]/10 btn-tactile shadow-xs"
                title="Admin CMS Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>CMS PORTAL</span>
              </Link>
            )}

            {/* Account Profile / Login (Desktop) */}
            <div className="hidden sm:block">
              {mounted && user ? (
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

            {/* Mobile Burger Button (Ergonomic touch target & instant response) */}
            <div className="flex md:hidden items-center pl-1 sm:pl-2 border-l border-[#E5E2D9]">
              <button
                id="mobile-menu-burger-btn"
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className={`relative flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-xs border transition-all duration-200 cursor-pointer touch-manipulation select-none active:scale-95 focus:outline-none ${
                  mobileMenuOpen
                    ? 'bg-[#070F18] border-[#070F18] text-white shadow-sm'
                    : 'bg-white border-[#D8D4C7] text-[#070F18] hover:border-[#070F18] shadow-2xs'
                }`}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-white stroke-[2.2]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#070F18] stroke-[2.2]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-[#F5F4EF] border-t border-[#E5E2D9] z-50 flex flex-col justify-between overflow-y-auto overscroll-contain animate-fade-in shadow-xl">
            <div className="p-6 space-y-1">
              <span className="text-[10px] font-bold tracking-[0.22em] text-[#78716C] uppercase block mb-3 pb-2 border-b border-[#E5E2D9]">
                NAVIGASI
              </span>

              {/* Main Navigation Links matching desktop */}
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-[#E5E2D9]/70 hover:bg-[#EAE7DC] text-[#1E293B] hover:text-[#C5AA00] transition-colors group"
              >
                <span className="text-sm font-semibold tracking-[0.18em] uppercase group-hover:text-[#C5AA00] transition-colors">
                  SHOP
                </span>
                <ChevronRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#C5AA00] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/bikes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-[#E5E2D9]/70 hover:bg-[#EAE7DC] text-[#1E293B] hover:text-[#C5AA00] transition-colors group"
              >
                <span className="text-sm font-semibold tracking-[0.18em] uppercase group-hover:text-[#C5AA00] transition-colors">
                  BIKES
                </span>
                <ChevronRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#C5AA00] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/journal"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-[#E5E2D9]/70 hover:bg-[#EAE7DC] text-[#1E293B] hover:text-[#C5AA00] transition-colors group"
              >
                <span className="text-sm font-semibold tracking-[0.18em] uppercase group-hover:text-[#C5AA00] transition-colors">
                  JOURNAL
                </span>
                <ChevronRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#C5AA00] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-[#E5E2D9]/70 hover:bg-[#EAE7DC] text-[#1E293B] hover:text-[#C5AA00] transition-colors group"
              >
                <span className="text-sm font-semibold tracking-[0.18em] uppercase group-hover:text-[#C5AA00] transition-colors">
                  ABOUT
                </span>
                <ChevronRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#C5AA00] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-[#E5E2D9]/70 hover:bg-[#EAE7DC] text-[#1E293B] hover:text-[#C5AA00] transition-colors group"
              >
                <span className="text-sm font-semibold tracking-[0.18em] uppercase group-hover:text-[#C5AA00] transition-colors">
                  LACAK PESANAN
                </span>
                <ChevronRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#C5AA00] group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Direct Account Option in the main menu */}
              <Link
                href={mounted && user ? "/account" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-3 rounded-xs border-b border-[#E5E2D9]/70 hover:bg-[#EAE7DC] text-[#1E293B] hover:text-[#C5AA00] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#78716C] group-hover:text-[#C5AA00] transition-colors" />
                  <span className="text-sm font-semibold tracking-[0.18em] uppercase group-hover:text-[#C5AA00] transition-colors">
                    {mounted && user ? 'AKUN SAYA' : 'MASUK KE AKUN'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#C5AA00] group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Admin CMS Portal (if admin) */}
              {showAdminLink && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3.5 px-3 rounded-xs bg-[#C5AA00]/15 border border-[#C5AA00] hover:bg-[#C5AA00]/25 text-[#070F18] transition-colors mt-3"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#070F18]" />
                    <span className="text-xs font-bold tracking-[0.16em] uppercase">
                      CMS PORTAL
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#070F18]" />
                </Link>
              )}
            </div>

            {/* Mobile Footer / Account Action Area */}
            <div className="p-6 border-t border-[#E5E2D9] bg-[#EAE7DC]/60">
              {mounted && user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-xs bg-white border border-[#D8D4C7] hover:border-[#070F18] transition-colors mb-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C5AA00]/70 flex-shrink-0">
                      <Image
                        src={user.user_metadata?.avatar_url || '/assets/avatar_user.png'}
                        alt="Member Avatar"
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#070F18] block leading-tight">
                        {user.user_metadata?.full_name || 'Anggota Sakala'}
                      </span>
                      <span className="text-[10px] text-[#64748B] block truncate max-w-[170px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#070F18] tracking-wider uppercase border border-[#070F18] px-2.5 py-1 rounded-xs bg-[#FAF9F5]">
                    PROFIL
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 bg-[#070F18] hover:bg-[#0047AB] text-white text-xs font-bold tracking-[0.18em] uppercase rounded-xs transition-colors flex items-center justify-center gap-2 mb-3 btn-tactile shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>MASUK KE AKUN (SIGN IN)</span>
                </Link>
              )}

              <div className="text-center text-[9px] tracking-[0.25em] text-[#78716C] uppercase font-medium">
                SAKALA MOTORCYCLE CLUB — BANDUNG
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
