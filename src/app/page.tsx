import React from 'react';
import Navbar from '@/components/layout/Navbar';
import PillarsGatewaySection from '@/components/home/PillarsGatewaySection';
import HeroSection from '@/components/home/HeroSection';
import GarageSection from '@/components/home/GarageSection';
import SupplySection from '@/components/home/SupplySection';
import CultureSection from '@/components/home/CultureSection';
import JournalSection from '@/components/home/JournalSection';
import Footer from '@/components/layout/Footer';
import { getBikes, getProducts, getJournalPosts } from '@/lib/supabase/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [bikes, products, journalPosts] = await Promise.all([
    getBikes(),
    getProducts('all'),
    getJournalPosts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <PillarsGatewaySection />
        <HeroSection />
        <GarageSection bikes={bikes} />
        <SupplySection initialProducts={products} />
        <JournalSection posts={journalPosts} />
        <CultureSection />
      </main>
      <Footer />
    </div>
  );
}
