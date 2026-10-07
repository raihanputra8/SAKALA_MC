'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowRight, ShieldCheck, Check, ShoppingBag, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/database';
import { getProducts } from '@/lib/supabase/data';
import EditableWrapper from '@/components/cms/EditableWrapper';
import { useInlineCMS } from '@/context/InlineCMSContext';

const FILTER_TABS = [
  { id: 'all', label: 'SEMUA' },
  { id: 't-shirts', label: 'KAOS' },
  { id: 'hoodies', label: 'HOODIE' },
  { id: 'jackets', label: 'JAKET' },
  { id: 'headwear', label: 'TOPI' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('L');
  const [isAddedFeatured, setIsAddedFeatured] = useState(false);
  const { addToCart } = useCart();
  const { refreshKey } = useInlineCMS();

  useEffect(() => {
    async function loadProducts() {
      try {
        const prods = await getProducts();
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [refreshKey]);

  const featuredProduct = products.find((p) => p.sku === 'SKL-JKT-03') || products[0] || null;

  const handleAddFeatured = () => {
    if (!featuredProduct) return;
    addToCart(featuredProduct, selectedSize);
    setIsAddedFeatured(true);
    setTimeout(() => setIsAddedFeatured(false), 2200);
  };

  const filteredItems =
    activeCategory === 'all'
      ? products
      : products.filter((item) => item.category?.toLowerCase() === activeCategory.toLowerCase());

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

        {/* Featured Product Section */}
        {featuredProduct && (
          <section className="py-10 max-w-7xl mx-auto px-6 lg:px-12">
            <div className="bg-[#070F18] text-white p-8 sm:p-10 lg:p-14 rounded-xs shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                {/* LEFT COLUMN (Product Info) */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-2">
                    {featuredProduct.name}
                  </h2>

                  <p className="text-lg sm:text-xl font-bold text-[#F0D000] tracking-wide mb-6 uppercase">
                    SKU: {featuredProduct.sku}
                  </p>

                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-8 max-w-xl">
                    {featuredProduct.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Rp {featuredProduct.price_idr.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Action Area */}
                  <div className="space-y-5">
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

                    <div className="flex flex-wrap items-center gap-5 pt-1">
                      <button
                        onClick={handleAddFeatured}
                        className="bg-[#0047AB] hover:bg-[#00388A] active:scale-[0.99] text-white px-7 py-3.5 text-xs font-bold tracking-wider uppercase rounded-xs transition-all shadow-md"
                      >
                        {isAddedFeatured ? 'BERHASIL DITAMBAHKAN' : 'TAMBAH KE KERANJANG'}
                      </button>

                      <Link
                        href={`/shop/${featuredProduct.id}`}
                        className="text-xs font-bold tracking-wider uppercase text-gray-300 hover:text-[#F0D000] underline-offset-4 hover:underline transition-colors"
                      >
                        DETAIL PRODUK
                      </Link>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (Product Image) */}
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div className="relative w-full aspect-square max-w-[480px]">
                    <Image
                      src={featuredProduct.image_url}
                      alt={featuredProduct.name}
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Inventory Index Title */}
        <section className="pt-8 pb-4 max-w-7xl mx-auto px-6 lg:px-12">
          <span className="text-[10px] font-bold tracking-[0.22em] text-[#64748B] uppercase">
            SEMUA PRODUK
          </span>
        </section>

        {/* Products Grid */}
        <section className="pb-20 max-w-7xl mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="py-16 text-center text-xs text-[#64748B] font-mono tracking-wider">
              MEMUAT PRODUK...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white border border-[#E5E2D9] rounded-xs p-12 text-center">
              <p className="text-xs text-[#64748B] tracking-wider uppercase">
                Belum ada produk untuk kategori ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const isOutOfStock =
                  item.stock_status === 'waitlist' ||
                  item.stock_status === 'sold_out' ||
                  item.stock_count === 0;

                return (
                  <EditableWrapper
                    key={item.id}
                    item={{ type: 'product', id: item.id, data: item }}
                    className="h-full"
                  >
                    <div
                      className={`bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs transition-all duration-300 flex flex-col justify-between h-full ${
                        isOutOfStock
                          ? 'opacity-70 cursor-not-allowed select-none'
                          : 'hover:shadow-md hover:border-[#070F18] group'
                      }`}
                    >
                      {/* Image Box - satu kotak penuh (aspect-square object-cover) */}
                      {isOutOfStock ? (
                        <div className="relative aspect-square w-full bg-[#F5F4EF] border-b border-[#E5E2D9] overflow-hidden">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover w-full h-full grayscale-[40%]"
                          />
                          <div className="absolute top-3 left-3 bg-[#070F18]/90 text-white font-mono text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-xs uppercase shadow-xs">
                            HABIS
                          </div>
                        </div>
                      ) : (
                        <Link 
                          href={`/shop/${item.id}`}
                          className="relative aspect-square w-full bg-[#FAF9F5] border-b border-[#E5E2D9] overflow-hidden block"
                        >
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                      )}

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-[#78716C] uppercase block mb-1">
                            SKU: {item.sku}
                          </span>

                          {isOutOfStock ? (
                            <h3 className="font-serif-editorial text-sm font-bold text-[#78716C] leading-snug mb-2 cursor-not-allowed">
                              {item.name}
                            </h3>
                          ) : (
                            <Link href={`/shop/${item.id}`}>
                              <h3 className="font-serif-editorial text-sm font-bold text-[#070F18] leading-snug mb-2 group-hover:text-[#C5AA00] transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                          )}

                          <p className="text-[11px] text-[#78716C] leading-relaxed mb-4">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#E5E2D9] flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold font-mono text-[#070F18] block">
                              Rp {item.price_idr.toLocaleString('id-ID')}
                            </span>
                          </div>

                          {isOutOfStock ? (
                            <button
                              disabled
                              className="bg-[#F5F4EF] border border-[#E5E2D9] text-[#A8A29E] text-[9px] font-mono font-bold tracking-[0.16em] uppercase px-3.5 py-2 rounded-xs cursor-not-allowed select-none"
                            >
                              HABIS
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(item, selectedSize)}
                              className="bg-[#070F18] hover:bg-[#C5AA00] hover:text-[#070F18] text-white text-[10px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-xs transition-colors shadow-xs"
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
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
