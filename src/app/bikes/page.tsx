import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getBikes } from '@/lib/supabase/data';
import BikesArchiveClient from './BikesArchiveClient';

export const dynamic = 'force-dynamic';

export default async function BikesPage() {
  const bikes = await getBikes();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
      <Navbar />
      <main className="flex-1">
        <BikesArchiveClient initialBikes={bikes} />
      </main>
      <Footer />
    </div>
  );
}
