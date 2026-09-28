import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Ruler, 
  Layers, 
  Check 
} from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-[#070F18] text-white">
      <Navbar />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-400 mb-8 pb-4 border-b border-white/10">
          <Link href="/shop" className="hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Katalog Toko</span>
          </Link>
          <span>/</span>
          <span className="text-[#F0D000]">{product.category}</span>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        {/* Client-Side Interactive Buying Experience */}
        <ProductDetailClient product={product} />

        {/* Related Apparel & Gear */}
        <section className="mt-20 pt-12 border-t border-white/10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#F0D000] uppercase block mb-1">
                Koleksi Resmi
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Produk Lainnya
              </h3>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold tracking-wider uppercase text-gray-300 hover:text-[#F0D000] transition-colors flex items-center gap-1.5"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/shop/${item.id}`}
                className="group bg-[#0C1724] border border-white/10 rounded-xs overflow-hidden shadow-xs hover:border-[#F0D000] transition-colors flex flex-col justify-between"
              >
                <div className="relative h-64 w-full bg-[#070F18] overflow-hidden flex items-center justify-center p-6">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-bold tracking-wider text-[#F0D000] uppercase block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-[#F0D000] transition-colors mb-2">
                    {item.name}
                  </h4>
                  <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs">
                    <span className="font-bold text-white">
                      Rp {item.price_idr.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#F0D000]">
                      Lihat Produk →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
