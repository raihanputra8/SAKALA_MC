'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import EditableWrapper from '@/components/cms/EditableWrapper';
import { useInlineCMS } from '@/context/InlineCMSContext';
import { supabase } from '@/lib/supabase/client';
import { resolveAssetUrl } from '@/lib/supabase/data';

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 't-shirts', label: 'T-SHIRTS' },
  { id: 'hoodies', label: 'HOODIES' },
  { id: 'jackets', label: 'JACKETS' },
  { id: 'headwear', label: 'HEADWEAR' },
  { id: 'accessories', label: 'ACCESSORIES' },
];

export default function SupplySection({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { isEditMode, refreshKey } = useInlineCMS();

  // Re-fetch data when CMS triggers a refresh
  const refetchProducts = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        setProducts((data as Product[]).map(p => ({ ...p, image_url: resolveAssetUrl(p.image_url) })));
      }
    } catch {
      // keep existing data
    }
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      refetchProducts();
    }
  }, [refreshKey, refetchProducts]);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="supply" className="bg-[#F5F4EF] py-12 sm:py-16 lg:py-24 border-b border-[#E5E2D9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header & Category Filters */}
        <ScrollReveal direction="up" delay={50} className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase mb-2 block">
              MERCHANDISE RESMI
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#070F18] tracking-tight leading-tight">
              SAKALA SUPPLY
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
              Pakaian dan perlengkapan resmi Sakala Motorcycle Club.
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <span className="sm:hidden text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
              ← Geser Produk →
            </span>
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-[9px] font-bold tracking-[0.16em] uppercase px-3 py-1.5 rounded-xs transition-all duration-200 btn-tactile ${
                    activeCategory === cat.id
                      ? 'bg-[#070F18] text-white shadow-xs'
                      : 'bg-white text-[#475569] border border-[#E5E2D9] hover:border-[#070F18]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Products: Horizontal Swipe on Mobile, 2/4-Col Grid on Desktop */}
        <div className="flex sm:grid overflow-x-auto snap-x snap-mandatory no-scrollbar sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pb-3 -mx-6 px-6 sm:mx-0 sm:px-0 mb-8 sm:mb-10">
          {filteredProducts.map((product, idx) => {
            const isWaitlist = product.stock_status === 'waitlist';

            return (
              <div key={product.id} className="w-[72vw] sm:w-auto shrink-0 snap-center">
                <ScrollReveal direction="up" delay={60 + (idx % 4) * 80}>
                  <EditableWrapper
                    item={{ type: 'product', id: product.id, data: product as unknown as Record<string, unknown> }}
                  >
                  <div className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs card-interactive flex flex-col justify-between group h-full hover:border-[#070F18]">
                    {/* Image Container */}
                    <div className="relative h-56 w-full bg-[#FAF9F5] p-5 flex items-center justify-center border-b border-[#E5E2D9] overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain group-hover:scale-106 transition-transform duration-500 ease-out"
                        />
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* SKU & Stock Tag */}
                        <div className="flex items-center justify-between text-[9px] font-bold tracking-[0.18em] uppercase mb-1.5">
                          <span className="text-[#64748B]">SKU: {product.sku}</span>
                          <span
                            className={`font-semibold ${
                              product.stock_status === 'available'
                                ? 'text-emerald-700'
                                : product.stock_status === 'low_stock'
                                ? 'text-amber-700'
                                : 'text-slate-500'
                            }`}
                          >
                            {product.stock_status === 'low_stock'
                              ? `ONLY ${product.stock_count} LEFT`
                              : product.stock_status.toUpperCase()}
                          </span>
                        </div>

                        {/* Product Title */}
                        <h3 className="font-serif-editorial text-sm font-bold text-[#070F18] tracking-tight leading-snug mb-1.5 group-hover:text-[#0047AB] transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className="text-[11px] text-[#64748B] leading-relaxed mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Action Button */}
                      <div className="pt-3 border-t border-[#E5E2D9] flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#070F18] tracking-wide block">
                            IDR {product.price_idr.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[9px] text-[#94A3B8] font-medium block">
                            ${product.price_usd} USD
                          </span>
                        </div>

                        {!isEditMode && (
                          isWaitlist ? (
                            <button
                              onClick={() => alert(`Registered for waitlist: ${product.name}`)}
                              className="bg-[#FAF9F5] border border-[#E5E2D9] hover:bg-[#070F18] hover:text-white text-[#070F18] text-[9px] font-bold tracking-[0.16em] uppercase px-2.5 py-1.5 rounded-xs transition-colors btn-tactile"
                            >
                              WAITLIST
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="w-7 h-7 rounded-xs bg-[#070F18] hover:bg-[#C5AA00] text-white hover:text-black flex items-center justify-center transition-colors shadow-xs btn-tactile"
                              aria-label={`Add ${product.name} to Cart`}
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </EditableWrapper>
              </ScrollReveal>
            </div>
          );
        })}
      </div>

        {/* View All Supply CTA */}
        <ScrollReveal direction="up" delay={150} className="flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#070F18] hover:bg-[#0047AB] text-white px-7 py-3 text-xs font-bold tracking-[0.18em] uppercase rounded-xs transition-all duration-300 shadow-md group btn-tactile"
          >
            <span>LIHAT SEMUA PRODUK</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
