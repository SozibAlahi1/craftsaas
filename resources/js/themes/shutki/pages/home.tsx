import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Leaf, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

import { BannerCarousel } from '@/components/banner-carousel';
import { CategoryProductSection } from '@/components/category-product-section';
import { YouTubeReelsSection } from '@/components/youtube-reels-section';
import { StorefrontHeader } from '@/components/storefront-header';
import { ShutkirFooter } from '@/themes/shutki/components/Footer';

/* LIGHT Organic Palette */
const P = {
    sage:       'hsl(89,32%,54%)',
    sageDark:   'hsl(89,35%,42%)',
    sageLight:  'hsl(89,28%,88%)',
    sageBg:     'hsl(89,22%,95%)',
    sageXLight: 'hsl(89,25%,97%)',
    honey:      'hsl(38,72%,52%)',
    honeyLight: 'hsl(38,70%,92%)',
    terra:      'hsl(18,55%,52%)',
    cream:      'hsl(48,40%,97%)',
    white:      '#ffffff',
    border:     'hsl(89,20%,86%)',
    earth:      'hsl(35,28%,18%)',
    earthMid:   'hsl(35,22%,36%)',
    earthLight: 'hsl(35,18%,52%)',
} as const;

export default function Home({ homeCategories, featuredTiles, banners = [] }: { homeCategories: any[]; featuredTiles: any[]; banners?: any[] }) {
    return (
        <>
            <Head title="হোম — শুকটি বাজার" />
            <main style={{ background: P.cream, color: P.earth }}>
                <StorefrontHeader />

                {/* Hero banner */}
                <BannerCarousel banners={banners} />

                {/* USP strip removed */}

                {/* Featured tiles — white cards on light sage bg */}
                {featuredTiles.length > 0 && (
                    <section className="px-4 py-8 sm:px-6 lg:px-8" style={{ background: P.sageXLight }}>
                        <div className="mx-auto max-w-[1440px]">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                                {featuredTiles.map((tile) => (
                                    <Link key={tile.id} href={tile.link || route('home')}
                                        className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                        <div className="relative aspect-square overflow-hidden">
                                            <img src={tile.image} alt={tile.title || ''} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Category sections — white cards on cream bg */}
                <section className="px-4 py-4 sm:px-6 lg:px-8" style={{ background: P.cream }}>
                    <div className="mx-auto max-w-[1440px] space-y-4">
                        {homeCategories.map((category) => (
                            <div key={category.id} className="overflow-hidden rounded-2xl bg-white shadow-sm"
                                style={{ border: `2px solid ${P.border}` }}>
                                {/* Category header */}
                                <div className="flex items-center justify-between px-5 py-4"
                                    style={{ background: P.sageBg, borderBottom: `2px solid ${P.sage}` }}>
                                    <h2 className="text-lg font-black" style={{ color: P.sageDark, fontFamily: "'Lora', serif" }}>
                                        {category.name}
                                    </h2>
                                    <Link href={route('products.index', { category: category.name })}
                                        className="flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black transition-all hover:text-white hover:shadow-sm"
                                        style={{ borderColor: P.sage, color: P.sage }}
                                        onMouseEnter={e => { e.currentTarget.style.background = P.sage; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = P.sage; }}>
                                        সব দেখুন <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                                <div className="p-4">
                                    <CategoryProductSection category={category} />
                                    {category.video_reels && category.video_reels.length > 0 && (
                                        <YouTubeReelsSection reels={category.video_reels} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA — sage green section (not dark!) */}
                <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: P.sageBg, borderTop: `2px solid ${P.border}` }}>
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full shadow-md" style={{ background: P.sage }}>
                                <Leaf className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black sm:text-3xl" style={{ color: P.sageDark, fontFamily: "'Lora', serif" }}>
                            প্রকৃতির সেরা শুকটি, সরাসরি আপনার দরজায়!
                        </h2>
                        <p className="mt-3 text-sm leading-7" style={{ color: P.earthMid }}>
                            ১০০% অর্গানিক, ভেজালমুক্ত শুকটি মাছ। কোনো রাসায়নিক নেই, কোনো কৃত্রিম রং নেই।
                        </p>
                        <Link href={route('products.index')}
                            className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-black text-white shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5"
                            style={{ background: P.sage }}>
                            এখনই অর্ডার করুন <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>

                <ShutkirFooter />
            </main>
        </>
    );
}
