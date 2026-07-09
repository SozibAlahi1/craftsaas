import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function Hero({ banners }: { banners: any[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fallback default banners if none are provided, resolved dynamically using image_path
    const slides =
        banners && banners.length > 0
            ? banners.map((b: any) => ({
                  id: b.id,
                  image_url: b.image_path.startsWith('http') ? b.image_path : `/storage/${b.image_path}`,
                  title: b.title,
                  link: b.link,
              }))
            : [
                  {
                      id: 1,
                      image_url: 'https://saifexbd.com/wp-content/uploads/2025/11/aqsmyqjjxzu1jjoywaha.webp',
                      title: 'Crafted to Carry Confidence',
                      description: 'Experience premium lifestyle and fashion accessories crafted with perfection.',
                  },
                  {
                      id: 2,
                      image_url: 'https://saifexbd.com/wp-content/uploads/2025/11/v7hnaqb5kfumsublvax2.webp',
                      title: 'Genuine Leather Collection',
                      description: 'Meticulously designed for your everyday carry needs.',
                  },
                  {
                      id: 3,
                      image_url: 'https://saifexbd.com/wp-content/uploads/2025/11/wssijuhmii6up9tg1uee.webp',
                      title: 'Elevate Your Style',
                      description: 'Discover the latest shoes, bags, and luxury accessories.',
                  },
              ];

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Auto-slide every 5 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section className="relative aspect-[21/9] min-h-[350px] w-full overflow-hidden bg-black select-none md:h-[65vh] lg:aspect-[24/9]">
            {/* Slides Wrapper */}
            <div className="relative h-full w-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id || index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'z-10 opacity-100' : 'z-0 opacity-0'
                        }`}
                    >
                        {/* Slide Image */}
                        {slide.link ? (
                            <Link href={slide.link} className="block h-full w-full">
                                <img src={slide.image_url} alt={slide.title || 'Slide Image'} className="h-full w-full object-cover object-center" />
                            </Link>
                        ) : (
                            <img src={slide.image_url} alt={slide.title || 'Slide Image'} className="h-full w-full object-cover object-center" />
                        )}
                    </div>
                ))}
            </div>

            {/* Carousel Dot Indicators (Woodmart style: simple round dots) */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center space-x-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                                idx === currentSlide ? 'w-6 bg-[#cba876]' : 'bg-white/40 hover:bg-white/70'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
