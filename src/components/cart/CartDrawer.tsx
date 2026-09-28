'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeFromCart, totalItems, totalIdr, totalUsd } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E5E2D9] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 bg-[#070F18] text-white flex items-center justify-between border-b border-[#C5AA00]/20">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-[#C5AA00]" />
              <div>
                <h3 className="font-serif-editorial text-lg font-bold tracking-wider uppercase">
                  KERANJANG BELANJA
                </h3>
                <span className="text-[10px] tracking-[0.2em] text-[#94A3B8] uppercase">
                  {totalItems} PRODUK DIPILIH
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E5E2D9]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-[#94A3B8] mb-4 stroke-1" />
                <p className="font-serif-editorial text-lg font-bold text-[#070F18] mb-1">
                  KERANJANG KOSONG
                </p>
                <p className="text-xs text-[#64748B] max-w-xs mb-6">
                  Pilih produk merchandise resmi Sakala untuk menambahkan ke keranjang belanja.
                </p>
                <button
                  onClick={closeCart}
                  className="bg-[#070F18] text-white text-xs font-bold tracking-[0.16em] uppercase px-6 py-2.5 rounded-xs hover:bg-[#C5AA00] hover:text-black transition-colors"
                >
                  LIHAT PRODUK
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-center">
                  <div className="relative w-20 h-20 bg-white border border-[#E5E2D9] rounded-xs flex-shrink-0 overflow-hidden p-2">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block">
                      SKU: {item.product.sku}
                    </span>
                    <h4 className="font-serif-editorial text-xs font-bold text-[#070F18] truncate mb-1">
                      {item.product.name}
                    </h4>
                    <span className="text-xs font-bold text-[#070F18] block mb-2">
                      Rp {(item.product.price_idr * item.quantity).toLocaleString('id-ID')}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[#E5E2D9] rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-500 hover:text-black"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#070F18]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:text-black"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Hapus produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E5E2D9]">
              <div className="space-y-2 mb-6 text-xs">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>SUBTOTAL</span>
                  <span className="font-bold text-[#070F18]">
                    Rp {totalIdr.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                  <span>Ongkos kirim dihitung saat checkout</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-[#070F18] hover:bg-[#0047AB] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>LANJUTKAN KE PEMBAYARAN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
