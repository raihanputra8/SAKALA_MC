'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  ExternalLink,
  AlertCircle,
  Play
} from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import EditableWrapper from '@/components/cms/EditableWrapper';
import { useInlineCMS } from '@/context/InlineCMSContext';
import { InstagramConfig } from '@/types/database';

function getYouTubeVideoId(url: string): string {
  if (!url) return 'IK0VG7j2P9s';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.trim().match(regExp);
  return (match && match[2].length === 11) ? match[2] : 'IK0VG7j2P9s';
}

function extractInstagramHandle(url: string): string {
  if (!url) return '@instagram';
  try {
    const clean = url.trim();
    const parsed = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length > 0 && segments[0] !== 'p' && segments[0] !== 'reel' && segments[0] !== 'reels') {
      return `@${segments[0]}`;
    }
    return '@instagram';
  } catch {
    return '@instagram';
  }
}

interface FetchedPost {
  shortcode: string;
  permalink: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
  title?: string;
  has_official_media: boolean;
  error?: string;
}

export default function CultureSection() {
  const { getContent } = useInlineCMS();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAutoPlayTriggered, setIsAutoPlayTriggered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 1. CMS CONFIGURATION: Source of truth for Instagram configuration
  const defaultInstagramConfig: InstagramConfig = {
    profile_url: 'https://www.instagram.com/sakala_ina/',
    post_urls: [
      'https://www.instagram.com/p/DAXwK_JzV2O/',
      'https://www.instagram.com/p/DAUvP91TVnI/',
      'https://www.instagram.com/p/C_2mQ7mS3x8/',
      'https://www.instagram.com/p/C_rF6d_SiQ7/',
    ],
    enabled: true,
  };

  const instagramConfig = getContent('instagram_config', defaultInstagramConfig as unknown as Record<string, any>) as unknown as InstagramConfig;
  const profileUrl = instagramConfig.profile_url || defaultInstagramConfig.profile_url;
  const profileHandle = extractInstagramHandle(profileUrl);

  // 2. Official Instagram Posts Data (Fetched server-side via /api/instagram)
  const [posts, setPosts] = useState<FetchedPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const urls = instagramConfig.post_urls || [];

    if (!instagramConfig.enabled || urls.length === 0) {
      setPosts([]);
      setLoadingPosts(false);
      return;
    }

    async function loadInstagramPosts() {
      setLoadingPosts(true);
      setFetchError(null);

      try {
        const res = await fetch(`/api/instagram?urls=${encodeURIComponent(JSON.stringify(urls))}`, {
          cache: 'default',
        });

        if (!res.ok) {
          throw new Error(`Failed to load posts (status ${res.status})`);
        }

        const json = await res.json();
        if (isMounted) {
          if (json.posts && Array.isArray(json.posts)) {
            setPosts(json.posts);
          } else {
            setPosts([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(err instanceof Error ? err.message : 'Error fetching Instagram content');
        }
      } finally {
        if (isMounted) {
          setLoadingPosts(false);
        }
      }
    }

    loadInstagramPosts();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(instagramConfig.post_urls), instagramConfig.enabled]);

  // 3. YouTube Video Content (Editable via CMS)
  const videoContent = getContent('culture_video', {
    title: 'SAKALA MOTORCYCLE CLUB — OFFICIAL VIDEO',
    video_url: 'https://youtu.be/IK0VG7j2P9s',
  });

  const youtubeVideoId = getYouTubeVideoId(videoContent.video_url || 'https://youtu.be/IK0VG7j2P9s');

  // Carousel scroll controls
  const checkScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    checkScrollState();
  }, [posts, loadingPosts]);

  // Auto-play YouTube on scroll into view
  useEffect(() => {
    if (!videoContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsAutoPlayTriggered(true);
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(videoContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="culture" className="bg-[#070F18] text-white py-16 sm:py-20 lg:py-24 border-b border-[#C5AA00]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* 1. DI TENGAH: LOGO SAKALA_MC.PNG */}
        <ScrollReveal direction="up" delay={50} className="flex flex-col items-center justify-center text-center mb-12 sm:mb-14">
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 drop-shadow-[0_20px_45px_rgba(197,170,0,0.25)]">
            <Image
              src="/assets/SAKALA_MC.PNG"
              alt="Sakala MC Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-serif-editorial text-2xl sm:text-4xl font-black tracking-[0.14em] text-white mt-3 block">
            SAKALA MOTORCYCLE CLUB
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5AA00] uppercase mt-1">
            BANDUNG, INDONESIA
          </span>
        </ScrollReveal>

        {/* 2. REAL INSTAGRAM INTEGRATION (CMS-CONTROLLED) */}
        {instagramConfig.enabled && (
          <ScrollReveal direction="up" delay={80} className="mb-14 sm:mb-16">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-7 backdrop-blur-xs shadow-2xl">
              
              {/* Profile Header (Driven by CMS profile_url, zero fake follower/post counts) */}
              <EditableWrapper
                item={{
                  type: 'content',
                  id: 'instagram_config',
                  data: {
                    profile_url: instagramConfig.profile_url,
                    post_urls: instagramConfig.post_urls,
                    enabled: instagramConfig.enabled,
                  },
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 px-1">
                  {/* Left: Instagram Icon + Handle */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-0.5 flex items-center justify-center shrink-0 shadow-md">
                      <div className="w-full h-full bg-[#070F18] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                        {profileHandle}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">
                        Instagram
                      </span>
                    </div>
                  </div>

                  {/* Right: Official Follow Button */}
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="self-start sm:self-center inline-flex items-center gap-2 bg-[#0095F6] hover:bg-[#1877F2] text-white px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 btn-tactile cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Follow</span>
                  </a>
                </div>
              </EditableWrapper>

              {/* Feed Track */}
              <div className="relative group/carousel min-h-[300px]">
                
                {/* Floating Left Arrow */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white text-[#070F18] rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Previous posts"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                )}

                {/* State A: Loading Shimmer */}
                {loadingPosts ? (
                  <div className="flex gap-4 sm:gap-5 overflow-hidden pb-2 pt-1 px-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="shrink-0 w-[240px] sm:w-[260px] md:w-[275px] aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 animate-pulse flex flex-col justify-end p-4"
                      >
                        <div className="h-3 w-2/3 bg-white/10 rounded mb-2" />
                        <div className="h-2 w-1/3 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                ) : fetchError ? (
                  /* State B: Fetch Error */
                  <div className="py-12 px-4 text-center flex flex-col items-center justify-center bg-black/30 rounded-xl border border-white/10">
                    <AlertCircle className="w-8 h-8 text-[#C5AA00] mb-3" />
                    <p className="text-sm font-semibold text-white mb-1">Instagram Content Unavailable</p>
                    <p className="text-xs text-[#94A3B8] max-w-md mb-4">
                      Unable to reach Instagram server at this moment. You can browse our feed directly on Instagram.
                    </p>
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold rounded-md transition-colors"
                    >
                      <span>View on Instagram</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : posts.length === 0 ? (
                  /* State C: No post configured */
                  <div className="py-12 px-4 text-center flex flex-col items-center justify-center bg-black/30 rounded-xl border border-white/10">
                    <p className="text-sm font-semibold text-white mb-2">No Instagram Posts Configured</p>
                    <p className="text-xs text-[#94A3B8] max-w-md mb-4">
                      Add Instagram post permalinks in the CMS to display them here.
                    </p>
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-md transition-colors"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  /* State D: Real Instagram Posts Track */
                  <div
                    ref={carouselRef}
                    onScroll={checkScrollState}
                    className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none pb-2 pt-1 px-1 snap-x snap-mandatory"
                  >
                    {posts.map((post) => (
                      <div
                        key={post.shortcode || post.permalink}
                        className="snap-start shrink-0 w-[240px] sm:w-[260px] md:w-[275px]"
                      >
                        <a
                          href={post.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="relative block aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 bg-[#0C1724] shadow-xl group transition-all duration-300"
                        >
                          {post.has_official_media && post.thumbnail_url ? (
                            /* Sub-case 1: Official Media from Meta Graph oEmbed */
                            <>
                              <Image
                                src={post.thumbnail_url}
                                alt={post.title || 'Instagram Post'}
                                fill
                                sizes="280px"
                                unoptimized={Boolean(post.thumbnail_url.includes('fbcdn.net') || post.thumbnail_url.includes('cdninstagram.com'))}
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                              />

                              {/* Bottom Info Gradient Overlay: Only authentic data from Meta */}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-14 pb-3.5 px-3.5 flex flex-col justify-end">
                                {post.title && (
                                  <p className="text-white text-[11px] line-clamp-2 leading-snug mb-1.5 opacity-90">
                                    {post.title}
                                  </p>
                                )}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="min-w-0 flex items-center gap-1.5">
                                    {post.author_name && (
                                      <span className="text-white text-[11px] font-semibold leading-tight truncate">
                                        @{post.author_name}
                                      </span>
                                    )}
                                    <span className="text-white/60 text-[9.5px] leading-tight">
                                      • View on Instagram
                                    </span>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-white/70 shrink-0" />
                                </div>
                              </div>
                            </>
                          ) : (
                            /* Sub-case 2: Clean fallback when official media is not available (Zero fake data) */
                            <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-[#0B1522] border border-white/5">
                              <svg className="w-8 h-8 fill-[#E1306C] mb-3 opacity-80" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                              <p className="text-xs text-[#94A3B8] mb-4">
                                Instagram post unavailable
                              </p>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0095F6] group-hover:bg-[#1877F2] text-white text-[11px] font-semibold rounded transition-colors">
                                <span>View on Instagram</span>
                                <ExternalLink className="w-3 h-3" />
                              </span>
                            </div>
                          )}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Floating Right Arrow */}
                {canScrollRight && !loadingPosts && posts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white text-[#070F18] rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Next posts"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                )}

              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 3. AKUN MEDIA SOSIAL (Tombol Akses Saluran Resmi) */}
        <ScrollReveal direction="up" delay={100} className="mb-14 sm:mb-16">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
            {/* Instagram Profile */}
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-all text-xs font-semibold text-white group shadow-sm hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current text-[#E1306C]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>{profileHandle}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@sakala.id25?si=4ScKIl-5ZM3UJ0tS"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#FF0000] hover:bg-[#FF0000]/10 transition-all text-xs font-semibold text-white group shadow-sm"
            >
              <svg className="w-4 h-4 fill-current text-[#FF0000]" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube Sakala</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@sakala_ina?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#00F2FE] hover:bg-[#00F2FE]/10 transition-all text-xs font-semibold text-white group shadow-sm hover:scale-105"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#00F2FE]" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span>TikTok</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </ScrollReveal>

        {/* 4. VIDEO UTAMA (CLEAN: AUTO-PLAY SAAT SCROLL KE SECTION, CMS EDITABLE) */}
        <ScrollReveal direction="up" delay={120}>
          <div className="max-w-3xl mx-auto" ref={videoContainerRef}>
            <EditableWrapper
              item={{
                type: 'content',
                id: 'culture_video',
                data: {
                  title: videoContent.title,
                  video_url: videoContent.video_url,
                },
              }}
            >
              <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-[#C5AA00]/30 group">
                {isAutoPlayTriggered ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&mute=1&playsinline=1&controls=1&loop=1&playlist=${youtubeVideoId}`}
                    title={videoContent.title || 'SAKALA Motorcycle Club Official Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-black/60">
                    <div className="w-16 h-16 rounded-full bg-[#0047AB] text-white flex items-center justify-center shadow-2xl">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </div>
                  </div>
                )}
              </div>
            </EditableWrapper>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
