'use client';

import React from 'react';
import { Pencil } from 'lucide-react';
import { useInlineCMS, EditingItem } from '@/context/InlineCMSContext';

interface EditableWrapperProps {
  children: React.ReactNode;
  item: {
    type: 'bike' | 'product' | 'journal' | 'content';
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  };
  className?: string;
}

/**
 * Wraps any content block (card, image, section) with an admin edit overlay.
 * When CMS edit mode is active, hovering shows a golden edit border and pencil icon.
 * Clicking opens the InlineEditModal for that item.
 */
export default function EditableWrapper({ children, item, className = '' }: EditableWrapperProps) {
  const { isEditMode, setEditingItem } = useInlineCMS();

  if (!isEditMode) {
    return <>{children}</>;
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditingItem(item as EditingItem);
  }

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer group/editable ${className}`}
      role="button"
      tabIndex={0}
      title={`Edit this ${item.type}`}
    >
      {children}

      {/* Edit Overlay — appears on hover */}
      <div className="absolute inset-0 z-10 border-2 border-transparent group-hover/editable:border-[#C5AA00] rounded-[inherit] transition-all duration-200 pointer-events-none">
        {/* Top-right Edit Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-[#C5AA00] text-black px-2.5 py-1.5 rounded-md shadow-lg opacity-0 group-hover/editable:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/editable:translate-y-0 pointer-events-none">
          <Pencil className="w-3 h-3" />
          <span className="text-[9px] font-bold tracking-[0.14em] uppercase">
            EDIT
          </span>
        </div>

        {/* Subtle golden overlay tint */}
        <div className="absolute inset-0 bg-[#C5AA00]/0 group-hover/editable:bg-[#C5AA00]/5 rounded-[inherit] transition-all duration-200" />
      </div>
    </div>
  );
}
