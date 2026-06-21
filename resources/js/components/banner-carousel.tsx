import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface BannerSlide {
    id: number;
    title: string | null;
    image_url: string;
    link: string | null;
}

interface BannerCarouselProps {
    banners: BannerSlide[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const count = banners.length;

    useEffect(() => {
        if (count <= 1) return;
        const interval = window.setInterval(() => {
            setActiveIndex((i) => (i + 1) % count);
        }, 6000);
        return () => window.clearInterval(interval);
    }, [count]);

    const goToPrev = () => setActiveIndex((i) => (i - 1 + count) % count);
    const goToNext = () => setActiveIndex((i) => (i + 1) % count);

    /* ── Empty state ── */
    if (count === 0) {
        return (
            <section className="px-3 py-6 sm:px-4 sm:py-8 lg:py-10">
                <div className="mx-auto max-w-[1440px]">
                    <div className="flex aspect-[16/7] min-h-[240px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 sm:aspect-[21/8] lg:aspect-[23/7]">
                        <div className="text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-slate-300" />
                            <p className="mt-3 text-sm font-bold text-slate-400">কোনো ব্যানার নেই</p>
                            <p className="mt-1 text-xs text-slate-400">Admin panel থেকে banner যোগ করুন</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f3f4f6] px-3 py-6 sm:px-4 sm:py-8 lg:py-10">
            <div className="mx-auto max-w-[1440px]">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
                    <div className="relative aspect-[16/7] min-h-[240px] w-full sm:aspect-[21/8] lg:aspect-[23/7]">
                        {banners.map((slide, index) => {
                            const inner = (
                                <img
                                    src={slide.image_url}
                                    alt={slide.title ?? `Banner ${index + 1}`}
                                    className="h-full w-full object-cover"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            );

                            const cls = `absolute inset-0 h-full w-full transition-opacity duration-700 ${
                                index === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
                            }`;

                            return slide.link ? (
                                <Link key={slide.id} href={slide.link} className={cls}>
                                    {inner}
                                </Link>
                            ) : (
                                <div key={slide.id} className={cls}>
                                    {inner}
                                </div>
                            );
                        })}
                    </div>

                    {/* Prev button */}
                    {count > 1 && (
                        <button
                            type="button"
                            onClick={goToPrev}
                            className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition hover:bg-white"
                            aria-label="Previous banner"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}

                    {/* Next button */}
                    {count > 1 && (
                        <button
                            type="button"
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition hover:bg-white"
                            aria-label="Next banner"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    )}

                    {/* Dots */}
                    {count > 1 && (
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-2.5 rounded-full transition-all ${
                                        index === activeIndex ? 'w-8 bg-slate-950' : 'w-2.5 bg-white/80'
                                    }`}
                                    aria-label={`Go to banner ${index + 1}`}
                                    aria-current={index === activeIndex ? 'true' : undefined}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
