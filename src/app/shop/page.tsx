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

        {/* Featured Product Section - Clean Vintage Motorcycle Club Style */}
        <section className="py-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-[#070F18] text-white p-8 sm:p-10 lg:p-14 rounded-xs shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* LEFT COLUMN (Product Info) */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                {/* 1. Title: "BROTHERHOOD" (Massive, bold, white font) */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-2">
                  BROTHERHOOD
                </h1>

                {/* 2. Subtitle: "Coach Jacket - Navy Heritage" (Simple, golden yellow, no slashes) */}
                <p className="text-lg sm:text-xl font-bold text-[#F0D000] tracking-wide mb-6">
                  Coach Jacket - Navy Heritage
                </p>

                {/* 3. Description: White, readable paragraph */}
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-8 max-w-xl">
                  Jaket coach berkarakter tangguh berbahan nylon tahan angin berdensitas tinggi dengan warna biru khas Sakala. Dirancang dengan potongan relaxed fit untuk kenyamanan riding malam, proteksi terpaan angin jalanan, dan gaya harian.
                </p>

                {/* 4. Specs Grid: A simple, clean 2x2 text grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8 pb-8 border-b border-white/10 max-w-xl">
                  <div>
                    <span className="text-xs font-bold text-[#F0D000] uppercase block mb-1">Material</span>
                    <span className="text-sm text-white font-medium">High-Density Windproof Nylon</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F0D000] uppercase block mb-1">Furing / Lining</span>
                    <span className="text-sm text-white font-medium">Soft Breathable Quilted Lining</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F0D000] uppercase block mb-1">Bordir Belakang</span>
                    <span className="text-sm text-white font-medium">Golden SAKALA Arch Typography</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F0D000] uppercase block mb-1">Fitur Riding</span>
                    <span className="text-sm text-white font-medium">Brass Snaps & Drawcord Wind-Lock</span>
                  </div>
                </div>

                {/* 5. Price: "Rp 1.150.000" (Bold, prominent, clean) */}
                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Rp 1.150.000
                  </span>
                </div>

                {/* 6. Action Area */}
                <div className="space-y-5">
                  {/* Size selector buttons (S, M, L, XL, XXL) in a clean row */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Ukuran:
                    </span>
                    <div className="flex items-center gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-9 h-9 text-xs font-bold rounded-xs flex items-center justify-center transition-colors ${
                            selectedSize === size
                              ? 'bg-[#F0D000] text-[#070F18]'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* A solid blue CTA Button: "TAMBAH KE KERANJANG" next to a "DETAIL PRODUK" link */}
                  <div className="flex flex-wrap items-center gap-5 pt-1">
                    <button
                      onClick={handleAddFeatured}
                      className="bg-[#0047AB] hover:bg-[#00388A] active:scale-[0.99] text-white px-7 py-3.5 text-xs font-bold tracking-wider uppercase rounded-xs transition-all shadow-md"
                    >
                      {isAddedFeatured ? 'BERHASIL DITAMBAHKAN' : 'TAMBAH KE KERANJANG'}
                    </button>

                    <Link
                      href="/shop/prod-03"
                      className="text-xs font-bold tracking-wider uppercase text-gray-300 hover:text-[#F0D000] underline-offset-4 hover:underline transition-colors"
                    >
                      DETAIL PRODUK
                    </Link>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (Product Image) */}
              {/* Completely clean image: NO borders, NO text overlays, NO techy crosshairs, NO specimen labels */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-[480px]">
                  <Image
                    src="/assets/product_jacket.png"
                    alt="Brotherhood Coach Jacket - SAKALA"
                    fill
                    priority
                    className="object-contain"
                  />
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
