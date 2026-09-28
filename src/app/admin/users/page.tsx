'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAllProfiles, updateUserRole } from '@/lib/supabase/admin';
import { Profile } from '@/types/database';

const roleOptions: Profile['role'][] = ['member', 'artisan', 'founder', 'admin'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadUsers() {
    try {
      const data = await getAllProfiles();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleRoleChange(userId: string, newRole: Profile['role']) {
    if (newRole === 'admin' && !confirm('Grant admin access to this user?')) return;
    try {
      await updateUserRole(userId, newRole);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to update user role');
    }
  }

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'full_name',
      label: 'Member',
      render: (u: Profile) => (
        <div className="flex items-center gap-3">
          {u.avatar_url ? (
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FAF9F5] border border-[#E5E2D9] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.avatar_url} alt={u.full_name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#070F18] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {u.full_name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <p className="font-bold text-[#070F18] text-xs">{u.full_name}</p>
            <p className="text-[10px] text-[#94A3B8]">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'id',
      label: 'User ID',
      render: (u: Profile) => (
        <span className="text-[10px] text-[#94A3B8] font-mono">
          {u.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (u: Profile) => (
        <span className="text-[11px] text-[#64748B]">
          {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (u: Profile) => (
        <select
          value={u.role}
          onChange={(e) => handleRoleChange(u.id, e.target.value as Profile['role'])}
          className="bg-transparent border border-[#E5E2D9] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm outline-none focus:border-[#070F18] cursor-pointer"
        >
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {r.toUpperCase()}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Users"
        subtitle={`${users.length} registered members`}
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
            searchPlaceholder="Search by name, email, or role..."
            emptyMessage="No users found"
          />
        )}
      </div>
    </>
  );
}
