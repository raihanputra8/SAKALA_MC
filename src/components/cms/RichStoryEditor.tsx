'use client';

import React, { useState, useRef } from 'react';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Bold, 
  Italic, 
  Quote, 
  List, 
  Image as ImageIcon, 
  Minus, 
  Eye, 
  Edit3, 
  Sparkles, 
  HelpCircle,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react';
import RichStoryRenderer from '@/components/journal/RichStoryRenderer';

interface RichStoryEditorProps {
  value: string;
  onChange: (newContent: string) => void;
  onUpdateReadTime?: (readTime: string) => void;
  placeholder?: string;
}

export default function RichStoryEditor({
  value,
  onChange,
  onUpdateReadTime,
  placeholder = 'Tuliskan cerita lengkap perjalanan, catatan jalan, atau dokumentasi garasi di sini...',
}: RichStoryEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compute Word Count & Estimated Read Time
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const estimatedMinutes = Math.max(1, Math.ceil(words / 180));
  const readTimeString = `${estimatedMinutes} MENIT BACA`;

  // Helper to insert markdown tags at cursor position
  function insertMarkdown(prefix: string, suffix: string = '', defaultText: string = '') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  }

  // Pre-made SAKALA Story Templates
  function applyTemplate(type: 'touring' | 'workshop') {
    if (value.trim().length > 30) {
      if (!confirm('Konten yang sudah Anda tulis akan ditimpa dengan template baru. Lanjutkan?')) {
        return;
      }
    }

    if (type === 'touring') {
      const template = `## 01:30 WIB — Kumpul di Ciroyom & Persiapan Dingin

Hujan rintik baru saja reda di atas atap seng bengkel Ciroyom. Aroma oli mineral hangat, jaket kulit tebal, dan deru sembilan mesin kustom memenuhi gang sempit sebelum roda berputar menembus kabut Bandung menuju dataran tinggi.

[BRIEFING: INSTRUKSI KAPTEN JALAN]
"Periksa kembali tekanan ban dan rantai primer. Begitu kita mulai menanjak melewati kelokan Setiabudhi, tidak ada bahu jalan untuk menepi. Suhu udara akan turun drastis."

## 02:45 WIB — Jalur Tanjakan Lembang & Kabut Pekat

Dalam jarak lima belas kilometer, hawa dingin menusuk hingga ke tulang. Jalanan pegunungan yang basah menuntut kehati-hatian ekstra dan rasa saling jaga antar pengendara di barisan.

> "Saat kabut menelan lampu utama dua puluh meter di depan, kita tidak lagi mengemudi dengan mata, melainkan dengan getaran mesin yang merambat ke seluruh tubuh." — ROAD CAPTAIN SAKALA

## 04:30 WIB — Titik Temu di Kawah Rim

Tepat sebelum fajar menyingsing, mesin-mesin dimatikan bergantian di tepian kawah. Asap tipis mengepul dari sirip pendingin silinder ke udara beku.

- Sembilan mesin kustom menuntaskan tanjakan tanpa kendala teknis
- Kopi tubruk panas diseduh bersama di pinggir tebing berkabut
- Momen persaudaraan murni tanpa batas sekat dan ambisi kecepatan

---

## 05:30 WIB — Menuruni Lembah Menuju Fajar

Fajar menyambut dengan semburat jingga keemasan di ufuk timur. Perjalanan ini kembali menegaskan bahwa berkendara bersama Sakala bukan tentang siapa yang paling cepat sampai di tujuan, melainkan tentang cerita, rasa hormat, dan komitmen untuk selalu pulang bersama-sama.`;

      onChange(template);
      if (onUpdateReadTime) onUpdateReadTime('6 MENIT BACA');
    } else {
      const template = `## Riset Geometri & Penempaan Rangka Kustom

Proyek build ini dimulai dari kebutuhan akan motor berkarakter tegas yang mampu menaklukkan kontur jalanan berbukit Jawa Barat sekaligus tetap nyaman dikendarai di lalu lintas kota.

[CATATAN: SPESIFIKASI BENGKEL]
Pengerjaan chassis menggunakan pipa chromoly seamless 4130 dengan sambungan las TIG kuningan murni. Geometri rake disetel pada 28 derajat untuk kestabilan manuver.

## Penyetelan Mesin & Karakter Tenaga

Mesin dua silinder dibongkar total, dibersihkan kerak karbonnya, dan dipasangkan karburator ganda Mikuni VM34 dengan intake manifold buatan tangan.

> "Bagi kami di Sakala, membangun motor kustom bukan sekadar merakit suku cadang, melainkan menyatukan jiwa pengrajin ke dalam besi dan api." — KEPALA MEKANIK

- Porting & polish saluran hisap untuk respon putaran bawah lebih padat
- Knalpot stainless pie-cut dengan muffler bergaya scrambler klasik
- Kelistrikan minimalis 12V DC tersembunyi rapi di dalam kotak aki kustom

---

Hasil akhir dari proyek ini adalah sebuah karya fungsional yang siap menjelajah ribuan kilometer aspal nusantara dengan kebanggaan persaudaraan.`;

      onChange(template);
      if (onUpdateReadTime) onUpdateReadTime('4 MENIT BACA');
    }
  }

  return (
    <div className="border border-[#E5E2D9] rounded-md overflow-hidden bg-white shadow-xs">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#FAF9F5] border-b border-[#E5E2D9]">
        {/* Formatting Actions */}
        <div className="flex items-center flex-wrap gap-1">
          <button
            type="button"
            onClick={() => insertMarkdown('\n## ', '\n', 'Judul Bab Perjalanan')}
            title="Judul Bab (H2)"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Heading2 className="w-3.5 h-3.5 text-[#0047AB]" />
            <span className="text-[10px] hidden sm:inline">Bab</span>
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('\n### ', '\n', 'Sub Judul')}
            title="Sub Judul (H3)"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded text-xs font-bold transition-colors cursor-pointer"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#E5E2D9] mx-1" />

          <button
            type="button"
            onClick={() => insertMarkdown('**', '**', 'teks tebal')}
            title="Tebal (Bold)"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded transition-colors cursor-pointer"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('*', '*', 'teks miring')}
            title="Miring (Italic)"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded transition-colors cursor-pointer"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#E5E2D9] mx-1" />

          <button
            type="button"
            onClick={() => insertMarkdown('\n> "', '" — Penulis/Kapten', 'Kutipan berkesan dari perjalanan')}
            title="Kutipan Editorial / Pull Quote"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Quote className="w-3.5 h-3.5 text-[#C5AA00]" />
            <span className="text-[10px] hidden sm:inline">Kutipan</span>
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('\n[BRIEFING: INSTRUKSI KHUSUS]\n', '\n', 'Catatan penting untuk barisan motor di rute ini.')}
            title="Kotak Catatan Briefing"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#0047AB]" />
            <span className="text-[10px] hidden sm:inline">Kotak Catatan</span>
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('\n- ', '', 'Poin catatan penting')}
            title="Daftar Poin"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded transition-colors cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('\n![Keterangan foto](/assets/journal_subang.png)\n', '', '')}
            title="Sisipkan Foto dalam Cerita"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] hidden sm:inline">Foto</span>
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('\n---\n', '', '')}
            title="Pemisah Bagian Cerita"
            className="p-1.5 hover:bg-white text-[#070F18] border border-transparent hover:border-[#E5E2D9] rounded transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Toggle: Tulis vs Pratinjau */}
        <div className="flex items-center gap-1 bg-[#E5E2D9]/60 p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-white text-[#070F18] shadow-xs'
                : 'text-[#64748B] hover:text-[#070F18]'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Tulis</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#070F18] text-[#C5AA00] shadow-xs'
                : 'text-[#64748B] hover:text-[#070F18]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Pratinjau ({words} kata)</span>
          </button>
        </div>
      </div>

      {/* Story Structure Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#F4F1EA] border-b border-[#E5E2D9] text-[10px]">
        <div className="flex items-center gap-2 text-[#64748B]">
          <Sparkles className="w-3 h-3 text-[#C5AA00]" />
          <span className="font-semibold uppercase tracking-wider">Template Cepat:</span>
          <button
            type="button"
            onClick={() => applyTemplate('touring')}
            className="text-[#0047AB] hover:underline font-bold cursor-pointer"
          >
            + Cerita Rute Turing
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => applyTemplate('workshop')}
            className="text-[#0047AB] hover:underline font-bold cursor-pointer"
          >
            + Catatan Riset Bengkel
          </button>
        </div>

        {/* Word count & Read time applicator */}
        <div className="flex items-center gap-2 text-[#64748B]">
          <Clock className="w-3 h-3 text-[#C5AA00]" />
          <span>{words} kata • {readTimeString}</span>
          {onUpdateReadTime && (
            <button
              type="button"
              onClick={() => onUpdateReadTime(readTimeString)}
              className="text-[9px] bg-white border border-[#E5E2D9] hover:border-[#070F18] text-[#070F18] px-2 py-0.5 rounded font-bold uppercase transition-colors cursor-pointer"
            >
              Gunakan Waktu Baca Ini
            </button>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === 'edit' ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={14}
            className="w-full p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed bg-[#FAF9F5] outline-none border-0 resize-y min-h-[320px] focus:bg-white transition-colors"
          />
          <div className="p-2.5 bg-[#FAF9F5] border-t border-[#E5E2D9] flex items-center justify-between text-[10px] text-[#94A3B8]">
            <span>Mendukung Markdown editorial SAKALA: ## Bab, &gt; Kutipan, [BRIEFING: Judul], ![Foto](url), - Poin</span>
            <span>Gunakan tombol Pratinjau untuk melihat hasil tata letak majalah.</span>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 bg-white min-h-[320px] max-h-[500px] overflow-y-auto">
          <div className="mb-4 pb-2 border-b border-[#E5E2D9] flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
            <span>TAMPILAN ARTIKEL ASLI SAAT DIBACA PENGUNJUNG:</span>
            <span className="text-[#0047AB]">LIVE PREVIEW MODE</span>
          </div>
          <RichStoryRenderer content={value} />
        </div>
      )}
    </div>
  );
}
