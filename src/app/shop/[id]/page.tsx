import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getProductById, getProducts } from '@/lib/supabase/data';
import ProductDetailClient from '@/components/shop/ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#64748B] mb-8 pb-4 border-b border-[#E5E2D9]">
          <Link href="/shop" className="hover:text-[#070F18] flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Katalog Toko</span>
          </Link>
          <span>/</span>
          <span className="text-[#0047AB]">{product.category}</span>
          <span>/</span>
          <span className="text-[#070F18] font-bold">{product.name}</span>
        </div>

        {/* Client-Side Interactive Buying Experience */}
        <ProductDetailClient product={product} />

        {/* Related Apparel & Gear */}
        <section className="mt-20 pt-12 border-t border-[#E5E2D9]">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#0047AB] uppercase block mb-1">
                Koleksi Resmi
              </span>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#070F18]">
                Produk Lainnya
              </h3>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold tracking-wider uppercase text-[#64748B] hover:text-[#0047AB] transition-colors flex items-center gap-1.5"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item) => {
              const isItemOutOfStock =
                item.stock_status === 'waitlist' ||
                item.stock_status === 'sold_out' ||
                item.stock_count === 0;

              return isItemOutOfStock ? (
                <div
                  key={item.id}
                  className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs flex flex-col justify-between opacity-70 cursor-not-allowed select-none"
                >
                  <div className="relative aspect-square w-full bg-[#F5F4EF] overflow-hidden border-b border-[#E5E2D9]">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover w-full h-full grayscale-[40%]"
                    />
                    <div className="absolute top-3 left-3 bg-[#070F18]/90 text-white font-mono text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-xs uppercase">
                      HABIS
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-mono tracking-widest text-[#78716C] uppercase block mb-1">
                      {item.category}
                    </span>
                    <h4 className="font-serif-editorial text-base font-bold text-[#78716C] mb-2">
                      {item.name}
                    </h4>
                    <div className="flex justify-between items-center pt-3 border-t border-[#E5E2D9] text-xs">
                      <span className="font-mono font-bold text-[#070F18]">
                        Rp {item.price_idr.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#A8A29E]">
                        STOK HABIS
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={`/shop/${item.id}`}
                  className="group bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs hover:border-[#070F18] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full bg-[#FAF9F5] overflow-hidden border-b border-[#E5E2D9]">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-mono tracking-widest text-[#78716C] uppercase block mb-1">
                      {item.category}
                    </span>
                    <h4 className="font-serif-editorial text-base font-bold text-[#070F18] group-hover:text-[#C5AA00] transition-colors mb-2">
                      {item.name}
                    </h4>
                    <div className="flex justify-between items-center pt-3 border-t border-[#E5E2D9] text-xs">
                      <span className="font-mono font-bold text-[#070F18]">
                        Rp {item.price_idr.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] font-bold tracking-wider uppercase text-[#070F18] group-hover:text-[#C5AA00] group-hover:translate-x-0.5 transition-all">
                        Lihat Produk →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
