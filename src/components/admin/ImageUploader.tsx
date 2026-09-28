'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/supabase/admin';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'uploads',
  label = 'Image',
}: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
        {label}
      </label>

      {value ? (
        <div className="relative group">
          <div className="w-full h-40 bg-[#FAF9F5] border border-[#E5E2D9] rounded-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            dragOver
              ? 'border-[#C5AA00] bg-[#C5AA00]/5'
              : 'border-[#E5E2D9] hover:border-[#94A3B8] bg-[#FAF9F5]'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#C5AA00] border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-[#64748B]">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-[#94A3B8]" />
              <span className="text-[10px] text-[#94A3B8]">
                Drop image here or click to browse
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-500 mt-1">{error}</p>
      )}

      {/* Manual URL input fallback */}
      <div className="mt-2 flex items-center gap-2">
        <ImageIcon className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          className="flex-1 bg-transparent border-b border-[#E5E2D9] px-1 py-1 text-[10px] outline-none focus:border-[#070F18] text-[#64748B] transition-colors"
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
