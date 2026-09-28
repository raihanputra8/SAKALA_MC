'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormModal, { FormInput, FormSelect } from '@/components/admin/FormModal';
import ImageUploader from '@/components/admin/ImageUploader';
import { getAllBikes, createBike, updateBike, deleteBike } from '@/lib/supabase/admin';
import { Bike } from '@/types/database';

const statusOptions = [
  { value: 'archival', label: 'Archival' },
  { value: 'commissioned', label: 'Commissioned' },
  { value: 'private_collection', label: 'Private Collection' },
];

const emptyForm = {
  title: '',
  year: 1980,
  make: '',
  model: '',
  image_url: '',
  status: 'archival' as Bike['status'],
  frame: '',
  exhaust: '',
  colorway: '',
  workshop: '',
};

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadBikes() {
    try {
      const data = await getAllBikes();
      setBikes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBikes(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(bike: Bike) {
    setEditingId(bike.id);
    setForm({
      title: bike.title,
      year: bike.year,
      make: bike.make,
      model: bike.model,
      image_url: bike.image_url,
      status: bike.status,
      frame: bike.specs?.frame || '',
      exhaust: bike.specs?.exhaust || '',
      colorway: bike.specs?.colorway || '',
      workshop: bike.specs?.workshop || '',
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        year: form.year,
        make: form.make,
        model: form.model,
        image_url: form.image_url,
        status: form.status,
        specs: {
          frame: form.frame,
          exhaust: form.exhaust,
          colorway: form.colorway,
          workshop: form.workshop,
        },
      };
      if (editingId) {
        await updateBike(editingId, payload);
      } else {
        await createBike(payload);
      }
      setModalOpen(false);
      loadBikes();
    } catch (err) {
      console.error(err);
      alert('Failed to save bike');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this bike entry? This cannot be undone.')) return;
    try {
      await deleteBike(id);
      loadBikes();
    } catch (err) {
      console.error(err);
      alert('Failed to delete bike');
    }
  }

  const filtered = bikes.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.make.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      label: 'Machine',
      render: (b: Bike) => (
        <div className="flex items-center gap-3">
          {b.image_url && (
            <div className="w-12 h-10 rounded-md overflow-hidden bg-[#FAF9F5] border border-[#E5E2D9] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="font-bold text-[#070F18] text-xs">{b.title}</p>
            <p className="text-[10px] text-[#94A3B8]">{b.year} {b.make} {b.model}</p>
          </div>
        </div>
      ),
    },
    { key: 'year', label: 'Year', render: (b: Bike) => <span className="font-bold">{b.year}</span> },
    { key: 'make', label: 'Make', render: (b: Bike) => <span className="uppercase text-[10px]">{b.make}</span> },
    { key: 'status', label: 'Status', render: (b: Bike) => <StatusBadge status={b.status} /> },
    {
      key: 'actions',
      label: '',
      render: (b: Bike) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(b)} className="text-[#94A3B8] hover:text-[#0047AB] transition-colors p-1">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(b.id)} className="text-[#94A3B8] hover:text-red-500 transition-colors p-1">
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
        title="Bikes"
        subtitle={`${bikes.length} machines registered`}
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#070F18] hover:bg-[#0047AB] text-white px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Bike
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
            searchPlaceholder="Search by title, make, or model..."
            emptyMessage="No bikes registered"
          />
        )}
      </div>

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Bike' : 'Register New Bike'}
        onSubmit={handleSubmit}
        submitLabel={editingId ? 'Update Bike' : 'Register Bike'}
        isLoading={saving}
      >
        <FormInput
          label="Machine Title / Nickname"
          required
          placeholder="'KUJANG GOLD'"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: (e.target as HTMLInputElement).value })}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Make"
            required
            placeholder="Honda"
            value={form.make}
            onChange={(e) => setForm({ ...form, make: (e.target as HTMLInputElement).value })}
          />
          <FormInput
            label="Model"
            required
            placeholder="CB550 Four"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: (e.target as HTMLInputElement).value })}
          />
          <FormInput
            label="Year"
            required
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
        <FormSelect
          label="Status"
          options={statusOptions}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: (e.target as HTMLSelectElement).value as Bike['status'] })}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Frame / Chassis"
            placeholder="De-tabbed Raw Steel"
            value={form.frame}
            onChange={(e) => setForm({ ...form, frame: (e.target as HTMLInputElement).value })}
          />
          <FormInput
            label="Exhaust"
            placeholder="4-into-1 Custom Megaphone"
            value={form.exhaust}
            onChange={(e) => setForm({ ...form, exhaust: (e.target as HTMLInputElement).value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Colorway"
            placeholder="Sakala Royal Blue & Gold"
            value={form.colorway}
            onChange={(e) => setForm({ ...form, colorway: (e.target as HTMLInputElement).value })}
          />
          <FormInput
            label="Workshop"
            placeholder="Bengkel Sakala Bandung"
            value={form.workshop}
            onChange={(e) => setForm({ ...form, workshop: (e.target as HTMLInputElement).value })}
          />
        </div>
        <ImageUploader
          label="Bike Image"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          folder="bikes"
        />
      </FormModal>
    </>
  );
}
