'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  Package, 
  Wrench, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Shield,
  ExternalLink, 
  Printer, 
  Plus, 
  Check, 
  Truck, 
  Calendar,
  Layers,
  ArrowRight,
  LogOut
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getOrders, getUserProfile, getBikes } from '@/lib/supabase/data';
import { Order, Profile, Bike } from '@/types/database';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, signOut, loading: authLoading, isMockUser, isAdmin, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'garage' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit address state
  const [addressData, setAddressData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Bandung',
    postalCode: '',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Machine Registration Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newBikeData, setNewBikeData] = useState({
    title: '',
    make: '',
    model: '',
    year: '1980',
    plate: '',
  });

  useEffect(() => {
    async function loadData() {
      // If user is completely signed out, clear all data immediately
      if (!user && !isMockUser) {
        setOrders([]);
        setProfile(null);
        setBikes([]);
        setLoading(false);
        return;
      }

      try {
        if (isMockUser) {
          setOrders([]);
          setProfile(null);
          const fetchedBikes = await getBikes();
          setBikes(fetchedBikes);
        } else if (user) {
          const [fetchedOrders, fetchedProfile, fetchedBikes] = await Promise.all([
            getOrders(user.email || undefined),
            getUserProfile(user.id),
            getBikes(),
          ]);
          setOrders(fetchedOrders);
          setProfile(fetchedProfile);
          setBikes(fetchedBikes);

          setAddressData((prev) => ({
            ...prev,
            fullName: user.user_metadata?.full_name || fetchedProfile?.full_name || '',
            email: user.email || fetchedProfile?.email || '',
            phone: '',
          }));
        }
      } catch (err) {
        console.error('Failed to load account data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, isMockUser]);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRegisterBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBikeData.title || !newBikeData.make) return;
    const newBike: Bike = {
      id: `bike-${Date.now()}`,
      title: newBikeData.title.toUpperCase(),
      year: parseInt(newBikeData.year) || 1980,
      make: newBikeData.make,
      model: newBikeData.model,
      specs: {
        frame: 'Custom Hardtail Chromoly',
        workshop: 'Bengkel Sakala Bandung',
        colorway: 'Raw Brushed Steel & Gold',
      },
      image_url: '/assets/bike_sportster.png',
      status: 'commissioned',
    };
    setBikes([newBike, ...bikes]);
    setShowRegisterModal(false);
    setNewBikeData({ title: '', make: '', model: '', year: '1980', plate: '' });
  };

  // If auth is loading, show minimal spinner
  if (authLoading || (loading && (user || isMockUser))) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#C5AA00] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // If signed out, show clean login required screen
  if (!user && !isMockUser) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-md w-full bg-white border border-[#E5E2D9] rounded-xs p-8 sm:p-10 shadow-xl text-center">
            <div className="relative w-20 h-20 mx-auto mb-6 drop-shadow-[0_8px_20px_rgba(197,170,0,0.25)]">
              <Image
                src="/assets/cakra_rahayu_kencana.png"
                alt="Cakra Rahayu Kencana"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span className="text-[10px] font-mono tracking-[0.25em] text-[#78716C] uppercase mb-2 block">
              PORTAL ANGGOTA SAKALA
            </span>

            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#070F18] mb-3">
              ANDA TELAH KELUAR
            </h1>

            <p className="text-xs text-[#78716C] leading-relaxed mb-8 max-w-sm mx-auto font-light">
              Anda tidak sedang terhubung ke akun manapun. Silakan masuk dengan akun Google untuk melihat kartu anggota, riwayat pesanan, dan motor Anda di garasi.
            </p>

            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full bg-[#070F18] hover:bg-[#C5AA00] hover:text-[#070F18] text-white text-xs font-bold tracking-[0.18em] uppercase py-3.5 px-6 rounded-xs transition-all flex items-center justify-center gap-2 shadow-xs btn-tactile block"
              >
                <span>MASUK DENGAN GOOGLE →</span>
              </Link>

              <Link
                href="/"
                className="w-full bg-[#FAF9F5] hover:bg-[#E5E2D9] text-[#070F18] text-xs font-bold tracking-[0.16em] uppercase py-3 px-6 rounded-xs transition-colors border border-[#E5E2D9] block"
              >
                KEMBALI KE BERANDA
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
      <Navbar />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#78716C] mb-8 pb-4 border-b border-[#E5E2D9]">
          <Link href="/" className="hover:text-[#070F18] transition-colors">
            BERANDA
          </Link>
          <span>/</span>
          <span className="text-[#070F18] font-semibold">AKUN SAYA</span>
        </div>

        {/* Google Sync Notice if not signed in with Google */}
        {!user && (
          <div className="mb-8 p-4 sm:p-5 bg-[#F5F4EF] border border-[#E5E2D9] rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#44403C]">
              <span className="w-2 h-2 rounded-full bg-[#9E8203]" />
              <span>
                Masuk dengan akun Google untuk menghubungkan data motor dan riwayat pesanan Anda.
              </span>
            </div>
            <Link
              href="/login"
              className="bg-[#070F18] hover:bg-[#C5AA00] hover:text-[#070F18] text-white text-[10px] font-bold tracking-[0.16em] uppercase px-4 py-2 rounded-xs whitespace-nowrap transition-colors"
            >
              MASUK DENGAN GOOGLE →
            </Link>
          </div>
        )}

        {/* Member Identity Card */}
        <section className="bg-white border border-[#E5E2D9] rounded-xs p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Avatar & Bio */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border border-[#D8D4C7] bg-[#FAF9F5] flex-shrink-0 shadow-xs">
                <Image
                  src={user?.user_metadata?.avatar_url || profile?.avatar_url || '/assets/avatar_user.png'}
                  alt={user?.user_metadata?.full_name || profile?.full_name || 'Member Avatar'}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider text-[#78716C] bg-[#FAF9F5] border border-[#E5E2D9] px-2 py-0.5 rounded-xs uppercase">
                    ID: {user ? `SKL-${user.id.slice(0, 6).toUpperCase()}` : 'SKL-MBR-0482'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-[#44403C] bg-[#FAF9F5] border border-[#E5E2D9] px-2 py-0.5 rounded-xs uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {user && !isMockUser ? 'Terverifikasi' : 'Anggota Sakala'}
                  </span>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium tracking-wider text-[#9E8203] bg-[#FEFCE8] border border-[#FEF08A] px-2.5 py-0.5 rounded-xs uppercase hover:bg-[#C5AA00] hover:text-[#070F18] transition-colors"
                    >
                      <Shield className="w-3 h-3" />
                      <span>CMS Admin →</span>
                    </Link>
                  )}
                </div>

                <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#070F18] tracking-tight">
                  {user?.user_metadata?.full_name || profile?.full_name || 'Anggota Sakala'}
                </h1>

                <p className="text-xs text-[#78716C] font-mono">
                  {user?.email || 'Anggota Sakala Motorcycle Club Bandung'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#78716C] pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#78716C]" />
                    Bandung, Jawa Barat
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[#78716C]" />
                    Anggota Aktif
                  </span>
                  {user && (
                    <>
                      <span>•</span>
                      <button
                        onClick={() => signOut()}
                        className="text-[#78716C] hover:text-red-700 font-mono tracking-wider uppercase inline-flex items-center gap-1 transition-colors"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Keluar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Real Counter Stats */}
            <div className="flex items-center divide-x divide-[#E5E2D9] bg-[#FAF9F5] border border-[#E5E2D9] rounded-xs px-6 py-4 self-stretch lg:self-auto justify-around sm:justify-center">
              <div className="text-center px-6">
                <span className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#070F18] block leading-none mb-1">
                  {bikes.length}
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#78716C]">
                  MOTOR
                </span>
              </div>
              <div className="text-center px-6">
                <span className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#070F18] block leading-none mb-1">
                  {orders.length}
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#78716C]">
                  PESANAN
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E2D9] mb-8 gap-6 sm:gap-8 text-xs font-mono tracking-[0.16em] uppercase overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3.5 transition-colors flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'orders'
                ? 'text-[#070F18] border-b-2 border-[#070F18] font-bold'
                : 'text-[#78716C] hover:text-[#070F18]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>PESANAN SAYA ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('garage')}
            className={`pb-3.5 transition-colors flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'garage'
                ? 'text-[#070F18] border-b-2 border-[#070F18] font-bold'
                : 'text-[#78716C] hover:text-[#070F18]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>GARASI MOTOR ({bikes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3.5 transition-colors flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'settings'
                ? 'text-[#070F18] border-b-2 border-[#070F18] font-bold'
                : 'text-[#78716C] hover:text-[#070F18]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>ALAMAT PENGIRIMAN</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white border border-[#E5E2D9] rounded-xs p-12 text-center">
                <Package className="w-10 h-10 text-[#78716C] mx-auto mb-3 opacity-40" />
                <h3 className="font-serif-editorial text-lg font-bold text-[#070F18] mb-1">
                  BELUM ADA PESANAN
                </h3>
                <p className="text-xs text-[#78716C] mb-6">
                  Anda belum memiliki riwayat pesanan merchandise.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#070F18] hover:bg-[#C5AA00] hover:text-[#070F18] text-white px-6 py-2.5 text-xs font-bold tracking-[0.16em] uppercase rounded-xs transition-colors"
                >
                  <span>LIHAT KATALOG MERCHANDISE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const isDelivered = order.status === 'delivered';
                const isDispatching = order.status === 'dispatching';
                const isPending = order.status === 'pending' || order.status === 'paid';

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-[#E5E2D9] rounded-xs p-6 sm:p-8 shadow-xs hover:border-[#070F18] transition-colors"
                  >
                    {/* Order Top Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E5E2D9] gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono tracking-widest text-[#78716C] uppercase">
                            ID PESANAN:
                          </span>
                          <span className="font-mono font-bold text-[#070F18] text-sm">{order.id}</span>
                        </div>
                        <span className="text-[10px] text-[#78716C] block font-mono">
                          Tanggal: {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Pesanan Terbaru'}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-xs text-[10px] font-mono tracking-wider uppercase ${
                              isDelivered
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isDispatching
                                ? 'bg-[#F5F4EF] text-[#070F18] border border-[#D8D4C7]'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isDelivered
                              ? 'SELESAI'
                              : isDispatching
                              ? 'DALAM PENGIRIMAN'
                              : 'MENUNGGU PEMBAYARAN'}
                          </span>
                        </div>

                        <Link
                          href={`/checkout/confirmation?orderId=${order.id}&total=${order.total_idr}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider uppercase text-[#070F18] hover:text-[#C5AA00] transition-colors bg-[#FAF9F5] border border-[#E5E2D9] px-3.5 py-1.5 rounded-xs"
                        >
                          <span>BUKTI PESANAN</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Order Items Grid */}
                    <div className="space-y-4 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="relative w-14 h-14 bg-[#FAF9F5] rounded-xs border border-[#E5E2D9] overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif-editorial text-sm font-bold text-[#070F18] truncate">
                              {item.product.name}
                            </h4>
                            <span className="text-[10px] text-[#78716C] block font-mono">
                              UKURAN: {item.size || 'M'} • JUMLAH: {item.quantity}
                            </span>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold font-mono text-[#070F18]">
                              IDR {(item.product.price_idr * item.quantity).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Settlement Summary */}
                    <div className="pt-4 border-t border-[#E5E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2 text-[#78716C] font-mono text-[11px]">
                        <Truck className="w-4 h-4 text-[#78716C]" />
                        <span>Kurir: {order.courier.toUpperCase()}</span>
                        <span>•</span>
                        <span>Pembayaran: {order.payment_method.toUpperCase()}</span>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-wider">
                          TOTAL PEMBAYARAN:
                        </span>
                        <span className="font-serif-editorial text-base font-black text-[#070F18]">
                          IDR {order.total_idr.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: MY GARAGE */}
        {activeTab === 'garage' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#070F18]">
                  DAFTAR MOTOR
                </h3>
                <p className="text-xs text-[#64748B]">
                  Daftar motor anggota Sakala Motorcycle Club Bandung.
                </p>
              </div>

              <button
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center gap-2 bg-[#070F18] hover:bg-[#C5AA00] hover:text-[#070F18] text-white px-4 py-2.5 text-xs font-bold tracking-[0.16em] uppercase rounded-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>TAMBAH MOTOR</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bikes.map((bike) => (
                <div
                  key={bike.id}
                  className="bg-white border border-[#E5E2D9] rounded-xs overflow-hidden shadow-xs hover:border-[#070F18] transition-colors flex flex-col justify-between group"
                >
                  <div className="relative h-56 w-full bg-[#E5E2D9] overflow-hidden">
                    <Image
                      src={bike.image_url}
                      alt={bike.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#070F18]/90 text-[#C5AA00] px-2.5 py-1 text-[9px] font-mono tracking-[0.2em] uppercase rounded-xs">
                      {bike.year} • {bike.make.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-editorial text-lg font-bold text-[#070F18] mb-1">
                        {bike.title}
                      </h4>
                      <p className="text-xs text-[#78716C] mb-4 font-mono">
                        Model: {bike.model}
                      </p>

                      <div className="p-3 bg-[#FAF9F5] border border-[#E5E2D9] rounded-xs space-y-1.5 text-[11px] mb-4">
                        <div className="flex justify-between">
                          <span className="text-[#78716C]">RANGKA:</span>
                          <span className="font-bold text-[#070F18]">{bike.specs?.frame || 'Rigid Loop'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#78716C]">KNALPOT:</span>
                          <span className="font-bold text-[#070F18]">{bike.specs?.exhaust || 'Custom Open Pipe'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#78716C]">BENGKEL:</span>
                          <span className="font-bold text-[#070F18]">{bike.specs?.workshop || 'Garasi Sakala'}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/bikes/${bike.id}`}
                      className="inline-flex items-center justify-between w-full pt-3 border-t border-[#E5E2D9] text-xs font-bold tracking-[0.16em] uppercase text-[#070F18] group-hover:text-[#C5AA00] transition-colors"
                    >
                      <span>LIHAT DETAIL MOTOR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DELIVERY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white border border-[#E5E2D9] rounded-xs p-8 shadow-xs">
            <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#070F18] mb-2">
              ALAMAT PENGIRIMAN
            </h3>
            <p className="text-xs text-[#64748B] mb-8">
              Perbarui alamat pengiriman dan informasi kontak untuk pesanan merchandise.
            </p>

            {savedSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Alamat pengiriman berhasil disimpan.</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  NAMA LENGKAP
                </label>
                <input
                  type="text"
                  required
                  value={addressData.fullName}
                  onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3.5 py-2.5 rounded-xs outline-none focus:border-[#070F18]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={addressData.email}
                    onChange={(e) => setAddressData({ ...addressData, email: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3.5 py-2.5 rounded-xs outline-none focus:border-[#070F18]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    NO. TELEPON / WHATSAPP
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressData.phone}
                    onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3.5 py-2.5 rounded-xs outline-none focus:border-[#070F18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  ALAMAT LENGKAP
                </label>
                <textarea
                  required
                  rows={3}
                  value={addressData.address}
                  onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3.5 py-2.5 rounded-xs outline-none focus:border-[#070F18] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    KOTA
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3.5 py-2.5 rounded-xs outline-none focus:border-[#070F18]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    KODE POS
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.postalCode}
                    onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3.5 py-2.5 rounded-xs outline-none focus:border-[#070F18]"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-[#070F18] hover:bg-[#C5AA00] hover:text-[#070F18] text-white px-6 py-3 text-xs font-bold tracking-[0.16em] uppercase rounded-xs transition-colors"
                >
                  SIMPAN ALAMAT
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E5E2D9] rounded-xs p-8 max-w-lg w-full shadow-2xl">
            <h3 className="font-serif-editorial text-2xl font-bold text-[#070F18] mb-2">
              TAMBAH MOTOR BARU
            </h3>
            <p className="text-xs text-[#78716C] mb-6">
              Masukkan data motor untuk dicatat di daftar garasi anggota.
            </p>

            <form onSubmit={handleRegisterBike} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#78716C] uppercase tracking-wider mb-1">
                  NAMA MOTOR *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SANGHYANG HEULEUT"
                  value={newBikeData.title}
                  onChange={(e) => setNewBikeData({ ...newBikeData, title: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 rounded-xs outline-none focus:border-[#070F18]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#78716C] uppercase tracking-wider mb-1">
                    MEREK *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Yamaha"
                    value={newBikeData.make}
                    onChange={(e) => setNewBikeData({ ...newBikeData, make: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 rounded-xs outline-none focus:border-[#070F18]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#78716C] uppercase tracking-wider mb-1">
                    MODEL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: XS650"
                    value={newBikeData.model}
                    onChange={(e) => setNewBikeData({ ...newBikeData, model: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 rounded-xs outline-none focus:border-[#070F18]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#78716C] uppercase tracking-wider mb-1">
                    TAHUN PEMBUATAN
                  </label>
                  <input
                    type="number"
                    value={newBikeData.year}
                    onChange={(e) => setNewBikeData({ ...newBikeData, year: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 rounded-xs outline-none focus:border-[#070F18]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#78716C] uppercase tracking-wider mb-1">
                    NOMOR PLAT POLISI
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: D 4029 BDG"
                    value={newBikeData.plate}
                    onChange={(e) => setNewBikeData({ ...newBikeData, plate: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 rounded-xs outline-none focus:border-[#070F18]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E2D9]">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 border border-[#E5E2D9] text-[#78716C] hover:text-[#070F18] font-bold text-xs uppercase rounded-xs"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="bg-[#070F18] hover:bg-[#C5AA00] hover:text-[#070F18] text-white px-5 py-2 font-bold text-xs uppercase rounded-xs transition-colors"
                >
                  SIMPAN MOTOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
