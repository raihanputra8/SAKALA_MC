'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface TrackingEvent {
  time: string;
  date: string;
  status: string;
  location: string;
  detail: string;
  done: boolean;
}

export default function TrackingPage() {
  const [manifestId, setManifestId] = useState('SKL-849201');
  const [searchedId, setSearchedId] = useState('SKL-849201');

  const TRACKING_DATA: Record<string, {
    recipient: string;
    city: string;
    courier: string;
    airwaybill: string;
    statusText: string;
    estimatedDelivery: string;
    events: TrackingEvent[];
  }> = {
    'SKL-849201': {
      recipient: 'Raihan Putra',
      city: 'Bandung',
      courier: 'JNE YES (Next Day)',
      airwaybill: 'JNE-BDO-9840291',
      statusText: 'DALAM PENGIRIMAN',
      estimatedDelivery: '1-2 hari kerja',
      events: [
        {
          date: '24 Sep 2024',
          time: '14:30 WIB',
          status: 'PAKET SEDANG DIANTAR OLEH KURIR',
          location: 'Hub Distribusi Bandung',
          detail: 'Paket sedang dalam perjalanan ke alamat penerima.',
          done: true,
        },
        {
          date: '24 Sep 2024',
          time: '09:15 WIB',
          status: 'PAKET DISERAHKAN KE KURIR',
          location: 'Bandung',
          detail: 'Paket telah diserahkan kepada pihak ekspedisi.',
          done: true,
        },
        {
          date: '23 Sep 2024',
          time: '16:00 WIB',
          status: 'PESANAN SELESAI DIKEMAS',
          location: 'Gudang Sakala Bandung',
          detail: 'Pengecekan kualitas produk selesai dan pesanan telah dikemas.',
          done: true,
        },
        {
          date: '23 Sep 2024',
          time: '14:32 WIB',
          status: 'PEMBAYARAN DIVERIFIKASI',
          location: 'Sistem Pembayaran',
          detail: 'Pembayaran pesanan telah diverifikasi.',
          done: true,
        },
      ],
    },
    'SKL-719304': {
      recipient: 'Raihan Putra',
      city: 'Bandung',
      courier: 'J&T Cargo',
      airwaybill: 'JT-BDO-4019284',
      statusText: 'PESANAN DITERIMA',
      estimatedDelivery: 'Diterima pada 17 Sep 2024',
      events: [
        {
          date: '17 Sep 2024',
          time: '11:20 WIB',
          status: 'PAKET BERHASIL DITERIMA',
          location: 'Alamat Penerima',
          detail: 'Paket telah diterima dan ditandatangani oleh penerima.',
          done: true,
        },
        {
          date: '16 Sep 2024',
          time: '10:00 WIB',
          status: 'PAKET DIBAWA KURIR',
          location: 'Hub Bandung',
          detail: 'Kurir sedang mengantar paket ke alamat tujuan.',
          done: true,
        },
      ],
    },
  };

  const currentManifest = TRACKING_DATA[searchedId] || {
    recipient: 'Pelanggan',
    city: 'Jawa Barat',
    courier: 'JNE / J&T',
    airwaybill: searchedId,
    statusText: 'DALAM PROSES',
    estimatedDelivery: '1-2 hari kerja',
    events: [
      {
        date: 'Hari ini',
        time: 'Sedang Berjalan',
        status: 'PESANAN DIPROSES',
        location: 'Bandung',
        detail: `Nomor pesanan ${searchedId} sedang dipersiapkan oleh tim pengiriman.`,
        done: false,
      },
    ],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manifestId.trim()) {
      setSearchedId(manifestId.trim().toUpperCase());
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
            Masukkan nomor pesanan atau nomor resi untuk melihat status pengiriman.
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
                placeholder="Masukkan nomor pesanan (contoh: SKL-849201)..."
                className="w-full bg-[#FAF9F5] border border-[#E5E2D9] pl-10 pr-4 py-3 text-xs text-[#070F18] font-mono rounded-xs outline-none focus:border-[#070F18]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#070F18] hover:bg-[#0047AB] text-white px-8 py-3 text-xs font-bold tracking-[0.16em] uppercase rounded-xs transition-colors"
            >
              LACAK
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="flex items-center gap-2 mt-4 text-[10px] text-[#64748B]">
            <span>CONTOH:</span>
            <button
              type="button"
              onClick={() => {
                setManifestId('SKL-849201');
                setSearchedId('SKL-849201');
              }}
              className="font-mono text-[#0047AB] hover:underline"
            >
              SKL-849201 (Dalam Pengiriman)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setManifestId('SKL-719304');
                setSearchedId('SKL-719304');
              }}
              className="font-mono text-[#0047AB] hover:underline"
            >
              SKL-719304 (Selesai)
            </button>
          </div>
        </div>

        {/* Live Shipment Overview Card */}
        <div className="bg-white border border-[#E5E2D9] rounded-xs p-6 sm:p-8 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E2D9] gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#64748B] uppercase block">
                NOMOR PESANAN
              </span>
              <span className="font-serif-editorial text-2xl font-bold text-[#070F18]">
                {searchedId}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#0047AB] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xs">
                {currentManifest.statusText}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs mb-8">
            <div>
              <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                PENERIMA
              </span>
              <span className="font-bold text-[#070F18]">{currentManifest.recipient}</span>
            </div>

            <div>
              <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                KOTA TUJUAN
              </span>
              <span className="font-bold text-[#070F18]">{currentManifest.city}</span>
            </div>

            <div>
              <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                KURIR
              </span>
              <span className="font-bold text-[#070F18]">{currentManifest.courier}</span>
            </div>

            <div>
              <span className="text-[9px] font-bold tracking-[0.18em] text-[#64748B] uppercase block mb-1">
                NOMOR RESI
              </span>
              <span className="font-mono text-[11px] font-bold text-[#0047AB]">{currentManifest.airwaybill}</span>
            </div>
          </div>

          {/* Timeline Events */}
          <div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#070F18] mb-6">
              RIWAYAT PENGIRIMAN
            </h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E2D9]">
              {currentManifest.events.map((event, idx) => (
                <div key={idx} className="relative">
                  {/* Dot icon */}
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#070F18] border-2 border-white ring-2 ring-[#070F18] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5AA00]"></span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-[#070F18]">
                        {event.status}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono">
                        ({event.date} • {event.time})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#0047AB]">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>

                    <p className="text-xs text-[#64748B] pt-0.5">
                      {event.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
