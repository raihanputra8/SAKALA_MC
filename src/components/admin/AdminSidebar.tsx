'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Bike,
  Package,
  Type,
  Users,
  ArrowLeft,
  Shield,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/journal', label: 'Journal', icon: FileText },
  { href: '/admin/bikes', label: 'Bikes', icon: Bike },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/content', label: 'Site Content', icon: Type },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#070F18] border-r border-[#1E293B] flex flex-col z-50">
      {/* Logo */}
      <div className="p-5 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#C5AA00]" />
          <div>
            <span className="text-sm font-bold tracking-[0.18em] text-white">SAKALA</span>
            <span className="ml-1.5 text-[9px] font-bold tracking-[0.2em] text-[#C5AA00] bg-[#C5AA00]/10 px-1.5 py-0.5 rounded-xs uppercase">
              CMS
            </span>
          </div>
        </div>
        <p className="text-[9px] text-[#64748B] mt-1 tracking-wider uppercase">Content Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive
                  ? 'bg-[#C5AA00]/15 text-[#C5AA00] border border-[#C5AA00]/20'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer - Back to site */}
      <div className="p-4 border-t border-[#1E293B]">
        <Link
          href="/"
          className="flex items-center gap-2 text-[10px] text-[#64748B] hover:text-white transition-colors font-bold tracking-wider uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
