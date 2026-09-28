'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowRight, ShieldCheck, Check, ShoppingBag, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/database';
import EditableWrapper from '@/components/cms/EditableWrapper';

const CATALOG_ITEMS: Product[] = [
  {
    id: 'prod-01',
    sku: 'SKL-TEE-01',
    name: 'CIRCLE EMBLEM HEAVYWEIGHT TEE',
    category: 't-shirts',
    price_idr: 385000,
    price_usd: 26,
    stock_status: 'available',
    stock_count: 15,
    description: '280 GSM Cotton. Warna Off-White dengan sablon logo Sakala navy.',
    image_url: '/assets/product_tee.png',
  },
  {
    id: 'prod-02',
    sku: 'SKL-HD-02',
    name: 'GARAGE CREW ZIP HOODIE',
    category: 'hoodies',
    price_idr: 720000,
    price_usd: 52,
    stock_status: 'low_stock',
    stock_count: 4,
    description: '480 GSM French Terry. Warna hitam dengan bordir kuning keemasan.',
    image_url: '/assets/product_hoodie.png',
  },
  {
    id: 'prod-03',
    sku: 'SKL-JKT-03',
    name: 'BROTHERHOOD COACH JACKET',
    category: 'jackets',
    price_idr: 1150000,
    price_usd: 82,
    stock_status: 'available',
    stock_count: 8,
    description: 'Bahan nylon tahan angin warna biru Sakala dengan furing berlapis.',
    image_url: '/assets/product_jacket.png',
  },
  {
    id: 'prod-04',
    sku: 'SKL-CAP-04',
    name: 'LOYALTY TRUCKER CAP',
    category: 'headwear',
    price_idr: 260000,
    price_usd: 18,
    stock_status: 'waitlist',
    stock_count: 0,
    description: 'Topi jaring & twill hitam dengan pengunci logam.',
    image_url: '/assets/product_cap.png',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'SEMUA' },
  { id: 't-shirts', label: 'KAOS' },
  { id: 'hoodies', label: 'HOODIE' },
  { id: 'jackets', label: 'JAKET' },
  { id: 'headwear', label: 'TOPI' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('L');
  const [isAddedFeatured, setIsAddedFeatured] = useState(false);
  const { addToCart } = useCart();

  const handleAddFeatured = () => {
    addToCart(CATALOG_ITEMS[2], selectedSize);
    setIsAddedFeatured(true);
    setTimeout(() => setIsAddedFeatured(false), 2200);
  };

  const filteredItems =
    activeCategory === 'all'
      ? CATALOG_ITEMS
      : CATALOG_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5]">
      <Navbar />

      <main className="flex-1">
        {/* Header Banner */}
        <section className="pt-12 pb-8 border-b border-[#E5E2D9]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif-editorial text-4xl sm:text-6xl font-black text-[#070F18] tracking-tight leading-none mb-3">
                MERCHANDISE SAKALA
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] max-w-2xl leading-relaxed">
                Koleksi merchandise resmi Sakala. Kaos, hoodie, jaket, dan aksesori berkendara dari Bandung.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white border border-[#E5E2D9] px-4 py-2.5 rounded-xs flex-shrink-0 shadow-xs">
              <div className="w-8 h-8 rounded bg-[#070F18] flex items-center justify-center p-1.5 flex-shrink-0">
                <Image
                  src="/assets/sakala_emblem.png"
                  alt="Sakala Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#070F18] uppercase block">
                  PRODUK RESMI
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#64748B] uppercase block">
                  SAKALA BANDUNG
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar & Controls */}
        <section className="py-4 bg-[#F5F4EF] border-b border-[#E5E2D9] sticky top-20 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`text-[10px] font-bold tracking-[0.16em] uppercase px-3 py-1.5 rounded-xs transition-colors ${
                    activeCategory === tab.id
                      ? 'bg-[#070F18] text-white shadow-xs'
                      : 'bg-white text-[#475569] border border-[#E5E2D9] hover:border-[#070F18]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Size Selector */}
            <div className="flex items-center gap-3 self-end lg:self-auto">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase">
                UKURAN:
              </span>
              <div className="flex items-center gap-1.5">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-7 h-7 text-[10px] font-bold rounded-xs flex items-center justify-center transition-colors ${
                      selectedSize === size
                        ? 'bg-[#070F18] text-white'
                        : 'bg-white border border-[#E5E2D9] text-[#64748B] hover:border-[#070F18]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Product Banner - Archival Specimen Showcase */}
        <section className="py-8 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative bg-[#09111C] text-white rounded-xs border border-[#1E293B] shadow-2xl overflow-hidden">
            {/* Subtle Technical Grid Background Accents */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0047AB]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5AA00]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Archival Ledger Top Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-[#1E293B] bg-[#070D16]/90 text-[10px] font-mono tracking-[0.2em] text-[#94A3B8] uppercase">
              <div className="flex items-center gap-3">
                <span className="text-[#C5AA00] font-bold">[ SPEC NO. SKL-JKT-03 ]</span>
                <span className="hidden sm:inline text-[#475569]">|</span>
                <span className="hidden sm:inline">SAKALA MOTO APPAREL DIVISION</span>
                <span className="hidden sm:inline text-[#475569]">|</span>
                <span className="hidden md:inline text-[#64748B]">BATCH: 02 // BANDUNG</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-bold">READY TO SHIP — 8 PCS TERSISA</span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Product Information & Controls */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Category Pill & Badge */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold tracking-[0.22em] uppercase bg-[#C5AA00]/15 text-[#C5AA00] border border-[#C5AA00]/30 rounded-xs">
                      <Sparkles className="w-3 h-3" />
                      EDISI RESMI SAKALA MC
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#64748B] uppercase">
                      HEAVYWEATHER COACH RIDING SPEC
                    </span>
                  </div>

                  {/* Main Headings */}
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[0.95] mb-2 font-sans">
                    BROTHERHOOD
                  </h2>
                  <div className="text-base sm:text-lg font-bold tracking-[0.2em] text-[#C5AA00] uppercase font-mono mb-4 flex items-center gap-2">
                    <span>COACH JACKET</span>
                    <span className="text-[#475569]">//</span>
                    <span className="text-[#94A3B8] font-normal text-xs sm:text-sm">NAVY HERITAGE</span>
                  </div>

                  {/* Editorial Description */}
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-xl font-normal">
                    Jaket coach berkarakter tangguh berbahan nylon tahan angin berdensitas tinggi dengan warna biru khas Sakala. Dirancang dengan potongan relaxed fit untuk kenyamanan riding malam, proteksi terpaan angin jalanan, dan gaya harian.
                  </p>

                  {/* Technical Garment Specs Sheet */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xs bg-[#070D16]/80 border border-[#1E293B] mb-6 max-w-xl text-[11px]">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold tracking-[0.16em] text-[#C5AA00] uppercase">MATERIAL</span>
                      <span className="text-slate-300 font-medium mt-0.5">High-Density Windproof Nylon</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold tracking-[0.16em] text-[#C5AA00] uppercase">FURING / LINING</span>
                      <span className="text-slate-300 font-medium mt-0.5">Soft Breathable Quilted Lining</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold tracking-[0.16em] text-[#C5AA00] uppercase">BORDIR BELAKANG</span>
                      <span className="text-slate-300 font-medium mt-0.5">Golden SAKALA Arch Typography</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono font-bold tracking-[0.16em] text-[#C5AA00] uppercase">FITUR RIDING</span>
                      <span className="text-slate-300 font-medium mt-0.5">Brass Snaps & Drawcord Wind-Lock</span>
                    </div>
                  </div>
                </div>

                {/* Price & In-Card Size Selector & Action */}
                <div className="pt-4 border-t border-[#1E293B] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#64748B] uppercase block mb-1">
                        HARGA RESMI // IDR & USD
                      </span>
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                          Rp 1.150.000
                        </span>
                        <span className="text-xs font-mono text-[#94A3B8]">
                          $82 USD
                        </span>
                      </div>
                    </div>

                    {/* Integrated In-Card Size Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#C5AA00] uppercase">
                          PILIH UKURAN:
                        </span>
                        <span className="text-[9px] text-[#64748B] font-mono">TERPILIH: {selectedSize}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {SIZES.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-8 h-8 text-[11px] font-bold rounded-xs flex items-center justify-center transition-all ${
                              selectedSize === size
                                ? 'bg-[#C5AA00] text-[#070F18] font-black shadow-md scale-105'
                                : 'bg-[#0F1A2A] text-slate-300 border border-[#22354E] hover:border-[#C5AA00] hover:text-white'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleAddFeatured}
                      className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-xs font-bold tracking-[0.18em] uppercase rounded-xs transition-all shadow-lg active:scale-[0.98] ${
                        isAddedFeatured
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                          : 'bg-[#0047AB] hover:bg-[#00388A] text-white shadow-[#0047AB]/25'
                      }`}
                    >
                      {isAddedFeatured ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>BERHASIL DITAMBAHKAN! ({selectedSize})</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>TAMBAH KE KERANJANG ({selectedSize})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <Link
                      href="/shop/prod-03"
                      className="inline-flex items-center justify-center gap-2 bg-[#0F1A2A] hover:bg-[#16253B] text-slate-300 hover:text-white border border-[#22354E] hover:border-[#475569] px-5 py-3.5 text-xs font-bold tracking-[0.16em] uppercase rounded-xs transition-colors"
                    >
                      <span>DETAIL PRODUK</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Lookbook Specimen Plate */}
              <div className="lg:col-span-5">
                <div className="relative rounded-xs border border-[#22354E] bg-[#0E1724] p-3 shadow-xl group/plate">
                  {/* Corner Crosshair Accents */}
                  <span className="absolute -top-1.5 -left-1.5 text-xs font-mono text-[#C5AA00]/60 select-none">+</span>
                  <span className="absolute -top-1.5 -right-1.5 text-xs font-mono text-[#C5AA00]/60 select-none">+</span>
                  <span className="absolute -bottom-1.5 -left-1.5 text-xs font-mono text-[#C5AA00]/60 select-none">+</span>
                  <span className="absolute -bottom-1.5 -right-1.5 text-xs font-mono text-[#C5AA00]/60 select-none">+</span>

                  {/* Photo Container Celebrating The Natural Grounding Texture */}
                  <div className="relative h-72 sm:h-96 w-full rounded-xs overflow-hidden border border-[#22354E]/70 bg-[#070D16]">
                    <Image
                      src="/assets/product_jacket.png"
                      alt="Brotherhood Coach Jacket - Tampak Belakang"
                      fill
                      className="object-cover group-hover/plate:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Subtle Gradient Overlay at bottom for readable badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070D16]/90 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Plate Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 text-[9px] font-mono font-bold tracking-[0.18em] uppercase bg-[#070D16]/85 text-white border border-white/20 rounded-xs backdrop-blur-xs">
                        SPECIMEN NO. 03 // REAR ARCH
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-1 text-[9px] font-mono font-bold tracking-[0.16em] uppercase bg-[#C5AA00]/90 text-[#070F18] font-black rounded-xs">
                        ARCHIVAL
                      </span>
                    </div>

                    {/* Bottom Plate Annotations */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-white tracking-[0.18em] uppercase block drop-shadow-sm">
                          GOLDEN ARCH EMBROIDERY
                        </span>
                        <span className="text-[9px] font-mono text-[#94A3B8] tracking-[0.14em] uppercase block">
                          BANDUNG CRAFTED · RIDER SPEC
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white/80">
                        <span className="text-[10px] font-mono">03</span>
                      </div>
                    </div>
                  </div>

                  {/* Footnote under photo */}
                  <div className="flex items-center justify-between mt-2.5 px-1 text-[9px] font-mono text-[#64748B] uppercase tracking-wider">
                    <span>ASPHALT FLATLAY SPECIMEN</span>
                    <span>100% AUTHENTIC SAKALA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inventory Index Title */}
        <section className="pt-8 pb-4 max-w-7xl mx-auto px-6 lg:px-12">
          <span className="text-[10px] font-bold tracking-[0.22em] text-[#64748B] uppercase">
            SEMUA PRODUK
          </span>
        </section>

        {/* Products Grid */}
        <section className="pb-20 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const isWaitlist = item.stock_status === 'waitlist';

              return (
                <EditableWrapper
                  key={item.id}
                  item={{ type: 'product', id: item.id, data: item }}
                  className="h-full"
                >
                  <div
                    className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full"
                  >
                    <Link 
                      href={`/shop/${item.id}`}
                      className="relative h-64 w-full bg-[#FAF9F5] p-6 flex items-center justify-center border-b border-[#E5E2D9] overflow-hidden block"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                          SKU: {item.sku}
                        </span>
                        <Link href={`/shop/${item.id}`}>
                          <h3 className="font-serif-editorial text-sm font-bold text-[#070F18] leading-snug mb-2 group-hover:text-[#0047AB] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-[#64748B] leading-relaxed mb-4">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E5E2D9] flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#070F18] block">
                            Rp {item.price_idr.toLocaleString('id-ID')}
                          </span>
                        </div>

                        {isWaitlist ? (
                          <span
                            className="bg-[#FAF9F5] border border-[#E5E2D9] text-[#64748B] text-[9px] font-bold tracking-[0.16em] uppercase px-3 py-2 rounded-xs"
                          >
                            HABIS
                          </span>
                        ) : (
                          <button
                            onClick={() => addToCart(item, selectedSize)}
                            className="bg-[#070F18] hover:bg-[#0047AB] text-white text-[10px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-xs transition-colors shadow-xs"
                          >
                            BELI
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </EditableWrapper>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
