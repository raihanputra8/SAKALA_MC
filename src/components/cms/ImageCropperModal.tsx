'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Move, Crop, Loader2 } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  defaultAspectRatio?: number; // e.g. 16/9, 4/3, 1
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => Promise<void> | void;
  title?: string;
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  defaultAspectRatio = 16 / 9,
  onClose,
  onCropComplete,
  title = 'Pilih & Sesuaikan Crop Foto',
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Convert remote or blob URL into a local blob object URL to bypass any CORS canvas tainting
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    let active = true;
    setImageLoaded(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });

    if (imageSrc.startsWith('blob:') || imageSrc.startsWith('data:')) {
      setBlobUrl(imageSrc);
      return;
    }

    // Fetch and create object URL
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        if (!active) return;
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch((err) => {
        console.warn('Direct fetch failed, falling back to original URL:', err);
        if (active) setBlobUrl(imageSrc);
      });

    return () => {
      active = false;
    };
  }, [isOpen, imageSrc]);

  // Lock background body scroll when cropper modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle Drag / Pan (Mouse and Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch support for mobile / tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, 1), 3));
  };

  // Preset Position alignments
  const alignTop = () => {
    if (!imageRef.current || !containerRef.current) return;
    const imgHeight = imageRef.current.offsetHeight * zoom;
    const containerHeight = containerRef.current.offsetHeight;
    const maxOffsetY = (imgHeight - containerHeight) / 2;
    setPosition((prev) => ({ ...prev, y: maxOffsetY }));
  };

  const alignCenter = () => {
    setPosition({ x: 0, y: 0 });
  };

  const alignBottom = () => {
    if (!imageRef.current || !containerRef.current) return;
    const imgHeight = imageRef.current.offsetHeight * zoom;
    const containerHeight = containerRef.current.offsetHeight;
    const maxOffsetY = -(imgHeight - containerHeight) / 2;
    setPosition((prev) => ({ ...prev, y: maxOffsetY }));
  };

  // Perform the actual Canvas Crop
  const handleApplyCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const container = containerRef.current;

      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Target canvas output dimensions (high-res 1200px width)
      const outputWidth = 1200;
      const outputHeight = Math.round(outputWidth / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Ratio between natural image size and current rendered image size
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;

      // Calculate where the container's crop box lands on the natural image
      const sourceX = Math.max(0, (containerRect.left - imgRect.left) * scaleX);
      const sourceY = Math.max(0, (containerRect.top - imgRect.top) * scaleY);
      const sourceWidth = Math.min(img.naturalWidth - sourceX, containerRect.width * scaleX);
      const sourceHeight = Math.min(img.naturalHeight - sourceY, containerRect.height * scaleY);

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );

      // Convert canvas to JPEG blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          await onCropComplete(blob);
          setIsProcessing(false);
          onClose();
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error('Crop error:', err);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div 
        className="relative bg-[#070F18] border border-[#C5AA00]/30 rounded-lg shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col z-10 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0C1724]">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-[#C5AA00]" />
            <span className="font-serif-editorial text-base font-bold text-white tracking-wide">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div 
          className="p-6 flex flex-col items-center select-none overflow-y-auto flex-1 min-h-0"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Instructions banner */}
          <div className="w-full flex items-center justify-between text-[11px] text-[#94A3B8] mb-3 px-1">
            <span className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-[#C5AA00]" />
              Geser (drag) foto untuk memilih fokus framing
            </span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
          </div>

          {/* Interactive Crop Frame Container */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              aspectRatio: `${aspectRatio}`,
              maxHeight: '48vh',
              width: '100%',
            }}
            className="relative bg-black rounded-md overflow-hidden border-2 border-[#C5AA00] cursor-grab active:cursor-grabbing flex items-center justify-center shadow-inner"
          >
            {/* The Image being positioned & zoomed */}
            {blobUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imageRef}
                src={blobUrl}
                alt="Crop preview"
                onLoad={() => setImageLoaded(true)}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                className={`w-full h-full object-cover origin-center ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                crossOrigin="anonymous"
              />
            )}

            {/* Rule of Thirds Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>

            {/* Loading indicator */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#070F18]/80 text-[#C5AA00]">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="w-full mt-5 space-y-4">
            {/* Aspect Ratio & Quick Align */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Aspect Ratio presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase mr-1">
                  Rasio:
                </span>
                <button
                  type="button"
                  onClick={() => setAspectRatio(16 / 9)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-xs transition-colors ${
                    Math.abs(aspectRatio - 16 / 9) < 0.05
                      ? 'bg-[#C5AA00] text-black'
                      : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10'
                  }`}
                >
                  16:9 (Card)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio(4 / 3)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-xs transition-colors ${
                    Math.abs(aspectRatio - 4 / 3) < 0.05
                      ? 'bg-[#C5AA00] text-black'
                      : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10'
                  }`}
                >
                  4:3
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio(1)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-xs transition-colors ${
                    Math.abs(aspectRatio - 1) < 0.05
                      ? 'bg-[#C5AA00] text-black'
                      : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10'
                  }`}
                >
                  1:1 (Square)
                </button>
              </div>

              {/* Quick Vertical Alignment Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase mr-1">
                  Fokus:
                </span>
                <button
                  type="button"
                  onClick={alignTop}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white border border-white/10 rounded-xs transition-colors"
                  title="Fokus bagian atas (kepala / rider)"
                >
                  Atas
                </button>
                <button
                  type="button"
                  onClick={alignCenter}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white border border-white/10 rounded-xs transition-colors"
                  title="Fokus tengah"
                >
                  Tengah
                </button>
                <button
                  type="button"
                  onClick={alignBottom}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white border border-white/10 rounded-xs transition-colors"
                  title="Fokus bagian bawah (roda / mesin)"
                >
                  Bawah
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="p-1 text-[#94A3B8] hover:text-white transition-colors"
                  title="Reset Zoom & Posisi"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Zoom Slider */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-md">
              <ZoomOut className="w-4 h-4 text-[#94A3B8]" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#C5AA00] cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-[#94A3B8]" />
            </div>
          </div>
        </div>

        {/* Footer Actions (Fixed Bottom) */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#0C1724]">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing || !imageLoaded}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C5AA00] hover:bg-[#d8bc00] text-black text-xs font-bold tracking-wider uppercase rounded-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md btn-tactile"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Crop...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Terapkan Crop &amp; Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
