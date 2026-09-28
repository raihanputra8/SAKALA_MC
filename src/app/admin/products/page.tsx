'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import FormModal, { FormInput, FormTextarea, FormSelect } from '@/components/admin/FormModal';
import ImageUploader from '@/components/admin/ImageUploader';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '@/lib/supabase/admin';
import { Product } from '@/types/database';

const categoryOptions = [
  { value: 't-shirts', label: 'T-Shirts' },
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'jackets', label: 'Jackets' },
  { value: 'headwear', label: 'Headwear' },
  { value: 'accessories', label: 'Accessories' },
];

const stockOptions = [
  { value: 'available', label: 'Available' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'waitlist', label: 'Waitlist' },
  { value: 'sold_out', label: 'Sold Out' },
];

const emptyForm = {
  sku: '',
  name: '',
  category: 't-shirts' as Product['category'],
  price_idr: 0,
  price_usd: 0,
  stock_status: 'available' as Product['stock_status'],
  stock_count: 0,
  description: '',
  image_url: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category === 'all' ? 't-shirts' : product.category,
      price_idr: product.price_idr,
      price_usd: product.price_usd,
      stock_status: product.stock_status,
      stock_count: product.stock_count || 0,
      description: product.description,
      image_url: product.image_url,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          {p.image_url && (
            <div className="w-10 h-10 rounded-md overflow-hidden bg-[#FAF9F5] border border-[#E5E2D9] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="font-bold text-[#070F18] text-xs">{p.name}</p>
            <p className="text-[10px] text-[#94A3B8]">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (p: Product) => <span className="uppercase text-[10px]">{p.category}</span> },
    { key: 'price_idr', label: 'Price (IDR)', render: (p: Product) => <span className="font-bold">IDR {p.price_idr.toLocaleString('id-ID')}</span> },
    { key: 'stock_count', label: 'Stock', render: (p: Product) => <span>{p.stock_count || 0}</span> },
    { key: 'stock_status', label: 'Status', render: (p: Product) => <StatusBadge status={p.stock_status} /> },
    {
      key: 'actions',
      label: '',
      render: (p: Product) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(p)} className="text-[#94A3B8] hover:text-[#0047AB] transition-colors p-1" title="Edit">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(p.id)} className="text-[#94A3B8] hover:text-red-500 transition-colors p-1" title="Delete">
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
        title="Products"
        subtitle={`${products.length} items in catalog`}
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#070F18] hover:bg-[#0047AB] text-white px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
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
            searchPlaceholder="Search products by name, SKU, or category..."
            emptyMessage="No products found"
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Product' : 'Add New Product'}
        onSubmit={handleSubmit}
        submitLabel={editingId ? 'Update Product' : 'Create Product'}
        isLoading={saving}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="SKU"
            required
            placeholder="SKL-TEE-05"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: (e.target as HTMLInputElement).value })}
          />
          <FormSelect
            label="Category"
            required
            options={categoryOptions}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: (e.target as HTMLSelectElement).value as Product['category'] })}
          />
        </div>
        <FormInput
          label="Product Name"
          required
          placeholder="CIRCLE EMBLEM HEAVYWEIGHT TEE"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })}
        />
        <FormTextarea
          label="Description"
          placeholder="Product description..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: (e.target as HTMLTextAreaElement).value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Price (IDR)"
            required
            type="number"
            value={form.price_idr}
            onChange={(e) => setForm({ ...form, price_idr: Number((e.target as HTMLInputElement).value) })}
          />
          <FormInput
            label="Price (USD)"
            required
            type="number"
            value={form.price_usd}
            onChange={(e) => setForm({ ...form, price_usd: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Stock Status"
            options={stockOptions}
            value={form.stock_status}
            onChange={(e) => setForm({ ...form, stock_status: (e.target as HTMLSelectElement).value as Product['stock_status'] })}
          />
          <FormInput
            label="Stock Count"
            type="number"
            value={form.stock_count}
            onChange={(e) => setForm({ ...form, stock_count: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
        <ImageUploader
          label="Product Image"
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          folder="products"
        />
      </FormModal>
    </>
  );
}
