"use client";

import EditableWrapper from "@/components/cms/EditableWrapper";
import RichStoryRenderer from "@/components/journal/RichStoryRenderer";
import { useInlineCMS } from "@/context/InlineCMSContext";
import { JournalPost } from "@/types/database";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Clock,
  Edit3,
  Maximize2,
  Share2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface JournalDetailClientProps {
  post: JournalPost;
  otherPosts: JournalPost[];
}

export default function JournalDetailClient({
  post,
  otherPosts,
}: JournalDetailClientProps) {
  const { isEditMode, setEditingItem } = useInlineCMS();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <EditableWrapper
      item={{
        type: "journal",
        id: post.id,
        data: post as unknown as Record<string, unknown>,
      }}
    >
      <div className="relative">
        {/* Floating Quick Edit Action when in Edit Mode */}
        {isEditMode && (
          <div className="sticky top-20 z-40 max-w-5xl mx-auto px-6 mb-4">
            <div className="p-3.5 bg-[#070F18] border-2 border-[#C5AA00] text-white rounded-md shadow-2xl flex items-center justify-between gap-4 animate-fade-in-up">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-[#C5AA00] animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-[#C5AA00] uppercase tracking-wider block">
                    MODE CMS AKTIF: ARTIKEL JURNAL
                  </span>
                  <p className="text-[11px] text-[#94A3B8]">
                    Anda sedang melihat artikel ini. Klik tombol di kanan untuk
                    mengedit judul, cerita lengkap, foto, dan format tulisan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingItem({
                    type: "journal",
                    id: post.id,
                    data: post as unknown as Record<string, unknown>,
                  })
                }
                className="px-4 py-2 bg-[#C5AA00] hover:bg-[#D4B800] text-black text-xs font-bold tracking-wider uppercase rounded-sm transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                <span>EDIT CERITA LENGKAP</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Editorial Breadcrumb & Category Bar */}
        <div className="border-b border-[#E5E2D9] bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#64748B]">
            <div className="flex items-center gap-2">
              <Link
                href="/journal"
                className="hover:text-[#070F18] flex items-center gap-1.5 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>ARSIP JURNAL</span>
              </Link>
              <span>/</span>
              <span className="text-[#0047AB]">{post.category}</span>
            </div>

            <div className="flex items-center gap-4 text-[#070F18]">
              <span className="flex items-center gap-1 text-[#64748B]">
                <Clock className="w-3.5 h-3.5 text-[#C5AA00]" />
                <span className="font-semibold text-[#070F18]">
                  {post.read_time}
                </span>
              </span>
              <span>•</span>
              <span className="text-[#64748B]">{post.publish_date}</span>
              <span>•</span>
              <button
                type="button"
                onClick={handleShare}
                className="hover:text-[#0047AB] flex items-center gap-1 cursor-pointer transition-colors text-[9px]"
                title="Salin tautan artikel"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">TERSALIN</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3 h-3" />
                    <span>BAGIKAN</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Article Header & Editorial Masthead */}
        <header className="max-w-5xl mx-auto px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#0047AB] uppercase mb-3 block">
            CATATAN PERJALANAN & DOKUMENTASI SAKALA
          </span>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-black text-[#070F18] tracking-tight leading-[1.08] mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="font-serif-editorial text-lg sm:text-xl lg:text-2xl text-[#475569] font-normal leading-relaxed italic max-w-4xl mb-8 border-l-3 border-[#C5AA00] pl-6 bg-[#FAF9F5] py-2 rounded-r-sm">
              "{post.excerpt}"
            </p>
          )}

          {/* Author and Metadata Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#E5E2D9] rounded-xs text-xs mb-8 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#070F18] text-[#C5AA00] flex items-center justify-center font-serif-editorial text-sm font-bold border border-[#C5AA00]">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[9px] font-bold tracking-wider text-[#64748B] uppercase block">
                  PENCATAT / PENULIS
                </span>
                <span className="font-bold text-[#070F18]">{post.author}</span>
                {post.author_role && (
                  <span className="text-[10px] text-[#64748B] ml-1.5">
                    • {post.author_role}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 text-[11px] text-[#64748B]">
              {post.photographer && (
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#0047AB]" />
                  <span>
                    Foto: <strong>{post.photographer}</strong>
                  </span>
                </div>
              )}
              <div>
                <span>
                  Diterbitkan: <strong>{post.publish_date}</strong>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div
            onClick={() => setLightboxImg(post.cover_image_url)}
            className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#070F18] rounded-xs overflow-hidden border border-[#E5E2D9] shadow-xl group cursor-zoom-in"
          >
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold tracking-widest uppercase gap-2 backdrop-blur-[1px]">
              <Maximize2 className="w-5 h-5 text-[#C5AA00]" />
              <span>KLIK UNTUK MEMPERBESAR FOTO</span>
            </div>
          </div>
        </section>

        {/* Editorial Body Content (100% Dynamic from post.content) */}
        <article className="max-w-3xl mx-auto px-6 text-[#2D3748] leading-relaxed pb-12">
          <RichStoryRenderer content={post.content} />

          {/* Photo Gallery (If Present) */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-14 pt-10 border-t border-[#E5E2D9]">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#0047AB] uppercase block mb-2">
                DOKUMENTASI VISUAL PERJALANAN
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#070F18] mb-6">
                ARSIP FOTO LAPANGAN
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.gallery.map((img, gIdx) => (
                  <div
                    key={gIdx}
                    onClick={() => setLightboxImg(img)}
                    className="relative aspect-[4/3] rounded-xs overflow-hidden border border-[#E5E2D9] bg-[#070F18] cursor-zoom-in group shadow-xs"
                  >
                    <Image
                      src={img}
                      alt={`Dokumentasi ${gIdx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-[10px] tracking-wider uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                      <span>Dokumentasi {gIdx + 1}</span>
                      <Maximize2 className="w-3.5 h-3.5 text-[#C5AA00]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author info card */}
          <div className="my-14 p-6 sm:p-8 bg-white border border-[#E5E2D9] rounded-xs shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#070F18] text-[#C5AA00] flex items-center justify-center font-serif-editorial text-2xl font-bold border-2 border-[#C5AA00] flex-shrink-0 shadow-md">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#0047AB] uppercase">
                    PENULIS CATATAN
                  </span>
                  <span>•</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">
                    SAKALA BANDUNG
                  </span>
                </div>
                <h4 className="font-serif-editorial text-xl font-bold text-[#070F18]">
                  {post.author}
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Anggota dan pencatat perjalanan resmi Sakala Motorcycle Club
                  Bandung. Mendokumentasikan ekspedisi, rute pegunungan, dan
                  budaya kustom roda dua.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Read Next (Editorial Recirculation) */}
        {otherPosts.length > 0 && (
          <section className="bg-white border-t border-[#E5E2D9] py-16">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#0047AB] uppercase block mb-1">
                    BACA JUGA
                  </span>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl font-black text-[#070F18]">
                    CATATAN PERJALANAN LAINNYA
                  </h3>
                </div>

                <Link
                  href="/journal"
                  className="text-xs font-bold tracking-[0.16em] uppercase text-[#070F18] hover:text-[#0047AB] transition-colors flex items-center gap-1.5 group"
                >
                  <span>SEMUA ARTIKEL</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {otherPosts.map((other) => (
                  <Link
                    key={other.id}
                    href={`/journal/${other.slug}`}
                    className="group bg-[#FAF9F5] border border-[#E5E2D9] rounded-xs p-6 hover:border-[#070F18] transition-colors flex flex-col justify-between shadow-xs card-interactive"
                  >
                    <div>
                      <span className="text-[9px] font-bold tracking-[0.2em] text-[#0047AB] uppercase block mb-2">
                        {other.category} • {other.publish_date}
                      </span>
                      <h4 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#070F18] group-hover:text-[#0047AB] transition-colors mb-3 leading-snug">
                        {other.title}
                      </h4>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                        {other.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E5E2D9] flex items-center justify-between text-xs font-bold tracking-[0.16em] uppercase text-[#070F18] group-hover:text-[#0047AB]">
                      <span>BACA ARTIKEL</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Lightbox Modal */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxImg}
                alt="Foto Dokumentasi SAKALA"
                className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </EditableWrapper>
  );
}
