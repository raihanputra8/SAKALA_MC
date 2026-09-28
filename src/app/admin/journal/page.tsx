'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, StarOff } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormModal, { FormInput, FormTextarea, FormSelect } from '@/components/admin/FormModal';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  getAllJournalPosts,
  createJournalPost,
  updateJournalPost,
  deleteJournalPost,
} from '@/lib/supabase/admin';
import { JournalPost } from '@/types/database';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const emptyForm = {
  title: '',
  slug: '',
  category: 'RIDES',
  read_time: '',
  author: '',
  publish_date: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  featured: false,
};

export default function AdminJournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadPosts() {
    try {
      const data = await getAllJournalPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPosts(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(post: JournalPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      read_time: post.read_time,
      author: post.author,
      publish_date: post.publish_date,
      excerpt: post.excerpt,
      content: post.content || '',
      cover_image_url: post.cover_image_url,
      featured: post.featured || false,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
      };
      if (editingId) {
        await updateJournalPost(editingId, payload);
      } else {
        await createJournalPost(payload);
      }
      setModalOpen(false);
      loadPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to save article');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    try {
      await deleteJournalPost(id);
      loadPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete article');
    }
  }

  async function toggleFeatured(post: JournalPost) {
    try {
      await updateJournalPost(post.id, { featured: !post.featured });
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      label: 'Article',
      render: (p: JournalPost) => (
        <div>
          <p className="font-bold text-[#070F18] text-xs leading-tight">{p.title}</p>
          <p className="text-[10px] text-[#94A3B8] mt-0.5">/{p.slug}</p>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (p: JournalPost) => <span className="uppercase text-[10px] font-bold text-[#64748B]">{p.category}</span> },
    { key: 'author', label: 'Author', render: (p: JournalPost) => <span className="text-[11px]">{p.author}</span> },
    { key: 'publish_date', label: 'Date', render: (p: JournalPost) => <span className="text-[11px]">{p.publish_date}</span> },
    {
      key: 'featured',
      label: 'Featured',
      render: (p: JournalPost) => (
        <button
          onClick={() => toggleFeatured(p)}
          className={`transition-colors p-1 ${p.featured ? 'text-[#C5AA00]' : 'text-[#E5E2D9] hover:text-[#C5AA00]'}`}
          title={p.featured ? 'Remove featured' : 'Set as featured'}
        >
          {p.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
        </button>
      ),
      className: 'w-20 text-center',
    },
    {
      key: 'actions',
      label: '',
      render: (p: JournalPost) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(p)} className="text-[#94A3B8] hover:text-[#0047AB] transition-colors p-1">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(p.id)} className="text-[#94A3B8] hover:text-red-500 transition-colors p-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      className: 'w-20',
    },
  ];

  return (
    <>
      <AdminHeader
        title="Journal"
        subtitle={`${posts.length} articles published`}
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#070F18] hover:bg-[#0047AB] text-white px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Article
          </button>
        }
      />

      <div className="flex-1 p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#C5AA00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            keyField="id"
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search articles by title, author, or category..."
            emptyMessage="No articles found"
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Article' : 'New Article'}
        onSubmit={handleSubmit}
        submitLabel={editingId ? 'Update Article' : 'Publish Article'}
        isLoading={saving}
        size="lg"
      >
        <FormInput
          label="Title"
          required
          placeholder="THE ASCENT OF TANGKUBAN PERAHU"
          value={form.title}
          onChange={(e) => {
            const title = (e.target as HTMLInputElement).value;
            setForm({ ...form, title, slug: editingId ? form.slug : slugify(title) });
          }}
        />
        <FormInput
          label="Slug"
          required
          placeholder="the-ascent-of-tangkuban-perahu"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: (e.target as HTMLInputElement).value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Category"
            required
            options={[
              { value: 'RIDES', label: 'Rides' },
              { value: 'BUILDS', label: 'Builds' },
              { value: 'BROTHERHOOD', label: 'Brotherhood' },
              { value: 'EXPEDITION DISPATCH', label: 'Expedition Dispatch' },
              { value: 'WORKSHOP MONOGRAPH', label: 'Workshop Monograph' },
              { value: 'BROTHERHOOD ARCHIVE', label: 'Brotherhood Archive' },
            ]}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: (e.target as HTMLSelectElement).value })}
          />
          <FormInput
            label="Author"
            required
            placeholder="A. PRATAMA"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: (e.target as HTMLInputElement).value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Publish Date"
            placeholder="OKTOBER 2024"
            value={form.publish_date}
            onChange={(e) => setForm({ ...form, publish_date: (e.target as HTMLInputElement).value })}
          />
          <FormInput
            label="Read Time"
            placeholder="12 MIN READ"
            value={form.read_time}
            onChange={(e) => setForm({ ...form, read_time: (e.target as HTMLInputElement).value })}
          />
        </div>
        <FormTextarea
          label="Excerpt"
          required
          placeholder="Brief summary of the article..."
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: (e.target as HTMLTextAreaElement).value })}
        />
        <FormTextarea
          label="Content (Markdown supported)"
          placeholder="Full article content..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: (e.target as HTMLTextAreaElement).value })}
        />
        <ImageUploader
          label="Cover Image"
          value={form.cover_image_url}
          onChange={(url) => setForm({ ...form, cover_image_url: url })}
          folder="journal"
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="w-4 h-4 accent-[#C5AA00]"
          />
          <span className="text-xs font-bold text-[#070F18]">Featured Article</span>
        </label>
      </FormModal>
    </>
  );
}
