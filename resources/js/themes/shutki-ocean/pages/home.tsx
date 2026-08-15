import { Head, Link } from '@inertiajs/react';
import { Anchor, ArrowRight, Award, CheckCircle2, Flame, ShieldCheck, Sparkles, Star, Truck, Waves } from 'lucide-react';
import { useState } from 'react';

import { BannerCarousel } from '@/components/banner-carousel';
import { YouTubeReelsSection } from '@/components/youtube-reels-section';
import { ShutkiOceanFooter } from '@/themes/shutki-ocean/components/Footer';
import { ShutkiOceanHeader } from '@/themes/shutki-ocean/components/Header';
import { ProductCard } from '@/themes/shutki-ocean/components/ProductCard';

export default function Home({
    homeCategories = [],
    featuredTiles = [],
    banners = [],
    allProducts = [],
}: {
    homeCategories: any[];
    featuredTiles: any[];
    banners?: any[];
    allProducts?: any[];
}) {
    const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');

    const selectedCategory = homeCategories.find((c) => c.slug === activeCategorySlug);
    const displayedProducts =
        activeCategorySlug === 'all'
            ? allProducts
            : selectedCategory
            ? selectedCategory.products || []
            : allProducts;


    return (
        <>
            <Head title="কক্সবাজার প্রিমিয়াম অর্গানিক শুকটি - Shutki Ocean" />
            <main className="min-h-screen bg-[#F4F9FF] font-sans text-slate-800 selection:bg-[#F97316] selection:text-white">
                <ShutkiOceanHeader />

                {/* Hero Section - Light Coastal Gradient */}
                <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3FF] via-[#F4F9FF] to-[#F4F9FF] py-4">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                        <BannerCarousel banners={banners} />
                    </div>
                </section>

                {/* Shutki-Tailored Featured Tiles Section */}
                {featuredTiles.length > 0 && (
                    <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-black text-[#0F52BA]">
                                    <Waves className="h-3.5 w-3.5 text-[#0F52BA] animate-pulse" /> কক্সবাজার উপকূলের তাজা শুকটি
                                </span>
                                <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                                    সেরা জনপ্রিয় শুকটি মাছের কালেকশন
                                </h2>
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                    সরাসরি বঙ্গোপসাগরের মহেশখালী ও সোনাদিয়া দ্বীপের রোদে শুকানো শতভাগ প্রাকৃতিক শুকটি
                                </p>
                            </div>
                        </div>

                        {/* Shutki Featured Cards */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {featuredTiles.map((tile, index) => (
                                <Link
                                    key={tile.id}
                                    href={tile.link || route('home')}
                                    className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-2 transition-transform duration-500"
                                >
                                    <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
                                        <img
                                            src={tile.image}
                                            alt={tile.title || 'শুকটি মাছ'}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />


                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Categories & Filter Tabs Section */}
                <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-[#0F52BA]">
                                <Sparkles className="h-3.5 w-3.5" /> ১০০% অর্গানিক তাজা কালেকশন
                            </div>
                            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                                কক্সবাজারের সেরা প্রিমিয়াম শুকটি মাছ
                            </h2>
                        </div>

                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-black text-[#0F52BA] shadow-sm transition-colors hover:bg-blue-50"
                        >
                            সব শুকটি দেখুন <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>



                    {/* Products Grid */}
                    {displayedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {displayedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-blue-100 bg-white py-16 text-center text-slate-500 shadow-sm">
                            কোনো শুকটি মাছ পাওয়া যায়নি
                        </div>
                    )}
                </section>

                {/* Video Reels Section (if available) */}
                {homeCategories.some((cat) => cat.video_reels && cat.video_reels.length > 0) && (
                    <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
                                    <Flame className="h-5 w-5 text-[#F97316]" /> কাস্টমার রিভিউ ও ভিডিও ভিডিও রিলস
                                </h3>
                            </div>
                            {homeCategories.map(
                                (cat) =>
                                    cat.video_reels &&
                                    cat.video_reels.length > 0 && <YouTubeReelsSection key={cat.id} reels={cat.video_reels} />,
                            )}
                        </div>
                    </section>
                )}

                {/* Why Choose Us Feature Grid - Light Coastal Theme */}
                <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/50 to-white p-8 shadow-sm">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F52BA] text-white shadow-md shadow-blue-500/20">
                                <Anchor className="h-7 w-7" />
                            </div>
                            <h2 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
                                কেন কক্সবাজারের শুটকি কিনবেন?
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                আমরা সরাসরি বঙ্গোপসাগরের মহেশখালী ও সোনাদিয়া দ্বীপের জেলেদের কাছ থেকে সংগৃহীত সেরা মাছ প্রাকৃতিকভাবে শুকিয়ে আপনার ঘরে পৌঁছে দিই।
                            </p>
                        </div>

                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                                <CheckCircle2 className="h-8 w-8 text-[#0F52BA]" />
                                <h3 className="mt-3 text-lg font-black text-slate-900">১০০% কেমিক্যাল ও বিষমুক্ত</h3>
                                <p className="mt-1.5 text-xs leading-6 text-slate-600">
                                    কোনো ধরনের বিষাক্ত ওষুধ, ডিডিটি বা প্রিজারভেটিভ ব্যবহার করা হয় না। লবণ ও সোনাদিয়ার বিশুদ্ধ বাতাসেই তৈরি।
                                </p>
                            </div>

                            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                                <Award className="h-8 w-8 text-[#0F52BA]" />
                                <h3 className="mt-3 text-lg font-black text-slate-900">অরিজিনাল সাইজ ও প্রিমিয়াম গ্রেড</h3>
                                <p className="mt-1.5 text-xs leading-6 text-slate-600">
                                    প্রতিটি শুকটি মাছ নিখুঁতভাবে বাছাইকৃত। কোনো পচা, ভাঙা বা গুঁড়ো মাছের ভেজাল দেওয়া হয় না।
                                </p>
                            </div>

                            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                                <Truck className="h-8 w-8 text-[#0F52BA]" />
                                <h3 className="mt-3 text-lg font-black text-slate-900">ভ্যাকুয়াম সিল্ড এয়ার-টাইট প্যাকিং</h3>
                                <p className="mt-1.5 text-xs font-bold leading-6 text-[#F97316]">
                                    কোনো গন্ধ বাইরে আসবে না! আন্তর্জাতিক মানের ফয়েল প্যাকের কারণে দীর্ঘদিন অক্ষত থাকে।
                                </p>
                            </div>
                        </div>

                        {/* CTA button */}
                        <div className="mt-8 text-center">
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105"
                            >
                                এখনই অর্ডার করুন <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <ShutkiOceanFooter />
            </main>
        </>
    );
}
