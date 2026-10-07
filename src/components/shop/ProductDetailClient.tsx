'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Check, 
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    router.push('/checkout');
  };

  const isBrotherhoodJacket = product.id === 'prod-03' || product.name.includes('COACH JACKET');
  const title = isBrotherhoodJacket ? 'BROTHERHOOD' : product.name;
  const subtitle = isBrotherhoodJacket ? 'Coach Jacket - Navy Heritage' : product.category.toUpperCase();
  const description = isBrotherhoodJacket 
    ? 'Jaket coach berkarakter tangguh berbahan nylon tahan angin berdensitas tinggi dengan warna biru khas Sakala. Dirancang dengan potongan relaxed fit untuk kenyamanan riding malam, proteksi terpaan angin jalanan, dan gaya harian.'
    : product.description;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      {/* LEFT COLUMN (Product Info) */}
      <div className="lg:col-span-7 flex flex-col justify-center">
        {/* Subtitle / Category Badge */}
        <div className="mb-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0047AB] uppercase">
            {subtitle}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-black text-[#070F18] tracking-tight leading-tight mb-4">
          {title}
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6 max-w-xl">
          {description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-6 p-5 bg-white border border-[#E5E2D9] rounded-xs max-w-xl shadow-2xl/5">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">Material</span>
            <span className="text-xs font-semibold text-[#070F18]">
              {isBrotherhoodJacket ? 'High-Density Windproof Nylon' : 'Heavyweight Premium Cotton'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">Furing / Lining</span>
            <span className="text-xs font-semibold text-[#070F18]">
              {isBrotherhoodJacket ? 'Soft Breathable Quilted Lining' : 'Standard Soft Interior'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">Bordir Belakang</span>
            <span className="text-xs font-semibold text-[#070F18]">
              {isBrotherhoodJacket ? 'Golden SAKALA Arch Typography' : 'Official Sakala Motor Emblem'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">Fitur Riding</span>
            <span className="text-xs font-semibold text-[#070F18]">
              {isBrotherhoodJacket ? 'Brass Snaps & Drawcord Wind-Lock' : 'Reinforced Double Stitched Seams'}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <span className="text-3xl sm:text-4xl font-black text-[#070F18] tracking-tight">
            Rp {product.price_idr.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Size Selection */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#070F18] uppercase tracking-wider">
              PILIH UKURAN:
            </span>
            <div className="flex items-center gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 text-xs font-bold rounded-xs flex items-center justify-center transition-all ${
                    selectedSize === size
                      ? 'bg-[#070F18] text-white shadow-xs'
                      : 'bg-white border border-[#E5E2D9] text-[#070F18] hover:border-[#070F18]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Toast */}
          {addedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2 max-w-md">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Produk berhasil ditambahkan ke keranjang belanja Anda.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-[#0047AB] hover:bg-[#00388A] active:scale-[0.99] text-white px-8 py-3.5 text-xs font-bold tracking-wider uppercase rounded-xs transition-all shadow-sm flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>TAMBAH KE KERANJANG</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="bg-[#070F18] hover:bg-black text-white px-6 py-3.5 text-xs font-bold tracking-wider uppercase rounded-xs transition-colors"
            >
              BELI SEKARANG
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-[#E5E2D9] flex flex-wrap gap-6 text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0047AB]" />
              100% Produk Original Sakala
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#0047AB]" />
              Pengiriman Cepat Se-Indonesia
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#0047AB]" />
              Garansi Retur 7 Hari
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (Product Image) */}
      <div className="lg:col-span-5 flex items-center justify-center">
        <div className="relative w-full aspect-square max-w-[460px] bg-white border border-[#E5E2D9] rounded-xs p-8 shadow-xs flex items-center justify-center">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            className="object-contain p-6"
          />
        </div>
      </div>
    </div>
  );
}
