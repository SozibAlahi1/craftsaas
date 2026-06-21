import { Link } from '@inertiajs/react';

export function Hero({ banners }: { banners: any[] }) {
    // Use the first banner or fallback to our generated leather hero image
    const heroImage = banners?.length > 0 && banners[0].image_url 
        ? banners[0].image_url 
        : '/images/leather_hero.png';

    return (
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${heroImage}')` }}
            >
                <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <p className="text-[#cba876] text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
                    Premium Leather Goods
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif-display font-bold text-white mb-6 leading-tight">
                    Where Craft Meets <br className="hidden md:block" />
                    <span className="text-[#cba876] italic font-serif">Innovation</span>
                </h1>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
                    Elevate your everyday carry with our meticulously crafted leather wallets and accessories. Designed for the modern gentleman.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        href="/products" 
                        className="bg-[#cba876] text-black px-8 py-4 rounded font-medium tracking-wider uppercase text-sm hover:bg-white transition-colors w-full sm:w-auto"
                    >
                        Shop Collection
                    </Link>
                    <Link 
                        href="#categories" 
                        className="border border-[#cba876] text-[#cba876] px-8 py-4 rounded font-medium tracking-wider uppercase text-sm hover:bg-[#cba876] hover:text-black transition-colors w-full sm:w-auto"
                    >
                        Explore Series
                    </Link>
                </div>
            </div>
        </section>
    );
}
