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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Left: Product Imagery Showcase */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Hero Shot */}
        <div className="relative aspect-square w-full bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            className="object-contain p-8"
          />

          <div className="absolute top-4 left-4 bg-[#070F18]/90 text-[#C5AA00] px-3 py-1 text-[9px] font-bold tracking-[0.25em] uppercase rounded-xs">
            MERCHANDISE RESMI SAKALA
          </div>
        </div>
      </div>

      {/* Right: Product Details & Purchase Controls */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <div>
          {/* Category & SKU Header */}
          <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] uppercase text-[#64748B] mb-2">
            <span>KATEGORI: {product.category}</span>
            <span>SKU: {product.sku}</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-black text-[#070F18] tracking-tight leading-tight mb-4">
            {product.name}
          </h1>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#E5E2D9]">
            <span className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#0047AB]">
              Rp {product.price_idr.toLocaleString('id-ID')}
            </span>
            <span className="ml-auto text-[10px] font-bold tracking-[0.16em] uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-xs">
              STOK TERSEDIA
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase">
                PILIH UKURAN:
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('size')}
                className="text-[10px] font-bold tracking-[0.14em] text-[#0047AB] uppercase flex items-center gap-1 hover:underline"
              >
                <Ruler className="w-3 h-3" />
                <span>PANDUAN UKURAN</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-bold rounded-xs transition-colors ${
                    selectedSize === size
                      ? 'bg-[#070F18] text-[#C5AA00] border-2 border-[#070F18]'
                      : 'bg-white border border-[#E5E2D9] text-[#070F18] hover:border-[#070F18]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase block mb-2">
              JUMLAH:
            </span>
            <div className="flex items-center w-36 border border-[#E5E2D9] bg-white rounded-xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#64748B] hover:text-[#070F18] hover:bg-[#FAF9F5]"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-xs text-[#070F18]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#64748B] hover:text-[#070F18] hover:bg-[#FAF9F5]"
              >
                +
              </button>
            </div>
          </div>

          {/* Toast feedback */}
          {addedToast && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Produk berhasil ditambahkan ke keranjang.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-10">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-[#070F18] hover:bg-[#0047AB] text-white py-3.5 px-6 rounded-xs text-xs font-bold tracking-[0.18em] uppercase transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>TAMBAH KE KERANJANG</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-[#C5AA00] hover:bg-[#d8bb00] text-[#070F18] border border-[#C5AA00] py-3.5 px-6 rounded-xs text-xs font-bold tracking-[0.18em] uppercase transition-colors flex items-center justify-center gap-2"
            >
              <span>BELI SEKARANG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabbed Product Details */}
        <div className="border-t border-[#E5E2D9] pt-6">
          <div className="flex gap-6 border-b border-[#E5E2D9] pb-3 text-[10px] font-bold tracking-[0.18em] uppercase">
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-1 transition-colors ${
                activeTab === 'specs'
                  ? 'text-[#070F18] border-b-2 border-[#070F18]'
                  : 'text-[#64748B] hover:text-[#070F18]'
              }`}
            >
              DETAIL BAHAN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('size')}
              className={`pb-1 transition-colors ${
                activeTab === 'size'
                  ? 'text-[#070F18] border-b-2 border-[#070F18]'
                  : 'text-[#64748B] hover:text-[#070F18]'
              }`}
            >
              PANDUAN UKURAN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`pb-1 transition-colors ${
                activeTab === 'shipping'
                  ? 'text-[#070F18] border-b-2 border-[#070F18]'
                  : 'text-[#64748B] hover:text-[#070F18]'
              }`}
            >
              PENGIRIMAN
            </button>
          </div>

          <div className="py-4 text-xs text-[#475569] leading-relaxed">
            {activeTab === 'specs' && (
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5AA00]" />
                  <span>Bahan katun berkualitas tinggi dan nyaman dipakai</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5AA00]" />
                  <span>Sablon dan jahitan rapi tahan lama</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5AA00]" />
                  <span>Label resmi Sakala Motorcycle Club</span>
                </li>
              </ul>
            )}

            {activeTab === 'size' && (
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left">
                  <thead>
                    <tr className="border-b border-[#E5E2D9] text-[#64748B] uppercase font-bold">
                      <th className="py-2">UKURAN</th>
                      <th className="py-2">LEBAR DADA</th>
                      <th className="py-2">PANJANG</th>
                      <th className="py-2">PANJANG LENGAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2D9]">
                    <tr>
                      <td className="py-2 font-bold text-[#070F18]">S</td>
                      <td className="py-2">50 cm</td>
                      <td className="py-2">70 cm</td>
                      <td className="py-2">21 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-[#070F18]">M</td>
                      <td className="py-2">53 cm</td>
                      <td className="py-2">72 cm</td>
                      <td className="py-2">22 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-[#070F18]">L</td>
                      <td className="py-2">56 cm</td>
                      <td className="py-2">75 cm</td>
                      <td className="py-2">23 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-[#070F18]">XL</td>
                      <td className="py-2">59 cm</td>
                      <td className="py-2">78 cm</td>
                      <td className="py-2">24 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-[#070F18]">XXL</td>
                      <td className="py-2">62 cm</td>
                      <td className="py-2">80 cm</td>
                      <td className="py-2">25 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-[11px]">
                <p>
                  Pengiriman langsung dari Bandung menggunakan kurir reguler atau kilat.
                </p>
                <p>
                  Pesanan diproses pada hari kerja (Senin - Sabtu). Nomor resi akan diberikan setelah barang dikirim.
                </p>
                <p className="text-emerald-700 font-bold">
                  ✓ Penukaran ukuran dapat dilakukan maksimal 7 hari setelah barang diterima dalam kondisi baru.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
