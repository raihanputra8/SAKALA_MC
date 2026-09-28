'use client';

import React from 'react';

type BadgeVariant = 'available' | 'low_stock' | 'waitlist' | 'sold_out' |
  'pending' | 'paid' | 'dispatching' | 'delivered' | 'cancelled' |
  'admin' | 'artisan' | 'founder' | 'member' |
  'featured' | 'draft';

const variantStyles: Record<BadgeVariant, string> = {
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  low_stock: 'bg-amber-50 text-amber-700 border-amber-200',
  waitlist: 'bg-blue-50 text-[#0047AB] border-blue-200',
  sold_out: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-blue-50 text-[#0047AB] border-blue-200',
  dispatching: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  admin: 'bg-[#C5AA00]/10 text-[#C5AA00] border-[#C5AA00]/30',
  artisan: 'bg-[#0047AB]/10 text-[#0047AB] border-[#0047AB]/30',
  founder: 'bg-purple-50 text-purple-700 border-purple-200',
  member: 'bg-[#FAF9F5] text-[#64748B] border-[#E5E2D9]',
  featured: 'bg-[#C5AA00]/10 text-[#C5AA00] border-[#C5AA00]/30',
  draft: 'bg-[#FAF9F5] text-[#94A3B8] border-[#E5E2D9]',
};

const labelMap: Record<string, string> = {
  available: 'Available',
  low_stock: 'Low Stock',
  waitlist: 'Waitlist',
  sold_out: 'Sold Out',
  pending: 'Pending',
  paid: 'Paid',
  dispatching: 'Dispatching',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  admin: 'Admin',
  artisan: 'Artisan',
  founder: 'Founder',
  member: 'Member',
  featured: 'Featured',
  draft: 'Draft',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const variant = status as BadgeVariant;
  const styles = variantStyles[variant] || variantStyles.member;
  const label = labelMap[status] || status;

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-sm text-[9px] font-bold tracking-[0.14em] uppercase border ${styles} ${className}`}
    >
      {label}
    </span>
  );
}
