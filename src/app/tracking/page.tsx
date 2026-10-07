'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getOrderById } from '@/lib/supabase/data';
import { Order } from '@/types/database';

export default function TrackingPage() {
  const [manifestId, setManifestId] = useState('');
  const [searchedId, setSearchedId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTracking = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setSearchedId(id.trim());
    try {
      const result = await getOrderById(id.trim());
      setOrder(result);
    } catch (err) {
      console.error('Failed to load tracking data:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manifestId.trim()) {
      fetchTracking(manifestId.trim());
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'PEMBAYARAN DITERIMA', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'dispatching':
        return { label: 'DALAM PENGIRIMAN', color: 'bg-blue-50 text-[#0047AB] border-blue-200' };
      case 'delivered':
        return { label: 'PESANAN SELESAI', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'cancelled':
        return { label: 'DIBATALKAN', color: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: 'MENUNGGU PEMBAYARAN', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
      <Navbar />

      <main className="flex-1 py-12 max-w-5xl mx-auto px-6 lg:px-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#64748B] mb-8 pb-4 border-b border-[#E5E2D9]">
          <Link href="/shop" className="hover:text-[#070F18] transition-colors">
            MERCHANDISE
          </Link>
          <span>/</span>
          <span className="text-[#0047AB]">PENGIRIMAN</span>
          <span>/</span>
          <span className="text-[#070F18]">LACAK PESANAN</span>
        </div>

        {/* Title Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase mb-2 block">
            STATUS PENGIRIMAN
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-5xl font-black text-[#070F18] tracking-tight mb-3">
            LACAK PESANAN
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Masukkan nomor pesanan Anda untuk memeriksa status verifikasi dan pengiriman.
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="bg-white border border-[#E5E2D9] rounded-xs p-6 sm:p-8 mb-10 shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={manifestId}
                onChange={(e) => setManifestId(e.target.value)}
                placeholder="Masukkan nomor pesanan (contoh: SKL-...)..."
                className="w-full bg-[#FAF9F5] border border-[#E5E2D9] pl-10 pr-4 py-3 text-xs text-[#070F18] font-mono rounded-xs outline-none focus:border-[#070F18]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#070F18] hover:bg-[#0047AB] text-white px-8 py-3 text-xs font-bold tracking-[0.16em] uppercase rounded-xs transition-colors disabled:opacity-50"
            >
              {loading ? 'MEMERIKSA...' : 'LACAK'}
            </button>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {order ? (
              <div className="bg-white border border-[#E5E2D9] rounded-xs p-6 sm:p-8 mb-10 shadow-xs">
                {/* Header overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E2D9] gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase block">
                      NOMOR PESANAN
                    </span>
                    <span className="font-serif-editorial text-2xl font-bold text-[#070F18]">
                      {order.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold tracking-[0.16em] uppercase border px-3.5 py-1.5 rounded-xs ${getStatusBadge(order.status).color}`}>
                      {getStatusBadge(order.status).label}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs mb-8">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                      PENERIMA
                    </span>
                    <span className="font-bold text-[#070F18]">{order.customer_name}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                      KOTA TUJUAN
                    </span>
                    <span className="font-bold text-[#070F18]">{order.city}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                      KURIR
                    </span>
                    <span className="font-bold text-[#070F18]">{order.courier}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                      TOTAL PESANAN
                    </span>
                    <span className="font-bold text-[#070F18]">{formatPrice(order.total_idr)}</span>
                  </div>
                </div>

                {/* Items in order */}
                {order.items && order.items.length > 0 && (
                  <div className="pt-6 border-t border-[#E5E2D9]">
                    <h3 className="font-serif-editorial text-base font-bold text-[#070F18] mb-4">
                      PRODUK DALAM PESANAN
                    </h3>
                    <div className="divide-y divide-[#E5E2D9]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-3 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-[#070F18] block">{item.product?.name || 'Produk Sakala'}</span>
                            <span className="text-[10px] text-[#64748B]">Qty: {item.quantity} {item.size ? `• Ukuran: ${item.size}` : ''}</span>
                          </div>
                          <span className="font-medium text-[#070F18]">
                            {item.product?.price_idr ? formatPrice(item.product.price_idr * item.quantity) : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#E5E2D9] rounded-xs p-8 text-center mb-10">
                <AlertCircle className="w-8 h-8 text-[#64748B] mx-auto mb-3" />
                <h3 className="font-serif-editorial text-lg font-bold text-[#070F18] mb-1">
                  PESANAN TIDAK DITEMUKAN
                </h3>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Nomor pesanan <span className="font-mono font-bold text-[#070F18]">{searchedId}</span> tidak tercatat di database kami. Pastikan nomor pesanan yang Anda masukkan sudah sesuai.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Back and Support Actions */}
        <div className="flex justify-between items-center text-xs">
          <Link
            href="/account"
            className="text-[#64748B] hover:text-[#070F18] font-bold uppercase tracking-[0.14em] flex items-center gap-1.5"
          >
            ← KEMBALI KE AKUN
          </Link>

          <Link
            href="/shop"
            className="text-[#070F18] hover:text-[#C5AA00] font-bold uppercase tracking-[0.14em] flex items-center gap-1.5"
          >
            <span>KEMBALI BELANJA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
