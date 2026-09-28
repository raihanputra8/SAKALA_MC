'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  color?: 'default' | 'gold' | 'blue' | 'green';
}

const colorMap = {
  default: {
    icon: 'bg-[#070F18] text-white',
    value: 'text-[#070F18]',
  },
  gold: {
    icon: 'bg-[#C5AA00]/10 text-[#C5AA00]',
    value: 'text-[#C5AA00]',
  },
  blue: {
    icon: 'bg-[#0047AB]/10 text-[#0047AB]',
    value: 'text-[#0047AB]',
  },
  green: {
    icon: 'bg-emerald-50 text-emerald-600',
    value: 'text-emerald-600',
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  color = 'default',
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white border border-[#E5E2D9] rounded-md p-5 hover:border-[#070F18] transition-colors shadow-xs">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${colors.icon}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {change && (
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <p className={`font-serif-editorial text-2xl font-black ${colors.value}`}>
        {value}
      </p>
      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mt-1">
        {title}
      </p>
    </div>
  );
}
