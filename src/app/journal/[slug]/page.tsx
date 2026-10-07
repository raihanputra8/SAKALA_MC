import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getJournalPostBySlug, getJournalPosts } from '@/lib/supabase/data';
import JournalDetailClient from './JournalDetailClient';

interface JournalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function JournalArticlePage({ params }: JournalPageProps) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getJournalPosts();
  const otherPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#070F18]">
      <Navbar />
      <main className="flex-1">
        <JournalDetailClient post={post} otherPosts={otherPosts} />
      </main>
      <Footer />
    </div>
  );
}
