'use client';

import React from 'react';
import { X } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Save',
  isLoading = false,
  size = 'md',
}: FormModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white border border-[#E5E2D9] rounded-md shadow-2xl w-full ${sizeClasses[size]} max-h-[85vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2D9]">
          <h2 className="font-serif-editorial text-lg font-bold text-[#070F18]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#070F18] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {children}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E2D9] bg-[#FAF9F5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E2D9] text-[#64748B] hover:text-[#070F18] text-xs font-bold tracking-wider uppercase rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-[#070F18] hover:bg-[#0047AB] text-white text-xs font-bold tracking-wider uppercase rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable form field components
export function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export function FormInput({
  label,
  required,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label} required={required}>
      <input
        required={required}
        className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 text-xs rounded-md outline-none focus:border-[#070F18] transition-colors"
        {...props}
      />
    </FormField>
  );
}

export function FormTextarea({
  label,
  required,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField label={label} required={required}>
      <textarea
        required={required}
        className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 text-xs rounded-md outline-none focus:border-[#070F18] resize-none transition-colors"
        rows={4}
        {...props}
      />
    </FormField>
  );
}

export function FormSelect({
  label,
  required,
  options,
  ...props
}: {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FormField label={label} required={required}>
      <select
        required={required}
        className="w-full bg-[#FAF9F5] border border-[#E5E2D9] px-3 py-2 text-xs rounded-md outline-none focus:border-[#070F18] transition-colors"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
