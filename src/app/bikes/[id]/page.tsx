import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getBikeById, getBikes } from '@/lib/supabase/data';
import BikeDetailClient from './BikeDetailClient';

export const dynamic = 'force-dynamic';

interface BikeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BikeDetailPage({ params }: BikeDetailPageProps) {
  const { id } = await params;
  const [bike, allBikes] = await Promise.all([
    getBikeById(id),
    getBikes(),
  ]);

  if (!bike) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
      <Navbar />
      <main className="flex-1">
        <BikeDetailClient bike={bike} allBikes={allBikes} />
      </main>
      <Footer />
    </div>
  );
}
