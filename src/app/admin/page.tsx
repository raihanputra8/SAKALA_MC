'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Package, Users, DollarSign, Plus, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAdminStats } from '@/lib/supabase/admin';
import { AdminStats } from '@/types/database';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your SAKALA store and content"
      />

      <div className="flex-1 p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#C5AA00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Total Products"
                value={stats?.totalProducts || 0}
                icon={ShoppingBag}
                color="default"
              />
              <StatsCard
                title="Total Orders"
                value={stats?.totalOrders || 0}
                icon={Package}
                color="blue"
              />
              <StatsCard
                title="Total Revenue"
                value={`IDR ${((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M`}
                icon={DollarSign}
                color="gold"
              />
              <StatsCard
                title="Members"
                value={stats?.totalMembers || 0}
                icon={Users}
                color="green"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              <Link
                href="/admin/products"
                className="bg-white border border-[#E5E2D9] rounded-md p-5 hover:border-[#070F18] transition-colors group flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-[#070F18] group-hover:bg-[#0047AB] rounded-md flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#070F18] uppercase tracking-wider">
                    Add Product
                  </h3>
                  <p className="text-[10px] text-[#94A3B8]">New merchandise item</p>
                </div>
              </Link>
              <Link
                href="/admin/journal"
                className="bg-white border border-[#E5E2D9] rounded-md p-5 hover:border-[#070F18] transition-colors group flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-[#070F18] group-hover:bg-[#0047AB] rounded-md flex items-center justify-center transition-colors">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#070F18] uppercase tracking-wider">
                    New Article
                  </h3>
                  <p className="text-[10px] text-[#94A3B8]">Write journal post</p>
                </div>
              </Link>
              <Link
                href="/"
                target="_blank"
                className="bg-white border border-[#E5E2D9] rounded-md p-5 hover:border-[#070F18] transition-colors group flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-[#070F18] group-hover:bg-[#0047AB] rounded-md flex items-center justify-center transition-colors">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#070F18] uppercase tracking-wider">
                    View Live Site
                  </h3>
                  <p className="text-[10px] text-[#94A3B8]">Open public website</p>
                </div>
              </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-[#E5E2D9] rounded-md overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E2D9] flex items-center justify-between">
                <h2 className="font-serif-editorial text-sm font-bold text-[#070F18]">
                  Recent Orders
                </h2>
                <Link href="/admin/orders" className="text-[10px] text-[#0047AB] font-bold uppercase tracking-wider hover:underline">
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#E5E2D9]">
                      <th className="text-left px-4 py-2.5 font-bold text-[10px] tracking-[0.14em] uppercase text-[#64748B]">Order ID</th>
                      <th className="text-left px-4 py-2.5 font-bold text-[10px] tracking-[0.14em] uppercase text-[#64748B]">Customer</th>
                      <th className="text-left px-4 py-2.5 font-bold text-[10px] tracking-[0.14em] uppercase text-[#64748B]">Total</th>
                      <th className="text-left px-4 py-2.5 font-bold text-[10px] tracking-[0.14em] uppercase text-[#64748B]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentOrders || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[#94A3B8] text-sm">
                          No orders yet
                        </td>
                      </tr>
                    ) : (
                      (stats?.recentOrders || []).map((order) => (
                        <tr key={order.id} className="border-b border-[#E5E2D9] last:border-b-0 hover:bg-[#FAF9F5]">
                          <td className="px-4 py-3 font-bold text-[#070F18]">{order.id}</td>
                          <td className="px-4 py-3 text-[#64748B]">{order.customer_name}</td>
                          <td className="px-4 py-3 font-bold text-[#070F18]">IDR {order.total_idr?.toLocaleString('id-ID')}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
