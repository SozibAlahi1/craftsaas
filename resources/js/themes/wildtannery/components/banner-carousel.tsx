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
            <section className="bg-[#0B0E14] px-0 lg:px-8 py-0 lg:py-6">
                <div className="mx-auto max-w-[1440px]">
                    <div className="flex aspect-[16/7] min-h-[300px] items-center justify-center rounded-none lg:rounded-2xl border border-slate-800 bg-[#131826] sm:aspect-[21/8] lg:aspect-[23/7]">
                        <div className="text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-slate-700" />
                            <p className="mt-3 text-sm font-bold text-slate-500">No banners found</p>
                            <p className="mt-1 text-xs text-slate-600">Please add a banner from the admin panel.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#0B0E14]">
            <div className="w-full relative group">
                <div className="relative w-full overflow-hidden" style={{ height: '70vh', minHeight: '500px' }}>
                    {banners.map((slide, index) => {
                        const inner = (
                            <>
                                <img
                                    src={slide.image_url}
                                    alt={slide.title ?? `Banner ${index + 1}`}
                                    className={`h-full w-full object-cover transition-transform duration-[10000ms] ease-linear ${
                                        index === activeIndex ? 'scale-[1.03]' : 'scale-100'
                                    }`}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                                {/* Dark overlay blending to background at bottom */}
                                <div className="absolute inset-0 bg-black/40"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0B0E14] to-transparent"></div>
                                
                                {slide.title && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl max-w-4xl tracking-tight leading-tight">
                                            {slide.title}
                                        </h2>
                                    </div>
                                )}
                            </>
                        );

                        const cls = `absolute inset-0 h-full w-full transition-opacity duration-1000 ${
                            index === activeIndex ? 'opacity-100 z-10' : 'pointer-events-none opacity-0 z-0'
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
                        className="absolute left-6 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#131826]/80 text-white backdrop-blur shadow-xl transition-all opacity-0 group-hover:opacity-100 hover:bg-blue-600 hover:scale-105 border border-slate-700 hover:border-blue-500"
                        aria-label="Previous banner"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                {/* Next button */}
                {count > 1 && (
                    <button
                        type="button"
                        onClick={goToNext}
                        className="absolute right-6 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#131826]/80 text-white backdrop-blur shadow-xl transition-all opacity-0 group-hover:opacity-100 hover:bg-blue-600 hover:scale-105 border border-slate-700 hover:border-blue-500"
                        aria-label="Next banner"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}

                {/* Dots */}
                {count > 1 && (
                    <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    index === activeIndex ? 'w-10 bg-blue-500' : 'w-2.5 bg-white/40 hover:bg-white/80'
                                }`}
                                aria-label={`Go to banner ${index + 1}`}
                                aria-current={index === activeIndex ? 'true' : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
