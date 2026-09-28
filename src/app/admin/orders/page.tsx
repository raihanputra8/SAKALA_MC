'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAllOrders, updateOrderStatus } from '@/lib/supabase/admin';
import { Order } from '@/types/database';

const statusFlow: Order['status'][] = ['pending', 'paid', 'dispatching', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  async function loadOrders() {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, []);

  async function handleStatusChange(orderId: string, newStatus: Order['status']) {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    }
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (o: Order) => <span className="font-bold text-[#070F18]">{o.id}</span>,
    },
    {
      key: 'customer_name',
      label: 'Customer',
      render: (o: Order) => (
        <div>
          <p className="font-bold text-[#070F18] text-xs">{o.customer_name}</p>
          <p className="text-[10px] text-[#94A3B8]">{o.customer_email}</p>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (o: Order) => (
        <span className="text-[11px] text-[#64748B]">
          {(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'total_idr',
      label: 'Total',
      render: (o: Order) => (
        <span className="font-bold text-[#070F18]">
          IDR {o.total_idr?.toLocaleString('id-ID') || '0'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (o: Order) => (
        <span className="text-[11px] text-[#64748B]">
          {o.created_at ? new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (o: Order) => (
        <select
          value={o.status}
          onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
          className="bg-transparent border border-[#E5E2D9] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm outline-none focus:border-[#070F18] cursor-pointer"
        >
          {statusFlow.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
      />

      <div className="flex-1 p-8">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {['all', ...statusFlow].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-md border transition-colors ${
                statusFilter === s
                  ? 'bg-[#070F18] text-white border-[#070F18]'
                  : 'bg-white text-[#64748B] border-[#E5E2D9] hover:border-[#070F18] hover:text-[#070F18]'
              }`}
            >
              {s === 'all' ? `All (${orders.length})` : `${s.replace('_', ' ')} (${orders.filter((o) => o.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#C5AA00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            keyField="id"
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by order ID, customer name, or email..."
            emptyMessage="No orders found"
          />
        )}
      </div>
    </>
  );
}
