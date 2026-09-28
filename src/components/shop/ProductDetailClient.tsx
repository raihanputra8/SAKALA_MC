'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Ruler, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Layers,
  ChevronDown
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
  const [activeTab, setActiveTab] = useState<'specs' | 'size' | 'shipping'>('specs');
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

  // Specific specs for Brotherhood Coach Jacket or fallback
  const isBrotherhoodJacket = product.id === 'prod-03' || product.name.includes('COACH JACKET');
  const title = isBrotherhoodJacket ? 'BROTHERHOOD' : product.name;
  const subtitle = isBrotherhoodJacket ? 'Coach Jacket - Navy Heritage' : product.category.toUpperCase();
  const description = isBrotherhoodJacket 
    ? 'Jaket coach berkarakter tangguh berbahan nylon tahan angin berdensitas tinggi dengan warna biru khas Sakala. Dirancang dengan potongan relaxed fit untuk kenyamanan riding malam, proteksi terpaan angin jalanan, dan gaya harian.'
    : product.description;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      {/* LEFT COLUMN (Product Info) */}
      <div className="lg:col-span-7 flex flex-col justify-center">
        {/* 1. Title: Massive, bold, white font */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-2">
          {title}
        </h1>

        {/* 2. Subtitle: Simple, golden yellow, no slashes */}
        <p className="text-lg sm:text-xl font-bold text-[#F0D000] tracking-wide mb-6">
          {subtitle}
        </p>

        {/* 3. Description: White, readable paragraph */}
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-8 max-w-xl">
          {description}
        </p>

        {/* 4. Specs Grid: Simple, clean 2x2 text grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8 pb-8 border-b border-white/10 max-w-xl">
          <div>
            <span className="text-xs font-bold text-[#F0D000] uppercase block mb-1">Material</span>
            <span className="text-sm text-white font-medium">
              {isBrotherhoodJacket ? 'High-Density Windproof Nylon' : 'Heavyweight Premium Cotton'}
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-[#F0D000] uppercase block mb-1">Furing / Lining</span>
            <span className="text-sm text-white font-medium">
              {isBrotherhoodJacket ? 'Soft Breathable Quilted Lining' : 'Standard Soft Interior'}
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-[#F0D000] uppercase block mb-1">Bordir Belakang</span>
            <span className="text-sm text-white font-medium">
              {isBrotherhoodJacket ? 'Golden SAKALA Arch Typography' : 'Official Sakala Motor Emblem'}
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-[#F0D000] uppercase block mb-1">Fitur Riding</span>
            <span className="text-sm text-white font-medium">
              {isBrotherhoodJacket ? 'Brass Snaps & Drawcord Wind-Lock' : 'Reinforced Double Stitched Seams'}
            </span>
          </div>
        </div>

        {/* 5. Price: Bold, prominent, clean */}
        <div className="mb-6">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Rp {product.price_idr.toLocaleString('id-ID')}
          </span>
        </div>

        {/* 6. Action Area */}
        <div className="space-y-6">
          {/* Size selector buttons in a clean row */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Ukuran:
            </span>
            <div className="flex items-center gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
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

          {/* Toast feedback */}
          {addedToast && (
            <div className="p-3 bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs rounded-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Produk berhasil ditambahkan ke keranjang.</span>
            </div>
          )}

          {/* Solid blue CTA Button */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-[#0047AB] hover:bg-[#00388A] active:scale-[0.99] text-white px-8 py-3.5 text-xs font-bold tracking-wider uppercase rounded-xs transition-all shadow-md flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>TAMBAH KE KERANJANG</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold tracking-wider uppercase rounded-xs transition-colors"
            >
              BELI SEKARANG
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (Product Image) */}
      {/* Completely clean image: NO borders, NO text overlays, NO techy crosshairs, NO specimen labels underneath */}
      <div className="lg:col-span-5 flex items-center justify-center">
        <div className="relative w-full aspect-square max-w-[480px]">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
