'use client';

import React from 'react';
import Image from 'next/image';
import { Quote, Sparkles, AlertCircle, Compass } from 'lucide-react';

interface RichStoryRendererProps {
  content?: string;
  className?: string;
}

/**
 * Parses and renders rich editorial markdown for SAKALA journey stories.
 * Supports:
 * - Dropped caps for opening paragraph
 * - Headings (#, ##, ###)
 * - Pull quotes (> "quote...")
 * - Callout blocks (:::callout or [BRIEFING] / [CATATAN])
 * - Images with captions (![caption](url))
 * - Bullet lists (- item) and Numbered lists (1. item)
 * - Bold (**text**) and Italic (*text*)
 * - Horizontal rules (---)
 */
export default function RichStoryRenderer({ content, className = '' }: RichStoryRendererProps) {
  if (!content || !content.trim()) {
    return (
      <div className="py-12 px-6 text-center bg-[#FAF9F5] border border-dashed border-[#E5E2D9] rounded-md my-8">
        <Compass className="w-8 h-8 text-[#94A3B8] mx-auto mb-3 opacity-60" />
        <p className="text-sm font-serif-editorial text-[#070F18] font-bold">
          Belum ada cerita yang ditulis.
        </p>
        <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
          Gunakan tombol Edit Konten di CMS untuk menulis cerita perjalanan dan catatan garasi ini.
        </p>
      </div>
    );
  }

  // Parse lines into structured blocks
  const blocks = parseStoryContent(content);

  return (
    <div className={`editorial-story space-y-6 sm:space-y-8 text-[#2D3748] leading-[1.85] ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading-1':
            return (
              <h2
                key={idx}
                className="font-serif-editorial text-3xl sm:text-4xl font-black text-[#070F18] pt-6 pb-2 tracking-tight border-b border-[#E5E2D9] leading-tight"
              >
                {renderInlineFormatting(block.text)}
              </h2>
            );

          case 'heading-2':
            return (
              <h3
                key={idx}
                className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#070F18] pt-6 tracking-tight leading-snug flex items-center gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-[#C5AA00] shrink-0" />
                <span>{renderInlineFormatting(block.text)}</span>
              </h3>
            );

          case 'heading-3':
            return (
              <h4
                key={idx}
                className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#070F18] pt-4 tracking-tight leading-snug text-[#0047AB]"
              >
                {renderInlineFormatting(block.text)}
              </h4>
            );

          case 'pullquote':
            return (
              <figure key={idx} className="my-10 py-6 sm:py-8 border-y-2 border-[#E5E2D9] bg-[#FAF9F5]/60 px-6 sm:px-10 rounded-sm text-center">
                <Quote className="w-8 h-8 text-[#C5AA00]/40 mx-auto mb-3" />
                <blockquote className="font-serif-editorial text-xl sm:text-2xl lg:text-3xl font-black text-[#070F18] leading-snug max-w-2xl mx-auto italic">
                  “{renderInlineFormatting(block.text)}”
                </blockquote>
                {block.author && (
                  <figcaption className="text-[10px] font-bold tracking-[0.25em] text-[#C5AA00] uppercase mt-4 block">
                    — {block.author}
                  </figcaption>
                )}
              </figure>
            );

          case 'callout':
            return (
              <div
                key={idx}
                className="bg-white border-l-4 border-[#070F18] p-5 sm:p-6 my-8 rounded-r-xs shadow-xs border-y border-r border-[#E5E2D9]"
              >
                {block.title && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#0047AB] uppercase block">
                      {block.title}
                    </span>
                  </div>
                )}
                <div className="font-serif-editorial text-base sm:text-lg italic font-semibold text-[#070F18] leading-relaxed">
                  {renderInlineFormatting(block.text)}
                </div>
                {block.footer && (
                  <span className="text-[10px] text-[#64748B] block mt-2.5 font-mono">
                    — {block.footer}
                  </span>
                )}
              </div>
            );

          case 'image':
            return (
              <figure key={idx} className="my-8 space-y-2">
                <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#070F18] rounded-xs overflow-hidden border border-[#E5E2D9] shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.imageUrl}
                    alt={block.caption || 'Dokumentasi perjalanan'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-[11px] sm:text-xs text-[#64748B] italic text-center font-light pt-1">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'list':
            return (
              <ul key={idx} className="space-y-2.5 my-6 pl-2 sm:pl-4">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5AA00] mt-2.5 shrink-0" />
                    <span>{renderInlineFormatting(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'divider':
            return (
              <div key={idx} className="flex items-center justify-center gap-4 my-12 text-[#C5AA00]">
                <div className="h-px bg-[#E5E2D9] flex-1" />
                <span className="text-xs tracking-[0.3em] font-serif-editorial font-bold uppercase text-[#94A3B8]">
                  • SAKALA •
                </span>
                <div className="h-px bg-[#E5E2D9] flex-1" />
              </div>
            );

          case 'paragraph':
          default:
            // First paragraph gets editorial Drop Cap styling
            const isFirst = idx === 0 || (idx === 1 && blocks[0].type.startsWith('heading'));
            if (isFirst) {
              return (
                <p
                  key={idx}
                  className="text-sm sm:text-base leading-[1.85] first-letter:font-serif-editorial first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-3.5 first-letter:text-[#070F18] first-letter:leading-none"
                >
                  {renderInlineFormatting(block.text)}
                </p>
              );
            }
            return (
              <p key={idx} className="text-sm sm:text-base leading-[1.85]">
                {renderInlineFormatting(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}

// ========================================
// Parser Helpers
// ========================================

interface Block {
  type: 'heading-1' | 'heading-2' | 'heading-3' | 'paragraph' | 'pullquote' | 'callout' | 'image' | 'list' | 'divider';
  text: string;
  author?: string;
  title?: string;
  footer?: string;
  imageUrl?: string;
  caption?: string;
  items: string[];
}

function parseStoryContent(raw: string): Block[] {
  const lines = raw.split(/\r?\n/);
  const blocks: Block[] = [];
  let currentList: string[] = [];

  function flushList() {
    if (currentList.length > 0) {
      blocks.push({
        type: 'list',
        text: '',
        items: [...currentList],
      });
      currentList = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushList();
      continue;
    }

    // Horizontal Rule
    if (line === '---' || line === '***' || line === '___') {
      flushList();
      blocks.push({ type: 'divider', text: '', items: [] });
      continue;
    }

    // Image: ![caption](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushList();
      blocks.push({
        type: 'image',
        text: '',
        caption: imgMatch[1],
        imageUrl: imgMatch[2],
        items: [],
      });
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      flushList();
      blocks.push({ type: 'heading-1', text: line.replace(/^#\s+/, ''), items: [] });
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      blocks.push({ type: 'heading-2', text: line.replace(/^##\s+/, ''), items: [] });
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      blocks.push({ type: 'heading-3', text: line.replace(/^###\s+/, ''), items: [] });
      continue;
    }

    // Pull Quote: > "quote" — Author
    if (line.startsWith('>')) {
      flushList();
      const quoteBody = line.replace(/^>\s*/, '').trim();
      let author = '';
      let text = quoteBody;
      if (quoteBody.includes('—') || quoteBody.includes('--')) {
        const parts = quoteBody.split(/—|--/);
        text = parts[0].trim().replace(/^["']|["']$/g, '');
        author = parts[1].trim();
      } else {
        text = quoteBody.replace(/^["']|["']$/g, '');
      }
      blocks.push({
        type: 'pullquote',
        text,
        author,
        items: [],
      });
      continue;
    }

    // Callout Box: [BRIEFING: Title] body OR [CATATAN] body
    if (line.startsWith('[BRIEFING') || line.startsWith('[CATATAN') || line.startsWith(':::callout')) {
      flushList();
      const titleMatch = line.match(/\[(BRIEFING|CATATAN):?\s*(.*?)\]/i);
      const title = titleMatch ? `${titleMatch[1].toUpperCase()} — ${titleMatch[2] || 'CATATAN JALAN'}` : 'ROAD BRIEFING';
      const cleanText = line.replace(/\[.*?\]|:::callout/gi, '').trim();
      blocks.push({
        type: 'callout',
        title,
        text: cleanText || 'Catatan khusus untuk para pengendara di rute perjalanan.',
        footer: 'SAKALA MOTORCYCLE CLUB',
        items: [],
      });
      continue;
    }

    // Bullet List: - item or * item
    if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
      const itemText = line.replace(/^[-*]\s+|\d+\.\s+/, '');
      currentList.push(itemText);
      continue;
    }

    // Regular Paragraph
    flushList();
    blocks.push({
      type: 'paragraph',
      text: line,
      items: [],
    });
  }

  flushList();
  return blocks;
}

/**
 * Parses inline formatting (**bold**, *italic*, `code`) into React elements
 */
function renderInlineFormatting(text: string): React.ReactNode {
  if (!text) return null;

  // Split by bold (**...**) and italic (*...*)
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-[#070F18]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-[#475569]">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="bg-[#FAF9F5] border border-[#E5E2D9] px-1.5 py-0.5 rounded text-xs font-mono text-[#0047AB]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
